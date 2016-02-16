/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.cache.CacheActionType;
import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.net.ServerSocketFactory;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class TCPCacheTransport {

    public static ConcurrentLinkedQueue<RemoteCachePacket> cacheDispatchQueue = new ConcurrentLinkedQueue();
    static List<CacheStreamHandler> cacheStreamHandlers = new ArrayList();
    static int ACCEPT_MODE = 10;
    static int CONNECT_MODE = 20;
    static ScheduledExecutorService execSend;
    static TCPCacheTransport tCPCacheTransport;
    final static Object lock = new Object();
    static private boolean started;
    private static ServerAppClassLoader appClassLoader;

    static ServerAppClassLoader delegatedClassLoader() {
        return appClassLoader;
    }
    private final ScheduledExecutorService execRecv;

    private TCPCacheTransport() {
        //Since the  cache stream handlers use blocking IO when sending and receiving, we need sufficient thread to avoid starving.
        int cache_servers_count = ServerConfig.remoteCacheAddresses.length;
        int threadPoolSize = Math.min(cache_servers_count * 2, ServerConfig.getMaxCacheHandlerThreads());
        if (threadPoolSize < 2) {
            threadPoolSize = 2;
        }

        /*To avoid starvation, more threads should be used by the handlers for read operations than
         *for write operations since read operation blocks when no data is available unlike write
         *operations which are only performed when we have data to send and so does not suffer from
         *severe blocking. Although we shall enable read timeout, for smooth flow, allocating more 
         *thread for read operations is very necessary. 
         * 
         * 
         */
        float ratio = 0.2f;//ratio of number of thread used for write operation to the total threads - SHOULD BE LESS THAN 0.5
        float w_n = threadPoolSize * ratio;//number of threads for write operations - use less threads
        float r_n = threadPoolSize * (1 - ratio);//number of threads for read operations - use more threads

        if ((int) w_n <= 0) {
            w_n = 1;
        }

        if ((int) r_n <= 0) {
            r_n = 1;
        }

        if (r_n > cache_servers_count) {
            r_n = cache_servers_count;
        }

        if (w_n > cache_servers_count) {
            w_n = cache_servers_count;
        }

        if ((int) (r_n + w_n) < threadPoolSize) {
            if (w_n < r_n) {
                w_n+=(int) (r_n - w_n);
            }
            if (r_n < w_n) {
                r_n+=(int) (w_n - r_n);
            }
        }

        execSend = Executors.newScheduledThreadPool((int) w_n);//create executors for write operations
        execRecv = Executors.newScheduledThreadPool((int) r_n);//create executors for read operations
    }

    public static TCPCacheTransport getInstance() {
        if (tCPCacheTransport != null) {
            return tCPCacheTransport;
        }
        synchronized (lock) {
            if (tCPCacheTransport == null) {
                appClassLoader = new ServerAppClassLoader(TCPCacheTransport.class.getClassLoader());
                tCPCacheTransport = new TCPCacheTransport();
            }
        }

        return tCPCacheTransport;
    }

    static ScheduledExecutorService getExecutor() {
        return execSend;
    }

    /**
     * Call this method to enqueue the remote cache to be sent to the remote
     * location.
     *
     * @param key
     * @param value
     * @param entry_type
     */
    public static void enqueueCache(Object key, Object value, CacheActionType entry_type) {
        RemoteCachePacket rmtEntry = new RemoteCachePacket(key, value,
                SimpleHttpServer.getStrCacheSockAddr(), entry_type);
        cacheDispatchQueue.add(rmtEntry);
    }

    public void start() throws UnknownHostException {
        if (started) {
            return;
        }

        synchronized (lock) {
            if (started) {
                return;
            }

            boolean needCacheServer = false;
            String[] ips_and_ports = toRemoteCacheIpsAndPorts();

            for (String remoteAddr : ips_and_ports) {
                //compare for which initiates connection or accepts connection                
                if (canInitiateConnection(remoteAddr)) {
                    //comparison greater than zero implies 'initiates connection'
                    //run as client
                    String[] addr_split = remoteAddr.split(":");
                    String remoteHost = addr_split[0];
                    int remotePort = Integer.parseInt(addr_split[1]);
                    CacheStreamHandler cacheStreamHandler = new CacheStreamHandler(remoteHost, remotePort);//create in client mode
                    cacheStreamHandlers.add(cacheStreamHandler);
                    execSend.scheduleWithFixedDelay(cacheStreamHandler, 0, 1, TimeUnit.MILLISECONDS);
                    execRecv.scheduleWithFixedDelay(cacheStreamHandler.getReceiveHandler(), 0, 1, TimeUnit.MILLISECONDS);
                } else if (canAcceptConnection(remoteAddr)) {
                    //comparison less than zero implies 'accepts connection'
                    needCacheServer = true;
                }
            }

            if (needCacheServer) {
                new Thread(new TCPCacheServer()).start();
            }

            started = true;
        }
    }

    private String[] toRemoteCacheIpsAndPorts() throws UnknownHostException {
        String[] ips_and_ports = new String[ServerConfig.remoteCacheAddresses.length];
        for (int i = 0; i < ServerConfig.remoteCacheAddresses.length; i++) {
            String[] addr_split = ServerConfig.remoteCacheAddresses[i].split(":");
            ips_and_ports[i] = InetAddress.getByName(addr_split[0]).getHostAddress() + ":" + addr_split[1];
        }
        return ips_and_ports;
    }

    private boolean canInitiateConnection(String addr) {
        return SimpleHttpServer.getStrCacheSockAddr().compareToIgnoreCase(addr) > 0;
    }

    private boolean canAcceptConnection(String addr) {
        return SimpleHttpServer.getStrCacheSockAddr().compareToIgnoreCase(addr) < 0;
    }

    public void stop() {
        execSend.shutdownNow();
    }

    public static int totalCacheStreamHandlers() {
        return cacheStreamHandlers.size();
    }

    private class TCPCacheServer implements Runnable {

        private TCPCacheServer() {
        }

        @Override
        public void run() {
            try {
                ServerSocketFactory factory = ServerSocketFactory.getDefault();
                ServerSocket server_sock = factory.createServerSocket();
                server_sock.bind(SimpleHttpServer.getCacheSockAddress());
                while (!SimpleHttpServer.isStop()) {
                    try {
                        Socket sock = server_sock.accept();
                        if (!checkAuthoroziedConnection(sock.getInetAddress())) {
                            sock.close();//access denied
                            continue;
                        }
                        
                        Logger.getLogger(TCPCacheServer.class.getName()).log(Level.INFO, "Accepted connection from remote cache host - {0}", new Object[]{sock});
                        
                        String name = sock.getInetAddress().getHostAddress() + ":" + SimpleHttpServer.getCachePort();
                        CacheStreamHandler ch = getUsedHandler(name);
                        if (ch != null) {
                            ch.initSocket(sock);
                        } else {
                            ch = new CacheStreamHandler(sock);
                            ch.setName(name);
                            cacheStreamHandlers.add(ch);
                            execSend.scheduleWithFixedDelay(ch, 0, 1, TimeUnit.MILLISECONDS);
                            execRecv.scheduleWithFixedDelay(ch.getReceiveHandler(), 0, 1, TimeUnit.MILLISECONDS);
                        }
                    } catch (IOException ex) {
                        Logger.getLogger(TCPCacheTransport.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            } catch (IOException ex) {
                Logger.getLogger(TCPCacheTransport.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        CacheStreamHandler getUsedHandler(String name) {
            for (CacheStreamHandler ch : cacheStreamHandlers) {
                if (ch.isClosed()
                        && ch.isAcceptMode()
                        && name.equals(ch.getName())) {
                    return ch;
                }
            }

            return null;
        }

        private boolean checkAuthoroziedConnection(InetAddress remoteInetAddr) throws UnknownHostException {
            //find the address in the list
            String[] ips_and_ports = toRemoteCacheIpsAndPorts();
            for (String remoteCacheAddress : ips_and_ports) {
                try {
                    String addr = remoteCacheAddress.substring(0, remoteCacheAddress.indexOf(':'));
                    InetAddress inet_addr = InetAddress.getByName(addr);
                    if (inet_addr.equals(remoteInetAddr)) { //found
                        //compare for which initiates connection or accepts connection.
                        //comparison less than zero is what we want - which implies 'accepts connection'
                        String remote_addr = remoteInetAddr.getHostAddress() + ":" + SimpleHttpServer.getCachePort();
                        return !canInitiateConnection(remote_addr);
                    }
                } catch (UnknownHostException ex) {
                    Logger.getLogger(TCPCacheTransport.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            return false;
        }

    }
}

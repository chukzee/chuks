/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import static chuks.server.http.impl.TCPCacheTransport.*;
import chuks.server.util.ThreadUtil;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.Iterator;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final class CacheStreamHandler implements Runnable {

    private Socket sock;
    private RemoteCachePacket lastFailedCachePacket;
    private int sentAttempts;
    private String remoteHost;
    private int remotePort;
    final private int mode;
    private String name;
    final private RecvHandler recvHandler = new RecvHandler();
    ExtendedObjectInputStream objStreamIn;
    ObjectOutputStream objStreamOut;
    AtomicBoolean needObjStreamInit = new AtomicBoolean(true);//atomically flag initialization of object output stream
    private boolean recoveryMode;
    private int nextConnTry;
    private boolean descendConnTry;

    CacheStreamHandler(String host, int port) {
        this.mode = CONNECT_MODE;
        this.remoteHost = host;
        this.remotePort = port;
    }

    CacheStreamHandler(Socket sock) {
        this.mode = ACCEPT_MODE;
        initSocket(sock);
    }

    void setName(String name) {
        this.name = name;
    }

    String getName() {
        return name;
    }

    RecvHandler getReceiveHandler() {
        return recvHandler;
    }

    @Override
    public void run() {

        try {

            if (!checkConnect()) {
                recoveryMode = true;
                return;
            }

            //at this point there is connection
            recoveryMode = false;

            if (lastFailedCachePacket != null) {
                sendCache(lastFailedCachePacket);
                return;
            }
            RemoteCachePacket remoteCachePacket = cacheDispatchQueue.peek();//get only
            if (remoteCachePacket == null) {
                return;
            }
            if (!remoteCachePacket.isConsumedBy(name)) {
                sendCache(remoteCachePacket);
            } else {
                Iterator<RemoteCachePacket> i = cacheDispatchQueue.iterator();//safe - since iterators of ConcurrentLinkedQueue DO NOT throw ConcurrentModificationException - see java doc
                while (i.hasNext()) {
                    remoteCachePacket = i.next();
                    if (!remoteCachePacket.isConsumedBy(name)) {
                        sendCache(remoteCachePacket);
                        break;
                    }
                }
            }

        } catch (NullPointerException ex) {
            Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            closeSocket();
            if (isConnectionRefused(ex)) {
                PrintOnce.err("key1", "Could not connect to remote cache host - " + remoteHost + ":" + remotePort);
                PrintOnce.err("key2", "Connection attempts will continue...");
            } else {
                Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
            }
        } catch (Exception ex) {
            Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    synchronized private void closeSocket() {

        try {
            if (objStreamIn != null) {
                objStreamIn.close();
            }
        } catch (IOException ex1) {
            Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex1);
        }
        try {
            if (objStreamOut != null) {
                objStreamOut.close();
            }
        } catch (IOException ex1) {
            Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex1);
        }
        try {
            if (sock != null) {
                sock.close();
            }
        } catch (IOException ex1) {
            Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex1);
        }

    }

    private void handleSendFailure(RemoteCachePacket remoteCachePacket) {

        if (sentAttempts < ServerConfig.getMaxCacheSendTrails()) {
            //sleep a little before next attempt           
            ThreadUtil.sleep(1000);
        } else {
            cacheDispatchQueue.remove(remoteCachePacket);//no more attempts allowed            
        }

    }

    private void sendCache(RemoteCachePacket remoteCachePacket) {

        try {

            sentAttempts++;
            remoteCachePacket.updateCacheExpiry();//update the cache expiry before sending - this will consider delay in sending
            objStreamOut.writeObject(remoteCachePacket);
            objStreamOut.flush();
            lastFailedCachePacket = null;
            remoteCachePacket.registerConsumer(name);
            if (remoteCachePacket.totalConsumers() >= TCPCacheTransport.totalCacheStreamHandlers()) {
                cacheDispatchQueue.remove(remoteCachePacket);
            }

        } catch (IOException ex) {
            lastFailedCachePacket = remoteCachePacket;
            if (sock.isClosed() || !sock.isConnected() || sock.isOutputShutdown()) {
                closeSocket();//ensure close
                return;
            }
            handleSendFailure(remoteCachePacket);
            Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private boolean connecToRemoteServer() {

        if (sock == null || sock.isClosed()) {
            sock = new Socket();
        }

        if (!sock.isConnected()) {
            try {
                sock.connect(new InetSocketAddress(remoteHost, remotePort), ServerConfig.DEFAULT_SOCK_TIMEOUT);
                sock.setSoTimeout(ServerConfig.DEFAULT_SOCK_TIMEOUT);
                objStreamOut = new ObjectOutputStream(sock.getOutputStream());
                needObjStreamInit.getAndSet(true);//atomically flag initialization of object output stream
                 
                nextConnTry = 0;//initialize
                descendConnTry=false;//initialize
                
                Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.INFO, "Connected to remote cache host - {0}:{1}", new Object[]{remoteHost, remotePort});

                return true;
            } catch (IOException ex) {
                //Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
                closeSocket();
                System.err.println(ex.getMessage());
            }
        }
        return sock.isConnected();
    }

    private boolean checkConnect() throws IOException {
        if (mode == TCPCacheTransport.CONNECT_MODE) {
            if (recoveryMode) {
                waitForNextConnectionTime();
            }

            return connecToRemoteServer();
            //return false;//TESTING!!!
        } else {
            return !sock.isClosed();
        }
    }

    boolean isClosed() {
        return sock == null || sock.isClosed();
    }

    boolean isAcceptMode() {
        return mode == ACCEPT_MODE;
    }

    boolean isConnectMode() {
        return mode == CONNECT_MODE;
    }

    void initSocket(Socket sock) {
        try {
            this.sock = sock;
            objStreamOut = new ObjectOutputStream(sock.getOutputStream());
            needObjStreamInit.getAndSet(true);//atomically flag initialization of object output stream
        } catch (IOException ex) {
            closeSocket();
            Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private boolean isConnectionRefused(IOException ex) {
        return "Connection refused: connect".equals(ex.getMessage());
    }

    /**
     * This method is used to control the frequency of connection attempt. After
     * the first attempt, it waits for a specified time before resuming
     * connection attempt. The time it waits increases linearly by a specified
     * amount. After a specified maximum time is reached then the time begins to
     * decrease to another specified amount before increase again. And the
     * process continues in that fashion.
     */
    private void waitForNextConnectionTime() {

        //check if wait time has reach maxinum
        if (nextConnTry >= 60) {
            //ok wait time has reach maximum so flag to decreas wait time
            descendConnTry = true;
        }

        if (descendConnTry) {
            nextConnTry -= 3; //decrease wait time by this specified amount
            if (nextConnTry < 30) {
                //flag to increase wait time
                descendConnTry = false;
            }
        } else {
            //increase wait time by specified amount
            nextConnTry += 3;
        }
        ThreadUtil.sleep(nextConnTry * 1000);
        
        System.err.println("nextConnTry "+nextConnTry);
    }

    private class RecvHandler implements Runnable {

        private RecvHandler() {
        }

        @Override
        public void run() {

            try {
                if (sock == null) {
                    return;
                }

                if (sock.isClosed() || !sock.isConnected() || sock.isInputShutdown()) {
                    return;
                }

                initOutStream();

                if (objStreamIn == null) {
                    return;
                }

                Object obj = objStreamIn.readObject();

                RemoteCachePacket rmtPack = (RemoteCachePacket) obj;

                //System.out.println("test received  value = " + rmtPack.getValue() );
                if (rmtPack.isRemoveAllCache()) {
                    ServerCache.removeAllRCE(rmtPack);
                } else if (rmtPack.isRemoveCache()) {
                    ServerCache.removeRCE(rmtPack);
                } else if (rmtPack.isDistributedCall()) {
                    //we want to be sure this distributedCall method does not block - if blocking is observer alarm should be made
                    //because blocking of thid method will halt this thread and may cause serious problems
                    Monitor.distributedCallBeginTime =System.nanoTime();
                    ServerCache.distributedCallRCE(rmtPack);
                    Monitor.distributedCallEndTime =System.nanoTime();
                }  else {
                    ServerCache.putRCE(rmtPack);
                }

            } catch (NullPointerException ex) {
                Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
            } catch (SocketTimeoutException ex) {
                //do not not close socket due to read timeout except for partial read
                if (ex.bytesTransferred > 0) {
                    closeSocket();//close due to partial read before read timeout
                }
                //System.err.println(this.getClass().getName()+": "+ex.getMessage());
                //Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
            } catch (IOException | ClassNotFoundException ex) {
                closeSocket();
                //IOException is a super class of InvalidClassException, StreamCorruptedException and OptionalDataException                
                Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
            } catch (Exception ex) {
                Logger.getLogger(CacheStreamHandler.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        private void initOutStream() throws IOException {
            if (needObjStreamInit.get()) {
                objStreamIn = new ExtendedObjectInputStream(sock.getInputStream(), delegatedClassLoader());
                needObjStreamInit.getAndSet(false);
            }

        }
    }
}

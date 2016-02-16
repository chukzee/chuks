/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.SimpleHttpServerException;
import chuks.server.cache.CacheActionType;
import chuks.server.util.ThreadUtil;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.net.ServerSocketFactory;
import test.TestNetworkSerializatiion;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class CacheTester implements Runnable, Serializable {

    static int port = 800;
    static String host = "localhost";
    static int CLIENT_MODE = 4;
    static int SERVER_MODE = 8;
    int mode;
    static TCPCacheTransport tcpCache;    
    static int i = 0;
    //final Object lock = new Object();//commeted to avoid NotSerializableException when i send MyTest object which is inner class of CacheTester 
    final MyTest lock = new MyTest();

    CacheTester(int mode) {
        this.mode = mode;
    }

    class MyTest implements Serializable{
        String value = "test";
    }
    
    @Override
    public void run() {

        if (mode == CLIENT_MODE) {
            runAsClient();
        } else {
            runAsServer();
        }
    }

    public static void main(String... args) throws SimpleHttpServerException, IOException {

        port = 500;

        SimpleHttpServer.cacheSockAddress = new InetSocketAddress(host, port);
        SimpleHttpServer.cache_port = port;
        SimpleHttpServer.host = host;
        SimpleHttpServer.classPath = "C:\\Users\\USER\\Documents\\NetBeansProjects\\chuks-nio-httpserver-0.3\\dist\\";
        ServerHandler.isRunning = true;
        ServerConfig.remoteCacheAddresses = new String[]{"localhost:400", "localhost:700"};
        tcpCache = TCPCacheTransport.getInstance();
        tcpCache.start();

        new Thread(new CacheTester(CLIENT_MODE)).start();
        new Thread(new CacheTester(SERVER_MODE)).start();

    }


    private void runAsClient() {
        new Thread(new Runnable() {

            @Override
            public void run() {

                while (true) {
                    try {
                        Socket sock = new Socket("localhost", 500);
                        System.out.println("connected to  " + sock);
                        ObjectInputStream oin = new ObjectInputStream(sock.getInputStream());
                        ObjectOutputStream oos = null;
                        while (true) {
                            try {
                                RemoteCachePacket cache = (RemoteCachePacket) oin.readObject();
                                System.out.println("client received " + cache + " value = " + cache.getValue());
                                if (oos == null) {
                                    oos = new ObjectOutputStream(sock.getOutputStream());
                                }
                                oos.writeObject(cache);
                            } catch (IOException | ClassNotFoundException ex) {
                                //IOException is a super class of InvalidClassException, StreamCorruptedException and OptionalDataException
                                Logger.getLogger(TestNetworkSerializatiion.class.getName()).log(Level.SEVERE, null, ex);
                                sock.close();
                                break;
                            }

                        }
                    } catch (IOException ex) {
                        Logger.getLogger(CacheTester.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }

            }
        }).start();

        while (true) {
            synchronized (lock) {
                i++;
            }
            ThreadUtil.sleep(3000);
            
            TCPCacheTransport.enqueueCache("as client chuks_key_" + i, new MyTest(), CacheActionType.ADD_MEMORY);
            System.out.println("enqueue as client chuks_key_" + i);
        }

    }

    private void runAsServer() {
        new Thread(new Runnable() {

            @Override
            public void run() {
                try {
                    ServerSocketFactory factory = ServerSocketFactory.getDefault();
                    ServerSocket server_sock = factory.createServerSocket();
                    server_sock.bind(new InetSocketAddress("localhost", 400));
                    while (true) {
                        try {
                            Socket sock = server_sock.accept();
                            System.out.println("accepted " + sock);
                            ObjectInputStream oin = new ObjectInputStream(sock.getInputStream());
                            ObjectOutputStream oos = null;
                            while (true) {
                                try {
                                    RemoteCachePacket cache = (RemoteCachePacket) oin.readObject();
                                    System.out.println("server received " + cache + " value = " + cache.getValue());
                                    if (oos == null) {
                                        oos = new ObjectOutputStream(sock.getOutputStream());
                                    }
                                    oos.writeObject(cache);
                                } catch (IOException | ClassNotFoundException ex) {
                                    //IOException is a super class of InvalidClassException, StreamCorruptedException and OptionalDataException
                                    Logger.getLogger(TestNetworkSerializatiion.class.getName()).log(Level.SEVERE, null, ex);
                                    sock.close();
                                    break;
                                }

                            }
                        } catch (IOException ex) {
                            Logger.getLogger(CacheTester.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                } catch (IOException ex) {
                    Logger.getLogger(CacheTester.class.getName()).log(Level.SEVERE, null, ex);
                }

            }
        }).start();

        while (true) {
            synchronized (lock) {
                i++;
            }
            ThreadUtil.sleep(3000);
            TCPCacheTransport.enqueueCache("as server chuks_key_" + i, "something in the cache_" + i, CacheActionType.ADD_MEMORY);
            System.out.println("enqueue as server chuks_key_" + i);
        }

    }
}

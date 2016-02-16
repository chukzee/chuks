/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import chuks.server.http.request.ServerConfig;
import chuks.server.http.request.SimpleHttpServer;
import chuks.server.util.ThreadUtil;
import java.io.IOException;
import java.io.InvalidClassException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OptionalDataException;
import java.io.StreamCorruptedException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.net.ServerSocketFactory;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TestNetworkSerializatiion {

    public static void main(String... args) {
        new Thread(new Server()).start();
        new Thread(new Client()).start();
    }

    static public class Client implements Runnable {

        List<StringBuilder> cache = new LinkedList();

        Client() {
            StringBuilder data = new StringBuilder();
            for (int i = 0; i < 10000000; i++) {
                data.append("a");
            }
            
            for (int i = 0; i < 1000; i++) {
                cache.add(data);
            }
        }

        @Override
        public void run() {
            try {
                Socket sock = new Socket("localhost", 4000);
                System.out.println("connected");

                while (true) {
                    Iterator<StringBuilder> i = cache.iterator();
                    ObjectOutputStream objStream = new ObjectOutputStream(sock.getOutputStream());
                    while (i.hasNext()) {

                        objStream.writeObject(i.next());
                        objStream.flush();
                        //ThreadUtil.sleep(7000);
                    }
                    break;
                }
                System.out.println("client exit");
            } catch (IOException ex) {
                Logger.getLogger(TestNetworkSerializatiion.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    static public class Server implements Runnable {

        @Override
        public void run() {
            Object obj;
            ObjectInputStream oin = null;
            try {

                ServerSocketFactory factory = ServerSocketFactory.getDefault();
                ServerSocket server_sock = factory.createServerSocket();
                server_sock.bind(new InetSocketAddress("localhost", 4000));
                Socket sock = server_sock.accept();
                sock.setSoTimeout(100);

                oin = new ObjectInputStream(sock.getInputStream());
            } catch (IOException ex) {
                Logger.getLogger(TestNetworkSerializatiion.class.getName()).log(Level.SEVERE, null, ex);
            }
            int i=0;
            while (true) {
                try {
                    obj = oin.readObject();
                    System.out.println(++i+" server received ");
                } catch (SocketTimeoutException ex) {
                    //do not not close socet due to read timeout
                    System.err.println(ex.getMessage() + " - " + ex.bytesTransferred);
                }catch (IOException 
                        | ClassNotFoundException ex) {
                    //IOException is a super class of InvalidClassException, StreamCorruptedException and OptionalDataException
                    Logger.getLogger(TestNetworkSerializatiion.class.getName()).log(Level.SEVERE, null, ex);
                }
                
            }

        }

    }

}

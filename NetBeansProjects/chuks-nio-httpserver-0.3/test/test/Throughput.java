/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import chuks.server.util.ThreadUtil;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Throughput implements Runnable{

    static byte[] request;
    static int total_conn = 1000;
    static AtomicInteger count_recv = new AtomicInteger();
    static long stat_time;
    static{
        stat_time = System.nanoTime();
        request=("GET / HTTP/1.1\r\n" +
                    "Host: localhost\r\n" +
                    "User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:43.0) Gecko/20100101 Firefox/43.0\r\n" +
                    "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n" +
                    "Accept-Language: en-US,en;q=0.5\r\n" +
                    "Accept-Encoding: gzip, deflate\r\n" +
                    //"Connection: keep-alive\r\n" +// DO NOT KEEP ALIVE CONNECTION FOR THIS TEST
                    "\r\n").getBytes();        
    }
    
    @Override
    public void run() {
        try {
            SocketChannel sock = SocketChannel.open(new InetSocketAddress("localhost",80));
            sock.write(ByteBuffer.wrap(request));
            sock.shutdownOutput();
            ByteBuffer recvBuff = ByteBuffer.allocate(512);
            int read = 0;
            while((read = sock.read(recvBuff))==0){
                continue;
            }
            //sock.close();
            count_recv.incrementAndGet();
            if(count_recv.get()>=total_conn){
                System.out.println("finished at "+(System.nanoTime()-stat_time)/Math.pow(10.0, 9));
                System.exit(0);
            }
        } catch (Exception ex) {
            Logger.getLogger(Throughput.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public static void main(String... args){
        
        ExecutorService exec=Executors.newFixedThreadPool(100);
        total_conn =10000;
        for(int i=0; i<total_conn; i++){
            exec.execute(new Throughput());
        }
    }
    
}

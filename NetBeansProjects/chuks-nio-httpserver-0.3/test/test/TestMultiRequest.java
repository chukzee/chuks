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
public class TestMultiRequest implements Runnable {

    static byte[] multi_request;
    static int total_conn = 1000;
    static AtomicInteger count_recv = new AtomicInteger();
    static long stat_time;

    static {
        stat_time = System.nanoTime();
        String str_request = "POST /yeye.html HTTP/1.1\r\n"//TODO - yeye NOT yeye.html CAUSED ERROR IN THE SERVER - CHECK IT 
                + "Host: localhost\r\n"
                + "User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:43.0) Gecko/20100101 Firefox/43.0\r\n"
                + "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n"
                + "Accept-Language: en-US,en;q=0.5\r\n"
                + "Accept-Encoding: gzip, deflate\r\n"
                + "Content-Type: application/x-www-form-urlencoded; charset=UTF-8\r\n"
                + "Connection: keep-alive\r\n"
                + "Content-Length: 5\r\n"
                + "\r\n"
                + "nh=vp";
        
        multi_request = (str_request.replace("yeye", "yeye_1") 
                        + str_request.replace("yeye", "yeye_2") 
                        + str_request.replace("yeye", "yeye_3")
                        + str_request.replace("yeye", "yeye_4") 
                        + str_request.replace("yeye", "yeye_5")).getBytes();
        //multi_request = (str_request).getBytes();
        //str_request ="123456789\r\n\r\n[123456789]abcdefghi\r\n\r\n[123456789]mnopqrstu\r\n\r\n[123456789]";
        //str_request ="123456789\r\n\r\n1234abcdefghi\r\n\r\n1234mnopqrstu\r\n\r\n1234ABCDEFGHI\r\n\r\n1234JKLMNOPQR\r\n\r\n1234STUVWXYZ@\r\n\r\n1234";
        //multi_request = (str_request).getBytes();
    }

    @Override
    public void run() {
        try {
            SocketChannel sock = SocketChannel.open(new InetSocketAddress("localhost", 80));
            sock.socket().setSoTimeout(10*60*60*1000);
            sock.write(ByteBuffer.wrap(multi_request));
            sock.shutdownOutput();
            ByteBuffer recvBuff = ByteBuffer.allocate(512);
            int read = 0;
            String recv ="";
            while ((read = sock.read(recvBuff)) > 0) {
                recv += new String(recvBuff.array(), 0, read);
                recvBuff.clear();
                continue;
            }
            
            System.out.println(recv);
            
            //sock.close();
            /*count_recv.incrementAndGet();
             if(count_recv.get()>=total_conn){
             System.out.println("finished at "+(System.nanoTime()-stat_time)/Math.pow(10.0, 9));
             System.exit(0);
             }*/
        } catch (Exception ex) {
            Logger.getLogger(TestMultiRequest.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static void main(String... args) {

        ExecutorService exec = Executors.newFixedThreadPool(100);

        exec.execute(new TestMultiRequest());

    }
}

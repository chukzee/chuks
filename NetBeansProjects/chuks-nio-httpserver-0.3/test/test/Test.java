/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import chuks.server.http.request.ServerConfig;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author USER
 */
public class Test {
    
    public static void main(String args[]) throws IOException{
        //test1();
        //test2();
        //test3();
        //test4();
        //test5();
        //test6();
        //test7();
        //test8();
        test9();
        //test10();
    }

    private static void test1() {
        byte[] b= {'a','b','c'};
        ByteBuffer bf = ByteBuffer.wrap(b);
        ByteBuffer bf1 = ByteBuffer.allocate(5);
        bf1.put(b);
        ByteBuffer bf2 = ByteBuffer.allocate(6);
        bf2.put(bf);
        bf2.put(bf1.array(),3,b.length);
        bf1 = bf2;
        System.out.println(new String(bf1.array()));
        
    }

    private static void test2(){
        
        long time0 = System.nanoTime();
        int len = 10000000;
        for(int i=0; i<len; i++)
        test2_1();
        long elapse0 = System.nanoTime() - time0;
        System.out.println("chuks elapse " + elapse0 / Math.pow(10.0, 9));

        
        long time1 = System.nanoTime();
        
        for(int i=0; i<len; i++)
        test2_2();
        long elapse1 = System.nanoTime() - time1;
        System.out.println("java elapse " + elapse1 / Math.pow(10.0, 9));
        
        System.out.println((((double)elapse1-elapse0)/elapse1)*100.0);
    }
    
    private static int test2_1() {

        String str_content_len = "4567";
        int content_len = 0;
        //convert the content length from string type to integer using faster method than Integer.parseInt()
        int str_len = str_content_len.length();
        int factor = 1;
        int f = str_len - 1;
        while (f > 0) {
            factor *= 10;
            f--;
        }

        int n;
        for (int i = 0; i < str_len; i++) {
            n = str_content_len.charAt(i) - 48;//actual digit
            content_len += factor * n;
            factor /= 10;
        }

        return content_len;
    }
    
    private static int test2_2() {
  
        return Integer.parseInt("4567");
    }

    private static void test3() {
        String content_type = "image/jpg";
        String type = content_type.substring(0, content_type.indexOf('/'));
        System.out.println(type);
    }

    
    private static void test5() {
        String str = "a.a.b.ssw.2";
        System.out.println(str.replace('.', '/'));
    }

    private static void test6() {
        FileOutputStream fout = null;
        FileInputStream fin = null;
        try {
            File file = new File("C:\\Users\\USER\\Documents\\Wildlife.wmv");
            fin = new FileInputStream(file);
            
            byte [] data = new byte[(int)file.length()];
            fin.read(data);
            fout = new FileOutputStream("C:\\Users\\USER\\Documents\\trucate_test.wmv", true);
            long time = System.nanoTime();
            
            fout.write(data);
            
            System.out.println(System.nanoTime() - time);
            
            time = System.nanoTime();
            //System.out.println("see  "+new File("C:\\Users\\USER\\Documents\\trucate_test.wmv").length());
            fout.getChannel().truncate(data.length);
            
            System.out.println(System.nanoTime() - time);
            
            time = System.nanoTime();
            for(int i=0; i<25000000; i++){                
            }
            
            System.out.println(System.nanoTime() - time);
            
            time = System.nanoTime();
            int n = 0;
            int m = 0;
            byte[] bb = new byte[25000000]; 
            for(int i=0; i<25000000; i++){    
                
                if(i>-1){
                    bb[i]=0;
                }
                    //n++;
                    //m++;
                
            }
            
            System.out.println(System.nanoTime() - time);
                        
        } catch (IOException ex) {
            Logger.getLogger(Test.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                fout.close();
            } catch (IOException ex) {
                Logger.getLogger(Test.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public static void test7(){
        String n=null;
        if(n!=null && n.length()>0){
            System.out.println(n);
        }else{
            System.out.println("is null");            
        }
        
        System.out.println(22%20);
    }
    
    public static void test8(){
        int string_len = 10000000;
        byte[] b= new byte[string_len];
        StringBuilder sb = new StringBuilder();
        for(int i=0; i<string_len; i++){
            //sb.append("c");
        }
        Arrays.fill(b, (byte)'k');
        //String str = sb.toString();
        String str = new String(b);
        System.out.println(str.substring(string_len-5));
    }

    private static void test9() throws IOException {
        //ResourceBundle d = ResourceBundle.getBundle("resources.configAttributes");
        //System.out.println(d.getString("ServerHost"));
        ServerConfig.describeConfigAttributes();
        ServerConfig.writeDefaultConfig("C:\\Users\\USER\\Documents\\chuks_chuks.properties", true);
        //System.out.println(new String(Files.readAllBytes(FileSystems.getDefault().getPath("C:\\Users\\USER\\Documents\\chuks_chuks.properties"))));
    }
    
    private static void test10() throws IOException {
        boolean result = Paths.get("C:\\Users\\uSER\\Documents\\NetBeansProjects")
                .startsWith("C:/Users/USER/Documents");
        
        System.out.println(Paths.get("C:\\Users\\uSER/Documents/chuks_config.properties"));
    }
}

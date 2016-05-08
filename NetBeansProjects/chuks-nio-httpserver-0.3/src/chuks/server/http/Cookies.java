/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http;

/**
 *
 * @author USER
 */
public class Cookies {
    
    StringBuilder cookies;
    
    public Cookies(String session_id){
        cookies = new StringBuilder("Set-Cookie: sessionToken=");
        cookies.append(session_id).append(";");
    }
    
    public Cookies(){
        cookies = new StringBuilder("Set-Cookie: ");
    }
    
    public Cookies append(String name, String value){
        cookies.append(name).append("=").append(value).append("; ");
        return this;
    }
    
    
    public Cookies add(){
        cookies.append("\r\n").append("Set-Cookie: ");
        return this;
    }
    
    public String get(){
        return cookies.toString();
    }
    
    public static void main(String... args){
        Cookies c=new Cookies();
        c.append("name1", "value1")
         .append("name2", "value2")
         .add()
         .append("name3", "value3")
         .append("name4", "value4");
        
        System.out.println(c.get());
    }
}

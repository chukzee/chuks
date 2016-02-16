/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http;

/**
 *
 * @author USER
 */
public class CookiePair {
    private String name;
    private String value;
    
    CookiePair(String name, String value){
        this.name = name;
        this.value = value;
    }
    
    public String getName(){
        return name;
    }
    
    public String getValue(){
        return value;
    }
}

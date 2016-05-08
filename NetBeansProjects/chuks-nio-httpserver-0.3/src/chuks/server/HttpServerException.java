/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

/**
 *
 * @author USER
 */
public class HttpServerException extends Exception{
    
    public HttpServerException(String string){
        super(string);
    }
    
    public void outputErrorToWeb(){
        
    }
}

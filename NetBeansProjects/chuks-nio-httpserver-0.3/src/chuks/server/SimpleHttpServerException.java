/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

/**
 *
 * @author USER
 */
public class SimpleHttpServerException extends Exception{
    
    public SimpleHttpServerException(String string){
        super(string);
    }
    
    public void outputErrorToWeb(){
        
    }
}

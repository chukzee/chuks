/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.builder.exception;

/**
 *
 * @author USER
 */
public class AppBuilderException extends Exception {

    public AppBuilderException(String str) {
        super(str);
    }
    
    public AppBuilderException(Exception ex) {
        super(ex);
    }
 
    public AppBuilderException(String msg, Exception ex) {
        super(msg, ex);
    }
}

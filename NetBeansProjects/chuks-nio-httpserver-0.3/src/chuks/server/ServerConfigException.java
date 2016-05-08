/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

/**
 *
 * @author USER
 */
public class ServerConfigException extends Exception {

    public ServerConfigException(String string) {
        super(string);
    }

    public ServerConfigException(String message, Throwable cause) {
        super(message, cause);
    }
    
}

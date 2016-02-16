/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

/**
 *
 * @author USER
 */
public interface HttpServer {
    
    /**Starts the server. if the server is already started
     * this method throws SimpleHttpServerException
     * 
     */
    boolean start();
    
    /**Shutdown the server orderly release all resources
     * 
     */
    boolean stop();
    
}

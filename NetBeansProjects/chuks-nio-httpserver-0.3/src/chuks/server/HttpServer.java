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
     * @return true if successful
     */
    boolean start();
    
    /**Shutdown the server orderly releasing all resources
     * 
     * @param wait_duration
     * @return true if successful
     */
    boolean stop(int wait_duration);

    /**Tells if the server is running
     * 
     * @return 
     */
    public boolean isRunning();
    
}

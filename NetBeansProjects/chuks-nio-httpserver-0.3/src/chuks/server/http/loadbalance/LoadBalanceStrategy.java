/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.loadbalance;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface LoadBalanceStrategy {
    
    /**
     * Returns the server address where request should be redirected to 
     * of null if the request shout not be redirected but processed by this server.
     * @return 
     */
    String getRedirectServerAddress();
    
    /**
     * Returns whether the request should be redirected or not
     * @return 
     */    
    boolean isRedirect();
}

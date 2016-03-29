/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

/**
 *
 * @author USER
 */
interface IProxy {
    
   void useProxy(boolean use_proxy); 

   void proxyHost(String proxy_host); 

   void proxyPort(int proxy_port); 

}

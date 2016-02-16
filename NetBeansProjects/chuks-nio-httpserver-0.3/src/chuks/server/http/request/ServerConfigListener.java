/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.configuration.event.ConfigurationErrorEvent;
import org.apache.commons.configuration.event.ConfigurationErrorListener;
import org.apache.commons.configuration.event.ConfigurationEvent;
import org.apache.commons.configuration.event.ConfigurationListener;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class ServerConfigListener implements ConfigurationListener, ConfigurationErrorListener{

    public ServerConfigListener() {
    }

    @Override
    public void configurationChanged(ConfigurationEvent event) {
        
        if(event.isBeforeUpdate()){
            
        }else{
            
        }
    }

    @Override
    public void configurationError(ConfigurationErrorEvent event) {
        
        if(event.isBeforeUpdate()){
            
        }else{
            
        }
        
        
        if(!SimpleHttpServer.isStop()){
            String msg = "Server will terminate due to configuration failure.";
            Logger.getLogger(ServerConfigListener.class.getName()).log(Level.SEVERE, msg, event.getCause());
            System.exit(-1);
        }else{
            String msg = "It is advisable to shutdown the server due to configuration failure.";
            Logger.getLogger(ServerConfigListener.class.getName()).log(Level.WARNING, msg, event.getCause());            
        }
        
    }
    
}

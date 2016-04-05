/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Properties;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class LocalUser extends UserInfo{
        
    public LocalUser(){
        
    }
   
    public LocalUser(String username){
        setUsername(username);
    }
   
    public UserInfo getInfo(){
        return this;
    }
    
    /**Send message to all users in the same game room
     * 
     * @param message 
     */
    public void broadcastMessage(ChatMessage message){
        
    }

        
    /**Send message to a particular user
     * 
     * @param user
     * @param message 
     */
    public void sendMessageTo(UserInfo user, ChatMessage message){
     
    }
    
    public static void main(String... ar){
        Properties p = System.getProperties();
        System.out.println(System.getProperty("user.variant"));
    }
}

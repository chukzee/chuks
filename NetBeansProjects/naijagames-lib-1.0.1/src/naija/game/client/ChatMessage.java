/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Date;

/**
 *
 * @author USER
 */
public class ChatMessage {
    
    boolean isBroadcastMsg;
    private String message="";
    UserInfo from_user;
    UserInfo to_user;
    Date message_time;
    
    public void setIsBroadcast(boolean is_broadcast){
        this.isBroadcastMsg = is_broadcast;
    }    
    
    public void setFromUser(UserInfo user){
        from_user = user;
    }
    
    public void setToUser(UserInfo user){
        to_user = user;
    }
    
    public void setMessageTime(Date msg_time){
        message_time = msg_time;
    }
                    
    public boolean isBroadcast(){
        return isBroadcastMsg;
    }
     
    public UserInfo getFromUser(){
        return from_user;
    }
    
    public UserInfo getToUser(){
        return to_user;
    }
    
    public Date getMessageTime(){
        return message_time;
    }
    
}

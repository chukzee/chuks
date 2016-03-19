/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import naija.game.client.chess.board.Move;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class RemoteUser extends UserInfo{
    
    
    public UserInfo getInfo(){
        return this;
    }
    
    public ChatMessage nextChatMessage(){
       
        return null;
    }
    
    
    public Move nextMove(){
       
        return null;
    }    
        
}

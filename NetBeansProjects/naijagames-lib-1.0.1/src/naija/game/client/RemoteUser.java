/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import naija.game.client.chess.ChessMove;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class RemoteUser extends User{
    
    
    public User getInfo(){
        return this;
    }
    
    public ChatMessage nextChatMessage(){
       
        return null;
    }
    
    
    public ChessMove nextMove(){
       
        return null;
    }    
        
}

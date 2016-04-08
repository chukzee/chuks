/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game;

import java.io.Serializable;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public abstract class Move implements Serializable{
    private  String move_notation;
    private  int move_number;
    private  boolean is_game_over;

    private Move(){
        
    }
    
    public Move(String move_notation, int move_number, boolean is_game_over){
        this.move_notation = move_notation;
        this.move_number = move_number;
        this.is_game_over = is_game_over;
    }
    
    public abstract String getGameName();
    
    public String getMoveNotation(){
        return move_notation;
    }
    
    public boolean isGameOver(){
        return is_game_over;
    }
    
    public int getMoveNumber(){
        return move_number;
    }
}

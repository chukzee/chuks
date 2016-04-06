/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.board;

import naija.game.client.PieceName;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class PieceDescription {
    PieceName name;
    boolean is_white;
    
    private PieceDescription(){
        
    }
    
    public PieceDescription(PieceName name, boolean is_white){
        this.name = name;
        this.is_white = is_white;
    }
    
    public PieceName getPieceName(){
        return name;
    }
           
    public boolean isWhite(){
        return is_white;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.command.chess;

import naija.game.Move;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ChessMove extends Move{

    public ChessMove(String move_notation, int move_number, boolean is_game_over) {
        super(move_notation, move_number, is_game_over);
    }

    @Override
    public String getGameName() {
        return "chess";
    }
    
}

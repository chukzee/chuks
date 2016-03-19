/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.algorithm;

import naija.game.client.chess.board.Board;

/**
 *
 * @author Onyeka Alimele
 */
public class MiniMax {
    private int turn;
    private int search_depth;
    private Board board;


    public MiniMax(Board board, int turn, int search_depth) {
        this.board=board;
        this.turn=turn;
        this.search_depth=search_depth;
       
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.whot;

import naija.game.client.chess.board.Board;
import naija.game.client.chess.ChessMove;
import naija.game.client.event.GameEvent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class WhotEvent extends GameEvent{

    private String message;
    private WhotPlayer player;
    private WhotPlayer playerTurn;
    private WhotPlayer winner;
    private String boardPosition;
    private String lastMove;
    private int turn = -1;
    private int last_turn = -1;
    private int last_from_square;
    private int last_to_square;
    private boolean is_checkmate;
    private boolean is_stalemate;
    private boolean is_fifty_move_rule;
    private boolean is_three_fold_repetition;
    private boolean is_insufficient_material;
    private ChessMove move;
    private int illegal_from_square = -1;
    private int illegal_to_square = -1;
    private Board board;
    
    private WhotEvent() {
        
    }

    WhotEvent(String message) {
        this.message = message;
    }

    WhotEvent(WhotPlayer playerTurn, int turn) {
        this.turn = turn;
        this.playerTurn = playerTurn;        
    }

    WhotEvent(WhotPlayer playerTurn, int turn, int illegal_from_square, int illegal_to_square) {
        this.turn = turn;
        this.playerTurn = playerTurn;        
        this.illegal_from_square = illegal_from_square;
        this.illegal_to_square = illegal_to_square;
    }

    WhotEvent(WhotPlayer player, int turn, Board board, ChessMove move) {
        this.turn = turn;
        this.player = player;
        this.board = board;
        this.move = move;
    }

    WhotEvent(WhotPlayer player, String message) {
        this.player = player;
        this.message = message;
    }

    WhotEvent(WhotPlayer player, String message, int illegal_from_square, int illegal_to_square) {
        this.player = player;
        this.message = message;
        this.illegal_from_square = illegal_from_square;
        this.illegal_to_square = illegal_to_square;
        
    }

    WhotEvent(ChessMove move) {
        this.move = move;
    }
        
    public WhotPlayer getWinner(){
        return winner;
    }
    
    public String getMessage() {
        return message;
    }
    
    public WhotPlayer getPlayer() {
        return this.player;
    }

    public WhotPlayer getTurnPlayer() {
        return this.playerTurn;
    }

    public String getBoardPostion() {
        return this.boardPosition;
    }

    public int getIllegalMoveFromSquare() {
        
        return illegal_from_square;
    }
                
    public int getLastTurn() {
        return this.last_turn;
    }

    public int getCurrentTurn() {
        return this.turn;
    }
    
    public String printBoard(){

        return null;
    }
}

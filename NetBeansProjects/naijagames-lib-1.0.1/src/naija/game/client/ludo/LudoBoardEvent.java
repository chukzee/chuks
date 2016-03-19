/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.ludo;

import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.Move;
import naija.game.client.event.GameEvent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class LudoBoardEvent extends GameEvent{

    private String message;
    private LudoPlayer player;
    private LudoPlayer playerTurn;
    private LudoPlayer winner;
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
    private Move move;
    private int illegal_from_square = -1;
    private int illegal_to_square = -1;
    private Board board;
    
    private LudoBoardEvent() {
        
    }

    LudoBoardEvent(String message) {
        this.message = message;
    }

    LudoBoardEvent(LudoPlayer playerTurn, int turn) {
        this.turn = turn;
        this.playerTurn = playerTurn;        
    }

    LudoBoardEvent(LudoPlayer playerTurn, int turn, int illegal_from_square, int illegal_to_square) {
        this.turn = turn;
        this.playerTurn = playerTurn;        
        this.illegal_from_square = illegal_from_square;
        this.illegal_to_square = illegal_to_square;
    }

    LudoBoardEvent(LudoPlayer player, int turn, Board board, Move move) {
        this.turn = turn;
        this.player = player;
        this.board = board;
        this.move = move;
    }

    LudoBoardEvent(LudoPlayer player, String message) {
        this.player = player;
        this.message = message;
    }

    LudoBoardEvent(LudoPlayer player, String message, int illegal_from_square, int illegal_to_square) {
        this.player = player;
        this.message = message;
        this.illegal_from_square = illegal_from_square;
        this.illegal_to_square = illegal_to_square;
        
    }

    LudoBoardEvent(Move move) {
        this.move = move;
    }
        
    public LudoPlayer getWinner(){
        return winner;
    }
    
    public String getMessage() {
        return message;
    }
    
    public LudoPlayer getPlayer() {
        return this.player;
    }

    public LudoPlayer getTurnPlayer() {
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

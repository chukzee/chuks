/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.solitaire;

import naija.game.client.whot.*;
import naija.game.client.scrabble.*;
import naija.game.client.draft.*;
import naija.game.client.chess.*;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.Constants;
import naija.game.client.chess.ChessMove;
import naija.game.client.Side;
import naija.game.client.event.GameEvent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class SolitaireEvent extends GameEvent {

    private String message;
    private SolitairePlayer player;
    private SolitairePlayer playerTurn;
    private SolitairePlayer winner;
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
    
    private SolitaireEvent() {
        
    }

    SolitaireEvent(String message) {
        this.message = message;
    }

    SolitaireEvent(SolitairePlayer playerTurn, int turn) {
        this.turn = turn;
        this.playerTurn = playerTurn;        
    }

    SolitaireEvent(SolitairePlayer playerTurn, int turn, int illegal_from_square, int illegal_to_square) {
        this.turn = turn;
        this.playerTurn = playerTurn;        
        this.illegal_from_square = illegal_from_square;
        this.illegal_to_square = illegal_to_square;
    }

    SolitaireEvent(SolitairePlayer player, int turn, Board board, ChessMove move) {
        this.turn = turn;
        this.player = player;
        this.board = board;
        this.move = move;
    }

    SolitaireEvent(SolitairePlayer player, String message) {
        this.player = player;
        this.message = message;
    }

    SolitaireEvent(SolitairePlayer player, String message, int illegal_from_square, int illegal_to_square) {
        this.player = player;
        this.message = message;
        this.illegal_from_square = illegal_from_square;
        this.illegal_to_square = illegal_to_square;
        
    }

    SolitaireEvent(ChessMove move) {
        this.move = move;
    }
        
    public SolitairePlayer getWinner(){
        return winner;
    }
    
    public String getMessage() {
        return message;
    }
    
    public SolitairePlayer getPlayer() {
        return this.player;
    }

    public SolitairePlayer getTurnPlayer() {
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

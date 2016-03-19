/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess;

import naija.game.client.event.GameEvent;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.Constants;
import naija.game.client.chess.board.Move;
import naija.game.client.Side;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ChessBoardEvent extends GameEvent{

    private String message;
    private ChessPlayer player;
    private ChessPlayer playerTurn;
    private ChessPlayer winner;
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
    
    private ChessBoardEvent() {
        
    }

    ChessBoardEvent(String message) {
        this.message = message;
    }

    ChessBoardEvent(ChessPlayer playerTurn, int turn) {
        this.turn = turn;
        this.playerTurn = playerTurn;        
    }

    ChessBoardEvent(ChessPlayer playerTurn, int turn, int illegal_from_square, int illegal_to_square) {
        this.turn = turn;
        this.playerTurn = playerTurn;        
        this.illegal_from_square = illegal_from_square;
        this.illegal_to_square = illegal_to_square;
    }

    ChessBoardEvent(ChessPlayer player, int turn, Board board, Move move) {
        this.turn = turn;
        this.player = player;
        this.board = board;
        this.move = move;
    }

    ChessBoardEvent(ChessPlayer player, String message) {
        this.player = player;
        this.message = message;
    }

    ChessBoardEvent(ChessPlayer player, String message, int illegal_from_square, int illegal_to_square) {
        this.player = player;
        this.message = message;
        this.illegal_from_square = illegal_from_square;
        this.illegal_to_square = illegal_to_square;
        
    }

    ChessBoardEvent(Move move) {
        this.move = move;
    }
        
    public ChessPlayer getWinner(){
        return winner;
    }
    
    public String getMessage() {
        return message;
    }
    
    public ChessPlayer getPlayer() {
        return this.player;
    }

    public ChessPlayer getTurnPlayer() {
        return this.playerTurn;
    }

    public String getBoardPostion() {
        return this.boardPosition;
    }

    public boolean isLongCastle() {
        if(move==null)
            return false;
        return this.move.is_long_castle;
    }

    public boolean isShortCastle() {
        if(move==null)
            return false;        
        return this.move.is_short_castle;
    }

    public String getMoveNotation() {
        if(move==null)
            return "";        

        return move.notation();
    }
    
    public int getMoveFromSquare() {
        if(move==null)
            return -1;        
        
        if(move.from_square==Constants.NOTHING)
            return -1; 
        
        return this.move.from_square;
    }

    public int getMoveToSquare() {
        if(move==null)
            return -1;        
        
        if(move.to_square==Constants.NOTHING)
            return -1; 
        return this.move.to_square;
    }
    public int getIllegalMoveFromSquare() {
        
        return illegal_from_square;
    }

    public int getIllegalMoveToSquare() {
 
        return illegal_to_square;
    }
    
    public boolean isPromotion() {
        if(move==null)
            return false;        
        
        return this.move.promotion_piece_rating!=Constants.NOTHING;
    }
    
    public boolean isQueenPromotion() {
        if(move==null)
            return false;        
        
        return this.move.promotion_piece_rating == Constants.QueenPromotion;
    }
    
    public boolean isBishopPromotion() {
        if(move==null)
            return false;        
        
        return this.move.promotion_piece_rating == Constants.BishopPromotion;
    }
    
    public boolean isRookPromotion() {
        if(move==null)
            return false;        
        
        return this.move.promotion_piece_rating == Constants.RookPromotion;
    }
    
    public boolean isKnightPromotion() {
        if(move==null)
            return false;        
        
        return this.move.promotion_piece_rating == Constants.KnightPromotion;
    }
    
    public boolean isEnPassant() {
        if(move==null)
            return false;        
        
        return this.move.enpassant_capture_square != Constants.NOTHING;
    }
    
    public int getEnPassantCaptureSquare() {
        if(move==null)
            return -1;        
        
        return this.move.enpassant_capture_square;
    }
                
    public int getLastTurn() {
        return this.last_turn;
    }

    public int getCurrentTurn() {
        return this.turn;
    }

    void setIsCheckmate(ChessPlayer winner) {
        this.winner = winner;
        this.is_checkmate = true;
    }

    void setIsStalement() {
        this.is_stalemate = true;
    }

    void setIsFiftyMoveRule() {
        this.is_fifty_move_rule = true;
    }

    void setIsThreeFoldRepitition() {
        this.is_three_fold_repetition = true;
    }

    void setIsInsufficientMaterial() {
        this.is_insufficient_material = true;
    }

    public boolean isCheckmate() {
        return this.is_checkmate;
    }

    public boolean isStalement() {
        return is_stalemate;
    }

    public boolean isFiftyMoveRule() {
        return is_fifty_move_rule;
    }

    public boolean isThreeFoldRepitition() {
        return is_three_fold_repetition;
    }

    public boolean isInsufficientMaterial() {
        return is_insufficient_material;
    }

    public int getLongCastleKingFromSquare() {
        return board.getKingOriginSquare(turn);//same for getShortCastleKingFromSquare
    }

    public int getShortCastleKingFromSquare() {
        return board.getKingOriginSquare(turn);//same for getLongCastleKingFromSquare
    }

    public int getLongCastleRookFromSquare() {
        return board.getRookOnQueenSideOriginSquare(turn);
    }

    public int getShortCastleRookFromSquare() {
        return board.getRookOnKingSideOriginSquare(turn);
    }


    public int getLongCastleKingToSquare() {
        
        return turn==Side.white?
                board.WHITE_KING_LONG_CASTLE_SQUARE:
                board.BLACK_KING_LONG_CASTLE_SQUARE;
    }

    public int getShortCastleKingToSquare() {
        
        return turn==Side.white?
                board.WHITE_KING_SHORT_CASTLE_SQUARE:
                board.BLACK_KING_SHORT_CASTLE_SQUARE;
    }

    public int getLongCastleRookToSquare() {
        
        return turn==Side.white?
                board.WHITE_ROOK_LONG_CASTLE_SQUARE:
                board.BLACK_ROOK_LONG_CASTLE_SQUARE;
    }

    public int getShortCastleRookToSquare() {
        
        return turn==Side.white?
                board.WHITE_ROOK_SHORT_CASTLE_SQUARE:
                board.BLACK_ROOK_SHORT_CASTLE_SQUARE;
    }
    
    public String printBoard(){
        if(board==null)
            return "";
        return board.toString();
    }
}

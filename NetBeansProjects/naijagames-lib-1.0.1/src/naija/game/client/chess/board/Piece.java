/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.board;

import naija.game.client.Side;

/**
 *
 * @author Onyeka Alimele
 */
public class Piece {

    public char piece_name;
    public int Square = Constants.NOTHING;
    int side = -1;
    boolean white;
    public int ID = Constants.NOTHING;;
    int lastCapturedID = Constants.NOTHING;;
    int last_captued_square=Constants.NOTHING;;
    private boolean is_first_move=true;//meant mainly for pawn
    private int square_color = -1;
    private boolean is_en_passant_opportunity;
    private boolean is_promoted;
    private boolean promotion_activated;
    private boolean is_castling;
    private int rook_castle_piece_id = Constants.NOTHING;;
    private int rook_castle_to_cell = Constants.NOTHING;;
    private int en_passant_pawn_to_capture_piece_id = Constants.NOTHING;
    private boolean is_en_passant_capture_move;
    public boolean isAlreadyCastle;
    public boolean PawnDoubleStepMove;
    private boolean is_previously_move;    
    
    private Piece() {//private the default constructor to be instantiated
        
    }
    
    Piece(char piece_name,int side, int row_index, int col_index) {            
        this.piece_name=piece_name;
        this.side = side;
        
        if(side==Side.white)
            white=true;
        
        Square = (row_index)*8+col_index;    
        //ID=Square;
        
        //TODO : determine the square color for rook , knight , and bishop
        
    }

    Piece(char piece_name,int side, int square) {            
        this.piece_name=piece_name;
        this.side = side;
        
        if(side==Side.white)
            white=true;
        
        Square = square;    
        //ID=Square;
        
        //TODO : determine the square color for rook , knight , and bishop
        
    }    
    
    
    /**This method is used to avoid piece object reference for reason to avoid bug in other language
     * such as c++, c#, javascript. The required field will just be copied. object reference is not required.
     * 
     * 
     * @return 
     */

    public Piece getCopy(){
        
        Piece piece =new Piece(); 
        
        piece.piece_name = this.piece_name;
        piece.Square = this.Square;
        piece.side = this.side;
        piece.white = this.white;
        piece.ID = this.ID;
        piece.is_first_move = this.is_first_move;
        piece.square_color = this.square_color;
        piece.is_en_passant_opportunity = this.is_en_passant_opportunity;
        piece.is_promoted = this.is_promoted;
        piece.promotion_activated = this.promotion_activated;
        piece.is_castling = this.is_castling;
        piece.rook_castle_piece_id = this.rook_castle_piece_id;
        piece.rook_castle_to_cell = this.rook_castle_to_cell;
        piece.en_passant_pawn_to_capture_piece_id = this.en_passant_pawn_to_capture_piece_id;
        piece.is_en_passant_capture_move = this.is_en_passant_capture_move;
        
        return piece;
    }
    
    public int getPieceSquarePosition() {
        return Square;
    }

    public int Me() {
        return side;
    }

    public int getPieceID() {
        return ID;
    }

    public boolean isBlack() {
        return !white;
    }

    public boolean isWhite() {
        return white;
    }
    
    public boolean isFirstMove() {
        return is_first_move;
    }
    
    public void setSide(int piece_side){
        side = piece_side;
        white = piece_side == Side.white;
    }
    
    public void setIsFirstMove(boolean is_first_move){
        this.is_first_move=is_first_move;
    }

    public boolean isPromotionActivated() {
        return promotion_activated;
    }
    
    public void setPromotionActivated(boolean activated){
        promotion_activated=activated;
    }

    public void setIsCastling(boolean is_castling) {
        this.is_castling=is_castling;
    }

    public boolean IsCastling() {
        return this.is_castling;
    }

    public void setRookCastlePieceID(int pieceID) {
        rook_castle_piece_id=pieceID;
    }
    
    public int getRookCastlePieceID(){
        return rook_castle_piece_id;
    }

    public void setRookCastleToCell(int to_cell) {
        rook_castle_to_cell=to_cell;
    }
    
    public int getRookCastleToCell() {
        return rook_castle_to_cell;
    }

    public void setEnPassantOpportunity(boolean is_en_passant_opportunity) {
        this.is_en_passant_opportunity=is_en_passant_opportunity;
    }

    public boolean isEnPassantOpportunity(){
        return is_en_passant_opportunity;
    }

    public void setEnPassantPawnToCapturePieceID(int en_passant_pawn_to_capture_id) {
        en_passant_pawn_to_capture_piece_id=en_passant_pawn_to_capture_id;
    }

    public int getEnPassantPawnToCapturePieceID() {
        return en_passant_pawn_to_capture_piece_id;
    }

    public void setIsEnPassantCaptureMove(boolean en_passant_capture_move) {
        this.is_en_passant_capture_move=en_passant_capture_move;
    }
    
    public boolean isEnPassantCaptureMove(){
        return is_en_passant_capture_move;
    }

    public void setSquareColor(int square_color){
        this.square_color=square_color;
    }
    
    public int getSquareColor() {
        return square_color;
    }

    public void setPromotionFlag(boolean flag) {
        is_promoted=flag;
    }
    
    public boolean isPromoted(){
        return is_promoted;
    }

    public void setHasPreviouslyMoved(boolean is_moved) {
         is_previously_move = is_moved;
    }    
    
    public boolean hasPreviouslyMoved() {
        return is_previously_move;
    }

}

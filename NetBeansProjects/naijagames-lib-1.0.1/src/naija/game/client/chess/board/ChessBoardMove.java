/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.board;

/**
 *
 * @author Engr. Chuks
 */
public class ChessBoardMove {
    private int [] valid_squares;
    private boolean is_move_valid;
    private Castle castle=new Castle(); 
    private EnPassant enPassant=new EnPassant();
    private boolean is_opponent_king_in_check;
    private int pos_opponent_king_in_check;
    private String invalidMoveMessage;

    public void setValidSquares(int[] squares){
        valid_squares=squares;
    }
    
    public void setIsValidMove(boolean is_valid){
        is_move_valid=is_valid;
    }
    
    public boolean isMoveValid(){
        return is_move_valid;
    }        
    
    public int [] getValidSquares(){
        return valid_squares;
    }
    
    public Castle getCastle(){
        return castle;
    }
    
    public EnPassant getEnPassant(){
        return enPassant;
    }

    void setIsOpponentKingInCheck(boolean is_opponent_king_in_check) {
        this.is_opponent_king_in_check=is_opponent_king_in_check;
    }

    boolean IsOpponentKingInCheck() {
       return is_opponent_king_in_check;
    }

    void setSquarePositionOfOpponentKingInCheck(int pos_opponent_king_in_check) {
        this.pos_opponent_king_in_check=pos_opponent_king_in_check;
    }

    int getSquarePositionOfOpponentKingInCheck() {
        return this.pos_opponent_king_in_check;
    }

    public void setInvalidMoveMessage(String message) {
        invalidMoveMessage=message;
    }

    public String getInvalidMoveMessage() {
        return invalidMoveMessage;
    }
             
    public class Castle{
        private Piece king;
        private Piece left_castle_rook;
        private Piece right_castle_rook;
        private boolean is_castle_opportunity;
        private int castle_options;
        private int king_left_castle_pos=-1;
        private int left_rook_castle_pos=-1;
        private int king_right_castle_pos=-1;
        private int right_rook_castle_pos=-1;
        private String invalid_castle_msg="";
        private boolean is_castle_attempt;

        
        public Piece getCastleRookSelectedByKing(int king_to_cell){
            
            if(king_left_castle_pos!=-1 && king_right_castle_pos!=-1){                
                if(king_to_cell==king_left_castle_pos){
                    return left_castle_rook;
                }else if(king_to_cell==king_right_castle_pos){
                    return right_castle_rook;
                }
            }else if(king_left_castle_pos==-1 && king_right_castle_pos!=-1){
                if(king_to_cell==king_right_castle_pos){
                    return right_castle_rook;
                }                
            }else if(king_left_castle_pos!=-1 && king_right_castle_pos==-1){
                if(king_to_cell==king_left_castle_pos){
                    return left_castle_rook;
                }          
            }            
            
            return null;
        }
        
        public int getCastleRookNewSquarePosition(int king_to_cell){
            
            if(king_left_castle_pos!=-1 && king_right_castle_pos!=-1){                
                if(king_to_cell==king_left_castle_pos){
                    return left_rook_castle_pos;
                }else if(king_to_cell==king_right_castle_pos){
                    return right_rook_castle_pos;
                }
            }else if(king_left_castle_pos==-1 && king_right_castle_pos!=-1){
                if(king_to_cell==king_right_castle_pos){
                    return right_rook_castle_pos;
                }                
            }else if(king_left_castle_pos!=-1 && king_right_castle_pos==-1){
                if(king_to_cell==king_left_castle_pos){
                    return left_rook_castle_pos;
                }          
            }            
            
            return -1;
        }
        
        public boolean isKingSideCastle(){
            return left_castle_rook==null&right_castle_rook!=null;
        }
        
        public boolean isQueenSideCastle(){
            return left_castle_rook!=null&right_castle_rook==null;
        }
        
        public int [] kingCastlePosition(){
            
            if(king_left_castle_pos!=-1 && king_right_castle_pos!=-1){
                int[] pos={king_left_castle_pos,king_right_castle_pos};
                return pos;
            }else if(king_left_castle_pos==-1 && king_right_castle_pos!=-1){
                int[] pos={king_right_castle_pos};
                return pos;                
            }else if(king_left_castle_pos!=-1 && king_right_castle_pos==-1){
                int[] pos={king_left_castle_pos};
                return pos;                
            }
            
            return new int[0];
        }
        
        public void setCastleOpportunity(boolean is_castle_opportunity){
            this.is_castle_opportunity=is_castle_opportunity;
        }
        
        public boolean isCastleOpportunity(){
            return is_castle_opportunity;
        }

        void setIsCastleAttempt(boolean is_castle_attempt) {
            this.is_castle_attempt = is_castle_attempt;
        }

        boolean isCastleAttempt() {
            return this.is_castle_attempt;
        }
                
        public Piece getCastleKing(){
            return king;
        }

        public void setCastleKing(Piece king){
            this.king=king;
        }

        public Piece getLeftCastleRook(){
            return this.left_castle_rook;
        }

        public Piece getRightCastleRook(){
            return this.right_castle_rook;
        }

        public void setLeftCastleRook(Piece rook){
            this.left_castle_rook=rook;
        }

        public void setRightCastleRook(Piece rook){
            this.right_castle_rook=rook;
        }

        public void setCastleOptions(int count){
            castle_options=count;
        }

        public int getCastleOptions(){
            return castle_options;
        }
                
        public void setKingLeftCastleSquarePositon(int king_castle_pos) {
            this.king_left_castle_pos=king_castle_pos;
        }

        public void setKingRightCastleSquarePositon(int king_castle_pos) {
            this.king_right_castle_pos=king_castle_pos;
        }

        public void setLeftRookCastleSquarePositon(int rook_castle_pos) {
            this.left_rook_castle_pos=rook_castle_pos;
        }     
        
        public void setRightRookCastleSquarePositon(int rook_castle_pos) {
            this.right_rook_castle_pos=rook_castle_pos;
        }     

        public int getKingLeftCastleSquarePositon() {
            return king_left_castle_pos;
        }

        public int getKingRightCastleSquarePositon() {
            return king_right_castle_pos;
        }

        public int getLeftRookCastleSquarePositon() {
            return left_rook_castle_pos;
        }             

        public int getRightRookCastleSquarePositon() {
            return right_rook_castle_pos;
        }

        public void setInvalidCastleMessage(String msg) {
            invalid_castle_msg=msg;
        }

        public String getInvalidCastleMessage() {
            return invalid_castle_msg;
        }        
    }
    
    
    public class EnPassant{
    
        private int en_passant_left_pawn_capturer_piece_id=-1;
        private int en_passant_right_pawn_capturer_piece_id=-1;
        private int en_passant_pawn_to_capture_piece_id=-1;        
        private boolean is_en_passant_capture;
        

        
        public void setEnPassantLeftPawnCapturerPieceID(int en_passant_left_pawn_capturer_id){
            this.en_passant_left_pawn_capturer_piece_id=en_passant_left_pawn_capturer_id;
        }        
        
        public void setEnPassantRightPawnCapturerPieceID(int en_passant_right_pawn_capturer_id){
            this.en_passant_right_pawn_capturer_piece_id=en_passant_right_pawn_capturer_id;
        }        
        
        public int getEnPassantLeftPawnCapturerPieceID(){
            return en_passant_left_pawn_capturer_piece_id;
        }        
        
        public int getEnPassantRightPawnCapturerPieceID(){
            return en_passant_right_pawn_capturer_piece_id;
        }

        public void setEnPassantPawnToCapturePieceID(int en_passant_pawn_to_capture_id) {
            en_passant_pawn_to_capture_piece_id=en_passant_pawn_to_capture_id;
        }
        
        public int getEnPassantPawnToCapturePieceID(){
            return en_passant_pawn_to_capture_piece_id;
        }

        
        public void setIsEnPassantCaptureMove(boolean is_en_passant_capture) {
            this.is_en_passant_capture=is_en_passant_capture;
        }

        public boolean isEnPassantCaptureMove(){
            return is_en_passant_capture;
        }
    }
}

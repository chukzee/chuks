/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package naija.game.client.chess.board;

import naija.game.client.Side;
import naija.game.client.chess.board.ChessMove.Castle;
import naija.game.client.chess.board.ChessMove.EnPassant;
//import util.Approx;


/**
 *
 * @author Engr. Chuks
 */
public class EngineBoardAnalyzer{
    
    private int total_squares_per_row=8;
    private int total_row=8;
    private int total_chess_pieces=32;
    public Board board;

    
    public EngineBoardAnalyzer(Board board) {
           this.board= board; 
    }


    public void init(Board board){
          this.board=board;
    }
    
    public int getSquareRowIndex(int square){
        double d_square=square;//firs convert to double
        return (int) ((float)(d_square / total_squares_per_row));//cast to float first to take care of precision problem
    }

    public int getSquareColumnIndex(int square){
        
        double d_square=square;//firs convert to double
        int v1=(int) (d_square / total_squares_per_row);
        double v2=d_square/total_squares_per_row;
        double fraction=v2-v1;

        return (int) ((float)(fraction * total_squares_per_row));//cast to float first to take care of precision problem        
    }

    //Re touched
    boolean isSquareEmpty(int square_serial_num, int skipped_square){// skipped_square is to prevent conflict due to piece navigation
        
        Piece[] pieces = board.getAllPieces();

        for(int i=pieces.length - 1; i>-1; i--){

            if(pieces[i].getPieceSquarePosition()==skipped_square){
                continue;
            }
            
            if(pieces[i].getPieceSquarePosition() == square_serial_num){
                return false;
            }            

       }

        return true;//man at work
    }

    Piece getPieceOnThisSquare(int square){
    
        if(square==-1 || square==Constants.NOTHING)
            return null;
        
        Piece[] pieces=board.getAllPieces();
        
        int len=pieces.length;
        for(int i=len-1; i>-1; i--)
            if(pieces[i].getPieceSquarePosition()==square)
                return pieces[i];

        return null;
    }
    
    public Piece getPieceByID(int piece_id){
        
        /*Piece[] PIECES_BY_ID=board.getAllPieces(); 
        int len=PIECES_BY_ID.length;
        for(int i=len-1; i>-1; i--)
            if(PIECES_BY_ID[i].getPieceID()==piece_id)
                return PIECES_BY_ID[i];

         * 
         */

        if(piece_id!=-1 && piece_id!=Constants.NOTHING)
            return board.getAllPieces()[piece_id];//i made the piece id the index
        
        return null;
    }
        
    public Piece getPieceOnSquareExcept(Piece except, int square){

        Piece[] pieces=board.getAllPieces(); 
        
        int len=pieces.length;
        for(int i=len-1; i>-1; i--)
            if(pieces[i].getPieceSquarePosition()==square 
                    && !pieces[i].equals(except))
                return pieces[i];

        return null;
    }
    
    public int[] getPieceSurrundingSquares(int square){

        int []surronding_squares=null;

        int left_square_poistion=-1;
        int right_square_poistion=-1;
        int upper_square_poistion=-1;
        int lower_square_poistion=-1;
        int diagonal_left_top_square_poistion=-1;
        int diagonal_right_top_square_poistion=-1;
        int diagonal_left_bottom_square_poistion=-1;
        int diagonal_right_bottom_square_poistion=-1;

        if(isNoneBorderSquare(square)){
            left_square_poistion=square-1;
            right_square_poistion=square+1;
            upper_square_poistion=square+total_squares_per_row;
            lower_square_poistion=square-total_squares_per_row;
            diagonal_left_top_square_poistion=square+total_squares_per_row-1;
            diagonal_right_top_square_poistion=square+total_squares_per_row+1;
            diagonal_left_bottom_square_poistion=square-total_squares_per_row-1;
            diagonal_right_bottom_square_poistion=square-total_squares_per_row+1;

            surronding_squares=new int[8];
            surronding_squares[0]=left_square_poistion;
            surronding_squares[1]=right_square_poistion;
            surronding_squares[2]=upper_square_poistion;
            surronding_squares[3]=lower_square_poistion;
            surronding_squares[4]=diagonal_left_top_square_poistion;
            surronding_squares[5]=diagonal_right_top_square_poistion;
            surronding_squares[6]=diagonal_left_bottom_square_poistion;
            surronding_squares[7]=diagonal_right_bottom_square_poistion;

            return surronding_squares;
        }

        //Note : all the 4 corner squares must come before the border squares to differential them
        //since the corner squares are still border squares

        if(isBottomRightCornerSquare(square)){
            left_square_poistion=square-1;
            upper_square_poistion=square+total_squares_per_row;
            diagonal_left_top_square_poistion=square+total_squares_per_row-1;

            surronding_squares=new int[3];
            surronding_squares[0]=left_square_poistion;
            surronding_squares[1]=upper_square_poistion;
            surronding_squares[2]=diagonal_left_top_square_poistion;

            return surronding_squares;
        }

        if(isBottomLeftCornerSquare(square)){
            right_square_poistion=square+1;
            upper_square_poistion=square+total_squares_per_row;
            diagonal_right_top_square_poistion=square+total_squares_per_row+1;

            surronding_squares=new int[3];
            surronding_squares[0]=right_square_poistion;
            surronding_squares[1]=upper_square_poistion;
            surronding_squares[2]=diagonal_right_top_square_poistion;

            return surronding_squares;
        }

        if(isTopRightCornerSquare(square)){
            left_square_poistion=square-1;
            lower_square_poistion=square-total_squares_per_row;
            diagonal_left_bottom_square_poistion=square-total_squares_per_row-1;

            surronding_squares=new int[3];
            surronding_squares[0]=left_square_poistion;
            surronding_squares[1]=lower_square_poistion;
            surronding_squares[2]=diagonal_left_bottom_square_poistion;

            return surronding_squares;
        }

        if(isTopLeftCornerSquare(square)){
            right_square_poistion=square+1;
            lower_square_poistion=square-total_squares_per_row;
            diagonal_right_bottom_square_poistion=square-total_squares_per_row+1;

            surronding_squares=new int[3];
            surronding_squares[0]=right_square_poistion;
            surronding_squares[1]=lower_square_poistion;
            surronding_squares[2]=diagonal_right_bottom_square_poistion;

            return surronding_squares;
        }

        if(isLeftBorderSquare(square)){
            right_square_poistion=square+1;
            upper_square_poistion=square+total_squares_per_row;
            lower_square_poistion=square-total_squares_per_row;
            diagonal_right_top_square_poistion=square+total_squares_per_row+1;
            diagonal_right_bottom_square_poistion=square-total_squares_per_row+1;

            surronding_squares=new int[5];
            surronding_squares[0]=right_square_poistion;
            surronding_squares[1]=upper_square_poistion;
            surronding_squares[2]=lower_square_poistion;
            surronding_squares[3]=diagonal_right_top_square_poistion;
            surronding_squares[4]=diagonal_right_bottom_square_poistion;

            return surronding_squares;
        }


        if(isRightBorderSquare(square)){
            left_square_poistion=square-1;
            upper_square_poistion=square+total_squares_per_row;
            lower_square_poistion=square-total_squares_per_row;
            diagonal_left_top_square_poistion=square+total_squares_per_row-1;
            diagonal_left_bottom_square_poistion=square-total_squares_per_row-1;

            surronding_squares=new int[5];
            surronding_squares[0]=left_square_poistion;
            surronding_squares[1]=upper_square_poistion;
            surronding_squares[2]=lower_square_poistion;
            surronding_squares[3]=diagonal_left_top_square_poistion;
            surronding_squares[4]=diagonal_left_bottom_square_poistion;

            return surronding_squares;
        }

        if(isTopBorderSquare(square)){
            left_square_poistion=square-1;
            right_square_poistion=square+1;
            lower_square_poistion=square-total_squares_per_row;
            diagonal_left_bottom_square_poistion=square-total_squares_per_row-1;
            diagonal_right_bottom_square_poistion=square-total_squares_per_row+1;

            surronding_squares=new int[5];
            surronding_squares[0]=left_square_poistion;
            surronding_squares[1]=right_square_poistion;
            surronding_squares[2]=lower_square_poistion;
            surronding_squares[3]=diagonal_left_bottom_square_poistion;
            surronding_squares[4]=diagonal_right_bottom_square_poistion;

            return surronding_squares;
        }

        if(isBottomBorderSquare(square)){
            left_square_poistion=square-1;
            right_square_poistion=square+1;
            upper_square_poistion=square+total_squares_per_row;
            diagonal_left_top_square_poistion=square+total_squares_per_row-1;
            diagonal_right_top_square_poistion=square+total_squares_per_row+1;

            surronding_squares=new int[5];
            surronding_squares[0]=left_square_poistion;
            surronding_squares[1]=right_square_poistion;
            surronding_squares[2]=upper_square_poistion;
            surronding_squares[3]=diagonal_left_top_square_poistion;
            surronding_squares[4]=diagonal_right_top_square_poistion;

            return surronding_squares;
        }

        return surronding_squares;
    }

    public boolean isNoneBorderSquare(int square){

        if(isLeftBorderSquare(square))
            return false;

        if(isRightBorderSquare(square))
            return false;

        if(isTopBorderSquare(square))
            return false;

        if(isBottomBorderSquare(square))
            return false;

        if(isBottomRightCornerSquare(square))
            return false;

        if(isBottomLeftCornerSquare(square))
            return false;

        if(isTopRightCornerSquare(square))
            return false;

        if(isTopLeftCornerSquare(square))
            return false;

        return true;
    }

    public boolean isLeftBorderSquare(int square){

        for(int i=0; i<total_row; i++){
            if(square==i*total_squares_per_row)
                return true;
        }

        return false;
    }

    public boolean isRightBorderSquare(int square){
        for(int i=0; i<total_row; i++){
            if(square==i*total_squares_per_row+total_squares_per_row-1)
                return true;
        }

        return false;
    }

    public boolean isTopBorderSquare(int square){

        int end_square=total_row*total_squares_per_row-1;

        int start_square=end_square-total_squares_per_row+1;

        if(square>=start_square && square<=end_square)
            return true;

        return false;
    }

    public boolean isBottomBorderSquare(int square){
        int end_square=total_squares_per_row-1;

        int start_square=0;

        if(square>=start_square && square<=end_square)
            return true;

        return false;
    }

    public boolean isTopRightCornerSquare(int square){
        int top_right_corner_square=total_row*total_squares_per_row-1;

        if(square==top_right_corner_square)
            return true;

        return false;
    }

    public boolean isTopLeftCornerSquare(int square){
        int top_left_corner_square=total_row*total_squares_per_row-total_squares_per_row;

        if(square==top_left_corner_square)
            return true;

        return false;
    }

    public boolean isBottomRightCornerSquare(int square){
        int bottom_right_corner_square=total_squares_per_row-1;

        if(square==bottom_right_corner_square)
            return true;

        return false;
    }

    public boolean isBottomLeftCornerSquare(int square){
        int bottom_left_corner_square=0;

        if(square==bottom_left_corner_square)
            return true;

        return false;
    }

    public int[] getUnblockedSurroundingSquares(int square){

        int [] surrouding_squares=getPieceSurrundingSquares(square);
        int len=surrouding_squares.length;
        int [] unblocked_surrouding_squares=new int[len];

        int index=-1;

        for(int i=0; i<len; i++){
            if(this.isSquareEmpty(surrouding_squares[i], -1))
            {
                index=index+1;
                unblocked_surrouding_squares[index]=surrouding_squares[i];
            }
        }

        int []the_unblocked_surrounding_squares= new int[index+1];

        System.arraycopy(unblocked_surrouding_squares, 0, the_unblocked_surrounding_squares, 0, index+1);

        return the_unblocked_surrounding_squares;
    }

    public int[] getBlockedSurrundingSquares(int square){

        int [] surrouding_squares=getPieceSurrundingSquares(square);
        int len=surrouding_squares.length;
        int [] blocked_surrouding_squares=new int[len];

        int index=-1;

        for(int i=0; i<len; i++){
            if(!this.isSquareEmpty(surrouding_squares[i], -1))
            {
                index=index+1;
                blocked_surrouding_squares[index]=surrouding_squares[i];
            }
        }

        int []the_blocked_surrounding_squares= new int[index+1];

        System.arraycopy(blocked_surrouding_squares, 0, the_blocked_surrounding_squares, 0, index+1);

        return the_blocked_surrounding_squares;
    }

    public int[] getVerticalUpwardSquares(int square){

        if(!this.isTopBorderSquare(square)){

            int num_squares=total_row-this.getSquareRowIndex(square)-1;
            int[] the_squares=new int[num_squares];
            for(int i=0; i<num_squares; i++){
                the_squares[i]=square+total_squares_per_row*(i+1);
            }

            return the_squares;
        }

        return  null;
    }

    public int[] getVerticalDownwardSquares(int square){
        int[] the_squares = null;

        if(!this.isBottomBorderSquare(square)){
            int num_squares=this.getSquareRowIndex(square);
            the_squares=new int[num_squares];
            for(int i=0; i<num_squares; i++){
                the_squares[i]=square-total_squares_per_row*(i+1);
            }

        }

        return  the_squares;
    }

    public int[] getHorizontalRightwardSquares(int square){
        int[] the_squares=null;

        if(!this.isRightBorderSquare(square)){
            int num_squares=total_squares_per_row-this.getSquareColumnIndex(square)-1;
            the_squares=new int[num_squares];
            for(int i=0; i<num_squares; i++){
                the_squares[i]=square + i + 1;
            }

        }

        return  the_squares;
    }

    public int[] getHorizontalLeftwardSquares(int square){
        int[] the_squares=null;

        if(!this.isLeftBorderSquare(square)){
            int num_squares=this.getSquareColumnIndex(square);
             the_squares=new int[num_squares];
            for(int i=0; i<num_squares; i++){
                the_squares[i]=square - i - 1;
            }

        }

        return  the_squares;
    }

    public int[] getTopRightDiagonalSquares(int square){
        int[] the_squares=null;

        if(!this.isTopBorderSquare(square) && !this.isRightBorderSquare(square) ){

            int num_1=total_row-this.getSquareRowIndex(square)-1;
            int num_2=total_squares_per_row-this.getSquareColumnIndex(square)-1;

            int num_squares=num_1;

            if(num_squares>num_2)
                num_squares=num_2;

            the_squares=new int[num_squares];

            for(int i=0; i<num_squares; i++){
                the_squares[i]=square+total_squares_per_row*(i+1)+i+1;
            }

        }

        return  the_squares;
    }

    public int[] getTopLeftDiagonalSquares(int square){
        int[] the_squares=null;

        if(!this.isTopBorderSquare(square) && !this.isLeftBorderSquare(square) ){

            int num_1=total_row-this.getSquareRowIndex(square)-1;
            int num_2=this.getSquareColumnIndex(square);

            int num_squares=num_1;

            if(num_squares>num_2)
                num_squares=num_2;

            the_squares=new int[num_squares];

            for(int i=0; i<num_squares; i++){
                the_squares[i]=square+total_squares_per_row*(i+1)-i-1;
            }
        }

        return  the_squares;
    }

    public int[] getBottomRightDiagonalSquares(int square){
        int[] the_squares = null;

        if(!this.isBottomBorderSquare(square) && !this.isRightBorderSquare(square) ){
            int num_1=this.getSquareRowIndex(square);
            int num_2=total_squares_per_row-this.getSquareColumnIndex(square)-1;

            int num_squares=num_1;

            if(num_squares>num_2)
                num_squares=num_2;

            the_squares=new int[num_squares];

            for(int i=0; i<num_squares; i++){
                the_squares[i]=square-total_squares_per_row*(i+1)+i+1;
            }
        }

        return  the_squares;
    }

    public int[] getBottomLeftDiagonalSquares(int square){
        int[] the_squares = null;

        if(!this.isBottomBorderSquare(square) && !this.isLeftBorderSquare(square) ){
            int num_1=this.getSquareRowIndex(square);
            int num_2=this.getSquareColumnIndex(square);

            int num_squares=num_1;

            if(num_squares>num_2)
                num_squares=num_2;

            the_squares=new int[num_squares];

            for(int i=0; i<num_squares; i++){
                the_squares[i]=square-total_squares_per_row*(i+1)-i-1;
            }
        }

        return  the_squares;
    }

    public int[] getVerticalUpwardSquares_1(int square){

            switch(square){
                case 0 : return new int[]{8,16,24,32,40,48,56};
                case 1 : return new int[]{9,17,25,33,41,49,57};
                case 2 : return new int[]{10,18,26,34,42,50,58};
                case 3 : return new int[]{11,19,27,35,43,51,59};
                case 4 : return new int[]{12,20,28,36,44,52,60};
                case 5 : return new int[]{13,21,29,37,45,53,61};
                case 6 : return new int[]{14,22,30,38,46,54,62};
                case 7 : return new int[]{15,23,31,39,47,55,63};
                case 8 : return new int[]{16,24,32,40,48,56};
                case 9 : return new int[]{17,25,33,41,49,57};
                case 10 : return new int[]{18,26,34,42,50,58};
                case 11 : return new int[]{19,27,35,43,51,59};
                case 12 : return new int[]{20,28,36,44,52,60};
                case 13 : return new int[]{21,29,37,45,53,61};
                case 14 : return new int[]{22,30,38,46,54,62};
                case 15 : return new int[]{23,31,39,47,55,63};
                case 16 : return new int[]{24,32,40,48,56};
                case 17 : return new int[]{25,33,41,49,57};
                case 18 : return new int[]{26,34,42,50,58};
                case 19 : return new int[]{27,35,43,51,59};
                case 20 : return new int[]{28,36,44,52,60};
                case 21 : return new int[]{29,37,45,53,61};
                case 22 : return new int[]{30,38,46,54,62};
                case 23 : return new int[]{31,39,47,55,63};
                case 24 : return new int[]{32,40,48,56};
                case 25 : return new int[]{33,41,49,57};
                case 26 : return new int[]{34,42,50,58};
                case 27 : return new int[]{35,43,51,59};
                case 28 : return new int[]{36,44,52,60};
                case 29 : return new int[]{37,45,53,61};
                case 30 : return new int[]{38,46,54,62};
                case 31 : return new int[]{39,47,55,63};
                case 32 : return new int[]{40,48,56};
                case 33 : return new int[]{41,49,57};
                case 34 : return new int[]{42,50,58};
                case 35 : return new int[]{43,51,59};
                case 36 : return new int[]{44,52,60};
                case 37 : return new int[]{45,53,61};
                case 38 : return new int[]{46,54,62};
                case 39 : return new int[]{47,55,63};
                case 40 : return new int[]{48,56};
                case 41 : return new int[]{49,57};
                case 42 : return new int[]{50,58};
                case 43 : return new int[]{51,59};
                case 44 : return new int[]{52,60};
                case 45 : return new int[]{53,61};
                case 46 : return new int[]{54,62};
                case 47 : return new int[]{55,63};
                case 48 : return new int[]{56};
                case 49 : return new int[]{57};
                case 50 : return new int[]{58};
                case 51 : return new int[]{59};
                case 52 : return new int[]{60};
                case 53 : return new int[]{61};
                case 54 : return new int[]{62};
                case 55 : return new int[]{63};
                case 56 : return new int[]{};
                case 57 : return new int[]{};
                case 58 : return new int[]{};
                case 59 : return new int[]{};
                case 60 : return new int[]{};
                case 61 : return new int[]{};
                case 62 : return new int[]{};
                case 63 : return new int[]{};
            }

        return  new int[0];
    }

    public int[] getVerticalDownwardSquares_1(int square){
            
            switch(square){
                case 0 : return new int[]{};
                case 1 : return new int[]{};
                case 2 : return new int[]{};
                case 3 : return new int[]{};
                case 4 : return new int[]{};
                case 5 : return new int[]{};
                case 6 : return new int[]{};
                case 7 : return new int[]{};
                case 8 : return new int[]{0};
                case 9 : return new int[]{1};
                case 10 : return new int[]{2};
                case 11 : return new int[]{3};
                case 12 : return new int[]{4};
                case 13 : return new int[]{5};
                case 14 : return new int[]{6};
                case 15 : return new int[]{7};
                case 16 : return new int[]{8,0};
                case 17 : return new int[]{9,1};
                case 18 : return new int[]{10,2};
                case 19 : return new int[]{11,3};
                case 20 : return new int[]{12,4};
                case 21 : return new int[]{13,5};
                case 22 : return new int[]{14,6};
                case 23 : return new int[]{15,7};
                case 24 : return new int[]{16,8,0};
                case 25 : return new int[]{17,9,1};
                case 26 : return new int[]{18,10,2};
                case 27 : return new int[]{19,11,3};
                case 28 : return new int[]{20,12,4};
                case 29 : return new int[]{21,13,5};
                case 30 : return new int[]{22,14,6};
                case 31 : return new int[]{23,15,7};
                case 32 : return new int[]{24,16,8,0};
                case 33 : return new int[]{25,17,9,1};
                case 34 : return new int[]{26,18,10,2};
                case 35 : return new int[]{27,19,11,3};
                case 36 : return new int[]{28,20,12,4};
                case 37 : return new int[]{29,21,13,5};
                case 38 : return new int[]{30,22,14,6};
                case 39 : return new int[]{31,23,15,7};
                case 40 : return new int[]{32,24,16,8,0};
                case 41 : return new int[]{33,25,17,9,1};
                case 42 : return new int[]{34,26,18,10,2};
                case 43 : return new int[]{35,27,19,11,3};
                case 44 : return new int[]{36,28,20,12,4};
                case 45 : return new int[]{37,29,21,13,5};
                case 46 : return new int[]{38,30,22,14,6};
                case 47 : return new int[]{39,31,23,15,7};
                case 48 : return new int[]{40,32,24,16,8,0};
                case 49 : return new int[]{41,33,25,17,9,1};
                case 50 : return new int[]{42,34,26,18,10,2};
                case 51 : return new int[]{43,35,27,19,11,3};
                case 52 : return new int[]{44,36,28,20,12,4};
                case 53 : return new int[]{45,37,29,21,13,5};
                case 54 : return new int[]{46,38,30,22,14,6};
                case 55 : return new int[]{47,39,31,23,15,7};
                case 56 : return new int[]{48,40,32,24,16,8,0};
                case 57 : return new int[]{49,41,33,25,17,9,1};
                case 58 : return new int[]{50,42,34,26,18,10,2};
                case 59 : return new int[]{51,43,35,27,19,11,3};
                case 60 : return new int[]{52,44,36,28,20,12,4};
                case 61 : return new int[]{53,45,37,29,21,13,5};
                case 62 : return new int[]{54,46,38,30,22,14,6};
                case 63 : return new int[]{55,47,39,31,23,15,7};
            }
            
        return  new int[0];
    }

    public int[] getHorizontalRightwardSquares_1(int square){
            
            switch(square){
                case 0 : return new int[]{1,2,3,4,5,6,7};
                case 1 : return new int[]{2,3,4,5,6,7};
                case 2 : return new int[]{3,4,5,6,7};
                case 3 : return new int[]{4,5,6,7};
                case 4 : return new int[]{5,6,7};
                case 5 : return new int[]{6,7};
                case 6 : return new int[]{7};
                case 7 : return new int[]{};
                case 8 : return new int[]{9,10,11,12,13,14,15};
                case 9 : return new int[]{10,11,12,13,14,15};
                case 10 : return new int[]{11,12,13,14,15};
                case 11 : return new int[]{12,13,14,15};
                case 12 : return new int[]{13,14,15};
                case 13 : return new int[]{14,15};
                case 14 : return new int[]{15};
                case 15 : return new int[]{};
                case 16 : return new int[]{17,18,19,20,21,22,23};
                case 17 : return new int[]{18,19,20,21,22,23};
                case 18 : return new int[]{19,20,21,22,23};
                case 19 : return new int[]{20,21,22,23};
                case 20 : return new int[]{21,22,23};
                case 21 : return new int[]{22,23};
                case 22 : return new int[]{23};
                case 23 : return new int[]{};
                case 24 : return new int[]{25,26,27,28,29,30,31};
                case 25 : return new int[]{26,27,28,29,30,31};
                case 26 : return new int[]{27,28,29,30,31};
                case 27 : return new int[]{28,29,30,31};
                case 28 : return new int[]{29,30,31};
                case 29 : return new int[]{30,31};
                case 30 : return new int[]{31};
                case 31 : return new int[]{};
                case 32 : return new int[]{33,34,35,36,37,38,39};
                case 33 : return new int[]{34,35,36,37,38,39};
                case 34 : return new int[]{35,36,37,38,39};
                case 35 : return new int[]{36,37,38,39};
                case 36 : return new int[]{37,38,39};
                case 37 : return new int[]{38,39};
                case 38 : return new int[]{39};
                case 39 : return new int[]{};
                case 40 : return new int[]{41,42,43,44,45,46,47};
                case 41 : return new int[]{42,43,44,45,46,47};
                case 42 : return new int[]{43,44,45,46,47};
                case 43 : return new int[]{44,45,46,47};
                case 44 : return new int[]{45,46,47};
                case 45 : return new int[]{46,47};
                case 46 : return new int[]{47};
                case 47 : return new int[]{};
                case 48 : return new int[]{49,50,51,52,53,54,55};
                case 49 : return new int[]{50,51,52,53,54,55};
                case 50 : return new int[]{51,52,53,54,55};
                case 51 : return new int[]{52,53,54,55};
                case 52 : return new int[]{53,54,55};
                case 53 : return new int[]{54,55};
                case 54 : return new int[]{55};
                case 55 : return new int[]{};
                case 56 : return new int[]{57,58,59,60,61,62,63};
                case 57 : return new int[]{58,59,60,61,62,63};
                case 58 : return new int[]{59,60,61,62,63};
                case 59 : return new int[]{60,61,62,63};
                case 60 : return new int[]{61,62,63};
                case 61 : return new int[]{62,63};
                case 62 : return new int[]{63};
                case 63 : return new int[]{};
            }
            
        return  new int[0];
    }

    public int[] getHorizontalLeftwardSquares_1(int square){
            
            switch(square){
                case 0 : return new int[]{};
                case 1 : return new int[]{0};
                case 2 : return new int[]{1,0};
                case 3 : return new int[]{2,1,0};
                case 4 : return new int[]{3,2,1,0};
                case 5 : return new int[]{4,3,2,1,0};
                case 6 : return new int[]{5,4,3,2,1,0};
                case 7 : return new int[]{6,5,4,3,2,1,0};
                case 8 : return new int[]{};
                case 9 : return new int[]{8};
                case 10 : return new int[]{9,8};
                case 11 : return new int[]{10,9,8};
                case 12 : return new int[]{11,10,9,8};
                case 13 : return new int[]{12,11,10,9,8};
                case 14 : return new int[]{13,12,11,10,9,8};
                case 15 : return new int[]{14,13,12,11,10,9,8};
                case 16 : return new int[]{};
                case 17 : return new int[]{16};
                case 18 : return new int[]{17,16};
                case 19 : return new int[]{18,17,16};
                case 20 : return new int[]{19,18,17,16};
                case 21 : return new int[]{20,19,18,17,16};
                case 22 : return new int[]{21,20,19,18,17,16};
                case 23 : return new int[]{22,21,20,19,18,17,16};
                case 24 : return new int[]{};
                case 25 : return new int[]{24};
                case 26 : return new int[]{25,24};
                case 27 : return new int[]{26,25,24};
                case 28 : return new int[]{27,26,25,24};
                case 29 : return new int[]{28,27,26,25,24};
                case 30 : return new int[]{29,28,27,26,25,24};
                case 31 : return new int[]{30,29,28,27,26,25,24};
                case 32 : return new int[]{};
                case 33 : return new int[]{32};
                case 34 : return new int[]{33,32};
                case 35 : return new int[]{34,33,32};
                case 36 : return new int[]{35,34,33,32};
                case 37 : return new int[]{36,35,34,33,32};
                case 38 : return new int[]{37,36,35,34,33,32};
                case 39 : return new int[]{38,37,36,35,34,33,32};
                case 40 : return new int[]{};
                case 41 : return new int[]{40};
                case 42 : return new int[]{41,40};
                case 43 : return new int[]{42,41,40};
                case 44 : return new int[]{43,42,41,40};
                case 45 : return new int[]{44,43,42,41,40};
                case 46 : return new int[]{45,44,43,42,41,40};
                case 47 : return new int[]{46,45,44,43,42,41,40};
                case 48 : return new int[]{};
                case 49 : return new int[]{48};
                case 50 : return new int[]{49,48};
                case 51 : return new int[]{50,49,48};
                case 52 : return new int[]{51,50,49,48};
                case 53 : return new int[]{52,51,50,49,48};
                case 54 : return new int[]{53,52,51,50,49,48};
                case 55 : return new int[]{54,53,52,51,50,49,48};
                case 56 : return new int[]{};
                case 57 : return new int[]{56};
                case 58 : return new int[]{57,56};
                case 59 : return new int[]{58,57,56};
                case 60 : return new int[]{59,58,57,56};
                case 61 : return new int[]{60,59,58,57,56};
                case 62 : return new int[]{61,60,59,58,57,56};
                case 63 : return new int[]{62,61,60,59,58,57,56};
            }
            
        return  new int[0];
    }

    public int[] getTopRightDiagonalSquares_1(int square){
            
            switch(square){
                case 0 : return new int[]{9,18,27,36,45,54,63};
                case 1 : return new int[]{10,19,28,37,46,55};
                case 2 : return new int[]{11,20,29,38,47};
                case 3 : return new int[]{12,21,30,39};
                case 4 : return new int[]{13,22,31};
                case 5 : return new int[]{14,23};
                case 6 : return new int[]{15};
                case 7 : return new int[]{};
                case 8 : return new int[]{17,26,35,44,53,62};
                case 9 : return new int[]{18,27,36,45,54,63};
                case 10 : return new int[]{19,28,37,46,55};
                case 11 : return new int[]{20,29,38,47};
                case 12 : return new int[]{21,30,39};
                case 13 : return new int[]{22,31};
                case 14 : return new int[]{23};
                case 15 : return new int[]{};
                case 16 : return new int[]{25,34,43,52,61};
                case 17 : return new int[]{26,35,44,53,62};
                case 18 : return new int[]{27,36,45,54,63};
                case 19 : return new int[]{28,37,46,55};
                case 20 : return new int[]{29,38,47};
                case 21 : return new int[]{30,39};
                case 22 : return new int[]{31};
                case 23 : return new int[]{};
                case 24 : return new int[]{33,42,51,60};
                case 25 : return new int[]{34,43,52,61};
                case 26 : return new int[]{35,44,53,62};
                case 27 : return new int[]{36,45,54,63};
                case 28 : return new int[]{37,46,55};
                case 29 : return new int[]{38,47};
                case 30 : return new int[]{39};
                case 31 : return new int[]{};
                case 32 : return new int[]{41,50,59};
                case 33 : return new int[]{42,51,60};
                case 34 : return new int[]{43,52,61};
                case 35 : return new int[]{44,53,62};
                case 36 : return new int[]{45,54,63};
                case 37 : return new int[]{46,55};
                case 38 : return new int[]{47};
                case 39 : return new int[]{};
                case 40 : return new int[]{49,58};
                case 41 : return new int[]{50,59};
                case 42 : return new int[]{51,60};
                case 43 : return new int[]{52,61};
                case 44 : return new int[]{53,62};
                case 45 : return new int[]{54,63};
                case 46 : return new int[]{55};
                case 47 : return new int[]{};
                case 48 : return new int[]{57};
                case 49 : return new int[]{58};
                case 50 : return new int[]{59};
                case 51 : return new int[]{60};
                case 52 : return new int[]{61};
                case 53 : return new int[]{62};
                case 54 : return new int[]{63};
                case 55 : return new int[]{};
                case 56 : return new int[]{};
                case 57 : return new int[]{};
                case 58 : return new int[]{};
                case 59 : return new int[]{};
                case 60 : return new int[]{};
                case 61 : return new int[]{};
                case 62 : return new int[]{};
                case 63 : return new int[]{};
            }
        return  new int[0];
    }

    public int[] getTopLeftDiagonalSquares_1(int square){
            
            switch(square){
                case 0 : return new int[]{};
                case 1 : return new int[]{8};
                case 2 : return new int[]{9,16};
                case 3 : return new int[]{10,17,24};
                case 4 : return new int[]{11,18,25,32};
                case 5 : return new int[]{12,19,26,33,40};
                case 6 : return new int[]{13,20,27,34,41,48};
                case 7 : return new int[]{14,21,28,35,42,49,56};
                case 8 : return new int[]{};
                case 9 : return new int[]{16};
                case 10 : return new int[]{17,24};
                case 11 : return new int[]{18,25,32};
                case 12 : return new int[]{19,26,33,40};
                case 13 : return new int[]{20,27,34,41,48};
                case 14 : return new int[]{21,28,35,42,49,56};
                case 15 : return new int[]{22,29,36,43,50,57};
                case 16 : return new int[]{};
                case 17 : return new int[]{24};
                case 18 : return new int[]{25,32};
                case 19 : return new int[]{26,33,40};
                case 20 : return new int[]{27,34,41,48};
                case 21 : return new int[]{28,35,42,49,56};
                case 22 : return new int[]{29,36,43,50,57};
                case 23 : return new int[]{30,37,44,51,58};
                case 24 : return new int[]{};
                case 25 : return new int[]{32};
                case 26 : return new int[]{33,40};
                case 27 : return new int[]{34,41,48};
                case 28 : return new int[]{35,42,49,56};
                case 29 : return new int[]{36,43,50,57};
                case 30 : return new int[]{37,44,51,58};
                case 31 : return new int[]{38,45,52,59};
                case 32 : return new int[]{};
                case 33 : return new int[]{40};
                case 34 : return new int[]{41,48};
                case 35 : return new int[]{42,49,56};
                case 36 : return new int[]{43,50,57};
                case 37 : return new int[]{44,51,58};
                case 38 : return new int[]{45,52,59};
                case 39 : return new int[]{46,53,60};
                case 40 : return new int[]{};
                case 41 : return new int[]{48};
                case 42 : return new int[]{49,56};
                case 43 : return new int[]{50,57};
                case 44 : return new int[]{51,58};
                case 45 : return new int[]{52,59};
                case 46 : return new int[]{53,60};
                case 47 : return new int[]{54,61};
                case 48 : return new int[]{};
                case 49 : return new int[]{56};
                case 50 : return new int[]{57};
                case 51 : return new int[]{58};
                case 52 : return new int[]{59};
                case 53 : return new int[]{60};
                case 54 : return new int[]{61};
                case 55 : return new int[]{62};
                case 56 : return new int[]{};
                case 57 : return new int[]{};
                case 58 : return new int[]{};
                case 59 : return new int[]{};
                case 60 : return new int[]{};
                case 61 : return new int[]{};
                case 62 : return new int[]{};
                case 63 : return new int[]{};
            }
            
        return  new int[0];
    }

    public int[] getBottomRightDiagonalSquares_1(int square){
            
            switch(square){
                case 0 : return new int[]{};
                case 1 : return new int[]{};
                case 2 : return new int[]{};
                case 3 : return new int[]{};
                case 4 : return new int[]{};
                case 5 : return new int[]{};
                case 6 : return new int[]{};
                case 7 : return new int[]{};
                case 8 : return new int[]{1};
                case 9 : return new int[]{2};
                case 10 : return new int[]{3};
                case 11 : return new int[]{4};
                case 12 : return new int[]{5};
                case 13 : return new int[]{6};
                case 14 : return new int[]{7};
                case 15 : return new int[]{};
                case 16 : return new int[]{9,2};
                case 17 : return new int[]{10,3};
                case 18 : return new int[]{11,4};
                case 19 : return new int[]{12,5};
                case 20 : return new int[]{13,6};
                case 21 : return new int[]{14,7};
                case 22 : return new int[]{15};
                case 23 : return new int[]{};
                case 24 : return new int[]{17,10,3};
                case 25 : return new int[]{18,11,4};
                case 26 : return new int[]{19,12,5};
                case 27 : return new int[]{20,13,6};
                case 28 : return new int[]{21,14,7};
                case 29 : return new int[]{22,15};
                case 30 : return new int[]{23};
                case 31 : return new int[]{};
                case 32 : return new int[]{25,18,11,4};
                case 33 : return new int[]{26,19,12,5};
                case 34 : return new int[]{27,20,13,6};
                case 35 : return new int[]{28,21,14,7};
                case 36 : return new int[]{29,22,15};
                case 37 : return new int[]{30,23};
                case 38 : return new int[]{31};
                case 39 : return new int[]{};
                case 40 : return new int[]{33,26,19,12,5};
                case 41 : return new int[]{34,27,20,13,6};
                case 42 : return new int[]{35,28,21,14,7};
                case 43 : return new int[]{36,29,22,15};
                case 44 : return new int[]{37,30,23};
                case 45 : return new int[]{38,31};
                case 46 : return new int[]{39};
                case 47 : return new int[]{};
                case 48 : return new int[]{41,34,27,20,13,6};
                case 49 : return new int[]{42,35,28,21,14,7};
                case 50 : return new int[]{43,36,29,22,15};
                case 51 : return new int[]{44,37,30,23};
                case 52 : return new int[]{45,38,31};
                case 53 : return new int[]{46,39};
                case 54 : return new int[]{47};
                case 55 : return new int[]{};
                case 56 : return new int[]{49,42,35,28,21,14,7};
                case 57 : return new int[]{50,43,36,29,22,15};
                case 58 : return new int[]{51,44,37,30,23};
                case 59 : return new int[]{52,45,38,31};
                case 60 : return new int[]{53,46,39};
                case 61 : return new int[]{54,47};
                case 62 : return new int[]{55};
                case 63 : return new int[]{};
            }
            
        return new int[0];
    }

    public int[] getBottomLeftDiagonalSquares_1(int square){
            
            switch(square){
                case 0 : return new int[]{};
                case 1 : return new int[]{};
                case 2 : return new int[]{};
                case 3 : return new int[]{};
                case 4 : return new int[]{};
                case 5 : return new int[]{};
                case 6 : return new int[]{};
                case 7 : return new int[]{};
                case 8 : return new int[]{};
                case 9 : return new int[]{0};
                case 10 : return new int[]{1};
                case 11 : return new int[]{2};
                case 12 : return new int[]{3};
                case 13 : return new int[]{4};
                case 14 : return new int[]{5};
                case 15 : return new int[]{6};
                case 16 : return new int[]{};
                case 17 : return new int[]{8};
                case 18 : return new int[]{9,0};
                case 19 : return new int[]{10,1};
                case 20 : return new int[]{11,2};
                case 21 : return new int[]{12,3};
                case 22 : return new int[]{13,4};
                case 23 : return new int[]{14,5};
                case 24 : return new int[]{};
                case 25 : return new int[]{16};
                case 26 : return new int[]{17,8};
                case 27 : return new int[]{18,9,0};
                case 28 : return new int[]{19,10,1};
                case 29 : return new int[]{20,11,2};
                case 30 : return new int[]{21,12,3};
                case 31 : return new int[]{22,13,4};
                case 32 : return new int[]{};
                case 33 : return new int[]{24};
                case 34 : return new int[]{25,16};
                case 35 : return new int[]{26,17,8};
                case 36 : return new int[]{27,18,9,0};
                case 37 : return new int[]{28,19,10,1};
                case 38 : return new int[]{29,20,11,2};
                case 39 : return new int[]{30,21,12,3};
                case 40 : return new int[]{};
                case 41 : return new int[]{32};
                case 42 : return new int[]{33,24};
                case 43 : return new int[]{34,25,16};
                case 44 : return new int[]{35,26,17,8};
                case 45 : return new int[]{36,27,18,9,0};
                case 46 : return new int[]{37,28,19,10,1};
                case 47 : return new int[]{38,29,20,11,2};
                case 48 : return new int[]{};
                case 49 : return new int[]{40};
                case 50 : return new int[]{41,32};
                case 51 : return new int[]{42,33,24};
                case 52 : return new int[]{43,34,25,16};
                case 53 : return new int[]{44,35,26,17,8};
                case 54 : return new int[]{45,36,27,18,9,0};
                case 55 : return new int[]{46,37,28,19,10,1};
                case 56 : return new int[]{};
                case 57 : return new int[]{48};
                case 58 : return new int[]{49,40};
                case 59 : return new int[]{50,41,32};
                case 60 : return new int[]{51,42,33,24};
                case 61 : return new int[]{52,43,34,25,16};
                case 62 : return new int[]{53,44,35,26,17,8};
                case 63 : return new int[]{54,45,36,27,18,9,0};
            }
            
        return  new int[0];
    }
    
    public int[] getKnightCapturableSquares_1(int square){
            
            switch(square){
                case 0 : return new int[]{17,10};
                case 1 : return new int[]{16,18,11};
                case 2 : return new int[]{17,19,8,12};
                case 3 : return new int[]{18,20,9,13};
                case 4 : return new int[]{19,21,10,14};
                case 5 : return new int[]{20,22,11,15};
                case 6 : return new int[]{21,23,12};
                case 7 : return new int[]{22,13};
                case 8 : return new int[]{25,18,2};
                case 9 : return new int[]{24,26,19,3};
                case 10 : return new int[]{25,27,16,0,20,4};
                case 11 : return new int[]{26,28,17,1,21,5};
                case 12 : return new int[]{27,29,18,2,22,6};
                case 13 : return new int[]{28,30,19,3,23,7};
                case 14 : return new int[]{29,31,20,4};
                case 15 : return new int[]{30,21,5};
                case 16 : return new int[]{33,1,26,10};
                case 17 : return new int[]{32,34,0,2,27,11};
                case 18 : return new int[]{33,35,1,3,24,8,28,12};
                case 19 : return new int[]{34,36,2,4,25,9,29,13};
                case 20 : return new int[]{35,37,3,5,26,10,30,14};
                case 21 : return new int[]{36,38,4,6,27,11,31,15};
                case 22 : return new int[]{37,39,5,7,28,12};
                case 23 : return new int[]{38,6,29,13};
                case 24 : return new int[]{41,9,34,18};
                case 25 : return new int[]{40,42,8,10,35,19};
                case 26 : return new int[]{41,43,9,11,32,16,36,20};
                case 27 : return new int[]{42,44,10,12,33,17,37,21};
                case 28 : return new int[]{43,45,11,13,34,18,38,22};
                case 29 : return new int[]{44,46,12,14,35,19,39,23};
                case 30 : return new int[]{45,47,13,15,36,20};
                case 31 : return new int[]{46,14,37,21};
                case 32 : return new int[]{49,17,42,26};
                case 33 : return new int[]{48,50,16,18,43,27};
                case 34 : return new int[]{49,51,17,19,40,24,44,28};
                case 35 : return new int[]{50,52,18,20,41,25,45,29};
                case 36 : return new int[]{51,53,19,21,42,26,46,30};
                case 37 : return new int[]{52,54,20,22,43,27,47,31};
                case 38 : return new int[]{53,55,21,23,44,28};
                case 39 : return new int[]{54,22,45,29};
                case 40 : return new int[]{57,25,50,34};
                case 41 : return new int[]{56,58,24,26,51,35};
                case 42 : return new int[]{57,59,25,27,48,32,52,36};
                case 43 : return new int[]{58,60,26,28,49,33,53,37};
                case 44 : return new int[]{59,61,27,29,50,34,54,38};
                case 45 : return new int[]{60,62,28,30,51,35,55,39};
                case 46 : return new int[]{61,63,29,31,52,36};
                case 47 : return new int[]{62,30,53,37};
                case 48 : return new int[]{33,58,42};
                case 49 : return new int[]{32,34,59,43};
                case 50 : return new int[]{33,35,56,40,60,44};
                case 51 : return new int[]{34,36,57,41,61,45};
                case 52 : return new int[]{35,37,58,42,62,46};
                case 53 : return new int[]{36,38,59,43,63,47};
                case 54 : return new int[]{37,39,60,44};
                case 55 : return new int[]{38,61,45};
                case 56 : return new int[]{41,50};
                case 57 : return new int[]{40,42,51};
                case 58 : return new int[]{41,43,48,52};
                case 59 : return new int[]{42,44,49,53};
                case 60 : return new int[]{43,45,50,54};
                case 61 : return new int[]{44,46,51,55};
                case 62 : return new int[]{45,47,52};
                case 63 : return new int[]{46,53};
            } 
            
        return new int[0];
    }

    
    public int[] getPawnCapturableSquares_1(int square, int piece_side){
        
        switch(piece_side){
                case Side.white: switch(square){
                                        case 0 : return new int[]{9};
                                        case 1 : return new int[]{10,8};
                                        case 2 : return new int[]{11,9};
                                        case 3 : return new int[]{12,10};
                                        case 4 : return new int[]{13,11};
                                        case 5 : return new int[]{14,12};
                                        case 6 : return new int[]{15,13};
                                        case 7 : return new int[]{14};
                                        case 8 : return new int[]{17};
                                        case 9 : return new int[]{18,16};
                                        case 10 : return new int[]{19,17};
                                        case 11 : return new int[]{20,18};
                                        case 12 : return new int[]{21,19};
                                        case 13 : return new int[]{22,20};
                                        case 14 : return new int[]{23,21};
                                        case 15 : return new int[]{22};
                                        case 16 : return new int[]{25};
                                        case 17 : return new int[]{26,24};
                                        case 18 : return new int[]{27,25};
                                        case 19 : return new int[]{28,26};
                                        case 20 : return new int[]{29,27};
                                        case 21 : return new int[]{30,28};
                                        case 22 : return new int[]{31,29};
                                        case 23 : return new int[]{30};
                                        case 24 : return new int[]{33};
                                        case 25 : return new int[]{34,32};
                                        case 26 : return new int[]{35,33};
                                        case 27 : return new int[]{36,34};
                                        case 28 : return new int[]{37,35};
                                        case 29 : return new int[]{38,36};
                                        case 30 : return new int[]{39,37};
                                        case 31 : return new int[]{38};
                                        case 32 : return new int[]{41};
                                        case 33 : return new int[]{42,40};
                                        case 34 : return new int[]{43,41};
                                        case 35 : return new int[]{44,42};
                                        case 36 : return new int[]{45,43};
                                        case 37 : return new int[]{46,44};
                                        case 38 : return new int[]{47,45};
                                        case 39 : return new int[]{46};
                                        case 40 : return new int[]{49};
                                        case 41 : return new int[]{50,48};
                                        case 42 : return new int[]{51,49};
                                        case 43 : return new int[]{52,50};
                                        case 44 : return new int[]{53,51};
                                        case 45 : return new int[]{54,52};
                                        case 46 : return new int[]{55,53};
                                        case 47 : return new int[]{54};
                                        case 48 : return new int[]{57};
                                        case 49 : return new int[]{58,56};
                                        case 50 : return new int[]{59,57};
                                        case 51 : return new int[]{60,58};
                                        case 52 : return new int[]{61,59};
                                        case 53 : return new int[]{62,60};
                                        case 54 : return new int[]{63,61};
                                        case 55 : return new int[]{62};
                                        case 56 : return new int[]{};
                                        case 57 : return new int[]{};
                                        case 58 : return new int[]{};
                                        case 59 : return new int[]{};
                                        case 60 : return new int[]{};
                                        case 61 : return new int[]{};
                                        case 62 : return new int[]{};
                                        case 63 : return new int[]{};
                                }  
                    
                case Side.black: switch(square){
                                        case 0 : return new int[]{};
                                        case 1 : return new int[]{};
                                        case 2 : return new int[]{};
                                        case 3 : return new int[]{};
                                        case 4 : return new int[]{};
                                        case 5 : return new int[]{};
                                        case 6 : return new int[]{};
                                        case 7 : return new int[]{};
                                        case 8 : return new int[]{1};
                                        case 9 : return new int[]{2,0};
                                        case 10 : return new int[]{3,1};
                                        case 11 : return new int[]{4,2};
                                        case 12 : return new int[]{5,3};
                                        case 13 : return new int[]{6,4};
                                        case 14 : return new int[]{7,5};
                                        case 15 : return new int[]{6};
                                        case 16 : return new int[]{9};
                                        case 17 : return new int[]{10,8};
                                        case 18 : return new int[]{11,9};
                                        case 19 : return new int[]{12,10};
                                        case 20 : return new int[]{13,11};
                                        case 21 : return new int[]{14,12};
                                        case 22 : return new int[]{15,13};
                                        case 23 : return new int[]{14};
                                        case 24 : return new int[]{17};
                                        case 25 : return new int[]{18,16};
                                        case 26 : return new int[]{19,17};
                                        case 27 : return new int[]{20,18};
                                        case 28 : return new int[]{21,19};
                                        case 29 : return new int[]{22,20};
                                        case 30 : return new int[]{23,21};
                                        case 31 : return new int[]{22};
                                        case 32 : return new int[]{25};
                                        case 33 : return new int[]{26,24};
                                        case 34 : return new int[]{27,25};
                                        case 35 : return new int[]{28,26};
                                        case 36 : return new int[]{29,27};
                                        case 37 : return new int[]{30,28};
                                        case 38 : return new int[]{31,29};
                                        case 39 : return new int[]{30};
                                        case 40 : return new int[]{33};
                                        case 41 : return new int[]{34,32};
                                        case 42 : return new int[]{35,33};
                                        case 43 : return new int[]{36,34};
                                        case 44 : return new int[]{37,35};
                                        case 45 : return new int[]{38,36};
                                        case 46 : return new int[]{39,37};
                                        case 47 : return new int[]{38};
                                        case 48 : return new int[]{41};
                                        case 49 : return new int[]{42,40};
                                        case 50 : return new int[]{43,41};
                                        case 51 : return new int[]{44,42};
                                        case 52 : return new int[]{45,43};
                                        case 53 : return new int[]{46,44};
                                        case 54 : return new int[]{47,45};
                                        case 55 : return new int[]{46};
                                        case 56 : return new int[]{49};
                                        case 57 : return new int[]{50,48};
                                        case 58 : return new int[]{51,49};
                                        case 59 : return new int[]{52,50};
                                        case 60 : return new int[]{53,51};
                                        case 61 : return new int[]{54,52};
                                        case 62 : return new int[]{55,53};
                                        case 63 : return new int[]{54};
                                    }                        
        }
        
        return null;
    }
                
    public int[] get_KING_CapturableSquares_1(int square){

            switch(square){
                case 0 : return new int[]{8,1,9};
                case 1 : return new int[]{9,0,2,10,8};
                case 2 : return new int[]{10,1,3,11,9};
                case 3 : return new int[]{11,2,4,12,10};
                case 4 : return new int[]{12,3,5,13,11};
                case 5 : return new int[]{13,4,6,14,12};
                case 6 : return new int[]{14,5,7,15,13};
                case 7 : return new int[]{15,6,14};
                case 8 : return new int[]{16,0,9,17,1};
                case 9 : return new int[]{17,1,8,10,18,16,2,0};
                case 10 : return new int[]{18,2,9,11,19,17,3,1};
                case 11 : return new int[]{19,3,10,12,20,18,4,2};
                case 12 : return new int[]{20,4,11,13,21,19,5,3};
                case 13 : return new int[]{21,5,12,14,22,20,6,4};
                case 14 : return new int[]{22,6,13,15,23,21,7,5};
                case 15 : return new int[]{23,7,14,22,6};
                case 16 : return new int[]{24,8,17,25,9};
                case 17 : return new int[]{25,9,16,18,26,24,10,8};
                case 18 : return new int[]{26,10,17,19,27,25,11,9};
                case 19 : return new int[]{27,11,18,20,28,26,12,10};
                case 20 : return new int[]{28,12,19,21,29,27,13,11};
                case 21 : return new int[]{29,13,20,22,30,28,14,12};
                case 22 : return new int[]{30,14,21,23,31,29,15,13};
                case 23 : return new int[]{31,15,22,30,14};
                case 24 : return new int[]{32,16,25,33,17};
                case 25 : return new int[]{33,17,24,26,34,32,18,16};
                case 26 : return new int[]{34,18,25,27,35,33,19,17};
                case 27 : return new int[]{35,19,26,28,36,34,20,18};
                case 28 : return new int[]{36,20,27,29,37,35,21,19};
                case 29 : return new int[]{37,21,28,30,38,36,22,20};
                case 30 : return new int[]{38,22,29,31,39,37,23,21};
                case 31 : return new int[]{39,23,30,38,22};
                case 32 : return new int[]{40,24,33,41,25};
                case 33 : return new int[]{41,25,32,34,42,40,26,24};
                case 34 : return new int[]{42,26,33,35,43,41,27,25};
                case 35 : return new int[]{43,27,34,36,44,42,28,26};
                case 36 : return new int[]{44,28,35,37,45,43,29,27};
                case 37 : return new int[]{45,29,36,38,46,44,30,28};
                case 38 : return new int[]{46,30,37,39,47,45,31,29};
                case 39 : return new int[]{47,31,38,46,30};
                case 40 : return new int[]{48,32,41,49,33};
                case 41 : return new int[]{49,33,40,42,50,48,34,32};
                case 42 : return new int[]{50,34,41,43,51,49,35,33};
                case 43 : return new int[]{51,35,42,44,52,50,36,34};
                case 44 : return new int[]{52,36,43,45,53,51,37,35};
                case 45 : return new int[]{53,37,44,46,54,52,38,36};
                case 46 : return new int[]{54,38,45,47,55,53,39,37};
                case 47 : return new int[]{55,39,46,54,38};
                case 48 : return new int[]{56,40,49,57,41};
                case 49 : return new int[]{57,41,48,50,58,56,42,40};
                case 50 : return new int[]{58,42,49,51,59,57,43,41};
                case 51 : return new int[]{59,43,50,52,60,58,44,42};
                case 52 : return new int[]{60,44,51,53,61,59,45,43};
                case 53 : return new int[]{61,45,52,54,62,60,46,44};
                case 54 : return new int[]{62,46,53,55,63,61,47,45};
                case 55 : return new int[]{63,47,54,62,46};
                case 56 : return new int[]{48,57,49};
                case 57 : return new int[]{49,56,58,50,48};
                case 58 : return new int[]{50,57,59,51,49};
                case 59 : return new int[]{51,58,60,52,50};
                case 60 : return new int[]{52,59,61,53,51};
                case 61 : return new int[]{53,60,62,54,52};
                case 62 : return new int[]{54,61,63,55,53};
                case 63 : return new int[]{55,62,54};
            }        
        
        return new int[0];
    }
    //Re touched
    public boolean willKingBeInCheckAtSquare(Piece king_piece , int king_to_square, Piece virtual_captured_piece, int piece_virtual_id, int piece_virtual_sqaure_position){
         //Re touched block of code
        if(king_piece==null)
            return false;
        
        int type = king_piece.Me();
        
        Piece[] pieces = board.getAllPieces();
        
        for(int i=0; i<pieces.length; i++){
           
            if(type==pieces[i].Me())
                continue;
            
            Piece piece = pieces[i];
            int piece_square_pos=-1;
            
            piece_square_pos=piece.getPieceSquarePosition();                
 
            if(piece.getPieceID()==piece_virtual_id)
                if(piece_virtual_sqaure_position>-1){
                    piece_square_pos=piece_virtual_sqaure_position;
                    
                }
        
            if(piece_square_pos==-1)
                continue;                        
            if(piece.piece_name==Constants.King){
                if(isKingInUnderAttackByOpponentKingAtSquare(piece_square_pos, king_to_square,   piece.Me(),virtual_captured_piece)){
                    //System.err.println("invalid move - king will be in check by king on square "+king_to_square);
                    return true;
                }
            }            
            
            if(piece.piece_name==Constants.Rook){
                if(isKingInCheckByRookAtSquare(piece_square_pos, king_to_square,   piece.Me(),virtual_captured_piece)){
                    //System.err.println("invalid move - king will be in check by rook on square "+king_to_square);
                    return true;
                }
            }  
                        
            if(piece.piece_name==Constants.Knight){
                int [] knight_caputure_squares=this.getKnightCapturableSquares(piece_square_pos);
                if(containsSquareIn(knight_caputure_squares, king_to_square)){
                    //System.err.println("invalid move - king will be in check by knight on square "+king_to_square);
                    return true;
                }
            } 
                                    
            if(piece.piece_name==Constants.Bishop){
                if(isKingInCheckByBishopAtSquare(piece_square_pos, king_to_square,   piece.Me(),virtual_captured_piece)){
                    //System.err.println("invalid move - king will be in check by bishop on square "+king_to_square);
                    return true;
                }
            }
                        
            if(piece.piece_name==Constants.Queen){
                if(isKingInCheckByQueenAtSquare(piece_square_pos, king_to_square,   piece.Me(),virtual_captured_piece)){
                    //System.err.println("invalid move - king will be in check by queen on square "+king_to_square);
                    return true;
                }
            }             
            
            if(piece.piece_name==Constants.Pawn){
                int [] pawn_caputure_squares=this.getPawnCapturableSquares(piece_square_pos, piece.Me());
                if(containsSquareIn(pawn_caputure_squares, king_to_square)){
                    //System.err.println("invalid move - king will be in check by pawn on square "+king_to_square);
                    return true;
                }
            }
                        
        }
                
        return false;
    }
    
    //Re touched
    boolean willOwnKingBeInCheckWithOwnPieceMove(char moved_piece_name, int from_square, int to_square, int piece_side, int virtual_piece_id, int virtual_piece_square_position){
        
        boolean is_check=false;
        int king_pos=-1;
        
         //Re touched block of code
        
        Piece[] pieces = board.getAllPieces();
        
        //first get the king position
        for(int i=0; i<pieces.length; i++){
             
            if(pieces[i].Me()!=piece_side)
                continue;
            
            if(pieces[i].piece_name==Constants.King){
                king_pos=pieces[i].getPieceSquarePosition();
                break;
            }
             
        }
        
        for(int i=0; i<pieces.length; i++){
            
            if(pieces[i].Me()==piece_side)
                continue;
            
            Piece piece = pieces[i];
            
            int piece_square_pos=-1;
            
            piece_square_pos=piece.getPieceSquarePosition();                
 
            if(piece.getPieceID()==virtual_piece_id)
                if(virtual_piece_square_position>-1){
                    piece_square_pos=virtual_piece_square_position;
                    
                }
        
            if(piece_square_pos==-1)
                continue;
            
            if(piece.piece_name==Constants.Pawn){
                 is_check=willOwnKingBeCheckByPawnWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square, piece.Me());
                 if(is_check){
                    //System.err.println("king will be in checked by "+Constants.Pawn+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);
                    return true;
                 }
            }            
                      
            if(piece.piece_name==Constants.Bishop){
                 is_check=willOwnKingBeCheckByBishopWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square);
                 if(is_check){
                    //System.err.println("king will be in checked by "+Constants.Bishop+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);                     
                    return true;
                 }
            }
            
            if(piece.piece_name==Constants.Rook){
                 is_check=willOwnKingBeCheckByRookWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square);
                 if(is_check){
                    //System.err.println("king will be in checked by "+Constants.Rook+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);
                    return true;
                 }                
            }   
            
            if(piece.piece_name==Constants.Knight){
                 is_check=willOwnKingBeCheckByKnightWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square);
                 if(is_check){
                    //System.err.println("king will be in checked by "+Constants.Knight+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);
                    return true;
                 }                
            } 
            
            if(piece.piece_name==Constants.Queen){
                 is_check=willOwnKingBeCheckByQueenWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square);
                 if(is_check){
                    //System.err.println("king will be in checked by "+Constants.Queen+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);
                    return true;
                 }                
            }
            
        }
        
        
        return is_check;
    }
    
    boolean containsSquareIn(int[] square_array, int argu ){                                
        
        for(int i=square_array.length-1; i>-1; i--){
            if(square_array[i]==argu)
                return true;
        }
        
        return false;
    }

    //Re touched
    private boolean isOccupied(int square){

        Piece[] pieces = board.getAllPieces();

        for(int i=pieces.length - 1; i>-1; i--){
            if(square==pieces[i].getPieceSquarePosition() ){                
                return true;
            }
        }        
        
        return false;
    }
    
    //Re touched
    private boolean isOccupiedExceptOpponentKingAndVirtualCapturedPiece(int square, int peice_side, Piece virtual_captured_piece){
                
        Piece[] pieces = board.getAllPieces();
        
        for(int i=pieces.length-1; i>-1; i--){
            
            Piece piece = pieces[i];
            
            if(virtual_captured_piece!=null)
                if(peice_side==virtual_captured_piece.Me())
                    if(virtual_captured_piece.getPieceID()==piece.getPieceID())
                         continue;
                    
            
            if(peice_side!=piece.Me()
               && piece.piece_name==Constants.King)
                continue;
            
            if(square==piece.getPieceSquarePosition())              
                return true;
            
        }
        
        return false;
    }

    //Re touched
    private boolean isOccupiedBySamePiece(int square, int piece_side){

        Piece []pieces = board.getAllPieces();
        
        for(int i=pieces.length - 1; i>-1; i--){
            if(square==pieces[i].getPieceSquarePosition()
                    && piece_side==pieces[i].Me() ){
                
                return true;
            }
        }
        
        return false;
    }
    
    //Re touched
    private boolean isOccupiedByOpponentPiece(int square, int piece_side){

        Piece[] pieces = board.getAllPieces();
        
        for(int i=0; i<pieces.length; i++){
            if(square==pieces[i].getPieceSquarePosition()
                    && piece_side!=pieces[i].Me() ){
                return true;
            }
        }
        
        return false;
    }

    public int[] getKnightValidMoveSquares(int quare_loc, int piece_side, int piece_virtual_id, int piece_virtual_square_position){

        //new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not        
        
        int pos1=-1;
        int pos2=-1;
        int pos3=-1;
        int pos4=-1;
        int pos5=-1;
        int pos6=-1;
        int pos7=-1;
        int pos8=-1;
       
        int index=-1;
        
        int[] postions=new int[8];
        
        int[] vert_up = getVerticalUpwardSquares(quare_loc);
        int[] vert_down = getVerticalDownwardSquares(quare_loc);
        int[] horiz_left = getHorizontalLeftwardSquares(quare_loc);        
        int[] horiz_right = getHorizontalRightwardSquares(quare_loc);        

        //handle vert_up
        if(vert_up!=null)
            if(vert_up.length>=2){
                
                int pos=vert_up[1];
                int[]n=getHorizontalLeftwardSquares(pos);
                int[]m=getHorizontalRightwardSquares(pos);
                
                if(n!=null)
                    if(n.length>0){
                        pos1=n[0];
                        
                        if(!isOccupiedBySamePiece(pos1, piece_side)){
                            index++;                        
                            postions[index]=pos1;
                        }
                        

                    }

                if(m!=null)
                    if(m.length>0){
                        pos2=m[0];
                        if(!isOccupiedBySamePiece(pos2, piece_side)){
                            index++;                        
                            postions[index]=pos2;
                        }
                    }
                
            }

        //handle vert_down
        if(vert_down !=null)
            if(vert_down.length>=2){
                
                int pos=vert_down[1];
                int[]n=getHorizontalLeftwardSquares(pos);
                int[]m=getHorizontalRightwardSquares(pos);
                
                if(n!=null)
                    if(n.length>0){
                        pos3=n[0];
                        if(!isOccupiedBySamePiece(pos3, piece_side)){
                            index++;                        
                            postions[index]=pos3;
                        }
                     
                    }

                if(m!=null)
                    if(m.length>0){
                        pos4=m[0];
                        if(!isOccupiedBySamePiece(pos4, piece_side)){
                            index++;                        
                            postions[index]=pos4;
                        }
                     
                    }
                
            }
                
        //handle horiz_left
        if(horiz_left !=null)
            if(horiz_left.length>=2){
                
                int pos=horiz_left[1];
                int[]n=getVerticalUpwardSquares(pos);
                int[]m=getVerticalDownwardSquares(pos);
                
                if(n!=null)
                    if(n.length>0){
                        pos5=n[0];
                        if(!isOccupiedBySamePiece(pos5, piece_side)){
                            index++;                        
                            postions[index]=pos5;
                        }
                     
                    }

                if(m!=null)
                    if(m.length>0){
                        pos6=m[0];
                        if(!isOccupiedBySamePiece(pos6, piece_side)){
                            index++;                        
                            postions[index]=pos6;
                        }
                     
                    }
                
            }
                
        //handle horiz_right
        if(horiz_right !=null)
            if(horiz_right.length>=2){
                
                int pos=horiz_right[1];
                int[]n=getVerticalUpwardSquares(pos);
                int[]m=getVerticalDownwardSquares(pos);
                
                if(n!=null)
                    if(n.length>0){
                        pos7=n[0];
                        if(!isOccupiedBySamePiece(pos7, piece_side)){
                            index++;                        
                            postions[index]=pos7;
                        }
                     
                    }

                if(m!=null)
                    if(m.length>0){
                        pos8=m[0];
                        if(!isOccupiedBySamePiece(pos8, piece_side)){
                            index++;                        
                            postions[index]=pos8;
                        }
                     
                    }
                
            }
        
        int [] unresolved_valid_pos=new int[index+1];
        
        System.arraycopy(postions, 0, unresolved_valid_pos, 0, index+1);
        
        /*
        if(!this.containsSquareIn(unresolved_valid_pos, to_square)){
            new_move.setInvalidMoveMessage("Knight must move one square up or down and two squares over or vice versa.\nKnights are the only PIECES_BY_ID that jump over others");
            new_move.setIsValidMove(false);
        }
         * 
         */
        

        //OPPONENT KING
        //inspectOpponentKing(new_move, unresolved_valid_pos,to_square, piece_side);
        
        
        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        
        int[] real_valid;
        real_valid=inspectOwnKing(Constants.Knight, unresolved_valid_pos, quare_loc, piece_side, piece_virtual_id, piece_virtual_square_position);
        
        return  real_valid;
    }
    
    //PLEASE THIS METHOD HAS BUG - IT DID NOT CONSIDER KING WILL BE UNDER ATTACK - ERORR!!! 
    public int[] getKingValidMoveSquares(int square_loc, int  piece_side, int piece_virtual_id, int piece_virtual_square_position){
        
        //new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not
        
        int[] vert_up = getVerticalUpwardSquares(square_loc);
        int[] vert_down = getVerticalDownwardSquares(square_loc);
        int[] horiz_left = getHorizontalLeftwardSquares(square_loc);        
        int[] horiz_right = getHorizontalRightwardSquares(square_loc);        

        int[] top_right_diagonal = getTopRightDiagonalSquares(square_loc);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(square_loc);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(square_loc);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(square_loc);  
        
        Piece king_piece = this.getPieceOnThisSquare(square_loc);
        
        //Castle castle=this.isCastlingAllow(new_move.getCastle(), king_piece, from_square, to_square);
        /*
        if(king_piece.isFirstMove())
            if(!castle.isCastleOpportunity() && Math.abs(from_square-to_square)==2){               
                new_move.setInvalidMoveMessage(castle.getInvalidCastleMessage());            
                new_move.setIsValidMove(false);            
            }            
        
         * 
         */
        int index=-1;
        int[] postions=new int[this.total_chess_pieces];
        
         Piece piece = this.getPieceByID(piece_virtual_id);
         int virtual_piece_side=piece!=null?piece.Me():-1;     
        
        if(vert_up!=null)
            if(vert_up.length>0){                
                if(!isOccupiedBySamePiece(vert_up[0], piece_side)){                
                    index++;                                            
                    postions[index]=vert_up[0];                    
                }
                
                if(virtual_piece_side!=piece_side)
                    if(piece_virtual_square_position==vert_up[0]){
                        index++;                                            
                        postions[index]=piece_virtual_square_position;                      
                    }
                
            }

        if(vert_down!=null)
            if(vert_down.length>0){                
                if(!isOccupiedBySamePiece(vert_down[0], piece_side)){                
                    index++;                                            
                    postions[index]=vert_down[0];                    
                }
            
                if(virtual_piece_side!=piece_side)
                    if(piece_virtual_square_position==vert_down[0]){
                        index++;                                            
                        postions[index]=piece_virtual_square_position;                      
                    }

            }
        
        if(horiz_left!=null)
            if(horiz_left.length>0){                
                if(!isOccupiedBySamePiece(horiz_left[0], piece_side)){                
                    index++;                                            
                    postions[index]=horiz_left[0];                    
                }
                
                if(virtual_piece_side!=piece_side)
                    if(piece_virtual_square_position==horiz_left[0]){
                        index++;                                            
                        postions[index]=piece_virtual_square_position;                      
                    }
                
            }

        if(horiz_right!=null)
            if(horiz_right.length>0){                
                if(!isOccupiedBySamePiece(horiz_right[0], piece_side)){                
                    index++;                                            
                    postions[index]=horiz_right[0];                    
                }
                
                if(virtual_piece_side!=piece_side)
                    if(piece_virtual_square_position==horiz_right[0]){
                        index++;                                            
                        postions[index]=piece_virtual_square_position;                      
                    }
                
            }
        
        if(top_right_diagonal!=null)
            if(top_right_diagonal.length>0){                
                if(!isOccupiedBySamePiece(top_right_diagonal[0], piece_side)){                
                    index++;                                            
                    postions[index]=top_right_diagonal[0];                    
                }
                
                if(virtual_piece_side!=piece_side)
                    if(piece_virtual_square_position==top_right_diagonal[0]){
                        index++;                                            
                        postions[index]=piece_virtual_square_position;                      
                    }
                
            }

        if(top_left_diagonal!=null)
            if(top_left_diagonal.length>0){                
                if(!isOccupiedBySamePiece(top_left_diagonal[0], piece_side)){                
                    index++;                                            
                    postions[index]=top_left_diagonal[0];                    
                }
                
                if(virtual_piece_side!=piece_side)
                    if(piece_virtual_square_position==top_left_diagonal[0]){
                        index++;                                            
                        postions[index]=piece_virtual_square_position;                      
                    }
                
            }
        
        if(bottom_right_diagonal!=null)
            if(bottom_right_diagonal.length>0){                
                if(!isOccupiedBySamePiece(bottom_right_diagonal[0], piece_side)){                
                    index++;                                            
                    postions[index]=bottom_right_diagonal[0];                    
                }
                
                if(virtual_piece_side!=piece_side)
                    if(piece_virtual_square_position==bottom_right_diagonal[0]){
                        index++;                                            
                        postions[index]=piece_virtual_square_position;                      
                    }
                
            }

        if(bottom_left_diagonal!=null)
            if(bottom_left_diagonal.length>0){                
                if(!isOccupiedBySamePiece(bottom_left_diagonal[0], piece_side)){                
                    index++;                                            
                    postions[index]=bottom_left_diagonal[0];                    
                }
                
                if(virtual_piece_side!=piece_side)
                    if(piece_virtual_square_position==bottom_left_diagonal[0]){
                        index++;                                            
                        postions[index]=piece_virtual_square_position;                      
                    }
                
            }
        
        
        
        int [] unresolved_pos=new int[index+1];
        
        System.arraycopy(postions, 0, unresolved_pos, 0, index+1);//copy the whole array

        /*
        //examine the position to find out if the king will be under attack (in check)
        
        
        Piece piece_to_be_capture = this.getPieceOnThisSquare(to_square);
        
        if(new_move.isMoveValid())//if still valid do another validation test
            if(this.containsSquareIn(unresolved_pos, to_square))
                if(this.willKingBeInCheckAtSquare(king_piece, to_square, piece_to_be_capture,piece_virtual_id, piece_virtual_square_position)){
                    new_move.setInvalidMoveMessage("King cannot move to a square which is under attack.");
                    new_move.setIsValidMove(false);            
                }
       
        
        int pos_cancelled=0;
        for(int i=0; i<unresolved_pos.length; i++ ){
            
            piece_to_be_capture = this.getPieceOnThisSquare(unresolved_pos[i]);
           
            if(this.willKingBeInCheckAtSquare(king_piece, unresolved_pos[i], piece_to_be_capture,piece_virtual_id, piece_virtual_square_position)){
                unresolved_pos[i]=-1;//cancel
                
                pos_cancelled++;
            }
        }
        
        int [] valid_pos=new int[unresolved_pos.length-pos_cancelled];

        index=-1;
       
        for(int i=0; i<unresolved_pos.length; i++){
            if(unresolved_pos[i]==-1)
                continue;
            index++;
            valid_pos[index]=unresolved_pos[i];
        }
                
       
        if(castle.isCastleOpportunity()){
            //added the king castle square postion
            int[] castle_pos=castle.kingCastlePosition();
            int[] valid_pos_with_castle=new int[valid_pos.length+castle_pos.length];
            System.arraycopy(valid_pos, 0, valid_pos_with_castle, 0, valid_pos.length);
            System.arraycopy(castle_pos, 0, valid_pos_with_castle, valid_pos.length, castle_pos.length);  

            valid_pos=valid_pos_with_castle;
        }

        if(new_move.isMoveValid())//if still valid do another validation test
            if(!this.containsSquareIn(valid_pos, to_square)){
                new_move.setInvalidMoveMessage("King may only move one space in any direction");
                new_move.setIsValidMove(false);
            }
       
        new_move.setValidSquares(valid_pos);
       
         * 
         */
        
        return  unresolved_pos; //PLEASE THIS METHOD HAS BUG - IT DID NOT CONSIDER KING WILL BE UNDER ATTACK - ERORR!!! 
    }
    
    public int[]  getRookValidMoveSquares(int square_loc, int  piece_side, int piece_virtual_id, int piece_virtual_square_position){

        //new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not        
        
        int[] vert_up = getVerticalUpwardSquares(square_loc);
        int[] vert_down = getVerticalDownwardSquares(square_loc);
        int[] horiz_left = getHorizontalLeftwardSquares(square_loc);        
        int[] horiz_right = getHorizontalRightwardSquares(square_loc);        
        
        int index=-1;
        int[] postions=new int[this.total_chess_pieces];
        
        if(vert_up!=null)
            for(int i=0; i<vert_up.length; i++){    
    
                if(!isOccupiedBySamePiece(vert_up[i], piece_side)){                
                    index++;                                            
                    postions[index]=vert_up[i];                    
                }
                
                if(isOccupied(vert_up[i]))
                    break;
            
            }

        if(vert_down!=null)
            for(int i=0; i<vert_down.length; i++){                       
    
                if(!isOccupiedBySamePiece(vert_down[i], piece_side)){                
                    index++;                                            
                    postions[index]=vert_down[i];                    
                }
                
                if(isOccupied(vert_down[i]))
                    break;
            
            }
        
        if(horiz_left!=null)
            for(int i=0; i<horiz_left.length; i++){                       

                if(!isOccupiedBySamePiece(horiz_left[i], piece_side)){                
                    index++;                                            
                    postions[index]=horiz_left[i];                    
                }
                
                if(isOccupied(horiz_left[i]))
                    break;                
                
            }

        if(horiz_right!=null)
            for(int i=0; i<horiz_right.length; i++){                       
                    
                if(!isOccupiedBySamePiece(horiz_right[i], piece_side)){                
                    index++;                                            
                    postions[index]=horiz_right[i];                    
                }
            
                if(isOccupied(horiz_right[i]))
                    break;
                            
            }

        int [] unresolved_valid_pos=new int[index+1];
        
        System.arraycopy(postions, 0, unresolved_valid_pos, 0, index+1);
      
       /*
        if(!this.containsSquareIn(unresolved_valid_pos, to_square)){
            new_move.setInvalidMoveMessage("Rook may move up or down , left or right any number of spaces provided the path is not blocked");
            new_move.setIsValidMove(false);
        }
     
         * 
         */

        //OPPONENT KING
        //inspectOpponentKing(new_move, unresolved_valid_pos,to_square, piece_side);
        
        
        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        
        int[]real_valid;
        real_valid = inspectOwnKing(Constants.Rook, unresolved_valid_pos, square_loc, piece_side, piece_virtual_id, piece_virtual_square_position);
        
        return   real_valid;
    }
    
    public int []  getQueenValidMoveSquares(int square_loc, int  piece_side, int piece_virtual_id, int piece_virtual_square_position){

        //new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not
        
        int[] vert_up = getVerticalUpwardSquares(square_loc);
        int[] vert_down = getVerticalDownwardSquares(square_loc);
        int[] horiz_left = getHorizontalLeftwardSquares(square_loc);        
        int[] horiz_right = getHorizontalRightwardSquares(square_loc);        

        int[] top_right_diagonal = getTopRightDiagonalSquares(square_loc);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(square_loc);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(square_loc);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(square_loc);        
        
        
        int index=-1;
        int[] postions=new int[this.total_chess_pieces];
        
        if(vert_up!=null)
            for(int i=0; i<vert_up.length; i++){                       
    
                if(!isOccupiedBySamePiece(vert_up[i], piece_side)){                
                    index++;                                            
                    postions[index]=vert_up[i];                    
                }
                
                if(isOccupied(vert_up[i]))
                    break;
            
            }

        if(vert_down!=null)
            for(int i=0; i<vert_down.length; i++){                       
    
                if(!isOccupiedBySamePiece(vert_down[i], piece_side)){                
                    index++;                                            
                    postions[index]=vert_down[i];                    
                }
                
                if(isOccupied(vert_down[i]))
                    break;
            
            }
        
        if(horiz_left!=null)
            for(int i=0; i<horiz_left.length; i++){                       
                    
                if(!isOccupiedBySamePiece(horiz_left[i], piece_side)){                
                    index++;                                            
                    postions[index]=horiz_left[i];                    
                }
                
                if(isOccupied(horiz_left[i]))
                    break;
            
            }

        if(horiz_right!=null)
            for(int i=0; i<horiz_right.length; i++){                       
    
                if(!isOccupiedBySamePiece(horiz_right[i], piece_side)){                
                    index++;                                            
                    postions[index]=horiz_right[i];                    
                }
                
                if(isOccupied(horiz_right[i]))
                    break;
            
            }

        
        if(top_right_diagonal!=null)
            for(int i=0; i<top_right_diagonal.length; i++){                       
    
                if(!isOccupiedBySamePiece(top_right_diagonal[i], piece_side)){                
                    index++;                                            
                    postions[index]=top_right_diagonal[i];                    
                }
                
                if(isOccupied(top_right_diagonal[i]))
                    break;
            
            }

        if(top_left_diagonal!=null)
            for(int i=0; i<top_left_diagonal.length; i++){                       
    
                if(!isOccupiedBySamePiece(top_left_diagonal[i], piece_side)){                
                    index++;                                            
                    postions[index]=top_left_diagonal[i];                    
                }
                
                if(isOccupied(top_left_diagonal[i]))
                    break;
            
            }
        
        if(bottom_right_diagonal!=null)
            for(int i=0; i<bottom_right_diagonal.length; i++){                       
    
                if(!isOccupiedBySamePiece(bottom_right_diagonal[i], piece_side)){                
                    index++;                                            
                    postions[index]=bottom_right_diagonal[i];                    
                }
                
                if(isOccupied(bottom_right_diagonal[i]))
                    break;
            
            }

        if(bottom_left_diagonal!=null)
            for(int i=0; i<bottom_left_diagonal.length; i++){                       
    
                if(!isOccupiedBySamePiece(bottom_left_diagonal[i], piece_side)){                
                    index++;                                            
                    postions[index]=bottom_left_diagonal[i];                    
                }
                
                if(isOccupied(bottom_left_diagonal[i]))
                    break;
            
            }
        
        
        int [] unresolved_valid_pos=new int[index+1];
        
        System.arraycopy(postions, 0, unresolved_valid_pos, 0, index+1);
       
        /*
        if(!this.containsSquareIn(unresolved_valid_pos, to_square)){
            new_move.setInvalidMoveMessage("Queen cannot move there. The path is blocked.");
            new_move.setIsValidMove(false);
        }
         * 
         */
               

        //OPPONENT KING
        //inspectOpponentKing(new_move, unresolved_valid_pos,to_square, piece_side);
        
        
        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        
        int[] real_valid;
        real_valid= inspectOwnKing(Constants.Queen, unresolved_valid_pos, square_loc, piece_side, piece_virtual_id, piece_virtual_square_position);
        
        return  real_valid;
    }

    //long and short castle not include in the valid squares - not need as long as this method is concerned.
    //long and short castle should be implement elsewhere
    public int[] getKingValidMoveSquares_1(int square_loc, int piece_side) {
        int[] KING_capturable_squares = get_KING_CapturableSquares_1(square_loc);
                
        int cancelled= 0;
        for(int i=0; i<KING_capturable_squares.length; i++){            
            if(board.isOccupiedBySamePiece(KING_capturable_squares[i], piece_side)){
                KING_capturable_squares[i] = Constants.NOTHING;//cancel
                cancelled++;
            }
        }        

         for(int i=0; i<KING_capturable_squares.length; i++){

             if(KING_capturable_squares[i] == Constants.NOTHING)
                 continue;
             
             int[] knight_capturable_squares=getKnightCapturableSquares_1 (KING_capturable_squares[i]);

             int[] vert_up = getVerticalUpwardSquares_1 (KING_capturable_squares[i]);
             int[] vert_down = getVerticalDownwardSquares_1 (KING_capturable_squares[i]);
             int[] horiz_left = getHorizontalLeftwardSquares_1 (KING_capturable_squares[i]);        
             int[] horiz_right = getHorizontalRightwardSquares_1 (KING_capturable_squares[i]);

             int[] top_left_diagonal = getTopLeftDiagonalSquares_1 (KING_capturable_squares[i]);             
             int[] top_right_diagonal = getTopRightDiagonalSquares_1 (KING_capturable_squares[i]);
             int[] bottom_left_diagonal = getBottomLeftDiagonalSquares_1( KING_capturable_squares[i]);        
             int[] bottom_right_diagonal = getBottomRightDiagonalSquares_1 (KING_capturable_squares[i]);        

                 
             if(isOwnKingAttacks( square_loc,
                               KING_capturable_squares[i], 
                               piece_side,
                               knight_capturable_squares,
                               vert_up,
                               vert_down,
                               horiz_left,
                               horiz_right,
                               top_left_diagonal,                               
                               top_right_diagonal,
                               bottom_left_diagonal,
                               bottom_right_diagonal))
                    
             {                                 
                 KING_capturable_squares[i] = Constants.NOTHING;   
                 cancelled++;
             }   

         }
         
         
         int len = KING_capturable_squares.length - cancelled;
         int n=-1;
         int [] valid_squares = new int[len];
         
         for(int i=0; i < KING_capturable_squares.length; i++){
             if(KING_capturable_squares[i]!=Constants.NOTHING){
                 n++;
                 valid_squares[n]=KING_capturable_squares[i];
             }
         }
        
        return  valid_squares;         
    }

    public int[] getKnightValidMoveSquares_1(int square_loc, int piece_side) {

        int[] knight_capturable_squares=getUnresolvedKnightMoveSquares(square_loc, piece_side);
                
        //check king attack.
        int [] valid_squares = checkOwnKingAttack(square_loc, knight_capturable_squares, knight_capturable_squares.length, piece_side);
        
        return valid_squares;                          
    }

    public int[] getPawnValidMoveSquares_1(int square_loc, int piece_side) {
        
        int[] squares=getUnresolvedPawnMoveSquares( square_loc,  piece_side);
        
        //check king attack.
        int [] valid_squares = checkOwnKingAttack(square_loc, squares,  squares.length,  piece_side);
        
        return valid_squares;                  
    }
    
    public int [] getRookValidMoveSquares_1(int square_loc, int  piece_side){
        
        int [] squares=getUnresolvedRookMoveSquares(square_loc, piece_side); 
        
        if(squares.length == 0)//meaning no possible squares
            return squares;
        
        //check king attack.
        int [] valid_squares = checkOwnKingAttack(square_loc, squares,  squares.length,  piece_side);
        
        return valid_squares;
    }

    public int [] getBishopValidMoveSquares_1(int square_loc, int  piece_side){
        
        int[] squares=getUnresolvedBishopMoveSquares(square_loc,  piece_side);        
        
        if(squares.length == 0)//meaning no possible squares
            return squares;
        
        //check king attack.
        int [] valid_squares = checkOwnKingAttack(square_loc, squares,  squares.length,  piece_side);
        
        return valid_squares;
    }

    public int [] getQueenValidMoveSquares_1(int square_loc, int  piece_side){
        
        int[] squares=getUnresolvedQueenMoveSquares(square_loc,  piece_side);        
        
        if(squares.length==0)
            return squares;//no square
        
        //check king attack.
        int [] valid_squares = checkOwnKingAttack(square_loc, squares,  squares.length,  piece_side);
        
        return valid_squares;
    }

    public int[] getUnresolvedKingMoveSquares(int square_loc, int piece_side){
        int[] KING_capturable_squares = get_KING_CapturableSquares_1(square_loc);
                
        int cancelled= 0;
        for(int i=0; i<KING_capturable_squares.length; i++){            
            if(board.isOccupiedBySamePiece(KING_capturable_squares[i], piece_side)){
                KING_capturable_squares[i] = Constants.NOTHING;//cancel
                cancelled++;
            }
        }     
        
        return KING_capturable_squares;
    }
    
    public int[] getUnresolvedPawnMoveSquares(int square_loc, int piece_side) {
        
        if(square_loc == Constants.NOTHING)//should not be
            return new int[0];//should not be
        
        int[] pawn_capturable_squares = getPawnCapturableSquares_1 (square_loc ,piece_side);
        int[] forwad_squares = null;
        boolean is_first_move=false;
        
        if(piece_side==Side.white){
            is_first_move=square_loc < 16 ? true : false;
        }else{            
            is_first_move=square_loc > 47 ? true : false;
        }
        
        if(is_first_move){
            forwad_squares= piece_side==Side.white?
                            new int[]{square_loc + 8, square_loc + 16}://white moves
                            new int[]{square_loc - 8, square_loc - 16};//black moves
        }else{
            if(piece_side==Side.white){
                forwad_squares = square_loc < 56 ?//less than last(8th) row.
                                 new int[]{square_loc + 8}://can move forward.
                                 new int[]{};//no pawn move possible - now promoted.
            }else{//is black
                forwad_squares = square_loc > 7 ?//greater than first row.
                                 new int[]{square_loc - 8}://can move forward.
                                 new int[]{};//no pawn move possible - now promoted.
            }
        }
        
        //cancel invalid squares
        for(int i=0; i<forwad_squares.length; i++){
            
            if(board.Squares[forwad_squares[i]]==Constants.NOTHING){
                continue;
            }else{
                //the square is blocked so cancel the remainders
                forwad_squares[i]=Constants.NOTHING;
                if(i<forwad_squares.length-1)//when the pawn has not made any move.
                    forwad_squares[i+1]=Constants.NOTHING;//cancel the second also.
                break;
            }            
        }

        
        for(int i=0; i<pawn_capturable_squares.length; i++){                         
            if(board.Squares[pawn_capturable_squares[i]]==Constants.NOTHING){
                pawn_capturable_squares[i] = Constants.NOTHING;//cancel
            }
            else if(board.isOccupiedBySamePiece(pawn_capturable_squares[i], piece_side)){
                pawn_capturable_squares[i] = Constants.NOTHING;//cancel
            }
        }        
        
        //merge the squares arrays
        int[] squares =new int[pawn_capturable_squares.length + forwad_squares.length];
        int n = -1;
        
         for(int i=0; i<squares.length; i++){
             if(i<pawn_capturable_squares.length){                 
                 squares[i]=pawn_capturable_squares[i];
             }else{
                 n++;
                 squares[i] = forwad_squares[n];
             }
         }        

        
        return squares;                  
    }

    public int[] getUnresolvedKnightMoveSquares(int square_loc, int piece_side) {

        int[] knight_capturable_squares=getKnightCapturableSquares_1 (square_loc);

        for(int i=0; i<knight_capturable_squares.length; i++){            
            if(board.isOccupiedBySamePiece(knight_capturable_squares[i], piece_side)){
                knight_capturable_squares[i] = Constants.NOTHING;//cancel
            }
        }        

        return knight_capturable_squares;                          
    }
    
    public int [] getUnresolvedRookMoveSquares(int square_loc, int  piece_side){
        
        int[] vert_up = getVerticalUpwardSquares_1 (square_loc);
        int[] vert_down = getVerticalDownwardSquares_1 (square_loc);
        int[] horiz_left = getHorizontalLeftwardSquares_1 (square_loc);        
        int[] horiz_right = getHorizontalRightwardSquares_1 (square_loc);        

        int[] squares=new int[vert_up.length+
                              vert_down.length+
                              horiz_left.length+
                              horiz_right.length];
        
        int index=-1;
        
        for(int i=0; i<vert_up.length; i++){
            if(board.Squares[vert_up[i]]==Constants.NOTHING){
                index++;
                squares[index]=vert_up[i];
            }else if(board.isOccupiedBySamePiece(vert_up[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=vert_up[i];//include the capture square
                break;//end of path
            }
        }

        for(int i=0; i<vert_down.length; i++){
            if(board.Squares[vert_down[i]]==Constants.NOTHING){
                index++;
                squares[index]=vert_down[i];
            }else if(board.isOccupiedBySamePiece(vert_down[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=vert_down[i];//include the capture square
                break;//end of path
            }            
        }
        
        for(int i=0; i<horiz_left.length; i++){
            if(board.Squares[horiz_left[i]]==Constants.NOTHING){
                index++;
                squares[index]=horiz_left[i];
            }else if(board.isOccupiedBySamePiece(horiz_left[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=horiz_left[i];//include the capture square
                break;//end of path
            }                        
        }
        
        for(int i=0; i<horiz_right.length; i++){
            if(board.Squares[horiz_right[i]]==Constants.NOTHING){
                index++;
                squares[index]=horiz_right[i];
            }else if(board.isOccupiedBySamePiece(horiz_right[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=horiz_right[i];//include the capture square
                break;//end of path
            }                     
        }
        

        int[] unresolved= new int[index + 1];        
        
        for(int i=0; i<unresolved.length; i++)
            unresolved[i]=squares[i];
        
        return unresolved;
    }

    public int [] getUnresolvedBishopMoveSquares(int square_loc, int  piece_side){

        int[] top_right_diagonal = getTopRightDiagonalSquares_1 (square_loc);
        int[] top_left_diagonal = getTopLeftDiagonalSquares_1 (square_loc);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares_1 (square_loc);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares_1( square_loc);        

        int[] squares=new int[top_right_diagonal.length+
                              top_left_diagonal.length+
                              bottom_right_diagonal.length+
                              bottom_left_diagonal.length];
        
        int index=-1;
        
        for(int i=0; i<top_right_diagonal.length; i++){
            if(board.Squares[top_right_diagonal[i]]==Constants.NOTHING){
                index++;
                squares[index]=top_right_diagonal[i];
            }else if(board.isOccupiedBySamePiece(top_right_diagonal[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=top_right_diagonal[i];//include the capture square
                break;//end of path
            }                        
        }
        
        for(int i=0; i<top_left_diagonal.length; i++){
            if(board.Squares[top_left_diagonal[i]]==Constants.NOTHING){
                index++;
                squares[index]=top_left_diagonal[i];
            }else if(board.isOccupiedBySamePiece(top_left_diagonal[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=top_left_diagonal[i];//include the capture square
                break;//end of path
            }                        
        }
        
        for(int i=0; i<bottom_right_diagonal.length; i++){
            if(board.Squares[bottom_right_diagonal[i]]==Constants.NOTHING){
                index++;
                squares[index]=bottom_right_diagonal[i];
            }else if(board.isOccupiedBySamePiece(bottom_right_diagonal[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=bottom_right_diagonal[i];//include the capture square
                break;//end of path
            }                        
        }
        
        for(int i=0; i<bottom_left_diagonal.length; i++){
            if(board.Squares[bottom_left_diagonal[i]]==Constants.NOTHING){
                index++;
                squares[index]=bottom_left_diagonal[i];
            }else if(board.isOccupiedBySamePiece(bottom_left_diagonal[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=bottom_left_diagonal[i];//include the capture square
                break;//end of path
            }                        
        }        
        

        int[] unresolved= new int[index + 1];        
        
        for(int i=0; i<unresolved.length; i++)
            unresolved[i]=squares[i];
        
        return unresolved;
    }

    public int [] getUnresolvedQueenMoveSquares(int square_loc, int  piece_side){
        
        int[] vert_up = getVerticalUpwardSquares_1 (square_loc);
        int[] vert_down = getVerticalDownwardSquares_1 (square_loc);
        int[] horiz_left = getHorizontalLeftwardSquares_1 (square_loc);        
        int[] horiz_right = getHorizontalRightwardSquares_1 (square_loc);        

        int[] top_right_diagonal = getTopRightDiagonalSquares_1 (square_loc);
        int[] top_left_diagonal = getTopLeftDiagonalSquares_1 (square_loc);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares_1 (square_loc);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares_1( square_loc);        

        int[] squares=new int[vert_up.length+
                                    vert_down.length+
                                    horiz_left.length+
                                    horiz_right.length+
                                    top_right_diagonal.length+
                                    top_left_diagonal.length+
                                    bottom_right_diagonal.length+
                                    bottom_left_diagonal.length];
        
        int index=-1;
        
        for(int i=0; i<vert_up.length; i++){
            if(board.Squares[vert_up[i]]==Constants.NOTHING){
                index++;
                squares[index]=vert_up[i];
            }else if(board.isOccupiedBySamePiece(vert_up[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=vert_up[i];//include the capture square
                break;//end of path
            }
        }

        for(int i=0; i<vert_down.length; i++){
            if(board.Squares[vert_down[i]]==Constants.NOTHING){
                index++;
                squares[index]=vert_down[i];
            }else if(board.isOccupiedBySamePiece(vert_down[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=vert_down[i];//include the capture square
                break;//end of path
            }            
        }
        
        for(int i=0; i<horiz_left.length; i++){
            if(board.Squares[horiz_left[i]]==Constants.NOTHING){
                index++;
                squares[index]=horiz_left[i];
            }else if(board.isOccupiedBySamePiece(horiz_left[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=horiz_left[i];//include the capture square
                break;//end of path
            }                        
        }
        
        for(int i=0; i<horiz_right.length; i++){
            if(board.Squares[horiz_right[i]]==Constants.NOTHING){
                index++;
                squares[index]=horiz_right[i];
            }else if(board.isOccupiedBySamePiece(horiz_right[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=horiz_right[i];//include the capture square
                break;//end of path
            }                     
        }
        
        for(int i=0; i<top_right_diagonal.length; i++){
            if(board.Squares[top_right_diagonal[i]]==Constants.NOTHING){
                index++;
                squares[index]=top_right_diagonal[i];
            }else if(board.isOccupiedBySamePiece(top_right_diagonal[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=top_right_diagonal[i];//include the capture square
                break;//end of path
            }                        
        }
        
        for(int i=0; i<top_left_diagonal.length; i++){
            if(board.Squares[top_left_diagonal[i]]==Constants.NOTHING){
                index++;
                squares[index]=top_left_diagonal[i];
            }else if(board.isOccupiedBySamePiece(top_left_diagonal[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=top_left_diagonal[i];//include the capture square
                break;//end of path
            }                        
        }
        
        for(int i=0; i<bottom_right_diagonal.length; i++){
            if(board.Squares[bottom_right_diagonal[i]]==Constants.NOTHING){
                index++;
                squares[index]=bottom_right_diagonal[i];
            }else if(board.isOccupiedBySamePiece(bottom_right_diagonal[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=bottom_right_diagonal[i];//include the capture square
                break;//end of path
            }                        
        }
        
        for(int i=0; i<bottom_left_diagonal.length; i++){
            if(board.Squares[bottom_left_diagonal[i]]==Constants.NOTHING){
                index++;
                squares[index]=bottom_left_diagonal[i];
            }else if(board.isOccupiedBySamePiece(bottom_left_diagonal[i], piece_side)){
                break;//end of path
            }else{
                //here it is occuppied by opponent piece
                index++;
                squares[index]=bottom_left_diagonal[i];//include the capture square
                break;//end of path
            }                        
        }        

        int[] unresolved= new int[index + 1];        
        
        for(int i=0; i<unresolved.length; i++)
            unresolved[i]=squares[i];
        
        return unresolved;
    }


    private int[] checkOwnKingAttack( int square_loc, int[] squares, int length, int piece_side ){                
        
        //OPTIMIZE THE CODE BY CALLING THE NECESSARY SQUARES HERE - AVOID REPITITION OF
        //CALLS THAT CAUSE PERFORMANCE DEGRADATION.
        //DO SAME FOR OTHER PIECE ANALYSIS.                
        
         int king_square_loc = piece_side==Side.white ? 
                               board.getWhiteKing().Square:
                               board.getBlackKing().Square;         
         
         //king_square_loc=36;//TESTING!!!
         
         int[] knight_capturable_squares=getKnightCapturableSquares_1 (king_square_loc);
         
         int[] vert_up = getVerticalUpwardSquares_1 (king_square_loc);
         int[] vert_down = getVerticalDownwardSquares_1 (king_square_loc);
         int[] horiz_left = getHorizontalLeftwardSquares_1 (king_square_loc);        
         int[] horiz_right = getHorizontalRightwardSquares_1 (king_square_loc);
                  
         int[] top_left_diagonal = getTopLeftDiagonalSquares_1 (king_square_loc);   
         int[] top_right_diagonal = getTopRightDiagonalSquares_1 (king_square_loc);
         int[] bottom_left_diagonal = getBottomLeftDiagonalSquares_1( king_square_loc);        
         int[] bottom_right_diagonal = getBottomRightDiagonalSquares_1 (king_square_loc);     
         
         //index=4;//TESTING!!
         int cancelled=0;
         for(int i=0; i<length; i++){
                
             if(squares[i]!= Constants.NOTHING)//since some PIECES_BY_ID method (e.g pawn) cancels squares before this method call
                if(isOwnKingAttacks(square_loc,
                                    squares[i], 
                                    piece_side,
                                    knight_capturable_squares,
                                    vert_up,
                                    vert_down,
                                    horiz_left,
                                    horiz_right,
                                    top_left_diagonal,
                                    top_right_diagonal,                                    
                                    bottom_left_diagonal,
                                    bottom_right_diagonal))
                {                    
                    squares[i] = Constants.NOTHING;                                                   
                }   
             
             if(squares[i]== Constants.NOTHING)
                cancelled++;//count the cancelled here for reason that pawn or knight method might have done previous cancel             
             
         }
         
         int len = length - cancelled;
         int n=-1;
         int [] valid_squares = new int[len];
         
         for(int i=0; i < length; i++){
             if(squares[i]!=Constants.NOTHING){
                 n++;
                 valid_squares[n]=squares[i];
             }
         }
        
        return  valid_squares;        
    }
    
    public boolean isOwnKingAttacks(int current_square, 
                                    int to_square, 
                                    int piece_side,   
                                    int[] knight_capturable_squares,
                                    int[] vert_up,
                                    int[] vert_down,
                                    int[] horiz_left,
                                    int[] horiz_right,
                                    int[] top_left_diagonal,                                    
                                    int[] top_right_diagonal,
                                    int[] bottom_left_diagonal,                                    
                                    int[] bottom_right_diagonal){

        
        //check knight attack
        for(int i=0; i<knight_capturable_squares.length; i++){
            
            int sq = knight_capturable_squares[i];
            
            if(sq==to_square)//must be first condition.
                continue;//yes, continue since the knight squares do not form a path.                                               
                    
            if(board.Squares[sq] == Constants.NOTHING)
                continue;
            
            if(sq == current_square)
                continue;            

            int piece_id = board.Squares[sq];            
            Piece piece = board.PIECES_BY_ID[piece_id];              
            
            if(piece.side==piece_side)//if occupied by same piece
                continue;//yes

            //at this point the king could be under attack by knight

            
            if(piece.piece_name==Constants.Knight){
                return true;           
            }
        }        
        
        //check attack on upward vertical path.
                
        for(int i=0; i<vert_up.length; i++){
            
            int sq = vert_up[i];
            
            if(sq==to_square)//must be first condition
                break;            
            
            if(board.Squares[sq] == Constants.NOTHING)
                continue;
            
            if(sq == current_square)
                continue;            
                      
            int piece_id = board.Squares[sq];            
            Piece piece = board.PIECES_BY_ID[piece_id];  
            
            if(piece.side==piece_side)                    
                break;

            //at this point the king could be under attack by queen or rook or opponent king            
            
            
            switch(piece.piece_name){
                case Constants.Rook : return true;
                case Constants.Queen : return true;    
                case Constants.King :{
                    if(i==0)
                        return true;//king versus king
                    else
                        break;//king pose not threat
                }                      
            }                        
            
            //At this point the the piece cannot attack king so break from the for loop.
            //NOTE THIS BREAK WAS NOT USED IN THE SWITCH DEFAULT SINCE THE SWITCH ALREADY HAS BREAK STATEMENT - PLEASE AVOID THAT.
            break;                                                 
        }        
        
        //check attack on downward vertical path
        
        for(int i=0; i<vert_down.length; i++){
            
            int sq = vert_down[i];            
            
            if(sq==to_square)//must be first condition
                break;            
            
            if(board.Squares[sq] == Constants.NOTHING)
                continue;
            
            if(sq == current_square)
                continue;            
                      
            int piece_id = board.Squares[sq];            
            Piece piece = board.PIECES_BY_ID[piece_id];  
            
            if(piece.side==piece_side)                    
                break;
            
            //at this point the king could be under attack by queen or rook or opponent king

            
            switch(piece.piece_name){
                case Constants.Rook : return true;
                case Constants.Queen : return true;    
                case Constants.King :{
                    if(i==0)
                        return true;//king versus king
                    else
                        break;//king pose not threat
                }      
            }            
            
            //At this point the the piece cannot attack king so break from the for loop.
            //NOTE THIS BREAK WAS NOT USED IN THE SWITCH DEFAULT SINCE THE SWITCH ALREADY HAS BREAK STATEMENT - PLEASE AVOID THAT.
            break;                                 
        }                
        
        //check attack on left horizontal path
        for(int i=0; i<horiz_left.length; i++){
            
            int sq = horiz_left[i];
                        
            if(sq==to_square)//must be first condition
                break;            
            
            if(board.Squares[sq] == Constants.NOTHING)
                continue;
            
            if(sq == current_square)
                continue;            
                      
            int piece_id = board.Squares[sq];            
            Piece piece = board.PIECES_BY_ID[piece_id];  
            
            if(piece.side==piece_side)                    
                break;
            
            //at this point the king could be under attack by queen or rook or opponent king

            
            switch(piece.piece_name){
                case Constants.Rook : return true;
                case Constants.Queen : return true;    
                case Constants.King :{
                    if(i==0)
                        return true;//king versus king
                    else
                        break;//king pose not threat
                }      
            }          
            
            //At this point the the piece cannot attack king so break from the for loop.
            //NOTE THIS BREAK WAS NOT USED IN THE SWITCH DEFAULT SINCE THE SWITCH ALREADY HAS BREAK STATEMENT - PLEASE AVOID THAT.
            break;                                             
        }                        
        
        
        //check attack on left horizontal path
        for(int i=0; i<horiz_right.length; i++){
            
            int sq = horiz_right[i];            
            
            if(sq==to_square)//must be first condition
                break;            
            
            if(board.Squares[sq] == Constants.NOTHING)
                continue;
            
            if(sq == current_square)
                continue;            
                      
            int piece_id = board.Squares[sq];            
            Piece piece = board.PIECES_BY_ID[piece_id];  
            
            if(piece.side==piece_side)                    
                break;
            
            //at this point the king could be under attack by queen or rook or opponent king
            //Piece piece = board.getPieceOnSquare(horiz_right[i]);
            
            switch(piece.piece_name){
                case Constants.Rook : return true;
                case Constants.Queen : return true;    
                case Constants.King :{
                    if(i==0)
                        return true;//king versus king
                    else
                        break;//king pose not threat
                }      
            }            
            
            //At this point the the piece cannot attack king so break from the for loop.
            //NOTE THIS BREAK WAS NOT USED IN THE SWITCH DEFAULT SINCE THE SWITCH ALREADY HAS BREAK STATEMENT - PLEASE AVOID THAT.
            break;                                             
        }                                
        
        //check attack on upward right diagonal path
        for(int i=0; i<top_right_diagonal.length; i++){
            
            int sq = top_right_diagonal[i];                        
            
            if(sq==to_square)//must be first condition
                break;            
            
            if(board.Squares[sq] == Constants.NOTHING)
                continue;
            
            if(sq == current_square)
                continue;            
                      
            int piece_id = board.Squares[sq];            
            Piece piece = board.PIECES_BY_ID[piece_id];  
            
            if(piece.side==piece_side)                    
                break;            

            //at this point the king could be under attack by queen or bishop or opponent king - pawn attack has already been dealt with above

                        
            switch(piece.piece_name){
                case Constants.Bishop : return true;
                case Constants.Queen : return true;    
                case Constants.Pawn : {
                    if(i==0 && piece.isBlack())//black pawn located upward diagonally to capture(check) downwardly
                        return true;//pawn attack king
                    else
                        break;//pawn pose no threat
                }                    
                case Constants.King :{
                    if(i==0)
                        return true;//king versus king
                    else
                        break;//king pose not threat
                }      
            }            
            
            //At this point the the piece cannot attack king so break from the for loop.
            //NOTE THIS BREAK WAS NOT USED IN THE SWITCH DEFAULT SINCE THE SWITCH ALREADY HAS BREAK STATEMENT - PLEASE AVOID THAT.
            break;                                             
        }                

        //check attack on upward left diagonal path
        for(int i=0; i<top_left_diagonal.length; i++){
            
            int sq = top_left_diagonal[i];
            
            if(sq==to_square)//must be first condition
                break;            
            
            if(board.Squares[sq] == Constants.NOTHING)
                continue;
            
            if(sq == current_square)
                continue;            
                      
            int piece_id = board.Squares[sq];            
            Piece piece = board.PIECES_BY_ID[piece_id];  
            
            if(piece.side==piece_side)                    
                break;
            
            //at this point the king could be under attack by queen or bishop or opponent king - pawn attack has already been dealt with above

                        
            switch(piece.piece_name){
                case Constants.Bishop : return true;
                case Constants.Queen : return true;    
                case Constants.Pawn : {
                    if(i==0 && piece.isBlack())//black pawn located upward diagonally to capture(check) downwardly
                        return true;//pawn attack king
                    else
                        break;//pawn pose no threat
                }                    
                case Constants.King :{
                    if(i==0)
                        return true;//king versus king
                    else
                        break;//king pose not threat
                }      
            }            
            
            //At this point the the piece cannot attack king so break from the for loop.
            //NOTE THIS BREAK WAS NOT USED IN THE SWITCH DEFAULT SINCE THE SWITCH ALREADY HAS BREAK STATEMENT - PLEASE AVOID THAT.
            break;                                             
        }                        

        
        //check attack on downward right diagonal path
        for(int i=0; i<bottom_right_diagonal.length; i++){
            
            int sq = bottom_right_diagonal[i];
            
            if(sq==to_square)//must be first condition
                break;            
            
            if(board.Squares[sq] == Constants.NOTHING)
                continue;
            
            if(sq == current_square)
                continue;            
                      
            int piece_id = board.Squares[sq];            
            Piece piece = board.PIECES_BY_ID[piece_id];  
            
            if(piece.side==piece_side)                    
                break;
            
            //at this point the king could be under attack by queen, bishop pawn or opponent king - pawn attack has already been dealt with above

                        
            switch(piece.piece_name){
                case Constants.Bishop : return true;
                case Constants.Queen : return true;    
                case Constants.Pawn : {
                    if(i==0 && piece.isWhite())//white pawn located downward diagonally to capture(check) upwardly
                        return true;//pawn attack king
                    else
                        break;//pawn pose no threat
                }                    
                case Constants.King :{
                    if(i==0)
                        return true;//king versus king
                    else
                        break;//king pose not threat
                }      
            }            
            
            //At this point the the piece cannot attack king so break from the for loop.
            //NOTE THIS BREAK WAS NOT USED IN THE SWITCH DEFAULT SINCE THE SWITCH ALREADY HAS BREAK STATEMENT - PLEASE AVOID THAT.
            break;                                             
        }                        

        
        //check attack on downward left diagonal path
        for(int i=0; i<bottom_left_diagonal.length; i++){
            
            int sq = bottom_left_diagonal[i];
            
            if(sq==to_square)//must be first condition
                break;            
            
            if(board.Squares[sq] == Constants.NOTHING)
                continue;
            
            if(sq == current_square)
                continue;            
                      
            int piece_id = board.Squares[sq];            
            Piece piece = board.PIECES_BY_ID[piece_id];  
            
            if(piece.side==piece_side)                    
                break;
            
            //at this point the king could be under attack by queen, bishop ,pawn or opponent king - pawn attack has already been dealt with above            

                        
            switch(piece.piece_name){
                case Constants.Bishop : return true;
                case Constants.Queen : return true;    
                case Constants.Pawn : {
                    if(i==0 && piece.isWhite())//white pawn located downward diagonally to capture(check) upwardly
                        return true;//pawn attack king
                    else
                        break;//pawn pose no threat
                }     
                case Constants.King :{
                    if(i==0)
                        return true;//king versus king
                    else
                        break;//king pose no threat
                }      
            }            
            
            //At this point the the piece cannot attack king so break from the for loop.
            //NOTE THIS BREAK WAS NOT USED IN THE SWITCH DEFAULT SINCE THE SWITCH ALREADY HAS BREAK STATEMENT - PLEASE AVOID THAT.
            break;                                             
        }                                
        
        return false;
    }
    
    public int[] getBishopValidMoveSquares(int square_loc, int  piece_side, int piece_virtual_id, int piece_virtual_square_position){
        
        //new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not
        
        int[] top_right_diagonal = getTopRightDiagonalSquares(square_loc);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(square_loc);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(square_loc);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(square_loc);        
        
        
        int index=-1;
        int[] postions=new int[this.total_chess_pieces];

        if(top_right_diagonal!=null)
            for(int i=0; i<top_right_diagonal.length; i++){                       
                
                if(!isOccupiedBySamePiece(top_right_diagonal[i], piece_side)){                
                    index++;                                            
                    postions[index]=top_right_diagonal[i];                    
                }
                
                if(isOccupied(top_right_diagonal[i]))                
                    break;                
            }

        if(top_left_diagonal!=null)
            for(int i=0; i<top_left_diagonal.length; i++){                       
                
                if(!isOccupiedBySamePiece(top_left_diagonal[i], piece_side)){                
                    index++;                                            
                    postions[index]=top_left_diagonal[i];                    
                }
                
                if(isOccupied(top_left_diagonal[i]))                
                    break;
                                
            }
        
        if(bottom_right_diagonal!=null)
            for(int i=0; i<bottom_right_diagonal.length; i++){                       
                
                if(!isOccupiedBySamePiece(bottom_right_diagonal[i], piece_side)){                
                    index++;                                            
                    postions[index]=bottom_right_diagonal[i];                    
                }
                
                if(isOccupied(bottom_right_diagonal[i]))                
                    break;
                
            }

        if(bottom_left_diagonal!=null)
            for(int i=0; i<bottom_left_diagonal.length; i++){                       
    
                if(!isOccupiedBySamePiece(bottom_left_diagonal[i], piece_side)){                
                    index++;                                            
                    postions[index]=bottom_left_diagonal[i];                    
                }
                
                if(isOccupied(bottom_left_diagonal[i]))                
                    break;
            
            }
        
        
        int [] unresolved_valid_pos=new int[index+1];

        System.arraycopy(postions, 0, unresolved_valid_pos, 0, index+1);

        /*
        if(!this.containsSquareIn(unresolved_valid_pos, to_square)){
            new_move.setInvalidMoveMessage("Bishop may move diagonally any number of spaces in a straigth line \nprovided the path is not blocked.");
            new_move.setIsValidMove(false);
        }
         * 
         */
                        

        //OPPONENT KING
        //inspectOpponentKing(new_move, unresolved_valid_pos,to_square, piece_side);
        
        
        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        int[] real_valid;
        real_valid = inspectOwnKing(Constants.Bishop, unresolved_valid_pos, square_loc, piece_side, piece_virtual_id, piece_virtual_square_position);
        
        return  real_valid;
    }
    
    //COME BACK TO TAKE CARE OF EN PASSANT OPPORTUNITY I COMMENTED BELLOW - SCROLL DOWN - DO NOT FORGET ABEG O!!!!
    public int[] getPawnValidMoveSquares(int square_loc, int  piece_side, boolean is_first_move, boolean has_en_passant, int piece_virtual_id, int piece_virtual_square_position){
       
        int[] unresolved_valid_pos=null;
        
        //new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not
         Piece piece = this.getPieceByID(piece_virtual_id);
         int virtual_piece_side=piece!=null?piece.Me():Constants.NOTHING;
         
        Piece pawn_piece=this.getPieceOnThisSquare(square_loc);
        
        if(piece_side==Side.white){
            int[] vert_up = getVerticalUpwardSquares(square_loc);
            int[] top_right_diagonal = getTopRightDiagonalSquares(square_loc);
            int[] top_left_diagonal = getTopLeftDiagonalSquares(square_loc);            
            
            int index=-1;
            int[] postions=new int[this.total_chess_pieces];
              
            if(pawn_piece.isEnPassantOpportunity()){
                Piece en_passant_pawn_to_be_captured=this.getPieceByID(pawn_piece.getEnPassantPawnToCapturePieceID());
               
                if(en_passant_pawn_to_be_captured!=null){
                    int en_passant_pawn_to_capture_square_pos=en_passant_pawn_to_be_captured.getPieceSquarePosition();
                    int en_passant_dest_square=Constants.NOTHING;
                    if(square_loc > en_passant_pawn_to_capture_square_pos){                            
                        index++;                                            
                        en_passant_dest_square=top_left_diagonal[0];
                        postions[index]=en_passant_dest_square;
                    }else if(square_loc < en_passant_pawn_to_capture_square_pos){
                        index++;                           
                        en_passant_dest_square=top_right_diagonal[0];                            
                        postions[index]=en_passant_dest_square;
                    }
                    /*
                    if(en_passant_dest_square!=Constants.NOTHING)
                        if(to_square==en_passant_dest_square){
                            new_move.getEnPassant().setIsEnPassantCaptureMove(true);
                            new_move.getEnPassant().setEnPassantPawnToCapturePieceID(pawn_piece.getEnPassantPawnToCapturePieceID());
                            System.err.println("white pawn makes en passant move");
                        }                                        
                     * 
                     */
                }
            }
             
            if(is_first_move)
                if(vert_up!=null)
                    if(vert_up.length>1){                       

                        for(int i=0; i<2; i++){
                            
                            if(isOccupied(vert_up[i]))
                                break;
                                                        
                            if(virtual_piece_side!=piece_side)
                                if(piece_virtual_square_position==vert_up[i]){
                                    break;                      
                                }                                    
                            
                            index++;                                            
                            postions[index]=vert_up[i];                              
                        }
                        
                    }
            
             if(!is_first_move)
                if(vert_up!=null)
                    if(vert_up.length>0){                       
                        
                        if(!isOccupied(vert_up[0])){                
                            index++;                                            
                            postions[index]=vert_up[0];                    
                        }
                        
                        if(virtual_piece_side!=piece_side)
                            if(piece_virtual_square_position==vert_up[0]){                                                                            
                                postions[index]=Constants.NOTHING;  //cancel            
                            }                                    
                                                    
                    }
            
            if(top_right_diagonal!=null)
                if(top_right_diagonal.length>0){    
                    
                    if(isOccupiedByOpponentPiece(top_right_diagonal[0], piece_side)){                
                        index++;                                            
                        postions[index]=top_right_diagonal[0];                    
                    }                    
                        
                    if(virtual_piece_side!=piece_side)
                        if(piece_virtual_square_position==top_right_diagonal[0]){                                                                            
                            index++;                                            
                            postions[index]=top_right_diagonal[0];         
                        }                      
                }
            

            if(top_left_diagonal!=null)
                if(top_left_diagonal.length>0){              
                    
                    if(isOccupiedByOpponentPiece(top_left_diagonal[0], piece_side)){                
                        index++;                                            
                        postions[index]=top_left_diagonal[0];                    
                    }
                        
                    if(virtual_piece_side!=piece_side)
                        if(piece_virtual_square_position==top_left_diagonal[0]){                                                                            
                            index++;                                            
                            postions[index]=top_left_diagonal[0];         
                        }                      
                }
            
            unresolved_valid_pos=new int[index+1];

            System.arraycopy(postions, 0, unresolved_valid_pos, 0, index+1);                        
        }
        

        if(piece_side==Side.black){
            int[] vert_down = getVerticalDownwardSquares(square_loc);
            int[] bottom_right_diagonal = getBottomRightDiagonalSquares(square_loc);        
            int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(square_loc);                    
            int index=-1;
            int[] postions=new int[this.total_chess_pieces];

            if(pawn_piece.isEnPassantOpportunity()){
                Piece en_passant_pawn_to_be_captured=this.getPieceByID(pawn_piece.getEnPassantPawnToCapturePieceID());
               
                if(en_passant_pawn_to_be_captured!=null){
                    int en_passant_pawn_to_capture_square_pos=en_passant_pawn_to_be_captured.getPieceSquarePosition();
                    int en_passant_dest_square=Constants.NOTHING;
                    if(square_loc > en_passant_pawn_to_capture_square_pos){                            
                        index++;                                            
                        en_passant_dest_square=bottom_left_diagonal[0];
                        postions[index]=en_passant_dest_square;
                    }else if(square_loc < en_passant_pawn_to_capture_square_pos){
                        index++;                           
                        en_passant_dest_square=bottom_right_diagonal[0];                            
                        postions[index]=en_passant_dest_square;
                    }
                    /*
                    if(en_passant_dest_square!=Constants.NOTHING)
                        if(to_square==en_passant_dest_square){
                            new_move.getEnPassant().setIsEnPassantCaptureMove(true);
                            new_move.getEnPassant().setEnPassantPawnToCapturePieceID(pawn_piece.getEnPassantPawnToCapturePieceID());
                            System.err.println("balck pawn makes en passant move");
                        }                                        
                     * 
                     */
                }
            }
            
             if(is_first_move)
                 if(vert_down!=null)
                    if(vert_down.length>1){                       

                        for(int i=0; i<2; i++){

                            if(isOccupied(vert_down[i]))                        
                                break;
                                                        
                            if(virtual_piece_side!=piece_side)
                                if(piece_virtual_square_position==vert_down[i]){
                                    break;                      
                                }  
                            
                            index++;                                                                    
                            postions[index]=vert_down[i];                                                      
                        }
                    }
            
             if(!is_first_move)
                 if(vert_down!=null)
                    if(vert_down.length>0){                       
                        if(!isOccupied(vert_down[0])){                
                            index++;                                            
                            postions[index]=vert_down[0];                    
                        }
                        
                        if(virtual_piece_side!=piece_side)
                            if(piece_virtual_square_position==vert_down[0]){                                                                            
                                postions[index]=Constants.NOTHING;  //cancel            
                            }                                    
                            
                    }
                        

            if(bottom_right_diagonal!=null)
                if(bottom_right_diagonal.length>0){                       
                    if(isOccupiedByOpponentPiece(bottom_right_diagonal[0], piece_side)){                
                        index++;                                            
                        postions[index]=bottom_right_diagonal[0];                    
                    }
                        
                    if(virtual_piece_side!=piece_side)
                        if(piece_virtual_square_position==bottom_right_diagonal[0]){                                                                            
                            index++;                                            
                            postions[index]=bottom_right_diagonal[0];         
                        }
                }
            

            if(bottom_left_diagonal!=null)
                if(bottom_left_diagonal.length>0){                       
                    if(isOccupiedByOpponentPiece(bottom_left_diagonal[0], piece_side)){                
                        index++;                                            
                        postions[index]=bottom_left_diagonal[0];                    
                    }
                        
                    if(virtual_piece_side!=piece_side)
                        if(piece_virtual_square_position==bottom_left_diagonal[0]){                                                                            
                            index++;                                            
                            postions[index]=bottom_left_diagonal[0];         
                        }
                }
            
            unresolved_valid_pos=new int[index+1];

            System.arraycopy(postions, 0, unresolved_valid_pos, 0, index+1);            
        }
     

        /*
        if(!this.containsSquareIn(unresolved_valid_pos, to_square)){
            new_move.setInvalidMoveMessage("Pawn may only move forward one space or two space in the first move.\nPawns may capture diagonally one space forward.");
            new_move.setIsValidMove(false);
        }
         * 
         */
                    
        

        //OPPONENT KING
        //inspectOpponentKing(new_move, unresolved_valid_pos,to_square, piece_side);
        
        
        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        
        int[] real_valid;
        
        real_valid=inspectOwnKing(Constants.Pawn, unresolved_valid_pos, square_loc, piece_side, piece_virtual_id, piece_virtual_square_position);
       /* 
        //handle enpassant opportunity
        if(new_move.isMoveValid())
            if(is_first_move)
                if(Math.abs(from_square-to_square)==16){//that two square vertically upwards or downwards
                    
                    setEnPassantOpportunityOnCorrespondingPieces(new_move.getEnPassant(),from_square, to_square , piece_side);
                }
         * 
         */
        
        return real_valid;
    }
    
    ChessMove inspectOpponentKing(ChessMove new_move, int[] unresolved_valid_pos ,int to_square, int piece_side){

        //check if opponent king is in check (under attack)      
       
        int opponent_king_pos=-1;
        
        for(int i=0; i<unresolved_valid_pos.length; i++){
            Piece piece = this.getPieceOnThisSquare(unresolved_valid_pos[i]);
            if(piece!=null)
                if(piece.Me()!=piece_side)
                    if(piece.piece_name==Constants.King){
                        //Yes the opponent king is in check since no other piece is in between the piece and the king.
                        //This was by computation from the method that called this method. Remmeber the valid (unresolved)
                        //positions were gotten based on the fact that the path is not blocked.
                        new_move.setIsOpponentKingInCheck(true);
                        new_move.setSquarePositionOfOpponentKingInCheck(unresolved_valid_pos[i]);
                        opponent_king_pos=unresolved_valid_pos[i];                        
                        break;
                    }
        }
        
        int [] new_valid_pos=null;
        
        if(opponent_king_pos!=-1){
            new_valid_pos= new int[unresolved_valid_pos.length-1];
            int index=-1;
            for(int i=0; i<unresolved_valid_pos.length; i++){
                
                if(unresolved_valid_pos[i]==opponent_king_pos)
                    continue;
                
                index++;
                new_valid_pos[index]=unresolved_valid_pos[i];
            }
        }else{
            new_valid_pos=unresolved_valid_pos;
            new_move.setIsOpponentKingInCheck(false);
            new_move.setSquarePositionOfOpponentKingInCheck(-1);
        }
        
        if(opponent_king_pos!=-1)
            if(to_square==opponent_king_pos){            

                new_move.setInvalidMoveMessage("Invalid capture attempt. You cannot capture a king.");           
                new_move.setIsValidMove(false);
            }
        
        new_move.setValidSquares(new_valid_pos);
        
        return new_move;
    }
    
    /** Handle the case of own king being in check or being delivered check by own piece moving 
     *  from a position that will put own king in check.       
     * 
     * 
     * @param new_move
     * @param piece_name
     * @param unresolved_valid_pos
     * @param from_square
     * @param to_square
     * @param piece_side
     * 
     * @return 
     */
    int[] inspectOwnKing(char piece_name, int[] unresolved_valid_pos, int from_square,int piece_side, int piece_virtual_id, int piece_virtual_square_position){
        
        int num_cancelled = 0;
        
        for(int i=0; i<unresolved_valid_pos.length; i++){
            boolean result_in_check = willOwnKingBeInCheckWithOwnPieceMove(piece_name, from_square, unresolved_valid_pos[i], piece_side, piece_virtual_id, piece_virtual_square_position);
            if(result_in_check){
                unresolved_valid_pos[i]=-1;//check this position
                num_cancelled++;
            }
        }
        
        int [] valid_pos=new int[unresolved_valid_pos.length-num_cancelled];
        int index = -1;
        
        for(int i=0; i<unresolved_valid_pos.length; i++){
               if(unresolved_valid_pos[i]==-1)
                   continue;
               index++;
               valid_pos[index]=unresolved_valid_pos[i];
        }
        
        /*
        if(new_move.isMoveValid())//if still valid
            if(!this.containsSquareIn(valid_pos, to_square)){

                new_move.setInvalidMoveMessage("Invalid move: You cannot make that move. Your king is either in check or will be under attack.");                       
                new_move.setIsValidMove(false);            
            }
        
        new_move.setValidSquares(valid_pos);
        
         * 
         */
        
        //return new_move;
        
        return valid_pos;
    }
    
    int [] getPawnCapturableSquares(int piece_square_pos, int piece_side){
       
        
        if(piece_square_pos==-1)
            return new int[0];
        
        int[] capture_squares=new int[0];

        
        if(piece_side==Side.white){
            int[] top_right_diagonal = getTopRightDiagonalSquares(piece_square_pos);
            int[] top_left_diagonal = getTopLeftDiagonalSquares(piece_square_pos);            
            
            int index=-1;
            int[] postions=new int[total_chess_pieces];
                

            if(top_right_diagonal!=null)
                if(top_right_diagonal.length>0){                                               
                    index++;                                            
                    postions[index]=top_right_diagonal[0];                                        
                }
            

            if(top_left_diagonal!=null)
                if(top_left_diagonal.length>0){                                               
                    index++;                                            
                    postions[index]=top_left_diagonal[0];                                        
                }
            
            capture_squares=new int[index+1];

            System.arraycopy(postions, 0, capture_squares, 0, index+1);                        
        }
        

        if(piece_side==Side.black){
            int[] bottom_right_diagonal = getBottomRightDiagonalSquares(piece_square_pos);        
            int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(piece_square_pos);                    
            int index=-1;
            int[] postions=new int[this.total_chess_pieces];
                        

            if(bottom_right_diagonal!=null)
                if(bottom_right_diagonal.length>0){                                               
                    index++;                                            
                    postions[index]=bottom_right_diagonal[0];                                        
                }
            

            if(bottom_left_diagonal!=null)
                if(bottom_left_diagonal.length>0){                                           
                    index++;                                            
                    postions[index]=bottom_left_diagonal[0];                                        
                }
            
            capture_squares=new int[index+1];

            System.arraycopy(postions, 0, capture_squares, 0, index+1);            
        }
                   
        return capture_squares;
    }
    
    private boolean  isKingInCheckByQueenAtSquare(int queen_square, int king_square, int  piece_side, Piece virtual_captured_piece){
        
            
        if(queen_square==-1){
            return false;
        }
        
        int[] vert_up = getVerticalUpwardSquares(queen_square);
        int[] vert_down = getVerticalDownwardSquares(queen_square);
        int[] horiz_left = getHorizontalLeftwardSquares(queen_square);        
        int[] horiz_right = getHorizontalRightwardSquares(queen_square);        

        int[] top_right_diagonal = getTopRightDiagonalSquares(queen_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(queen_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(queen_square);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(queen_square);        
        
        
        if(vert_up!=null)
            if(containsSquareIn(vert_up, king_square)){
                
                for(int i=0; i<vert_up.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_up[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                                                                
                                        
                    if(vert_up[i]==king_square){
                        return true;
                    }
                    
                }
            }

        if(vert_down!=null)
            if(containsSquareIn(vert_down, king_square)){
                
                for(int i=0; i<vert_down.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_down[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                
                    if(vert_down[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        if(horiz_left!=null)
            if(containsSquareIn(horiz_left, king_square)){
                
                for(int i=0; i<horiz_left.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_left[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(horiz_left[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        if(horiz_right!=null)
            if(containsSquareIn(horiz_right, king_square)){
                
                for(int i=0; i<horiz_right.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_right[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(horiz_right[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        
        if(top_right_diagonal!=null)
            if(containsSquareIn(top_right_diagonal, king_square)){
                
                for(int i=0; i<top_right_diagonal.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_right_diagonal[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(top_right_diagonal[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        if(top_left_diagonal!=null)
            if(containsSquareIn(top_left_diagonal, king_square)){
                
                for(int i=0; i<top_left_diagonal.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_left_diagonal[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(top_left_diagonal[i]==king_square){
                        return true;
                    }
                    
                }
            }       
                
        if(bottom_right_diagonal!=null)
            if(containsSquareIn(bottom_right_diagonal, king_square)){
                
                for(int i=0; i<bottom_right_diagonal.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_right_diagonal[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(bottom_right_diagonal[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        if(bottom_left_diagonal!=null)
            if(containsSquareIn(bottom_left_diagonal, king_square)){
                
                for(int i=0; i<bottom_left_diagonal.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_left_diagonal[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(bottom_left_diagonal[i]==king_square){
                        return true;
                    }
                    
                }
            }                                       
                 
        return  false;
    }

    int [] getKnightCapturableSquares(int piece_square_pos){
        
        int pos1=-1;
        int pos2=-1;
        int pos3=-1;
        int pos4=-1;
        int pos5=-1;
        int pos6=-1;
        int pos7=-1;
        int pos8=-1;
       
        int index=-1;
        
        int[] postions=new int[8];
        
        int[] vert_up = getVerticalUpwardSquares(piece_square_pos);
        int[] vert_down = getVerticalDownwardSquares(piece_square_pos);
        int[] horiz_left = getHorizontalLeftwardSquares(piece_square_pos);        
        int[] horiz_right = getHorizontalRightwardSquares(piece_square_pos);        

        //handle vert_up
        if(vert_up!=null)
            if(vert_up.length>=2){
                
                int pos=vert_up[1];
                int[]n=getHorizontalLeftwardSquares(pos);
                int[]m=getHorizontalRightwardSquares(pos);
                
                if(n!=null)
                    if(n.length>0){
                        pos1=n[0];                        
                        index++;                        
                        postions[index]=pos1;                                                
                    }

                if(m!=null)
                    if(m.length>0){
                        pos2=m[0];
                        index++;                        
                        postions[index]=pos2;                        
                    }
                
            }

        //handle vert_down
        if(vert_down !=null)
            if(vert_down.length>=2){
                
                int pos=vert_down[1];
                int[]n=getHorizontalLeftwardSquares(pos);
                int[]m=getHorizontalRightwardSquares(pos);
                
                if(n!=null)
                    if(n.length>0){
                        pos3=n[0];
                        index++;                        
                        postions[index]=pos3;                                             
                    }

                if(m!=null)
                    if(m.length>0){
                        pos4=m[0];
                        index++;                        
                        postions[index]=pos4;                                             
                    }
                
            }
                
        //handle horiz_left
        if(horiz_left !=null)
            if(horiz_left.length>=2){
                
                int pos=horiz_left[1];
                int[]n=getVerticalUpwardSquares(pos);
                int[]m=getVerticalDownwardSquares(pos);
                
                if(n!=null)
                    if(n.length>0){
                        pos5=n[0];
                        index++;                        
                        postions[index]=pos5;                                             
                    }

                if(m!=null)
                    if(m.length>0){
                        pos6=m[0];
                        index++;                        
                        postions[index]=pos6;                                             
                    }                
            }
                
        //handle horiz_right
        if(horiz_right !=null)
            if(horiz_right.length>=2){
                
                int pos=horiz_right[1];
                int[]n=getVerticalUpwardSquares(pos);
                int[]m=getVerticalDownwardSquares(pos);
                
                if(n!=null)
                    if(n.length>0){
                        pos7=n[0];
                        index++;                        
                        postions[index]=pos7;                                             
                    }

                if(m!=null)
                    if(m.length>0){
                        pos8=m[0];
                        index++;                        
                        postions[index]=pos8;                                             
                    }                
            }
        
        int [] valid_pos=new int[index+1];
        
        System.arraycopy(postions, 0, valid_pos, 0, index+1);                               
        
        return  valid_pos;        
    }
    
    private boolean isKingInCheckByBishopAtSquare(int bishop_square, int king_square, int piece_side, Piece virtual_captured_piece) {
        
        if(bishop_square==-1)
            return false;
        
        int[] top_right_diagonal = getTopRightDiagonalSquares(bishop_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(bishop_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(bishop_square);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(bishop_square);        
        
        if(top_right_diagonal!=null)
            if(containsSquareIn(top_right_diagonal, king_square)){
                
                for(int i=0; i<top_right_diagonal.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_right_diagonal[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(top_right_diagonal[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        if(top_left_diagonal!=null)
            if(containsSquareIn(top_left_diagonal, king_square)){
                
                for(int i=0; i<top_left_diagonal.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_left_diagonal[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(top_left_diagonal[i]==king_square){
                        return true;
                    }
                    
                }
            }       
                
        if(bottom_right_diagonal!=null)
            if(containsSquareIn(bottom_right_diagonal, king_square)){
                
                for(int i=0; i<bottom_right_diagonal.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_right_diagonal[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(bottom_right_diagonal[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        if(bottom_left_diagonal!=null)
            if(containsSquareIn(bottom_left_diagonal, king_square)){
                
                for(int i=0; i<bottom_left_diagonal.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_left_diagonal[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(bottom_left_diagonal[i]==king_square){
                        return true;
                    }
                    
                }
            }                                       
                 
        return  false;        
    }   
    
    private boolean  isKingInCheckByRookAtSquare(int rook_square, int king_square, int  piece_side, Piece virtual_captured_piece){

        
        if(rook_square==-1)
            return false;
        
        int[] vert_up = getVerticalUpwardSquares(rook_square);
        int[] vert_down = getVerticalDownwardSquares(rook_square);
        int[] horiz_left = getHorizontalLeftwardSquares(rook_square);        
        int[] horiz_right = getHorizontalRightwardSquares(rook_square);                     
        
        if(vert_up!=null)
            if(containsSquareIn(vert_up, king_square)){
                
                for(int i=0; i<vert_up.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_up[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(vert_up[i]==king_square){
                        return true;
                    }
                    
                }
            }

        if(vert_down!=null)
            if(containsSquareIn(vert_down, king_square)){
                
                for(int i=0; i<vert_down.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_down[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(vert_down[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        if(horiz_left!=null)
            if(containsSquareIn(horiz_left, king_square)){
                
                for(int i=0; i<horiz_left.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_left[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(horiz_left[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        if(horiz_right!=null)
            if(containsSquareIn(horiz_right, king_square)){
                
                for(int i=0; i<horiz_right.length; i++){  

                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_right[i], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(horiz_right[i]==king_square){
                        return true;
                    }
                    
                }
            }       
        
        return  false;
    }    
    
    
    private boolean  isKingInUnderAttackByOpponentKingAtSquare(int attacking_king_square, int king_square, int  piece_side, Piece virtual_captured_piece){
        
        if(attacking_king_square==-1)
            return false;
        
        int[] vert_up = getVerticalUpwardSquares(attacking_king_square);
        int[] vert_down = getVerticalDownwardSquares(attacking_king_square);
        int[] horiz_left = getHorizontalLeftwardSquares(attacking_king_square);        
        int[] horiz_right = getHorizontalRightwardSquares(attacking_king_square);        

        int[] top_right_diagonal = getTopRightDiagonalSquares(attacking_king_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(attacking_king_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(attacking_king_square);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(attacking_king_square);        
        
        
        if(vert_up!=null)
            if(containsSquareIn(vert_up, king_square)){
                
                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_up[0], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(vert_up[0]==king_square){
                        return true;
                    }
            }

        if(vert_down!=null)
            if(containsSquareIn(vert_down, king_square)){
                
                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_down[0], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(vert_down[0]==king_square){
                        return true;
                    }
                                    
            }       
        
        if(horiz_left!=null)
            if(containsSquareIn(horiz_left, king_square)){
                
                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_left[0], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(horiz_left[0]==king_square){
                        return true;
                    }
                                   
            }       
        
        if(horiz_right!=null)
            if(containsSquareIn(horiz_right, king_square)){
                
                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_right[0], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(horiz_right[0]==king_square){
                        return true;
                    }
                                    
            }       
        
        
        if(top_right_diagonal!=null)
            if(containsSquareIn(top_right_diagonal, king_square)){
                
                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_right_diagonal[0], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(top_right_diagonal[0]==king_square){
                        return true;
                    }                                    
            }       
        
        if(top_left_diagonal!=null)
            if(containsSquareIn(top_left_diagonal, king_square)){
                
                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_left_diagonal[0], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(top_left_diagonal[0]==king_square){
                        return true;
                    }
                                    
            }       
                
        if(bottom_right_diagonal!=null)
            if(containsSquareIn(bottom_right_diagonal, king_square)){
                
                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_right_diagonal[0], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(bottom_right_diagonal[0]==king_square){
                        return true;
                    }
                                    
            }       
        
        if(bottom_left_diagonal!=null)
            if(containsSquareIn(bottom_left_diagonal, king_square)){
                
                    if(isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_left_diagonal[0], piece_side, virtual_captured_piece)){
                        return false;
                    }                    
                    
                    if(bottom_left_diagonal[0]==king_square){
                        return true;
                    }
                                    
            }                                       
                 
        return  false;
    }    
    
    public void setEnPassantOpportunityOnCorrespondingPieces(EnPassant en_passant,int from_square, int to_square, int piece_side) {

        int[] horiz_left=this.getHorizontalLeftwardSquares(to_square);
        int[] horiz_right=this.getHorizontalRightwardSquares(to_square);
        Piece left_piece;
        Piece right_piece;
        Piece en_passant_pawn_to_be_captured=this.getPieceOnThisSquare(from_square);
        
        if(horiz_left!=null)
            if(horiz_left.length>0){
                left_piece=this.getPieceOnThisSquare(horiz_left[0]);

                if(left_piece!=null)
                    if(left_piece.Me()!=piece_side)
                        if(left_piece.piece_name==Constants.Pawn){
                            en_passant.setEnPassantLeftPawnCapturerPieceID(left_piece.getPieceID());
                            en_passant.setEnPassantPawnToCapturePieceID(en_passant_pawn_to_be_captured.getPieceID());
                        }
            }
        
        if(horiz_right!=null)
            if(horiz_right.length>0){
                right_piece=this.getPieceOnThisSquare(horiz_right[0]);

                if(right_piece!=null)
                    if(right_piece.Me()!=piece_side)
                        if(right_piece.piece_name==Constants.Pawn){
                            en_passant.setEnPassantRightPawnCapturerPieceID(right_piece.getPieceID());
                            en_passant.setEnPassantPawnToCapturePieceID(en_passant_pawn_to_be_captured.getPieceID());                    
                        }
            }
    }

    //Re touched
    private boolean hasEnPassantOpportunity(int piece_side) {

            Piece[] pieces=board.getAllPieces();
        
            for(int i=pieces.length - 1; i>-1; i--){
                if(pieces[i].Me()==piece_side)
                    if(pieces[i].isEnPassantOpportunity())
                        return true;
            }            
        
            return false;
    }

    //Re touched
    private void removeEnPassantOpportunity(int piece_side) {
         //Re touched block of code
                
        Piece[] pieces = board.getAllPieces();
            for(int i=pieces.length - 1; i>-1; i--){
                if(pieces[i].Me()==piece_side){
                   pieces[i].setEnPassantOpportunity(false); 
                   pieces[i].setEnPassantPawnToCapturePieceID(-1); 
                }
            }        
          
                         
    }

    private boolean willOwnKingBeCheckByBishopWithOwnPieceMove(int bishop_square,int king_pos, int from_square,  int to_square) {
            
        if(bishop_square==-1)
            return false;

        if(to_square==bishop_square)
            return false;//meaning the bishop is to be captured
        
        int[] top_right_diagonal = getTopRightDiagonalSquares(bishop_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(bishop_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(bishop_square);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(bishop_square);           
        

        //for top_right_diagonal
        if(top_right_diagonal!=null)
            if(this.containsSquareIn(top_right_diagonal, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the queen an piece
                for(int i=0; i<top_right_diagonal.length; i++){

                    if(top_right_diagonal[i]==king_pos)
                        break;//stop at king pos

                    if(top_right_diagonal[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(top_right_diagonal[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(top_right_diagonal[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                     
        
        
        //for top_left_diagonal
        if(top_left_diagonal!=null)
            if(this.containsSquareIn(top_left_diagonal, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the bishop and piece
                for(int i=0; i<top_left_diagonal.length; i++){

                    if(top_left_diagonal[i]==king_pos)
                        break;//stop at king pos

                    if(top_left_diagonal[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(top_left_diagonal[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(top_left_diagonal[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                             
        
        
        //for bottom_right_diagonal
        if(bottom_right_diagonal!=null)
            if(this.containsSquareIn(bottom_right_diagonal, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the bishop and piece
                for(int i=0; i<bottom_right_diagonal.length; i++){

                    if(bottom_right_diagonal[i]==king_pos)
                        break;//stop at king pos

                    if(bottom_right_diagonal[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(bottom_right_diagonal[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(bottom_right_diagonal[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                     
        

        //for bottom_left_diagonal
        if(bottom_left_diagonal!=null)
            if(this.containsSquareIn(bottom_left_diagonal, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the bishop and piece
                for(int i=0; i<bottom_left_diagonal.length; i++){

                    if(bottom_left_diagonal[i]==king_pos)
                        break;//stop at king pos

                    if(bottom_left_diagonal[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(bottom_left_diagonal[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(bottom_left_diagonal[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                             
        
        return false;
    }

    private boolean willOwnKingBeCheckByRookWithOwnPieceMove(int rook_square,int king_pos, int from_square,  int to_square) {
            
        if(rook_square==-1)
            return false;

        if(to_square==rook_square)
            return false;//meaning the rook is to be captured
                
        int[] vert_up = getVerticalUpwardSquares(rook_square);
        int[] vert_down = getVerticalDownwardSquares(rook_square);
        int[] horiz_left = getHorizontalLeftwardSquares(rook_square);        
        int[] horiz_right = getHorizontalRightwardSquares(rook_square);        
        
        
        //for vert_up
        if(vert_up!=null)
            if(this.containsSquareIn(vert_up, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the rook and piece
                for(int i=0; i<vert_up.length; i++){

                    if(vert_up[i]==king_pos)
                        break;//stop at king pos

                    if(vert_up[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(vert_up[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(vert_up[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }
        
                
        //for vert_down
        if(vert_down!=null)
            if(this.containsSquareIn(vert_down, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the rook and piece
                for(int i=0; i<vert_down.length; i++){

                    if(vert_down[i]==king_pos)
                        break;//stop at king pos

                    if(vert_down[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(vert_down[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(vert_down[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }        
        
                        
        //for horiz_right
        if(horiz_right!=null)
            if(this.containsSquareIn(horiz_right, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the rook and piece
                for(int i=0; i<horiz_right.length; i++){

                    if(horiz_right[i]==king_pos)
                        break;//stop at king pos

                    if(horiz_right[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(horiz_right[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(horiz_right[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
        
        
        //for horiz_left
        if(horiz_left!=null)
            if(this.containsSquareIn(horiz_left, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the rook and piece
                for(int i=0; i<horiz_left.length; i++){

                    if(horiz_left[i]==king_pos)
                        break;//stop at king pos

                    if(horiz_left[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(horiz_left[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(horiz_left[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                                
        
        return false;
    }

    private boolean willOwnKingBeCheckByQueenWithOwnPieceMove(int queen_square,int king_pos, int from_square,  int to_square) {
            
        if(queen_square==-1)
            return false;
        
        if(to_square==queen_square)
            return false;//meaning the queen is to be captured
        
        int[] vert_up = getVerticalUpwardSquares(queen_square);
        int[] vert_down = getVerticalDownwardSquares(queen_square);
        int[] horiz_left = getHorizontalLeftwardSquares(queen_square);        
        int[] horiz_right = getHorizontalRightwardSquares(queen_square);        

        int[] top_right_diagonal = getTopRightDiagonalSquares(queen_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(queen_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(queen_square);        
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(queen_square);   
        
        
        //for vert_up
        if(vert_up!=null)
            if(this.containsSquareIn(vert_up, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the queen and piece
                for(int i=0; i<vert_up.length; i++){

                    if(vert_up[i]==king_pos)
                        break;//stop at king pos

                    if(vert_up[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(vert_up[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(vert_up[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }
        
                
        //for vert_down
        if(vert_down!=null)
            if(this.containsSquareIn(vert_down, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the queen and piece
                for(int i=0; i<vert_down.length; i++){

                    if(vert_down[i]==king_pos)
                        break;//stop at king pos

                    if(vert_down[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(vert_down[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(vert_down[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }        
        
                        
        //for horiz_right
        if(horiz_right!=null)
            if(this.containsSquareIn(horiz_right, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the queen and piece
                for(int i=0; i<horiz_right.length; i++){

                    if(horiz_right[i]==king_pos)
                        break;//stop at king pos

                    if(horiz_right[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(horiz_right[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(horiz_right[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
        
        
        //for horiz_left
        if(horiz_left!=null)
            if(this.containsSquareIn(horiz_left, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the queen and piece
                for(int i=0; i<horiz_left.length; i++){

                    if(horiz_left[i]==king_pos)
                        break;//stop at king pos

                    if(horiz_left[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(horiz_left[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(horiz_left[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                
        

        //for top_right_diagonal
        if(top_right_diagonal!=null)
            if(this.containsSquareIn(top_right_diagonal, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the queen and piece
                for(int i=0; i<top_right_diagonal.length; i++){

                    if(top_right_diagonal[i]==king_pos)
                        break;//stop at king pos

                    if(top_right_diagonal[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(top_right_diagonal[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(top_right_diagonal[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                     
        
        
        //for top_left_diagonal
        if(top_left_diagonal!=null)
            if(this.containsSquareIn(top_left_diagonal, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the queen and piece
                for(int i=0; i<top_left_diagonal.length; i++){

                    if(top_left_diagonal[i]==king_pos)
                        break;//stop at king pos

                    if(top_left_diagonal[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(top_left_diagonal[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(top_left_diagonal[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                             
        
        
        //for bottom_right_diagonal
        if(bottom_right_diagonal!=null)
            if(this.containsSquareIn(bottom_right_diagonal, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the queen and piece
                for(int i=0; i<bottom_right_diagonal.length; i++){

                    if(bottom_right_diagonal[i]==king_pos)
                        break;//stop at king pos

                    if(bottom_right_diagonal[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(bottom_right_diagonal[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(bottom_right_diagonal[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                     
        

        //for bottom_left_diagonal
        if(bottom_left_diagonal!=null)
            if(this.containsSquareIn(bottom_left_diagonal, king_pos)){

                boolean is_path_blocked=false;
                //find out if there will be a piece between the queen and piece
                for(int i=0; i<bottom_left_diagonal.length; i++){

                    if(bottom_left_diagonal[i]==king_pos)
                        break;//stop at king pos

                    if(bottom_left_diagonal[i]==to_square){
                        is_path_blocked=true;
                        break;
                    }

                    if(bottom_left_diagonal[i]==from_square)
                        continue;//the path is not blocked
                    
                    if(this.isOccupied(bottom_left_diagonal[i])){
                        is_path_blocked=true;
                        break;                        
                    }
                        
                }
                
                if(is_path_blocked)
                    return false;
                else
                    return true;
                            
            }   
                             
        
        return false;
    }

    private boolean willOwnKingBeCheckByKnightWithOwnPieceMove(int knight_square,int king_pos, int from_square,  int to_square) {
        
        if(to_square==knight_square)
            return false;//meaning the knight is to be captured
        
        
        int[] knight_capturable_square = this.getKnightCapturableSquares(knight_square);
        
        if(this.containsSquareIn(knight_capturable_square, king_pos))
            return true;
        
        return false;
    }

    private boolean willOwnKingBeCheckByPawnWithOwnPieceMove(int pawn_square,int king_pos, int from_square, int to_square, int piece_side) {
       
        
        if(to_square==pawn_square)
            return false;//meaning the pawn is to be captured
        
        
        int[] pawn_capturable_square = this.getPawnCapturableSquares(pawn_square, piece_side);
        
        if(this.containsSquareIn(pawn_capturable_square, king_pos))
            return true;
        
        return false;
    }    



    public boolean canPieceBeAttacked(int piece_id, int square_loc) {
         
         Piece moved_pce= board.getPieceByID(piece_id);
         
         int[] knight_capturable_squares=getKnightCapturableSquares_1 (square_loc);
         
         int[] vert_up = getVerticalUpwardSquares_1 (square_loc);
         int[] vert_down = getVerticalDownwardSquares_1 (square_loc);
         int[] horiz_left = getHorizontalLeftwardSquares_1 (square_loc);        
         int[] horiz_right = getHorizontalRightwardSquares_1 (square_loc);
         
         int[] top_right_diagonal = getTopRightDiagonalSquares_1 (square_loc);
         int[] top_left_diagonal = getTopLeftDiagonalSquares_1 (square_loc);
         int[] bottom_right_diagonal = getBottomRightDiagonalSquares_1 (square_loc);        
         int[] bottom_left_diagonal = getBottomLeftDiagonalSquares_1(square_loc);        
    
         for(int i=0; i<knight_capturable_squares.length; i++){             
             Piece piece = board.getPieceOnSquare(knight_capturable_squares[i]);
             if(piece!=null)
                 if(piece.piece_name==Constants.Knight && moved_pce.side!=piece.side)//knight threathens
                     return true;
         }
         
         for(int i=0; i<vert_up.length; i++){             
             Piece piece = board.getPieceOnSquare(vert_up[i]);
             
             if(piece == null)
                 continue;             
             
             if( moved_pce.side == piece.side)//must be first condition
                 break;

             if(i==0)
                 if(piece.piece_name==Constants.King)//king threathens
                     return true;
             
             if(piece.piece_name==Constants.Queen || piece.piece_name==Constants.Rook)//queen or rook threathens
                 return true;
             else
                 break;
             
         }         

         for(int i=0; i<vert_down.length; i++){             
             Piece piece = board.getPieceOnSquare(vert_down[i]);
             
             if(piece == null)
                 continue;
             
             if( moved_pce.side == piece.side)//must be first condition
                 break;

             if(i==0)
                 if(piece.piece_name==Constants.King)//king threathens
                     return true;
             
             if(piece.piece_name==Constants.Queen || piece.piece_name==Constants.Rook)//queen or rook threathens
                 return true;
             else
                 break;
             
         }         

         for(int i=0; i<horiz_left.length; i++){             
             Piece piece = board.getPieceOnSquare(horiz_left[i]);
             
             if(piece == null)
                 continue;
                          
             if( moved_pce.side == piece.side)//must be first condition
                 break;
             
             if(i==0)
                 if(piece.piece_name==Constants.King)//king threathens
                     return true;
             
             if(piece.piece_name==Constants.Queen || piece.piece_name==Constants.Rook)//queen or rook threathens
                 return true;
             else
                 break;
             
         }         

         
         for(int i=0; i<horiz_right.length; i++){             
             Piece piece = board.getPieceOnSquare(horiz_right[i]);
             
             if(piece == null)
                 continue;
                          
             if( moved_pce.side == piece.side)//must be first condition
                 break;
             
             if(i==0)
                 if(piece.piece_name==Constants.King)//king threathens
                     return true;
             
             if(piece.piece_name==Constants.Queen || piece.piece_name==Constants.Rook)//queen or rook threathens
                 return true;
             else
                 break;
             
         }         

         for(int i=0; i<top_right_diagonal.length; i++){             
             Piece piece = board.getPieceOnSquare(top_right_diagonal[i]);
             
             if(piece == null)
                 continue;
                          
             if( moved_pce.side == piece.side)//must be first condition
                 break;
             
             if(i==0)
                 if(piece.piece_name==Constants.King )//king threathens
                     return true;
                 else if(piece.piece_name==Constants.Pawn &&  piece.isBlack())//black pawn threathens
                     return true;
             
             
             if(piece.piece_name==Constants.Queen || piece.piece_name==Constants.Bishop)//queen or bishop threathens
                 return true;
             else
                 break;
             
         }         

         for(int i=0; i<top_left_diagonal.length; i++){             
             Piece piece = board.getPieceOnSquare(top_left_diagonal[i]);
             
             if(piece == null)
                 continue;
             
             if( moved_pce.side == piece.side)//must be first condition
                 break;             
             
             if(i==0)
                 if(piece.piece_name==Constants.King )//king threathens
                     return true;
                 else if(piece.piece_name==Constants.Pawn &&  piece.isBlack())//black pawn threathens
                     return true;
             
                          
             if(piece.piece_name==Constants.Queen || piece.piece_name==Constants.Bishop)//queen or bishop threathens
                 return true;
             else
                 break;
         }         
         
         for(int i=0; i<bottom_right_diagonal.length; i++){             
             Piece piece = board.getPieceOnSquare(bottom_right_diagonal[i]);
             
             if(piece == null)
                 continue;
                          
             if( moved_pce.side == piece.side)//must be first condition
                 break;
             
             if(i==0)
                 if(piece.piece_name==Constants.King )//king threathens
                     return true;
                 else if(piece.piece_name==Constants.Pawn &&  piece.isWhite())//white pawn threathens
                     return true;
             
             
             if(piece.piece_name==Constants.Queen || piece.piece_name==Constants.Bishop)//queen or bishop threathens
                 return true;
             else
                 break;             
         }         

         for(int i=0; i<bottom_left_diagonal.length; i++){             
             Piece piece = board.getPieceOnSquare(bottom_left_diagonal[i]);
             
             if(piece == null)
                 continue;
                          
             if( moved_pce.side == piece.side)//must be first condition
                 break;
             
             if(i==0)
                 if(piece.piece_name==Constants.King )//king threathens
                     return true;
                 else if(piece.piece_name==Constants.Pawn &&  piece.isWhite())//white pawn threathens
                     return true;             
             
             
             if(piece.piece_name==Constants.Queen || piece.piece_name==Constants.Bishop)//queen or bishop threathens
                 return true;
             else
                 break;
             
         }         
         
        return false;
    }

    public static void main(String agrs[]){
        /*final ChessFrame cvm=new ChessFrame(Side.white,1,1,false, ChessView.OFF_MODE);
        cvm.run();
         * 
         */
        Board board=new Board(true);
        BoardAnalyzer c=new BoardAnalyzer(board);
        //c.chessView=cvm.chessView;
        
         
         
        System.out.println(c.isNoneBorderSquare(63));

        System.out.println("-------------");

        System.out.println(c.isBottomBorderSquare(63));
        System.out.println(c.isBottomRightCornerSquare(15));
        System.out.println(c.isBottomLeftCornerSquare(1));

        System.out.println("-------------");

        System.out.println(c.isTopBorderSquare(63));
        System.out.println(c.isTopRightCornerSquare(63));
        System.out.println(c.isTopLeftCornerSquare(57));

        System.out.println("-------------");

        System.out.println(c.isLeftBorderSquare(56));
        System.out.println(c.isRightBorderSquare(63));


        System.out.println("-------------");

        System.out.println(c.getSquareRowIndex(35));
        System.out.println(c.getSquareColumnIndex(35));

        System.out.println("-------getVerticalUpwardSquares------");

        for(int i=0; i<c.getVerticalUpwardSquares(27).length; i++)
            System.out.println(c.getVerticalUpwardSquares(27)[i]);

        System.out.println("------getVerticalDownwardSquares-------");

        for(int i=0; i<c.getVerticalDownwardSquares(27).length; i++)
            System.out.println(c.getVerticalDownwardSquares(27)[i]);

        System.out.println("-------getHorizontalLeftwardSquares------");

        for(int i=0; i<c.getHorizontalLeftwardSquares(27).length; i++)
            System.out.println(c.getHorizontalLeftwardSquares(27)[i]);

        System.out.println("------getHorizontalRightwardSquares-------");

        for(int i=0; i<c.getHorizontalRightwardSquares(27).length; i++)
            System.out.println(c.getHorizontalRightwardSquares(27)[i]);

        System.out.println("------getTopLeftDiagonalSquares-------");

        for(int i=0; i<c.getTopLeftDiagonalSquares(27).length; i++)
            System.out.println(c.getTopLeftDiagonalSquares(27)[i]);

        System.out.println("-------getTopRightDiagonalSquares------");

        for(int i=0; i<c.getTopRightDiagonalSquares(29).length; i++)
            System.out.println(c.getTopRightDiagonalSquares(29)[i]);


        System.out.println("------getBottomRightDiagonalSquares-------");

        for(int i=0; i<c.getBottomRightDiagonalSquares(24).length; i++)
            System.out.println(c.getBottomRightDiagonalSquares(24)[i]);


        System.out.println("------getBottomLeftDiagonalSquares-------");

        for(int i=0; i<c.getBottomLeftDiagonalSquares(31).length; i++)
            System.out.println(c.getBottomLeftDiagonalSquares(31)[i]);


        System.out.println("-------------");

        for(int i=0; i<c.getPieceSurrundingSquares(17).length; i++)
            System.out.println(c.getPieceSurrundingSquares(17)[i]);
        
        System.out.println("--------valid piece position test ---getKnightValidSquares-------------");

        ChessMove new_move=new ChessMove();

        for(int i=0; i<c.getKnightMoveAnalysis(new_move,48 ,-1, Side.black,-1,-1).getValidSquares().length; i++)
            System.out.println(c.getKnightMoveAnalysis(new_move,48,-1,Side.black,-1,-1).getValidSquares()[i]);        
        
        System.out.println("--------valid piece position test ---getRookValidSquares-------------");
        for(int i=0; i<c.getRookMoveAnalysis(new_move,24 ,-1, Side.white, -1, -1).getValidSquares().length; i++)
            System.out.println(c.getRookMoveAnalysis(new_move,24,-1,Side.white, -1, -1).getValidSquares()[i]);             
        
        System.out.println("--------valid piece position test ---getPawnValidSquares-------------");
        for(int i=0; i<c.getPawnMoveAnalysis(new_move,49 ,-1, Side.black,true, -1,-1).getValidSquares().length; i++)
            System.out.println(c.getPawnMoveAnalysis(new_move,49,-1,Side.black,true, -1,-1).getValidSquares()[i]);   
                    
    }


}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package naija.game.client.chess.board;

import naija.game.client.Side;
import naija.game.client.chess.board.ChessBoardMove.Castle;
import naija.game.client.chess.board.ChessBoardMove.EnPassant;
//import util.Approx;


/**
 *
 * @author Engr. Chuks
 */
public class EngineBoardAnalyzer_1{
    
    private int total_squares_per_row=8;
    private int total_row=8;
    private int total_chess_pieces=32;
    public Board board;
    int sq_vert_up = Constants.NOTHING;
    int sq_vert_down = Constants.NOTHING;    
    int sq_horiz_left = Constants.NOTHING;
    int sq_horiz_right = Constants.NOTHING;
    int sq_top_right_diagonal = Constants.NOTHING;
    int sq_top_left_diagonal = Constants.NOTHING;
    int sq_bottom_right_diagonal = Constants.NOTHING;
    int sq_bottom_left_diagonal = Constants.NOTHING; 
    
    int sq_knight_capturable_squares = Constants.NOTHING;
    
    int[] vert_up;
    int[] vert_down;
    int[] horiz_left;        
    int[] horiz_right;        

    int[] top_right_diagonal;
    int[] top_left_diagonal;
    int[] bottom_right_diagonal;        
    int[] bottom_left_diagonal;    
    
    int[] knight_capturable_squares; 
    
    public EngineBoardAnalyzer_1(Board board) {
           this.board= board; 
    }

    public void init(Board board){
          this.board=board;
    }

    public int[] getVerticalUpwardSquares_1(int square){
            
            this.sq_vert_up=square;
            
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
        
            this.sq_vert_down=square;
        
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
        
            this.sq_horiz_right=square;
        
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
         
            this.sq_horiz_left=square;
         
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
        
            sq_top_right_diagonal = square;
        
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
        
            sq_top_left_diagonal = square;
        
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
        
            sq_bottom_right_diagonal = square;
        
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
                      
            sq_bottom_left_diagonal = square;
        
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
             

                 
             if(isOwnKingAttacks( square_loc,
                               KING_capturable_squares[i], 
                               piece_side, 
                               KING_capturable_squares[i]))//yes KING_capturable_squares again
                    
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

        knight_capturable_squares=getUnresolvedKnightMoveSquares(square_loc, piece_side);
                
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

        if(square_loc != this.sq_knight_capturable_squares)
            knight_capturable_squares=getKnightCapturableSquares_1 (square_loc);

        for(int i=0; i<knight_capturable_squares.length; i++){            
            if(board.isOccupiedBySamePiece(knight_capturable_squares[i], piece_side)){
                knight_capturable_squares[i] = Constants.NOTHING;//cancel
            }
        }        

        return knight_capturable_squares;                          
    }
    
    public int [] getUnresolvedRookMoveSquares(int square_loc, int  piece_side){
        
        
        if(square_loc != this.sq_vert_up)
            vert_up = getVerticalUpwardSquares_1 (square_loc);
        
        if(square_loc != this.sq_vert_down)
            vert_down = getVerticalDownwardSquares_1 (square_loc);
        
        if(square_loc != this.sq_horiz_left)
            horiz_left = getHorizontalLeftwardSquares_1 (square_loc);        
        
        if(square_loc != this.sq_horiz_right)
            horiz_right = getHorizontalRightwardSquares_1 (square_loc);        

        
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

      
        if(square_loc != this.sq_top_right_diagonal)
            top_right_diagonal = getTopRightDiagonalSquares_1 (square_loc);
        
        if(square_loc != this.sq_top_left_diagonal)
            top_left_diagonal = getTopLeftDiagonalSquares_1 (square_loc);
        
        if(square_loc != this.sq_bottom_right_diagonal)
            bottom_right_diagonal = getBottomRightDiagonalSquares_1 (square_loc);        
        
        if(square_loc != this.sq_bottom_left_diagonal)
            bottom_left_diagonal = getBottomLeftDiagonalSquares_1( square_loc);          
        
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
        
        if(square_loc != this.sq_vert_up)
            vert_up = getVerticalUpwardSquares_1 (square_loc);
        
        if(square_loc != this.sq_vert_down)
            vert_down = getVerticalDownwardSquares_1 (square_loc);
        
        if(square_loc != this.sq_horiz_left)
            horiz_left = getHorizontalLeftwardSquares_1 (square_loc);        
        
        if(square_loc != this.sq_horiz_right)
            horiz_right = getHorizontalRightwardSquares_1 (square_loc);        

        if(square_loc != this.sq_top_right_diagonal)
            top_right_diagonal = getTopRightDiagonalSquares_1 (square_loc);
        
        if(square_loc != this.sq_top_left_diagonal)
            top_left_diagonal = getTopLeftDiagonalSquares_1 (square_loc);
        
        if(square_loc != this.sq_bottom_right_diagonal)
            bottom_right_diagonal = getBottomRightDiagonalSquares_1 (square_loc);        
        
        if(square_loc != this.sq_bottom_left_diagonal)
            bottom_left_diagonal = getBottomLeftDiagonalSquares_1( square_loc);        

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
        

         //index=4;//TESTING!!
         int cancelled=0;
         for(int i=0; i<length; i++){
                
             if(squares[i]!= Constants.NOTHING)//since some PIECES_BY_ID method (e.g pawn) cancels squares before this method call
                if(isOwnKingAttacks(square_loc,
                                    squares[i], 
                                    piece_side,
                                    king_square_loc))
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
                                    int king_square_loc){

        
        if(king_square_loc != this.sq_knight_capturable_squares)             
            knight_capturable_squares=getKnightCapturableSquares_1 (king_square_loc);
                
        if(king_square_loc != this.sq_vert_up)
            vert_up = getVerticalUpwardSquares_1 (king_square_loc);
        
        if(king_square_loc != this.sq_vert_down)
            vert_down = getVerticalDownwardSquares_1 (king_square_loc);
        
        if(king_square_loc != this.sq_horiz_left)
            horiz_left = getHorizontalLeftwardSquares_1 (king_square_loc);        
        
        if(king_square_loc != this.sq_horiz_right)
            horiz_right = getHorizontalRightwardSquares_1 (king_square_loc);        

        if(king_square_loc != this.sq_top_right_diagonal)
            top_right_diagonal = getTopRightDiagonalSquares_1 (king_square_loc);
        
        if(king_square_loc != this.sq_top_left_diagonal)
            top_left_diagonal = getTopLeftDiagonalSquares_1 (king_square_loc);
        
        if(king_square_loc != this.sq_bottom_right_diagonal)
            bottom_right_diagonal = getBottomRightDiagonalSquares_1 (king_square_loc);        
        
        if(king_square_loc != this.sq_bottom_left_diagonal)
            bottom_left_diagonal = getBottomLeftDiagonalSquares_1( king_square_loc);        
        
        
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


    public boolean canPieceBeAttacked(int piece_id, int square_loc) {
         
         Piece moved_pce= board.getPieceByID(piece_id);
         
        if(square_loc != this.sq_knight_capturable_squares)             
            knight_capturable_squares=getKnightCapturableSquares_1 (square_loc);
        
        
        if(square_loc != this.sq_vert_up)
            vert_up = getVerticalUpwardSquares_1 (square_loc);
        
        if(square_loc != this.sq_vert_down)
            vert_down = getVerticalDownwardSquares_1 (square_loc);
        
        if(square_loc != this.sq_horiz_left)
            horiz_left = getHorizontalLeftwardSquares_1 (square_loc);        
        
        if(square_loc != this.sq_horiz_right)
            horiz_right = getHorizontalRightwardSquares_1 (square_loc);        

        if(square_loc != this.sq_top_right_diagonal)
            top_right_diagonal = getTopRightDiagonalSquares_1 (square_loc);
        
        if(square_loc != this.sq_top_left_diagonal)
            top_left_diagonal = getTopLeftDiagonalSquares_1 (square_loc);
        
        if(square_loc != this.sq_bottom_right_diagonal)
            bottom_right_diagonal = getBottomRightDiagonalSquares_1 (square_loc);        
        
        if(square_loc != this.sq_bottom_left_diagonal)
            bottom_left_diagonal = getBottomLeftDiagonalSquares_1( square_loc);        
              
    
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
    
}

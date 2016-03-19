/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.board;

/**
 *
 * @author Onyeka Alimele
 */
public interface Constants {
    
    /**The move integer representation is as follows
     * 
     * from_square --> 7 bits ie 0 - 127 (note:  off-board square is assigned value of 64 instead of -1 )
     * 
     * to_square --> 7 bits ie 0 - 127 (note:  off-board square is assigned value of 64 instead of -1 )
     * 
     * is_en_passant_square --> 7 bits ie 0 - 127 (note:  off-board square is assigned value of 64 instead of -1 )
     * 
     * is_short_castle --> 1 bits ie 0 - 1 (where 0 implies false and 1 true)
     * 
     * is_long_castle --> 1 bits ie 0 - 1 (where 0 implies false and 1 true) 

     * capture_type --> 3 bits ie 0 - 7     (QUEEN_CAPTURE = 5, 
     *                                       BISHOP_CAPTURE = 4, 
     *                                       ROOK_CAPTURE = 3,
     *                                       KNIGHT_CAPTURE = 2,  
     *                                       PAWN_CAPTURE = 1,
     *                                       NONE_CAPTURE = 0)
     * 
     * promotion_rating --> 3 bits ie 0 - 7 (RookPromotion = 1 , 
     *                                       BishopPromotion = 2, 
     *                                       KnightPromotion = 3,
     *                                       QueenPromotion = 4)
     * 
     * 
     * Total bits held by the move integer: 7 + 7 + 7 + 1 + 1 + 3 + 3 = 29 bits
     * 
     * 29 bits  is o.k for 32 bits integer (move integer variable)
     */
    
    int FROM_SQUARE_SHIFT = 0; 
    int TO_SQUARE_SHIFT = FROM_SQUARE_SHIFT + 7;
    int ENPASSANT_CAPUTRE_SQURE_SHIFT = TO_SQUARE_SHIFT + 7;
    int IS_SHORT_CASTLE_SHIFT = ENPASSANT_CAPUTRE_SQURE_SHIFT + 7;
    int IS_LONG_CASTLE_SHIFT = IS_SHORT_CASTLE_SHIFT + 1;
    int CAPTURE_TYPE_SHIFT=IS_LONG_CASTLE_SHIFT + 1;
    int PROMOTION_RATING_SHIFT = CAPTURE_TYPE_SHIFT + 3;

    
    int FROM_SQUARE_MASK=127;// 0 - 127 with max 127
    int TO_SQUARE_MASK = 127;// 0 - 127 with max 127 
    int ENPASSANT_CAPUTRE_SQURE_MASK = 127;// 0 - 127 with max 127 
    int IS_SHORT_CASTLE_MASK=1;// 0 - 1  with max 1
    int IS_LONG_CASTLE_MASK=1;// 0 - 1 with max 1
    int CAPTURE_TYPE_MASK=7;// 0 - 7 with max 7
    int PROMOTION_RATING_MASK=7;// 0 - 7 with max 7
    
    int NOTHING=64; // must be greater than 63. used for many reasons - important  
    
    int INFINITY = 131071;//do not edit 131071. it must not change - value is used by transposition table too.
    
    char King='K';
    char Queen='Q';
    char Bishop='B';
    char Rook='R';
    char Knight='N';
    char Pawn=0;  


    int QUEEN_CAPTURE=6;
    int BISHOP_CAPTURE=5;
    int ROOK_CAPTURE=4;
    int KNIGHT_CAPTURE=3;
    int PAWN_CAPTURE=2;
    int NONE_CAPTURE=1;
        
    
    int king_cost=300;
    int queen_cost=120;
    int bishop_cost=50;
    int knight_cost=20;
    int rook_cost=20;    
    int pawn_cost=10;
        
    int RookPromotion=1;
    int BishopPromotion=2;
    int KnightPromotion=3;
    int QueenPromotion=4;
    
}

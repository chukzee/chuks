/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess;

import naija.game.client.BoardMove;
import naija.game.client.chess.board.Constants;
import naija.game.client.chess.board.Constants;

/**
 *
 * @author Onyeka Alimele
 */
public class ChessMove extends BoardMove{

  public int turn;  
  public char piece_name=0;
  public int piece_index=Constants.NOTHING; //index in the Pieces array of the piece moved 
  public int from_square=Constants.NOTHING;
  public int to_square=Constants.NOTHING;
  public int enpassant_capture_square = Constants.NOTHING;
  public boolean is_short_castle;
  public boolean is_long_castle;
  public int preliminaryValue;
  public long move_value;
  public  int promotion_piece_rating=Constants.NOTHING;
  public int capture_id=Constants.NOTHING;

  
  public ChessMove(int bit_move, int turn,int move_val, int capture_id, char piece_name, int piece_index){
      
            int from_sq = bit_move & Constants.FROM_SQUARE_MASK;                        
            
            int to_sq =  (bit_move >>> Constants.TO_SQUARE_SHIFT) 
                                        & Constants.TO_SQUARE_MASK;
            
            int enpassant_cap_sq = ((bit_move >>> Constants.ENPASSANT_CAPUTRE_SQURE_SHIFT)
                                                    & Constants.ENPASSANT_CAPUTRE_SQURE_MASK);
            
            int short_castle = ((bit_move >>> Constants.IS_SHORT_CASTLE_SHIFT)
                                        & Constants.IS_SHORT_CASTLE_MASK);
            
            int long_castle =  ((bit_move >>> Constants.IS_LONG_CASTLE_SHIFT)
                                        & Constants.IS_LONG_CASTLE_MASK);
            
            int promo_piece_rating =  ((bit_move >>> Constants.PROMOTION_RATING_SHIFT)
                                                   & Constants.PROMOTION_RATING_MASK);
                              
      
                 init( turn,
                       move_val,//not necessary
                       piece_name ,
                       piece_index, 
                       from_sq,
                       to_sq, 
                       capture_id,//not required
                       promo_piece_rating,
                       enpassant_cap_sq,
                       short_castle==1,
                       long_castle==1);     
  } 
    
  public ChessMove(int turn,
              long move_value,
              char piece_name ,
              int piece_index, 
              int from_square,
              int to_square, 
              int capture_id,
              int promotion_piece_rating,
              int enpassant_capture_square,
              boolean is_short_castle,
              boolean is_long_castle){
      
                 init( turn,
                       move_value,
                       piece_name ,
                       piece_index, 
                       from_square,
                       to_square, 
                       capture_id,
                       promotion_piece_rating,
                       enpassant_capture_square,
                       is_short_castle,
                       is_long_castle);     
      
  }

  
  
    private ChessMove() {
        
    }

    private void init(int turn,
                      long move_value,
                      char piece_name,
                      int piece_index, 
                      int from_square,
                      int to_square, 
                      int capture_id,
                      int promotion_piece_rating,
                      int enpassant_capture_square,
                      boolean is_short_castle,
                      boolean is_long_castle){

        this.turn=turn;
        this.move_value=move_value;      
        this.piece_name=piece_name;
        this.piece_index=piece_index;
                                     
        
        if(enpassant_capture_square != Constants.NOTHING){
            this.enpassant_capture_square=enpassant_capture_square;
            this.from_square=from_square;
            this.capture_id=capture_id;
            
            if(enpassant_capture_square > 23 && enpassant_capture_square < 32)
                this.to_square=enpassant_capture_square - 8;
            else 
                this.to_square=enpassant_capture_square + 8;
            
        }else if(is_short_castle){
            this.is_short_castle=is_short_castle;
        }else if(is_long_castle){
            this.is_long_castle=is_long_castle;  
        }else{
            this.from_square=from_square;
            this.to_square = to_square; // cannot be a square id per say
            this.capture_id=capture_id;
            this.promotion_piece_rating = promotion_piece_rating;
        }
                    
    }
    
    public String toString(){
        return notation();
    }
    
    public String notation() {
        String notation="";        
        
        
        if(this.is_short_castle)
            return "0-0";

        if(this.is_long_castle)
            return "0-0-0";        
        
        
        String pce_name="";
        
        switch(this.piece_name){
            case Constants.King:pce_name="K";break;
            case Constants.Queen:pce_name="Q";break;    
            case Constants.Knight:pce_name="N";break;
            case Constants.Rook:pce_name="R";break;    
            case Constants.Bishop:pce_name="B";break;
            case Constants.Pawn:pce_name="";break;                
        }
        
        int from_row=this.from_square/8;
        
        double d_row=from_square/8.0;//check for correctness in c++, c# and javascript
        double diff=d_row-from_row;//check for correctness in c++, c# and javascript
        double d_col1=diff*8;  //check for correctness in c++, c# and javascript
        
        int from_col=(int)d_col1;//check for correctness in c++, c# and javascript
        
        
        int to_row=this.to_square/8;//check for correctness in c++, c# and javascript
        
        double d_to_row=to_square/8.0;//check for correctness in c++, c# and javascript
        double to_diff=d_to_row-to_row;//check for correctness in c++, c# and javascript
        double d_col2=to_diff*8;  //check for correctness in c++, c# and javascript
        
        int to_col=(int)d_col2;//check for correctness in c++, c# and javascript
        String seperator="-";
        if(this.capture_id!=Constants.NOTHING)
            seperator="x";
        
        //if(enpassant_capture_square!=Constants.NOTHING)//TESTING
          //  System.out.println();//TESTING
        
        String en_passant_suffix= this.enpassant_capture_square!=Constants.NOTHING? "e.p." : "";
        String promotion_suffix = PromotionSuffix();
        
        String row_label=getRowLabel(from_row);
        if(this.enpassant_capture_square !=Constants.NOTHING){
            row_label="";//by convention the row label is not included in en passant move notation
            seperator="x";
        }
        
        notation = pce_name+
                   getColumnLabel(from_col) + row_label
                   +seperator+
                   getColumnLabel(to_col) + getRowLabel(to_row)+en_passant_suffix+promotion_suffix;
        
        return notation;
                
    }
    
    String PromotionSuffix(){
        switch(promotion_piece_rating){
            case Constants.RookPromotion:return "R";                
            case Constants.BishopPromotion:return "B";            
            case Constants.KnightPromotion:return "N";            
            case Constants.QueenPromotion:return "Q";
        }        
        return "";
    }
    
    String getRowLabel(int row){
        switch(row){
        
            case 0: return "1";
            case 1: return "2";
            case 2: return "3";
            case 3: return "4";
            case 4: return "5";
            case 5: return "6";
            case 6: return "7";
            case 7: return "8";
        }  
        
        return "";
    }
    
    
    String getColumnLabel(int col){
        switch(col){
        
            case 0: return "a";
            case 1: return "b";
            case 2: return "c";
            case 3: return "d";
            case 4: return "e";
            case 5: return "f";
            case 6: return "g";
            case 7: return "h";
        }  
        
        return "";
    }    
}

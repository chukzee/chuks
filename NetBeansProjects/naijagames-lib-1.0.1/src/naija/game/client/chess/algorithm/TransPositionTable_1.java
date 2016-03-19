/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.algorithm;

/**
 *
 * @author Onyeka Alimele
 */
public class TransPositionTable_1 {
 
    //final int hash_table_length = 1048583;//a prime number
    int hash_table_length = 1048583;//TO BE REMOVED and replaced with the above line
    final int  BUCKET_LENGTH=4;//must be very small number - 4 is ok.
    int[][] TTMoves=new int[hash_table_length][BUCKET_LENGTH];
    int[][] store_zobrist_keys= new int[hash_table_length][BUCKET_LENGTH];
    int[][] store_collision_filters= new int[hash_table_length][BUCKET_LENGTH];    
    int[][] TTRemaingProperties=new int[hash_table_length][BUCKET_LENGTH];
    int index_loc=-1;    
        
    final int DEPTH_SHIFT = 0; 
    final int EVAL_SHIFT = DEPTH_SHIFT+6; 
    final int EVAL_SIGN_SHIFT = EVAL_SHIFT + 17;//come back
    final int IS_EXACT_VALUE_SHIFT =EVAL_SIGN_SHIFT + 1; 
    final int IS_ALPHA_SHIFT = IS_EXACT_VALUE_SHIFT + 1;
    final int IS_BETA_SHIFT = IS_ALPHA_SHIFT + 1;
    final int IS_MAXIMIZER_SHIFT = IS_BETA_SHIFT + 1;

    final int DEPTH_MASK=63;//ie 2^6 - 1 = 63: holds 0 to 63:  with max 63 : will depth of 63 ever be possible? - laugh!!!
    final int EVAL_MASK=131071;//ie 2^17 - 1 = 131071: holds 0 to 131071: must be the value of 'INFINITY' variable. 
    final int EVAL_SIGN_MASK = 1;//ie 2^1 - 1 = 1: holds 0 to 1:  with max 1
    final int IS_EXACT_VALUE_MASK = 1;//ie 2^1 - 1 = 1: holds 0 to 1:  with max 1
    final int IS_ALPHA_MASK=1;//ie 2^1 - 1 = 1: holds 0 to 1:  with max 1
    final int IS_BETA_MASK=1;//ie 2^1 - 1 = 1: holds 0 to 1:  with max 1
    final int IS_MAXIMIZER_MASK = 1;//ie 2^1 - 1 = 1: holds 0 to 1:  with max 1;      
    
    private int bucket_index_loc;
    
    
    public TransPositionTable_1(){

    }
    
    /**Set the hash key to use for retrieve information
     * from the transposition table
     * 
     * @param zobrist_key 
     */
    public void useHashKey(int zobrist_key , int collision_filter){
        index_loc=-1;//initialize
        
        int d_key= zobrist_key > 0? zobrist_key : -zobrist_key;//avoid negative index
        
        int unresolved_index= d_key%hash_table_length ;
        //check the bucket of this index
        if(store_zobrist_keys[unresolved_index][0] == zobrist_key && 
                store_collision_filters[unresolved_index][0] == collision_filter){  
            index_loc=unresolved_index;
            bucket_index_loc= 0;
        }else if(store_zobrist_keys[unresolved_index][1] == zobrist_key && 
                store_collision_filters[unresolved_index][1] == collision_filter){ 
            index_loc=unresolved_index;
            bucket_index_loc= 1;
        }else if(store_zobrist_keys[unresolved_index][2] == zobrist_key && 
                store_collision_filters[unresolved_index][2] == collision_filter){ 
            index_loc=unresolved_index;
            bucket_index_loc= 2;
        }else if(store_zobrist_keys[unresolved_index][3] == zobrist_key && 
                store_collision_filters[unresolved_index][3] == collision_filter){ 
            index_loc=unresolved_index;
            bucket_index_loc= 3;
        }
            
    }

    public void setEntry(int zobrist_key,
                        int collision_filter,
                        int depth, 
                        int move, 
                        int eval,
                        boolean is_exact, 
                        boolean is_alpha, 
                        boolean is_beta, 
                        boolean is_maximizer){
        

            long d_key= zobrist_key > 0? zobrist_key : -zobrist_key;//avoid negative index
        
            int index=(int)(d_key%hash_table_length);//REMIND : TAKE CARE IN JAVASCRIPT ON THIS LINE ABEG O !!!
            
            int entry_index=-1;
            int bucket_entry_index=-1;
            
            //check if key hash to an already existing key index                  
            if(store_zobrist_keys[index][0] == 0){//is free
                entry_index=index;     
                bucket_entry_index = 0;
            }else if(store_zobrist_keys[index][1] == 0){//is free
                entry_index=index;                
                bucket_entry_index = 1;
            }else if(store_zobrist_keys[index][2] == 0){//is free
                entry_index=index;                
                bucket_entry_index = 2;
            }else if(store_zobrist_keys[index][3] == 0){//is free
                entry_index=index;                
                bucket_entry_index = 3;
            }else{
                //here the bucket is full so i will apply a replacement scheme of REPLACE WITH DEPTH                                   
                this.index_loc= index;//important
                
                if(this.getDepth()>depth){
                   //replace the hash index
                   entry_index=index;
                   bucket_entry_index = 0;
                }  
                
                index_loc=-1;
            }
     
            
            if(entry_index==-1)//
                return;//new entry not allowed

            //Now set the entry            
            TTMoves[entry_index][bucket_entry_index]=move;
            store_zobrist_keys[entry_index][bucket_entry_index]=zobrist_key;
            store_collision_filters[entry_index][bucket_entry_index]=collision_filter;
            
            int eval_sign= 0;// 0 means positive sign
            if(eval < 0){
                eval =  -eval;//remove negative sign                
                eval_sign = 1;//1 means negative sign
            }
            
            // the rest of the parameter will be store in the TTRemaingProperties array index
            TTRemaingProperties[entry_index][bucket_entry_index]  = 0;//initialize
            TTRemaingProperties[entry_index][bucket_entry_index] |= depth;
            TTRemaingProperties[entry_index][bucket_entry_index] |= eval << EVAL_SHIFT;
            TTRemaingProperties[entry_index][bucket_entry_index] |= eval_sign << EVAL_SIGN_SHIFT;//note the true sign.            
            TTRemaingProperties[entry_index][bucket_entry_index] |= (is_exact?1:0) << IS_EXACT_VALUE_SHIFT;//come back
            TTRemaingProperties[entry_index][bucket_entry_index] |= (is_alpha?1:0) << IS_ALPHA_SHIFT;//come back
            TTRemaingProperties[entry_index][bucket_entry_index] |= (is_beta?1:0) << IS_BETA_SHIFT;//come back
            TTRemaingProperties[entry_index][bucket_entry_index] |= (is_maximizer?1:0) << IS_MAXIMIZER_SHIFT;//come back
    }
    
    public boolean isEntryFound(){
        if(index_loc==-1)
            return false;
        return store_zobrist_keys[index_loc][bucket_index_loc]!=0;
    }
    
    public int getDepth(){   
        int param=TTRemaingProperties[index_loc][bucket_index_loc];
        return param & DEPTH_MASK;
    }
    
    public int getEval(){    
        int param=TTRemaingProperties[index_loc][bucket_index_loc];
        
        int eval = (param >>> EVAL_SHIFT)& EVAL_MASK;
        int eval_sign = (param >>> EVAL_SIGN_SHIFT)& EVAL_SIGN_MASK;
        
        if(eval_sign == 1)//1 means negative sign
            eval = - eval;            
        
        return eval;
    }
    
    public boolean isExactValue(){
        int param=TTRemaingProperties[index_loc][bucket_index_loc];
        int val= (param >>> IS_EXACT_VALUE_SHIFT)& IS_EXACT_VALUE_MASK;
        return val==1;//if true
    }
    
    public boolean isAlphaValue(){
        int param=TTRemaingProperties[index_loc][bucket_index_loc];
        int val= (param >>> IS_ALPHA_SHIFT)& IS_ALPHA_MASK;
        return val==1;//if true
    }
    
    public boolean isBetaValue(){
        int param=TTRemaingProperties[index_loc][bucket_index_loc];
        int val= (param >>> IS_BETA_SHIFT)& IS_BETA_MASK;
        return val==1;//if true
    }
            
    public boolean isMaximizer(){
        int param=TTRemaingProperties[index_loc][bucket_index_loc];
        int val= (param >>> IS_MAXIMIZER_SHIFT)& IS_MAXIMIZER_MASK;
        return val==1;//if true
    }

    public void setTest(int test) {//TESTING!!!
        this.hash_table_length=test;
        this.TTMoves=new int[test][BUCKET_LENGTH];
        this.TTRemaingProperties=new int[test][BUCKET_LENGTH];
        this.store_zobrist_keys=new int[test][BUCKET_LENGTH];
    }

}

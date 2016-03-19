/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.algorithm;

/**
 *
 * @author Onyeka Alimele
 */
public class TransPositionTable {
 
    //final int hash_table_length = 1048583;//a prime number
    int hash_table_length = 1048583;//TO BE REMOVED and replaced with the above line
    int[] TTMoves=new int[hash_table_length];
    public int[] store_zobrist_keys= new int[hash_table_length];
    public int[] store_collision_filters= new int[hash_table_length];
    int[] TTRemaingProperties=new int[hash_table_length];
    public int index_loc=-1;    
    final int  BUCKET_LENGTH=4;//must be very small number - 4 is ok.
    
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
    
    int total_entries= 0;
    
    public TransPositionTable(){

    }
    
    /**Set the hash key to use for retrieve information
     * from the transposition table
     * 
     * @param zobrist_key 
     */
    public void useHashKey(int zobrist_key , int collision_filter){
        index_loc=-1;//initialize
        
        int d_key= zobrist_key > 0? zobrist_key : -zobrist_key;//avoid negative index
        
        int unresolved_index= d_key%hash_table_length;//REMIND : TAKE CARE IN JAVASCRIPT ON THIS LINE ABEG O !!!
        
        if(store_zobrist_keys[unresolved_index] == zobrist_key && 
                store_collision_filters[unresolved_index] == collision_filter){            
            index_loc=unresolved_index;
        }else{
            //search the location
            for(int i=unresolved_index+1; i<BUCKET_LENGTH+unresolved_index && i<hash_table_length; i++){
                if(store_zobrist_keys[i]==zobrist_key/**/ && 
                        store_collision_filters[i] == collision_filter/**/){
                    index_loc=i;
                    break;
                }
                    
            }
        }

        
    }

    
    
    public void setEntry(int zobrist_key,
                    int collision_filter,
                    int depth, 
                    int move, 
                    int eval,
                    boolean is_exact, 
                    boolean is_lower_bound, 
                    boolean is_upper_bound){
            
            int key= zobrist_key > 0? zobrist_key : -zobrist_key;//avoid negative index
            
            int index=(int)(key%hash_table_length);//REMIND : TAKE CARE IN JAVASCRIPT ON THIS LINE ABEG O !!!
            
            int entry_index=-1;
            
            //check if key hash to an already existing key index                  
            if(store_zobrist_keys[index] == 0){//is free
                entry_index=index;     
                total_entries++;
            }else{
   
                 //find an index to store the entry in the BUCKET
                for(int i=index+1; i<index+BUCKET_LENGTH && i<hash_table_length; i++){
                    if(store_zobrist_keys[i] == 0){
                        entry_index=i;
                        break;
                    }
                }
                
                //location is already occupied by existing key - may be same key anyway.
                //I will apply a replace scheme of REPLACE WITH DEPTH.
                this.index_loc= index;//important
                
                if(entry_index == -1)//IF BUCKET IS FULL
                    if(this.getDepth() > depth){
                        //replace the hash index
                        entry_index=index;                        
                    }                
                
                index_loc=-1;
            }
            
            if(entry_index==-1)//
                return;//new entry not allowed

            
            //Now set the entry            
            TTMoves[entry_index]=move;
            store_zobrist_keys[entry_index]=zobrist_key;
            store_collision_filters[entry_index]=collision_filter;
            
            int eval_sign= 0;// 0 means positive sign
            if(eval < 0){
                eval =  -eval;//remove negative sign                
                eval_sign = 1;//1 means negative sign
            }
            
            // the rest of the parameter will be store in the TTRemaingProperties array index
            TTRemaingProperties[entry_index]  = 0;//initialize
            TTRemaingProperties[entry_index] |= depth;
            TTRemaingProperties[entry_index] |= eval << EVAL_SHIFT;//store as positive.
            TTRemaingProperties[entry_index] |= eval_sign << EVAL_SIGN_SHIFT;//note the true sign.            
            TTRemaingProperties[entry_index] |= (is_exact?1:0) << IS_EXACT_VALUE_SHIFT;
            TTRemaingProperties[entry_index] |= (is_lower_bound?1:0) << IS_ALPHA_SHIFT;
            TTRemaingProperties[entry_index] |= (is_upper_bound?1:0) << IS_BETA_SHIFT;
    }
    
    public boolean isEntryFound(){
        if(index_loc==-1)
            return false;
        return store_zobrist_keys[index_loc]!=0;
    }

    public int getMove(){      
        return this.TTMoves[index_loc];
    }    
    
    public int getDepth(){   
        int param=TTRemaingProperties[index_loc];
        int depth = param & DEPTH_MASK;        
        return depth;
    }
    
    public int getEval(){    
        int param=TTRemaingProperties[index_loc];
        
        int eval = (param >>> EVAL_SHIFT)& EVAL_MASK;
        int eval_sign = (param >>> EVAL_SIGN_SHIFT)& EVAL_SIGN_MASK;
        
        if(eval_sign == 1)//1 means negative sign
            eval = - eval;            
        
        return eval;
    }
    
    public boolean isExact(){
        int param=TTRemaingProperties[index_loc];
        int val= (param >>> IS_EXACT_VALUE_SHIFT)& IS_EXACT_VALUE_MASK;
        return val==1;//if true
    }
    
    public boolean isLowerBound(){
        int param=TTRemaingProperties[index_loc];
        int val= (param >>> IS_ALPHA_SHIFT)& IS_ALPHA_MASK;
        return val==1;//if true
    }
    
    public boolean isUpperBound(){
        int param=TTRemaingProperties[index_loc];
        int val= (param >>> IS_BETA_SHIFT)& IS_BETA_MASK;
        return val==1;//if true
    }
            
    public boolean isMaximizer(){
        int param=TTRemaingProperties[index_loc];
        int val= (param >>> IS_MAXIMIZER_SHIFT)& IS_MAXIMIZER_MASK;
        return val==1;//if true
    }

    public int getTotalEntries(){
        return total_entries;
    }
    
    public void setTest(int test) {//TESTING!!!
        this.hash_table_length=test;
        this.TTMoves=new int[test];
        this.TTRemaingProperties=new int[test];
        this.store_zobrist_keys=new int[test];
    }

}

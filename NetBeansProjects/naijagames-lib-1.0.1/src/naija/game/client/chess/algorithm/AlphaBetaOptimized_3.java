/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.algorithm;

import naija.game.client.chess.ChessMove;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.Piece;
import naija.game.client.chess.board.Constants;
import naija.game.client.chess.board.EngineBoardAnalyzer_1;
import naija.game.client.Side;

/**
 *
 * @author Onyeka Alimele
 */
public class AlphaBetaOptimized_3 {
 
    
    ChessMove best_move;
    private ChessMove[] legalMoves;//use for commentary by comparing move values
    private Board board;
    EngineBoardAnalyzer_1 engine_board_analyzer_1;
    TransPositionTable ttHashTable=new TransPositionTable();
    int move_length =40;
    
    public AlphaBetaOptimized_3() {
    }

    public ChessMove searchBestMove(Board board, int search_depth) {
        
        legalMoves = null;//initialize
        best_move = null;//initialize
        node_count=0;    
        prune_count=0;
        move_length =40;//can change
        System.out.println("INITIAL BOARD PRINT - "+board);
        //Move best_move=null;
        Board internal_board=new Board(false);//empty board
        internal_board.CopyBoard(board);//use a copy
        this.board=internal_board;
        engine_board_analyzer_1 = new EngineBoardAnalyzer_1(this.board);
        
        long value = search(true, false,// is maximizer.
                           Integer.MIN_VALUE,//alpha value.
                           Integer.MAX_VALUE,//beta value.            
                           -1, //depth : must first be initialize to -1.
                           search_depth,//max search depth.
                            -1);
        
        legalMoves = trimMoves(legalMoves);
        System.out.println("FINAL BOARD PRINT - "+board);
        
        System.out.println("value "+value );
        System.out.println("nodes "+node_count );
        System.out.println("prune_count "+prune_count );
        
        //if(value ==Long.MIN_VALUE || value ==Long.MAX_VALUE){
            System.out.println("DEBUG END OF GAME --> best move "+best_move);
        //}
        
        return best_move;
    }
   
    ChessMove[] trimMoves(ChessMove[] moves){
        
        
        int count = 0;
        for(int i=0; i<moves.length; i++){
            if(moves[i]!=null)
                count++;
        }
        
        ChessMove[] mv = new ChessMove[count];
        int index =-1;
        for(int i=0; i<count; i++){
            if(moves[i]!=null){
                index++;
                mv[index] = moves[i];
            }            
                
        }
        
        return mv;
    }
       
   //To be remove - used for testing
    public static void main (String args[]) {
        AlphaBetaOptimized_3 ab=new AlphaBetaOptimized_3();

        long time=System.nanoTime();        
        ab.board=new Board(true);
        ab.engine_board_analyzer_1 = new EngineBoardAnalyzer_1(ab.board);
        long value=ab.search(true, false, Integer.MIN_VALUE, Integer.MAX_VALUE, -1, 7 , -1);
        long elapse = System.nanoTime() - time;
        
        System.out.println("value "+value );
        System.out.println("eval count "+ab.eval_count );
        System.out.println("nodes "+ab.node_count );
        System.out.println("prune_count "+ab.prune_count );
        System.out.println("tt_prune_count "+ab.tt_prune_count );
        System.out.println("transposition table entries "+ab.ttHashTable.getTotalEntries() +" of " +ab.ttHashTable.hash_table_length);        
        System.out.println("best move "+ab.best_move.notation() );
        System.out.println("code time "+elapse/1000000000.0 );
        ab.legalMoves = ab.trimMoves(ab.legalMoves);
        for(int i=0; i<ab.legalMoves.length; i++){
            System.out.print(ab.legalMoves[i].notation()+" -> "+ab.legalMoves[i].move_value+"  |  ");
        }         
    }

    int prune_count;    
    int node_count;    
    int eval_count;
    int move_max_length;
    int tt_prune_count;
   
    
    ChessMove[] increaseMoveLengthTo(ChessMove[] sMoves , int new_len){
        
        
        ChessMove[] moves=new ChessMove[new_len];
        
        for(int i=0; i<sMoves.length;i++)
            moves[i]=sMoves[i];
        
        return moves;
    }
    
    int killer;
    
    //NOT FULLY IMPLEMENTED
    boolean canAvoidZugzwang(int turn){
                
        
        int king_square_loc = turn==Side.white ? 
                               board.getWhiteKing().Square:
                               board.getBlackKing().Square;
       
               
        boolean is_king_in_check = this.engine_board_analyzer_1.isOwnKingAttacks(king_square_loc,                                                                     
                                                                                  king_square_loc,
                                                                                  turn,                                                                    
                                                                                  king_square_loc);
        
        if(is_king_in_check)
            return false;
        
        //TODO: MORE TEST GOES HERE
        
        return true;
    }
    
    public int search(boolean is_maximizer,
                        boolean is_allow_null_move,                        
                        int alpha,
                        int beta,             
                        int n_depth, 
                        int max_depth,
                        int piece_index){        

        n_depth++; // must be initialize to -1. Take note
        
        
        if(n_depth == max_depth){                                        
            eval_count++;
            int eval = board.evaluateGamePosition(piece_index, is_maximizer);//uncomment later                  
            return eval;//return            
        }        
        
        int value = is_maximizer? -Constants.INFINITY : Constants.INFINITY;//come back        
        int next_turn = 0;             
        board.side_pieces = null;//avoid references
        
        if(board.turn==Side.white){             
            next_turn =Side.black;  
            board.side_pieces = board.white_pieces;
            
        }else{        
            next_turn =Side.white;                        
            board.side_pieces = board.black_pieces;
        }
        
        Piece [] node_pieces=board.side_pieces;
        
        int node_turn=board.turn;
        board.isDoneKillerMove = true;//initialize to true
        
        board.computeBoardHash();
        int hash_key =   board.hashKey;
        int collision_filter =  board.collisionFilter;
                

        //check trasposition table
        ttHashTable.useHashKey(hash_key, collision_filter);//set the hash key to locate the entry
        
        if(ttHashTable.isEntryFound()){
            int tt_dept = ttHashTable.getDepth();
            if(tt_dept <= n_depth){//using <= comparision since it is normal (non-conventional) depth count.    
                //this implemention only set the EXACT value.
                //so return it.
                tt_prune_count++;
                 
                return ttHashTable.getEval();// since we already know the value                  
            }
            
            board.KillerMove = ttHashTable.getMove();//for killer move prunning
            board.isDoneKillerMove = false;
        }                            
        
        //NULL MOVE HEURISTICS NOT YET WORKING PROPERLY!
        /*if(is_allow_null_move){
            board.turn = board.turn==Side.white? Side.black : Side.white;//come back
            //NULL MOVE HEURISTICS NOT YET WORKING PROPERLY! 
            if(canAvoidZugzwang( board.turn)){            
                int null_move_val =search(is_maximizer, 
                                    false,
                                    alpha,                        
                                    beta,                                              
                                    n_depth,                         
                                    n_depth + 2,                        
                                    piece_index);


                if(null_move_val > beta){//come back
                    return beta;
                }
            }
        }
         * 
         */
         

        board.BitMove = 0;
        board.side_piece_index = 0;//yes        
        board.PromotionRating = 0;
        board.PrevPathSquare = Constants.NOTHING;
        board.NextSquarePath=0;
        board.isNeedNextPiece = true;
        board.checkEnPassant = board.EN_LHS;
        
                
        board.PrevPathSquare = board.side_pieces[board.side_piece_index].Square;                    
        
        int move = 0;
        int killer_move = 0;
        int promo_rating = 0;
        int eval_move_index = -1;
        int next_square_path = 0;
        int prev_to_square = Constants.NOTHING;
        int check_enpassant = 0;
        boolean is_need_next_piece = false;
        
        while (board.NextMove() != 0)
        {
            
            //save board control variables
            move = board.BitMove;
            killer_move = board.KillerMove;
            piece_index = board.side_piece_index;
            promo_rating = board.PromotionRating;
            next_square_path = board.NextSquarePath;
            prev_to_square = board.PrevPathSquare;
            is_need_next_piece = board.isNeedNextPiece;
            check_enpassant = board.checkEnPassant;            
            
            //validate the move. ie verify the unresolved square of the piece
            int from_square=move & Constants.FROM_SQUARE_MASK;//come back   
            int to_square=(move >>> Constants.TO_SQUARE_SHIFT) & Constants.TO_SQUARE_MASK;//come back  
            
            int piece_id=board.Squares[from_square];
            Piece pce=board.PIECES_BY_ID[piece_id];
            
            if(to_square != Constants.NOTHING)//if not long or short castle where to_square is 64
                if(board.isOwnKingCheck(pce, from_square, to_square))
                    continue;//invalid move, so skip 

            //At this piont the move is valid

            node_count++; 
            //if(node_count==7000000)//TESTING!!!
              //  System.exit(-1);//TESTING!!!
            
            int capture_id = board.MovePiece(move);
                                    
            int pre_value=value;
                                    
            board.turn = next_turn;//assign board turn used by the child node
                                    
            value = search(!is_maximizer, 
                            !is_allow_null_move,
                            alpha,                        
                            beta,                                              
                            n_depth,                         
                            max_depth,                        
                            piece_index);
                    
        
            
            board.turn = node_turn;//change back to this node board turn.                                    
            board.side_pieces = node_pieces;
            board.UndoMove(move ,capture_id);//chuks

            //restore board control variables
            board.BitMove = move;
            board.KillerMove = killer_move;
            board.side_piece_index = piece_index;          
            board.PromotionRating = promo_rating;
            board.NextSquarePath = next_square_path;
            board.PrevPathSquare  = prev_to_square;            
            board.isNeedNextPiece = is_need_next_piece;
            board.checkEnPassant = check_enpassant;            
                    
            eval_move_index++;
            
            if(is_maximizer){            
                                           
                if(n_depth==0){                                                                      
                    setBestMoveAndLegalMoves( pce, move, pre_value, value, node_turn, capture_id, eval_move_index);                                           
                }
                    
                if(value >= beta){                    
                    //value = beta;//no need for assign to beta, so as to allow for chess commentary                        
                    prune_count++;                        
                    break;//prune                        
                }
                    
                if(value < pre_value){                                                
                    value = pre_value;//bigger value                        
                    alpha = value;                        
                }
                    
            }else{//if minimizer                
                if(value <= alpha){                    
                   //value = alpha;//no need for assign to alpha, so as to allow for chess commentation                        
                    prune_count++;                        
                    break;//prune                        
                }
                    
                if(value > pre_value){                    
                    value = pre_value;//smaller value                        
                    beta = value;                        
                }                    
            }
                
            //update alpha or beta value                
            alpha=is_maximizer ? value : alpha;                
            beta= !is_maximizer ? value : beta;                                                    
            
        }
                                                                            
        
        //Set entry in transposition table
        if(eval_move_index != -1){
            ttHashTable.setEntry(hash_key, collision_filter, n_depth, move, 
                                 value, true, false, false);
        }                                 
        
        
        return value;
    }    

    private void setBestMoveAndLegalMoves(Piece pce,  int move,int pre_value, int value, int turn , int capture_id, int eval_move_index){
                       
        if(legalMoves==null)        
            legalMoves= new ChessMove[eval_move_index+1];
                                    
        if(legalMoves.length < eval_move_index+1){        
            legalMoves = increaseMoveLengthTo(legalMoves,  eval_move_index+1);            
        }
                                
        this.legalMoves[eval_move_index] = new ChessMove(move, turn,value,capture_id, pce.piece_name,-1);//used for chess commentary by comparing moves value                               
        
        if(best_move == null)//get at least the first move in the move list                                
            best_move = legalMoves[0];                   
                                    
        if(value > pre_value){        
            best_move=new ChessMove(move, turn,value,capture_id, pce.piece_name,-1);            
        }            
    }
    
  
    public static int test_dp;
    
    private ChessMove[] testMove(){//TESTING !!!
        
        test_dp++;
        
        ChessMove move1=new ChessMove(1,0,'N',2,4,3,3,4,-1,false,false);


        ChessMove move2=new ChessMove(1,0,'N',2,4,4,3,4,-1,false,false);
      
        ChessMove[] legal_moves;
        
        if(test_dp == 1){
            legal_moves = new ChessMove[3];
            legal_moves[0]=move1;
            legal_moves[1]=move1;
            legal_moves[2]=move1;
        }else{
            legal_moves = new ChessMove[2];
            legal_moves[0]=move1;
            legal_moves[1]=move1;            
        }
        
        return legal_moves;
    }

    public static int test_c;//TESTING !!!
    public static int depth_0;//TESTING !!!
    
    private void initTest(int i){
        test_c=0;
        depth_0=i;
    }
    
    private int testEvaluate1(){//TESTING !!!
        
        test_c++;

        if(depth_0==0)
        switch(test_c){
            case 1:return 4;
            case 2:return 6;                
            case 3:return 7;
            case 4:return 9;
        }

        if(depth_0==1)
        switch(test_c){
            case 1:return 1;
            case 2:return 2;
            case 3:return 0;
            case 4:return 1;    
        }
        
        if(depth_0==2)
        switch(test_c){
            case 1:return 8;
            case 2:return 1;
            case 3:return 9;
            case 4:return 2;                    
        }        
        
       return 0; 
    }

    
    private int testEvaluate2(){//TESTING !!!

        double rand =Math.random()*40.0;

       return (int) rand; 
       //return 0; 
    }


    private int getMoveScore(int to_square, int en_passant_square, int short_castle, int long_castle, int promotion_rating) {
        
        Piece piece=board.getPieceOnSquare(to_square);
        if(piece!=null){
            switch(piece.piece_name){
                case Constants.Pawn:return Constants.PAWN_CAPTURE;
                case Constants.Knight:return Constants.KNIGHT_CAPTURE;
                case Constants.Rook:return Constants.ROOK_CAPTURE;
                case Constants.Bishop:return Constants.BISHOP_CAPTURE;
                case Constants.Queen:return Constants.QUEEN_CAPTURE;    
            }
        }

        if(en_passant_square != Constants.NOTHING)//en passant
            return Constants.PAWN_CAPTURE;

        if(short_castle==1 || long_castle==1)
            return Constants.QUEEN_CAPTURE;//adopt queen capture score                      
        
            
        switch(promotion_rating){                
            case Constants.RookPromotion:return Constants.ROOK_CAPTURE;//adopt rook capture score          
            case Constants.BishopPromotion:return Constants.BISHOP_CAPTURE;//adopt bishop capture score                      
            case Constants.KnightPromotion:return Constants.KNIGHT_CAPTURE;//adopt knight capture score                      
            case Constants.QueenPromotion:return Constants.QUEEN_CAPTURE;//adopt queen capture score                      
        }
        
        return Constants.NONE_CAPTURE;        
    }
    
    
}


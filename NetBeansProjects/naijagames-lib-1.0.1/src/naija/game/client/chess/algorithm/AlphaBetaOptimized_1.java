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
public class AlphaBetaOptimized_1 {
 
    
    ChessMove best_move;
    private ChessMove[] legalMoves;//use for commentary by comparing move values
    private Board board;
    EngineBoardAnalyzer_1 engine_board_analyzer_1;
    TransPositionTable ttHashTable=new TransPositionTable();
    int move_length =40;
    int KillerMove;
    int PieceIndex = -1;
    int SquareIndex = -1;// yes zero
    int[] SquareDest = new int[0];   
    int BitMove;
    int PromotionRating;//will be stored in the BitMove;       
    private boolean isDoneKillerMove = true;
    boolean IsCheckLeftEnpassant=true;
    boolean IsCheckRightEnpassant=false;
    boolean IsEnpassantDone=false;
    int SidePieceMovedCount = 0;
    
    public AlphaBetaOptimized_1() {
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
        AlphaBetaOptimized_1 ab=new AlphaBetaOptimized_1();

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
    /**
     * This method is design to gradually generate the moves.
     * It generates unresolved moves which will have to pass through
     * validation before making the move.
     * This technique of gradually generating the moves is for the purpose
     * of optimization.
     * 
     * @return 
     */
    public boolean hasNextMove(){

        if(SidePieceMovedCount == 16 && SquareIndex == SquareDest.length -1)
            return false;
        
        if(!isDoneKillerMove){//play the killer move first
            BitMove = KillerMove;
            isDoneKillerMove = true;
            return true;
        }
                       
        int turn=board.turn;
        Piece[] pieces=board.getAllPieces();                

        
        while(PieceIndex < pieces.length -1 || SquareIndex < SquareDest.length -1){//Piece arrangement in the piece array may be zigzag because of FEN                
            
            if(SquareIndex == SquareDest.length -1){
                PieceIndex++;
                
                if(pieces[PieceIndex].Me() != turn)//Piece arrangement in the piece array may be zigzag because of FEN                
                    continue;

                if(pieces[PieceIndex].Square==Constants.NOTHING)
                    continue;

                SidePieceMovedCount++;
                //next initialize the SquareIndex
                SquareIndex = -1;//initialize
                
                switch(pieces[PieceIndex].piece_name){
                    case Constants.Pawn:
                        SquareDest = engine_board_analyzer_1.getUnresolvedPawnMoveSquares(pieces[PieceIndex].Square, turn);break;
                    case Constants.Rook:
                        SquareDest = engine_board_analyzer_1.getUnresolvedRookMoveSquares(pieces[PieceIndex].Square, turn);break;
                    case Constants.Bishop:
                        SquareDest = engine_board_analyzer_1.getUnresolvedBishopMoveSquares(pieces[PieceIndex].Square, turn);break;
                    case Constants.Knight:
                        SquareDest = engine_board_analyzer_1.getUnresolvedKnightMoveSquares(pieces[PieceIndex].Square, turn);break;
                    case Constants.Queen:
                        SquareDest = engine_board_analyzer_1.getUnresolvedQueenMoveSquares(pieces[PieceIndex].Square, turn);break;
                    case Constants.King:
                        SquareDest = engine_board_analyzer_1.getUnresolvedKingMoveSquares(pieces[PieceIndex].Square, turn);break;
                }
            }
            
           
            int from_square=64;//will be stored in the BitMove;
            int to_square=64;//will be stored in the BitMove;
            
            while(SquareIndex < SquareDest.length -1){

                SquareIndex++;
                
                if(SquareDest[SquareIndex] == Constants.NOTHING)//unresolve pawn and knight can return negative
                    continue;

                int enpassant_capture_square = Constants.NOTHING;
                    
                if(!IsEnpassantDone){
                    if(IsCheckLeftEnpassant){
                        enpassant_capture_square = LHS_EnpassantCapture(pieces[PieceIndex]);
                        IsCheckLeftEnpassant=false;
                        if(enpassant_capture_square == Constants.NOTHING)
                            IsCheckRightEnpassant=true;
                    }else{
                        IsCheckRightEnpassant=true;
                    }

                    if(IsCheckRightEnpassant){
                        enpassant_capture_square =  RHS_EnpassantCapture(pieces[PieceIndex]);
                        IsEnpassantDone=true;
                    }
                }                
                
                //COME BACK FOR THE COMMENTED LINES BELOW
                int is_long_castle = isLongCastle(pieces[PieceIndex]) ? 1 : 0;//returns 1 if true else 0
                int is_short_castle = isShortCastle(pieces[PieceIndex]) ? 1 : 0;//returns 1 if true else 0
                PromotionRating = PawnPromotion(pieces[PieceIndex], SquareDest[SquareIndex], PromotionRating, -1);//comeback
                //come back for PromotionRating. abeg o! REMIND: confirm correctnes
                if(enpassant_capture_square == Constants.NOTHING && is_short_castle == 0 && is_long_castle== 0){
                    from_square=pieces[PieceIndex].Square;
                    to_square = SquareDest[SquareIndex];// destination square                
                                           
                    if(PromotionRating < Constants.QueenPromotion)//if less than queen promotion.                    
                        SquareIndex--;//hold on so as to try other promotion in the search.                                                                                        
                        
                }else if(enpassant_capture_square != Constants.NOTHING){//come back
                    from_square=pieces[PieceIndex].Square;
                    SquareIndex--;
                }else{
                    //pause the loop count ie square--; try it!
                    from_square=pieces[PieceIndex].Square;
                    SquareIndex--; //uncomment after correctness confirmation
                }
                
                //store the values in the BitMove integer  by XORing left shifting
                BitMove = 0;//initialize - it is important to initialize
                
                BitMove |= from_square;
                BitMove |= to_square << Constants.TO_SQUARE_SHIFT;            
                BitMove |= enpassant_capture_square << Constants.ENPASSANT_CAPUTRE_SQURE_SHIFT;     
                BitMove |= is_short_castle << Constants.IS_SHORT_CASTLE_SHIFT;     
                BitMove |= is_long_castle << Constants.IS_LONG_CASTLE_SHIFT;     
                BitMove |= PromotionRating << Constants.PROMOTION_RATING_SHIFT; 
                //BitMove |= capture_type << Constants.CAPTURE_TYPE_SHIFT; //no required               
                
                if(BitMove == KillerMove)
                    continue;//already played
                
                return true;
            }
            
        }
        
        PromotionRating = 0; //important

        return false;
    }
   
    
    
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
            int eval = evaluateGamePosition(piece_index, is_maximizer);//uncomment later                  
            return eval;//return            
        }        
        
        int value = is_maximizer? -Constants.INFINITY : Constants.INFINITY;//come back        
        int next_turn = board.turn==Side.white? Side.black : Side.white;        
        int node_turn=board.turn;
        isDoneKillerMove = true;//initialize to true
        
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
            
            KillerMove = ttHashTable.getMove();//for killer move prunning
            isDoneKillerMove = false;
        }                            
        
        //NULL MOVE HEURISTICS NOT YET WORKING PROPERLY!
        /*
         * if(is_allow_null_move){
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
         
         
         
         

        

        int king_square_loc = node_turn==Side.white ? 
                               board.getWhiteKing().Square:
                               board.getBlackKing().Square;

        BitMove = 0;
        PieceIndex = -1;
        SquareIndex = -1;
        SquareDest = new int[0];//initialize            
        PromotionRating = 0;
        IsCheckLeftEnpassant=true;
        IsCheckRightEnpassant=false;
        IsEnpassantDone=false;         
        SidePieceMovedCount = 0;
        
        int move = 0;
        int killer_move = 0;
        int promo_rating = 0;
        int eval_move_index = -1;
        int square_index = -1;
        int []square_dest = null;
        boolean is_check_left_enpassant=true;
        boolean is_check_right_enpassant=false;
        boolean is_enpassant_done=false; 
        int piece_moved_count=0;
        
        while (hasNextMove())
        {
            move = BitMove;
            killer_move = KillerMove;
            piece_index = PieceIndex;
            square_index = SquareIndex;
            square_dest = SquareDest;
            promo_rating = PromotionRating;
            is_check_left_enpassant = IsCheckLeftEnpassant;
            is_check_right_enpassant = IsCheckRightEnpassant;
            is_enpassant_done = IsEnpassantDone;
            piece_moved_count = SidePieceMovedCount;
            
            //validate the move. ie verify the unresolved square of the piece
            int from_square=move & Constants.FROM_SQUARE_MASK;//come back   
            int to_square=(move >>> Constants.TO_SQUARE_SHIFT) & Constants.TO_SQUARE_MASK;//come back  
            int is_short_castle=(move >>> Constants.IS_SHORT_CASTLE_SHIFT) & Constants.IS_SHORT_CASTLE_MASK;//come back  
            int is_long_castle=(move >>> Constants.IS_LONG_CASTLE_SHIFT) & Constants.IS_LONG_CASTLE_MASK;//come back  

            int piece_id=board.Squares[from_square];
            char piece_name=board.PIECES_BY_ID[piece_id].piece_name; // i do not expect NullPointerException

            if(is_short_castle == 0 && is_long_castle ==0){//not castle move
                //check if to_square was cancelled
                if(to_square==Constants.NOTHING)
                    continue;//the square was cancelled

                if(piece_name != Constants.King){
                    //is pawn, rook, bishop, knight or queen 
                    if(king_square_loc == 64){//TESTING
                        king_square_loc = 64;//TESTING
                    }
                    if(engine_board_analyzer_1.isOwnKingAttacks(board.PIECES_BY_ID[piece_id].Square, to_square, node_turn, king_square_loc))
                    {
                        //invalid move
                        continue;
                    }                        
                }else{
                    //is king
                    if(!isValidKingMove( board.PIECES_BY_ID[piece_id].Square, to_square, node_turn)){
                        //invalid king move - king will be in check
                        continue;
                    }
                }
            }

            //At this piont the move is valid

            node_count++;            
            int caputre_id = board.MovePiece(move);
                                    
            int pre_value=value;
                                    
            board.turn = next_turn;//assign board turn used by the child node
                                    
            value = search(!is_maximizer, 
                            !is_allow_null_move,
                            alpha,                        
                            beta,                                              
                            n_depth,                         
                            max_depth,                        
                            piece_id);
                    
            board.turn = node_turn;//change back to this node board turn.                                    
            board.UndoMove(move ,caputre_id);//chuks

            BitMove = move;
            KillerMove = killer_move;
            PieceIndex = piece_index;
            SquareIndex = square_index;
            SquareDest = square_dest;            
            PromotionRating = promo_rating;
            IsCheckLeftEnpassant = is_check_left_enpassant;
            IsCheckRightEnpassant = is_check_right_enpassant;
            IsEnpassantDone = is_enpassant_done;
            SidePieceMovedCount = piece_moved_count;
            
            eval_move_index++;
            
            if(is_maximizer){            
                        
                    if(n_depth==0){                                                      
                        if(legalMoves==null)
                            legalMoves= new ChessMove[eval_move_index+1];
                        
                        if(legalMoves.length < eval_move_index+1){
                            legalMoves = increaseMoveLengthTo(legalMoves,  eval_move_index+1);
                        }
                        
                        this.legalMoves[eval_move_index] = new ChessMove(move,node_turn,value,caputre_id,piece_name,-1);//used for chess commentary by comparing moves value                           
    
                        if(best_move == null)//get at least the first move in the move list                        
                            best_move = legalMoves[0];                   
                        
                        if(value > pre_value){
                           best_move=new ChessMove(move,node_turn,value,caputre_id,piece_name,-1);
                        }                           
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

    
    public int evaluateGamePosition(int piece_index, boolean is_maximizer){
        
        int cost = 0;
        
        int piece_evalute=evaluatePiecesOnBoardCost();        
        int threat_attack_cost = possibleThreatCost(piece_index);

        //cost= evalute;//TESTING!!! COMMENT HERE LATER
        cost= piece_evalute + threat_attack_cost; // REMOVE COMMENT LATER
//System.out.println("is_maximizer "+is_maximizer+" evalute "+evalute+" threat_attack_cost "+threat_attack_cost+" cost "+cost);
        cost = is_maximizer? cost: -cost;//come back        
//System.out.println("negated--is_maximizer "+is_maximizer+" evalute "+evalute+" threat_attack_cost "+threat_attack_cost+" cost "+cost);
        return cost;        
    }

    private int evaluatePiecesOnBoardCost(){
        
        int cost=0;
       
        //return positive cost if the player has more valuable piece and negative if otherwise.
        
        Piece[] pieces=board.getAllPieces();
        for(int i=pieces.length -1; i>-1; i--){
            
            if(pieces[i].Square == Constants.NOTHING)
                continue;
            
            if(pieces[i].Me()== board.turn){
                //positive cost
                switch(pieces[i].piece_name){
                    case Constants.King : cost += Constants.king_cost; continue;
                    case Constants.Queen : cost += Constants.queen_cost; continue;
                    case Constants.Bishop : cost += Constants.bishop_cost; continue;
                    case Constants.Knight : cost += Constants.knight_cost; continue;
                    case Constants.Rook : cost += Constants.Rook; continue;
                    case Constants.Pawn : cost += Constants.pawn_cost; continue;
                }
            }else{
                //negative cost
                switch(pieces[i].piece_name){
                    case Constants.King : cost -= Constants.king_cost; continue;
                    case Constants.Queen : cost -= Constants.queen_cost; continue;
                    case Constants.Bishop : cost -= Constants.bishop_cost; continue;
                    case Constants.Knight : cost -= Constants.knight_cost; continue;
                    case Constants.Rook : cost -= Constants.Rook; continue;
                    case Constants.Pawn : cost -= Constants.pawn_cost; continue;
                }                
            }
        }
        
        //cost = !is_maximizer?cost:-cost;//come back
        
        
        return cost;
    }    
    

    private int possibleThreatCost(int piece_index ){
        
        Piece piece=board.getPieceByID(piece_index); //piece index and id is same
        
        
       
        
        /*leave out king check for now
         * 
         *  //king check
         * if(piece.piece_name==Constants.King)
            if(boardAnalyzer.canKingBeAttacked(nodeMove.PieceIndex))
                return -Constants.knight_cost;  //negative cost                
         * 
         */
        
        int cost=0;
        
        //check major piece capture
        if(engine_board_analyzer_1.canPieceBeAttacked(piece.ID, piece.Square)){
            switch(piece.piece_name){
                case Constants.Queen: cost= -Constants.queen_cost;break;  
                case Constants.Bishop: cost= -Constants.bishop_cost;break;
                case Constants.Rook: cost= -Constants.rook_cost;break;  
                case Constants.Knight: cost= -Constants.knight_cost;break;   
                case Constants.Pawn: cost= -Constants.pawn_cost;break;// omit pawn for performance reason  
            }
        }
        
        return cost;
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


    public int RHS_EnpassantCapture(Piece pce) {
        
        if(pce.piece_name!=Constants.Pawn)
            return Constants.NOTHING;

        
        if(pce.isWhite()){
            
            if(pce.Square <32 || pce.Square >39)//check if white piece is on its fifth rank.
                return Constants.NOTHING;//not on the fifth rank so leave 
            
            if((pce.Square + 1)%8==0 ){//right edge square - ie square 7, 15, 23, 31, 39, 47, 55, 63.                
                return Constants.NOTHING;//not required here                
            }
            
                
            int en_passant_square_RHS=pce.Square + 1;//square to the RHS
            int RHS_capture_piece_id =board.Squares[en_passant_square_RHS];
            Piece piece_RHS = board.getPieceByID(RHS_capture_piece_id); 
            int to_square_RHS=en_passant_square_RHS + 8;
            
            if(board.Squares[to_square_RHS] == Constants.NOTHING)// check if to_square is empty
                if(RHS_capture_piece_id != Constants.NOTHING)//check if adjacent square to the right is ocupied                         
                    if(piece_RHS.piece_name==Constants.Pawn)
                        if(piece_RHS.PawnDoubleStepMove)//pawn makes double step - ie first move                                
                            if(piece_RHS.isBlack())
                                return en_passant_square_RHS;//opponent piece square
                
            
            
        }else{ //is balck
            
            if(pce.Square < 24 || pce.Square >31)//check if black piece is on its fifth rank.
                return Constants.NOTHING;//not on the fifth rank so leave
            
            
            if((pce.Square + 1)%8==0 ){//right edge square - ie square 7, 15, 23, 31, 39, 47, 55, 63.                
                return Constants.NOTHING;//not required here                
            }
            

            int en_passant_square_RHS=pce.Square + 1;//square to the RHS
            int RHS_capture_piece_id =board.Squares[en_passant_square_RHS];
            Piece piece_RHS = board.getPieceByID(RHS_capture_piece_id);                 
            int to_square_RHS=en_passant_square_RHS - 8;
            
            if(board.Squares[to_square_RHS] == Constants.NOTHING)// check if to_square is empty
                if(RHS_capture_piece_id != Constants.NOTHING)//check if adjacent square to the right is ocupied                         
                    if(piece_RHS.piece_name==Constants.Pawn)
                        if(piece_RHS.PawnDoubleStepMove)//pawn makes double step - ie first move                                
                            if(piece_RHS.isWhite())
                                return en_passant_square_RHS;//opponent piece square
                                    
                        
        }

        return Constants.NOTHING;
    }

    public int LHS_EnpassantCapture(Piece pce) {
        
        if(pce.piece_name!=Constants.Pawn)
            return Constants.NOTHING;

        
        if(pce.isWhite()){
            
            if(pce.Square <32 || pce.Square >39)//check if white piece is on its fifth rank.
                return Constants.NOTHING;//not on the fifth rank so leave 
            
            if(pce.Square%8==0 ){//left edge square- ie square 0, 8, 16, 24, 32, 40, 48, 56.
                return Constants.NOTHING;//not required here                                  
            }
                            
            int en_passant_square_LHS=pce.Square - 1;//square to the LHS
            int LHS_capture_piece_id =board.Squares[en_passant_square_LHS];
            Piece piece_LHS = board.getPieceByID(LHS_capture_piece_id); 
            int to_square_LHS=en_passant_square_LHS + 8;
            
            if(board.Squares[to_square_LHS] == Constants.NOTHING)// check if to_square is empty
                if(LHS_capture_piece_id != Constants.NOTHING)//check if adjacent square to the left is ocupied                         
                    if(piece_LHS.piece_name==Constants.Pawn)
                        if(piece_LHS.PawnDoubleStepMove)//pawn makes double step - ie first move                                
                            if(piece_LHS.isBlack())
                                return en_passant_square_LHS;//opponent piece square
            
        }else{ //is balck
            
            if(pce.Square < 24 || pce.Square >31)//check if black piece is on its fifth rank.
                return Constants.NOTHING;//not on the fifth rank so leave

            if(pce.Square%8==0 ){//left edge square- ie square 0, 8, 16, 24, 32, 40, 48, 56.
                return Constants.NOTHING;//not required here                                  
            }            
                            
            int en_passant_square_LHS=pce.Square - 1;//square to the LHS
            int LHS_capture_piece_id =board.Squares[en_passant_square_LHS];                
            Piece piece_LHS = board.getPieceByID(LHS_capture_piece_id);                 
            int to_square_LHS=en_passant_square_LHS - 8;
            
            if(board.Squares[to_square_LHS] == Constants.NOTHING)// check if to_square is empty
                if(LHS_capture_piece_id != Constants.NOTHING)//check if adjacent square to the left is ocupied                         
                    if(piece_LHS.piece_name==Constants.Pawn)
                        if(piece_LHS.PawnDoubleStepMove)//pawn makes double step - ie first move                                        
                            if(piece_LHS.isWhite())                                                                        
                                return en_passant_square_LHS;//opponent piece square
                            
        }

        return Constants.NOTHING;
    }    
    
    
    public boolean isShortCastle(Piece pce) {
        
        if(pce.piece_name != Constants.King)
            return false;
        
        if(pce.isAlreadyCastle)//important - so that engine does not repeat castle
            return false;        
        
        if(pce.hasPreviouslyMoved())
            return false;        
        
        int king_to_square = Constants.NOTHING;
        int rook_square = Constants.NOTHING;
        
        if(pce.isWhite()){   
            
            if(!board.canWhiteShortCastle)
                return false;              
            
            if(board.getWhiteRookOnKingSide().hasPreviouslyMoved())
                return false;          
            
            if(pce.Square != board.WHITE_king_ORIGIN_square ||
               board.getWhiteRookOnKingSide().Square != board.WHITE_rook_ORIGIN_square_on_KING_side)
                return false;

            king_to_square= board.WHITE_KING_SHORT_CASTLE_SQUARE;
            rook_square = board.getWhiteRookOnKingSide().Square;
                    
        }else{
            
            if(!board.canBlackShortCastle)
                return false;             
            
            if(board.getBlackRookOnKingSide().hasPreviouslyMoved())
                return false;            
                        
            if(pce.Square != board.BLACK_king_ORIGIN_square ||
               board.getBlackRookOnKingSide().Square != board.BLACK_rook_ORIGIN_square_on_KING_side)
                return false;            
        
            king_to_square= board.BLACK_KING_SHORT_CASTLE_SQUARE;
            rook_square = board.getBlackRookOnKingSide().Square;
                    
        }        
                
        //check if all squares between rook and king is empty
        
        //COME BACK TO TEST FOR CORRECTNESS         
        for(int sq=pce.Square + 1 ; sq < rook_square; sq++){
           if(board.Squares[sq]!=Constants.NOTHING)
            return false;
        }
                        
        
        
        //check king check states all through
        
        //COME BACK TO TEST FOR CORRECTNESS
        for(int sq=pce.Square; sq < king_to_square + 1; sq++){
            if(engine_board_analyzer_1.canPieceBeAttacked(pce.ID, sq))//check attack at final square destination  sq_2
            return false;  
        }
        
        //------------------------------
        
        //finally
        pce.isAlreadyCastle=true;
        
        return true;        
    }

    public boolean isLongCastle(Piece pce) {
        if(pce.piece_name != Constants.King)
            return false;
        
        if(pce.isAlreadyCastle)//important - so that engine does not repeat castle
            return false;        
        
        if(pce.hasPreviouslyMoved())
            return false;        

        int king_to_square = Constants.NOTHING;
        int rook_square = Constants.NOTHING;
                
        if(pce.isWhite()){
                        
            if(!board.canWhiteLongCastle)
                return false;                          
            
            if(board.getWhiteRookOnQueenSide().hasPreviouslyMoved())
                return false;
                        
            if(pce.Square != board.WHITE_king_ORIGIN_square ||
               board.getWhiteRookOnQueenSide().Square != board.WHITE_rook_ORIGIN_square_on_QUEEN_side)
                return false;    

            king_to_square= board.WHITE_KING_LONG_CASTLE_SQUARE;
            rook_square = board.getWhiteRookOnQueenSide().Square;
            
        }else{
                        
            if(!board.canBlackLongCastle)
                return false;     
            
            if(board.getBlackRookOnQueenSide().hasPreviouslyMoved())
                return false;            
                                    
            if(pce.Square != board.BLACK_king_ORIGIN_square ||
               board.getBlackRookOnQueenSide().Square != board.BLACK_rook_ORIGIN_square_on_QUEEN_side)
                return false;                
            
            king_to_square= board.BLACK_KING_LONG_CASTLE_SQUARE;
            rook_square = board.getBlackRookOnQueenSide().Square;
            
        }

        //check if all squares between rook and king is empty
        
        //COME BACK TO TEST FOR CORRECTNESS         
        for(int sq=pce.Square - 1 ; sq > rook_square; sq--){
           if(board.Squares[sq]!=Constants.NOTHING)
            return false;
        }        
        
        
        //check king check states all through

        //COME BACK TO TEST FOR CORRECTNESS
        for(int sq=pce.Square; sq > king_to_square -1; sq--){
            if(engine_board_analyzer_1.canPieceBeAttacked(pce.ID, sq))//check attack at final square destination  sq_2
            return false;  
        }
        
        
        //finally
        pce.isAlreadyCastle=true;
        
        return true;
    }

    private int PawnPromotion(Piece piece, int to_square, int promotion_piece_rating, int depth) {
        
        
        if(piece.piece_name!=Constants.Pawn)
            return Constants.NOTHING;//any number greater than 4
        
        if(piece.isWhite() &&  to_square < 56)
            return Constants.NOTHING;//any number greater than 4
        
        if(piece.isBlack() &&  to_square > 7)
            return Constants.NOTHING;//any number greater than 4
                        
        
        if(depth==0){//the engine is configured here to promote to queen only
           return Constants.QueenPromotion;//a number of 4
        }
        
        promotion_piece_rating++;
        
        switch(promotion_piece_rating){            
            case 1:return Constants.RookPromotion; //a number of 1
            case 2:return Constants.BishopPromotion;//a number of 2
            case 3:return Constants.KnightPromotion;//a number of 3               
            case 4:return Constants.QueenPromotion;//a number of 4
        }
        
        return Constants.NOTHING;//any number greater than 4
    }

    private boolean isValidKingMove(int square_loc, int to_square, int node_turn) {
             
                 
             if(engine_board_analyzer_1.isOwnKingAttacks(square_loc, 
                                           to_square,
                                           node_turn,
                                           to_square))//yes to_square again in the parameter                  
             {                                 
                 return false;                 
             }   

         return true;
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


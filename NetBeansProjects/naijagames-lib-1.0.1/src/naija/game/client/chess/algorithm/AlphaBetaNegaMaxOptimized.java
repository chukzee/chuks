/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.algorithm;

import naija.game.client.chess.ChessMove;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.BoardAnalyzer;
import naija.game.client.chess.board.ChessBoardMove;
import naija.game.client.chess.board.EngineBoardAnalyzer;
import naija.game.client.chess.board.Piece;
import naija.game.client.chess.board.Constants;
import naija.game.client.Side;

/**
 *
 * @author Onyeka Alimele
 */
public class AlphaBetaNegaMaxOptimized {

    ChessMove best_move;
    private ChessMove[] legalMoves;//use for commentary by comparing move values
    private int search_depth;
    private int best_bit_move;
    private Board board;
    EngineBoardAnalyzer engine_board_analyzer;
    TransPositionTable ttHashTable=new TransPositionTable();
    private int move_length = 40;
    
    public AlphaBetaNegaMaxOptimized() {
    }

    public ChessMove searchBestMove(Board _board, int depth) {
        
        legalMoves = null;//initialize
        best_move = null;//initialize
        node_count=0;    
        prune_count=0;
        move_length = 40;//can change        
        System.out.println("INITIAL BOARD PRINT - "+_board);
        //Move best_move=null;
        Board internal_board=new Board(false);//empty board
        internal_board.CopyBoard(_board);//use a copy
        this.board=internal_board;
        engine_board_analyzer= new EngineBoardAnalyzer(this.board);
        
        
        this.search_depth=depth;
        int value=alphaBeta(depth, -Constants.INFINITY, Constants.INFINITY, -1);
        legalMoves = trimMoves(legalMoves);        
        
        System.out.println("value "+value );
        System.out.println("nodes "+node_count );
        System.out.println("prune_count "+prune_count );
        
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
        AlphaBetaNegaMaxOptimized ab=new AlphaBetaNegaMaxOptimized();

        long time=System.nanoTime();        
        //long value=ab.search(new Board(true),true, Long.MIN_VALUE, Long.MAX_VALUE, -1, 4 , -1);
        ab.search_depth=7;
        ab.board=new Board(true);
        ab.engine_board_analyzer= new EngineBoardAnalyzer(ab.board);
        int value=ab.alphaBeta(ab.search_depth, -Constants.INFINITY, Constants.INFINITY, -1);
        long elapse = System.nanoTime() - time;
        
        System.out.println("value "+value );
        System.out.println("eval count "+ab.eval_count );
        System.out.println("nodes "+ab.node_count );
        System.out.println("prune_count "+ab.prune_count );
        System.out.println("tt_prune_count "+ab.tt_prune_count );                
        System.out.println("move_length "+ab.move_max_length );                
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

    
    public int[] generatePieceMoves(){

          
        int next_order_index = -1;
        
        int[] BitMoves=new int[move_length];
        
        int turn=board.turn;
        Piece[] pieces=board.getAllPieces();
        
        int[] squares = null;
    
        for(int i=0; i < 32; i++){//Piece arrangement in the piece array may be zigzag because of FEN                

            if(pieces[i].Me() != turn)//Piece arrangement in the piece array may be zigzag because of FEN                
                continue;
            
            if(pieces[i].Square==Constants.NOTHING)
                continue;
            
            
            switch(pieces[i].piece_name){
                case Constants.Pawn:squares=engine_board_analyzer.getUnresolvedPawnMoveSquares(pieces[i].Square, turn);break;
                case Constants.Rook:squares=engine_board_analyzer.getUnresolvedRookMoveSquares(pieces[i].Square, turn);break;
                case Constants.Bishop:squares=engine_board_analyzer.getUnresolvedBishopMoveSquares(pieces[i].Square, turn);break;
                case Constants.Knight:squares=engine_board_analyzer.getUnresolvedKnightMoveSquares(pieces[i].Square, turn);break;
                case Constants.Queen:squares=engine_board_analyzer.getUnresolvedQueenMoveSquares(pieces[i].Square, turn);break;
                case Constants.King:squares=engine_board_analyzer.getUnresolvedKingMoveSquares(pieces[i].Square, turn);break;
            }
            
            boolean is_check_left_enpassant=true;
            boolean is_check_right_enpassant=false;
            boolean is_enpassant_done=false;            
            int bit_move = 0;//this will store the properties of the chess move
            int from_square=64;//will be store in the bit_move;
            int to_square=64;//will be store in the bit_move;
            int is_short_castle=0;//will be store in the bit_move;
            int is_long_castle=0;//will be store in the bit_move;        
            int promotion_rating=0;//will be store in the bit_move;       
            int capture_type=0;//will be store in the bit_move;       
            
            for(int sq=0; sq<squares.length;sq++){

                if(squares[sq]==Constants.NOTHING)//unresolve pawn and knight can return negative
                    continue;

                int enpassant_capture_square = Constants.NOTHING;
                
                if(pieces[i].Square == 33 && board.hashKey == -3846725142095208136L)//TESTING
                   pieces[i].Square =33; //TESTING
                
                if(!is_enpassant_done){
                    if(is_check_left_enpassant){
                        enpassant_capture_square = LHS_EnpassantCapture(pieces[i]);
                        is_check_left_enpassant=false;
                        if(enpassant_capture_square == Constants.NOTHING)
                            is_check_right_enpassant=true;
                    }else{
                        is_check_right_enpassant=true;
                    }

                    if(is_check_right_enpassant){
                        enpassant_capture_square =  RHS_EnpassantCapture(pieces[i]);
                        is_enpassant_done=true;
                    }
                }                
                
                //COME BACK FOR THE COMMENTED LINES BELOW
                is_long_castle = isLongCastle(pieces[i]) ? 1 : 0;//returns 1 if true else 0
                is_short_castle = isShortCastle(pieces[i]) ? 1 : 0;//returns 1 if true else 0
                promotion_rating = PawnPromotion(pieces[i], squares[sq], promotion_rating, -1);//comeback
                                
                capture_type = getMoveScore(squares[sq], enpassant_capture_square,is_short_castle,is_long_castle,promotion_rating);                                                   
                
                if(enpassant_capture_square == Constants.NOTHING && is_short_castle == 0 && is_long_castle== 0){
                    from_square=pieces[i].Square;
                    to_square = squares[sq];// destination square                
                                           
                    if(promotion_rating < Constants.QueenPromotion)//if less than queen promotion.                    
                        sq--;//hold on so as to try other promotion in the search.                                                                                        
                        
                }else if(enpassant_capture_square != Constants.NOTHING){//come back
                    from_square=pieces[i].Square;
                    sq--;
                }else{
                    //pause the loop count ie square--; try it!
                    from_square=pieces[i].Square;
                    sq--; //uncomment after correctness confirmation
                }
                
                //store the values in the bit_move integer  by XORing left shifting
                bit_move = 0;//initialize - it is important to initialize
                
                bit_move |= from_square;
                bit_move |= to_square << Constants.TO_SQUARE_SHIFT;            
                bit_move |= enpassant_capture_square << Constants.ENPASSANT_CAPUTRE_SQURE_SHIFT;     
                bit_move |= is_short_castle << Constants.IS_SHORT_CASTLE_SHIFT;     
                bit_move |= is_long_castle << Constants.IS_LONG_CASTLE_SHIFT;     
                bit_move |= promotion_rating << Constants.PROMOTION_RATING_SHIFT; 
                bit_move |= capture_type << Constants.CAPTURE_TYPE_SHIFT;                
                
                next_order_index++;
                
                if(next_order_index > BitMoves.length-1)
                    BitMoves=increaseMoveBuffer(BitMoves);
                
                BitMoves=orderMoves(BitMoves, bit_move,next_order_index);
                
            }
        }
        
        if(move_max_length<next_order_index)//TESTING
            move_max_length=next_order_index;//TESTING        
        
        return BitMoves;
    }
    
    int[] increaseMoveBuffer(int[] BitMoves){
        
        this.move_length=BitMoves.length+5;
        
        int[] moves=new int[move_length];
        
        for(int i=0; i<BitMoves.length;i++)
            moves[i]=BitMoves[i];
        
        return moves;
    }
  
    private int[] orderMoves(int[] BitMoves, int bit_move, int next_order_index){
        
        //COME BACK TO VERIFY IF PROBLEM WITH REPETITION  IS FULLY SOLVED
        
        int capture_type_0 = -1;
        int capture_type_1 = -1;
        int capture_type_2 = -1;
        int capture_type_3 = -1;
        int capture_type_4 = -1;
        int capture_type_5 = -1;
        int capture_type_6 = -1;
        
        int current_capture_type= (bit_move >> Constants.CAPTURE_TYPE_SHIFT)
                                               & Constants.CAPTURE_TYPE_MASK; //TESTING!!! - REMOVE LATER

  
        if(next_order_index > 0){
            capture_type_0=(BitMoves[0] >> Constants.CAPTURE_TYPE_SHIFT)
                                           & Constants.CAPTURE_TYPE_MASK; 
        }
        
        if(next_order_index > 1){
            capture_type_1=(BitMoves[1] >> Constants.CAPTURE_TYPE_SHIFT)
                                           & Constants.CAPTURE_TYPE_MASK; 
        }
        
        if(next_order_index > 2){
            capture_type_2=(BitMoves[2] >> Constants.CAPTURE_TYPE_SHIFT)
                                           & Constants.CAPTURE_TYPE_MASK; 
        }
        
        if(next_order_index > 3){
            capture_type_3=(BitMoves[3] >> Constants.CAPTURE_TYPE_SHIFT)
                                           & Constants.CAPTURE_TYPE_MASK; 
        }
        
        if(next_order_index > 4){
            capture_type_4=(BitMoves[4] >> Constants.CAPTURE_TYPE_SHIFT)
                                           & Constants.CAPTURE_TYPE_MASK; 
        }
        
        if(next_order_index > 5){
            capture_type_5=(BitMoves[5] >> Constants.CAPTURE_TYPE_SHIFT)
                                           & Constants.CAPTURE_TYPE_MASK; 
        }
        
        if(next_order_index > 6){
            capture_type_6=(BitMoves[6] >> Constants.CAPTURE_TYPE_SHIFT)
                                           & Constants.CAPTURE_TYPE_MASK; 
        }
                    
        //next, set the move in the current index regardless of capture
                    
        
        boolean swap=false;
        int m=0;//swap variable
        
        if(next_order_index > 6 && capture_type_6 < current_capture_type){
            m=BitMoves[6];
            BitMoves[6]=bit_move;
            BitMoves[next_order_index] = BitMoves[7];
            BitMoves[7]=m;
            capture_type_6=BitMoves[6];
            swap=true;
        }

        
        if(next_order_index > 5 && capture_type_5 < current_capture_type){
            m=BitMoves[5];
            BitMoves[5]=bit_move;
            BitMoves[6]=m;
            capture_type_5=BitMoves[5];
            capture_type_6=BitMoves[6];
            swap=true;
        }
        
        
        if(next_order_index > 4 && capture_type_4 < current_capture_type){
            m=BitMoves[4];
            BitMoves[4]=bit_move;
            BitMoves[5]=m;
            capture_type_4=BitMoves[4];
            capture_type_5=BitMoves[5];            
            swap=true;
        }
        
        
        if(next_order_index > 3 && capture_type_3 < current_capture_type){
            m=BitMoves[3];
            BitMoves[3]=bit_move;
            BitMoves[4]=m;
            capture_type_3=BitMoves[3];
            capture_type_4=BitMoves[4];            
            swap=true;
        }
        
        
        if(next_order_index > 2 && capture_type_2 < current_capture_type){
            m=BitMoves[2];
            BitMoves[2]=bit_move;
            BitMoves[3]=m;
            capture_type_2=BitMoves[2];
            capture_type_3=BitMoves[3];            
            swap=true;
        }
        
        
        if(next_order_index > 1 && capture_type_1 < current_capture_type){
            m=BitMoves[1];
            BitMoves[1]=bit_move;
            BitMoves[2]=m;
            capture_type_1=BitMoves[1];
            capture_type_2=BitMoves[2];            
            swap=true;
        }        

        
        if(next_order_index > 0 && capture_type_0 < current_capture_type){
            m=BitMoves[0];
            BitMoves[0]=bit_move;
            BitMoves[1]=m;
            capture_type_0=BitMoves[0];
            capture_type_1=BitMoves[1];            
            swap=true;
        }                
        
        if(!swap)
            BitMoves[next_order_index] = bit_move;
        
        return BitMoves;   
    }   
     
    int alphaBeta(int depth, int alpha, int beta,int piece_index)
    {
        
        int value;
        if(depth == 0/* || board.isEnded()*/)
        {
            //value = evaluate(board);
            value = evaluateGamePosition(piece_index);
            return value;
        }
        
        //check trasposition table
        board.computeBoardHash();
        int hash_key =  (int) board.hashKey;
        int collision_filter = (int) board.collisionFilter;
        
        //check trasposition table
        ttHashTable.useHashKey(hash_key, collision_filter);//set the hash key to locate the entry
                
        if(ttHashTable.isEntryFound()){
            if(ttHashTable.getDepth() >= depth){//using >= comparision since it is reverse (conventional)depth count.    
                //this implemention only set the EXACT value.
                //so return it.
                tt_prune_count++;
                 
                return ttHashTable.getEval();// since we already know the value                  
            }                   
        }                            
         
                
        
        //int move; 
        int node_turn=board.turn;
        int next_turn=board.turn==Side.white?Side.black:Side.white;        
        
        int king_square_loc = node_turn==Side.white ? 
                               board.getWhiteKing().Square:
                               board.getBlackKing().Square;
        
        //the various possible piece squares will be set below here for purpose of optimization
        int[] knight_squares=engine_board_analyzer.getKnightCapturableSquares_1 (king_square_loc);
         
        int[] vert_up = engine_board_analyzer.getVerticalUpwardSquares_1 (king_square_loc);
        int[] vert_down = engine_board_analyzer.getVerticalDownwardSquares_1 (king_square_loc);
        int[] horiz_left = engine_board_analyzer.getHorizontalLeftwardSquares_1 (king_square_loc);        
        int[] horiz_right = engine_board_analyzer.getHorizontalRightwardSquares_1 (king_square_loc);
         
        int[] top_left_diagonal = engine_board_analyzer.getTopLeftDiagonalSquares_1 (king_square_loc);        
        int[] top_right_diagonal = engine_board_analyzer.getTopRightDiagonalSquares_1 (king_square_loc);
        int[] bottom_left_diagonal = engine_board_analyzer.getBottomLeftDiagonalSquares_1( king_square_loc);
        int[] bottom_right_diagonal = engine_board_analyzer.getBottomRightDiagonalSquares_1 (king_square_loc);        
                
                
        int[] moves = generatePieceMoves();
        int best = -Constants.INFINITY-1;
        int eval_move_index = -1;   
        //REMIND: CONFIRM DEFAULT VALUE OF JAVASCRIPT INTEGER (NUMBER) ARRAY - MODIFY THE FOR LOOP '&&' CONDITION IF THE DEFAULT IS NOT ZERO
        for (int i=0; i<moves.length && moves[i]!=0 ;i++)
        {
            //validate the move. ie verify the unresolved square of the piece
            int from_square=moves[i] & Constants.FROM_SQUARE_MASK;//come back   
            int to_square=(moves[i] >>> Constants.TO_SQUARE_SHIFT) & Constants.TO_SQUARE_MASK;//come back    
            int is_short_castle=(moves[i] >>> Constants.IS_SHORT_CASTLE_SHIFT) & Constants.IS_SHORT_CASTLE_MASK;//come back  
            int is_long_castle=(moves[i] >>> Constants.IS_LONG_CASTLE_SHIFT) & Constants.IS_LONG_CASTLE_MASK;//come back  

            int piece_id=board.Squares[from_square];
            char piece_name=board.PIECES_BY_ID[piece_id].piece_name; // i do not expect NullPointerException
                        
            if(is_short_castle == 0 && is_long_castle ==0){//not castle move
                //check if to_square was cancelled
                if(to_square==Constants.NOTHING)
                    continue;//the square was cancelled
                
                if(piece_name != Constants.King){
                    //is pawn, rook, bishop, knight or queen 
                    if(engine_board_analyzer.isOwnKingAttacks(board.PIECES_BY_ID[piece_id].Square, to_square, node_turn, knight_squares, vert_up, vert_down,
                                                           horiz_left, horiz_right, top_left_diagonal, top_right_diagonal,
                                                           bottom_left_diagonal, bottom_right_diagonal))
                    {
                        //invalid move
                        continue;
                    }                        
                }else{
                    //is king
                    if(!isValidKingMove(board.PIECES_BY_ID[piece_id].Square, to_square, node_turn)){
                        //invalid king move - king will be in check
                        continue;
                    }
                }
                
            }
            
            //At this piont the move is valid
            
            int caputre_id= board.MovePiece(moves[i]);
            board.turn=next_turn;//switch turn
                       
            value = -alphaBeta(depth-1,-beta,-alpha, piece_id);
            
            board.turn=node_turn;//switch back turn
            board.UndoMove(moves[i], caputre_id);
            eval_move_index = i;
                    
            if(value > best){
                best = value;              
                if(depth==search_depth) {                             
                    best_move=new ChessMove(moves[i],node_turn,value,caputre_id,piece_name,-1);  
                }
            }else{
                if(depth==search_depth)
                   if(best_move == null)//get at least the first move in the move list                        
                      best_move = new ChessMove(moves[0],node_turn,value,caputre_id,piece_name,-1);  
            }
            
            if(best > alpha)
                alpha = best;
            if(best >= beta)
                return best;//replaced break statement
        }

                      
        
        //Set entry in transposition table
        if(eval_move_index != -1){
            ttHashTable.setEntry(hash_key, collision_filter, search_depth - depth,
                                moves[eval_move_index], best, true,
                                 false,//not required
                                 false);//not required
        }
        
        
        
        return best;
    }

    public int evaluateGamePosition(int piece_index){
        ++node_count;
        int cost = 0;
        
        int piece_evalute=evaluatePiecesOnBoardCost();        
        int threat_attack_cost = possibleThreatCost(piece_index);


        //cost= evalute;//TESTING!!! COMMENT HERE LATER
        cost= piece_evalute + threat_attack_cost; // REMOVE COMMENT LATER
//System.out.println(" evalute "+evalute+" threat_attack_cost "+threat_attack_cost+" cost "+cost);
        //cost = is_maximizer? -cost: cost;//come back        
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
            if(boardAnalyzer.canKingBeAttacked(nodeMove.piece_index))
                return -Constants.knight_cost;  //negative cost                
         * 
         */
        
        int cost=0;
        
        //check major piece capture
        if(engine_board_analyzer.canPieceBeAttacked(piece.ID, piece.Square)){
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
            if(engine_board_analyzer.canPieceBeAttacked(pce.ID, sq))//check attack at final square destination  sq_2
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
            if(engine_board_analyzer.canPieceBeAttacked(pce.ID, sq))//check attack at final square destination  sq_2
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
             
             int[] knight_capturable_squares=engine_board_analyzer.getKnightCapturableSquares_1 (to_square);

             int[] vert_up = engine_board_analyzer.getVerticalUpwardSquares_1 (to_square);
             int[] vert_down = engine_board_analyzer.getVerticalDownwardSquares_1 (to_square);
             int[] horiz_left = engine_board_analyzer.getHorizontalLeftwardSquares_1 (to_square);        
             int[] horiz_right = engine_board_analyzer.getHorizontalRightwardSquares_1 (to_square);

             int[] top_left_diagonal = engine_board_analyzer.getTopLeftDiagonalSquares_1 (to_square);             
             int[] top_right_diagonal = engine_board_analyzer.getTopRightDiagonalSquares_1 (to_square);
             int[] bottom_left_diagonal = engine_board_analyzer.getBottomLeftDiagonalSquares_1(to_square);               
             int[] bottom_right_diagonal = engine_board_analyzer.getBottomRightDiagonalSquares_1 (to_square);              


                 
             if(engine_board_analyzer.isOwnKingAttacks(square_loc,
                                           to_square, 
                                           node_turn,
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

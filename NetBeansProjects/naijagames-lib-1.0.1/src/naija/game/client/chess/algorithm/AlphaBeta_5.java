/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.algorithm;

import naija.game.client.chess.board.Move;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.BoardAnalyzer;
import naija.game.client.chess.board.ChessMove;
import naija.game.client.chess.board.EngineBoardAnalyzer;
import naija.game.client.chess.board.Piece;
import naija.game.client.chess.board.Constants;
import naija.game.client.Side;

/**
 *
 * @author Onyeka Alimele
 */
public class AlphaBeta_5 {


    Move best_move;
    Move[] legal_moves;//use for commentary by comparing move values
    private Board board;
    EngineBoardAnalyzer engine_board_analyzer;
    TransPositionTable ttHashTable=new TransPositionTable();
    //TransPositionTable_1 ttHashTable_1=new TransPositionTable_1();
    
    public AlphaBeta_5() {
    }

    public Move searchBestMove(Board _board, int search_depth) {
   
        legal_moves =null;//initialize
        best_move = null;//initialize
        node_count=0;    
        prune_count=0;
        System.out.println("INITIAL BOARD PRINT - "+_board);
        //Move best_move=null;
        Board internal_board=new Board(false);//empty board
        internal_board.CopyBoard(_board);//use a copy
        this.board=internal_board;
        engine_board_analyzer= new EngineBoardAnalyzer(this.board);        
        
        long value = search(true,// is maximizer.
                           Long.MIN_VALUE,//alpha value.
                           Long.MAX_VALUE,//beta value.            
                           -1, //depth : must first be initialize to -1.
                           search_depth,//max search depth.
                            -1);
        
       System.out.println("value "+value );
        System.out.println("nodes "+node_count );
        System.out.println("prune_count "+prune_count );
        
        return best_move;
    }
    
   //To be remove - used for testing
    public static void main (String args[]) {
        AlphaBeta_5 ab=new AlphaBeta_5();

        long time=System.nanoTime();        
        ab.board=new Board(true);
        ab.engine_board_analyzer= new EngineBoardAnalyzer(ab.board);
        long value=ab.search(true, Long.MIN_VALUE, Long.MAX_VALUE, -1, 8, -1);
        long elapse = System.nanoTime() - time;
        
        System.out.println("value "+value );
        System.out.println("eval count "+ab.eval_count );
        System.out.println("nodes "+ab.node_count );
        System.out.println("best_move "+ab.best_move);
        System.out.println("prune_count "+ab.prune_count );
        System.out.println("code time "+elapse/1000000000.0 );
    }
 
    int prune_count;    
    int node_count;    
    int eval_count;
    
    
    public int[] randomizeAtDepthZero(int piece_len){
        
        int[] indices=new int[piece_len];
        
        for(int i=0; i<piece_len; i++)
            indices[i]=i;
        
        int[] random_indices = new int[indices.length];
        
        for(int i=0; i<random_indices.length; i++)
        {
            random_indices[i]=-1;
        }
        
        
        for(int n=0; n<indices.length; n++){
            
            for(int i=0; i<indices.length; i++){
                double random=Math.random();
                int rand_index= (int)(random*indices.length);

                if(random_indices[rand_index]==-1){
                   random_indices[rand_index]=indices[i];
                }else{
                    boolean is_assign=false;
                    for(int k=rand_index; k>-1; k-- ){
                        if(random_indices[k]==-1){
                            random_indices[k]=indices[i];
                            is_assign=true;
                            break;                        
                        }
                    }

                    if(!is_assign){
                        for(int k=0; k<indices.length; k++ ){
                            if(random_indices[k]==-1){
                                random_indices[k]=indices[i];
                                break;                        
                            }
                        }                    
                    }
                }                            
            }
            
            //copy back an initialize for more shuffling
            for(int i=0; i<indices.length; i++){                
                indices[i]=-1;//avoid reference - important
                indices[i]=random_indices[i];
                random_indices[i]=-1;//avoid reference - important
            }
            
        }
        
        
        return indices;
    }        
    
    private Move[] addToMoves(Move[]legal_moves, Move m){
        Move [] mv=new Move[legal_moves.length + 1];
        
        mv[mv.length-1]=m;
        
        for(int i=legal_moves.length-1; i>-1; i--)//check for correctness later - come back
            mv[i]=legal_moves[i];

        legal_moves=new Move[mv.length];
        
        for(int i=mv.length-1; i>-1; i--)
            legal_moves[i]=mv[i];        
        
        return legal_moves;
    }
    
    private int search(boolean is_maximizer,
                        long alpha,
                        long beta,             
                        int n_depth, 
                        int max_depth,
                        int piece_index){        

        n_depth++; // must be initialize to -1. Take note

        int value = is_maximizer? -Constants.INFINITY : Constants.INFINITY;//come back        
        int next_turn = board.turn==Side.white? Side.black : Side.white;        
        int node_turn=board.turn;
        
        
        if(n_depth < max_depth){
            
            Piece[] pieces=board.getAllPieces();
            int[] valid_square=new int[0];
            int from_square = -1;
            int to_square = -1;
            int piece_start_index;
            int piece_len;
            int[] random_indices = null;
            legal_moves = new Move[0];
      
            int king_square_loc = node_turn==Side.white ? 
                                   board.getWhiteKing().Square:
                                   board.getBlackKing().Square;

            //the various possible piece squares will be set below here for purpose of optimization            
            int[] knight_squares=engine_board_analyzer.getKnightCapturableSquares_1 (king_square_loc);

            int[] vert_up = engine_board_analyzer.getVerticalUpwardSquares_1 (king_square_loc);
            int[] vert_down = engine_board_analyzer.getVerticalDownwardSquares_1 (king_square_loc);
            int[] horiz_left = engine_board_analyzer.getHorizontalLeftwardSquares_1 (king_square_loc);        
            int[] horiz_right = engine_board_analyzer.getHorizontalRightwardSquares_1 (king_square_loc);

            int[] top_right_diagonal = engine_board_analyzer.getTopRightDiagonalSquares_1 (king_square_loc);
            int[] top_left_diagonal = engine_board_analyzer.getTopLeftDiagonalSquares_1 (king_square_loc);
            int[] bottom_right_diagonal = engine_board_analyzer.getBottomRightDiagonalSquares_1 (king_square_loc);        
            int[] bottom_left_diagonal = engine_board_analyzer.getBottomLeftDiagonalSquares_1( king_square_loc);                            
            
            if(n_depth==0){
                //REMIND : CHECK ENGINE EN PASSANT OPPORTUNITY
            }
            
            if(n_depth==0){
                random_indices=randomizeAtDepthZero(pieces.length);   
            }      
                        
            for(int i=0; i<32; i++){//Piece arrangement in the piece array may be zigzag because of FEN                               
                                            
                int p_index = n_depth != 0 ? i : random_indices[i];//next piece                
                                
                if(pieces[p_index].Me() != board.turn)//Piece arrange in the piece array may be zigzag because of FEN                
                    continue;
                
                if(pieces[p_index].Square == Constants.NOTHING)
                    continue;//has been captured
                                
                //valid_square = getPieceValidSquare(PIECES_BY_ID[p_index]);               
                
                switch(pieces[p_index].piece_name){
                    case Constants.Pawn:valid_square=engine_board_analyzer.getUnresolvedPawnMoveSquares(pieces[p_index].Square, node_turn);break;
                    case Constants.Rook:valid_square=engine_board_analyzer.getUnresolvedRookMoveSquares(pieces[p_index].Square, node_turn);break;
                    case Constants.Bishop:valid_square=engine_board_analyzer.getUnresolvedBishopMoveSquares(pieces[p_index].Square, node_turn);break;
                    case Constants.Knight:valid_square=engine_board_analyzer.getUnresolvedKnightMoveSquares(pieces[p_index].Square, node_turn);break;
                    case Constants.Queen:valid_square=engine_board_analyzer.getUnresolvedQueenMoveSquares(pieces[p_index].Square, node_turn);break;
                    case Constants.King:valid_square=engine_board_analyzer.getUnresolvedKingMoveSquares(pieces[p_index].Square, node_turn);break;
                }                
                
                int promotion_piece_rating=0;
                
                boolean is_check_left_enpassant=true;
                boolean is_check_right_enpassant=false;
                boolean is_enpassant_done=false;                
                
                for(int square=0; square < valid_square.length; square++){    

                    if(valid_square[square]==Constants.NOTHING)//unresolve pawn and knight can return negative
                        continue;            
                                   
                    from_square=pieces[p_index].Square;                    
                    to_square=valid_square[square];                              
                    
                    int enpassant_capture_square = Constants.NOTHING;
                    
                    if(!is_enpassant_done){
                        if(is_check_left_enpassant){
                            enpassant_capture_square = LHS_EnpassantCapture(pieces[p_index]);
                            is_check_left_enpassant=false;
                            if(enpassant_capture_square == Constants.NOTHING)
                                is_check_right_enpassant=true;
                        }else{
                            is_check_right_enpassant=true;
                        }

                        if(is_check_right_enpassant){
                            enpassant_capture_square =  RHS_EnpassantCapture(pieces[p_index]);
                            is_enpassant_done=true;
                        }
                    }
                    

                    boolean is_short_castle = isShortCastle(pieces[p_index]);
                    boolean is_long_castle = isLongCastle(pieces[p_index]);
                    promotion_piece_rating = PawnPromotion(pieces[p_index],
                                                           valid_square[square],
                                                           promotion_piece_rating,
                                                           n_depth);//come back - PLEASE BE CAREFUL*
                                                 
                   

               
                    if(!is_short_castle  && !is_long_castle ){//not castle move
                        //check if to_square was cancelled
                        if(to_square==Constants.NOTHING)
                            continue;//the square was cancelled

                        if(pieces[p_index].piece_name != Constants.King){
                            //is pawn, rook, bishop, knight or queen 
                            if(engine_board_analyzer.isOwnKingAttacks(pieces[p_index].Square, to_square, node_turn, knight_squares, vert_up, vert_down,
                                                                   horiz_left, horiz_right, top_left_diagonal, top_right_diagonal,
                                                                   bottom_left_diagonal, bottom_right_diagonal))
                            {
                                //invalid move
                                continue;
                            } 
                            
                            if(enpassant_capture_square != Constants.NOTHING)//en passant
                                square--;                            

                            if(promotion_piece_rating < Constants.QueenPromotion)//if less than queen promotion.
                                square--;//hold on so as to try other promotion in the search.                            
                            
                        }else{
                            //is king
                            if(!isValidKingMove(engine_board_analyzer, pieces[p_index].Square, to_square, node_turn)){
                                //invalid king move - king will be in check
                                continue;
                            }

                        }
                    }else if(is_short_castle){//is castle move
                        //TODO:

                        //pause the loop count ie square--; try it!
                        from_square=pieces[p_index].Square;
                        square--; //uncomment after correctness confirmation
                    }else if(is_long_castle){//is castle move
                        //TODO:

                        //pause the loop count ie square--; try it!
                        from_square=pieces[p_index].Square;
                        square--; //uncomment after correctness confirmation
                    }
                                                            
                    
                    //Move the piece
                    int capture_id = board.MovePiece(pieces[p_index].ID, from_square, to_square,
                                                   enpassant_capture_square, is_short_castle, is_long_castle, promotion_piece_rating);

                    //System.out.println("depth "+n_depth+"-MOVE[ id "+PIECES_BY_ID[p_index].ID+"-sq "+from_square+"->sq "+to_square+"] - BOARD PRINT - "+board);
                    
                    node_count++;
                    int pre_value=value;
                    
                    board.turn = next_turn;//assign board turn used by the child node
                    
                    value = search(!is_maximizer,//switch
                                    alpha,
                                    beta,                      
                                    n_depth, 
                                    max_depth,
                                    p_index);

                    board.turn = node_turn;//change back to this node board turn.
                    
                    board.UndoMove( pieces[p_index].ID, capture_id,  from_square,  to_square, 
                                    enpassant_capture_square,  is_short_castle,  is_long_castle, promotion_piece_rating);

                    //System.out.println("depth "+n_depth+"-UNDO[ id "+PIECES_BY_ID[p_index].ID+"-sq "+to_square+">-sq "+from_square+"] - BOARD PRINT - "+board);
                    
                    if(is_maximizer){
                        
                        if(n_depth==0){                           
                           Move m = new Move(node_turn, value, pieces[p_index].piece_name,
                                                     p_index, from_square,to_square,capture_id,
                                                     promotion_piece_rating, enpassant_capture_square,
                                                     is_short_castle,is_long_castle);    
                           
                           legal_moves = addToMoves(legal_moves, m);//used for chess commentary by comparing moves value
    
                           if(best_move == null)//get at least the first move in the move list
                               best_move = legal_moves[0];                           
                           
                           if(value > pre_value){
                               best_move =  m;
                           }                           
                        }
                        
                        if(value >= beta){
                            //value = beta;//no need for assign to beta, so as to allow for chess commentary
                            prune_count++;
                            return value;//prune
                        }

                        if(value < pre_value){                            
                            value = pre_value;//bigger value
                            alpha = value;
                        }

                    }else{//if minimizer
                        if(value <= alpha){
                            //value = alpha;//no need for assign to alpha, so as to allow for chess commentation
                            prune_count++;
                            return value;//prune
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
            }
                                
        }else if(n_depth == max_depth){                            
            
            value = evaluateGamePosition(piece_index, is_maximizer);//uncomment later               
            eval_count++;
            //value = this.testEvaluate1();//TESTING!!              
            //value = this.testEvaluate2();//TESTING!! 
            /*READ!!!!!! - THE MORE THE VARIANCE OF THE EVALUATION THE MORE THE PRUNING AND THE FASTER THE ENGINE.
             * TAKE NOTE ABEG OOOOOOO!!!!!!!!!
             */
        }
                
        
        if(n_depth==0){
            System.out.println("FINAL BOARD PRINT - "+board);
            //REMIND : INITIALIZE ENGINE EN PASSANT OPPORTUNITY
        }
        
        
        return value;
    }    

    
    public int evaluateGamePosition(int piece_index, boolean is_maximizer){
        
        int cost = 0;
        int turn_to_eval=board.getAllPieces()[piece_index].Me();//the actually turn to evalute
        
        int piece_evalute=evaluatePiecesOnBoardCost();        
        int threat_attack_cost = possibleThreatCost(piece_index);

        //cost= evalute;//TESTING!!! COMMENT HERE LATER
        cost= piece_evalute + threat_attack_cost; // REMOVE COMMENT LATER
//System.out.println("is_maximizer "+is_maximizer+" evalute "+evalute+" threat_attack_cost "+threat_attack_cost+" cost "+cost);
        cost = is_maximizer? cost: -cost;//come back        
//System.out.println("negated--is_maximizer "+is_maximizer+" evalute "+evalute+" threat_attack_cost "+threat_attack_cost+" cost "+cost);
        //if(cost==0)
          //  cost=(int)(Math.random()*(Constants.pawn_cost-5));
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
    
    private Move[] testMove(){//TESTING !!!
        
        test_dp++;
        
        Move move1=new Move(1,0,'N',2,4,3,3,4,-1,false,false);


        Move move2=new Move(1,0,'N',2,4,4,3,4,-1,false,false);
      
        Move[] legal_moves;
        
        if(test_dp == 1){
            legal_moves = new Move[3];
            legal_moves[0]=move1;
            legal_moves[1]=move1;
            legal_moves[2]=move1;
        }else{
            legal_moves = new Move[2];
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

    private boolean isValidKingMove(EngineBoardAnalyzer analyzer,int square_loc, int to_square, int node_turn) {
             
             int[] knight_capturable_squares=analyzer.getKnightCapturableSquares_1 (to_square);

             int[] vert_up = analyzer.getVerticalUpwardSquares_1 (to_square);
             int[] vert_down = analyzer.getVerticalDownwardSquares_1 (to_square);
             int[] horiz_left = analyzer.getHorizontalLeftwardSquares_1 (to_square);        
             int[] horiz_right = analyzer.getHorizontalRightwardSquares_1 (to_square);

             int[] top_left_diagonal = analyzer.getTopLeftDiagonalSquares_1 (to_square);             
             int[] top_right_diagonal = analyzer.getTopRightDiagonalSquares_1 (to_square);
             int[] bottom_left_diagonal = analyzer.getBottomLeftDiagonalSquares_1(to_square);   
             int[] bottom_right_diagonal = analyzer.getBottomRightDiagonalSquares_1 (to_square);        
     


                 
             if(analyzer.isOwnKingAttacks(square_loc,
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


    private int getCaptureType(int to_square, int en_passant_square) {                
        
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

        
        return Constants.NONE_CAPTURE;
    }    
}

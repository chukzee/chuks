/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.board;

import naija.game.client.Side;
import java.text.NumberFormat;
import java.util.Random;

/**
 *
 * @author Onyeka Alimele
 */
public class Board {
    
    public Piece[] PIECES_BY_ID=new Piece[0];
    public Piece[] black_pieces=new Piece[0];
    public Piece[] white_pieces=new Piece[0];
    public Piece[] side_pieces=new Piece[0];    
    public int[] Squares=new int[64];

    private int total_squares = 64;
    private int NOTHING = Constants.NOTHING;
    int white_king_index=NOTHING;
    int black_king_index=NOTHING;
    int white_rook_on_king_side_index=NOTHING;
    int white_rook_on_queen_side_index=NOTHING;
    int black_rook_on_king_side_index=NOTHING;
    int black_rook_on_queen_side_index=NOTHING;
    
    public final int WHITE_KING_SHORT_CASTLE_SQUARE=6;//same for Chess960
    public final int WHITE_ROOK_SHORT_CASTLE_SQUARE=5;//same for chess960 
    
    public final int WHITE_KING_LONG_CASTLE_SQUARE=2;//same for Chess960
    public final int WHITE_ROOK_LONG_CASTLE_SQUARE=3;//same for Chess960
    
    public final int BLACK_KING_SHORT_CASTLE_SQUARE=62;//same for Chess960
    public final int BLACK_ROOK_SHORT_CASTLE_SQUARE=61;//same for Chess960
        
    public final int BLACK_KING_LONG_CASTLE_SQUARE=58;//same for Chess960
    public final int BLACK_ROOK_LONG_CASTLE_SQUARE=59;//same for Chess960
    
    //no need for queen rook or knight index since pawn can be promoted to them which could make things complicated
    //int white_queen_index=NOTHING;
    //int black_queen_index=NOTHING;
    public int turn = -1;//
    public int WHITE_king_ORIGIN_square=4;//by default for castle - come back for Chess960 variant
    public int BLACK_king_ORIGIN_square=60;//by default for castle - come back for Chess960 variant    
    public int WHITE_rook_ORIGIN_square_on_KING_side = 7;//by default for castle - come back for Chess960 variant
    public int BLACK_rook_ORIGIN_square_on_KING_side = 63;//by default for castle - come back for Chess960 variant
    public int WHITE_rook_ORIGIN_square_on_QUEEN_side = 0;//by default for castle - come back for Chess960 variant
    public int BLACK_rook_ORIGIN_square_on_QUEEN_side = 56;//by default for castle - come back for Chess960 variant

    public int hashKey = 0;
    private String strFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";//traditionaly initial position
    public final int NORMAL_CHESS = 100;
    public final int CHESS960 = 200;
    private int chessVariant = NORMAL_CHESS;//by default
    public String all_moves="";
    private String strWhiteShortCastle="K";//used for FEN
    private String strWhiteLongCastle="Q";//used for FEN
    private String strBlackShortCastle="k";//used for FEN
    private String strBlackLongCastle="q";//used for FEN
    public boolean canWhiteShortCastle = true;
    public boolean canWhiteLongCastle = true;
    public boolean canBlackShortCastle = true;
    public boolean canBlackLongCastle = true;
    private int halfMoveClock = 0;//This is the number of halfmoves since the last capture or pawn advance. This is used to determine if a draw can be claimed under the fifty-move rule.
    private int fullMoveNumber = 1; //The number of the full move. It starts at 1, and is incremented after Black's move.
    private String EnPassant_target_square_label;
    private int EnPassant_target_square = NOTHING;
    public int collisionFilter;
    public int NextSquarePath;
    public final int VERT_UP = 1;
    public final int VERT_DOWN = 2;
    public final int HORIZ_RIGHT = 3;
    public final int HORIZ_LEFT = 4;
    public final int TOP_DIAGONAL_RIGHT = 5;
    public final int TOP_DIAGONAL_LEFT = 6;
    public final int BOTTOM_DIAGONAL_RIGHT = 7;
    public final int BOTTOM_DIAGONAL_LEFT = 8;
    public final int KNIGHT_TOP_RIGHT_CLOSER = 9;
    public final int KNIGHT_TOP_RIGHT_FURTHER = 10;
    public final int KNIGHT_TOP_LEFT_CLOSER = 11;
    public final int KNIGHT_TOP_LEFT_FURTHER = 12;
    public final int KNIGHT_BOTTOM_RIGHT_CLOSER = 13;
    public final int KNIGHT_BOTTOM_RIGHT_FURTHER = 14;
    public final int KNIGHT_BOTTOM_LEFT_CLOSER = 15;
    public final int KNIGHT_BOTTOM_LEFT_FURTHER = 16;    
    public final int PAWN_DOUBLE_VERT_UP = 17;
    public final int PAWN_DOUBLE_VERT_DOWN = 18;
    public int PrevPathSquare = NOTHING;
    public int side_piece_index = 0;
    public int BitMove;
    public int KillerMove;
    private int NextAttackPath;
    private boolean is_diagonal_path;
    private boolean is_knigh_square;
    private boolean has_regular_path;
    public int PromotionRating;
    public boolean isDoneKillerMove;
    public boolean isNeedNextPiece;
    public final int EN_LHS = 11;
    public final int EN_RHS = 12;
    public int checkEnPassant;
    private int []NextVertUp= new int[64];
    private int []NextVertDown= new int[64];
    private int []NextHorizRight= new int[64];
    private int []NextHorizLeft= new int[64];
    private int []NextTopDiagonalRight= new int[64];
    private int []NextTopDiagonalLeft= new int[64];
    private int []NextBottomDiagonalRight= new int[64];
    private int []NextBottomDiagonalLeft= new int[64];
    private int []KnightTopRightCloser= new int[64];    
    private int []KnightTopRightFurther= new int[64];
    private int []KnightTopLeftCloser= new int[64];
    private int []KnightTopLeftFurther= new int[64];
    private int []KnightBottomRightCloser= new int[64];
    private int []KnightBottomRightFurther= new int[64];
    private int []KnightBottomLeftCloser= new int[64];    
    private int []KnightBottomLeftFurther= new int[64];
    private int PrevAttackPathSquare = NOTHING;
    
    
    /**This constructor sets up and configure the chess board based on the provided 
     * FEN string passed as an argument. The setup and configuration is based on the 
     * traditional rules of Chess
     * 
     * @param fen_string 
     */
    public Board(String fen_string){
        intializeFEN(fen_string);        
        initializeSqArr();
    }

    /**This constructor sets up and configure the chess board base on the provided
     * FEN string passed as an argument. The Chess variant passed as an argument 
     * determines the type of setup and configuration of the board.
     * 
     * @param fen_string
     * @param chess_variant 
     */
    public Board(String fen_string, int chess_variant){
        this.chessVariant=chess_variant;
        intializeFEN(fen_string);
        initializeSqArr();
    }
    
    /**This constructor is used for setting up initial chess board position
     * of both the traditional Chess and the Chess960 variant.
     * The Chess960 board is automatically set up and configured based on the 
     * rules of Chess960 variant if the CHESS960 parameter is passed to the 
     * constructor.
     * 
     * @param chess_variant 
     */
    public Board(int chess_variant){
        this.chessVariant=chess_variant;
        if(chess_variant == CHESS960){
            String chess960FEN = getChess960Board();
            intializeFEN(chess960FEN);
            initializeSqArr();
        }else{               
                            
            turn = Side.white;//white starts by default            
            defaultPieces();                                               
            configBoard();        
            initializeSqArr();
        }
    }
        
    
    /**creates an internal chess board which is either empty (no piece) or piece filled. 
     * It takes a boolean parameter. value of true means the board should be created 
     * with all piece available and arranged in default position while a value of false means
     * the board should be created without any piece object. You assign a value of false
     * when you may require a copy of another board in a particular game state.
     * @param pieces_filled 
     */

    public Board(boolean pieces_filled){
        
            if(pieces_filled){                
                turn = Side.white;//white starts by default
                defaultPieces();                
                configBoard();
                initializeSqArr();
            }
                     
    }

    /**This method return the FEN string representation Chess960 board initial position
     * 
     * @return 
     */
    private String getChess960Board(){
        int [] s={0,1,2,3,4,5,6,7};//first rank
        int [] w_sq={1,3,5,7};//white squares
        int [] b_sq={0,2,4,6};//black square
        String[] rank=new String[8];
        int k=-1;
        int r1=-1;
        int r2=-1;
        int b1=-1;
        int b2=-1;
        int q=-1;
        int n1=-1;
        int n2=-1;
        
        k=radSel(s, 1, 7);//select a square from 1 to 7 - Note: index 7 will never be returned by the design of the random method
        
        r1=radSel(s, 0, k);//select a square RHS of king
        r2=radSel(s, k+1, s.length);//select a square LHS of king - Note length 8 will never be returned - max will be 7        

        w_sq=rv(w_sq, k);//remove square collected by king
        w_sq=rv(w_sq, r1);//remove square collected by RHS rook
        w_sq=rv(w_sq, r2);//remove square collected by LHS rook
        
        b_sq=rv(b_sq, k);//remove square collected by king
        b_sq=rv(b_sq, r1);//remove square collected by RHS rook
        b_sq=rv(b_sq, r2);//remove square collected by LHS rook   
        
        b1=radSel(w_sq, 0, w_sq.length);//select a square from white color squares 
        b2=radSel(b_sq, 0, b_sq.length);//select a square from black color squares 
        
        s=rv(s, k);//remove square collected by king
        s=rv(s, r1);//remove square collected by RHS rook
        s=rv(s, r2);//remove square collected by LHS rook        
        s=rv(s, b1);//remove square collected by white bishop
        s=rv(s, b2);//remove square collected by black bishop
        
        q=radSel(s, 0, s.length);//select a square from the available squares
        
        s=rv(s, q);//remove square collected by queen
        
        n1=radSel(s, 0, s.length);//select a square from the available squares

        s=rv(s, n1);//remove square collected by Kninght_1
        
        n2=radSel(s, 0, s.length);//select a square from the available squares        
        
        rank[k]="K";        
        rank[r1]="R";        
        rank[r2]="R";        
        rank[b1]="B";        
        rank[b2]="B";        
        rank[q]="Q";        
        rank[n1]="N";        
        rank[n2]="N";        
            
        String fen_first_rank="";
        String fen_last_rank="";
        for(int i=0; i<8; i++){                                
            fen_first_rank +=rank[i];                                    
            fen_last_rank +=rank[i].toLowerCase();
        }
        
        String fen_string=fen_last_rank+"/pppppppp/8/8/8/8/PPPPPPPP/"+fen_first_rank+" w KQkq - 0 1";
        
        return fen_string;
    }


    int[] rv(int a[], int n){
        int cancelled=0;
        for(int i=0; i<a.length;i++){
            if(a[i] == n){
                cancelled++;
                a[i] = -1;//cancelled                
            }
        }
        
        int[] b=new int[a.length - cancelled];                
        int index = -1;
        for(int i=0; i<a.length; i++){
            if(a[i] != -1){
                index++;
                b[index] = a[i];
            }
        }
        
        return b;
    }


    //CAUTION: BE VERY, VERY CAREFUL ABOUT THIS METHOD IN c++, c# and javascript.
    //nextInt(t-f) method randomly returns a number between t (inclusive) ant f(exclusive).
    //NOTE the word 'inclusive' and 'exclusive' which means the returned random number may 
    //be t and above but can never be f. So make sure it works the same way in other languages
    //otherwise i have to re-code the method in the respective language to work the same way.
    int radSel(int a[], int f, int t){
        Random r=new Random();
        int rad_index=r.nextInt(t-f);//randomly select an index of the array        
        return a[rad_index + f];
    }
    
    /**This method trims out excessive space characters.
     * 
     * @param str
     * @return 
     */
    String trimSpace(String str){
        //equals("") replaced isEmpty() because of Android compatibility issues
        if(str.equals("") || str.equals(" "))
            return "";
        
        String[] split=str.split(" ");
        String res="";
        for(int i=0; i<split.length; i++){
            if(!split[i].equals("")){
                res += split[i] +" ";
            }
        }

        res=res.substring(0, res.length() -1);//remove the last character which is obviously space
        
        return res;
    }
    
    private void configBoard(){
                                
                //arrange the PIECES_BY_ID on the respective squares
                
                
                for(int sq=0; sq<Squares.length; sq++){
                    
                    Squares[sq] = NOTHING; //initialize
                    
                    for(int k=0; k<PIECES_BY_ID.length; k++){                        
                        if(PIECES_BY_ID[k].Square == sq){
                            Squares[sq] = PIECES_BY_ID[k].ID;
                            break;
                        }
                    }
                }        
                
                //find king index - important
                for(int i=PIECES_BY_ID.length-1;i>-1;i--){
                    if(PIECES_BY_ID[i].piece_name==Constants.King){                   
                        if(PIECES_BY_ID[i].isWhite()){                
                            white_king_index=i;                   
                        }else{                
                            black_king_index=i;                   
                        }               
                    }                      
                }

                //next find the rook index
                for(int i=PIECES_BY_ID.length-1;i>-1;i--){
                    
                    if(PIECES_BY_ID[i].piece_name==Constants.Rook){                   
                        if(PIECES_BY_ID[i].isWhite()){
                            
                            if(i > white_king_index)
                                white_rook_on_king_side_index=i;    
                            else
                                white_rook_on_queen_side_index=i;    
                                
                        }else{                
                            
                            if(i > black_king_index)
                                black_rook_on_king_side_index=i;    
                            else
                                black_rook_on_queen_side_index=i;    
                        }               
                    }                      
                    
                }
                      
                
                if(chessVariant == CHESS960){// COME BACK TO TEST FOR CORRECTNESS
                    
                    for(int i=0; i<32; i++){
                        if(PIECES_BY_ID[i].ID == white_king_index){
                            
                            WHITE_king_ORIGIN_square=PIECES_BY_ID[i].Square;                            
                        }else if(PIECES_BY_ID[i].ID == black_king_index){
                            
                            BLACK_king_ORIGIN_square=PIECES_BY_ID[i].Square;                            
                        }else if(PIECES_BY_ID[i].ID == white_rook_on_king_side_index){
                            
                            WHITE_rook_ORIGIN_square_on_KING_side=PIECES_BY_ID[i].Square;
                        }else if(PIECES_BY_ID[i].ID == black_rook_on_king_side_index){
                            
                            BLACK_rook_ORIGIN_square_on_KING_side=PIECES_BY_ID[i].Square;    
                        }else if(PIECES_BY_ID[i].ID == white_rook_on_queen_side_index){
                            
                            WHITE_rook_ORIGIN_square_on_QUEEN_side=PIECES_BY_ID[i].Square;    
                        }else if(PIECES_BY_ID[i].ID == black_rook_on_queen_side_index){
                            
                            BLACK_rook_ORIGIN_square_on_QUEEN_side=PIECES_BY_ID[i].Square;
                        }                    
                    }
                    
                }
                
                //split white and black PIECES_BY_ID
                int w_index=-1;
                int b_index=-1;
                white_pieces=new Piece[16];
                black_pieces=new Piece[16];
                
                for(int i=0; i<PIECES_BY_ID.length; i++){
                    if(PIECES_BY_ID[i].side==Side.white){                        
                        w_index++;
                        white_pieces[w_index]=PIECES_BY_ID[i];
                    }else{
                        b_index++;
                        black_pieces[b_index]=PIECES_BY_ID[i];
                    }
                }
    }

    public Board(Board board , int turn){                   
           _CopyBoard( board ,  turn);   
    }

    
    public void CopyBoard(Board board) {                
        _CopyBoard( board ,  board.turn);
    }
          
    
    public void CopyBoard(Board board , int turn) {                
        _CopyBoard( board ,  turn);
    }
       
    
    private void _CopyBoard(Board board , int turn) {
        
          Piece[] _pieces = board.getAllPieces();
          
          this.turn=turn;
          white_rook_on_king_side_index = board.white_rook_on_king_side_index; 
          white_rook_on_queen_side_index = board.white_rook_on_queen_side_index; 
          black_rook_on_king_side_index = board.black_rook_on_king_side_index; 
          black_rook_on_queen_side_index = board.black_rook_on_queen_side_index;     
          WHITE_king_ORIGIN_square = board.WHITE_king_ORIGIN_square; 
          BLACK_king_ORIGIN_square = board.BLACK_king_ORIGIN_square;
          WHITE_rook_ORIGIN_square_on_KING_side = board.WHITE_rook_ORIGIN_square_on_KING_side;
          BLACK_rook_ORIGIN_square_on_KING_side = board.BLACK_rook_ORIGIN_square_on_KING_side;
          WHITE_rook_ORIGIN_square_on_QUEEN_side = board.WHITE_rook_ORIGIN_square_on_QUEEN_side;
          BLACK_rook_ORIGIN_square_on_QUEEN_side = board.BLACK_rook_ORIGIN_square_on_QUEEN_side;
          hashKey = board.hashKey;
          collisionFilter = board.collisionFilter;
           
          this.white_king_index = board.white_king_index;//copy primitive
          this.black_king_index = board.black_king_index;//copy primitive
          Squares=board.Squares;
          strFEN = board.strFEN;
          chessVariant=board.chessVariant;
          all_moves=board.all_moves;
          strWhiteShortCastle=board.strWhiteShortCastle;
          strWhiteLongCastle=board.strWhiteLongCastle;
          strBlackShortCastle=board.strBlackShortCastle;
          strBlackLongCastle=board.strBlackLongCastle;
          canWhiteShortCastle=board.canWhiteShortCastle;
          canWhiteLongCastle=board.canWhiteLongCastle;
          canBlackShortCastle=board.canBlackShortCastle;
          canBlackLongCastle=board.canBlackLongCastle;          
          halfMoveClock =board.halfMoveClock;
          fullMoveNumber = board.fullMoveNumber;
          
         
          PIECES_BY_ID=new Piece[_pieces.length];
           //copy the piece arrangement - important!
           for(int i=PIECES_BY_ID.length -1; i>-1; i--){                                          
               //pieces[i]=_pieces[i];                 
               PIECES_BY_ID[i]=_pieces[i].getCopy();//avoid reference - copy object (piece)  
           }
           
    }    

    private void initializeSqArr(){
        
        for(int i=0; i < 64; i++){
            NextVertUp[i]  = NOTHING;
            NextVertDown[i]  = NOTHING;    
            NextHorizRight[i]  = NOTHING;
            NextHorizLeft[i]  = NOTHING;
            NextTopDiagonalRight[i]  = NOTHING;
            NextTopDiagonalLeft[i]  = NOTHING;
            NextBottomDiagonalRight[i]  = NOTHING;
            NextBottomDiagonalLeft[i]  = NOTHING;
            KnightTopRightCloser[i]  = NOTHING;    
            KnightTopRightFurther[i]  = NOTHING;
            KnightTopLeftCloser[i]  = NOTHING;    
            KnightTopLeftFurther[i]  = NOTHING;
            KnightBottomRightCloser[i]  = NOTHING;    
            KnightBottomRightFurther[i]  = NOTHING;
            KnightBottomLeftCloser[i]  = NOTHING;    
            KnightBottomLeftFurther[i]  = NOTHING;            
        }
        
        for(int i=0; i < 64; i++){
            boolean is_8th_rank=false;
            boolean is_1st_rank=false;
            boolean is_8th_file=false;
            boolean is_1st_file=false;
            boolean is_2nd_file=false;
            boolean is_2nd_rank=false;
            boolean is_7th_file=false;
            boolean is_7th_rank=false;            
            
            if(i <56)
               this.NextVertUp[i] = i+8;
            else
                is_8th_rank=true;   
            
            
            if(i > 7)
               this.NextVertDown[i] = i-8; 
            else
                is_1st_rank=true; 
            
            
            if(i%8 != 0)
                NextHorizLeft[i] = i -1;
            else
                is_1st_file=true;
                     
            
            if((i+1)%8 != 0)
                NextHorizRight[i] = i +1;
            else
                is_8th_file=true;
                                 
            if(!is_8th_rank && !is_8th_file)            
                NextTopDiagonalRight[i] = i+9;
            
            if(!is_8th_rank && !is_1st_file)            
                NextTopDiagonalLeft[i] = i+7; 
            
            if(!is_1st_rank && !is_8th_file)            
                NextBottomDiagonalRight[i] = i-7;
            
            if(!is_1st_rank && !is_1st_file)            
                NextBottomDiagonalLeft[i] = i-9;    
            
            if(i>7 && i<16)
                is_2nd_rank=true;
            if(i>47 && i<56)
                is_7th_rank=true;            
            
            if((i+7)%8 == 0)
                is_2nd_file=true;
            if((i+2)%8 == 0)
                is_7th_file=true;
            
            //----top
            if(!is_8th_rank && !is_7th_file && !is_8th_file)
                KnightTopRightFurther[i] = i+10;
            
            if(!is_8th_rank && !is_7th_rank && !is_8th_file)
                KnightTopRightCloser[i] = i+17;            
            
            if(!is_8th_rank && !is_2nd_file && !is_1st_file)
                KnightTopLeftFurther[i] = i+6;
            
            if(!is_8th_rank && !is_7th_rank && !is_1st_file)
                KnightTopLeftCloser[i] = i+15;                        
            
            //----bottom
            
            if(!is_1st_rank && !is_7th_file && !is_8th_file)
                KnightBottomRightFurther[i] = i - 6;
            
            if(!is_1st_rank && !is_2nd_rank && !is_8th_file)
                KnightBottomRightCloser[i] = i - 15;            
            
            if(!is_1st_rank && !is_2nd_file && !is_1st_file)
                KnightBottomLeftFurther[i] = i -10;
            
            if(!is_1st_rank && !is_2nd_rank && !is_1st_file)
                KnightBottomLeftCloser[i] = i - 17;                 
            
        }
    }
    
    private void intializeFEN(String fen_string){
        
        fen_string = trimSpace(fen_string);//trim out excessive space character
        
        strFEN = fen_string;
        
        String[] fen_split=fen_string.split(" ");
        String fen_board=fen_split[0];
        
        //set turn
        if(fen_split[1].equals("w"))
            turn=Side.white;
        else
            turn=Side.black;
        
        //set castle availability
        
        canWhiteShortCastle = canWhiteLongCastle = canBlackShortCastle = canBlackLongCastle = false; //initliaze all to false
        
        if(fen_split[2].indexOf("K")>-1){
            strWhiteShortCastle="K";
            canWhiteShortCastle=true;
        }
        
        if(fen_split[2].indexOf("Q")>-1){
            strWhiteLongCastle="Q";
            canWhiteLongCastle=true;
        }
        
        if(fen_split[2].indexOf("k")>-1){
            strBlackShortCastle="k";
            canBlackShortCastle=true;
        }
        
        if(fen_split[2].indexOf("q")>-1){
            strBlackLongCastle="q";
            canBlackLongCastle=true;
        }
        
        //set en passant target square                
        if(fen_split[3].equals("-")){
            EnPassant_target_square_label="";
            EnPassant_target_square=NOTHING;
        }
        else{
            EnPassant_target_square_label=fen_split[3];
            EnPassant_target_square = getSquareIndex(fen_split[3]);            
        }
        
        //set half move clock
        halfMoveClock = Integer.parseInt(fen_split[4]);     
        
        //set full move number
        fullMoveNumber = Integer.parseInt(fen_split[5]);     
        
        //setup the fen board.        
                
        defaultPieces();
        
        //first empty the piece squares
        for(int i=0; i < PIECES_BY_ID.length; i++)
            PIECES_BY_ID[i].Square= NOTHING;//initialize the squares
        
        //now change the piece square to the fen sqaures
        int fen_square = -1;
        int square_start = 64; //appling fen rule of piece arrangement - ie ranks are 8 to 1 and thier cotents are descrided from "a" to "h"
        String[] fen_ranks = fen_board.split("/");
        
        for(int i=0; i<fen_ranks.length; i++){

            String rank=fen_ranks[i];
            fen_square =square_start - 8*(i + 1) - 1;//appling fen rule of piece arrangement - ie ranks are 8 to 1 and thier cotents are descrided from "a" to "h"
            
            for(int k=0; k<rank.length(); k++){

                String str_num = rank.substring(k, k+1);//important
                char fen_piece_name = str_num.charAt(0);//important

                if(Character.isDigit(fen_piece_name)){                
                    int num = Integer.parseInt(str_num);
                    fen_square += num;                
                    continue;
                }else{
                    fen_square++;
                }

                int fen_side = Side.white;
                if(Character.isLowerCase(fen_piece_name))
                    fen_side=Side.black;

                //convert to Upper Case which is the default case by my piece object design
                fen_piece_name = Character.toUpperCase(fen_piece_name);

                if(fen_piece_name == 'P')//already upper case here.
                    fen_piece_name= Constants.Pawn;//since pawn is the only difference.

                //Now modifty the piece array to reflect the fen piece position
                boolean is_promotion_detect =true;
                for(int p=0; p <PIECES_BY_ID.length; p++){

                    Piece pce= PIECES_BY_ID[p];

                    if(pce.piece_name != fen_piece_name)
                        continue;

                    if(pce.side != fen_side)
                        continue;                

                    //At this piont it is same piece name and same side of FEN
                    if(fen_piece_name == 'K')//TESTING!!!
                        System.out.println();//TESTING!!!
                        
                    if(pce.Square == NOTHING){
                        pce.Square = fen_square;//change to fen square 
                        is_promotion_detect= false;
                        break;//leave
                    }                                     
                }


                if(is_promotion_detect){
                    //here the PIECES_BY_ID square could not be assign for reason of promotion.
                    for(int p=0; p <PIECES_BY_ID.length; p++){

                        Piece pce= PIECES_BY_ID[p];                           
                        if(pce.Square == NOTHING &&
                            pce.piece_name == Constants.Pawn){

                            pce.piece_name = fen_piece_name;//change pawn name to the higher piece name.
                            pce.isPromoted();//indicate that this piece was once pawn.
                            pce.Square = fen_square;//change to fen square.                         
                            break;//leave
                        }                                     
                    }                
                }


            }
    
        }
        
        //finally
        configBoard();
        
    }
    
    public String getFEN(){
        return strFEN;
    }
    
    String strFENRanks(int start, int end){
        
        int empty_square_count=0;
        String empty_squares="";
        String str_fen_rank="";
        String pce_name="";
        
        for(int i=start; i<end; i++){
            
            int pieceid=Squares[i];
            
            if(pieceid != NOTHING){
                switch(PIECES_BY_ID[pieceid].piece_name){
                    case Constants.King:pce_name="K";break;
                    case Constants.Queen:pce_name="Q";break;                    
                    case Constants.Bishop:pce_name="B";break;
                    case Constants.Rook:pce_name="R";break;
                    case Constants.Knight:pce_name="N";break;
                    case Constants.Pawn:pce_name="P";break;                    
                }

                if(PIECES_BY_ID[pieceid].isBlack())
                    pce_name = pce_name.toLowerCase();
                
                str_fen_rank += empty_squares  + pce_name;
                
                empty_square_count=0;
                empty_squares="";                
            }

            if(Squares[i]==NOTHING){
                empty_square_count++;
                empty_squares=empty_square_count+"";
            }            

        }
        
        if(empty_square_count > 0)
            str_fen_rank += empty_squares;
        
        return str_fen_rank;
    }
    
    public void updateFEN(String move_notation){
        
        
        String rank_seperator="/";
        String space = " ";
        String str_fen="";

        int start = 56;
        int end =64; 
        
        for(int i=0; i<8; i++){
            if(i == 7)
                rank_seperator="";
            
           str_fen += strFENRanks(start, end) + rank_seperator;
           
           start -= 8;           
           end -= 8;    
        }        
    
        //set next turn
        if(this.turn==Side.white){
            //black moves next
            str_fen += space + "b";
        }else{
            //white moves next
            str_fen += space + "w";
        }
        
        //set castle availability
        str_fen += space + strWhiteShortCastle + strWhiteLongCastle + strBlackShortCastle + strBlackLongCastle;
        
        //set en passant
        int to_square = getToSquare(move_notation);   
        int moved_id = to_square != NOTHING?
                                    Squares[to_square]://note in this case the moved piece can be got from the to_square
                                    NOTHING;
        
        int from_square = getFromSquare(move_notation);   
        int square_diff = to_square - from_square;
        int square_behind=NOTHING;
        String en_passant = "-";
        
        if(moved_id!=NOTHING){
            if(PIECES_BY_ID[moved_id].piece_name==Constants.Pawn)
            if(square_diff == 16){
                //white pawn
                square_behind = to_square - 8;
                en_passant = getSqareLable(square_behind);
            }else if(square_diff == -16){
                //black pawn
                square_behind = to_square + 8;
                en_passant = getSqareLable(square_behind);
            }
        }
        
        str_fen += space + en_passant;
        
        //set half move clock - ie This is the number of halfmoves since the last capture or pawn advance. 
        //This is used to determine if a draw can be claimed under the fifty-move rule.        
        str_fen += space + halfMoveClock;
        
        //set full move number: The number of the full move. It starts at 1, and is incremented after Black's move.       
        str_fen += space + fullMoveNumber;
        
        strFEN = str_fen;
    }


    public void computeBoardHash(){

        
        int result = 1;
        int filter = 1;

        for (Piece element : PIECES_BY_ID){
            result = (result << 7) - result + element.Square + element.ID + turn;
            filter = (filter << 1) - result + element.Square + element.ID + turn;
        }
        
        
        /*for (Piece element : PIECES_BY_ID){
            result = 47 * result + element.Square + element.ID + turn;
            filter = 37 * filter + element.Square + element.ID + turn;
        }
         * 
         */
        
                
        hashKey = result;        
        collisionFilter = filter;
    }  

    
    public Piece getWhiteKing(){
        return PIECES_BY_ID[white_king_index];
    }
    
    public Piece getBlackKing(){
        return PIECES_BY_ID[black_king_index];
    }    

    public Piece getWhiteRookOnQueenSide(){
        return PIECES_BY_ID[white_rook_on_queen_side_index];//by default - come back for chess960 variant later - hint : set index in board constructor
    }
    
    public Piece getBlackRookOnQueenSide(){
        return PIECES_BY_ID[black_rook_on_queen_side_index];//by default - come back for chess960 variant later - hint : set index in board constructor
    }    

    public Piece getWhiteRookOnKingSide(){
        return PIECES_BY_ID[white_rook_on_king_side_index];//by default - come back for chess960 variant later - hint : set index in board constructor
    }
    
    public Piece getBlackRookOnKingSide(){
        return PIECES_BY_ID[black_rook_on_king_side_index];//by default - come back for chess960 variant later - hint : set index in board constructor
    }    
    
    public int getKingOriginSquare(int side){
        return side==Side.white?WHITE_king_ORIGIN_square:BLACK_king_ORIGIN_square;
    }
    
    public int getRookOnKingSideOriginSquare(int side){
        return side==Side.white?WHITE_rook_ORIGIN_square_on_KING_side:BLACK_rook_ORIGIN_square_on_KING_side;
    }
    
    public int getRookOnQueenSideOriginSquare(int side){
        return side==Side.white?WHITE_rook_ORIGIN_square_on_QUEEN_side:BLACK_rook_ORIGIN_square_on_QUEEN_side;
    } 
    
    int columLabelToIndex(char column_label){
        if(column_label=='a')
            return 0;
        else if(column_label=='b')
            return 1;
        else if(column_label=='c')
            return 2;    
        else if(column_label=='d')
            return 3;     
        else if(column_label=='e')
            return 4;        
        else if(column_label=='f')
            return 5;
        else if(column_label=='g')
            return 6;        
        else if(column_label=='h')
            return 7;
        
        return -1;
    }

    int charDigit(char row_label){

        if(row_label=='0')
            return 0;        
        else if(row_label=='1')
            return 1;
        else if(row_label=='2')
            return 2;    
        else if(row_label=='3')
            return 3;     
        else if(row_label=='4')
            return 4;        
        else if(row_label=='5')
            return 5;
        else if(row_label=='6')
            return 6;        
        else if(row_label=='7')
            return 7;
        else if(row_label=='8')
            return 8;               
        else if(row_label=='9')
            return 9;        

        return -1;
    }
    
    int rowLabelToIndex(char row_label){

        if(row_label=='1')
            return 0;        
        else if(row_label=='2')
            return 1;
        else if(row_label=='3')
            return 2;    
        else if(row_label=='4')
            return 3;     
        else if(row_label=='5')
            return 4;        
        else if(row_label=='6')
            return 5;
        else if(row_label=='7')
            return 6;        
        else if(row_label=='8')
            return 7;
            
        return -1;
    }
    
    private int Square(String label){
        
        //COME BACK TO CHECK FOR CORRECTNESS
        
        if(label.length()==3)
            label=label.substring(1);
        
        //I am assumming the length is 2 at this point - come back for correctness test later
        
        char column_label=label.charAt(0);
        char row_label=label.charAt(1);
        
        int col_index = columLabelToIndex(column_label);                        
        int row_index = rowLabelToIndex(row_label);

    
        int square = (row_index)*8+col_index;            
        
        return square;
    }
        
    public void MoveByNotation(String move_notation){
        
        int enpassant_capture_square=NOTHING;//come back
        
        if(isEnpassant(move_notation)){
            int to_square = getToSquare(move_notation);            
            int from_square = getFromSquare(move_notation); 
            enpassant_capture_square=to_square > from_square?
                                     to_square - 8://white
                                     to_square + 8;//black
        }

                  
        //flag the control variable for en passant right as false for all pawns.
        //In the main move method the control variable will be set to true as appropriate.
        //This control variable will automatically remove the en passant right if the player
        //fails to play en passant.
        for(int i=0; i<PIECES_BY_ID.length; i++) 
            PIECES_BY_ID[i].PawnDoubleStepMove=false;


        //Check what castle needs to be disabled
        if(this.isShortCastle(move_notation)){
            if(turn==Side.white){
                this.getWhiteKing().isAlreadyCastle=true;//disable further castle
                this.getWhiteKing().setHasPreviouslyMoved(true);//disable further castle                                
                this.getWhiteRookOnKingSide().setHasPreviouslyMoved(true);//disable further castle                
                //white can no longer castle
                strWhiteShortCastle="";//used for FEN            
                strWhiteLongCastle="";//used for FEN  
                canWhiteShortCastle = false;
                canWhiteLongCastle = false;
            }else{
                this.getBlackKing().isAlreadyCastle=true;//disable further castle
                this.getBlackKing().setHasPreviouslyMoved(true);//disable further castle                                
                this.getBlackRookOnKingSide().setHasPreviouslyMoved(true);//disable further castle   
                //black can no longer castle
                strBlackShortCastle="";//used for FEN            
                strBlackLongCastle="";//used for FEN                            
                canBlackShortCastle = false;
                canBlackLongCastle = false;                
            }
            
        }else if(this.isLongCastle(move_notation)){
            if(turn==Side.white){
                this.getWhiteKing().isAlreadyCastle=true;//disable further castle
                this.getWhiteKing().setHasPreviouslyMoved(true);//disable further castle                                
                this.getWhiteRookOnQueenSide().setHasPreviouslyMoved(true);//disable further castle                                                
                //white can no longer castle
                strWhiteShortCastle="";//used for FEN            
                strWhiteLongCastle="";//used for FEN            
                canWhiteShortCastle = false;
                canWhiteLongCastle = false;
            }else{                
                this.getBlackKing().isAlreadyCastle=true;//disable further castle
                this.getBlackKing().setHasPreviouslyMoved(true);//disable further castle                                
                this.getBlackRookOnQueenSide().setHasPreviouslyMoved(true);//disable further castle                  
                //black can no longer castle
                strBlackShortCastle="";//used for FEN            
                strBlackLongCastle="";//used for FEN                                            
                canBlackShortCastle = false;
                canBlackLongCastle = false;                
            }
        }
                
        int piece_id=this.getAttackerPieceID(move_notation);
        if(piece_id != NOTHING){
        
            PIECES_BY_ID[piece_id].setHasPreviouslyMoved(true);//disable castle of this piece amongs others            
            
            if(PIECES_BY_ID[piece_id].isBlack())
                fullMoveNumber++;//used for FEN            
            
            if(PIECES_BY_ID[piece_id].ID == this.getWhiteKing().ID){
                //white can no longer castle                
                strWhiteShortCastle="";//used for FEN                            
                strWhiteLongCastle="";//used for FEN                 
                canWhiteShortCastle = false;
                canWhiteLongCastle = false;                
            }else if(PIECES_BY_ID[piece_id].ID == this.getBlackKing().ID){
                //black can no longer castle                
                strBlackShortCastle="";//used for FEN                            
                strBlackLongCastle="";//used for FEN                          
                canBlackShortCastle = false;
                canBlackLongCastle = false;                
            }else if(PIECES_BY_ID[piece_id].ID == this.getWhiteRookOnKingSide().ID){
                //white can no longer castle short               
                strWhiteShortCastle="";//used for FEN                            
                canWhiteShortCastle = false;
            }else if(PIECES_BY_ID[piece_id].ID == this.getBlackRookOnKingSide().ID){
                //black can no longer castle short               
                strBlackShortCastle="";//used for FEN                            
                canBlackShortCastle = false;
            }else if(PIECES_BY_ID[piece_id].ID == this.getWhiteRookOnQueenSide().ID){
                //white can no longer castle long                
                strWhiteLongCastle="";//used for FEN                          
                canWhiteLongCastle = false;                
            }else if(PIECES_BY_ID[piece_id].ID == this.getBlackRookOnQueenSide().ID){
                //black can no longer castle long               
                strBlackLongCastle="";//used for FEN                          
                canBlackLongCastle = false;                
            }
        }
    

        
        int promotion_piece_rating = NOTHING;
        
        if(isPawnPromotion(move_notation)){
            promotion_piece_rating = getPromotionPieceRating(move_notation);
        }
        
        int capture_id  = MovePiece(getAttackerPieceID(move_notation),
                           getFromSquare(move_notation), 
                           getToSquare(move_notation),
                           enpassant_capture_square, 
                           isShortCastle(move_notation), 
                           isLongCastle(move_notation),
                           promotion_piece_rating);
        
        //update half move clock
        if(piece_id !=NOTHING){
            if(PIECES_BY_ID[piece_id].piece_name==Constants.Pawn && capture_id == NOTHING){
                //is pawn advance
                this.halfMoveClock = 0;//used for FEN
            }else if(capture_id != NOTHING){
                //is capture
                this.halfMoveClock = 0;//used for FEN
            }else{
                this.halfMoveClock ++;//used for FEN
            }
        }else{//POSSIBLY LONG OR CASTLE MOVE.
            //By my current code design, castle move DOES NOT reveal piece id since it involves two PIECES_BY_ID move
            this.halfMoveClock ++;//used for FEN
        }
           
        all_moves +=move_notation+" ";        
        this.updateFEN(move_notation);        

        //switch turn
        turn=turn==Side.white?Side.black:Side.white;//come back
        
    }
    
    public int getFromSquare(String move_notation){
        if(isShortCastle(move_notation) || isLongCastle(move_notation))
            return NOTHING;
        
        String[] split=null;
        int len=move_notation.length();
        String str_notation=move_notation;
        
        boolean is_enpassant=isEnpassant(move_notation);
        
        if(is_enpassant)
            str_notation=move_notation.substring(0, len-4); //minus en passant suffix 'e.p.' 
        
        String part_1 = "";
        
        if(str_notation.indexOf('-')>-1){//e.g e2-e4        
            split=str_notation.split("-");            
            part_1=split[0];
        }else if(str_notation.indexOf('x')>-1){//e.g e2xe7
            split=str_notation.split("x");
            part_1=split[0];
        }else if(str_notation.length() == 4 && !is_enpassant){//e.g e2e4
            part_1=str_notation.substring(0, 2);//c++ ,c# or javascript may require different approach - be careful
        }else {
            return NOTHING;//come back
        }
                
        
        if(is_enpassant){//modify the from square part
            int last_index=split[1].length()-1;
            char c_to_row_label=split[1].charAt(last_index);// e.g '6' in 'd6' of 'exd6e.p.'
            int to_row_label = charDigit(c_to_row_label);            
            int from_row_index = to_row_label==6? 
                                    to_row_label - 1:
                                    to_row_label + 1;//previous row e.g '6' minus '1' in 'd6' of 'exd6e.p.'
            part_1 = part_1 + from_row_index;//e.g 'exd6e.p.' where 'e' now change to 'e5'. 
        }
                 
        return Square(part_1);   
    }
    
    private String removePromoStr(String move_notation){
        int len=move_notation.length();
        if(len>3)
            if(move_notation.indexOf('(')>-1 && move_notation.indexOf(')')>-1 ){
                //e.g dxe1(Q)
                return move_notation.substring(0, len-3);//remove last 3 letters - confirm use in c++, c# and javascript
            }else if(move_notation.indexOf('=')>-1){
                //e.g dxe1=Q
                return move_notation.substring(0, len-2);//remove last 2 letters - confirm use in c++, c# and javascript
            }else{
                //e.g dxe1Q
                return move_notation.substring(0, len-1);//remove last letter - confirm use in c++, c# and javascript
            }
        
        return "";//means error
    }
    
    public int getToSquare(String move_notation){
        if(isShortCastle(move_notation) || isLongCastle(move_notation))
            return NOTHING;        
        
        String[] split=null;
        int len=move_notation.length();
        String str_notation=move_notation;
        boolean is_enpassant = isEnpassant(move_notation);
        
        if(is_enpassant)
            str_notation=move_notation.substring(0, len-4); //minus en passant suffix 'e.p.' 

        
        if(isPawnPromotion(move_notation)){
            str_notation=removePromoStr(move_notation);
        }        
        
        String part_2 = "";
        
        if(str_notation.indexOf('-')>-1){        
            split=str_notation.split("-");            
            part_2=split[1];
        }else if(str_notation.indexOf('x')>-1){
            split=str_notation.split("x");
            part_2=split[1];
        }else if(str_notation.length() == 4 && !is_enpassant){//e.g e2e4
            part_2=str_notation.substring(2, 4);//c++ ,c# or javascript may require different approach - be careful
        }else{
            return NOTHING;//come back
        }
                
                 
        return Square(part_2);
    }
    
    public int getCapturedPieceID(String move_notation){
        if(isShortCastle(move_notation) || isLongCastle(move_notation))
            return NOTHING;            
        int to_square=NOTHING;
        //try{
             to_square = getToSquare(move_notation);
        //}catch(Exception ex){//TESTING
            
          //  System.err.println("ERROR -move_notation = "+move_notation);//TESTING
            //System.exit(-1);//TESTING
        //}
             
        if(isEnpassant(move_notation)){
            int from_square = getFromSquare(move_notation);
            int attacker_id= Squares[from_square];    
            if(attacker_id==NOTHING)
                return NOTHING;//should not be
            int attacker_turn=PIECES_BY_ID[attacker_id].side;
            int captured_square=attacker_turn==Side.white?
                                                to_square - 8:
                                                to_square + 8;
            
            return Squares[captured_square];
        }        
                
        
        int piece_id= Squares[to_square];
        
        return piece_id;
    }
    
    public int getAttackerPieceID(String move_notation){
        if(isShortCastle(move_notation) || isLongCastle(move_notation))
            return NOTHING;        

        int square = getFromSquare(move_notation);
        int piece_id= Squares[square];
        
        return piece_id;
    }
    
    public boolean isShortCastle(String move_notation){
        return move_notation.equals("0-0");
    }
    
    public boolean isLongCastle(String move_notation){
        return move_notation.equals("0-0-0");
    }
            
    public boolean isEnpassant(String move_notation){
        return move_notation.endsWith("e.p.");//not completed
    }
            
    public boolean isPawnPromotion(String move_notation){
        
        String str_part_2=move_notation;
        
        String seperator="";
        if(move_notation.indexOf('x')>-1){
            seperator="x";
        }else if(move_notation.indexOf('-')>-1){
            seperator="-";
        }
        
        //equals("") replaced isEmpty() because of Android compatibility issues
        if(!seperator.equals("")){//e.g dxe1=N  - NOTE I USED equals("") INSTEAD OF isEmpty() for compatibility with Android
            String[] split=move_notation.split(seperator);
            
            if(split.length==2){                
                char first_char=split[0].charAt(0);
                if(!isColumnLabel(first_char))
                    return false;
                
                str_part_2=split[1];                
            }else{
                return false;//error move format
            }
        }
    
        
        int length=str_part_2.length();
        if(length==3)
            if(isColumnLabel(str_part_2.charAt(0))&&
               isRowLabel(str_part_2.charAt(1))&&
               isPieceName(str_part_2.charAt(2)))
            {
                return true;//e.g e8Q or dxe1N
            }

        if(length==4)
            if(isColumnLabel(str_part_2.charAt(0))&&
               isRowLabel(str_part_2.charAt(1))&&
               str_part_2.charAt(2) == '='&&
               isPieceName(str_part_2.charAt(3)))
            {
                return true;//e.g e8=Q or dxe1=N
            } 
        

        if(length==5)
            if(isColumnLabel(str_part_2.charAt(0))&&
               isRowLabel(str_part_2.charAt(1))&&
               str_part_2.charAt(2) == '('&&
               isPieceName(str_part_2.charAt(3))&&
               str_part_2.charAt(4) == ')')
            {
                return true;//e.g e8(Q) or dxe1(N)
            }        
        
        return false;
    }
                
    public int getShortCastleKingToSquare(String move_notation ,int turn){
        if(!isShortCastle(move_notation))
            return NOTHING;                        
        return turn==Side.white?PIECES_BY_ID[white_king_index].Square + 2 :
                                PIECES_BY_ID[black_king_index].Square + 2;
    }
        
    public int getShortCastleRookToSquare(String move_notation, int turn){
        if(!isShortCastle(move_notation))
            return NOTHING;                        
        return turn==Side.white?PIECES_BY_ID[white_king_index].Square + 1 :
                                PIECES_BY_ID[black_king_index].Square + 1;
    }    
    
    public int getLongCastleKingToSquare(String move_notation, int turn){
        if(!isLongCastle(move_notation))
            return NOTHING;                        
        return turn==Side.white?PIECES_BY_ID[white_king_index].Square - 2 :
                                PIECES_BY_ID[black_king_index].Square - 2;
    }
        
    public int getLongCastleRookToSquare(String move_notation, int turn){
        if(!isLongCastle(move_notation))
            return NOTHING;                        
        return turn==Side.white?PIECES_BY_ID[white_king_index].Square - 1 :
                                PIECES_BY_ID[black_king_index].Square - 1;
    }

    public char getPromotionPieceName(String move_notation){
        
        if(!isPawnPromotion(move_notation))
            return (char) NOTHING;//no promotion piece
        
        String part_2=move_notation;        
         
        String seperator="";
        if(move_notation.indexOf('x')>-1){
            seperator="x";
        }else if(move_notation.indexOf('-')>-1){
            seperator="-";
        }
        
        String[] split=move_notation.split(seperator);
                
        if(split.length==2)
            part_2=split[1];
        
        int len=part_2.length();
        
        if(len==3)
            return part_2.charAt(2);
        else if(len==4)
            return part_2.charAt(3);
        else if(len==5)
            return part_2.charAt(3); //yes character at index 3 too.
        
        return (char) NOTHING;
    }
    
    int getPromotionPieceRating(String move_notation){
        
        char piece_name= getPromotionPieceName(move_notation);
        
        switch(piece_name){
            case Constants.Rook:return Constants.RookPromotion;                
            case Constants.Bishop:return Constants.BishopPromotion;            
            case Constants.Knight:return Constants.KnightPromotion;            
            case Constants.Queen:return Constants.QueenPromotion;
        }
        
        return NOTHING;
    }
    
    public int getCapturedID(int to_square,
                            int enpassant_capture_square, 
                            boolean is_short_castle,
                            boolean is_long_castle){
        
        if(!is_short_castle && !is_long_castle){
            return Squares[to_square];
        }else if(enpassant_capture_square != NOTHING){              
            return Squares[enpassant_capture_square];
        }
        
        return NOTHING;
    }        
    
    public int MovePiece(int move){        
            
            int from_square = move & Constants.FROM_SQUARE_MASK;                        
            
            int to_square =  (move >>> Constants.TO_SQUARE_SHIFT) 
                                        & Constants.TO_SQUARE_MASK;
            
            int enpassant_capture_square = ((move >>> Constants.ENPASSANT_CAPUTRE_SQURE_SHIFT)
                                                    & Constants.ENPASSANT_CAPUTRE_SQURE_MASK);
            
            int short_castle = ((move >>> Constants.IS_SHORT_CASTLE_SHIFT)
                                        & Constants.IS_SHORT_CASTLE_MASK);
            
            int long_castle =  ((move >>> Constants.IS_LONG_CASTLE_SHIFT)
                                        & Constants.IS_LONG_CASTLE_MASK);
            
            int promotion_piece_rating =  ((move >>> Constants.PROMOTION_RATING_SHIFT)
                                                   & Constants.PROMOTION_RATING_MASK);
            
            int piece_id = Squares[from_square];
      
            
            return MovePiece( piece_id,
                              from_square, 
                              to_square,
                              enpassant_capture_square,
                              short_castle == 1,//true if equal to 1
                              long_castle == 1 ,//true if equal to 1
                              promotion_piece_rating);
    }    

    public void MoveInternal(Move move){        
        MoveByNotation(move.notation());
    }
    

    public int MovePiece(Move move){        
        
        if(move.piece_index == -1)//yes -1, this is a special case. PLEASE DO NOT CHANGE THIS
            move.piece_index=Squares[move.from_square];
        
        return MovePiece(move.piece_index,
                            move.from_square,
                            move.to_square,
                            move.enpassant_capture_square,
                            move.is_short_castle,
                            move.is_long_castle, 
                            move.promotion_piece_rating);                      
    }
    
    public int MovePiece(int piece_id, int from_square, int to_square,
                            int enpassant_capture_square, boolean is_short_castle,
                            boolean is_long_castle, int promotion_piece_rating){
        
           int capture_id= NOTHING; 
           
           
           if(enpassant_capture_square == NOTHING && !is_short_castle && !is_long_castle){
               //first capture any piece in the to_square

               capture_id = Squares[to_square];
               if(capture_id != NOTHING){
                    PIECES_BY_ID[capture_id].Square = NOTHING;//effect the capture
               }
               
               //track pawn first move
               int square_len=from_square - to_square;               
               if(square_len == 16 || square_len == -16){//2 steps move   
                   PIECES_BY_ID[piece_id].PawnDoubleStepMove=true;
               }
               
               //next move the piece to the to_square               
               PIECES_BY_ID[piece_id].Square = to_square;//effect the move of the piece
               Squares[from_square]=NOTHING;//set empty
               Squares[to_square]=piece_id;//effect the move on the square
                              
               
           }else if(enpassant_capture_square != NOTHING){               
               
               capture_id = Squares[enpassant_capture_square];
               
               PIECES_BY_ID[capture_id].Square = NOTHING;//effect the capture
               Squares[enpassant_capture_square]=NOTHING;//effect the capture on the square
                    
               //next move the piece to the en passant destination square               
               int en_passant_to_square=PIECES_BY_ID[piece_id].isWhite()?
                                           enpassant_capture_square + 8:
                                           enpassant_capture_square - 8;

               
               //----ERROR TEST START---
               
               //int error_test_id=Squares[en_passant_to_square];
               //if(error_test_id!=NOTHING)
                 //  System.out.println(PIECES_BY_ID[error_test_id]);
               
               //----ERROR TEST END-----               
               
               PIECES_BY_ID[piece_id].Square = en_passant_to_square;//effect the move of the piece
               Squares[from_square]=NOTHING;//set empty
               Squares[en_passant_to_square]=piece_id;//effect the move on the square

               
           }else if(is_short_castle){
               
               //track the piece id (king id) if NOTHING
                                  
               if(turn ==Side.white){                    
                    int king_from_square = getWhiteKing().Square;
                    int rook_from_square = getWhiteRookOnKingSide().Square;    
                    //int king_to_square= king_from_square + 2;
                    //int rook_to_square= king_from_square + 1;                    
                    getWhiteKing().Square = WHITE_KING_SHORT_CASTLE_SQUARE;
                    getWhiteRookOnKingSide().Square = WHITE_ROOK_SHORT_CASTLE_SQUARE;                    
                    effectCastle(getWhiteKing(), getWhiteRookOnKingSide(), king_from_square, rook_from_square);                    
                    
               }
               else{                   
                    int king_from_square = getBlackKing().Square;
                    int rook_from_square = getBlackRookOnKingSide().Square;                    
                    //int king_to_square= king_from_square + 2;
                    //int rook_to_square= king_from_square + 1;                                        
                    getBlackKing().Square = BLACK_KING_SHORT_CASTLE_SQUARE;
                    getBlackRookOnKingSide().Square = BLACK_ROOK_SHORT_CASTLE_SQUARE;                    
                    effectCastle(getBlackKing(), getBlackRookOnKingSide(), king_from_square, rook_from_square);
                    
               }
               
           }else if(is_long_castle){
                                                                   
               if(turn ==Side.white){                    
                    int king_from_square = getWhiteKing().Square;
                    int rook_from_square = getWhiteRookOnQueenSide().Square;
                    //int king_to_square= king_from_square - 2;
                    //int rook_to_square= king_from_square - 1;                                                            
                    getWhiteKing().Square = WHITE_KING_LONG_CASTLE_SQUARE;
                    getWhiteRookOnQueenSide().Square = WHITE_ROOK_LONG_CASTLE_SQUARE;                    
                    effectCastle(getWhiteKing(), getWhiteRookOnQueenSide(), king_from_square, rook_from_square);
                                        
               }
               else{                                       
                    int king_from_square = getBlackKing().Square;
                    int rook_from_square = getBlackRookOnQueenSide().Square;                   
                    //int king_to_square= king_from_square - 2;
                    //int rook_to_square= king_from_square - 1;                                                            
                    getBlackKing().Square = BLACK_KING_LONG_CASTLE_SQUARE;
                    getBlackRookOnQueenSide().Square = BLACK_ROOK_LONG_CASTLE_SQUARE;  
                    effectCastle(getBlackKing(), getBlackRookOnQueenSide(), king_from_square, rook_from_square);
                                        
               }
               
           }
           
           //Now for promotion
           if(promotion_piece_rating == Constants.QueenPromotion){
               
               PIECES_BY_ID[piece_id].piece_name=Constants.Queen;
               PIECES_BY_ID[piece_id].setPromotionFlag(true);//for the purpose of knowing that this was once pawn

           }else if(promotion_piece_rating == Constants.BishopPromotion){
               
               PIECES_BY_ID[piece_id].piece_name=Constants.Bishop;
               PIECES_BY_ID[piece_id].setPromotionFlag(true);//for the purpose of knowin that this was once pawn

           }else if(promotion_piece_rating == Constants.RookPromotion){
               
               PIECES_BY_ID[piece_id].piece_name=Constants.Rook;
               PIECES_BY_ID[piece_id].setPromotionFlag(true);//for the purpose of knowin that this was once pawn

           }else if(promotion_piece_rating == Constants.KnightPromotion){
               
               PIECES_BY_ID[piece_id].piece_name=Constants.Knight;
               PIECES_BY_ID[piece_id].setPromotionFlag(true);//for the purpose of knowin that this was once pawn

           }
                                            
           
           return capture_id;
    }
    
    public void UndoMove (int move , int capture_id){
            
            int from_square = move & Constants.FROM_SQUARE_MASK;                        
            
            int to_square =  (move >>> Constants.TO_SQUARE_SHIFT) 
                                        & Constants.TO_SQUARE_MASK;
            
            int enpassant_capture_square = ((move >>> Constants.ENPASSANT_CAPUTRE_SQURE_SHIFT)
                                                    & Constants.ENPASSANT_CAPUTRE_SQURE_MASK);
            
            int short_castle = ((move >>> Constants.IS_SHORT_CASTLE_SHIFT)
                                        & Constants.IS_SHORT_CASTLE_MASK);
            
            int long_castle =  ((move >>> Constants.IS_LONG_CASTLE_SHIFT)
                                        & Constants.IS_LONG_CASTLE_MASK);
            
            int promotion_piece_rating =  ((move >>> Constants.PROMOTION_RATING_SHIFT)
                                                   & Constants.PROMOTION_RATING_MASK);
            
            int piece_id = NOTHING;
            if(to_square != NOTHING)
                piece_id = Squares[to_square];//yes the moved piece id can only be found in the to_square after the move 
                 
            if(enpassant_capture_square!=64){
                piece_id=NOTHING;//not yet known for now
            }
            
    
        UndoMove( piece_id, 
                 capture_id,  
                 from_square, 
                 to_square,
                 enpassant_capture_square,
                 short_castle == 1,//true if equal to 1
                 long_castle == 1,//true if equal to 1 
                 promotion_piece_rating);        
    }
    
    public void UndoMove (Move move){
        UndoMove( move.piece_index, move.capture_id,  move.from_square,  move.to_square,
                         move.enpassant_capture_square,  move.is_short_castle,
                         move.is_long_castle,  move.promotion_piece_rating);
    }
    
    public void UndoMove(int piece_id,int capture_id, int from_square, int to_square,
                        int enpassant_capture_square, boolean is_short_castle,
                        boolean is_long_castle, int promotion_piece_rating){

        
           if(enpassant_capture_square == NOTHING && !is_short_castle && !is_long_castle){
            

               PIECES_BY_ID[piece_id].PawnDoubleStepMove=false;
               
               //reverse the move
               PIECES_BY_ID[piece_id].Square = from_square;//effect the reversed moved of the played piece
               Squares[from_square] = piece_id;//effect the reversed move on the square

               //undo capture
               if(capture_id != NOTHING){
                   PIECES_BY_ID[capture_id].Square = to_square;//effect the undo-capture of the captured piece
                   Squares[to_square] = capture_id;//effect the reversed move of the captured piece

               }else{
                   Squares[to_square] = NOTHING;//the to_square become empty

               }
                                                               
           }else if(enpassant_capture_square != NOTHING){
               //NOT YET IMPLEMENTED - TECHNICAL! - BE CAREFUL 

               int en_passant_to_square=PIECES_BY_ID[capture_id].isWhite()?
                                           enpassant_capture_square - 8:
                                           enpassant_capture_square + 8;                     
               
               piece_id=Squares[en_passant_to_square];
               //reverse the move               
               PIECES_BY_ID[piece_id].Square = from_square;//effect the reversed moved of the played piece
               Squares[from_square] = piece_id;//effect the reversed move on the square
         
               //undo capture

               PIECES_BY_ID[capture_id].Square = enpassant_capture_square;//effect the undo-capture of the captured piece
               Squares[enpassant_capture_square] = capture_id;//effect the reversed move of the captured piece
                  
               Squares[en_passant_to_square] = NOTHING;//the en_passant_to_square becomes empty

           }else if(is_short_castle){
               //NOT YET IMPLEMENTED - TECHNICAL! - BE CAREFUL
               
               if(turn==Side.white){
                   this.reverseCastle(getWhiteKing(), getWhiteRookOnKingSide(), 
                                      WHITE_king_ORIGIN_square, WHITE_rook_ORIGIN_square_on_KING_side);
               }
               else{
                   this.reverseCastle(getBlackKing(), getBlackRookOnKingSide(), 
                                      BLACK_king_ORIGIN_square, BLACK_rook_ORIGIN_square_on_KING_side);
               }
               
           }else if(is_long_castle){
               //NOT YET IMPLEMENTED - TECHNICAL! - BE CAREFUL               
               
               if(turn==Side.white){
                   this.reverseCastle(getWhiteKing(), getWhiteRookOnQueenSide(), 
                                      WHITE_king_ORIGIN_square, WHITE_rook_ORIGIN_square_on_QUEEN_side);
               }
               else{
                   this.reverseCastle(getBlackKing(), getBlackRookOnQueenSide(), 
                                      BLACK_king_ORIGIN_square, BLACK_rook_ORIGIN_square_on_QUEEN_side);
               }
               
           }
           
           
           //Now for promotion
           if(promotion_piece_rating == Constants.QueenPromotion){                        
               PIECES_BY_ID[piece_id].piece_name=Constants.Pawn;//back to pawn
               
           }else if(promotion_piece_rating == Constants.BishopPromotion){                              
               PIECES_BY_ID[piece_id].piece_name=Constants.Pawn;//back to pawn

           }else if(promotion_piece_rating == Constants.RookPromotion){                              
               PIECES_BY_ID[piece_id].piece_name=Constants.Pawn;//back to pawn
           }else if(promotion_piece_rating == Constants.KnightPromotion){                              
               PIECES_BY_ID[piece_id].piece_name=Constants.Pawn;//back to pawn
           }
                      
                       

    }

    private void effectCastle(Piece king, Piece rook, int king_from_square, int rook_from_square){
                    
           Squares[king_from_square] = NOTHING;
           Squares[rook_from_square] = NOTHING;
           Squares[king.Square] = king.ID;
           Squares[rook.Square] = rook.ID;  
           
           // note zobrist key update has already been done - see the caller Method 'MovePiece(...)'                   
    }    

    private void reverseCastle(Piece king, Piece rook, int king_default_square, int rook_default_square){

           int king_from_square=king.Square;
           int rook_from_square=rook.Square;
           
           Squares[king.Square]=NOTHING; 
           Squares[rook.Square]=NOTHING;
           king.Square=king_default_square;
           rook.Square=rook_default_square;
           Squares[king_default_square]=king.ID;
           Squares[rook_default_square]=rook.ID;
           
    }    
        
    //NOT FULLY IMPLEMENTED.
    //TODO: do for pawn promotion , castling and en passant capture    
    public void MovePiece(int piece_id, int from_row, int from_col, int to_row, int to_col){
            
            int from_square = (from_row)*8+from_col; 
            int to_square = (to_row)*8+to_col; 
            
            MovePiece(piece_id, from_square,  to_square, NOTHING, false, false, NOTHING);
    }    
    
    private void defaultPieces(){

        //first row of rook , knight , bishop , queen and king
        PIECES_BY_ID = new Piece[32];
        PIECES_BY_ID[0]=new Piece(Constants.Rook, Side.white, 0, 0);
        PIECES_BY_ID[1]=new Piece(Constants.Knight, Side.white, 0, 1);
        PIECES_BY_ID[2]=new Piece(Constants.Bishop, Side.white, 0, 2);
        PIECES_BY_ID[3]=new Piece(Constants.Queen, Side.white, 0, 3);
        PIECES_BY_ID[4]=new Piece(Constants.King, Side.white, 0, 4);
        PIECES_BY_ID[5]=new Piece(Constants.Bishop, Side.white, 0, 5);
        PIECES_BY_ID[6]=new Piece(Constants.Knight, Side.white, 0, 6);
        PIECES_BY_ID[7]=new Piece(Constants.Rook, Side.white, 0, 7);
        
        
        //second row of pawns
        PIECES_BY_ID[8]=new Piece(Constants.Pawn, Side.white, 1, 0);
        PIECES_BY_ID[9]=new Piece(Constants.Pawn, Side.white, 1, 1);
        PIECES_BY_ID[10]=new Piece(Constants.Pawn, Side.white, 1, 2);
        PIECES_BY_ID[11]=new Piece(Constants.Pawn, Side.white, 1, 3);
        PIECES_BY_ID[12]=new Piece(Constants.Pawn, Side.white, 1, 4);
        PIECES_BY_ID[13]=new Piece(Constants.Pawn, Side.white, 1, 5);
        PIECES_BY_ID[14]=new Piece(Constants.Pawn, Side.white, 1, 6);
        PIECES_BY_ID[15]=new Piece(Constants.Pawn, Side.white, 1, 7);
        
        
        //seventh row of pawns
        PIECES_BY_ID[16]=new Piece(Constants.Pawn, Side.black, 6, 0);
        PIECES_BY_ID[17]=new Piece(Constants.Pawn, Side.black, 6, 1);
        PIECES_BY_ID[18]=new Piece(Constants.Pawn, Side.black, 6, 2);
        PIECES_BY_ID[19]=new Piece(Constants.Pawn, Side.black, 6, 3);
        PIECES_BY_ID[20]=new Piece(Constants.Pawn, Side.black, 6, 4);
        PIECES_BY_ID[21]=new Piece(Constants.Pawn, Side.black, 6, 5);
        PIECES_BY_ID[22]=new Piece(Constants.Pawn, Side.black, 6, 6);
        PIECES_BY_ID[23]=new Piece(Constants.Pawn, Side.black, 6, 7);        
        
        
        //eighth row of rook , knight , bishop , queen and king
        PIECES_BY_ID[24]=new Piece(Constants.Rook, Side.black, 7, 0);
        PIECES_BY_ID[25]=new Piece(Constants.Knight, Side.black, 7, 1);
        PIECES_BY_ID[26]=new Piece(Constants.Bishop, Side.black, 7, 2);
        PIECES_BY_ID[27]=new Piece(Constants.Queen, Side.black, 7, 3);
        PIECES_BY_ID[28]=new Piece(Constants.King, Side.black, 7, 4);
        PIECES_BY_ID[29]=new Piece(Constants.Bishop, Side.black, 7, 5);
        PIECES_BY_ID[30]=new Piece(Constants.Knight, Side.black, 7, 6);
        PIECES_BY_ID[31]=new Piece(Constants.Rook, Side.black, 7, 7);        
        
        for(int i=PIECES_BY_ID.length-1;i>-1;i--){                    
            PIECES_BY_ID[i].ID=i;                
        }         
    }

    public Piece[] getAllPieces(){
        return PIECES_BY_ID;
    }

    public Piece getPieceOnSquare(int square) {
        
        if(square==NOTHING)//if no square
            return null;
        
        int piece_id=Squares[square];
        
        if(piece_id != NOTHING)
            return PIECES_BY_ID[piece_id];
        else
            return null;
    }

    public Piece getPieceByID(int id) {
        if(  id!=NOTHING )
            return PIECES_BY_ID[id];
        else
            return null;
    }    
    
    //Note row_index and col_index are 0 to 7
    public Piece getPiece(int row_index, int col_index) {
        int square = (row_index)*8+col_index;         
        return PIECES_BY_ID[square];
    }
  
    boolean isOccupiedBySamePiece(int square, int piece_side) {
        
        int piece_id=Squares[square];
        
        if(piece_id==NOTHING)
            return false;
                
        if(PIECES_BY_ID[piece_id].side==piece_side)
            return true;
        else
            return false;
    }

    @Override
    public String toString(){
        
        String str_board="";

        for(int i=0; i<8;i++){
            String row="";
            for(int j=0; j<8; j++){
                int sq = i*8+j;
                
                String c="-";
                if(this.Squares[sq]!=NOTHING){
                    Piece pce = this.PIECES_BY_ID[this.Squares[sq]];
                    switch(pce.piece_name){
                        case Constants.King:c="k";break;
                        case Constants.Queen:c="q";break;
                        case Constants.Bishop:c="b";break;
                        case Constants.Knight:c="n";break;
                        case Constants.Rook:c="r";break;
                        case Constants.Pawn:c="p";break;
                    }
                    
                    if(pce.isWhite()){
                        c=c.toUpperCase();
                    }
                }
                
                row+= "  "+c;
            }
            
            str_board = row + "\n" + str_board;
        }
        
        str_board ="\n" + str_board;
        
        return str_board;
    }

    boolean isColumnLabel(char c){
        
        switch(c){
            case 'a':return true;
            case 'b':return true;
            case 'c':return true;
            case 'd':return true;
            case 'e':return true;
            case 'f':return true;
            case 'g':return true;                
            case 'h':return true;                
        }
        
        return false;
    }
    
    
    boolean isRowLabel(char c){
        
        switch(c){
            case '1':return true;
            case '2':return true;
            case '3':return true;
            case '4':return true;
            case '5':return true;
            case '6':return true;
            case '7':return true;                
            case '8':return true;                
        }
        
        return false;
    }

    
    
    boolean isPieceName(char c){
        
        switch(c){
            case 'K':return true;
            case 'R':return true;
            case 'N':return true;
            case 'Q':return true;
            case 'B':return true;
        }
        
        return false;
    }

    
    private String getSqareLable(int square) {
        
        // REMIND: BE CARE ABOUT THE NEXT LINE IN JAVASCRIPT - square/8 MUST NOT RETURN DECIMAL FRACTION e.g 1.324.         
        int row_label= square/8 + 1; //BE CAREFUL HERE IN JAVASCRIPT AND MAY BE C++.
        
        int col=square%8 + 1;
        
        String str_col="";
        switch(col){
            case 1:str_col="a";break;
            case 2:str_col="b";break;
            case 3:str_col="c";break;
            case 4:str_col="d";break;    
            case 5:str_col="e";break;    
            case 6:str_col="f";break;    
            case 7:str_col="g";break;
            case 8:str_col="h";break;    
        }
        
        String square_label = str_col + row_label;
        
        return square_label;
    }

    private int getSquareIndex(String square_lable) {
        
        if(square_lable.length() != 2)
            return NOTHING;
        
        char c_col_label=square_lable.charAt(0);
        char c_row_label=square_lable.charAt(1);
        
        int col_index = columLabelToIndex(c_col_label) ;     
        int row_index = rowLabelToIndex(c_row_label) ;    
        
        int square = (row_index)*8+col_index;
        
        return square;
    }

    public int NextMove(){        

        
        Piece pce = null;

        
        if(!isDoneKillerMove){//play the killer move first
            BitMove = KillerMove;
            isDoneKillerMove = true;
            return KillerMove;
        }        
                          
            
        pce = side_pieces[side_piece_index];           
        
        if(/*pce.side != turn ||*/ //not the turn.
           pce.Square == NOTHING){//is already captureed.  
            side_piece_index++;
            if(side_piece_index == 16)            
                return 0;//no more moves                  
            PrevPathSquare = side_pieces[side_piece_index].Square;            
            return NextMove();            
        }

        int to_square = 64;
        int from_square= pce.Square;
        int is_long_castle = 0; 
        int is_short_castle = 0;
        int enpassant_capture_square = NOTHING;
        
        
        if( pce.piece_name == Constants.King){
               is_long_castle = isLongCastle(pce) ? 1 : 0;//returns 1 if true else 0        
               is_short_castle = isShortCastle(pce) ? 1 : 0;//returns 1 if true else 0                        
              
               if(is_long_castle ==0 && is_short_castle == 0){
                    switch(NextSquarePath){                        
                        case 0:{
                            NextSquarePath=0;
                            to_square=NextVertUp[from_square];  
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                                                                             
                                    NextSquarePath++;break;//next square           
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                           
                                    NextSquarePath++;break;//next square
                                }
                        }
                        case 1:{
                            NextSquarePath=1;
                            to_square=NextVertDown[from_square];                       
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                                                                             
                                    NextSquarePath++;break;//next square           
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                           
                                    NextSquarePath++;break;//next square
                                }
                        }
                        case 2:{
                            NextSquarePath=2;
                            to_square=NextHorizRight[from_square];                       
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                                                                             
                                    NextSquarePath++;break;//next square           
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                           
                                    NextSquarePath++;break;//next square
                                }
                        }
                        case 3:{
                            NextSquarePath=3;
                            to_square=NextHorizLeft[from_square];                       
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                                                                             
                                    NextSquarePath++;break;//next square           
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                           
                                    NextSquarePath++;break;//next square
                                }
                        }                        
                        case 4:{
                            NextSquarePath=4;
                            to_square=NextTopDiagonalRight[from_square];                       
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                                                                             
                                    NextSquarePath++;break;//next square           
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                           
                                    NextSquarePath++;break;//next square
                                } 
                        }
                        case 5:{
                            NextSquarePath=5;
                            to_square=NextTopDiagonalLeft[from_square];                       
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                                                                             
                                    NextSquarePath++;break;//next square           
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                           
                                    NextSquarePath++;break;//next square
                                } 
                        }
                        case 6:{
                            NextSquarePath=6;
                            to_square=NextBottomDiagonalRight[from_square];                       
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                                                                             
                                    NextSquarePath++;break;//next square           
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                           
                                    NextSquarePath++;break;//next square
                                } 
                        }
                        case 7:{
                            NextSquarePath=7;
                            to_square=NextBottomDiagonalLeft[from_square];                       
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                                                                             
                                    NextSquarePath++;break;//next square           
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                           
                                    NextSquarePath++;break;//next square
                                } 
                        } 
                        default:{
                            NextSquarePath = 0;
                            checkEnPassant = EN_LHS;//initialize enpassant
                            side_piece_index++;
                            if(side_piece_index == 16)
                                return 0;//no more moves  
                            PrevPathSquare = side_pieces[side_piece_index].Square;
                            return NextMove();
                        } 
                    }
               }   
        }else if( pce.piece_name == Constants.Pawn){

                //if(checkEnPassant == EN_LHS)
                  //  enpassant_capture_square = LHS_EnpassantCapture(pce);  
                
                //if(enpassant_capture_square == NOTHING)
                  //  enpassant_capture_square = RHS_EnpassantCapture(pce);                
                
                if(enpassant_capture_square == NOTHING){
                    
                    //first determine if the pawn needs double step move.
                    
                    if(NextSquarePath == 0){//if the pawn has not moved yet - important. 
                        NextSquarePath = 1;                       
                        if(turn == Side.white){                       
                            if(from_square>7 && from_square<16)//white pawn on 2nd rank                                                                                        
                                NextSquarePath = 0;
                        }else{                        
                            if(from_square>47 && from_square<56)//black pawn on 7th rank                                                                                    
                                NextSquarePath = 0;                       
                        }                    
                    }
                    
                    switch(NextSquarePath){
                        
                        case 0:{    
                            //NOTE: NextSquarePath = 0 NOT REQUIRED HERE - ALREADY DETERMINED ABOVE
                            
                            to_square=turn==Side.white ? NextVertUp[from_square + 8] : NextVertDown[from_square - 8];
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square   
                                    NextSquarePath++;break;//next square           
                                }
                            //NOTE: pawn only captures diagonally
                        }
                        case 1:{
                            NextSquarePath=1;
                            to_square=turn==Side.white ? NextVertUp[from_square] : NextVertDown[from_square];                       
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square  
                                    NextSquarePath++;break;//next square           
                                } 
                            //NOTE: pawn only captures diagonally
                        }
                        case 2:{
                            NextSquarePath=2;
                            to_square=turn==Side.white?NextTopDiagonalRight[from_square]:NextBottomDiagonalRight[from_square];                       
                            
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                                          
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece.              
                                    NextSquarePath++;break;//diagonal capture - next square
                                } 
                        }
                        case 3:{
                            NextSquarePath=3;
                            to_square=turn==Side.white?NextTopDiagonalLeft[from_square]:NextBottomDiagonalLeft[from_square];                       
                            PrevPathSquare = to_square;//important in the case of pawn to determine if the pawn made a move
                            if(to_square!=NOTHING)
                                if(Squares[to_square] == NOTHING){//empty square                
                                }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece.       
                                    NextSquarePath++;break;//diagonal capture - next square
                                }
                        }                            
                        default:{
                            NextSquarePath = 0;
                            checkEnPassant = EN_LHS;//initialize enpassant
                            side_piece_index++;
                            if(side_piece_index == 16)            
                                return 0;//no more moves                  
                            PrevPathSquare = side_pieces[side_piece_index].Square;                                        
                            return NextMove();
                        }                            
                    }
                }
        }else if( pce.piece_name == Constants.Queen){
                switch(NextSquarePath){
                    case 0:{
                        NextSquarePath=0;
                        to_square=NextVertUp[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            } 
                        //At this point the path is either blocked by same piece or board edge             
                        PrevPathSquare = from_square;                        
                    }
                    case 1:{
                        NextSquarePath=1;
                        to_square=NextVertDown[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge             
                        PrevPathSquare = from_square;                        
                    }
                    case 2:{
                        NextSquarePath=2;
                        to_square=NextHorizRight[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;                        
                    }
                    case 3:{
                        NextSquarePath=3;
                        to_square=NextHorizLeft[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge             
                        PrevPathSquare = from_square;                        
                    }   
                    case 4:{
                        NextSquarePath=4;
                        to_square=NextTopDiagonalRight[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;                        
                    }
                    case 5:{
                        NextSquarePath=5;
                        to_square=NextTopDiagonalLeft[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;                        
                    }
                    case 6:{
                        NextSquarePath=6;
                        to_square=NextBottomDiagonalRight[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;                        
                    }
                    case 7:{
                        NextSquarePath=7;
                        to_square=NextBottomDiagonalLeft[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;                        
                    }   
                    default:{
                        NextSquarePath = 0;
                        checkEnPassant = EN_LHS;//initialize enpassant                        
                        side_piece_index++;                        
                        if(side_piece_index == 16)            
                            return 0;//no more moves                  
                        PrevPathSquare = side_pieces[side_piece_index].Square;                                    
                        return NextMove();                          
                    }
                }
        }else if( pce.piece_name == Constants.Bishop){
                switch(NextSquarePath){
                    
                    case 0:{
                        NextSquarePath=0;
                        to_square= NextTopDiagonalRight[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;
                    }
                    case 1:{
                        NextSquarePath=1;
                        to_square=NextTopDiagonalLeft[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;
                    }
                    case 2:{
                        NextSquarePath=2;
                        to_square=NextBottomDiagonalRight[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;
                    }
                    case 3:{
                        NextSquarePath=3;
                        to_square=NextBottomDiagonalLeft[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;
                    }
                    default:{
                        NextSquarePath = 0;
                        checkEnPassant = EN_LHS;//initialize enpassant
                        side_piece_index++;
                        if(side_piece_index == 16)            
                            return 0;//no more moves                  
                        PrevPathSquare = side_pieces[side_piece_index].Square;                                    
                        return NextMove();
                    }                        
                }
        }else if( pce.piece_name == Constants.Rook){
                switch(NextSquarePath){
                    case 0:{
                        NextSquarePath=0;
                        to_square=NextVertUp[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;
                    }
                    case 1:{
                        NextSquarePath=1;
                        to_square=NextVertDown[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;
                    }
                    case 2:{
                        NextSquarePath=2;
                        to_square=NextHorizRight[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;
                    }
                    case 3:{
                        NextSquarePath=3;
                        to_square=NextHorizLeft[PrevPathSquare];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square   
                                PrevPathSquare = to_square;
                                break;//continue on path           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//path blocked by opponent piece  
                                PrevPathSquare = from_square;
                                NextSquarePath++;break;//change path
                            }  
                        //At this point the path is either blocked by same piece or board edge 
                        PrevPathSquare = from_square;
                    }    
                    default:{                    
                        NextSquarePath = 0;
                        checkEnPassant = EN_LHS;//initialize enpassant                        
                        side_piece_index++;                        
                        if(side_piece_index == 16)            
                            return 0;//no more moves                  
                        PrevPathSquare = side_pieces[side_piece_index].Square;                                    
                        return NextMove();                        
                    }                        
                }
        }else if( pce.piece_name == Constants.Knight){
                switch(NextSquarePath){
                    case 0:{
                        NextSquarePath=0;
                        to_square=KnightTopRightCloser[from_square];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square                                                                                                         
                                NextSquarePath++;break;                                           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                                                       
                                NextSquarePath++;break;                                
                            }                       
                    }
                    case 1:{
                        NextSquarePath=1;
                        to_square=KnightTopRightFurther[from_square];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square                                                                                                         
                                NextSquarePath++;break;                                           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                                                       
                                NextSquarePath++;break;                                
                            }
                    }
                    case 2:{
                        NextSquarePath=2;
                        to_square=KnightTopLeftCloser[from_square];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square                                                                                                         
                                NextSquarePath++;break;                                           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                                                       
                                NextSquarePath++;break;                                
                            }
                    }
                    case 3:{
                        NextSquarePath=3;
                        to_square=KnightTopLeftFurther[from_square];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square                                                                                                         
                                NextSquarePath++;break;                                           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                                                       
                                NextSquarePath++;break;                                
                            }
                    }                        
                    case 4:{
                        NextSquarePath=4;
                        to_square=KnightBottomRightCloser[from_square];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square                                                                                                         
                                NextSquarePath++;break;                                           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                                                       
                                NextSquarePath++;break;                                
                            }
                    }
                    case 5:{
                        NextSquarePath=5;
                        to_square=KnightBottomRightFurther[from_square];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square                                                                                                         
                                NextSquarePath++;break;                                           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                                                       
                                NextSquarePath++;break;                                
                            }
                    }
                    case 6:{
                        NextSquarePath=6;
                        to_square=KnightBottomLeftCloser[from_square];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square                                                                                                         
                                NextSquarePath++;break;                                           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                                                       
                                NextSquarePath++;break;                                
                            }
                    }
                    case 7:{
                        NextSquarePath=7;
                        to_square=KnightBottomLeftFurther[from_square];                       
                        if(to_square!=NOTHING)
                            if(Squares[to_square] == NOTHING){//empty square                                                                                                         
                                NextSquarePath++;break;                                           
                            }else if(PIECES_BY_ID[Squares[to_square]].side != turn){//square occupied by opponent piece                                                       
                                NextSquarePath++;break;                                
                            }
                    }
                    default:{                    
                        NextSquarePath = 0;
                        checkEnPassant = EN_LHS;//initialize enpassant                        
                        side_piece_index++;                        
                        if(side_piece_index == 16)            
                            return 0;//no more moves                  
                        PrevPathSquare = side_pieces[side_piece_index].Square;                                    
                        return NextMove();                        
                    }                        
                }
        }
                                

        
        PromotionRating = PawnPromotion(pce, to_square, PromotionRating, -1);//comeback
        
        //COME BACK ABEG O!!! MORE TEST NEEDS TO BE DONE
        
        //store the values in the BitMove integer  by XORing left shifting
        BitMove = 0;//initialize - it is important to initialize
                
        BitMove |= from_square;
        BitMove |= to_square << Constants.TO_SQUARE_SHIFT;            
        BitMove |= enpassant_capture_square << Constants.ENPASSANT_CAPUTRE_SQURE_SHIFT;     
        BitMove |= is_short_castle << Constants.IS_SHORT_CASTLE_SHIFT;     
        BitMove |= is_long_castle << Constants.IS_LONG_CASTLE_SHIFT;             
        BitMove |= PromotionRating << Constants.PROMOTION_RATING_SHIFT; 
          
                
        if(BitMove == KillerMove){//already played.                         
            return NextMove();//next square but same piece
        }
        
        //if(this.getBlackKing().Square==to_square)//TESTING
            //getBlackKing().Square=to_square;//TESTING
        /*if(BitMove != 0)
            return true;
        else
            return false;
         * 
         * 
         */
        
        return BitMove;
    }

    /**
     * This method is used to check if the is in check at the given 
     * square specified as argument.
     * 
     * @return 
     */        
    public boolean isKingInCheck(){
         is_diagonal_path = false;
         is_knigh_square =  false;
         has_regular_path = true;   
         int king_square_loc = turn==Side.white? getWhiteKing().Square : getBlackKing().Square;
         int prev_to_square = king_square_loc;
         NextAttackPath = VERT_UP;
         boolean is_check= isAttack( king_square_loc,  prev_to_square, NOTHING, NOTHING);
         
         return is_check;
    }
    
    /**
     * This method is used to check if the king is in check. the emptied_square will be skipped.
     * The emptied_square is the square assumed to be emptied by own piece move. The occupied
     * square will be regarded as occupied by own piece and thus blocking the path of the check search.
     * 
     * @param pce
     * @param emptied_square
     * @param occupied_square
     * @return 
     */

     public boolean isOwnKingCheck(Piece pce, int emptied_square, int occupied_square){
         is_diagonal_path = false;
         is_knigh_square =  false;
         has_regular_path = true;   
         int king_square_loc = turn==Side.white? getWhiteKing().Square : getBlackKing().Square;
         king_square_loc = pce.piece_name == Constants.King ? occupied_square : king_square_loc;


         int prev_to_square = king_square_loc;
         NextAttackPath = VERT_UP;
         boolean is_check= isAttack( king_square_loc,  prev_to_square, emptied_square, occupied_square);
         
         return is_check;
    }
        
    /**
     * This method is used to check if the specified piece is under attack. the emptied_square will be skipped.
     * The emptied_square is the square assumed to be emptied by this piece move. The occupied
     * square will be regarded as occupied by this piece and thus blocking the path of the attack search.
      * 
      * @param pce
      * @param emptied_square
      * @param occupied_square
      * @return 
      */ 
    public boolean isPieceUnderAttack(Piece pce, int emptied_square, int occupied_square){
         is_diagonal_path = false;
         is_knigh_square =  false;
         has_regular_path = true;   
         int square_loc = pce.Square;
         int prev_to_square = square_loc;
         NextAttackPath = VERT_UP;
         boolean is_attack= isAttack( square_loc,  prev_to_square, emptied_square, occupied_square);
         
         return is_attack;         
     }
    
    private boolean isAttack(int square_loc, int prev_square, int emptied_square,  int occupied_square){    

        int square;
                       
        switch(NextAttackPath){  
            
            case VERT_UP:{            
                NextAttackPath = VERT_UP;//save the switch location - important                   
                square=NextVertUp[prev_square];                                       
                if(square!=NOTHING)                
                    if(square == emptied_square){                        
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                                           
                    }else if(square == occupied_square){                        
                        //next path
                    }else if(Squares[square] == NOTHING){//empty square                      
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                   
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//path blocked by opponent piece    
                                                                
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Queen)                                     
                            return true;                                                                                    
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Rook)                                                        
                            return true;                             
                        int diff = square - square_loc;                        
                        if(diff == 8)                                                        
                            if(PIECES_BY_ID[Squares[square]].piece_name==Constants.King)                            
                                return true;
                                                    
                    }        
                
                prev_square = square_loc;                
            }            
            case VERT_DOWN:{            
                NextAttackPath = VERT_DOWN;//save the switch location - important     
                square=NextVertDown[prev_square];                                       
                if(square!=NOTHING)                
                    if(square == emptied_square){                        
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                                           
                    }else if(square == occupied_square){                        
                        //next path
                    }else if(Squares[square] == NOTHING){//empty square                      
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                   
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//path blocked by opponent piece    
                                                              
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Queen)                         
                            return true;                                                                
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Rook)                                                        
                            return true;                              
                        int diff = square - square_loc;                        
                        if(diff == -8)                        
                            if(PIECES_BY_ID[Squares[square]].piece_name==Constants.King)                            
                                return true;
                                                    
                    }
                prev_square = square_loc;                
            }            
            case HORIZ_RIGHT:{                            
                NextAttackPath = HORIZ_RIGHT;//save the switch location - important     
                square=NextHorizRight[prev_square];                                       
                if(square!=NOTHING)                
                    if(square == emptied_square){                        
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                                           
                    }else if(square == occupied_square){                        
                        //next path
                    }else if(Squares[square] == NOTHING){//empty square                      
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                   
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//path blocked by opponent piece    
                                                               
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Queen)                         
                            return true;                                                                
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Rook)                                                        
                            return true;                              
                        int diff = square - square_loc;                        
                        if(diff == 1)                        
                            if(PIECES_BY_ID[Squares[square]].piece_name==Constants.King)                            
                                return true;
                                                   
                    }
                prev_square = square_loc;                
            }            
            case HORIZ_LEFT:{            
                NextAttackPath = HORIZ_LEFT;//save the switch location - important     
                square=NextHorizLeft[prev_square];                                       
                if(square!=NOTHING)                
                    if(square == emptied_square){                        
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                                           
                    }else if(square == occupied_square){                        
                        //next path
                    }else if(Squares[square] == NOTHING){//empty square                      
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                   
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//path blocked by opponent piece    
                                                            
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Queen)                         
                            return true;                                                                
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Rook)                                                        
                            return true;                              
                        int diff = square - square_loc;                        
                        if(diff == -1)                        
                            if(PIECES_BY_ID[Squares[square]].piece_name==Constants.King)                            
                                return true;
                                                    
                    }                       
                prev_square = square_loc;                                        
            }               
            case TOP_DIAGONAL_RIGHT:{            
                NextAttackPath = TOP_DIAGONAL_RIGHT;//save the switch location - important     
                square=NextTopDiagonalRight[prev_square];                                       
                if(square!=NOTHING)                
                    if(square == emptied_square){                        
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                                           
                    }else if(square == occupied_square){                        
                        //next path
                    }else if(Squares[square] == NOTHING){//empty square                      
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                   
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//path blocked by opponent piece                                                                             
                                
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Queen)                         
                            return true;                                                                
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Bishop)                                                        
                            return true;                              
                        int diff = square - square_loc;                        
                        if(diff == 9){                        
                            if(PIECES_BY_ID[Squares[square]].side == Side.black)                            
                                if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Pawn)                                
                                    return true;                                    
                            if(PIECES_BY_ID[Squares[square]].piece_name==Constants.King)                            
                                return true;                                                                    
                        }
                            
                    }                       
                prev_square = square_loc;                
            }            
            case TOP_DIAGONAL_LEFT:{            
                NextAttackPath = TOP_DIAGONAL_LEFT;//save the switch location - important     
                square=NextTopDiagonalLeft[prev_square];                                       
                if(square!=NOTHING)                
                    if(square == emptied_square){                        
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                                           
                    }else if(square == occupied_square){                        
                        //next path
                    }else if(Squares[square] == NOTHING){//empty square                      
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                   
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//path blocked by opponent piece                                                                                                             
                        
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Queen)                         
                            return true;                                                                
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Bishop)                                                        
                            return true;                              
                        int diff = square - square_loc;                        
                        if(diff == 7){                        
                            if(PIECES_BY_ID[Squares[square]].side == Side.black)                            
                                if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Pawn)                                
                                    return true;                                    
                            if(PIECES_BY_ID[Squares[square]].piece_name==Constants.King)                            
                                return true;                                                                    
                        }
                                                  
                    }                       
                prev_square = square_loc;                
            }            
            case BOTTOM_DIAGONAL_RIGHT:{            
                NextAttackPath = BOTTOM_DIAGONAL_RIGHT;//save the switch location - important     
                square=NextBottomDiagonalRight[prev_square];                                       
                if(square!=NOTHING)                            
                    if(square == emptied_square){                        
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                                           
                    }else if(square == occupied_square){                        
                        //next path
                    }else if(Squares[square] == NOTHING){//empty square                                      
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                   
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//path blocked by opponent piece                                                                                                           

                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Queen)                         
                            return true;                                                                
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Bishop)                                                        
                            return true;                              
                        int diff = square - square_loc;                        
                        if(diff == -7){                        
                            if(PIECES_BY_ID[Squares[square]].side == Side.black)                            
                                if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Pawn)                                
                                    return true;                                    
                            if(PIECES_BY_ID[Squares[square]].piece_name==Constants.King)                            
                                return true;                                                                    
                        }
                            
                    }                       
                prev_square = square_loc;                
            }            
            case BOTTOM_DIAGONAL_LEFT:{            
                NextAttackPath = BOTTOM_DIAGONAL_LEFT; //save the switch location - important     
                square=NextBottomDiagonalLeft[prev_square];                                       
                if(square!=NOTHING)                
                    if(square == emptied_square){                        
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                                           
                    }else if(square == occupied_square){                        
                        //next path
                    }else if(Squares[square] == NOTHING){//empty square                      
                        PrevAttackPathSquare = square;//continue on path                        
                        return this.isAttack(square_loc, PrevAttackPathSquare, emptied_square, occupied_square);//continue on path                                   
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//path blocked by opponent piece                                               
                                                           
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Queen)                         
                            return true;                                                                
                        if(PIECES_BY_ID[Squares[square]].piece_name==Constants.Bishop)                                                        
                            return true;                              
                        int diff = square - square_loc;                        
                        if(diff == -9){                        
                            if(PIECES_BY_ID[Squares[square]].side == Side.black)                            
                                if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Pawn)                                
                                    return true;                                    
                            if(PIECES_BY_ID[Squares[square]].piece_name==Constants.King)                            
                                return true;                                                                    
                        }
                            
                    }                       
                prev_square = square_loc;                
            }   
                
                            
            //KNIGHT SQUARE CHECK STARTS BELOW    

            case KNIGHT_TOP_RIGHT_CLOSER:{
                square=KnightTopRightCloser[square_loc];                                       
                if(square!=NOTHING)                                                           
                    if(Squares[square] == NOTHING){//empty square                                          
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//square occupied by opponent piece.                    
                        if(square != occupied_square)//if the opponent piece is not being capture.                       
                            if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Knight)                                                   
                                return true;                        
                    }                       
            }    
            case KNIGHT_TOP_RIGHT_FURTHER:{
                square=KnightTopRightFurther[square_loc];                                       
                if(square!=NOTHING)                                                           
                    if(Squares[square] == NOTHING){//empty square                                          
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//square occupied by opponent piece                    
                        if(square != occupied_square)//if the opponent piece is not being capture.                        
                            if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Knight)                                                   
                                return true;                        
                    }                
            }
            case KNIGHT_TOP_LEFT_CLOSER:{
                square=KnightTopLeftCloser[square_loc];                                       
                if(square!=NOTHING)                                                           
                    if(Squares[square] == NOTHING){//empty square                                          
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//square occupied by opponent piece                    
                        if(square != occupied_square)//if the opponent piece is not being capture.                        
                            if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Knight)                                                   
                                return true;                        
                    }                
            }
            case KNIGHT_TOP_LEFT_FURTHER:{
                square=KnightTopLeftFurther[square_loc];                                       
                if(square!=NOTHING)                                                           
                    if(Squares[square] == NOTHING){//empty square                                          
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//square occupied by opponent piece                    
                        if(square != occupied_square)//if the opponent piece is not being capture.                        
                            if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Knight)                                                   
                                return true;                        
                    }                
            }
            case KNIGHT_BOTTOM_RIGHT_CLOSER:{
                square=KnightBottomRightCloser[square_loc];                                       
                if(square!=NOTHING)                                                           
                    if(Squares[square] == NOTHING){//empty square                                          
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//square occupied by opponent piece                    
                        if(square != occupied_square)//if the opponent piece is not being capture.                        
                            if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Knight)                                                   
                                return true;                        
                    }                
            }
            case KNIGHT_BOTTOM_RIGHT_FURTHER:{
                square=KnightBottomRightFurther[square_loc];                                       
                if(square!=NOTHING)                                                           
                    if(Squares[square] == NOTHING){//empty square                                          
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//square occupied by opponent piece                    
                        if(square != occupied_square)//if the opponent piece is not being capture.                        
                            if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Knight)                                                   
                                return true;                        
                    }                
            }
            case KNIGHT_BOTTOM_LEFT_CLOSER:{
                square=KnightBottomLeftCloser[square_loc];                                       
                if(square!=NOTHING)                                                           
                    if(Squares[square] == NOTHING){//empty square                                          
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//square occupied by opponent piece                    
                        if(square != occupied_square)//if the opponent piece is not being capture.                        
                            if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Knight)                                                   
                                return true;                        
                    }                
            }
            case KNIGHT_BOTTOM_LEFT_FURTHER:{
                square=KnightBottomLeftFurther[square_loc];                                       
                if(square!=NOTHING)                                                           
                    if(Squares[square] == NOTHING){//empty square                                          
                    }else if(PIECES_BY_ID[Squares[square]].side != turn){//square occupied by opponent piece                    
                        if(square != occupied_square)//if the opponent piece is not being capture.                        
                            if(PIECES_BY_ID[Squares[square]].piece_name == Constants.Knight)                                                   
                                return true;                        
                    }                
            }                
            
        }        
                
                
        return false;        
    }
        
    private boolean isShortCastle(Piece pce) {
        
        if(pce.isAlreadyCastle)//important - so that engine does not repeat castle
            return false;        
        
        if(pce.hasPreviouslyMoved())
            return false;        
        
        int king_to_square = NOTHING;
        int rook_square = NOTHING;
        
        if(pce.isWhite()){   
            
            if(!canWhiteShortCastle)
                return false;              
            
            if(getWhiteRookOnKingSide().hasPreviouslyMoved())
                return false;          
            
            if(pce.Square != WHITE_king_ORIGIN_square ||
               getWhiteRookOnKingSide().Square != WHITE_rook_ORIGIN_square_on_KING_side)
                return false;

            king_to_square= WHITE_KING_SHORT_CASTLE_SQUARE;
            rook_square = getWhiteRookOnKingSide().Square;
                    
        }else{
            
            if(!canBlackShortCastle)
                return false;             
            
            if(getBlackRookOnKingSide().hasPreviouslyMoved())
                return false;            
                        
            if(pce.Square != BLACK_king_ORIGIN_square ||
               getBlackRookOnKingSide().Square != BLACK_rook_ORIGIN_square_on_KING_side)
                return false;            
        
            king_to_square= BLACK_KING_SHORT_CASTLE_SQUARE;
            rook_square = getBlackRookOnKingSide().Square;
                    
        }        
                
        //check if all squares between rook and king is empty
        
        //COME BACK TO TEST FOR CORRECTNESS         
        for(int sq=pce.Square + 1 ; sq < rook_square; sq++){
           if(Squares[sq]!=NOTHING)
            return false;
        }
                        
        
        
        //check king check states all through
        
        //COME BACK TO TEST FOR CORRECTNESS
        for(int sq=pce.Square; sq < king_to_square + 1; sq++){
            if(this.isOwnKingCheck(pce, pce.Square,  sq))
                return false;  
        }
        
        //------------------------------
        
        //finally
        pce.isAlreadyCastle=true;
        
        return true;        
    }

    private boolean isLongCastle(Piece pce) {
        
        if(pce.isAlreadyCastle)//important - so that engine does not repeat castle
            return false;        
        
        if(pce.hasPreviouslyMoved())
            return false;        

        int king_to_square = NOTHING;
        int rook_square = NOTHING;
                
        if(pce.isWhite()){
                        
            if(!canWhiteLongCastle)
                return false;                          
            
            if(getWhiteRookOnQueenSide().hasPreviouslyMoved())
                return false;
                        
            if(pce.Square != WHITE_king_ORIGIN_square ||
               getWhiteRookOnQueenSide().Square != WHITE_rook_ORIGIN_square_on_QUEEN_side)
                return false;    

            king_to_square= WHITE_KING_LONG_CASTLE_SQUARE;
            rook_square = getWhiteRookOnQueenSide().Square;
            
        }else{
                        
            if(!canBlackLongCastle)
                return false;     
            
            if(getBlackRookOnQueenSide().hasPreviouslyMoved())
                return false;            
                                    
            if(pce.Square != BLACK_king_ORIGIN_square ||
               getBlackRookOnQueenSide().Square != BLACK_rook_ORIGIN_square_on_QUEEN_side)
                return false;                
            
            king_to_square= BLACK_KING_LONG_CASTLE_SQUARE;
            rook_square = getBlackRookOnQueenSide().Square;
            
        }

        //check if all squares between rook and king is empty
        
        //COME BACK TO TEST FOR CORRECTNESS         
        for(int sq=pce.Square - 1 ; sq > rook_square; sq--){
           if(Squares[sq]!=NOTHING)
            return false;
        }        
        
        
        //check king check states all through

        //COME BACK TO TEST FOR CORRECTNESS
        for(int sq=pce.Square; sq > king_to_square -1; sq--){
            if(this.isOwnKingCheck(pce, pce.Square,  sq))
                return false;  
        }
        
        
        //finally
        pce.isAlreadyCastle=true;
        
        return true;
    }

    private int PawnPromotion(Piece piece, int to_square, int promotion_piece_rating, int depth) {
        
        
        if(piece.piece_name!=Constants.Pawn)
            return NOTHING;//any number greater than 4
        
        if(piece.isWhite() &&  to_square < 56)
            return NOTHING;//any number greater than 4
        
        if(piece.isBlack() &&  to_square > 7)
            return NOTHING;//any number greater than 4
                        
        
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
        
        return NOTHING;//any number greater than 4
    }
   

    private int RHS_EnpassantCapture(Piece pce) {
        
        checkEnPassant = EN_LHS;//yes EN_LHS , to allow the other hand side.
        
        if(pce.piece_name!=Constants.Pawn)
            return NOTHING;

        
        if(pce.isWhite()){
            
            if(pce.Square <32 || pce.Square >39)//check if white piece is on its fifth rank.
                return NOTHING;//not on the fifth rank so leave 
            
            if((pce.Square + 1)%8==0 ){//right edge square - ie square 7, 15, 23, 31, 39, 47, 55, 63.                
                return NOTHING;//not required here                
            }
            
                
            int en_passant_square_RHS=pce.Square + 1;//square to the RHS
            int RHS_capture_piece_id =Squares[en_passant_square_RHS];
            Piece piece_RHS = getPieceByID(RHS_capture_piece_id); 
            int to_square_RHS=en_passant_square_RHS + 8;
            
            if(Squares[to_square_RHS] == NOTHING)// check if to_square is empty
                if(RHS_capture_piece_id != NOTHING)//check if adjacent square to the right is ocupied                         
                    if(piece_RHS.piece_name==Constants.Pawn)
                        if(piece_RHS.PawnDoubleStepMove)//pawn makes double step - ie first move                                
                            if(piece_RHS.isBlack())
                                return en_passant_square_RHS;//opponent piece square
                
            
            
        }else{ //is balck
            
            if(pce.Square < 24 || pce.Square >31)//check if black piece is on its fifth rank.
                return NOTHING;//not on the fifth rank so leave
            
            
            if((pce.Square + 1)%8==0 ){//right edge square - ie square 7, 15, 23, 31, 39, 47, 55, 63.                
                return NOTHING;//not required here                
            }
            

            int en_passant_square_RHS=pce.Square + 1;//square to the RHS
            int RHS_capture_piece_id =Squares[en_passant_square_RHS];
            Piece piece_RHS = getPieceByID(RHS_capture_piece_id);                 
            int to_square_RHS=en_passant_square_RHS - 8;
            
            if(Squares[to_square_RHS] == NOTHING)// check if to_square is empty
                if(RHS_capture_piece_id != NOTHING)//check if adjacent square to the right is ocupied                         
                    if(piece_RHS.piece_name==Constants.Pawn)
                        if(piece_RHS.PawnDoubleStepMove)//pawn makes double step - ie first move                                
                            if(piece_RHS.isWhite())
                                return en_passant_square_RHS;//opponent piece square
                                    
                        
        }

        return NOTHING;
    }

    private int LHS_EnpassantCapture(Piece pce) {
    
        checkEnPassant = EN_RHS;//yes EN_RHS , to allow the other hand side.
        
        if(pce.piece_name!=Constants.Pawn)
            return NOTHING;

        
        if(pce.isWhite()){
            
            if(pce.Square <32 || pce.Square >39)//check if white piece is on its fifth rank.
                return NOTHING;//not on the fifth rank so leave 
            
            if(pce.Square%8==0 ){//left edge square- ie square 0, 8, 16, 24, 32, 40, 48, 56.
                return NOTHING;//not required here                                  
            }
                            
            int en_passant_square_LHS=pce.Square - 1;//square to the LHS
            int LHS_capture_piece_id =Squares[en_passant_square_LHS];
            Piece piece_LHS = getPieceByID(LHS_capture_piece_id); 
            int to_square_LHS=en_passant_square_LHS + 8;
            
            if(Squares[to_square_LHS] == NOTHING)// check if to_square is empty
                if(LHS_capture_piece_id != NOTHING)//check if adjacent square to the left is ocupied                         
                    if(piece_LHS.piece_name==Constants.Pawn)
                        if(piece_LHS.PawnDoubleStepMove)//pawn makes double step - ie first move                                
                            if(piece_LHS.isBlack())
                                return en_passant_square_LHS;//opponent piece square
            
        }else{ //is balck
            
            if(pce.Square < 24 || pce.Square >31)//check if black piece is on its fifth rank.
                return NOTHING;//not on the fifth rank so leave

            if(pce.Square%8==0 ){//left edge square- ie square 0, 8, 16, 24, 32, 40, 48, 56.
                return NOTHING;//not required here                                  
            }            
                            
            int en_passant_square_LHS=pce.Square - 1;//square to the LHS
            int LHS_capture_piece_id =Squares[en_passant_square_LHS];                
            Piece piece_LHS = getPieceByID(LHS_capture_piece_id);                 
            int to_square_LHS=en_passant_square_LHS - 8;
            
            if(Squares[to_square_LHS] == NOTHING)// check if to_square is empty
                if(LHS_capture_piece_id != NOTHING)//check if adjacent square to the left is ocupied                         
                    if(piece_LHS.piece_name==Constants.Pawn)
                        if(piece_LHS.PawnDoubleStepMove)//pawn makes double step - ie first move                                        
                            if(piece_LHS.isWhite())                                                                        
                                return en_passant_square_LHS;//opponent piece square
                            
        }

        return NOTHING;
    }        
    public int evaluateGamePosition(int sd_piece_index, boolean is_maximizer){
        
        int cost = 0;
        if(sd_piece_index == 16)
            sd_piece_index=16;
        int piece_evalute=evaluatePiecesOnBoardCost();        
        int threat_attack_cost = possibleThreatCost(sd_piece_index);

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
        
        for(int i=PIECES_BY_ID.length -1; i>-1; i--){
            
            if(PIECES_BY_ID[i].Square == NOTHING)
                continue;
            
            if(PIECES_BY_ID[i].Me()== turn){
                //positive cost
                switch(PIECES_BY_ID[i].piece_name){
                    case Constants.King : cost += Constants.king_cost; continue;
                    case Constants.Queen : cost += Constants.queen_cost; continue;
                    case Constants.Bishop : cost += Constants.bishop_cost; continue;
                    case Constants.Knight : cost += Constants.knight_cost; continue;
                    case Constants.Rook : cost += Constants.Rook; continue;
                    case Constants.Pawn : cost += Constants.pawn_cost; continue;
                }
            }else{
                //negative cost
                switch(PIECES_BY_ID[i].piece_name){
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
        
        Piece piece=side_pieces[piece_index]; //piece index and id is same
        
        
       
        
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
        if(isPieceUnderAttack(piece, NOTHING, NOTHING)){
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
       
}

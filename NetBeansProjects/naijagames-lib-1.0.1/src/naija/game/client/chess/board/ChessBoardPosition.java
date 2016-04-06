/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.board;

import naija.game.client.GamePosition;
import naija.game.client.Side;
import naija.game.client.PieceName;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ChessBoardPosition extends GamePosition{

    private String strFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";//traditionaly initial position
    private int move_number = -1;
    private int NOTHING = Constants.NOTHING;
    private int turn = -1;//
    private String strWhiteShortCastle = "K";//used for FEN
    private String strWhiteLongCastle = "Q";//used for FEN
    private String strBlackShortCastle = "k";//used for FEN
    private String strBlackLongCastle = "q";//used for FEN
    private boolean canWhiteShortCastle = true;
    private boolean canWhiteLongCastle = true;
    private boolean canBlackShortCastle = true;
    private boolean canBlackLongCastle = true;
    private int halfMoveClock = 0;//This is the number of halfmoves since the last capture or pawn advance. This is used to determine if a draw can be claimed under the fifty-move rule.
    private int fullMoveNumber = 1; //The number of the full move. It starts at 1, and is incremented after Black's move.
    private String EnPassant_target_square_label;
    private int EnPassant_target_square = NOTHING;
    private final PieceDescription[] pieceDescription = new PieceDescription[64];

    public ChessBoardPosition() {
        intializeFEN(strFEN);
    }

    public ChessBoardPosition(String strFEN) {
        intializeFEN(strFEN);
    }

    private void intializeFEN(String fen_string) {

        fen_string = trimSpace(fen_string);//trim out excessive space character

        strFEN = fen_string;

        String[] fen_split = fen_string.split(" ");
        String fen_board = fen_split[0];

        //set turn
        if (fen_split[1].equals("w")) {
            turn = Side.white;
        } else {
            turn = Side.black;
        }

        //set castle availability
        canWhiteShortCastle = canWhiteLongCastle = canBlackShortCastle = canBlackLongCastle = false; //initliaze all to false

        if (fen_split[2].indexOf("K") > -1) {
            strWhiteShortCastle = "K";
            canWhiteShortCastle = true;
        }

        if (fen_split[2].indexOf("Q") > -1) {
            strWhiteLongCastle = "Q";
            canWhiteLongCastle = true;
        }

        if (fen_split[2].indexOf("k") > -1) {
            strBlackShortCastle = "k";
            canBlackShortCastle = true;
        }

        if (fen_split[2].indexOf("q") > -1) {
            strBlackLongCastle = "q";
            canBlackLongCastle = true;
        }

        //set en passant target square                
        if (fen_split[3].equals("-")) {
            EnPassant_target_square_label = "";
            EnPassant_target_square = NOTHING;
        } else {
            EnPassant_target_square_label = fen_split[3];
            EnPassant_target_square = getSquareIndex(fen_split[3]);
        }

        //set half move clock
        halfMoveClock = Integer.parseInt(fen_split[4]);

        //set full move number
        fullMoveNumber = Integer.parseInt(fen_split[5]);

        //setup the fen board.        
        //now change the piece square to the fen sqaures
        int fen_square = -1;
        int square_start = 64; //appling fen rule of piece arrangement - ie ranks are 8 to 1 and thier cotents are descrided from "a" to "h"
        String[] fen_ranks = fen_board.split("/");

        for (int i = 0; i < fen_ranks.length; i++) {

            String rank = fen_ranks[i];
            fen_square = square_start - 8 * (i + 1) - 1;//appling fen rule of piece arrangement - ie ranks are 8 to 1 and thier cotents are descrided from "a" to "h"

            for (int k = 0; k < rank.length(); k++) {

                String str_num = rank.substring(k, k + 1);//important
                char fen_piece_name = str_num.charAt(0);//important

                if (Character.isDigit(fen_piece_name)) {
                    int num = Integer.parseInt(str_num);
                    fen_square += num;
                    continue;
                } else {
                    fen_square++;
                }

                boolean is_white = true;
                if (Character.isLowerCase(fen_piece_name)) {
                    is_white = false;
                }

                //convert to Upper Case 
                fen_piece_name = Character.toUpperCase(fen_piece_name);
                switch (fen_piece_name) {
                    case 'K':
                        this.pieceDescription[fen_square] = new PieceDescription(PieceName.king, is_white);
                        break;
                    case 'Q':
                        this.pieceDescription[fen_square] = new PieceDescription(PieceName.queen, is_white);
                        break;
                    case 'B':
                        this.pieceDescription[fen_square] = new PieceDescription(PieceName.bishop, is_white);
                        break;
                    case 'N':
                        this.pieceDescription[fen_square] = new PieceDescription(PieceName.knight, is_white);
                        break;
                    case 'R':
                        this.pieceDescription[fen_square] = new PieceDescription(PieceName.rook, is_white);
                        break;
                    case 'P':
                        this.pieceDescription[fen_square] = new PieceDescription(PieceName.pawn, is_white);
                        break;
                }

            }

        }

    }

    /**
     * This method trims out excessive space characters.
     *
     * @param str
     * @return
     */
    String trimSpace(String str) {
        //equals("") replaced isEmpty() because of Android compatibility issues
        if (str.equals("") || str.equals(" ")) {
            return "";
        }

        String[] split = str.split(" ");
        String res = "";
        for (int i = 0; i < split.length; i++) {
            if (!split[i].equals("")) {
                res += split[i] + " ";
            }
        }

        res = res.substring(0, res.length() - 1);//remove the last character which is obviously space

        return res;
    }

    private int getSquareIndex(String square_lable) {

        if (square_lable.length() != 2) {
            return NOTHING;
        }

        char c_col_label = square_lable.charAt(0);
        char c_row_label = square_lable.charAt(1);

        int col_index = columLabelToIndex(c_col_label);
        int row_index = rowLabelToIndex(c_row_label);

        int square = (row_index) * 8 + col_index;

        return square;
    }

    private int columLabelToIndex(char column_label) {
        if (column_label == 'a') {
            return 0;
        } else if (column_label == 'b') {
            return 1;
        } else if (column_label == 'c') {
            return 2;
        } else if (column_label == 'd') {
            return 3;
        } else if (column_label == 'e') {
            return 4;
        } else if (column_label == 'f') {
            return 5;
        } else if (column_label == 'g') {
            return 6;
        } else if (column_label == 'h') {
            return 7;
        }

        return -1;
    }

    private int rowLabelToIndex(char row_label) {

        if (row_label == '1') {
            return 0;
        } else if (row_label == '2') {
            return 1;
        } else if (row_label == '3') {
            return 2;
        } else if (row_label == '4') {
            return 3;
        } else if (row_label == '5') {
            return 4;
        } else if (row_label == '6') {
            return 5;
        } else if (row_label == '7') {
            return 6;
        } else if (row_label == '8') {
            return 7;
        }

        return -1;
    }

    public void setBoardPosition(String strFEN) {
        this.strFEN = strFEN;
        intializeFEN(strFEN);
    }

    public boolean isWhiteTurn(){
        return turn==Side.white;
    }
    
    public int getMoveNumber() {
        return move_number;
    }

    public boolean canWhiteShortCastle() {
        return canWhiteShortCastle;
    }

    public boolean canWhiteLongCastle() {
        return canWhiteLongCastle;
    }

    public boolean canBlackShortCastle() {
        return canBlackShortCastle;
    }

    public boolean canBlackLongCastle() {
        return canBlackLongCastle;
    }

    public PieceDescription getPieceDescription(int square) {
        return pieceDescription[square];
    }
    
    public int getEnPassantTargetSquare(){
        return this.EnPassant_target_square;
    }
    
    @Override
    public String toString(){
        return strFEN;
    }
    
    public static void main(String args[]){
        ChessBoardPosition b= new ChessBoardPosition();
        
        for(int i=0; i<b.pieceDescription.length; i++){
            if(b.pieceDescription[i]!=null){
                System.out.println("square = "+i+" , piece = "+b.pieceDescription[i].getPieceName()+" , is_white = "+b.pieceDescription[i].isWhite());
            }
        }
    }
}

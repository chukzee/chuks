/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.board;

import naija.game.client.Side;
import naija.game.client.chess.board.ChessMove.Castle;
import naija.game.client.chess.board.ChessMove.EnPassant;
//import util.Approx;

/**
 *
 * @author Engr. Chuks
 */
public class BoardAnalyzer {

    private int white_move_count_without_capture_and_pawn_move;
    private int black_move_count_without_capture_and_pawn_move;
    private int total_squares_per_row = 8;
    private int total_row = 8;
    private int total_chess_pieces = 32;
    public Board board;
    private boolean is_valid_fifty_move_rule_draw;
    private boolean is_valid_threefold_repetitions_draw;

    public BoardAnalyzer(Board board) {
        this.board = board;
    }

    public void init(Board board) {
        this.board = board;
        white_move_count_without_capture_and_pawn_move = -1;
        black_move_count_without_capture_and_pawn_move = -1;
        is_valid_fifty_move_rule_draw = false;
        is_valid_threefold_repetitions_draw = false;
    }

    public int getSquareRowIndex(int square) {
        double d_square = square;//firs convert to double
        return (int) ((float) (d_square / total_squares_per_row));//cast to float first to take care of precision problem
    }

    public int getSquareColumnIndex(int square) {

        double d_square = square;//firs convert to double
        int v1 = (int) (d_square / total_squares_per_row);
        double v2 = d_square / total_squares_per_row;
        double fraction = v2 - v1;

        return (int) ((float) (fraction * total_squares_per_row));//cast to float first to take care of precision problem        
    }

    //Re touched
    boolean isSquareEmpty(int square_serial_num, int skipped_square) {// skipped_square is to prevent conflict due to piece navigation

        Piece[] pieces = board.getAllPieces();

        for (int i = pieces.length - 1; i > -1; i--) {

            if (pieces[i].getPieceSquarePosition() == skipped_square) {
                continue;
            }

            if (pieces[i].getPieceSquarePosition() == square_serial_num) {
                return false;
            }

        }

        return true;//man at work
    }

    Piece getPieceOnSquare(int square) {

        if (square == -1) {
            return null;
        }

        Piece[] pieces = board.getAllPieces();

        int len = pieces.length;
        for (int i = len - 1; i > -1; i--) {
            if (pieces[i].getPieceSquarePosition() == square) {
                return pieces[i];
            }
        }

        return null;
    }

    public Piece getPieceByID(int piece_id) {

        /*Piece[] pieces=board.getAllPieces(); 
         int len=pieces.length;
         for(int i=len-1; i>-1; i--)
         if(pieces[i].getPieceID()==piece_id)
         return pieces[i];

         * 
         */
        if (piece_id > -1) {
            return board.getAllPieces()[piece_id];//i made the piece id the index
        }
        return null;
    }

    public Piece getPieceOnSquareExcept(Piece except, int square) {

        Piece[] pieces = board.getAllPieces();

        int len = pieces.length;
        for (int i = len - 1; i > -1; i--) {
            if (pieces[i].getPieceSquarePosition() == square
                    && !pieces[i].equals(except)) {
                return pieces[i];
            }
        }

        return null;
    }

    public int[] getPieceSurrundingSquares(int square) {

        int[] surronding_squares = null;

        int left_square_poistion = -1;
        int right_square_poistion = -1;
        int upper_square_poistion = -1;
        int lower_square_poistion = -1;
        int diagonal_left_top_square_poistion = -1;
        int diagonal_right_top_square_poistion = -1;
        int diagonal_left_bottom_square_poistion = -1;
        int diagonal_right_bottom_square_poistion = -1;

        if (isNoneBorderSquare(square)) {
            left_square_poistion = square - 1;
            right_square_poistion = square + 1;
            upper_square_poistion = square + total_squares_per_row;
            lower_square_poistion = square - total_squares_per_row;
            diagonal_left_top_square_poistion = square + total_squares_per_row - 1;
            diagonal_right_top_square_poistion = square + total_squares_per_row + 1;
            diagonal_left_bottom_square_poistion = square - total_squares_per_row - 1;
            diagonal_right_bottom_square_poistion = square - total_squares_per_row + 1;

            surronding_squares = new int[8];
            surronding_squares[0] = left_square_poistion;
            surronding_squares[1] = right_square_poistion;
            surronding_squares[2] = upper_square_poistion;
            surronding_squares[3] = lower_square_poistion;
            surronding_squares[4] = diagonal_left_top_square_poistion;
            surronding_squares[5] = diagonal_right_top_square_poistion;
            surronding_squares[6] = diagonal_left_bottom_square_poistion;
            surronding_squares[7] = diagonal_right_bottom_square_poistion;

            return surronding_squares;
        }

        //Note : all the 4 corner squares must come before the border squares to differential them
        //since the corner squares are still border squares
        if (isBottomRightCornerSquare(square)) {
            left_square_poistion = square - 1;
            upper_square_poistion = square + total_squares_per_row;
            diagonal_left_top_square_poistion = square + total_squares_per_row - 1;

            surronding_squares = new int[3];
            surronding_squares[0] = left_square_poistion;
            surronding_squares[1] = upper_square_poistion;
            surronding_squares[2] = diagonal_left_top_square_poistion;

            return surronding_squares;
        }

        if (isBottomLeftCornerSquare(square)) {
            right_square_poistion = square + 1;
            upper_square_poistion = square + total_squares_per_row;
            diagonal_right_top_square_poistion = square + total_squares_per_row + 1;

            surronding_squares = new int[3];
            surronding_squares[0] = right_square_poistion;
            surronding_squares[1] = upper_square_poistion;
            surronding_squares[2] = diagonal_right_top_square_poistion;

            return surronding_squares;
        }

        if (isTopRightCornerSquare(square)) {
            left_square_poistion = square - 1;
            lower_square_poistion = square - total_squares_per_row;
            diagonal_left_bottom_square_poistion = square - total_squares_per_row - 1;

            surronding_squares = new int[3];
            surronding_squares[0] = left_square_poistion;
            surronding_squares[1] = lower_square_poistion;
            surronding_squares[2] = diagonal_left_bottom_square_poistion;

            return surronding_squares;
        }

        if (isTopLeftCornerSquare(square)) {
            right_square_poistion = square + 1;
            lower_square_poistion = square - total_squares_per_row;
            diagonal_right_bottom_square_poistion = square - total_squares_per_row + 1;

            surronding_squares = new int[3];
            surronding_squares[0] = right_square_poistion;
            surronding_squares[1] = lower_square_poistion;
            surronding_squares[2] = diagonal_right_bottom_square_poistion;

            return surronding_squares;
        }

        if (isLeftBorderSquare(square)) {
            right_square_poistion = square + 1;
            upper_square_poistion = square + total_squares_per_row;
            lower_square_poistion = square - total_squares_per_row;
            diagonal_right_top_square_poistion = square + total_squares_per_row + 1;
            diagonal_right_bottom_square_poistion = square - total_squares_per_row + 1;

            surronding_squares = new int[5];
            surronding_squares[0] = right_square_poistion;
            surronding_squares[1] = upper_square_poistion;
            surronding_squares[2] = lower_square_poistion;
            surronding_squares[3] = diagonal_right_top_square_poistion;
            surronding_squares[4] = diagonal_right_bottom_square_poistion;

            return surronding_squares;
        }

        if (isRightBorderSquare(square)) {
            left_square_poistion = square - 1;
            upper_square_poistion = square + total_squares_per_row;
            lower_square_poistion = square - total_squares_per_row;
            diagonal_left_top_square_poistion = square + total_squares_per_row - 1;
            diagonal_left_bottom_square_poistion = square - total_squares_per_row - 1;

            surronding_squares = new int[5];
            surronding_squares[0] = left_square_poistion;
            surronding_squares[1] = upper_square_poistion;
            surronding_squares[2] = lower_square_poistion;
            surronding_squares[3] = diagonal_left_top_square_poistion;
            surronding_squares[4] = diagonal_left_bottom_square_poistion;

            return surronding_squares;
        }

        if (isTopBorderSquare(square)) {
            left_square_poistion = square - 1;
            right_square_poistion = square + 1;
            lower_square_poistion = square - total_squares_per_row;
            diagonal_left_bottom_square_poistion = square - total_squares_per_row - 1;
            diagonal_right_bottom_square_poistion = square - total_squares_per_row + 1;

            surronding_squares = new int[5];
            surronding_squares[0] = left_square_poistion;
            surronding_squares[1] = right_square_poistion;
            surronding_squares[2] = lower_square_poistion;
            surronding_squares[3] = diagonal_left_bottom_square_poistion;
            surronding_squares[4] = diagonal_right_bottom_square_poistion;

            return surronding_squares;
        }

        if (isBottomBorderSquare(square)) {
            left_square_poistion = square - 1;
            right_square_poistion = square + 1;
            upper_square_poistion = square + total_squares_per_row;
            diagonal_left_top_square_poistion = square + total_squares_per_row - 1;
            diagonal_right_top_square_poistion = square + total_squares_per_row + 1;

            surronding_squares = new int[5];
            surronding_squares[0] = left_square_poistion;
            surronding_squares[1] = right_square_poistion;
            surronding_squares[2] = upper_square_poistion;
            surronding_squares[3] = diagonal_left_top_square_poistion;
            surronding_squares[4] = diagonal_right_top_square_poistion;

            return surronding_squares;
        }

        return surronding_squares;
    }

    public boolean isNoneBorderSquare(int square) {

        if (isLeftBorderSquare(square)) {
            return false;
        }

        if (isRightBorderSquare(square)) {
            return false;
        }

        if (isTopBorderSquare(square)) {
            return false;
        }

        if (isBottomBorderSquare(square)) {
            return false;
        }

        if (isBottomRightCornerSquare(square)) {
            return false;
        }

        if (isBottomLeftCornerSquare(square)) {
            return false;
        }

        if (isTopRightCornerSquare(square)) {
            return false;
        }

        if (isTopLeftCornerSquare(square)) {
            return false;
        }

        return true;
    }

    public boolean isLeftBorderSquare(int square) {

        for (int i = 0; i < total_row; i++) {
            if (square == i * total_squares_per_row) {
                return true;
            }
        }

        return false;
    }

    public boolean isRightBorderSquare(int square) {
        for (int i = 0; i < total_row; i++) {
            if (square == i * total_squares_per_row + total_squares_per_row - 1) {
                return true;
            }
        }

        return false;
    }

    public boolean isTopBorderSquare(int square) {

        int end_square = total_row * total_squares_per_row - 1;

        int start_square = end_square - total_squares_per_row + 1;

        if (square >= start_square && square <= end_square) {
            return true;
        }

        return false;
    }

    public boolean isBottomBorderSquare(int square) {
        int end_square = total_squares_per_row - 1;

        int start_square = 0;

        if (square >= start_square && square <= end_square) {
            return true;
        }

        return false;
    }

    public boolean isTopRightCornerSquare(int square) {
        int top_right_corner_square = total_row * total_squares_per_row - 1;

        if (square == top_right_corner_square) {
            return true;
        }

        return false;
    }

    public boolean isTopLeftCornerSquare(int square) {
        int top_left_corner_square = total_row * total_squares_per_row - total_squares_per_row;

        if (square == top_left_corner_square) {
            return true;
        }

        return false;
    }

    public boolean isBottomRightCornerSquare(int square) {
        int bottom_right_corner_square = total_squares_per_row - 1;

        if (square == bottom_right_corner_square) {
            return true;
        }

        return false;
    }

    public boolean isBottomLeftCornerSquare(int square) {
        int bottom_left_corner_square = 0;

        if (square == bottom_left_corner_square) {
            return true;
        }

        return false;
    }

    public int[] getUnblockedSurroundingSquares(int square) {

        int[] surrouding_squares = getPieceSurrundingSquares(square);
        int len = surrouding_squares.length;
        int[] unblocked_surrouding_squares = new int[len];

        int index = -1;

        for (int i = 0; i < len; i++) {
            if (this.isSquareEmpty(surrouding_squares[i], -1)) {
                index = index + 1;
                unblocked_surrouding_squares[index] = surrouding_squares[i];
            }
        }

        int[] the_unblocked_surrounding_squares = new int[index + 1];

        System.arraycopy(unblocked_surrouding_squares, 0, the_unblocked_surrounding_squares, 0, index + 1);

        return the_unblocked_surrounding_squares;
    }

    public int[] getBlockedSurrundingSquares(int square) {

        int[] surrouding_squares = getPieceSurrundingSquares(square);
        int len = surrouding_squares.length;
        int[] blocked_surrouding_squares = new int[len];

        int index = -1;

        for (int i = 0; i < len; i++) {
            if (!this.isSquareEmpty(surrouding_squares[i], -1)) {
                index = index + 1;
                blocked_surrouding_squares[index] = surrouding_squares[i];
            }
        }

        int[] the_blocked_surrounding_squares = new int[index + 1];

        System.arraycopy(blocked_surrouding_squares, 0, the_blocked_surrounding_squares, 0, index + 1);

        return the_blocked_surrounding_squares;
    }

    public int[] getVerticalUpwardSquares(int square) {

        if (!this.isTopBorderSquare(square)) {

            int num_squares = total_row - this.getSquareRowIndex(square) - 1;
            int[] the_squares = new int[num_squares];
            for (int i = 0; i < num_squares; i++) {
                the_squares[i] = square + total_squares_per_row * (i + 1);
            }

            return the_squares;
        }

        return null;
    }

    public int[] getVerticalDownwardSquares(int square) {
        int[] the_squares = null;

        if (!this.isBottomBorderSquare(square)) {
            int num_squares = this.getSquareRowIndex(square);
            the_squares = new int[num_squares];
            for (int i = 0; i < num_squares; i++) {
                the_squares[i] = square - total_squares_per_row * (i + 1);
            }

        }

        return the_squares;
    }

    public int[] getHorizontalRightwardSquares(int square) {
        int[] the_squares = null;

        if (!this.isRightBorderSquare(square)) {
            int num_squares = total_squares_per_row - this.getSquareColumnIndex(square) - 1;
            the_squares = new int[num_squares];
            for (int i = 0; i < num_squares; i++) {
                the_squares[i] = square + i + 1;
            }

        }

        return the_squares;
    }

    public int[] getHorizontalLeftwardSquares(int square) {
        int[] the_squares = null;

        if (!this.isLeftBorderSquare(square)) {
            int num_squares = this.getSquareColumnIndex(square);
            the_squares = new int[num_squares];
            for (int i = 0; i < num_squares; i++) {
                the_squares[i] = square - i - 1;
            }

        }

        return the_squares;
    }

    public int[] getTopRightDiagonalSquares(int square) {
        int[] the_squares = null;

        if (!this.isTopBorderSquare(square) && !this.isRightBorderSquare(square)) {

            int num_1 = total_row - this.getSquareRowIndex(square) - 1;
            int num_2 = total_squares_per_row - this.getSquareColumnIndex(square) - 1;

            int num_squares = num_1;

            if (num_squares > num_2) {
                num_squares = num_2;
            }

            the_squares = new int[num_squares];

            for (int i = 0; i < num_squares; i++) {
                the_squares[i] = square + total_squares_per_row * (i + 1) + i + 1;
            }

        }

        return the_squares;
    }

    public int[] getTopLeftDiagonalSquares(int square) {
        int[] the_squares = null;

        if (!this.isTopBorderSquare(square) && !this.isLeftBorderSquare(square)) {

            int num_1 = total_row - this.getSquareRowIndex(square) - 1;
            int num_2 = this.getSquareColumnIndex(square);

            int num_squares = num_1;

            if (num_squares > num_2) {
                num_squares = num_2;
            }

            the_squares = new int[num_squares];

            for (int i = 0; i < num_squares; i++) {
                the_squares[i] = square + total_squares_per_row * (i + 1) - i - 1;
            }
        }

        return the_squares;
    }

    public int[] getBottomRightDiagonalSquares(int square) {
        int[] the_squares = null;

        if (!this.isBottomBorderSquare(square) && !this.isRightBorderSquare(square)) {
            int num_1 = this.getSquareRowIndex(square);
            int num_2 = total_squares_per_row - this.getSquareColumnIndex(square) - 1;

            int num_squares = num_1;

            if (num_squares > num_2) {
                num_squares = num_2;
            }

            the_squares = new int[num_squares];

            for (int i = 0; i < num_squares; i++) {
                the_squares[i] = square - total_squares_per_row * (i + 1) + i + 1;
            }
        }

        return the_squares;
    }

    public int[] getBottomLeftDiagonalSquares(int square) {
        int[] the_squares = null;

        if (!this.isBottomBorderSquare(square) && !this.isLeftBorderSquare(square)) {
            int num_1 = this.getSquareRowIndex(square);
            int num_2 = this.getSquareColumnIndex(square);

            int num_squares = num_1;

            if (num_squares > num_2) {
                num_squares = num_2;
            }

            the_squares = new int[num_squares];

            for (int i = 0; i < num_squares; i++) {
                the_squares[i] = square - total_squares_per_row * (i + 1) - i - 1;
            }
        }

        return the_squares;
    }

    //Re touched
    public boolean isKingInCheck(int piece_side, int piece_virtual_id, int piece_virtual_sqaure_position, Piece virtual_captured_piece) {
        Piece king_piece = null;
        //Re touched block of code

        Piece[] pieces = board.getAllPieces();

        for (int i = 0; i < pieces.length; i++) {
            Piece piece = pieces[i];
            if (piece_side == piece.Me()
                    && piece.piece_name == Constants.King) {
                king_piece = piece;
                break;
            }
        }

        if (king_piece == null) {
            return false;
        }

        int king_square_pos = king_piece.getPieceSquarePosition();

        ChessMove chess_move = new ChessMove();

        for (int i = 0; i < pieces.length; i++) {

            if (piece_side == pieces[i].Me()) {
                continue;
            }

            Piece piece = pieces[i];
            int piece_square_pos = -1;

            piece_square_pos = piece.getPieceSquarePosition();

            if (piece.getPieceID() == piece_virtual_id) {
                if (piece_virtual_sqaure_position != -1 && piece_virtual_sqaure_position != Constants.NOTHING) {
                    piece_square_pos = piece_virtual_sqaure_position;

                }
            }

            if (piece_square_pos == -1 || piece_square_pos == Constants.NOTHING) {
                continue;
            }

            if (piece.piece_name == Constants.Rook) {
                if (isKingInCheckByRookAtSquare(piece_square_pos, king_square_pos, piece.Me(), virtual_captured_piece)) {
                    System.err.println("rook on square " + piece_square_pos + " checks king on square " + king_square_pos);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Knight) {
                chess_move = this.getKnightMoveAnalysis(chess_move, piece_square_pos, -1, piece.Me(), piece_virtual_id, piece_virtual_sqaure_position);
                if (containsSquareIn(chess_move.getValidSquares(), king_square_pos)) {
                    System.err.println("knight on square " + piece_square_pos + " checks king on square " + king_square_pos);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Bishop) {
                if (isKingInCheckByBishopAtSquare(piece_square_pos, king_square_pos, piece.Me(), virtual_captured_piece)) {
                    System.err.println("bishop on square " + piece_square_pos + " checks king on square " + king_square_pos);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Queen) {
                if (isKingInCheckByQueenAtSquare(piece_square_pos, king_square_pos, piece.Me(), virtual_captured_piece)) {
                    System.err.println("queen on square " + piece_square_pos + " checks king on square " + king_square_pos);
                    return true;
                }
            }

            //Pawn capture diferrently from the way they move unlike other pieces
            if (piece.piece_name == Constants.Pawn) {
                //Pawn capture diferrently from the way they move unlike other pieces
                int[] pawn_caputure_squares = this.getPawnCapturableSquares(piece_square_pos, piece.Me());
                if (containsSquareIn(pawn_caputure_squares, king_square_pos)) {
                    System.err.println("pawn on square " + piece_square_pos + " checks king on square " + king_square_pos);
                    return true;
                }
            }

        }

        return false;
    }

    //Re touched
    public boolean willKingBeInCheckAtSquare(Piece king_piece, int king_to_square, Piece virtual_captured_piece, int piece_virtual_id, int piece_virtual_sqaure_position) {
        //Re touched block of code
        if (king_piece == null) {
            return false;
        }

        int type = king_piece.Me();

        Piece[] pieces = board.getAllPieces();

        for (int i = 0; i < pieces.length; i++) {

            if (type == pieces[i].Me()) {
                continue;
            }

            Piece piece = pieces[i];
            int piece_square_pos = -1;

            piece_square_pos = piece.getPieceSquarePosition();

            if (piece.getPieceID() == piece_virtual_id) {
                if (piece_virtual_sqaure_position != -1 && piece_virtual_sqaure_position != Constants.NOTHING) {
                    piece_square_pos = piece_virtual_sqaure_position;

                }
            }

            if (piece_square_pos == -1 || piece_square_pos == Constants.NOTHING) {
                continue;
            }

            if (piece.piece_name == Constants.King) {
                if (isKingInUnderAttackByOpponentKingAtSquare(piece_square_pos, king_to_square, piece.Me(), virtual_captured_piece)) {
                    //System.err.println("invalid move - king will be in check by king on square "+king_to_square);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Rook) {
                if (isKingInCheckByRookAtSquare(piece_square_pos, king_to_square, piece.Me(), virtual_captured_piece)) {
                    //System.err.println("invalid move - king will be in check by rook on square "+king_to_square);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Knight) {
                int[] knight_caputure_squares = this.getKnightCapturableSquares(piece_square_pos);
                if (containsSquareIn(knight_caputure_squares, king_to_square)) {
                    //System.err.println("invalid move - king will be in check by knight on square "+king_to_square);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Bishop) {
                if (isKingInCheckByBishopAtSquare(piece_square_pos, king_to_square, piece.Me(), virtual_captured_piece)) {
                    //System.err.println("invalid move - king will be in check by bishop on square "+king_to_square);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Queen) {
                if (isKingInCheckByQueenAtSquare(piece_square_pos, king_to_square, piece.Me(), virtual_captured_piece)) {
                    //System.err.println("invalid move - king will be in check by queen on square "+king_to_square);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Pawn) {
                int[] pawn_caputure_squares = this.getPawnCapturableSquares(piece_square_pos, piece.Me());
                if (containsSquareIn(pawn_caputure_squares, king_to_square)) {
                    //System.err.println("invalid move - king will be in check by pawn on square "+king_to_square);
                    return true;
                }
            }

        }

        return false;
    }

    //Re touched
    boolean willOwnKingBeInCheckWithOwnPieceMove(char moved_piece_name, int from_square, int to_square, int piece_side, int virtual_piece_id, int virtual_piece_square_position) {

        boolean is_check = false;
        int king_pos = -1;

        //Re touched block of code
        Piece[] pieces = board.getAllPieces();

        //first get the king position
        for (int i = 0; i < pieces.length; i++) {

            if (pieces[i].Me() != piece_side) {
                continue;
            }

            if (pieces[i].piece_name == Constants.King) {
                king_pos = pieces[i].getPieceSquarePosition();
                break;
            }

        }

        for (int i = 0; i < pieces.length; i++) {

            if (pieces[i].Me() == piece_side) {
                continue;
            }

            Piece piece = pieces[i];

            int piece_square_pos = -1;

            piece_square_pos = piece.getPieceSquarePosition();

            if (piece.getPieceID() == virtual_piece_id) {
                if (virtual_piece_square_position != -1 && virtual_piece_square_position != Constants.NOTHING) {
                    piece_square_pos = virtual_piece_square_position;

                }
            }

            if (piece_square_pos == -1 || piece_square_pos == Constants.NOTHING) {
                continue;
            }

            if (piece.piece_name == Constants.Pawn) {
                is_check = willOwnKingBeCheckByPawnWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square, piece.Me());
                if (is_check) {
                    //System.err.println("king will be in checked by "+Constants.Pawn+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Bishop) {
                is_check = willOwnKingBeCheckByBishopWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square);
                if (is_check) {
                    //System.err.println("king will be in checked by "+Constants.Bishop+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);                     
                    return true;
                }
            }

            if (piece.piece_name == Constants.Rook) {
                is_check = willOwnKingBeCheckByRookWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square);
                if (is_check) {
                    //System.err.println("king will be in checked by "+Constants.Rook+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Knight) {
                is_check = willOwnKingBeCheckByKnightWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square);
                if (is_check) {
                    //System.err.println("king will be in checked by "+Constants.Knight+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);
                    return true;
                }
            }

            if (piece.piece_name == Constants.Queen) {
                is_check = willOwnKingBeCheckByQueenWithOwnPieceMove(piece_square_pos, king_pos, from_square, to_square);
                if (is_check) {
                    //System.err.println("king will be in checked by "+Constants.Queen+" at square "+piece.getPieceSquarePosition()+" if "+moved_piece_name+" moves to square "+to_square);
                    return true;
                }
            }

        }

        return is_check;
    }

    boolean containsSquareIn(int[] square_array, int argu) {

        for (int i = square_array.length - 1; i > -1; i--) {
            if (square_array[i] == argu) {
                return true;
            }
        }

        return false;
    }

    public void setMoveCountWithoutCaptureAndPawnMove(Piece piece_moved, boolean is_capture) {

        if (piece_moved.piece_name == Constants.Pawn || is_capture) {
            white_move_count_without_capture_and_pawn_move = 0;
            black_move_count_without_capture_and_pawn_move = 0;
            return;
        }

        if (piece_moved.isBlack()) {
            black_move_count_without_capture_and_pawn_move++;
        } else {
            white_move_count_without_capture_and_pawn_move++;
        }
    }

    public boolean isFiftyMoveRule() {
        is_valid_fifty_move_rule_draw = black_move_count_without_capture_and_pawn_move >= 50
                && white_move_count_without_capture_and_pawn_move >= 50;

        return is_valid_fifty_move_rule_draw;
    }

    public boolean isThreefoldRepetition() {
        System.err.println("NOT YET IMPLEMENTED -isThreefoldRepetition() ");

        return is_valid_threefold_repetitions_draw;
    }

    /**
     * Checkmate ends the game with a winner and a loser. This is when no legal
     * move can be made own king or any own piece to remove the king from check.
     *
     * @return
     */
    public boolean isWhiteKingCheckmated() {
        return isCheckmate(Side.white, -1, -1);
    }

    /**
     * Checkmate ends the game with a winner and a loser. This is when no legal
     * move can be made own king or any own piece to remove the king from check.
     *
     * @return
     */
    public boolean isBlackKingCheckmated() {
        return isCheckmate(Side.black, -1, -1);
    }

    /**
     * Checkmate ends the game with a winner and a loser. This is when no legal
     * move can be made own king or any own piece to remove the king from check.
     *
     * @return
     */
    public boolean isCheckmate(int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        if (isKingInCheck(piece_side, piece_virtual_id, piece_virtual_square_position, null))//king is in check.
        {
            if (!hasAnyLegalMove(piece_side, piece_virtual_id, piece_virtual_square_position))//has no legal move.
            {
                return true;
            }
        }

        return false;
    }

    /**
     * The game is automatically a draw if the player to move is not in check
     * but has no legal move. This situation is called a stalemate.
     *
     * @return
     */
    public boolean isStalemate(int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        if (!isKingInCheck(piece_side, piece_virtual_id, piece_virtual_square_position, null))//king is not in check.
        {
            if (!hasAnyLegalMove(piece_side, piece_virtual_id, piece_virtual_square_position))//has no legal move.
            {
                return true;
            }
        }

        return false;
    }

    /**
     * The game ends in a draw if any of these conditions occur:
     * <p>
     *
     * The game is automatically a draw if the player to move is not in check
     * but has no legal move. This situation is called a stalemate. <br>
     * The game is immediately drawn when there is no possibility of checkmate
     * for either side with any series of legal moves. This draw is often due to
     * insufficient material, including the endgames
     * <p>
     * king against king;<br>
     * king against king and bishop;<br>
     * king against king and knight;<br>
     * king and bishop against king and bishop, with both bishops on squares of
     * the same color <br>
     *
     * @param piece_side
     * @return
     */
    protected boolean isDrawByInsufficientMaterials(int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        //Re touched block of code
        //check for insufficient materials (pieces)
        boolean is_white_king = false;
        boolean is_black_king = false;

        boolean is_white_knight = false;
        boolean is_black_knight = false;

        boolean is_white_bishop = false;
        boolean is_black_bishop = false;

        int is_white_bishop_square_color = -1;
        int is_black_bishop_square_color = -1;

        int piece_count = 0;

        Piece[] pieces = board.getAllPieces();

        for (int i = 0; i < pieces.length; i++) {

            if (pieces[i].getPieceSquarePosition() == -1
                    || pieces[i].getPieceSquarePosition() == Constants.NOTHING) {
                continue;
            }

            piece_count++;

            if (pieces[i].piece_name == Constants.King) {
                if (pieces[i].isWhite()) {
                    is_white_king = true;
                } else {
                    is_black_king = true;
                }
            }

            if (pieces[i].piece_name == Constants.Knight) {
                if (pieces[i].isWhite()) {
                    is_white_knight = true;
                } else {
                    is_black_knight = true;
                }
            }

            if (pieces[i].piece_name == Constants.Bishop) {
                if (pieces[i].isWhite()) {
                    is_white_bishop = true;
                    is_white_bishop_square_color = pieces[i].getSquareColor();
                } else {
                    is_black_bishop = true;
                    is_black_bishop_square_color = pieces[i].getSquareColor();
                }
            }

        }

        //king against king
        if (piece_count == 2) {
            if (is_white_king && is_black_king) {
                return true;
            }
        }

        //white king against black king and black knight
        if (piece_count == 3) {
            if (is_white_king && is_black_king && is_black_knight) {
                return true;
            }
        }

        //black king against white king and white knight
        if (piece_count == 3) {
            if (is_black_king && is_white_king && is_white_knight) {
                return true;
            }
        }

        //white king against black king and black bishop        
        if (piece_count == 3) {
            if (is_white_king && is_black_king && is_black_bishop) {
                return true;
            }
        }

        //black king against white king and white bishop
        if (piece_count == 3) {
            if (is_black_king && is_white_king && is_white_bishop) {
                return true;
            }
        }

        //white king and white bishop against black king and black bishop with both bishops having same square color
        if (piece_count == 4) {
            if (is_white_king && is_white_bishop && is_black_king && is_black_bishop) {
                if (is_white_bishop_square_color == is_black_bishop_square_color) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean hasAnyLegalMove(int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        ChessMove move = new ChessMove();//A new or different ChessMove object must be used in this method
        int piece_square_pos = -1;
        //Re touched block of code      
        Piece[] pieces = board.getAllPieces();

        for (int i = 0; i < pieces.length; i++) {
            if (pieces[i].Me() != piece_side) {
                continue;
            }

            Piece piece = pieces[i];

            piece_square_pos = piece.getPieceSquarePosition();

            if (piece_square_pos == -1 || piece_square_pos == Constants.NOTHING) {
                continue;
            }

            if (piece.piece_name == Constants.King) {
                this.getKingMoveAnalysis(move, piece_square_pos, -1, piece.Me(), piece_virtual_id, piece_virtual_square_position);
                //System.out.println("king total valid move  "+move.getValidSquares().length);
            } else if (piece.piece_name == Constants.Pawn) {
                this.getPawnMoveAnalysis(move, piece_square_pos, -1, piece.Me(), piece.isEnPassantOpportunity(), piece_virtual_id, piece_virtual_square_position);
                //System.out.println("pawn total valid move  "+move.getValidSquares().length);
            } else if (piece.piece_name == Constants.Rook) {
                this.getRookMoveAnalysis(move, piece_square_pos, -1, piece.Me(), piece_virtual_id, piece_virtual_square_position);
                // System.out.println("rook total valid move  "+move.getValidSquares().length);
            } else if (piece.piece_name == Constants.Knight) {
                this.getKnightMoveAnalysis(move, piece_square_pos, -1, piece.Me(), piece_virtual_id, piece_virtual_square_position);
                //System.out.println("knight total valid move  "+move.getValidSquares().length);
            } else if (piece.piece_name == Constants.Bishop) {
                this.getBishopMoveAnalysis(move, piece_square_pos, -1, piece.Me(), piece_virtual_id, piece_virtual_square_position);
                //System.out.println("bishop total valid move  "+move.getValidSquares().length);                
            } else if (piece.piece_name == Constants.Queen) {
                this.getQueenMoveAnalysis(move, piece_square_pos, -1, piece.Me(), piece_virtual_id, piece_virtual_square_position);
                //System.out.println("queen total valid move  "+move.getValidSquares().length);                
            }

            //System.out.println("total valid move  "+move.getValidSquares().length);
            if (move.getValidSquares().length > 0) {
                return true;//since there is at least one valid move to be made 
            }
        }

        return false;
    }

    //Re touched
    public ChessMove.Castle isCastlingAllow(ChessMove.Castle castle, Piece king_piece, int from_square, int to_square) {

        //check for any right to castle
        if (king_piece.isWhite()) {
            if (!board.canWhiteShortCastle && !board.canWhiteLongCastle) {
                castle = new ChessMove().getCastle();
                String msg = "Cannot castle - no castle rights";
                castle.setInvalidCastleMessage(msg);
            }
        } else {
            if (!board.canBlackShortCastle && !board.canBlackLongCastle) {
                castle = new ChessMove().getCastle();
                String msg = "Cannot castle - no castle rights";
                castle.setInvalidCastleMessage(msg);
            }
        }

        int castle_options = 0;

        //initialize
        castle.setCastleKing(king_piece);
        castle.setLeftCastleRook(null);
        castle.setRightCastleRook(null);
        castle.setKingLeftCastleSquarePositon(-1);
        castle.setLeftRookCastleSquarePositon(-1);
        castle.setRightRookCastleSquarePositon(-1);
        castle.setCastleOpportunity(false);

        if (king_piece == null) {
            return castle;
        }

        if (king_piece.piece_name != Constants.King) {
            return castle;
        }

        if (Math.abs(from_square - to_square) != 2) {
            return castle;
        }

        int mid_square = -1;
        if (from_square > to_square) {
            mid_square = from_square - 1;
        } else {
            mid_square = from_square + 1;
        }

        //At this piont it is a king piece
        //NOTE THE RULE: The king may not currently be in check, nor may the king pass through or end up in a square
        //that is under attack by an enemy piece (though the rook is permitted to be under attack and 
        //to pass over an attacked square);
        //check if the king is currently in check 
        if (this.isKingInCheck(king_piece.Me(), -1, -1, null)) {
            String msg = "Cannot castle - the king is currently in check";
            castle.setInvalidCastleMessage(msg);
            return castle;
        }

        //check if the king passes through a square that is under attack
        if (this.willKingBeInCheckAtSquare(king_piece, mid_square, null, -1, -1)) {
            String msg = "Cannot castle - the king passes through a square that is under attack by enemy piece";
            castle.setInvalidCastleMessage(msg);
            return castle;
        }

        //check if the king passes through a square that is under attack
        if (this.willKingBeInCheckAtSquare(king_piece, to_square, null, -1, -1)) {
            String msg = "Cannot castle - the king will end up in a square that is under attack by enemy piece";
            castle.setInvalidCastleMessage(msg);
            return castle;
        }

        if (!king_piece.isFirstMove()) {
            return castle;
        }

        //Get king row position 
        int king_row_index = getSquareRowIndex(king_piece.getPieceSquarePosition());

        //Get Rooks on this king row index
        Piece rook_piece_1 = null;
        Piece rook_piece_2 = null;

        Piece[] pieces = board.getAllPieces();
        for (int i = 0; i < pieces.length; i++) {

            if (pieces[i].Me() != king_piece.Me()) {
                continue;
            }

            if (pieces[i].piece_name == Constants.Rook) {
                if (getSquareRowIndex(pieces[i].getPieceSquarePosition()) == king_row_index) {
                    rook_piece_1 = pieces[i];
                    break;
                }
            }
        }

        for (int i = 0; i < pieces.length; i++) {

            if (pieces[i].Me() != king_piece.Me()) {
                continue;
            }

            if (rook_piece_1 != null) {
                if (pieces[i].equals(rook_piece_1)) {
                    continue;
                }
            }

            if (pieces[i].piece_name == Constants.Rook) {
                if (getSquareRowIndex(pieces[i].getPieceSquarePosition()) == king_row_index) {
                    rook_piece_2 = pieces[i];
                    break;
                }
            }
        }

        //check king_piece and rook_piece_1
        if (rook_piece_1 != null) {

            if (!rook_piece_1.isFirstMove()) {
                return castle;
            }

            int king_square = king_piece.getPieceSquarePosition();
            int rook_1_square = rook_piece_1.getPieceSquarePosition();
            boolean is_empty = true;

            if (king_square > rook_1_square) {
                if ((king_square - rook_1_square) >= 3) {
                    for (int i = rook_1_square + 1; i < king_square; i++) {
                        if (!isSquareEmpty(i, -1)) {
                            is_empty = false;
                            String msg = "Cannot castle - there must be no piece between your king and rook on the same rank.";
                            castle.setInvalidCastleMessage(msg);
                            break;
                        }
                    }

                    if (is_empty) {
                        castle_options++;
                        castle.setCastleKing(king_piece);
                        castle.setLeftCastleRook(rook_piece_1);
                        castle.setRightCastleRook(null);//nullify rhs rook just in case
                        castle.setKingLeftCastleSquarePositon(king_square - 2);
                        castle.setLeftRookCastleSquarePositon(king_square - 1);
                        castle.setCastleOpportunity(true);
                    }
                }
            }

            if (rook_1_square > king_square) {
                if ((rook_1_square - king_square) >= 3) {
                    for (int i = king_square + 1; i < rook_1_square; i++) {
                        if (!isSquareEmpty(i, -1)) {
                            is_empty = false;
                            String msg = "Cannot castle - there must be no piece between your king and rook on the same rank.";
                            castle.setInvalidCastleMessage(msg);
                            break;
                        }
                    }

                    if (is_empty) {
                        castle_options++;
                        castle.setCastleKing(king_piece);
                        castle.setRightCastleRook(rook_piece_1);
                        castle.setLeftCastleRook(null);//nullify lhs rook just in case                        
                        castle.setKingRightCastleSquarePositon(king_square + 2);
                        castle.setRightRookCastleSquarePositon(king_square + 1);
                        castle.setCastleOpportunity(true);
                    }
                }
            }

        }

        //check king_piece and rook_piece_2
        if (rook_piece_2 != null) {

            if (!rook_piece_2.isFirstMove()) {
                return castle;
            }

            int king_square = king_piece.getPieceSquarePosition();
            int rook_2_square = rook_piece_2.getPieceSquarePosition();
            boolean is_empty = true;

            if (king_square > rook_2_square) {
                if ((king_square - rook_2_square) >= 3) {
                    for (int i = rook_2_square + 1; i < king_square; i++) {
                        if (!isSquareEmpty(i, -1)) {
                            is_empty = false;
                            String msg = "Cannot castle - there must be no piece between your king and rook on the same rank.";
                            castle.setInvalidCastleMessage(msg);
                            break;
                        }
                    }

                    if (is_empty) {
                        castle_options++;
                        castle.setCastleKing(king_piece);
                        castle.setLeftCastleRook(rook_piece_2);
                        castle.setRightCastleRook(null);//nullify rhs rook just in case                                                
                        castle.setKingLeftCastleSquarePositon(king_square - 2);
                        castle.setLeftRookCastleSquarePositon(king_square - 1);
                        castle.setCastleOpportunity(true);
                    }

                }
            }

            if (rook_2_square > king_square) {
                if ((rook_2_square - king_square) >= 3) {
                    for (int i = king_square + 1; i < rook_2_square; i++) {
                        if (!isSquareEmpty(i, -1)) {
                            is_empty = false;
                            String msg = "Cannot castle - there must be no piece between your king and rook on the same rank.";
                            castle.setInvalidCastleMessage(msg);
                            break;
                        }
                    }

                    if (is_empty) {
                        castle_options++;
                        castle.setCastleKing(king_piece);
                        castle.setRightCastleRook(rook_piece_2);
                        castle.setLeftCastleRook(null);//nullify lhs rook just in case                          
                        castle.setKingRightCastleSquarePositon(king_square + 2);
                        castle.setRightRookCastleSquarePositon(king_square + 1);
                        castle.setCastleOpportunity(true);
                    }
                }
            }
        }

        //Here verify castling rights having know the direction of castle
        if (castle.isKingSideCastle()) {
            if (king_piece.isWhite()) {
                if (!board.canWhiteShortCastle) {
                    castle = new ChessMove().getCastle();
                    String msg = "Cannot castle - no right to castle short";
                    castle.setInvalidCastleMessage(msg);
                }
            } else {
                if (!board.canBlackShortCastle) {
                    castle = new ChessMove().getCastle();
                    String msg = "Cannot castle - no right to castle short";
                    castle.setInvalidCastleMessage(msg);
                }
            }
        } else if (castle.isQueenSideCastle()) {//must use else if - important!!!
            if (king_piece.isWhite()) {
                if (!board.canWhiteLongCastle) {
                    castle = new ChessMove().getCastle();
                    String msg = "Cannot castle - no right to castle long";
                    castle.setInvalidCastleMessage(msg);
                }
            } else {
                if (!board.canBlackLongCastle) {
                    castle = new ChessMove().getCastle();
                    String msg = "Cannot castle - no right to castle long";
                    castle.setInvalidCastleMessage(msg);
                }
            }
        }

        return castle;
    }

    public ChessMove.Castle isCastlingAllow_1(ChessMove.Castle castle, Piece king_piece, int from_square, int to_square) {

        int castle_options = 0;

        //initialize
        castle.setCastleKing(king_piece);
        castle.setLeftCastleRook(null);
        castle.setRightCastleRook(null);
        castle.setKingLeftCastleSquarePositon(-1);
        castle.setLeftRookCastleSquarePositon(-1);
        castle.setRightRookCastleSquarePositon(-1);
        castle.setCastleOpportunity(false);

        if (king_piece == null) {
            return castle;
        }

        if (king_piece.piece_name != Constants.King) {
            return castle;
        }

        //At this piont it is a king piece
        
        //NOTE THE RULE: The king may not currently be in check, nor may the king pass through or end up in a square
        //that is under attack by an enemy piece (though the rook is permitted to be under attack and 
        //to pass over an attacked square);

        if (!king_piece.isFirstMove()) {
            return castle;
        }
        
        
        //check if the king is in check or will end up or passes through a square that is under attack 
        
        int origin_sq = board.getKingOriginSquare(king_piece.Me());

        int long_cstl_sq = king_piece.isWhite() ? board.WHITE_KING_LONG_CASTLE_SQUARE : board.BLACK_KING_LONG_CASTLE_SQUARE;
        int short_cstl_sq = king_piece.isWhite() ? board.WHITE_KING_SHORT_CASTLE_SQUARE : board.BLACK_KING_SHORT_CASTLE_SQUARE;

        boolean is_long_castle_attempt = false;
        boolean is_short_castle_attempt = false;
        
        if (from_square != origin_sq) {
            return castle;//not a castle attepmt
        } else if (to_square != long_cstl_sq && to_square != short_cstl_sq) {
            return castle;//not a castle attepmt
        }else if (to_square == long_cstl_sq){
            is_long_castle_attempt = true;
        }else if (to_square == short_cstl_sq){
            is_short_castle_attempt = true;
        }

        //At this point it is a castle attempt
       
        castle.setIsCastleAttempt(true);
        
        boolean is_white = king_piece.isWhite();
        
        //check for any right to castle
        if (is_white) {
            if (!board.canWhiteShortCastle && !board.canWhiteLongCastle) {
                String msg = "Cannot castle - no castle rights";
                castle.setInvalidCastleMessage(msg);
                return castle;
            }
        } else {
            if (!board.canBlackShortCastle && !board.canBlackLongCastle) {
                String msg = "Cannot castle - no castle rights";
                castle.setInvalidCastleMessage(msg);
                return castle;
            }
        }
        
        if (is_long_castle_attempt && is_white&& !board.canWhiteLongCastle ) {
            String msg = "Cannot castle - no right to castle long";
            castle.setInvalidCastleMessage(msg);
            return castle;
        }else if (is_long_castle_attempt && !is_white && !board.canBlackLongCastle ) {
            String msg = "Cannot castle - no right to castle long";
            castle.setInvalidCastleMessage(msg);
            return castle;
        }else if (is_short_castle_attempt && is_white && !board.canWhiteShortCastle ) {
            String msg = "Cannot castle - no right to castle short";
            castle.setInvalidCastleMessage(msg);
            return castle;
        }else if (is_short_castle_attempt && !is_white && !board.canBlackShortCastle ) {
            String msg = "Cannot castle - no right to castle short";
            castle.setInvalidCastleMessage(msg);
            return castle;
        }
                

        //check if the king is currently in check 
        if (this.isKingInCheck(king_piece.Me(), -1, -1, null)) {
            String msg = "Cannot castle - king is currently in check";
            castle.setInvalidCastleMessage(msg);
            return castle;
        }

        if (this.willKingBeInCheckAtSquare(king_piece, to_square, null, -1, -1)) {
            String msg = "Cannot castle - king cannot end up in a square under attack";
            castle.setInvalidCastleMessage(msg);
            return castle;
        }

        if (to_square > origin_sq) {
        
            for (int sq = origin_sq; sq < to_square; sq++) {
                if (this.willKingBeInCheckAtSquare(king_piece, sq, null, -1, -1)) {
                    String msg = "Cannot castle - king cannot pass through a square under attack";
                    castle.setInvalidCastleMessage(msg);
                    return castle;
                }
            }
        
        } else {

            for (int sq = to_square; sq > origin_sq -1; sq--) {
                if (this.willKingBeInCheckAtSquare(king_piece, sq, null, -1, -1)) {
                    String msg = "Cannot castle - king cannot pass through a square under attack";
                    castle.setInvalidCastleMessage(msg);
                    return castle;
                }
            }
        }

        
        
        //check if piece is between king and rook
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        //Get king row position 
        int king_row_index = getSquareRowIndex(king_piece.getPieceSquarePosition());

        //Get Rooks on this king row index
        Piece rook_piece_1 = null;
        Piece rook_piece_2 = null;

        Piece[] pieces = board.getAllPieces();
        for (int i = 0; i < pieces.length; i++) {

            if (pieces[i].Me() != king_piece.Me()) {
                continue;
            }

            if (pieces[i].piece_name == Constants.Rook) {
                if (getSquareRowIndex(pieces[i].getPieceSquarePosition()) == king_row_index) {
                    rook_piece_1 = pieces[i];
                    break;
                }
            }
        }

        for (int i = 0; i < pieces.length; i++) {

            if (pieces[i].Me() != king_piece.Me()) {
                continue;
            }

            if (rook_piece_1 != null) {
                if (pieces[i].equals(rook_piece_1)) {
                    continue;
                }
            }

            if (pieces[i].piece_name == Constants.Rook) {
                if (getSquareRowIndex(pieces[i].getPieceSquarePosition()) == king_row_index) {
                    rook_piece_2 = pieces[i];
                    break;
                }
            }
        }

        //check king_piece and rook_piece_1
        if (rook_piece_1 != null) {

            if (!rook_piece_1.isFirstMove()) {
                return castle;
            }

            int king_square = king_piece.getPieceSquarePosition();
            int rook_1_square = rook_piece_1.getPieceSquarePosition();
            boolean is_empty = true;

            if (king_square > rook_1_square) {
                if ((king_square - rook_1_square) >= 3) {
                    for (int i = rook_1_square + 1; i < king_square; i++) {
                        if (!isSquareEmpty(i, -1)) {
                            is_empty = false;
                            String msg = "Cannot castle - there must be no piece between your king and rook on the same rank.";
                            castle.setInvalidCastleMessage(msg);
                            break;
                        }
                    }

                    if (is_empty) {
                        castle_options++;
                        castle.setCastleKing(king_piece);
                        castle.setLeftCastleRook(rook_piece_1);
                        castle.setRightCastleRook(null);//nullify rhs rook just in case
                        castle.setKingLeftCastleSquarePositon(king_square - 2);
                        castle.setLeftRookCastleSquarePositon(king_square - 1);
                        castle.setCastleOpportunity(true);
                    }
                }
            }

            if (rook_1_square > king_square) {
                if ((rook_1_square - king_square) >= 3) {
                    for (int i = king_square + 1; i < rook_1_square; i++) {
                        if (!isSquareEmpty(i, -1)) {
                            is_empty = false;
                            String msg = "Cannot castle - there must be no piece between your king and rook on the same rank.";
                            castle.setInvalidCastleMessage(msg);
                            break;
                        }
                    }

                    if (is_empty) {
                        castle_options++;
                        castle.setCastleKing(king_piece);
                        castle.setRightCastleRook(rook_piece_1);
                        castle.setLeftCastleRook(null);//nullify lhs rook just in case                        
                        castle.setKingRightCastleSquarePositon(king_square + 2);
                        castle.setRightRookCastleSquarePositon(king_square + 1);
                        castle.setCastleOpportunity(true);
                    }
                }
            }

        }

        //check king_piece and rook_piece_2
        if (rook_piece_2 != null) {

            if (!rook_piece_2.isFirstMove()) {
                return castle;
            }

            int king_square = king_piece.getPieceSquarePosition();
            int rook_2_square = rook_piece_2.getPieceSquarePosition();
            boolean is_empty = true;

            if (king_square > rook_2_square) {
                if ((king_square - rook_2_square) >= 3) {
                    for (int i = rook_2_square + 1; i < king_square; i++) {
                        if (!isSquareEmpty(i, -1)) {
                            is_empty = false;
                            String msg = "Cannot castle - there must be no piece between your king and rook on the same rank.";
                            castle.setInvalidCastleMessage(msg);
                            break;
                        }
                    }

                    if (is_empty) {
                        castle_options++;
                        castle.setCastleKing(king_piece);
                        castle.setLeftCastleRook(rook_piece_2);
                        castle.setRightCastleRook(null);//nullify rhs rook just in case                                                
                        castle.setKingLeftCastleSquarePositon(king_square - 2);
                        castle.setLeftRookCastleSquarePositon(king_square - 1);
                        castle.setCastleOpportunity(true);
                    }

                }
            }

            if (rook_2_square > king_square) {
                if ((rook_2_square - king_square) >= 3) {
                    for (int i = king_square + 1; i < rook_2_square; i++) {
                        if (!isSquareEmpty(i, -1)) {
                            is_empty = false;
                            String msg = "Cannot castle - there must be no piece between your king and rook on the same rank.";
                            castle.setInvalidCastleMessage(msg);
                            break;
                        }
                    }

                    if (is_empty) {
                        castle_options++;
                        castle.setCastleKing(king_piece);
                        castle.setRightCastleRook(rook_piece_2);
                        castle.setLeftCastleRook(null);//nullify lhs rook just in case                          
                        castle.setKingRightCastleSquarePositon(king_square + 2);
                        castle.setRightRookCastleSquarePositon(king_square + 1);
                        castle.setCastleOpportunity(true);
                    }
                }
            }
        }


        return castle;
    }

    /*IMPORTANT NOTE: this may will not be CALLED by the chess engine when thinking
     *because hasEnPassantOpportunity and removeEnPassantOpportunity methods are
     *not required. 
     * 
     */
    public ChessMove getPieceMoveAnalysis(ChessMove new_move,
            char peice_name,
            int piece_side,
            boolean is_first_move,
            int from_square,
            int to_square) {

        boolean has_en_passant = hasEnPassantOpportunity(piece_side);

        if (peice_name == Constants.King) {
            new_move = getKingMoveAnalysis(new_move, from_square, to_square, piece_side, -1, -1);
        }

        if (peice_name == Constants.Queen) {
            new_move = getQueenMoveAnalysis(new_move, from_square, to_square, piece_side, -1, -1);
        }

        if (peice_name == Constants.Bishop) {
            new_move = getBishopMoveAnalysis(new_move, from_square, to_square, piece_side, -1, -1);
        }

        if (peice_name == Constants.Knight) {
            new_move = getKnightMoveAnalysis(new_move, from_square, to_square, piece_side, -1, -1);
        }

        if (peice_name == Constants.Rook) {
            new_move = getRookMoveAnalysis(new_move, from_square, to_square, piece_side, -1, -1);
        }

        if (peice_name == Constants.Pawn) {
            new_move = getPawnMoveAnalysis(new_move, from_square, to_square, piece_side, has_en_passant, -1, -1);
        }

        if (new_move.isMoveValid()) {
            removeEnPassantOpportunity(piece_side);
        }

        return new_move;
    }

    public ChessMove getPieceMoveAnalysis(ChessMove new_move, Piece piece, int piece_side) {
        return getPieceMoveAnalysis(new_move, piece.piece_name, piece.Me(), piece.isFirstMove(), piece.getPieceSquarePosition(), -1);
    }

    //Re touched
    private boolean isOccupied(int square) {

        Piece[] pieces = board.getAllPieces();

        for (int i = pieces.length - 1; i > -1; i--) {
            if (square == pieces[i].getPieceSquarePosition()) {
                return true;
            }
        }

        return false;
    }

    //Re touched
    private boolean isOccupiedExceptOpponentKingAndVirtualCapturedPiece(int square, int peice_side, Piece virtual_captured_piece) {

        Piece[] pieces = board.getAllPieces();

        for (int i = pieces.length - 1; i > -1; i--) {

            Piece piece = pieces[i];

            if (virtual_captured_piece != null) {
                if (peice_side == virtual_captured_piece.Me()) {
                    if (virtual_captured_piece.getPieceID() == piece.getPieceID()) {
                        continue;
                    }
                }
            }

            if (peice_side != piece.Me()
                    && piece.piece_name == Constants.King) {
                continue;
            }

            if (square == piece.getPieceSquarePosition()) {
                return true;
            }

        }

        return false;
    }

    //Re touched
    private boolean isOccupiedBySamePiece(int square, int piece_side) {

        Piece[] pieces = board.getAllPieces();

        for (int i = pieces.length - 1; i > -1; i--) {
            if (square == pieces[i].getPieceSquarePosition()
                    && piece_side == pieces[i].Me()) {

                return true;
            }
        }

        return false;
    }

    //Re touched
    private boolean isOccupiedByOpponentPiece(int square, int piece_side) {

        Piece[] pieces = board.getAllPieces();

        for (int i = 0; i < pieces.length; i++) {
            if (square == pieces[i].getPieceSquarePosition()
                    && piece_side != pieces[i].Me()) {
                return true;
            }
        }

        return false;
    }

    public ChessMove getKnightMoveAnalysis(ChessMove new_move, int from_square, int to_square, int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not        

        int pos1 = -1;
        int pos2 = -1;
        int pos3 = -1;
        int pos4 = -1;
        int pos5 = -1;
        int pos6 = -1;
        int pos7 = -1;
        int pos8 = -1;

        int index = -1;

        int[] postions = new int[8];

        int[] vert_up = getVerticalUpwardSquares(from_square);
        int[] vert_down = getVerticalDownwardSquares(from_square);
        int[] horiz_left = getHorizontalLeftwardSquares(from_square);
        int[] horiz_right = getHorizontalRightwardSquares(from_square);

        //handle vert_up
        if (vert_up != null) {
            if (vert_up.length >= 2) {

                int pos = vert_up[1];
                int[] n = getHorizontalLeftwardSquares(pos);
                int[] m = getHorizontalRightwardSquares(pos);

                if (n != null) {
                    if (n.length > 0) {
                        pos1 = n[0];

                        if (!isOccupiedBySamePiece(pos1, piece_side)) {
                            index++;
                            postions[index] = pos1;
                        }

                    }
                }

                if (m != null) {
                    if (m.length > 0) {
                        pos2 = m[0];
                        if (!isOccupiedBySamePiece(pos2, piece_side)) {
                            index++;
                            postions[index] = pos2;
                        }
                    }
                }

            }
        }

        //handle vert_down
        if (vert_down != null) {
            if (vert_down.length >= 2) {

                int pos = vert_down[1];
                int[] n = getHorizontalLeftwardSquares(pos);
                int[] m = getHorizontalRightwardSquares(pos);

                if (n != null) {
                    if (n.length > 0) {
                        pos3 = n[0];
                        if (!isOccupiedBySamePiece(pos3, piece_side)) {
                            index++;
                            postions[index] = pos3;
                        }

                    }
                }

                if (m != null) {
                    if (m.length > 0) {
                        pos4 = m[0];
                        if (!isOccupiedBySamePiece(pos4, piece_side)) {
                            index++;
                            postions[index] = pos4;
                        }

                    }
                }

            }
        }

        //handle horiz_left
        if (horiz_left != null) {
            if (horiz_left.length >= 2) {

                int pos = horiz_left[1];
                int[] n = getVerticalUpwardSquares(pos);
                int[] m = getVerticalDownwardSquares(pos);

                if (n != null) {
                    if (n.length > 0) {
                        pos5 = n[0];
                        if (!isOccupiedBySamePiece(pos5, piece_side)) {
                            index++;
                            postions[index] = pos5;
                        }

                    }
                }

                if (m != null) {
                    if (m.length > 0) {
                        pos6 = m[0];
                        if (!isOccupiedBySamePiece(pos6, piece_side)) {
                            index++;
                            postions[index] = pos6;
                        }

                    }
                }

            }
        }

        //handle horiz_right
        if (horiz_right != null) {
            if (horiz_right.length >= 2) {

                int pos = horiz_right[1];
                int[] n = getVerticalUpwardSquares(pos);
                int[] m = getVerticalDownwardSquares(pos);

                if (n != null) {
                    if (n.length > 0) {
                        pos7 = n[0];
                        if (!isOccupiedBySamePiece(pos7, piece_side)) {
                            index++;
                            postions[index] = pos7;
                        }

                    }
                }

                if (m != null) {
                    if (m.length > 0) {
                        pos8 = m[0];
                        if (!isOccupiedBySamePiece(pos8, piece_side)) {
                            index++;
                            postions[index] = pos8;
                        }

                    }
                }

            }
        }

        int[] unresolved_valid_pos = new int[index + 1];

        System.arraycopy(postions, 0, unresolved_valid_pos, 0, index + 1);

        if (!this.containsSquareIn(unresolved_valid_pos, to_square)) {
            new_move.setInvalidMoveMessage("Knight must move one square up or down and two squares over or vice versa.\nKnights are the only pieces that jump over others");
            new_move.setIsValidMove(false);
        }

        //OPPONENT KING
        inspectOpponentKing(new_move, unresolved_valid_pos, to_square, piece_side);

        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        inspectOwnKing(new_move, Constants.Knight, unresolved_valid_pos, from_square, to_square, piece_side, piece_virtual_id, piece_virtual_square_position);

        return new_move;
    }

    public ChessMove getKingMoveAnalysis(ChessMove new_move, int from_square, int to_square, int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not

        int[] vert_up = getVerticalUpwardSquares(from_square);
        int[] vert_down = getVerticalDownwardSquares(from_square);
        int[] horiz_left = getHorizontalLeftwardSquares(from_square);
        int[] horiz_right = getHorizontalRightwardSquares(from_square);

        int[] top_right_diagonal = getTopRightDiagonalSquares(from_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(from_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(from_square);
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(from_square);

        Piece king_piece = this.getPieceOnSquare(from_square);

        Castle castle = this.isCastlingAllow(new_move.getCastle(), king_piece, from_square, to_square);

        if (king_piece.isFirstMove()) {
            if (!castle.isCastleOpportunity()
                    //&& Math.abs(from_square - to_square) == 2//COME BACK - CHESS960 NOT APPLICABLE WITH THIS CONDITION - PLEASE REVIEW THIS CONDITION LATER
                    && castle.isCastleAttempt())  
            {
                new_move.setInvalidMoveMessage(castle.getInvalidCastleMessage());
                new_move.setIsValidMove(false);
            }
        }

        int index = -1;
        int[] postions = new int[this.total_chess_pieces];

        Piece piece = this.getPieceByID(piece_virtual_id);
        int virtual_piece_side = piece != null ? piece.Me() : -1;

        if (vert_up != null) {
            if (vert_up.length > 0) {
                if (!isOccupiedBySamePiece(vert_up[0], piece_side)) {
                    index++;
                    postions[index] = vert_up[0];
                }

                if (virtual_piece_side != piece_side) {
                    if (piece_virtual_square_position == vert_up[0]) {
                        index++;
                        postions[index] = piece_virtual_square_position;
                    }
                }

            }
        }

        if (vert_down != null) {
            if (vert_down.length > 0) {
                if (!isOccupiedBySamePiece(vert_down[0], piece_side)) {
                    index++;
                    postions[index] = vert_down[0];
                }

                if (virtual_piece_side != piece_side) {
                    if (piece_virtual_square_position == vert_down[0]) {
                        index++;
                        postions[index] = piece_virtual_square_position;
                    }
                }

            }
        }

        if (horiz_left != null) {
            if (horiz_left.length > 0) {
                if (!isOccupiedBySamePiece(horiz_left[0], piece_side)) {
                    index++;
                    postions[index] = horiz_left[0];
                }

                if (virtual_piece_side != piece_side) {
                    if (piece_virtual_square_position == horiz_left[0]) {
                        index++;
                        postions[index] = piece_virtual_square_position;
                    }
                }

            }
        }

        if (horiz_right != null) {
            if (horiz_right.length > 0) {
                if (!isOccupiedBySamePiece(horiz_right[0], piece_side)) {
                    index++;
                    postions[index] = horiz_right[0];
                }

                if (virtual_piece_side != piece_side) {
                    if (piece_virtual_square_position == horiz_right[0]) {
                        index++;
                        postions[index] = piece_virtual_square_position;
                    }
                }

            }
        }

        if (top_right_diagonal != null) {
            if (top_right_diagonal.length > 0) {
                if (!isOccupiedBySamePiece(top_right_diagonal[0], piece_side)) {
                    index++;
                    postions[index] = top_right_diagonal[0];
                }

                if (virtual_piece_side != piece_side) {
                    if (piece_virtual_square_position == top_right_diagonal[0]) {
                        index++;
                        postions[index] = piece_virtual_square_position;
                    }
                }

            }
        }

        if (top_left_diagonal != null) {
            if (top_left_diagonal.length > 0) {
                if (!isOccupiedBySamePiece(top_left_diagonal[0], piece_side)) {
                    index++;
                    postions[index] = top_left_diagonal[0];
                }

                if (virtual_piece_side != piece_side) {
                    if (piece_virtual_square_position == top_left_diagonal[0]) {
                        index++;
                        postions[index] = piece_virtual_square_position;
                    }
                }

            }
        }

        if (bottom_right_diagonal != null) {
            if (bottom_right_diagonal.length > 0) {
                if (!isOccupiedBySamePiece(bottom_right_diagonal[0], piece_side)) {
                    index++;
                    postions[index] = bottom_right_diagonal[0];
                }

                if (virtual_piece_side != piece_side) {
                    if (piece_virtual_square_position == bottom_right_diagonal[0]) {
                        index++;
                        postions[index] = piece_virtual_square_position;
                    }
                }

            }
        }

        if (bottom_left_diagonal != null) {
            if (bottom_left_diagonal.length > 0) {
                if (!isOccupiedBySamePiece(bottom_left_diagonal[0], piece_side)) {
                    index++;
                    postions[index] = bottom_left_diagonal[0];
                }

                if (virtual_piece_side != piece_side) {
                    if (piece_virtual_square_position == bottom_left_diagonal[0]) {
                        index++;
                        postions[index] = piece_virtual_square_position;
                    }
                }

            }
        }

        int[] unresolved_pos = new int[index + 1];

        System.arraycopy(postions, 0, unresolved_pos, 0, index + 1);

        //examine the position to find out if the king will be under attack (in check)
        Piece piece_to_be_capture = this.getPieceOnSquare(to_square);

        if (new_move.isMoveValid())//if still valid do another validation test
        {
            if (this.containsSquareIn(unresolved_pos, to_square)) {
                if (this.willKingBeInCheckAtSquare(king_piece, to_square, piece_to_be_capture, piece_virtual_id, piece_virtual_square_position)) {
                    new_move.setInvalidMoveMessage("King cannot move to a square which is under attack.");
                    new_move.setIsValidMove(false);
                }
            }
        }

        int pos_cancelled = 0;
        for (int i = 0; i < unresolved_pos.length; i++) {

            piece_to_be_capture = this.getPieceOnSquare(unresolved_pos[i]);

            if (this.willKingBeInCheckAtSquare(king_piece, unresolved_pos[i], piece_to_be_capture, piece_virtual_id, piece_virtual_square_position)) {
                unresolved_pos[i] = -1;//cancel

                pos_cancelled++;
            }
        }

        int[] valid_pos = new int[unresolved_pos.length - pos_cancelled];

        index = -1;

        for (int i = 0; i < unresolved_pos.length; i++) {
            if (unresolved_pos[i] == -1) {
                continue;
            }
            index++;
            valid_pos[index] = unresolved_pos[i];
        }

        if (castle.isCastleOpportunity()) {
            //added the king castle square postion
            int[] castle_pos = castle.kingCastlePosition();
            int[] valid_pos_with_castle = new int[valid_pos.length + castle_pos.length];
            System.arraycopy(valid_pos, 0, valid_pos_with_castle, 0, valid_pos.length);
            System.arraycopy(castle_pos, 0, valid_pos_with_castle, valid_pos.length, castle_pos.length);

            valid_pos = valid_pos_with_castle;
        }

        if (new_move.isMoveValid())//if still valid do another validation test
        {
            if (!this.containsSquareIn(valid_pos, to_square)) {
                new_move.setInvalidMoveMessage("King may only move one space in any direction");
                new_move.setIsValidMove(false);
            }
        }

        new_move.setValidSquares(valid_pos);

        return new_move;
    }

    public ChessMove getRookMoveAnalysis(ChessMove new_move, int from_square, int to_square, int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not        

        int[] vert_up = getVerticalUpwardSquares(from_square);
        int[] vert_down = getVerticalDownwardSquares(from_square);
        int[] horiz_left = getHorizontalLeftwardSquares(from_square);
        int[] horiz_right = getHorizontalRightwardSquares(from_square);

        int index = -1;
        int[] postions = new int[this.total_chess_pieces];

        if (vert_up != null) {
            for (int i = 0; i < vert_up.length; i++) {

                if (!isOccupiedBySamePiece(vert_up[i], piece_side)) {
                    index++;
                    postions[index] = vert_up[i];
                }

                if (isOccupied(vert_up[i])) {
                    break;
                }

            }
        }

        if (vert_down != null) {
            for (int i = 0; i < vert_down.length; i++) {

                if (!isOccupiedBySamePiece(vert_down[i], piece_side)) {
                    index++;
                    postions[index] = vert_down[i];
                }

                if (isOccupied(vert_down[i])) {
                    break;
                }

            }
        }

        if (horiz_left != null) {
            for (int i = 0; i < horiz_left.length; i++) {

                if (!isOccupiedBySamePiece(horiz_left[i], piece_side)) {
                    index++;
                    postions[index] = horiz_left[i];
                }

                if (isOccupied(horiz_left[i])) {
                    break;
                }

            }
        }

        if (horiz_right != null) {
            for (int i = 0; i < horiz_right.length; i++) {

                if (!isOccupiedBySamePiece(horiz_right[i], piece_side)) {
                    index++;
                    postions[index] = horiz_right[i];
                }

                if (isOccupied(horiz_right[i])) {
                    break;
                }

            }
        }

        int[] unresolved_valid_pos = new int[index + 1];

        System.arraycopy(postions, 0, unresolved_valid_pos, 0, index + 1);

        if (!this.containsSquareIn(unresolved_valid_pos, to_square)) {
            new_move.setInvalidMoveMessage("Rook may move up or down , left or right any number of spaces provided the path is not blocked");
            new_move.setIsValidMove(false);
        }

        //OPPONENT KING
        inspectOpponentKing(new_move, unresolved_valid_pos, to_square, piece_side);

        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        inspectOwnKing(new_move, Constants.Rook, unresolved_valid_pos, from_square, to_square, piece_side, piece_virtual_id, piece_virtual_square_position);

        return new_move;
    }

    public ChessMove getQueenMoveAnalysis(ChessMove new_move, int from_square, int to_square, int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not

        int[] vert_up = getVerticalUpwardSquares(from_square);
        int[] vert_down = getVerticalDownwardSquares(from_square);
        int[] horiz_left = getHorizontalLeftwardSquares(from_square);
        int[] horiz_right = getHorizontalRightwardSquares(from_square);

        int[] top_right_diagonal = getTopRightDiagonalSquares(from_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(from_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(from_square);
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(from_square);

        int index = -1;
        int[] postions = new int[this.total_chess_pieces];

        if (vert_up != null) {
            for (int i = 0; i < vert_up.length; i++) {

                if (!isOccupiedBySamePiece(vert_up[i], piece_side)) {
                    index++;
                    postions[index] = vert_up[i];
                }

                if (isOccupied(vert_up[i])) {
                    break;
                }

            }
        }

        if (vert_down != null) {
            for (int i = 0; i < vert_down.length; i++) {

                if (!isOccupiedBySamePiece(vert_down[i], piece_side)) {
                    index++;
                    postions[index] = vert_down[i];
                }

                if (isOccupied(vert_down[i])) {
                    break;
                }

            }
        }

        if (horiz_left != null) {
            for (int i = 0; i < horiz_left.length; i++) {

                if (!isOccupiedBySamePiece(horiz_left[i], piece_side)) {
                    index++;
                    postions[index] = horiz_left[i];
                }

                if (isOccupied(horiz_left[i])) {
                    break;
                }

            }
        }

        if (horiz_right != null) {
            for (int i = 0; i < horiz_right.length; i++) {

                if (!isOccupiedBySamePiece(horiz_right[i], piece_side)) {
                    index++;
                    postions[index] = horiz_right[i];
                }

                if (isOccupied(horiz_right[i])) {
                    break;
                }

            }
        }

        if (top_right_diagonal != null) {
            for (int i = 0; i < top_right_diagonal.length; i++) {

                if (!isOccupiedBySamePiece(top_right_diagonal[i], piece_side)) {
                    index++;
                    postions[index] = top_right_diagonal[i];
                }

                if (isOccupied(top_right_diagonal[i])) {
                    break;
                }

            }
        }

        if (top_left_diagonal != null) {
            for (int i = 0; i < top_left_diagonal.length; i++) {

                if (!isOccupiedBySamePiece(top_left_diagonal[i], piece_side)) {
                    index++;
                    postions[index] = top_left_diagonal[i];
                }

                if (isOccupied(top_left_diagonal[i])) {
                    break;
                }

            }
        }

        if (bottom_right_diagonal != null) {
            for (int i = 0; i < bottom_right_diagonal.length; i++) {

                if (!isOccupiedBySamePiece(bottom_right_diagonal[i], piece_side)) {
                    index++;
                    postions[index] = bottom_right_diagonal[i];
                }

                if (isOccupied(bottom_right_diagonal[i])) {
                    break;
                }

            }
        }

        if (bottom_left_diagonal != null) {
            for (int i = 0; i < bottom_left_diagonal.length; i++) {

                if (!isOccupiedBySamePiece(bottom_left_diagonal[i], piece_side)) {
                    index++;
                    postions[index] = bottom_left_diagonal[i];
                }

                if (isOccupied(bottom_left_diagonal[i])) {
                    break;
                }

            }
        }

        int[] unresolved_valid_pos = new int[index + 1];

        System.arraycopy(postions, 0, unresolved_valid_pos, 0, index + 1);

        if (!this.containsSquareIn(unresolved_valid_pos, to_square)) {
            new_move.setInvalidMoveMessage("Queen cannot move there. The path is blocked.");
            new_move.setIsValidMove(false);
        }

        //OPPONENT KING
        inspectOpponentKing(new_move, unresolved_valid_pos, to_square, piece_side);

        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        inspectOwnKing(new_move, Constants.Queen, unresolved_valid_pos, from_square, to_square, piece_side, piece_virtual_id, piece_virtual_square_position);

        return new_move;
    }

    public ChessMove getBishopMoveAnalysis(ChessMove new_move, int from_square, int to_square, int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not

        int[] top_right_diagonal = getTopRightDiagonalSquares(from_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(from_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(from_square);
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(from_square);

        int index = -1;
        int[] postions = new int[this.total_chess_pieces];

        if (top_right_diagonal != null) {
            for (int i = 0; i < top_right_diagonal.length; i++) {

                if (!isOccupiedBySamePiece(top_right_diagonal[i], piece_side)) {
                    index++;
                    postions[index] = top_right_diagonal[i];
                }

                if (isOccupied(top_right_diagonal[i])) {
                    break;
                }
            }
        }

        if (top_left_diagonal != null) {
            for (int i = 0; i < top_left_diagonal.length; i++) {

                if (!isOccupiedBySamePiece(top_left_diagonal[i], piece_side)) {
                    index++;
                    postions[index] = top_left_diagonal[i];
                }

                if (isOccupied(top_left_diagonal[i])) {
                    break;
                }

            }
        }

        if (bottom_right_diagonal != null) {
            for (int i = 0; i < bottom_right_diagonal.length; i++) {

                if (!isOccupiedBySamePiece(bottom_right_diagonal[i], piece_side)) {
                    index++;
                    postions[index] = bottom_right_diagonal[i];
                }

                if (isOccupied(bottom_right_diagonal[i])) {
                    break;
                }

            }
        }

        if (bottom_left_diagonal != null) {
            for (int i = 0; i < bottom_left_diagonal.length; i++) {

                if (!isOccupiedBySamePiece(bottom_left_diagonal[i], piece_side)) {
                    index++;
                    postions[index] = bottom_left_diagonal[i];
                }

                if (isOccupied(bottom_left_diagonal[i])) {
                    break;
                }

            }
        }

        int[] unresolved_valid_pos = new int[index + 1];

        System.arraycopy(postions, 0, unresolved_valid_pos, 0, index + 1);

        if (!this.containsSquareIn(unresolved_valid_pos, to_square)) {
            new_move.setInvalidMoveMessage("Bishop may move diagonally any number of spaces in a straigth line \nprovided the path is not blocked.");
            new_move.setIsValidMove(false);
        }

        //OPPONENT KING
        inspectOpponentKing(new_move, unresolved_valid_pos, to_square, piece_side);

        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        inspectOwnKing(new_move, Constants.Bishop, unresolved_valid_pos, from_square, to_square, piece_side, piece_virtual_id, piece_virtual_square_position);

        return new_move;
    }

    public ChessMove getPawnMoveAnalysis(ChessMove new_move, int from_square, int to_square, int piece_side, boolean has_en_passant, int piece_virtual_id, int piece_virtual_square_position) {

        int[] unresolved_valid_pos = null;

        new_move.setIsValidMove(true);// first assumed valid - validation analysis will reveal if it is valid or not
        Piece piece = this.getPieceByID(piece_virtual_id);
        int virtual_piece_side = piece != null ? piece.Me() : -1;

        boolean is_first_move = false;
        if (piece_side == Side.white) {
            Piece pawn = this.getPieceOnSquare(from_square);
            is_first_move = pawn.Square > 7 && pawn.Square < 16 ? true : false;
        } else {
            Piece pawn = this.getPieceOnSquare(from_square);
            is_first_move = pawn.Square > 47 && pawn.Square < 56 ? true : false;
        }

        Piece pawn_piece = this.getPieceOnSquare(from_square);

        if (piece_side == Side.white) {
            int[] vert_up = getVerticalUpwardSquares(from_square);
            int[] top_right_diagonal = getTopRightDiagonalSquares(from_square);
            int[] top_left_diagonal = getTopLeftDiagonalSquares(from_square);

            int index = -1;
            int[] postions = new int[this.total_chess_pieces];

            if (pawn_piece.isEnPassantOpportunity()) {
                Piece en_passant_pawn_to_be_captured = this.getPieceByID(pawn_piece.getEnPassantPawnToCapturePieceID());

                if (en_passant_pawn_to_be_captured != null) {
                    int en_passant_pawn_to_capture_square_pos = en_passant_pawn_to_be_captured.getPieceSquarePosition();
                    int en_passant_dest_square = -1;
                    if (from_square > en_passant_pawn_to_capture_square_pos) {
                        index++;
                        en_passant_dest_square = top_left_diagonal[0];
                        postions[index] = en_passant_dest_square;
                    } else if (from_square < en_passant_pawn_to_capture_square_pos) {
                        index++;
                        en_passant_dest_square = top_right_diagonal[0];
                        postions[index] = en_passant_dest_square;
                    }

                    if (en_passant_dest_square != -1) {
                        if (to_square == en_passant_dest_square) {
                            new_move.getEnPassant().setIsEnPassantCaptureMove(true);
                            new_move.getEnPassant().setEnPassantPawnToCapturePieceID(pawn_piece.getEnPassantPawnToCapturePieceID());
                            System.err.println("white pawn makes en passant move");
                        }
                    }
                }
            }

            if (is_first_move) {
                if (vert_up != null) {
                    if (vert_up.length > 1) {

                        for (int i = 0; i < 2; i++) {

                            if (isOccupied(vert_up[i])) {
                                break;
                            }

                            if (virtual_piece_side != piece_side) {
                                if (piece_virtual_square_position == vert_up[i]) {
                                    break;
                                }
                            }

                            index++;
                            postions[index] = vert_up[i];
                        }

                    }
                }
            }

            if (!is_first_move) {
                if (vert_up != null) {
                    if (vert_up.length > 0) {

                        if (!isOccupied(vert_up[0])) {
                            index++;
                            postions[index] = vert_up[0];
                        }

                        if (virtual_piece_side != piece_side) {
                            if (piece_virtual_square_position == vert_up[0]) {
                                postions[index] = -1;  //cancel            
                            }
                        }

                    }
                }
            }

            if (top_right_diagonal != null) {
                if (top_right_diagonal.length > 0) {

                    if (isOccupiedByOpponentPiece(top_right_diagonal[0], piece_side)) {
                        index++;
                        postions[index] = top_right_diagonal[0];
                    }

                    if (virtual_piece_side != piece_side) {
                        if (piece_virtual_square_position == top_right_diagonal[0]) {
                            index++;
                            postions[index] = top_right_diagonal[0];
                        }
                    }
                }
            }

            if (top_left_diagonal != null) {
                if (top_left_diagonal.length > 0) {

                    if (isOccupiedByOpponentPiece(top_left_diagonal[0], piece_side)) {
                        index++;
                        postions[index] = top_left_diagonal[0];
                    }

                    if (virtual_piece_side != piece_side) {
                        if (piece_virtual_square_position == top_left_diagonal[0]) {
                            index++;
                            postions[index] = top_left_diagonal[0];
                        }
                    }
                }
            }

            unresolved_valid_pos = new int[index + 1];

            System.arraycopy(postions, 0, unresolved_valid_pos, 0, index + 1);
        }

        if (piece_side == Side.black) {
            int[] vert_down = getVerticalDownwardSquares(from_square);
            int[] bottom_right_diagonal = getBottomRightDiagonalSquares(from_square);
            int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(from_square);
            int index = -1;
            int[] postions = new int[this.total_chess_pieces];

            if (pawn_piece.isEnPassantOpportunity()) {
                Piece en_passant_pawn_to_be_captured = this.getPieceByID(pawn_piece.getEnPassantPawnToCapturePieceID());

                if (en_passant_pawn_to_be_captured != null) {
                    int en_passant_pawn_to_capture_square_pos = en_passant_pawn_to_be_captured.getPieceSquarePosition();
                    int en_passant_dest_square = -1;
                    if (from_square > en_passant_pawn_to_capture_square_pos) {
                        index++;
                        en_passant_dest_square = bottom_left_diagonal[0];
                        postions[index] = en_passant_dest_square;
                    } else if (from_square < en_passant_pawn_to_capture_square_pos) {
                        index++;
                        en_passant_dest_square = bottom_right_diagonal[0];
                        postions[index] = en_passant_dest_square;
                    }

                    if (en_passant_dest_square != -1) {
                        if (to_square == en_passant_dest_square) {
                            new_move.getEnPassant().setIsEnPassantCaptureMove(true);
                            new_move.getEnPassant().setEnPassantPawnToCapturePieceID(pawn_piece.getEnPassantPawnToCapturePieceID());
                            System.err.println("balck pawn makes en passant move");
                        }
                    }
                }
            }

            if (is_first_move) {
                if (vert_down != null) {
                    if (vert_down.length > 1) {

                        for (int i = 0; i < 2; i++) {

                            if (isOccupied(vert_down[i])) {
                                break;
                            }

                            if (virtual_piece_side != piece_side) {
                                if (piece_virtual_square_position == vert_down[i]) {
                                    break;
                                }
                            }

                            index++;
                            postions[index] = vert_down[i];
                        }
                    }
                }
            }

            if (!is_first_move) {
                if (vert_down != null) {
                    if (vert_down.length > 0) {
                        if (!isOccupied(vert_down[0])) {
                            index++;
                            postions[index] = vert_down[0];
                        }

                        if (virtual_piece_side != piece_side) {
                            if (piece_virtual_square_position == vert_down[0]) {
                                postions[index] = -1;  //cancel            
                            }
                        }

                    }
                }
            }

            if (bottom_right_diagonal != null) {
                if (bottom_right_diagonal.length > 0) {
                    if (isOccupiedByOpponentPiece(bottom_right_diagonal[0], piece_side)) {
                        index++;
                        postions[index] = bottom_right_diagonal[0];
                    }

                    if (virtual_piece_side != piece_side) {
                        if (piece_virtual_square_position == bottom_right_diagonal[0]) {
                            index++;
                            postions[index] = bottom_right_diagonal[0];
                        }
                    }
                }
            }

            if (bottom_left_diagonal != null) {
                if (bottom_left_diagonal.length > 0) {
                    if (isOccupiedByOpponentPiece(bottom_left_diagonal[0], piece_side)) {
                        index++;
                        postions[index] = bottom_left_diagonal[0];
                    }

                    if (virtual_piece_side != piece_side) {
                        if (piece_virtual_square_position == bottom_left_diagonal[0]) {
                            index++;
                            postions[index] = bottom_left_diagonal[0];
                        }
                    }
                }
            }

            unresolved_valid_pos = new int[index + 1];

            System.arraycopy(postions, 0, unresolved_valid_pos, 0, index + 1);
        }

        if (!this.containsSquareIn(unresolved_valid_pos, to_square)) {
            new_move.setInvalidMoveMessage("Pawn may only move forward one space or two space in the first move.\nPawns may capture diagonally one space forward.");
            new_move.setIsValidMove(false);
        }

        //OPPONENT KING
        inspectOpponentKing(new_move, unresolved_valid_pos, to_square, piece_side);

        ///OWN KING
        //Handle the case of own king being in check or being delivered check by the piece moving 
        //from a position that will put the king in check.                
        inspectOwnKing(new_move, Constants.Pawn, unresolved_valid_pos, from_square, to_square, piece_side, piece_virtual_id, piece_virtual_square_position);

        //handle enpassant opportunity
        if (new_move.isMoveValid()) {
            if (is_first_move) {
                if (Math.abs(from_square - to_square) == 16) {//that two square vertically upwards or downwards

                    setEnPassantOpportunityOnCorrespondingPieces(new_move.getEnPassant(), from_square, to_square, piece_side);
                }
            }
        }

        return new_move;
    }

    ChessMove inspectOpponentKing(ChessMove new_move, int[] unresolved_valid_pos, int to_square, int piece_side) {

        //check if opponent king is in check (under attack)      
        int opponent_king_pos = -1;

        for (int i = 0; i < unresolved_valid_pos.length; i++) {
            Piece piece = this.getPieceOnSquare(unresolved_valid_pos[i]);
            if (piece != null) {
                if (piece.Me() != piece_side) {
                    if (piece.piece_name == Constants.King) {
                        //Yes the opponent king is in check since no other piece is in between the piece and the king.
                        //This was by computation from the method that called this method. Remeber the valid (unresolved)
                        //positions were gotten based on the fact that the path is not blocked.
                        new_move.setIsOpponentKingInCheck(true);
                        new_move.setSquarePositionOfOpponentKingInCheck(unresolved_valid_pos[i]);
                        opponent_king_pos = unresolved_valid_pos[i];
                        break;
                    }
                }
            }
        }

        int[] new_valid_pos = null;

        if (opponent_king_pos != -1) {
            new_valid_pos = new int[unresolved_valid_pos.length - 1];
            int index = -1;
            for (int i = 0; i < unresolved_valid_pos.length; i++) {

                if (unresolved_valid_pos[i] == opponent_king_pos) {
                    continue;
                }

                index++;
                new_valid_pos[index] = unresolved_valid_pos[i];
            }
        } else {
            new_valid_pos = unresolved_valid_pos;
            new_move.setIsOpponentKingInCheck(false);
            new_move.setSquarePositionOfOpponentKingInCheck(-1);
        }

        if (opponent_king_pos != -1) {
            if (to_square == opponent_king_pos) {

                new_move.setInvalidMoveMessage("Invalid capture attempt. You cannot capture a king.");
                new_move.setIsValidMove(false);
            }
        }

        new_move.setValidSquares(new_valid_pos);

        return new_move;
    }

    /**
     * Handle the case of own king being in check or being delivered check by
     * own piece moving from a position that will put own king in check.
     *
     *
     * @param new_move
     * @param piece_name
     * @param unresolved_valid_pos
     * @param from_square
     * @param to_square
     * @param piece_side
     *
     * @return
     */
    ChessMove inspectOwnKing(ChessMove new_move, char piece_name, int[] unresolved_valid_pos, int from_square, int to_square, int piece_side, int piece_virtual_id, int piece_virtual_square_position) {

        int num_cancelled = 0;

        for (int i = 0; i < unresolved_valid_pos.length; i++) {
            boolean result_in_check = willOwnKingBeInCheckWithOwnPieceMove(piece_name, from_square, unresolved_valid_pos[i], piece_side, piece_virtual_id, piece_virtual_square_position);
            if (result_in_check) {
                unresolved_valid_pos[i] = -1;//check this position
                num_cancelled++;
            }
        }

        int[] valid_pos = new int[unresolved_valid_pos.length - num_cancelled];
        int index = -1;

        for (int i = 0; i < unresolved_valid_pos.length; i++) {
            if (unresolved_valid_pos[i] == -1) {
                continue;
            }
            index++;
            valid_pos[index] = unresolved_valid_pos[i];
        }

        if (new_move.isMoveValid())//if still valid
        {
            if (!this.containsSquareIn(valid_pos, to_square)) {

                new_move.setInvalidMoveMessage("Invalid move: You cannot make that move. Your king is either in check or will be under attack.");
                new_move.setIsValidMove(false);
            }
        }

        new_move.setValidSquares(valid_pos);

        return new_move;
    }

    int[] getPawnCapturableSquares(int piece_square_pos, int piece_side) {

        if (piece_square_pos == -1 || piece_square_pos == Constants.NOTHING) {
            return new int[0];
        }

        int[] capture_squares = new int[0];

        if (piece_side == Side.white) {
            int[] top_right_diagonal = getTopRightDiagonalSquares(piece_square_pos);
            int[] top_left_diagonal = getTopLeftDiagonalSquares(piece_square_pos);

            int index = -1;
            int[] postions = new int[total_chess_pieces];

            if (top_right_diagonal != null) {
                if (top_right_diagonal.length > 0) {
                    index++;
                    postions[index] = top_right_diagonal[0];
                }
            }

            if (top_left_diagonal != null) {
                if (top_left_diagonal.length > 0) {
                    index++;
                    postions[index] = top_left_diagonal[0];
                }
            }

            capture_squares = new int[index + 1];

            System.arraycopy(postions, 0, capture_squares, 0, index + 1);
        }

        if (piece_side == Side.black) {
            int[] bottom_right_diagonal = getBottomRightDiagonalSquares(piece_square_pos);
            int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(piece_square_pos);
            int index = -1;
            int[] postions = new int[this.total_chess_pieces];

            if (bottom_right_diagonal != null) {
                if (bottom_right_diagonal.length > 0) {
                    index++;
                    postions[index] = bottom_right_diagonal[0];
                }
            }

            if (bottom_left_diagonal != null) {
                if (bottom_left_diagonal.length > 0) {
                    index++;
                    postions[index] = bottom_left_diagonal[0];
                }
            }

            capture_squares = new int[index + 1];

            System.arraycopy(postions, 0, capture_squares, 0, index + 1);
        }

        return capture_squares;
    }

    private boolean isKingInCheckByQueenAtSquare(int queen_square, int king_square, int piece_side, Piece virtual_captured_piece) {

        if (queen_square == -1 || queen_square == Constants.NOTHING) {
            return false;
        }

        int[] vert_up = getVerticalUpwardSquares(queen_square);
        int[] vert_down = getVerticalDownwardSquares(queen_square);
        int[] horiz_left = getHorizontalLeftwardSquares(queen_square);
        int[] horiz_right = getHorizontalRightwardSquares(queen_square);

        int[] top_right_diagonal = getTopRightDiagonalSquares(queen_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(queen_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(queen_square);
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(queen_square);

        if (vert_up != null) {
            if (containsSquareIn(vert_up, king_square)) {

                for (int i = 0; i < vert_up.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_up[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (vert_up[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (vert_down != null) {
            if (containsSquareIn(vert_down, king_square)) {

                for (int i = 0; i < vert_down.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_down[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (vert_down[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (horiz_left != null) {
            if (containsSquareIn(horiz_left, king_square)) {

                for (int i = 0; i < horiz_left.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_left[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (horiz_left[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (horiz_right != null) {
            if (containsSquareIn(horiz_right, king_square)) {

                for (int i = 0; i < horiz_right.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_right[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (horiz_right[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (top_right_diagonal != null) {
            if (containsSquareIn(top_right_diagonal, king_square)) {

                for (int i = 0; i < top_right_diagonal.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_right_diagonal[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (top_right_diagonal[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (top_left_diagonal != null) {
            if (containsSquareIn(top_left_diagonal, king_square)) {

                for (int i = 0; i < top_left_diagonal.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_left_diagonal[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (top_left_diagonal[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (bottom_right_diagonal != null) {
            if (containsSquareIn(bottom_right_diagonal, king_square)) {

                for (int i = 0; i < bottom_right_diagonal.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_right_diagonal[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (bottom_right_diagonal[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (bottom_left_diagonal != null) {
            if (containsSquareIn(bottom_left_diagonal, king_square)) {

                for (int i = 0; i < bottom_left_diagonal.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_left_diagonal[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (bottom_left_diagonal[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        return false;
    }

    int[] getKnightCapturableSquares(int piece_square_pos) {

        int pos1 = -1;
        int pos2 = -1;
        int pos3 = -1;
        int pos4 = -1;
        int pos5 = -1;
        int pos6 = -1;
        int pos7 = -1;
        int pos8 = -1;

        int index = -1;

        int[] postions = new int[8];

        int[] vert_up = getVerticalUpwardSquares(piece_square_pos);
        int[] vert_down = getVerticalDownwardSquares(piece_square_pos);
        int[] horiz_left = getHorizontalLeftwardSquares(piece_square_pos);
        int[] horiz_right = getHorizontalRightwardSquares(piece_square_pos);

        //handle vert_up
        if (vert_up != null) {
            if (vert_up.length >= 2) {

                int pos = vert_up[1];
                int[] n = getHorizontalLeftwardSquares(pos);
                int[] m = getHorizontalRightwardSquares(pos);

                if (n != null) {
                    if (n.length > 0) {
                        pos1 = n[0];
                        index++;
                        postions[index] = pos1;
                    }
                }

                if (m != null) {
                    if (m.length > 0) {
                        pos2 = m[0];
                        index++;
                        postions[index] = pos2;
                    }
                }

            }
        }

        //handle vert_down
        if (vert_down != null) {
            if (vert_down.length >= 2) {

                int pos = vert_down[1];
                int[] n = getHorizontalLeftwardSquares(pos);
                int[] m = getHorizontalRightwardSquares(pos);

                if (n != null) {
                    if (n.length > 0) {
                        pos3 = n[0];
                        index++;
                        postions[index] = pos3;
                    }
                }

                if (m != null) {
                    if (m.length > 0) {
                        pos4 = m[0];
                        index++;
                        postions[index] = pos4;
                    }
                }

            }
        }

        //handle horiz_left
        if (horiz_left != null) {
            if (horiz_left.length >= 2) {

                int pos = horiz_left[1];
                int[] n = getVerticalUpwardSquares(pos);
                int[] m = getVerticalDownwardSquares(pos);

                if (n != null) {
                    if (n.length > 0) {
                        pos5 = n[0];
                        index++;
                        postions[index] = pos5;
                    }
                }

                if (m != null) {
                    if (m.length > 0) {
                        pos6 = m[0];
                        index++;
                        postions[index] = pos6;
                    }
                }
            }
        }

        //handle horiz_right
        if (horiz_right != null) {
            if (horiz_right.length >= 2) {

                int pos = horiz_right[1];
                int[] n = getVerticalUpwardSquares(pos);
                int[] m = getVerticalDownwardSquares(pos);

                if (n != null) {
                    if (n.length > 0) {
                        pos7 = n[0];
                        index++;
                        postions[index] = pos7;
                    }
                }

                if (m != null) {
                    if (m.length > 0) {
                        pos8 = m[0];
                        index++;
                        postions[index] = pos8;
                    }
                }
            }
        }

        int[] valid_pos = new int[index + 1];

        System.arraycopy(postions, 0, valid_pos, 0, index + 1);

        return valid_pos;
    }

    private boolean isKingInCheckByBishopAtSquare(int bishop_square, int king_square, int piece_side, Piece virtual_captured_piece) {

        if (bishop_square == -1 || bishop_square == Constants.NOTHING) {
            return false;
        }

        int[] top_right_diagonal = getTopRightDiagonalSquares(bishop_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(bishop_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(bishop_square);
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(bishop_square);

        if (top_right_diagonal != null) {
            if (containsSquareIn(top_right_diagonal, king_square)) {

                for (int i = 0; i < top_right_diagonal.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_right_diagonal[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (top_right_diagonal[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (top_left_diagonal != null) {
            if (containsSquareIn(top_left_diagonal, king_square)) {

                for (int i = 0; i < top_left_diagonal.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_left_diagonal[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (top_left_diagonal[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (bottom_right_diagonal != null) {
            if (containsSquareIn(bottom_right_diagonal, king_square)) {

                for (int i = 0; i < bottom_right_diagonal.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_right_diagonal[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (bottom_right_diagonal[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (bottom_left_diagonal != null) {
            if (containsSquareIn(bottom_left_diagonal, king_square)) {

                for (int i = 0; i < bottom_left_diagonal.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_left_diagonal[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (bottom_left_diagonal[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        return false;
    }

    private boolean isKingInCheckByRookAtSquare(int rook_square, int king_square, int piece_side, Piece virtual_captured_piece) {

        if (rook_square == -1 || rook_square == Constants.NOTHING) {
            return false;
        }

        int[] vert_up = getVerticalUpwardSquares(rook_square);
        int[] vert_down = getVerticalDownwardSquares(rook_square);
        int[] horiz_left = getHorizontalLeftwardSquares(rook_square);
        int[] horiz_right = getHorizontalRightwardSquares(rook_square);

        if (vert_up != null) {
            if (containsSquareIn(vert_up, king_square)) {

                for (int i = 0; i < vert_up.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_up[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (vert_up[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (vert_down != null) {
            if (containsSquareIn(vert_down, king_square)) {

                for (int i = 0; i < vert_down.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_down[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (vert_down[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (horiz_left != null) {
            if (containsSquareIn(horiz_left, king_square)) {

                for (int i = 0; i < horiz_left.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_left[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (horiz_left[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        if (horiz_right != null) {
            if (containsSquareIn(horiz_right, king_square)) {

                for (int i = 0; i < horiz_right.length; i++) {

                    if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_right[i], piece_side, virtual_captured_piece)) {
                        return false;
                    }

                    if (horiz_right[i] == king_square) {
                        return true;
                    }

                }
            }
        }

        return false;
    }

    private boolean isKingInUnderAttackByOpponentKingAtSquare(int attacking_king_square, int king_square, int piece_side, Piece virtual_captured_piece) {

        if (attacking_king_square == -1 || attacking_king_square == Constants.NOTHING) {
            return false;
        }

        int[] vert_up = getVerticalUpwardSquares(attacking_king_square);
        int[] vert_down = getVerticalDownwardSquares(attacking_king_square);
        int[] horiz_left = getHorizontalLeftwardSquares(attacking_king_square);
        int[] horiz_right = getHorizontalRightwardSquares(attacking_king_square);

        int[] top_right_diagonal = getTopRightDiagonalSquares(attacking_king_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(attacking_king_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(attacking_king_square);
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(attacking_king_square);

        if (vert_up != null) {
            if (containsSquareIn(vert_up, king_square)) {

                if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_up[0], piece_side, virtual_captured_piece)) {
                    return false;
                }

                if (vert_up[0] == king_square) {
                    return true;
                }
            }
        }

        if (vert_down != null) {
            if (containsSquareIn(vert_down, king_square)) {

                if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(vert_down[0], piece_side, virtual_captured_piece)) {
                    return false;
                }

                if (vert_down[0] == king_square) {
                    return true;
                }

            }
        }

        if (horiz_left != null) {
            if (containsSquareIn(horiz_left, king_square)) {

                if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_left[0], piece_side, virtual_captured_piece)) {
                    return false;
                }

                if (horiz_left[0] == king_square) {
                    return true;
                }

            }
        }

        if (horiz_right != null) {
            if (containsSquareIn(horiz_right, king_square)) {

                if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(horiz_right[0], piece_side, virtual_captured_piece)) {
                    return false;
                }

                if (horiz_right[0] == king_square) {
                    return true;
                }

            }
        }

        if (top_right_diagonal != null) {
            if (containsSquareIn(top_right_diagonal, king_square)) {

                if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_right_diagonal[0], piece_side, virtual_captured_piece)) {
                    return false;
                }

                if (top_right_diagonal[0] == king_square) {
                    return true;
                }
            }
        }

        if (top_left_diagonal != null) {
            if (containsSquareIn(top_left_diagonal, king_square)) {

                if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(top_left_diagonal[0], piece_side, virtual_captured_piece)) {
                    return false;
                }

                if (top_left_diagonal[0] == king_square) {
                    return true;
                }

            }
        }

        if (bottom_right_diagonal != null) {
            if (containsSquareIn(bottom_right_diagonal, king_square)) {

                if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_right_diagonal[0], piece_side, virtual_captured_piece)) {
                    return false;
                }

                if (bottom_right_diagonal[0] == king_square) {
                    return true;
                }

            }
        }

        if (bottom_left_diagonal != null) {
            if (containsSquareIn(bottom_left_diagonal, king_square)) {

                if (isOccupiedExceptOpponentKingAndVirtualCapturedPiece(bottom_left_diagonal[0], piece_side, virtual_captured_piece)) {
                    return false;
                }

                if (bottom_left_diagonal[0] == king_square) {
                    return true;
                }

            }
        }

        return false;
    }

    public void setEnPassantOpportunityOnCorrespondingPieces(EnPassant en_passant, int from_square, int to_square, int piece_side) {

        int[] horiz_left = this.getHorizontalLeftwardSquares(to_square);
        int[] horiz_right = this.getHorizontalRightwardSquares(to_square);
        Piece left_piece;
        Piece right_piece;
        Piece en_passant_pawn_to_be_captured = this.getPieceOnSquare(from_square);

        if (horiz_left != null) {
            if (horiz_left.length > 0) {
                left_piece = this.getPieceOnSquare(horiz_left[0]);

                if (left_piece != null) {
                    if (left_piece.Me() != piece_side) {
                        if (left_piece.piece_name == Constants.Pawn) {
                            left_piece.setEnPassantOpportunity(true);
                            left_piece.setEnPassantPawnToCapturePieceID(en_passant_pawn_to_be_captured.getPieceID());
                            en_passant.setEnPassantLeftPawnCapturerPieceID(left_piece.getPieceID());
                            en_passant.setEnPassantPawnToCapturePieceID(en_passant_pawn_to_be_captured.getPieceID());
                        }
                    }
                }
            }
        }

        if (horiz_right != null) {
            if (horiz_right.length > 0) {
                right_piece = this.getPieceOnSquare(horiz_right[0]);

                if (right_piece != null) {
                    if (right_piece.Me() != piece_side) {
                        if (right_piece.piece_name == Constants.Pawn) {
                            right_piece.setEnPassantOpportunity(true);
                            right_piece.setEnPassantPawnToCapturePieceID(en_passant_pawn_to_be_captured.getPieceID());
                            en_passant.setEnPassantRightPawnCapturerPieceID(right_piece.getPieceID());
                            en_passant.setEnPassantPawnToCapturePieceID(en_passant_pawn_to_be_captured.getPieceID());
                        }
                    }
                }
            }
        }
    }

    //Re touched
    private boolean hasEnPassantOpportunity(int piece_side) {

        Piece[] pieces = board.getAllPieces();

        for (int i = pieces.length - 1; i > -1; i--) {
            if (pieces[i].Me() == piece_side) {
                if (pieces[i].isEnPassantOpportunity()) {
                    return true;
                }
            }
        }

        return false;
    }

    //Re touched
    private void removeEnPassantOpportunity(int piece_side) {
        //Re touched block of code

        Piece[] pieces = board.getAllPieces();
        for (int i = pieces.length - 1; i > -1; i--) {
            if (pieces[i].Me() == piece_side) {
                pieces[i].setEnPassantOpportunity(false);
                pieces[i].setEnPassantPawnToCapturePieceID(-1);
            }
        }

    }

    private boolean willOwnKingBeCheckByBishopWithOwnPieceMove(int bishop_square, int king_pos, int from_square, int to_square) {

        if (bishop_square == -1 || bishop_square == Constants.NOTHING) {
            return false;
        }

        if (to_square == bishop_square) {
            return false;//meaning the bishop is to be captured
        }
        int[] top_right_diagonal = getTopRightDiagonalSquares(bishop_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(bishop_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(bishop_square);
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(bishop_square);

        //for top_right_diagonal
        if (top_right_diagonal != null) {
            if (this.containsSquareIn(top_right_diagonal, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the queen an piece
                for (int i = 0; i < top_right_diagonal.length; i++) {

                    if (top_right_diagonal[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (top_right_diagonal[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (top_right_diagonal[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(top_right_diagonal[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for top_left_diagonal
        if (top_left_diagonal != null) {
            if (this.containsSquareIn(top_left_diagonal, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the bishop and piece
                for (int i = 0; i < top_left_diagonal.length; i++) {

                    if (top_left_diagonal[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (top_left_diagonal[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (top_left_diagonal[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(top_left_diagonal[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for bottom_right_diagonal
        if (bottom_right_diagonal != null) {
            if (this.containsSquareIn(bottom_right_diagonal, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the bishop and piece
                for (int i = 0; i < bottom_right_diagonal.length; i++) {

                    if (bottom_right_diagonal[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (bottom_right_diagonal[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (bottom_right_diagonal[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(bottom_right_diagonal[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for bottom_left_diagonal
        if (bottom_left_diagonal != null) {
            if (this.containsSquareIn(bottom_left_diagonal, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the bishop and piece
                for (int i = 0; i < bottom_left_diagonal.length; i++) {

                    if (bottom_left_diagonal[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (bottom_left_diagonal[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (bottom_left_diagonal[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(bottom_left_diagonal[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        return false;
    }

    private boolean willOwnKingBeCheckByRookWithOwnPieceMove(int rook_square, int king_pos, int from_square, int to_square) {

        if (rook_square == -1 || rook_square == Constants.NOTHING) {
            return false;
        }

        if (to_square == rook_square) {
            return false;//meaning the rook is to be captured
        }
        int[] vert_up = getVerticalUpwardSquares(rook_square);
        int[] vert_down = getVerticalDownwardSquares(rook_square);
        int[] horiz_left = getHorizontalLeftwardSquares(rook_square);
        int[] horiz_right = getHorizontalRightwardSquares(rook_square);

        //for vert_up
        if (vert_up != null) {
            if (this.containsSquareIn(vert_up, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the rook and piece
                for (int i = 0; i < vert_up.length; i++) {

                    if (vert_up[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (vert_up[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (vert_up[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(vert_up[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for vert_down
        if (vert_down != null) {
            if (this.containsSquareIn(vert_down, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the rook and piece
                for (int i = 0; i < vert_down.length; i++) {

                    if (vert_down[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (vert_down[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (vert_down[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(vert_down[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for horiz_right
        if (horiz_right != null) {
            if (this.containsSquareIn(horiz_right, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the rook and piece
                for (int i = 0; i < horiz_right.length; i++) {

                    if (horiz_right[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (horiz_right[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (horiz_right[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(horiz_right[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for horiz_left
        if (horiz_left != null) {
            if (this.containsSquareIn(horiz_left, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the rook and piece
                for (int i = 0; i < horiz_left.length; i++) {

                    if (horiz_left[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (horiz_left[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (horiz_left[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(horiz_left[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        return false;
    }

    private boolean willOwnKingBeCheckByQueenWithOwnPieceMove(int queen_square, int king_pos, int from_square, int to_square) {

        if (queen_square == -1 || queen_square == Constants.NOTHING) {
            return false;
        }

        if (to_square == queen_square) {
            return false;//meaning the queen is to be captured
        }
        int[] vert_up = getVerticalUpwardSquares(queen_square);
        int[] vert_down = getVerticalDownwardSquares(queen_square);
        int[] horiz_left = getHorizontalLeftwardSquares(queen_square);
        int[] horiz_right = getHorizontalRightwardSquares(queen_square);

        int[] top_right_diagonal = getTopRightDiagonalSquares(queen_square);
        int[] top_left_diagonal = getTopLeftDiagonalSquares(queen_square);
        int[] bottom_right_diagonal = getBottomRightDiagonalSquares(queen_square);
        int[] bottom_left_diagonal = getBottomLeftDiagonalSquares(queen_square);

        //for vert_up
        if (vert_up != null) {
            if (this.containsSquareIn(vert_up, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the queen and piece
                for (int i = 0; i < vert_up.length; i++) {

                    if (vert_up[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (vert_up[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (vert_up[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(vert_up[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for vert_down
        if (vert_down != null) {
            if (this.containsSquareIn(vert_down, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the queen and piece
                for (int i = 0; i < vert_down.length; i++) {

                    if (vert_down[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (vert_down[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (vert_down[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(vert_down[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for horiz_right
        if (horiz_right != null) {
            if (this.containsSquareIn(horiz_right, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the queen and piece
                for (int i = 0; i < horiz_right.length; i++) {

                    if (horiz_right[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (horiz_right[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (horiz_right[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(horiz_right[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for horiz_left
        if (horiz_left != null) {
            if (this.containsSquareIn(horiz_left, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the queen and piece
                for (int i = 0; i < horiz_left.length; i++) {

                    if (horiz_left[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (horiz_left[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (horiz_left[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(horiz_left[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for top_right_diagonal
        if (top_right_diagonal != null) {
            if (this.containsSquareIn(top_right_diagonal, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the queen and piece
                for (int i = 0; i < top_right_diagonal.length; i++) {

                    if (top_right_diagonal[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (top_right_diagonal[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (top_right_diagonal[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(top_right_diagonal[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for top_left_diagonal
        if (top_left_diagonal != null) {
            if (this.containsSquareIn(top_left_diagonal, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the queen and piece
                for (int i = 0; i < top_left_diagonal.length; i++) {

                    if (top_left_diagonal[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (top_left_diagonal[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (top_left_diagonal[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(top_left_diagonal[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for bottom_right_diagonal
        if (bottom_right_diagonal != null) {
            if (this.containsSquareIn(bottom_right_diagonal, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the queen and piece
                for (int i = 0; i < bottom_right_diagonal.length; i++) {

                    if (bottom_right_diagonal[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (bottom_right_diagonal[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (bottom_right_diagonal[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(bottom_right_diagonal[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        //for bottom_left_diagonal
        if (bottom_left_diagonal != null) {
            if (this.containsSquareIn(bottom_left_diagonal, king_pos)) {

                boolean is_path_blocked = false;
                //find out if there will be a piece between the queen and piece
                for (int i = 0; i < bottom_left_diagonal.length; i++) {

                    if (bottom_left_diagonal[i] == king_pos) {
                        break;//stop at king pos
                    }
                    if (bottom_left_diagonal[i] == to_square) {
                        is_path_blocked = true;
                        break;
                    }

                    if (bottom_left_diagonal[i] == from_square) {
                        continue;//the path is not blocked
                    }
                    if (this.isOccupied(bottom_left_diagonal[i])) {
                        is_path_blocked = true;
                        break;
                    }

                }

                if (is_path_blocked) {
                    return false;
                } else {
                    return true;
                }

            }
        }

        return false;
    }

    private boolean willOwnKingBeCheckByKnightWithOwnPieceMove(int knight_square, int king_pos, int from_square, int to_square) {

        if (to_square == knight_square) {
            return false;//meaning the knight is to be captured
        }

        int[] knight_capturable_square = this.getKnightCapturableSquares(knight_square);

        if (this.containsSquareIn(knight_capturable_square, king_pos)) {
            return true;
        }

        return false;
    }

    private boolean willOwnKingBeCheckByPawnWithOwnPieceMove(int pawn_square, int king_pos, int from_square, int to_square, int piece_side) {

        if (to_square == pawn_square) {
            return false;//meaning the pawn is to be captured
        }

        int[] pawn_capturable_square = this.getPawnCapturableSquares(pawn_square, piece_side);

        if (this.containsSquareIn(pawn_capturable_square, king_pos)) {
            return true;
        }

        return false;
    }

    public static void main(String agrs[]) {
        /*final ChessFrame cvm=new ChessFrame(Side.white,1,1,false, ChessView.OFF_MODE);
         cvm.run();
         * 
         */
        Board board = new Board(true);
        BoardAnalyzer c = new BoardAnalyzer(board);
        //c.chessView=cvm.chessView;

        System.out.println(c.isNoneBorderSquare(63));

        System.out.println("-------------");

        System.out.println(c.isBottomBorderSquare(63));
        System.out.println(c.isBottomRightCornerSquare(15));
        System.out.println(c.isBottomLeftCornerSquare(1));

        System.out.println("-------------");

        System.out.println(c.isTopBorderSquare(63));
        System.out.println(c.isTopRightCornerSquare(63));
        System.out.println(c.isTopLeftCornerSquare(57));

        System.out.println("-------------");

        System.out.println(c.isLeftBorderSquare(56));
        System.out.println(c.isRightBorderSquare(63));

        System.out.println("-------------");

        System.out.println(c.getSquareRowIndex(35));
        System.out.println(c.getSquareColumnIndex(35));

        System.out.println("-------getVerticalUpwardSquares------");

        for (int i = 0; i < c.getVerticalUpwardSquares(27).length; i++) {
            System.out.println(c.getVerticalUpwardSquares(27)[i]);
        }

        System.out.println("------getVerticalDownwardSquares-------");

        for (int i = 0; i < c.getVerticalDownwardSquares(27).length; i++) {
            System.out.println(c.getVerticalDownwardSquares(27)[i]);
        }

        System.out.println("-------getHorizontalLeftwardSquares------");

        for (int i = 0; i < c.getHorizontalLeftwardSquares(27).length; i++) {
            System.out.println(c.getHorizontalLeftwardSquares(27)[i]);
        }

        System.out.println("------getHorizontalRightwardSquares-------");

        for (int i = 0; i < c.getHorizontalRightwardSquares(27).length; i++) {
            System.out.println(c.getHorizontalRightwardSquares(27)[i]);
        }

        System.out.println("------getTopLeftDiagonalSquares-------");

        for (int i = 0; i < c.getTopLeftDiagonalSquares(27).length; i++) {
            System.out.println(c.getTopLeftDiagonalSquares(27)[i]);
        }

        System.out.println("-------getTopRightDiagonalSquares------");

        for (int i = 0; i < c.getTopRightDiagonalSquares(29).length; i++) {
            System.out.println(c.getTopRightDiagonalSquares(29)[i]);
        }

        System.out.println("------getBottomRightDiagonalSquares-------");

        for (int i = 0; i < c.getBottomRightDiagonalSquares(24).length; i++) {
            System.out.println(c.getBottomRightDiagonalSquares(24)[i]);
        }

        System.out.println("------getBottomLeftDiagonalSquares-------");

        for (int i = 0; i < c.getBottomLeftDiagonalSquares(31).length; i++) {
            System.out.println(c.getBottomLeftDiagonalSquares(31)[i]);
        }

        System.out.println("-------------");

        for (int i = 0; i < c.getPieceSurrundingSquares(17).length; i++) {
            System.out.println(c.getPieceSurrundingSquares(17)[i]);
        }

        System.out.println("--------valid piece position test ---getKnightValidSquares-------------");

        ChessMove new_move = new ChessMove();

        for (int i = 0; i < c.getKnightMoveAnalysis(new_move, 48, -1, Side.black, -1, -1).getValidSquares().length; i++) {
            System.out.println(c.getKnightMoveAnalysis(new_move, 48, -1, Side.black, -1, -1).getValidSquares()[i]);
        }

        System.out.println("--------valid piece position test ---getRookValidSquares-------------");
        for (int i = 0; i < c.getRookMoveAnalysis(new_move, 24, -1, Side.white, -1, -1).getValidSquares().length; i++) {
            System.out.println(c.getRookMoveAnalysis(new_move, 24, -1, Side.white, -1, -1).getValidSquares()[i]);
        }

        System.out.println("--------valid piece position test ---getPawnValidSquares-------------");
        for (int i = 0; i < c.getPawnMoveAnalysis(new_move, 49, -1, Side.black, true, -1, -1).getValidSquares().length; i++) {
            System.out.println(c.getPawnMoveAnalysis(new_move, 49, -1, Side.black, true, -1, -1).getValidSquares()[i]);
        }

    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess;

import naija.game.client.Robot;
import naija.game.client.Player;
import naija.game.client.LocalUser;
import naija.game.client.RemoteUser;
import naija.game.client.UserInfo;
import naija.game.client.chess.board.BoardAnalyzer;
import naija.game.client.chess.board.ChessMove;
import naija.game.client.chess.board.Constants;
import naija.game.client.chess.board.Move;
import naija.game.client.chess.board.Piece;
import naija.game.client.Side;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ChessPlayer implements Player {

    private LocalUser local_user;
    private RemoteUser remote_user;
    private Robot robot;
    private boolean is_white;
    private int side;
    private Chess chess;
    boolean is_game_over;
    private Move move_to_send;
    private boolean isShortCastleBeginByKing;
    private boolean isLongCastleBeginByKing;
    private ChessMove.Castle castle;
    private boolean isCastleInProgress;

    private ChessPlayer() {
    }

    public ChessPlayer(LocalUser user, boolean is_white) {
        this.is_white = is_white;
        side = is_white ? Side.white : Side.black;
        this.local_user = user;
    }

    public ChessPlayer(RemoteUser user, boolean is_white) {
        this.is_white = is_white;
        side = is_white ? Side.white : Side.black;
        this.remote_user = user;
    }

    public ChessPlayer(Robot robot, boolean is_white) {
        this.is_white = is_white;
        this.robot = robot;
    }

    @Override
    public UserInfo getInfo() {
        if (local_user != null) {
            return local_user.getInfo();
        }

        if (remote_user != null) {
            return remote_user.getInfo();
        }

        return null;
    }

    public boolean isWhite() {
        return this.is_white;
    }

    void setChess(Chess chess) {
        this.chess = chess;
    }

    public boolean isHuman() {
        return robot == null;
    }

    public boolean isRobot() {
        return robot != null;
    }

    void robotMove(Move move) {

        if (is_game_over) {
            return;
        }

        if (!this.isRobot()) {
            throw new IllegalStateException("not a robot player");
        }

        //move the piece in the internal board
        chess.getBoard().MoveInternal(move);

        //fire event of robot move
        chess.getBoardListener().onRobotMove(new ChessBoardEvent(this, side, chess.getBoard(), move));

        BoardAnalyzer analyzer = chess.getBoardAnalyzer();

        int next_turn = side == Side.white ? Side.black : Side.white;

        //check game over
        if (!checkGameOver(analyzer, move, next_turn)) {
            //notify player of his turn
            chess.getBoard().turn = next_turn;
            ChessPlayer turnPlayer = next_turn == Side.white ? chess.getWhitePlayer() : chess.getBlackPlayer();

            //fire event of next turn
            chess.getBoardListener().onNextTurn(new ChessBoardEvent(turnPlayer, next_turn));

        }

    }

    public void remoteMove(Move move) {

        if (is_game_over) {
            return;
        }

        if (!this.isRemotePlayer()) {
            throw new IllegalStateException("not a remote player");
        }

        //move the piece in the internal board
        chess.getBoard().MoveInternal(move);

        //fire event of remote player move
        chess.getBoardListener().onRemotePlayerMove(new ChessBoardEvent(this, side, chess.getBoard(), move));

        BoardAnalyzer analyzer = chess.getBoardAnalyzer();

        int next_turn = side == Side.white ? Side.black : Side.white;

        //check game over
        if (!checkGameOver(analyzer, move, next_turn)) {
            //notify player of his turn
            chess.getBoard().turn = next_turn;
            ChessPlayer turnPlayer = next_turn == Side.white ? chess.getWhitePlayer() : chess.getBlackPlayer();

            //fire event of next turn
            chess.getBoardListener().onNextTurn(new ChessBoardEvent(turnPlayer, next_turn));

        }

    }

    public void localMove(PieceName name, int from_square, int to_square) {
            
        chess.setRobotEngineWait(true);//robot engine must wait for the local player to finish move

        if (is_game_over) {
            return;
        }

        if (from_square == to_square) {
            return;//do nothing - since no move
        }

        if (!this.isLocalPlayer()) {
            throw new IllegalStateException("not a local player");
        }

        if (chess.getBoard().turn != this.side && !isCastleInProgress) {
            int turn = chess.getBoard().turn;
            ChessPlayer playerTurn = turn == Side.white ? chess.getWhitePlayer() : chess.getBlackPlayer();
            chess.getBoardListener().onInvalidTurn(new ChessBoardEvent(playerTurn, turn, from_square, to_square));
            return;
        }

        BoardAnalyzer analyzer = chess.getBoardAnalyzer();

        ChessMove new_move = new ChessMove();
        Piece inb_piece = chess.getBoard().getPieceOnSquare(from_square);

        int turn = chess.getBoard().turn;
        int enpassant_capture_square = Constants.NOTHING;
        if (new_move.getEnPassant().isEnPassantCaptureMove()) {
            Piece p = chess.getBoard().getPieceByID(new_move.getEnPassant().getEnPassantPawnToCapturePieceID());
            enpassant_capture_square = p.Square;
        }

        //check promotion
        int promotion_piece_rating = 67;

        if (inb_piece.piece_name == Constants.Pawn) {
            if (inb_piece.isWhite()) {
                if (inb_piece.Square >= 48 && inb_piece.Square <= 55) {//before last row                        
                    promotion_piece_rating = Constants.QueenPromotion;
                }
            } else {//is black
                if (inb_piece.Square >= 8 && inb_piece.Square <= 15) {//before first row                        
                    promotion_piece_rating = Constants.RookPromotion;
                }

            }
        }

        //create move object
        Move move = new Move(turn,
                -1,//move_value - not required
                inb_piece.piece_name,
                inb_piece.ID,
                from_square,
                to_square,
                Constants.NOTHING,//captured_id - not required here - handled automatically
                promotion_piece_rating,//promotion_piece_rating - come back
                enpassant_capture_square,//enpassant_capture_square - come back
                new_move.getCastle().isKingSideCastle(),//is_short_castle - come back
                new_move.getCastle().isQueenSideCastle());//is_long_castle- come back

        boolean is_castle_completion = false;

        if (isShortCastleBeginByKing) {
            int required_rook_to_square = castle.getRightRookCastleSquarePositon();;
            if (name != PieceName.rook
                    || required_rook_to_square != to_square) {
                String msg = "short castle - requires rook move to " + required_rook_to_square;
                chess.getBoardListener().onInvalidMove(new ChessBoardEvent(this, msg, from_square, to_square));
                return;
            }
            is_castle_completion = true;
            isShortCastleBeginByKing = false;
            isCastleInProgress = false;            
            chess.getBoardListener().onShortCastleEndByRook(new ChessBoardEvent(this, side, chess.getBoard(), move));            
        }

        if (isLongCastleBeginByKing) {
            int required_rook_to_square = castle.getLeftRookCastleSquarePositon();;
            if (name != PieceName.rook
                    || required_rook_to_square != to_square) {
                String msg = "long castle - requires rook move to " + required_rook_to_square;
                chess.getBoardListener().onInvalidMove(new ChessBoardEvent(this, msg, from_square, to_square));
                return;
            }
            is_castle_completion = true;
            isLongCastleBeginByKing = false;
            isCastleInProgress = false;
            chess.getBoardListener().onLongCastleEndByRook(new ChessBoardEvent(this, side, chess.getBoard(), move));
        }

        if (inb_piece == null) {
            chess.getBoardListener().onError(new ChessBoardEvent("no piece on square"));
            return;
        }

        //chess move object of board analyzer
        ChessMove chess_move = chess.getBoardAnalyzer().getPieceMoveAnalysis(new_move,
                inb_piece.piece_name,
                inb_piece.Me(),
                inb_piece.isFirstMove(),
                from_square,//from square
                to_square);//to square    

        if (!is_castle_completion) {
            if (!chess_move.isMoveValid()) {
                chess.getBoardListener().onInvalidMove(new ChessBoardEvent(this, chess_move.getInvalidMoveMessage(), from_square, to_square));
                return;
            }
        }

        castle = chess_move.getCastle();

        if (castle.isCastleOpportunity()) {

            System.out.println("isCastleOpportunity");

            chess.getBoard().MoveInternal(move);//effect the castle move in the internal board
            isCastleInProgress = true;

            if (castle.isKingSideCastle()) {
                System.out.println("isKingSideCastle");
                //fire event of short castle begin by king
                isShortCastleBeginByKing = true;
                chess.getBoardListener().onShortCastleBeginByKing(new ChessBoardEvent(this, side, chess.getBoard(), move));
            } else {
                System.out.println("isQueenSideCastle");
                //fire event of long castle begin by king
                isLongCastleBeginByKing = true;
                chess.getBoardListener().onLongCastleBeginByKing(new ChessBoardEvent(this, side, chess.getBoard(), move));
            }
            return;
        }

        //move the piece in the internal board
        chess.getBoard().MoveInternal(move);

        //fire event of this player move
        chess.getBoardListener().onLocalPlayerMove(new ChessBoardEvent(this, side, chess.getBoard(), move));

        int next_turn = side == Side.white ? Side.black : Side.white;

        //check game over
        if (!checkGameOver(analyzer, move, next_turn)) {
            //send the move to remote player if opponent is remote
            ChessPlayer reomote_player = chess.getOppontent(side);
            if (reomote_player != null) {
                reomote_player.setOpponentMove(move);
            }

            //notify player of his turn
            ChessPlayer turnPlayer = next_turn == Side.white ? chess.getWhitePlayer() : chess.getBlackPlayer();
            chess.getBoard().turn = next_turn;

            //fire event of next turn
            chess.getBoardListener().onNextTurn(new ChessBoardEvent(turnPlayer, next_turn));
        }
        
        //must be set at the last point here
        chess.setRobotEngineWait(false);//alright robot can now resume detecting internal board turn 
    }

    private boolean checkGameOver(BoardAnalyzer analyzer, Move move, int next_turn) {
        boolean is_checkmate = analyzer.isCheckmate(next_turn, -1, -1);//come back            
        boolean is_stalement = analyzer.isStalemate(next_turn, -1, -1);//come back
        boolean is_fifty_move_rule = analyzer.isFiftyMoveRule();
        boolean is_three_fold_repitition = analyzer.isThreefoldRepetition();
        //boolean is_insufficient_material = analyzer. ;//come back for is_insufficient_material

        if (is_checkmate) {
            ChessBoardEvent e = new ChessBoardEvent(move);
            ChessPlayer winner = next_turn == Side.white ? chess.getBlackPlayer() : chess.getWhitePlayer();//come back to check fo correctness
            e.setIsCheckmate(winner);
            chess.getBoardListener().onGameOver(e);
            is_game_over = true;
            return true;
        } else if (is_stalement) {
            ChessBoardEvent e = new ChessBoardEvent(move);
            e.setIsStalement();
            chess.getBoardListener().onGameOver(e);
            is_game_over = true;
            return true;
        } else if (is_fifty_move_rule) {
            ChessBoardEvent e = new ChessBoardEvent(move);
            e.setIsFiftyMoveRule();
            chess.getBoardListener().onGameOver(e);
            is_game_over = true;
            return true;
        } else if (is_three_fold_repitition) {
            ChessBoardEvent e = new ChessBoardEvent(move);
            e.setIsThreeFoldRepitition();
            chess.getBoardListener().onGameOver(e);
            is_game_over = true;
            return true;
        }/* else if(is_insufficient_material){//COME BACK FOR is_insufficient_material ABEG O!!!
         ChessBoardEvent e = new ChessBoardEvent(move);
         e.setIsInsufficientMaterial();      
         chess.getBoardListener().onGameOver(e);
         is_game_over = true;
         return true;
         }*/

        return false;
    }

    @Override
    public boolean isRemotePlayer() {
        return remote_user != null;
    }

    @Override
    public boolean isLocalPlayer() {
        return local_user != null;
    }

    private void setOpponentMove(Move move) {
        this.move_to_send = move;
    }

}

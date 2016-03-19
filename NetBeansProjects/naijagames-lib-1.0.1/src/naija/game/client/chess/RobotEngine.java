/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess;

import naija.game.client.chess.algorithm.*;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.EngineBoardAnalyzer;
import naija.game.client.chess.board.Move;
import naija.game.client.Side;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class RobotEngine {

    int side = -1;
    private final ChessPlayer player;
    private EngineBoardAnalyzer engineBoardAnalyzer;

    private Board currentBoardPosition;

    private int last_turn;
    private boolean isNewBoard;
    private Move best_move;

    int test_count;
    private AlphaBeta_3 alphaBeta_3;
    private AlphaBeta_4 alphaBeta_4;
    private AlphaBetaNegaMax alphaBetaNegaMax;
    private AlphaBetaNegaMaxOptimized alphaBetaNegaMaxOptimized;
    private AlphaBetaOptimized alphaBetaOptimized;
    private AlphaBetaOptimized_1 alphaBetaOptimized_1;
    private AlphaBetaOptimized_2 alphaBetaOptimized_2;
    int algorithm;
    int search_depth;
    
    RobotEngine(Board board, ChessPlayer player, int search_depth, int algorithm) {
        currentBoardPosition = board;
        isNewBoard = true;
        this.player = player;
        side = player.isWhite() ? Side.white : Side.black;
        engineBoardAnalyzer = new EngineBoardAnalyzer(board);
        this.algorithm = algorithm;
        this.search_depth = search_depth;
    }

    private Move bestMove(Board board, int turn, int search_depth, int algorithm) {
        currentBoardPosition = board;
        currentBoardPosition.turn = turn;
        isNewBoard = true;
        return bestMove(turn, search_depth, algorithm);
    }

    private Move bestMove(int turn, int search_depth, int algorithm) {

        if (turn < Side.white) {
            System.err.println("Invalid parameter: turn must be  1 (ie white) or 2 (ie black)!");
            return null;
        }

        if (search_depth < 1) {
            System.err.println("Invalid parameter: search depth cannot be less than 1!");
            return null;
        }

        if (!isNewBoard) {
            if (last_turn == turn) {//we do not want to repeat a localMove for same turn
                System.err.println("Already found best move for this turn!");
                return best_move;
            }
        }

        currentBoardPosition.turn = turn;

        if (algorithm == Algorithm.MinMax) {

        } else if (algorithm == Algorithm.AlphaBeta) {

             //if(alphaBeta==null)
            //alphaBeta=new AlphaBeta(curentBoardPositon, turn, search_depth);
            //best_move=alphaBeta.searchBestMove();
            if (alphaBeta_3 == null) {
                alphaBeta_3 = new AlphaBeta_3();
            }
            best_move = alphaBeta_3.searchBestMove(currentBoardPosition, search_depth);

             //if(alphaBeta_4==null)
            //alphaBeta_4=new AlphaBeta_4();
            //best_move=alphaBeta_4.searchBestMove(curentBoardPositon, search_depth);
             //if(alphaBetaNegaMax==null)
            //alphaBetaNegaMax=new AlphaBetaNegaMax();
            //best_move=alphaBetaNegaMax.searchBestMove(curentBoardPositon, search_depth);
             //if(alphaBetaNegaMaxOptimized==null)
            //alphaBetaNegaMaxOptimized=new AlphaBetaNegaMaxOptimized();
            //best_move=alphaBetaNegaMaxOptimized.searchBestMove(curentBoardPositon, search_depth);
             //if(alphaBetaOptimized==null)
            // alphaBetaOptimized=new AlphaBetaOptimized();
            //best_move=alphaBetaOptimized.searchBestMove(curentBoardPositon, search_depth);             
             //if(alphaBetaOptimized_1==null)
            // alphaBetaOptimized_1=new AlphaBetaOptimized_1();
            //best_move=alphaBetaOptimized_1.searchBestMove(curentBoardPositon, search_depth);             
             //if(alphaBetaOptimized_2==null)
            // alphaBetaOptimized_2=new AlphaBetaOptimized_2();
            //best_move=alphaBetaOptimized_2.searchBestMove(curentBoardPositon, search_depth);             
        } else if (algorithm == Algorithm.NegaScout) {

        } else if (algorithm == Algorithm.PrincipalVariation) {

        }

        //Now let the  internal board reflect the localMove.
        //----------but on the next line below, pls come back for castling e.t.c - abeg o!-------
        //if(best_move!=null)
        // curentBoardPositon.MovePiece(best_move);  
        //finally
        last_turn = turn;
        isNewBoard = false;

        return best_move;
    }

    boolean isGameOver() {
       return player.is_game_over;
    }

    void nextReply(Board board) {
        if (currentBoardPosition.turn == side) {
            //get the best move
            Move move = bestMove(board, side, search_depth, algorithm);
            if (move == null) {
                //here most likely the game is over
                return;
            }
            
            this.player.robotMove(move);//robot move the piece 
             
        }
    }

}

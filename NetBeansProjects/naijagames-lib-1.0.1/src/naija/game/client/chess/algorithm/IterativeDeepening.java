/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.algorithm;

import naija.game.client.chess.ChessMove;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.EngineBoardAnalyzer;

/**
 *
 * @author Onyeka Alimele
 */
public class IterativeDeepening {
    
    ChessMove best_move;
    ChessMove[] legal_moves;//use for commentary by comparing move values
    private Board board;
    EngineBoardAnalyzer engine_board_analyzer;
    TransPositionTable ttHashTable=new TransPositionTable();
    //TransPositionTable_1 ttHashTable_1=new TransPositionTable_1();
    
    int iterativeDeepening(Board _board, int max_depth, int first_guess){
        
        
        
        AlphaBetaOptimized ab=new AlphaBetaOptimized(); 
        for(int depth=1; depth<max_depth; depth++){
            //TODO: TAKE ADVANTAGE OF GOOD MOVE ORDERING BY RESULT OF LOWER DEPTH SEARCH.
            //PLS STUDY MORE ON ITERATIVE DEEPENING - ALL THE INTRICACIES
            
            this.board.CopyBoard(_board);//get copy of original board position. this is importat since
                                         //the previous board used for the last search must have had  some
                                         //minor change in control variable.   
            
            long value=ab.search(true, Long.MIN_VALUE, Long.MAX_VALUE, -1, depth , -1);
            
        }
        
        return first_guess;
    }
    
    public static void main(String args[]){
        
    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.algorithm;

/**
 *
 * @author Onyeka Alimele
 */
public class NegaMax {

    
    // method call with depth 5 and minimum and maximum boundaries
    // minimaxValue = alphaBeta(board, 5, -MATE, +MATE)
    /*
     * DEVELOP THIS CODE SAMPLE LATER
     * int alphaBeta(ChessBoard board, int depth, int alpha, int beta)
    {
        int value;
        if(depth == 0 || board.isEnded())
        {
            value = evaluate(board);
            return value;
        }
        board.getOrderedMoves();
        int best = -MATE-1;
        int move; 
        ChessBoard nextBoard;
        while (board.hasMoreMoves())
        {
            move = board.getNextMove();
            nextBoard = board.makeMove(move);
            value = -alphaBeta(nextBoard, depth-1,-beta,-alpha);
            if(value > best)
                best = value;
            if(best > alpha)
                alpha = best;
            if(best >= beta)
                break;
        }
        
        return best;
    } 
     * 
     */
}

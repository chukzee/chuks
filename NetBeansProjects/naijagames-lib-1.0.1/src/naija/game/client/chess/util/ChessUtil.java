/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.util;

/**
 *
 * @author USER
 */
public class ChessUtil {
    
    
    static public int getRowIndex(int square) {
        double d_square = square;
        return (int) ((float) (d_square / 8));
    }

    static public int getColumnIndex(int square) {

        double d_square = square;
        int v1 = (int) (d_square / 8);
        double v2 = d_square / 8;
        double fraction = v2 - v1;

        return (int) ((float) (fraction * 8));       
    }

    static public int getSquare(int row_index, int col_index){
        return row_index*8 + col_index;
    }
    
    public static void main(String args[]){
        for(int i=0; i<64; i++){
            System.out.println("square = "+i+"  ------ row = "+ChessUtil.getRowIndex(i)+" ---- "+" col = "+ChessUtil.getColumnIndex(i));
        }
    }
    
}

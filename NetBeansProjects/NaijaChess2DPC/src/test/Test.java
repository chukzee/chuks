/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.util.logging.Level;
import java.util.logging.Logger;
import naija.game.client.event.GameEvent;
import naija.game.client.GamePosition;
import naija.game.client.LocalUser;
import naija.game.client.Player;
import naija.game.client.Robot;
import naija.game.client.chess.Chess;
import naija.game.client.chess.ChessBoardListener;
import naija.game.client.chess.ChessBoardEvent;
import naija.game.client.chess.PieceName;
import naija.game.client.chess.board.ChessBoardPosition;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Test {

    public static void main(String args[]) {

        //test1();
        //test2();
        //test3();
        //test4();
        //test5();
        test6();
    }

    private static void test1() {

        for (int i = 0; i < 100; i++) {
            int n = i / 4 * 4;
            System.out.println(n);
        }
    }

    private static void test2() {
         long n = System.nanoTime();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException ex) {
            Logger.getLogger(Test.class.getName()).log(Level.SEVERE, null, ex);
        }
        //System.out.println(System.nanoTime() - n);
        //337473
        //System.out.println(2011337473-(2011337473/1000000)*1000000);
        System.out.println(n-(n/1000000)*1000000);
        
    }

    private static void test3() {
        int n=5;
        int m=2;
        double p=n/(double)m;
        System.out.println(Math.ceil(2.1));
    }

    private static void test4() {
        ChessBoardListener listener= new ChessBoardListener() {

            @Override
            public void onRobotMove(ChessBoardEvent event) {
                System.out.println("onRobotMove");
            }

            @Override
            public void onRemotePlayerMove(ChessBoardEvent event) {
                System.out.println("onRemoteMove");
            }

            @Override
            public void onLocalPlayerMove(ChessBoardEvent event) {
                System.out.println("onLocalMove");
            }

            @Override
            public void onNextTurn(ChessBoardEvent event) {
                System.out.println("onNextTurn");
            }

            @Override
            public void onGameOver(ChessBoardEvent event) {
                System.out.println("onGameOver");
            }

            @Override
            public void onInvalidMove(ChessBoardEvent event) {
                System.out.println("onInvalidMove");
            }

            @Override
            public void onError(ChessBoardEvent event) {
                System.out.println("onError");
            }

            @Override
            public void onInvalidTurn(ChessBoardEvent event) {
                System.out.println("onInvalidTurn");

            }

            @Override
            public void onShortCastleBeginByKing(ChessBoardEvent event) {
                System.out.println("onShortCastleBeginByKing");
            }

            @Override
            public void onShortCastleEndByRook(ChessBoardEvent event) {
                System.out.println("onShortCastleEndByRook");
            }

            @Override
            public void onLongCastleBeginByKing(ChessBoardEvent event) {
                System.out.println("onLongCastleBeginByKing");
            }

            @Override
            public void onLongCastleEndByRook(ChessBoardEvent event) {
                System.out.println("onLongCastleEndByRook");
            }

            @Override
            public void initializeGamePosition(ChessBoardPosition board_position, Player... players) {
                
            }

            
        };
        
        
        Chess chess = new Chess.ChessBuilder(listener)
                .whitePlayer(new LocalUser())
                .blackPlayer(new Robot("computer"))
                .build();
        
        chess.getWhitePlayer().localMove(PieceName.pawn, 15, 23);
        
        while(true){
            
        }
    }

    private static void test5() {
        for(int i=0; i<64; i++)
            System.out.println(i+" ----> "+getReverseSquare(i));
    }
    
    
    private static int getReverseSquare(int square){
        if(square<0 || square>63)
            return -1;
        
        int row = square/8;
        int col = square%8;
        
        int reverse = Math.abs(row-7)*8 + col;
        return reverse;
    }

    private static void test6() {
        String str1 = "id(0) -> sq(0) , id(1) -> sq(26) , id(2) -> sq(2) , id(3) -> sq(20) , id(4) -> sq(10) , id(5) -> sq(5) , id(6) -> sq(23) , id(7) -> sq(7) , id(8) -> sq(8) , id(9) -> sq(17) , id(10) -> sq(18) , id(11) -> sq(11) , id(12) -> sq(28) , id(13) -> sq(29) , id(14) -> sq(14) , id(15) -> sq(15) , id(16) -> sq(48) , id(17) -> sq(41) , id(18) -> sq(42) , id(19) -> sq(51) , id(20) -> sq(44) , id(21) -> sq(53) , id(22) -> sq(46) , id(23) -> sq(55) , id(24) -> sq(56) , id(25) -> sq(57) , id(26) -> sq(40) , id(27) -> sq(47) , id(28) -> sq(60) , id(29) -> sq(61) , id(30) -> sq(62) , id(31) -> sq(63)";
        String str2 = "id(0) -> sq(0) , id(1) -> sq(26) , id(2) -> sq(2) , id(3) -> sq(20) , id(4) -> sq(10) , id(5) -> sq(5) , id(6) -> sq(23) , id(7) -> sq(7) , id(8) -> sq(8) , id(9) -> sq(17) , id(10) -> sq(18) , id(11) -> sq(11) , id(12) -> sq(28) , id(13) -> sq(29) , id(14) -> sq(14) , id(15) -> sq(15) , id(16) -> sq(48) , id(17) -> sq(41) , id(18) -> sq(42) , id(19) -> sq(51) , id(20) -> sq(44) , id(21) -> sq(53) , id(22) -> sq(46) , id(23) -> sq(55) , id(24) -> sq(56) , id(25) -> sq(57) , id(26) -> sq(40) , id(27) -> sq(47) , id(28) -> sq(60) , id(29) -> sq(61) , id(30) -> sq(62) , id(31) -> sq(63)";
        String d1="";
        String d2="";
        for(int i=0; i<str1.length();i++){
            if(str1.charAt(i)!=str2.charAt(i)){
                d1+=str1.charAt(i);
                d2+=str2.charAt(i);
            }
        }
        
        System.out.println(d1);
        System.out.println(d2);
        
    }
    
}

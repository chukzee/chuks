/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess.board;

import naija.game.client.chess.*;
import naija.game.client.chess.board.Board;
import naija.game.client.chess.board.EngineBoardAnalyzer;

/**
 *
 * @author Onyeka Alimele
 */

    
public class Tester {
    
    
    Board board=new Board(true);
    EngineBoardAnalyzer engineBoardAnalyzer = new EngineBoardAnalyzer(board);
    
    public static void main(String args[]){
        
        Tester t=new Tester();
        System.out.println(new Board(true));
        //t.autoSwitchCode();
        
        //t.test_char_Switch();
        /*
        int count =25000000;
        
        double char_switch_time= t.char_switchSpeed(count);
        double switch_time= t.switchSpeed(count);
        double if_time = t.ifSpeed(count);     
        
        
        System.out.println("char_switch_time "+char_switch_time);
        System.out.println("switch_time "+switch_time);
        System.out.println("if_time "+if_time);
        
         * 
         */

    }
    
    void test_char_Switch(){
        
        for(int i=0; i<64; i++){
            if(i==0)
                System.out.println("switch(square){");
            
            System.out.print("    case "+i+" : ");
            int[] squares=engineBoardAnalyzer.getVerticalDownwardSquares(i);
            if(squares==null){
                squares=new int[0];
            }
            System.out.print("return new char[]{");
            for(int k=0; k<squares.length;k++){
                String comma=",";
                if(k==squares.length-1)
                    comma="";
                
                System.out.print(squares[k]+comma);                

            }
            System.out.print("};");
            System.out.println();
            
            if(i==63)
                System.out.println("}");
        }
    }

            
    void autoSwitchCode(){
        
        for(int i=0; i<64; i++){
            if(i==0)
                System.out.println("switch(square){");
            
            System.out.print("    case "+i+" : ");
            int[] squares=engineBoardAnalyzer.getKingValidMoveSquares(i,-1,-1,-1);
            if(squares==null){
                squares=new int[0];
            }
            System.out.print("return new int[]{");
            for(int k=0; k<squares.length;k++){
                String comma=",";
                if(k==squares.length-1)
                    comma="";
                
                System.out.print(squares[k]+comma);                

            }
            System.out.print("};");
            System.out.println();
            
            if(i==63)
                System.out.println("}");
        }
    }
    
    void testSwitch(){
        
        for(int i=0; i<64; i++){
            if(i==0)
                System.out.println("switch(square){");
            
            System.out.print("    case "+i+" : ");
            int[] squares=engineBoardAnalyzer.getKnightCapturableSquares(i);
            if(squares==null){
                squares=new int[0];
            }
            System.out.print("return new int[]{");
            for(int k=0; k<squares.length;k++){
                String comma=",";
                if(k==squares.length-1)
                    comma="";
                
                System.out.print(squares[k]+comma);                

            }
            System.out.print("};");
            System.out.println();
            
            if(i==63)
                System.out.println("}");
        }
    }    
    
    void testIfElse(){
        
        for(int i=0; i<64; i++){
            if(i==0)
                System.out.println("if(square=="+i+"){");
            else
                System.out.println("else if(square=="+i+"){");
            
            System.out.print("return new int[]{");
            int[] squares=engineBoardAnalyzer.getVerticalDownwardSquares(i);
            if(squares==null){
                squares=new int[0];
            }
            
            for(int k=0; k<squares.length;k++){
                String comma=",";
                if(k==squares.length-1)
                    comma="";
                
                System.out.print(squares[k]+comma);                

            }
            System.out.print("};\n}");
            
        }
    }    
    
    int [] ifStatement(int square){
        
        if(square==0){
        return new int[]{};
        }else if(square==1){
        return new int[]{};
        }else if(square==2){
        return new int[]{};
        }else if(square==3){
        return new int[]{};
        }else if(square==4){
        return new int[]{};
        }else if(square==5){
        return new int[]{};
        }else if(square==6){
        return new int[]{};
        }else if(square==7){
        return new int[]{};
        }else if(square==8){
        return new int[]{0};
        }else if(square==9){
        return new int[]{1};
        }else if(square==10){
        return new int[]{2};
        }else if(square==11){
        return new int[]{3};
        }else if(square==12){
        return new int[]{4};
        }else if(square==13){
        return new int[]{5};
        }else if(square==14){
        return new int[]{6};
        }else if(square==15){
        return new int[]{7};
        }else if(square==16){
        return new int[]{8,0};
        }else if(square==17){
        return new int[]{9,1};
        }else if(square==18){
        return new int[]{10,2};
        }else if(square==19){
        return new int[]{11,3};
        }else if(square==20){
        return new int[]{12,4};
        }else if(square==21){
        return new int[]{13,5};
        }else if(square==22){
        return new int[]{14,6};
        }else if(square==23){
        return new int[]{15,7};
        }else if(square==24){
        return new int[]{16,8,0};
        }else if(square==25){
        return new int[]{17,9,1};
        }else if(square==26){
        return new int[]{18,10,2};
        }else if(square==27){
        return new int[]{19,11,3};
        }else if(square==28){
        return new int[]{20,12,4};
        }else if(square==29){
        return new int[]{21,13,5};
        }else if(square==30){
        return new int[]{22,14,6};
        }else if(square==31){
        return new int[]{23,15,7};
        }else if(square==32){
        return new int[]{24,16,8,0};
        }else if(square==33){
        return new int[]{25,17,9,1};
        }else if(square==34){
        return new int[]{26,18,10,2};
        }else if(square==35){
        return new int[]{27,19,11,3};
        }else if(square==36){
        return new int[]{28,20,12,4};
        }else if(square==37){
        return new int[]{29,21,13,5};
        }else if(square==38){
        return new int[]{30,22,14,6};
        }else if(square==39){
        return new int[]{31,23,15,7};
        }else if(square==40){
        return new int[]{32,24,16,8,0};
        }else if(square==41){
        return new int[]{33,25,17,9,1};
        }else if(square==42){
        return new int[]{34,26,18,10,2};
        }else if(square==43){
        return new int[]{35,27,19,11,3};
        }else if(square==44){
        return new int[]{36,28,20,12,4};
        }else if(square==45){
        return new int[]{37,29,21,13,5};
        }else if(square==46){
        return new int[]{38,30,22,14,6};
        }else if(square==47){
        return new int[]{39,31,23,15,7};
        }else if(square==48){
        return new int[]{40,32,24,16,8,0};
        }else if(square==49){
        return new int[]{41,33,25,17,9,1};
        }else if(square==50){
        return new int[]{42,34,26,18,10,2};
        }else if(square==51){
        return new int[]{43,35,27,19,11,3};
        }else if(square==52){
        return new int[]{44,36,28,20,12,4};
        }else if(square==53){
        return new int[]{45,37,29,21,13,5};
        }else if(square==54){
        return new int[]{46,38,30,22,14,6};
        }else if(square==55){
        return new int[]{47,39,31,23,15,7};
        }else if(square==56){
        return new int[]{48,40,32,24,16,8,0};
        }else if(square==57){
        return new int[]{49,41,33,25,17,9,1};
        }else if(square==58){
        return new int[]{50,42,34,26,18,10,2};
        }else if(square==59){
        return new int[]{51,43,35,27,19,11,3};
        }else if(square==60){
        return new int[]{52,44,36,28,20,12,4};
        }else if(square==61){
        return new int[]{53,45,37,29,21,13,5};
        }else if(square==62){
        return new int[]{54,46,38,30,22,14,6};
        }else if(square==63){
        return new int[]{55,47,39,31,23,15,7};
        }    

        return null;
    }
    
    int [] switchStatement(int square){
            
            switch(square){
                case 0 : return new int[]{};
                case 1 : return new int[]{};
                case 2 : return new int[]{};
                case 3 : return new int[]{};
                case 4 : return new int[]{};
                case 5 : return new int[]{};
                case 6 : return new int[]{};
                case 7 : return new int[]{};
                case 8 : return new int[]{0};
                case 9 : return new int[]{1};
                case 10 : return new int[]{2};
                case 11 : return new int[]{3};
                case 12 : return new int[]{4};
                case 13 : return new int[]{5};
                case 14 : return new int[]{6};
                case 15 : return new int[]{7};
                case 16 : return new int[]{8,0};
                case 17 : return new int[]{9,1};
                case 18 : return new int[]{10,2};
                case 19 : return new int[]{11,3};
                case 20 : return new int[]{12,4};
                case 21 : return new int[]{13,5};
                case 22 : return new int[]{14,6};
                case 23 : return new int[]{15,7};
                case 24 : return new int[]{16,8,0};
                case 25 : return new int[]{17,9,1};
                case 26 : return new int[]{18,10,2};
                case 27 : return new int[]{19,11,3};
                case 28 : return new int[]{20,12,4};
                case 29 : return new int[]{21,13,5};
                case 30 : return new int[]{22,14,6};
                case 31 : return new int[]{23,15,7};
                case 32 : return new int[]{24,16,8,0};
                case 33 : return new int[]{25,17,9,1};
                case 34 : return new int[]{26,18,10,2};
                case 35 : return new int[]{27,19,11,3};
                case 36 : return new int[]{28,20,12,4};
                case 37 : return new int[]{29,21,13,5};
                case 38 : return new int[]{30,22,14,6};
                case 39 : return new int[]{31,23,15,7};
                case 40 : return new int[]{32,24,16,8,0};
                case 41 : return new int[]{33,25,17,9,1};
                case 42 : return new int[]{34,26,18,10,2};
                case 43 : return new int[]{35,27,19,11,3};
                case 44 : return new int[]{36,28,20,12,4};
                case 45 : return new int[]{37,29,21,13,5};
                case 46 : return new int[]{38,30,22,14,6};
                case 47 : return new int[]{39,31,23,15,7};
                case 48 : return new int[]{40,32,24,16,8,0};
                case 49 : return new int[]{41,33,25,17,9,1};
                case 50 : return new int[]{42,34,26,18,10,2};
                case 51 : return new int[]{43,35,27,19,11,3};
                case 52 : return new int[]{44,36,28,20,12,4};
                case 53 : return new int[]{45,37,29,21,13,5};
                case 54 : return new int[]{46,38,30,22,14,6};
                case 55 : return new int[]{47,39,31,23,15,7};
                case 56 : return new int[]{48,40,32,24,16,8,0};
                case 57 : return new int[]{49,41,33,25,17,9,1};
                case 58 : return new int[]{50,42,34,26,18,10,2};
                case 59 : return new int[]{51,43,35,27,19,11,3};
                case 60 : return new int[]{52,44,36,28,20,12,4};
                case 61 : return new int[]{53,45,37,29,21,13,5};
                case 62 : return new int[]{54,46,38,30,22,14,6};
                case 63 : return new int[]{55,47,39,31,23,15,7};
            }        
            
        return null;
    }

    char [] charSwitchStatement(char square){

            switch(square){
                case 0 : return new char[]{};
                case 1 : return new char[]{};
                case 2 : return new char[]{};
                case 3 : return new char[]{};
                case 4 : return new char[]{};
                case 5 : return new char[]{};
                case 6 : return new char[]{};
                case 7 : return new char[]{};
                case 8 : return new char[]{0};
                case 9 : return new char[]{1};
                case 10 : return new char[]{2};
                case 11 : return new char[]{3};
                case 12 : return new char[]{4};
                case 13 : return new char[]{5};
                case 14 : return new char[]{6};
                case 15 : return new char[]{7};
                case 16 : return new char[]{8,0};
                case 17 : return new char[]{9,1};
                case 18 : return new char[]{10,2};
                case 19 : return new char[]{11,3};
                case 20 : return new char[]{12,4};
                case 21 : return new char[]{13,5};
                case 22 : return new char[]{14,6};
                case 23 : return new char[]{15,7};
                case 24 : return new char[]{16,8,0};
                case 25 : return new char[]{17,9,1};
                case 26 : return new char[]{18,10,2};
                case 27 : return new char[]{19,11,3};
                case 28 : return new char[]{20,12,4};
                case 29 : return new char[]{21,13,5};
                case 30 : return new char[]{22,14,6};
                case 31 : return new char[]{23,15,7};
                case 32 : return new char[]{24,16,8,0};
                case 33 : return new char[]{25,17,9,1};
                case 34 : return new char[]{26,18,10,2};
                case 35 : return new char[]{27,19,11,3};
                case 36 : return new char[]{28,20,12,4};
                case 37 : return new char[]{29,21,13,5};
                case 38 : return new char[]{30,22,14,6};
                case 39 : return new char[]{31,23,15,7};
                case 40 : return new char[]{32,24,16,8,0};
                case 41 : return new char[]{33,25,17,9,1};
                case 42 : return new char[]{34,26,18,10,2};
                case 43 : return new char[]{35,27,19,11,3};
                case 44 : return new char[]{36,28,20,12,4};
                case 45 : return new char[]{37,29,21,13,5};
                case 46 : return new char[]{38,30,22,14,6};
                case 47 : return new char[]{39,31,23,15,7};
                case 48 : return new char[]{40,32,24,16,8,0};
                case 49 : return new char[]{41,33,25,17,9,1};
                case 50 : return new char[]{42,34,26,18,10,2};
                case 51 : return new char[]{43,35,27,19,11,3};
                case 52 : return new char[]{44,36,28,20,12,4};
                case 53 : return new char[]{45,37,29,21,13,5};
                case 54 : return new char[]{46,38,30,22,14,6};
                case 55 : return new char[]{47,39,31,23,15,7};
                case 56 : return new char[]{48,40,32,24,16,8,0};
                case 57 : return new char[]{49,41,33,25,17,9,1};
                case 58 : return new char[]{50,42,34,26,18,10,2};
                case 59 : return new char[]{51,43,35,27,19,11,3};
                case 60 : return new char[]{52,44,36,28,20,12,4};
                case 61 : return new char[]{53,45,37,29,21,13,5};
                case 62 : return new char[]{54,46,38,30,22,14,6};
                case 63 : return new char[]{55,47,39,31,23,15,7};
            }

        return null;
    }    
    
    private double ifSpeed(int count) {
     
        long time=System.nanoTime();        
        
        for(int i=0; i<count; i++)
            ifStatement(63);

        long elapse = System.nanoTime() - time;
        
        return elapse/1000000000.0 ;       
    }
    

    private double switchSpeed(int count) {
     
        long time=System.nanoTime();        
        
        for(int i=0; i<count; i++)
            switchStatement((int)63);

        long elapse = System.nanoTime() - time;
        
        return elapse/1000000000.0 ;        
    }  
    

    private double char_switchSpeed(int count) {
     
        long time=System.nanoTime();        

        for(int i=0; i<count; i++)
            charSwitchStatement((char)63);

        long elapse = System.nanoTime() - time;
        
        return elapse/1000000000.0 ;        
    }      
}

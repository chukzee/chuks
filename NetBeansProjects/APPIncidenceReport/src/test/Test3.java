/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Test3 {
    
    public static void main(String... args){
        int interval_in_sec = 10;
        long time = System.currentTimeMillis();
        int last_elapse = 0;
        while(true){
            int elapse=(int)((System.currentTimeMillis()- time)/1000);
            if(elapse % interval_in_sec == 0 && last_elapse!=elapse){
                last_elapse = elapse;
                System.out.println(elapse);
            }
        }
    }
}

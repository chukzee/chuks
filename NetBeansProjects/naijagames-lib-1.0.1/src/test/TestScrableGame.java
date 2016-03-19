/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.util.UUID;

/**
 *
 * @author USER
 */
public class TestScrableGame {
    
    public static void main(String args[]){
        UUID d = UUID.nameUUIDFromBytes(String.valueOf(System.nanoTime()).getBytes());
        
        System.out.println(d.toString());
    }
}

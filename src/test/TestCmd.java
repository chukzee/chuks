/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import chuks.builder.AppBuilder;

/**
 *
 * @author USER
 */
public class TestCmd {
    
    public static void main(String[] args) {
        String line = "  --build   go=\"12   34\" \"      5678 \"   |";
        String[] cmd = AppBuilder.getCommandLine(line);
        for(int i=0; i<cmd.length; i++){
            System.out.println(cmd[i]);
        }
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

/**
 *
 * @author USER
 */
public class TestLineCount {

    public static void main(String... arg) throws IOException {
        String test = "\n";
        System.out.println("\\n = "+test.codePointAt(0));
        test = "\"";
        System.out.println(test +" = " + test.codePointAt(0));
        test = "'";
        System.out.println(test +" =" + test.codePointAt(0));
        test = "`";
        System.out.println(test +"  =" + test.codePointAt(0));
        test = ";";
        System.out.println(test +" =" + test.codePointAt(0));
        test = "\\";
        System.out.println(test +" =" + test.codePointAt(0));
        test = "n";
        System.out.println(test +" =" + test.codePointAt(0));
        test = "/";
        System.out.println(test +" =" + test.codePointAt(0));
        test = "*";
        System.out.println(test +" =" + test.codePointAt(0));
        
        System.out.println("---------------TEST NOW------------------");
        
        String path = "C:\\Users\\USER\\Documents\\NetBeansProjects\\Game9ja\\test\\test_line_number.js";
        File f = new File(path);
        FileInputStream fstream = new FileInputStream(f);
        byte[] buff = new byte[(int) f.length()];

        fstream.read(buff);
        for (int i = 0; i < buff.length; i++) {
            System.out.println(buff[i]);
        }

    }
}

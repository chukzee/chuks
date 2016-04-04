/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.http.HttpContentLengthException;

/**
 *
 * @author USER
 */
public class TestAnalyzeRequest {

    public static void main(String args[]) throws Exception {
        //test_1();
        test_2();
    }

    private static void test_1() throws Exception {
        RequestTask r = new RequestTask(null);
        String str = "123456789\r\n\r\nZZZabcdefghi\r\n\r\nZZZqrstuvwxy\r\n\r\n";
        byte[] arr = str.getBytes();
        //r.analyzeHttpRecv(arr, 0, str.length());

        int len = "123456789\r\n\r\nZZZ".length();
        String n = "";

        int num = 0;
        int start = len * num;

        String s = str.substring(0 + start, 1 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(1 + start, 2 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(2 + start, 3 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(3 + start, 4 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(4 + start, 5 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(5 + start, 6 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(6 + start, 7 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(7 + start, 8 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(8 + start, 9 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(9 + start, 10 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(10 + start, 11 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(11 + start, 12 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;
        s = str.substring(12 + start, 13 + start);
        r.analyzeHttpRecv(s.getBytes());
        n += s;

        System.out.println("--------------");

        System.out.println(n);
    }

    private static void test_2() throws Exception {
        RequestTask r = new RequestTask(null);
        String str = "12345678\r\n\r\nZZZabcdefgh\r\n\r\nZZZjklmnopq\r\n\r\nZZZrstuvwxy\r\n\r\nZZZ";
        
        int len = str.length();
        String s = str.substring(0, 37);
        r.analyzeHttpRecv(s.getBytes());
    }
}

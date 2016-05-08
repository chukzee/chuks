/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface HttpConstants {
    public static int GET_METHOD = 1;
    public static int POST_METHOD = 2;
    public static int PUT_METHOD = 3;
    public static int DELETE_METHOD = 4;
    public static int HEAD_METHOD = 5;
    public static int UNKNWON_METHOD = 4445;
    
    public static String HTTP_1_0 = "HTTP/1.0";
    public static String HTTP_1_1 = "HTTP/1.1";
    public static String HTTP_2_0 = "HTTP/2.0";
    public static String UNKNOWN_HTTP_VERSION="";
    

}

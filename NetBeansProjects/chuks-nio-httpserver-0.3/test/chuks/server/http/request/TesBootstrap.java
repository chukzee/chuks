/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import java.io.IOException;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TesBootstrap {

    public static void main(String[] args) throws IOException {
        
        SimpleHttpServer.classPath = "C:\\Users\\USER\\Documents\\NetBeansProjects\\APPIncidenceReport\\build\\classes\\";
        SimpleHttpServer.libraryPath = "C:\\Users\\USER\\Documents\\NetBeansProjects\\APPIncidenceReport\\dist\\lib\\";
        Bootstrap b = Bootstrap.getInstance();
        b.load();
    }
}

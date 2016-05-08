/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.http.impl.Bootstrap;
import chuks.server.http.impl.HttpServerImpl;
import java.io.IOException;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TesBootstrap {

    public static void main(String[] args) throws IOException {
        
        HttpServerImpl.classPath = "C:\\Users\\USER\\Documents\\NetBeansProjects\\APPIncidenceReport\\build\\classes\\";
        HttpServerImpl.libraryPath = "C:\\Users\\USER\\Documents\\NetBeansProjects\\APPIncidenceReport\\dist\\lib\\";
        Bootstrap b = Bootstrap.getInstance();
        b.load();
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import chuks.builder.AppBuilder;
import chuks.builder.exception.AppBuilderException;
import java.io.InputStream;
import java.net.URL;
import java.util.Scanner;

/**
 *
 * @author USER
 */
public class Test {
    
    private void createProdIndexPage() throws AppBuilderException {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("chuks/builder/index.html");
        if(in == null){
            throw new AppBuilderException("Could not create index.html for build - html template resource not found. Make sure the installation is correct.");
        }
        Scanner s = new Scanner(in);
        String html = "";
        while(s.hasNextLine()){
            html+=s.nextLine()+"\n";
        }
        
        html = html.replaceFirst("\\{app_js\\}", "");//replace {app_js}
        html = html.replaceFirst("\\{app_name\\}", "");//replace {app_name}
        
        
        System.out.println(html);
    }
    public static void main(String... args) throws AppBuilderException{
        new Test().createProdIndexPage();
    }
}

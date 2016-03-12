/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 *
 * @author USER
 */
public class Test {
 
    public static void main(String... args) throws ClassNotFoundException, SQLException, InterruptedException{
        int n =4;
        int m=3;

        
        System.out.println(n&m);
        System.out.println(n&m);
        
        System.out.println("----------");
        
        Class.forName("java.sql.Driver");
        MysqlDataSource d = new MysqlDataSource();
        d.setURL("jdbc:mysql://localhost:3306/autopolicedb");
        d.setUser("autopolice");
        d.setPassword("autopolicepass");
        Connection conn = d.getConnection();
        System.out.println(conn);
        Thread.sleep(120000);
        System.out.println("testing validity");
        if(conn.isValid(30000)){
            System.out.println("is valid");
        }else{
            System.out.println("not valid");            
        }
    }
}

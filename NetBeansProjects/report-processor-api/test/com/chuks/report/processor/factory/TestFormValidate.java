/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.factory.ProcessorFactory;
import javax.swing.JComponent;
import javax.swing.JTextField;
import com.chuks.report.processor.param.ErrorCallBack;
import com.chuks.report.processor.FormProcessor;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author USER
 */
public class TestFormValidate {
    public static void main(String... args){
        
        JTextField tf1 = new JTextField();
        tf1.setText("30");

        JTextField tf2 = new JTextField();
        tf2.setText("chuks");

        JTextField tf3 = new JTextField();
        tf3.setText("24.322");

        JTextField tf4 = new JTextField();
        //tf4.setText("929.44");

        JTextField tf5 = new JTextField();
        //tf5.setText("23");

        JTextField tf6 = new JTextField();
        tf6.setText("09-03-2015");

        JTextField tf7 = new JTextField();
        tf7.setText("08-03-2004 03:11:11");
        
        JDBCSettings jdbcSettings = new JDBCSettings("jdbc:mysql://localhost:3306/autopolicedb", "autopolice", "autopolicepass", null);
        
        FormProcessor f = ProcessorFactory.getFormProcessor(jdbcSettings);
        
        f.runAllValidations(true);
        
        ErrorCallBack errCall = new ErrorCallBack(){
            @Override
            public void onError(JComponent compent, String accesible_name) {
                System.err.println(compent);
            }
        };
        
        if(!f.validateEmpty(errCall, tf4,tf5)){
            System.out.println("did nothing");
            return;
        }
        
        
    }
}

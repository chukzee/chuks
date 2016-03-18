/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.factory.ProcessorFactory;
import java.sql.SQLException;
import javax.swing.JComponent;
import javax.swing.JTextField;
import com.chuks.report.processor.param.ErrorCallBack;
import com.chuks.report.processor.FormProcessor;
import com.chuks.report.processor.entry.FieldType;
import com.chuks.report.processor.util.JDBCSettings;
import org.apache.commons.dbcp2.BasicDataSource;

/**
 *
 * @author USER
 */
public class TestProcessorInsert {

    public static void main(String args[]) throws SQLException {

        JTextField tf1 = new JTextField();
        tf1.setText("30");

        JTextField tf2 = new JTextField();
        tf2.setText("chuks");

        JTextField tf3 = new JTextField();
        tf3.setText("24.322");

        JTextField tf4 = new JTextField();
        tf4.setText("929.44");

        JTextField tf5 = new JTextField();
        tf5.setText("23");

        JTextField tf6 = new JTextField();
        tf6.setText("09-03-2015");

        JTextField tf7 = new JTextField();
        tf7.setText("08-03-2004 03:11:11");
        
        JDBCSettings jdbcSettings = new JDBCSettings("jdbc:mysql://localhost:3306/autopolicedb", "autopolice", "autopolicepass", null);
        
        FormProcessor f = ProcessorFactory.getFormProcessor(jdbcSettings);
        f.transactionBegins();
        for (int i = 0; i < 20; i++) {
            System.out.println("i "+i);
            f.insert()
                    .value("ID", tf1, FieldType.INTEGER)
                    .value("NAME", tf2, FieldType.STRING)
                    .value("AMOUNT", tf3, FieldType.FLOAT)
                    .value("CASH", tf4, FieldType.DOUBLE)
                    .value("AGE", tf5, FieldType.INTEGER)
                    .value("DATE", tf6, FieldType.DATE_yyyy_MM_dd)
                    .value("TIME", tf7, FieldType.DATE_yyyy_MM_dd_HH_mm_ss)
                    .into("test_table_1");
            
        }
        
        
        f.transactionEnds();
        f.close();

    }
}

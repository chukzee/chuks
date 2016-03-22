/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import java.awt.Component;
import java.sql.SQLException;
import javax.swing.Box;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTable;
import javax.swing.table.TableRowSorter;
import com.chuks.report.processor.param.TableFieldCallBack;
import com.chuks.report.processor.param.TableFieldGen;
import com.chuks.report.processor.TableProcessor;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author USER
 */
public class TestProcessorSelect {

    public static void main(String... args) throws SQLException {

        JDBCSettings jdbcSettings = new JDBCSettings("jdbc:mysql://localhost:3306/autopolicedb", "autopolice", "autopolicepass", null);

        TableProcessor t = ProcessorFactory.getTableProcessor(jdbcSettings);

        t.select()
                .columns("ID", "CASH", "AMOUNT", "NAME", "AGE")
                .from("test_table_1")
                .where()
                .lessOrEqual("AGE", "250")
                .and()
                .greaterOrEqual("AGE", "0");
        
        JFrame frame = new JFrame();

        final JTable table = new JTable();

        frame.setSize(400, 400);
        frame.setLocationRelativeTo(null);
        final Box box = Box.createVerticalBox();
        frame.add(box);
        JButton b1 = new JButton("test1");
        b1.setSize(100, 25);
        JButton b2 = new JButton("test1");
        b2.setSize(100, 25);
        box.add(b1);
        box.add(b2);
        //frame.add(table);

        JPanel panel = new JPanel();
        frame.add(panel);

        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        //t.loadOnTable(table);
        TableFieldSource s1 = new TableFieldSource("ADD");
        s1.addDBSources("id", "age");
        TableFieldSource s2 = new TableFieldSource("SUM");
        s2.addDBSources("cash", "amount");

        t.tableLoad(panel, new TableFieldCallBack() {
            @Override
            public Object onBeforeInput(TableFieldGen field, int row_index, int col_index) {
                //System.out.println("row_index "+row_index+" col_index "+col_index);
                if (field.fieldColumn().equalsIgnoreCase("sum")) {
                    double cash = Double.parseDouble(field.dbSrcValue("cash").toString());
                    double amt = Double.parseDouble(field.dbSrcValue("amount").toString());
                    return cash + amt;
                }

                if (field.fieldColumn().equalsIgnoreCase("add")) {
                    double id = Double.parseDouble(field.dbSrcValue("id").toString());
                    double age = Double.parseDouble(field.dbSrcValue("age").toString());
                    return id + age;
                }
                return field.dbSrcValueAt(0);
            }
        },new TableFieldRenderer() {

            @Override
            public Component getFieldRendererComponent(JTable table, TableFieldGen field, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                //System.err.println("REMIND: Auto generated method body is not yet implemented");
                return new JLabel(value.toString());
            }
        },null,null, s1, s2);

        TableRowSorter tr = (TableRowSorter) table.getRowSorter();
        //tr.setRowFilter(RowFilter.regexFilter("^2"));

        //JScrollPane scrollPane1 = new JScrollPane();
        //scrollPane1.setViewportView(table);
        //box.add(scrollPane1);
        /*Container cnt = table.getParent().getParent().getParent();
         Component[] comps = cnt.getComponents();
         for(int i=0; i<comps.dbSrcCount; i++){
         if(comps[i].equals(table.getParent().getParent())){
         System.out.println("position is "+i);
         }
         }*/
        //System.out.println(table.getParent().getParent().getParent());
        frame.setVisible(true);

    }
}
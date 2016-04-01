/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.param.ActionSQL;
import com.chuks.report.processor.param.TableFieldUpdate;
import com.chuks.report.processor.param.TableDataInput;
import com.chuks.report.processor.handler.DeleteRowHandler;
import com.chuks.report.processor.handler.UpdateTableHandler;
import com.chuks.report.processor.handler.TableDataInputHandler;
import com.chuks.report.processor.*;
import com.chuks.report.processor.util.JDBCSettings;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.DefaultListSelectionModel;
import javax.swing.ListSelectionModel;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TestTableProc1 extends javax.swing.JFrame {

    private TableProcessor t;

    /**
     * Creates new form TestTableProc
     */
    public TestTableProc1() {
        initComponents();

        try {
            initProcessor();
        } catch (SQLException ex) {
            Logger.getLogger(TestTableProc1.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private void initProcessor() throws SQLException {
        JDBCSettings jdbcSettings = new JDBCSettings("jdbc:mysql://localhost:3306/autopolicedb", "autopolice", "autopolicepass", null);

        t = ProcessorFactory.getTableProcessor(jdbcSettings);

    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        cmdLoadOnTable1 = new javax.swing.JButton();
        jTabbedPane1 = new javax.swing.JTabbedPane();
        jScrollPane1 = new javax.swing.JScrollPane();
        jTable1 = new javax.swing.JTable();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        getContentPane().setLayout(new javax.swing.BoxLayout(getContentPane(), javax.swing.BoxLayout.PAGE_AXIS));

        cmdLoadOnTable1.setText("Load On Table 1");
        cmdLoadOnTable1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdLoadOnTable1ActionPerformed(evt);
            }
        });
        getContentPane().add(cmdLoadOnTable1);

        jTable1.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "Title 1", "Title 2", "Title 3", "Title 4"
            }
        ));
        jScrollPane1.setViewportView(jTable1);

        jTabbedPane1.addTab("tab1", jScrollPane1);

        getContentPane().add(jTabbedPane1);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void cmdLoadOnTable1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdLoadOnTable1ActionPerformed

            t.tableLoad(jTable1, new TableDataInputHandler() {

                @Override
                public void doInput(TableDataInput input) {

                    try {
                        Object[][] data = input.select()
                                .columns("ID", "CASH", "AMOUNT", "NAME", "AGE")
                                .from("test_table_1")
                                .where()
                                .lessOrEqual("AGE", "250")
                                .and()
                                .greaterOrEqual("AGE", "0")
                                .fetchArray();
                        input.setColumns("the ID", "the CASH", "the AMOUNT", "the NAME", "the AGE");
                        input.setData(data);
                        
                    } catch (SQLException ex) {
                        Logger.getLogger(TestTableProc1.class.getName()).log(Level.SEVERE, null, ex);
                    }

                }
            }, new UpdateTableHandler() {

                @Override
                public void doUpdate(ActionSQL a, TableFieldUpdate f) {
                    ITableField[] fd = f.getChanges();

                }

            }, new DeleteRowHandler() {

                @Override
                public void doDelete(ActionSQL a, RowSelection r) {
                    try {
                        for (int i = 0; i < r.count(); i++) {

                            a.deleteFrom("test_table_1")
                                    .where()
                                    .equal("AGE", r.getValueAt(i, "ADD"))
                                    .executeDelete();

                        }
                        a.close();
                    } catch (SQLException ex) {
                        Logger.getLogger(TestTableProc1.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            });

    }//GEN-LAST:event_cmdLoadOnTable1ActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                //Nimbus
                if ("Windows".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(TestTableProc1.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(TestTableProc1.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(TestTableProc1.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(TestTableProc1.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new TestTableProc1().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton cmdLoadOnTable1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTabbedPane jTabbedPane1;
    private javax.swing.JTable jTable1;
    // End of variables declaration//GEN-END:variables
}

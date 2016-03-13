/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

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
public class TestTableProc extends javax.swing.JFrame {
    private TableProcessor t;

    /**
     * Creates new form TestTableProc
     */
    public TestTableProc() {
        initComponents();

        try {
            initProcessor();
        } catch (SQLException ex) {
            Logger.getLogger(TestTableProc.class.getName()).log(Level.SEVERE, null, ex);
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
              try {
            
            t.select()
                    .columns("ID", "CASH", "AMOUNT", "NAME", "AGE")
                    .from("test_table_1")
                    .where()
                    .lessOrEqual("AGE", "250")
                    .and()
                    .greaterOrEqual("AGE", "0");

            TableFieldSource s1 = new TableFieldSource("ADD");
            s1.addDBSources("id", "age");
            TableFieldSource s2 = new TableFieldSource("SUM");
            s2.addDBSources("cash", "amount");

            try {
                /*System.out.println(this.getContentPane());
                 if(true){
                 getContentPane().remove(jTable1);
                 getContentPane().revalidate();
                 getContentPane().repaint();
                 JTable tb = new JTable();
                 tb.setSize(100, 300);
                 getContentPane().add(tb);
                 getContentPane().repaint();
                 return;
                 }*/
                t.tableLoad(jTable1, new TableFieldCallBack() {
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
                }, new UpdateTableHandler() {

                    @Override
                    public void doUpdate(ActionSQL a, TableFieldChange f) {
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
                            Logger.getLogger(TestTableProc.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }, s1, s2);

                t.close();
                ListSelectionModel l = new DefaultListSelectionModel() ;
                l.addListSelectionListener(new ListSelectionListener() {

                    @Override
                    public void valueChanged(ListSelectionEvent e) {
                        //JTable table = (JTable) e.getSource();
                        int selected_row = jTable1.getSelectedRow();
                        if(selected_row==-1)
                            return;
                        System.out.println(selected_row);
                        System.out.println("t v at "+jTable1.getValueAt(selected_row, 0));
                        int m_r=jTable1.convertRowIndexToModel(selected_row);
                        int m_c=jTable1.convertColumnIndexToModel(0);
                        System.out.println("m v at "+jTable1.getModel().getValueAt(m_r, m_c));
                    }
                });
                jTable1.setSelectionModel(l);
                
            } catch (SQLException ex) {
                Logger.getLogger(TestTableProc.class.getName()).log(Level.SEVERE, null, ex);
            }
        } catch (SQLException ex) {
            Logger.getLogger(TestTableProc.class.getName()).log(Level.SEVERE, null, ex);
        }
              
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
            java.util.logging.Logger.getLogger(TestTableProc.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(TestTableProc.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(TestTableProc.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(TestTableProc.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new TestTableProc().setVisible(true);
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

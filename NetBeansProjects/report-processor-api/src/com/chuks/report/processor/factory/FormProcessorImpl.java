/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.form.controls.JFind;
import com.chuks.report.processor.form.controls.JPrevious;
import com.chuks.report.processor.form.controls.FormControl;
import com.chuks.report.processor.form.controls.JMoveTo;
import com.chuks.report.processor.form.controls.JNext;
import com.chuks.report.processor.form.controls.JCounter;
import com.chuks.report.processor.form.controls.JControllerPane;
import java.sql.SQLException;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import com.chuks.report.processor.util.JDBCSettings;
import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.FormFieldMapper;
import com.chuks.report.processor.Form;
import com.chuks.report.processor.FormProcessor;


/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class FormProcessorImpl<T> extends AbstractUIDBProcessor implements FormProcessor {

    public FormProcessorImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public Form loadOnForm(FormFieldMapper mapper, FormControl... controls) throws SQLException {
        String[] columms = dbHelper.getColumns(true);
        //NOTE form controls cannot be repeated - throw exception if any
        System.err.println("REMIND: Auto generated method body is not yet implemented");      
        return new DefaultFormModel();
    }

    @Override
    public Form loadOnForm(FormFieldMapper mapper, JControllerPane controllers_pane) throws SQLException {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return new DefaultFormModel();
    }

    @Override
    public void showJNext(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJPrevious(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJMove(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJCounter(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJFind(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }


    @Override
    public void showJSave(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJReset(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    class DefaultFormModel implements Form{
        
        JComponent[] comps;
        Object[][] data;

        
        @Override
        public JPanel getJControllers() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JNext getJNext() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JPrevious getJPrevious() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JMoveTo getJMoveTo() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JCounter getJCounter() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JFind getJFind() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JFind getJSave() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JFind getJReset() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JComponent[] getAllFields() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JComponent[] getFields(String accessible_name) {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JComponent getField(int field_index) {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }
    }

}

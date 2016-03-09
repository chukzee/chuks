/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import java.sql.SQLException;
import java.sql.Savepoint;
import java.text.SimpleDateFormat;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFormattedTextField;
import javax.swing.JLabel;
import javax.swing.JPasswordField;
import javax.swing.JRadioButton;
import javax.swing.JSpinner;
import javax.swing.JTextField;
import com.chuks.report.processor.entry.FieldType;
import com.chuks.report.processor.sql.helper.DBDeletor;
import com.chuks.report.processor.sql.helper.DBHelper;
import com.chuks.report.processor.sql.helper.DBInsertor;
import com.chuks.report.processor.sql.helper.DBSelector;
import com.chuks.report.processor.sql.helper.DBUpdater;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public abstract class AbstractUIDBProcessor<T> extends Validator implements UIDBProcessor{


    public DBHelper dbHelper;
    public JDBCSettings jdbcSettings;
    public boolean isAutoCommit = true;
    
    public AbstractUIDBProcessor(JDBCSettings jdbcSettings){
        this.jdbcSettings = jdbcSettings;
        dbHelper = new DBHelper(this);
    }
    
    @Override
    public void setDBSettings(JDBCSettings jdbcSettings) {
        this.jdbcSettings = jdbcSettings;
    }

    @Override
    public JDBCSettings getDBSettings() {
        return jdbcSettings;
    }

    @Override
    public void transactionBegins() throws SQLException{ 
        isAutoCommit = false;
        dbHelper.setAutoCommit(isAutoCommit);
    }

    @Override
    public void transactionEnds() throws SQLException{ 
        isAutoCommit = true;
        commit();//commit changes
        dbHelper.setAutoCommit(isAutoCommit);
        dbHelper.removeTransantionConnections();
    }

    @Override
    public void commit() throws SQLException{
        dbHelper.commit();
    }

    @Override
    public void rollback() throws SQLException{
        dbHelper.rollback();
    }

    @Override
    public void close() throws SQLException{
        dbHelper.close();
    }

    @Override
    public void rollback(Savepoint save_point) throws SQLException{
        dbHelper.rollback(save_point);
    }

    @Override
    public Savepoint setSavepoint() throws SQLException{
        return dbHelper.setSavepoint();
    }

    @Override
    public Savepoint setSavepoint(String name) throws SQLException{
        return dbHelper.setSavepoint(name);
    }

    @Override
    public DBDeletor deleteFrom(String table) throws SQLException {
        return dbHelper.DBDeletor().from(table);
    }

    @Override
    public DBSelector selectFrom(String table) throws SQLException {
        return dbHelper.DBSelector().from(table);
    }

    @Override
    public DBSelector selectDistictFrom(String table) throws SQLException {
        return dbHelper.DBSelectorDistinct().from(table);
    }

    @Override
    public DBUpdater update(String table) throws SQLException {
        return dbHelper.DBUpdater().table(table);
    }

    @Override
    public DBInsertor insert() {
        return dbHelper.DBInsertor();
    }

    @Override
    public DBUpdater update() {
        return dbHelper.DBUpdater();
    }

    @Override
    public DBSelector select() {
        return dbHelper.DBSelector();
    }

    @Override
    public DBSelector selectDistinct() {
        return dbHelper.DBSelectorDistinct();
    }

    @Override
    public DBDeletor delete() {
        return dbHelper.DBDeletor();
    }

    @Override
    public T getValue(JComponent comp, FieldType type) {

        if (comp instanceof JTextField) {
            return convertTo(((JTextField) comp).getText(), type);
        } else if (comp instanceof JFormattedTextField) {
            return convertTo(((JFormattedTextField) comp).getText(), type);
        } else if (comp instanceof JPasswordField) {
            return convertTo(String.valueOf(((JPasswordField) comp).getPassword()), type);
        } else if (comp instanceof JComboBox) {
            return convertTo(((JComboBox) comp).getSelectedItem().toString(), type);
        } else if (comp instanceof JLabel) {
            return convertTo(((JLabel) comp).getText(), type);
        } else if (comp instanceof JRadioButton) {
            return convertTo(Boolean.valueOf(((JRadioButton) comp).isSelected()).toString(), type);//ok
        } else if (comp instanceof JCheckBox) {
            return convertTo(Boolean.valueOf(((JCheckBox) comp).isSelected()).toString(), type);//ok
        } else if (comp instanceof JSpinner) {
            return convertTo(((JSpinner) comp).getValue().toString(), type);
        } else {
            throw new UnsupportedOperationException("Form component type not supported - " + comp.getName());

        }
    }

    private T convertTo(String str, FieldType type) {

        switch (type) {
            case BOOLEAN: {
                try {
                    return (T) Boolean.valueOf(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values "+str+" is not of type " + type);
                }
            }
            case DATE_yyyy_MM_dd: {
                String format = "yyyy-MM-dd";
                try {
                    return (T) new SimpleDateFormat(format).parse(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values "+str+" is not of date type with format " + format);
                }
            }
            case DATE_yyyy_MM_dd_HH_mm_ss: {
                String format = "yyyy-MM-dd HH:mm:ss";
                try {
                    return (T) new SimpleDateFormat(format).parse(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values "+str+" is not of date type with format " + format);
                }
            }
            case DOUBLE: {
                try {
                    return (T) Double.valueOf(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values "+str+" is not of type " + type);
                }
            }
            case FLOAT: {
                try {
                    return (T) Float.valueOf(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values "+str+" is not of type " + type);
                }
            }
            case INTEGER: {
                try {
                    return (T) Integer.valueOf(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values "+str+" is not of type " + type);
                }
            }
            case STRING: {
                try {
                    return (T) str;
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values "+str+" is not of type " + type);
                }
            }

            default:
                throw new UnsupportedOperationException("type not supported : " + type);

        }

    }

}

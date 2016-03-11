/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import java.sql.SQLException;
import javax.swing.JComponent;
import com.chuks.report.processor.factory.TableFieldSource;
import javax.swing.JPanel;
import javax.swing.JTable;
import com.chuks.report.processor.factory.TableFieldRenderer;

/**
 *
 * @author USER
 */
public interface TableProcessor extends UIDBProcessor {

    void columnsAsIs(boolean is_column_as_is);

    boolean isColumnAsIs();

    void displayToolbox(boolean isShow);
    
    void displayFind(boolean isShow);

    void displayFilter(boolean isShow);
    
    void tableLoad(JTable table, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler) throws SQLException;

    void tableLoad(JTable table, Object[][] data, String... columns) throws SQLException;
    
    /**
     *
     * @param table
     * @param dataInputHandler
     * @param updateFieldHandler
     * @param deleteRowsHandler
     * @throws java.sql.SQLException
     */
    void tableLoad(JTable table, TableDataInputHandler dataInputHandler, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler) throws SQLException ;
    
    /**
     *
     * @param container
     * @param dataInputHandler
     * @param updateFieldHandler
     * @param deleteRowsHandler
     * @throws java.sql.SQLException
     */
    void tableLoad(JComponent container, TableDataInputHandler dataInputHandler, TableFieldRenderer renderer, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler) throws SQLException ;
    
    /**
     *
     * @param table
     * @param inputCallBack
     * @param updateFieldHandler
     * @param deleteRowsHandler
     * @param columnSources
     * @throws java.sql.SQLException
     */
    void tableLoad(JTable table, TableFieldCallBack inputCallBack, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler, TableFieldSource... columnSources) throws SQLException ;
    
    /**
     *
     * @param table
     * @param inputCallBack
     * @param updateFieldHandler
     * @param deleteRowsHandler
     * @param mapper
     * @throws java.sql.SQLException
     */
    void tableLoad(JTable table, TableFieldCallBack inputCallBack, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler, TableFieldMapper mapper) throws SQLException ;
    
    /**
     *
     * @param container
     * @param inputCallBack
     * @param renderer
     * @param updateFieldHandler
     * @param columnSources
     * @param deleteRowsHandler
     * @return 
     * @throws java.sql.SQLException
     */
    JTable tableLoad(JComponent container, TableFieldCallBack inputCallBack, TableFieldRenderer renderer, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler, TableFieldSource... columnSources) throws SQLException ;
    
    /**
     *
     * @param container
     * @param inputCallBack
     * @param renderer
     * @param updateFieldHandler
     * @param deleteRowHandler
     * @param mapper
     * @return 
     * @throws java.sql.SQLException
     */
    JTable tableLoad(JComponent container, TableFieldCallBack inputCallBack, TableFieldRenderer renderer, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler, TableFieldMapper mapper) throws SQLException ;
}

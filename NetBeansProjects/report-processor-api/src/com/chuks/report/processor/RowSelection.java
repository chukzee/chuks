/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface RowSelection {

    /**
     * Gets the two dimensional array of objects representing the rows selected.
     *
     * @return the data representing rows selected.
     */
    Object[][] getData();
    
    /**
     * Get a two dimensional array of the {@link  com.chuks.report.processor.ITableField} object representing 
     * the fields on the row(s) selected
     * @return the fields on the rows selected
     */
    ITableField[][] getFields();
    
    /**
     * Get an array of the {@link  com.chuks.report.processor.Row} object representing the row(s) selected
     * @return the rows selected
     */
    Row[] getRows();

    /**
     * Gets the value at the specified index of selection returned by
     * {@code getData()} method given the specified column name. Note that the
     * index of selection is not the same as the row index of selection of the
     * table but of the two dimensional array return by {@code getData()}
     * method.
     *
     * @param selection_index index of selection of data returned by
     * {@code getData()} method
     * @param columnName name of the column where the value is stored.
     * @return the value
     */
    Object getValueAt(int selection_index, String columnName);

    /**
     * Gets the numbers of rows selected
     *
     * @return
     */
    int count();

}

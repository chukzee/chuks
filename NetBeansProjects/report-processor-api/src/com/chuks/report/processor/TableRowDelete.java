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
public interface TableRowDelete extends Feedback {

    /**
     * Gets the two dimensional array of objects representing the rows selected.
     *
     * @return the data representing rows selected.
     */
    Object[][] getData();

    /**
     * Get a two dimensional array of the
     * {@link  com.chuks.report.processor.ITableField} object representing the
     * fields on the row(s) selected
     *
     * @return the fields on the rows selected
     */
    ITableField[][] getFields();

    /**
     * Get an array of the {@link  com.chuks.report.processor.Row} object
     * representing the row(s) selected
     *
     * @return the rows selected
     */
    Row[] getRows();

    /**
     * Gets the value at the specified index of selection returned by
     * {@code getData()} method given the specified column name. Note that the
     * index of selection may not neccessarily be the same as the row index of
     * selection of the table (especially if the table is sorted) but of the
     * two dimensional array returned by {@code getData()} method.
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

    /**
     * Call this method to cause the record to be refreshed after the
     * {@link com.chuks.report.processor.handler.DeleteRowHandler} is executed.
     * The default implementation always refresh the records after the handler
     * is executed. Setting this method to false may be useful in cases where an
     * error occured and the client does not which to refresh the record as it is
     * meaningless.
     *
     * @param is_refresh set to true to allow refresh otherwise false.
     */
    void refresh(boolean is_refresh);

    /**
     * Call this method to check whether records will be refreshed after the
     * {@link com.chuks.report.processor.handler.DeleteRowHandler} is executed.
     * The records are refresh by default.
     */
    boolean isRefreshAllowed();
}

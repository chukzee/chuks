/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.*;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TableDataInputImpl extends ActionSQLImpl implements TableDataInput{
    private float pollingInterval;
    private boolean pollingEnabled;
    private String[] columnNames;
    private Object[][] data;

    public TableDataInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void setPollingEnabled(boolean isPoll) {
         pollingEnabled = isPoll;
    }

    @Override
    public boolean isPollingEnabled() {
        return pollingEnabled;
    }

    @Override
    public void setPollingInterval(float seconds) {
        pollingInterval = seconds;
    }

    @Override
    public float getPollingInterval() {
        return pollingInterval;
    }

    @Override
    public void setColumns(String... column_names) {
      this.columnNames = column_names;
    }

    @Override
    public void setData(Object[][] data) {
        this.data = data;
    }

    public String[] getColumnNames() {
        return columnNames;
    }

    public Object[][] getData() {
        return data;
    }
    
}

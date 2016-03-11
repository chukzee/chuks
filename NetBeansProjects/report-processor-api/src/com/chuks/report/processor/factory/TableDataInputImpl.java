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
 class TableDataInputImpl extends AbstractDataInput implements TableDataInput{

    private String[] columnNames;

    public TableDataInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }
    
    @Override
    public void setColumns(String... column_names) {
      this.columnNames = column_names;
    }

    String[] getColumns() {
        return columnNames;
    }
    
    @Override
    public void setData(Object[][] data) {
        this.data = data;
    }

    Object[][] getData() {
        return (Object[][]) data;
    }
    

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.ITableField;
import com.chuks.report.processor.Row;
import java.util.Set;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class TableFieldImpl implements ITableField {

    private final String name;
    private String[] sources = new String[0];//do not declare as final - important!
    private Row row;
    private final Object old_value;
    private final Object value;
    private final int row_index;
    private final int col_index;

    TableFieldImpl(String name, Object old_value, Object value, int row_index, int col_index) {
        this.name = name;
        this.old_value = old_value;
        this.value = value;
        this.row_index = row_index;
        this.col_index = col_index;
    }

    void setRow(Row row) {
        this.row = row;
    }

    void setSource(Set srcSet) {
        if (srcSet == null) {
            return;
        }
        if (sources.length < srcSet.size()) {
            sources = new String[srcSet.size()];
        }
        srcSet.toArray(sources);
    }

    @Override
    public Object getValue() {
        return value;
    }

    @Override
    public Object getOldValue() {
        return old_value;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String[] sources() {
        return sources;
    }

    @Override
    public Row getRow() {
        return row;
    }

    @Override
    public int rowIndex() {
        return row_index;
    }

    @Override
    public int columIndex() {
        return col_index;
    }

}

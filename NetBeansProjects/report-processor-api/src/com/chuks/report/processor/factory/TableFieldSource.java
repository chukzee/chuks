/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import com.chuks.report.processor.TableFieldGen;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final public class TableFieldSource implements TableFieldGen {

    private String columnName;
    private Set<String> columnSources = new LinkedHashSet();//LinkedHashSet set implementation maintains insertion order (which is what we want) unlike HashSet implementation  which is choatic
    private Object[] values = {};
    private AtomicBoolean flagChange = new AtomicBoolean(true);
    private Object[] backing_coln;

    TableFieldSource() {
    }

    public TableFieldSource(String columnName) {
        this.columnName = columnName;
    }

    public void addSources(String... columnNames) {
        for (int i = 0; i < columnNames.length; i++) {
            columnSources.add(columnNames[i].toUpperCase());//ensure unique entry by converting column name to uppercase
            flagChange.getAndSet(true);
        }
    }

    @Override
    public String fieldColumn() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    Set<String> getColumnSources() {
        return columnSources;
    }

    /**
     * @deprecated Do not use this method. It is cumbersome to ensure unique
     * entry since column names of difference letter case are by SQL standard
     * regarded as the same.
     *
     * @param columnSources
     */
    void setColumnSources(Set columnSources) {
        this.columnSources = columnSources;
        flagChange.getAndSet(true);
    }

    @Override
    public Object srcValueAt(int index) {
        return values[index];
    }

    @Override
    public Object srcValue(String columnName) {
        for (int i = 0; i < values.length; i++) {
            if (columnName.equalsIgnoreCase(getColumnAt(i))) {
                return values[i];
            }
        }
        return null;
    }

    @Override
    public String getColumnAt(int index) {
        if (flagChange.get()) {
            backing_coln = columnSources.toArray();
            flagChange.getAndSet(false);
        }
        return (String) backing_coln[index];
    }

    @Override
    public int length() {
        return values.length;
    }

    void setValueAt(int k, Object data) {
        if (values.length == 0) {
            this.values = new Object[columnSources.size()];
        }
        this.values[k] = data;
    }

    void copy(TableFieldSource columnSource) {
        columnName = columnSource.columnName;
        for (String obj : columnSource.getColumnSources()) {
            columnSources.add(obj);
        }
        this.values = new Object[columnSources.size()];
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.SourceMath;
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

    public void addDBSources(String... columnNames) {
        for (int i = 0; i < columnNames.length; i++) {
            columnSources.add(columnNames[i].toUpperCase());//ensure unique entry by converting column name to uppercase
            flagChange.getAndSet(true);
        }
    }

    @Override
    public String fieldColumn() {
        return columnName;
    }

    public void setDBSrcColumn(String columnName) {
        this.columnName = columnName;
    }

    Set<String> getDBSrcColumns() {
        return columnSources;
    }

    /**
     * @deprecated Do not use this method. It is cumbersome to ensure unique
     * entry since column names of difference letter case are by SQL standard
     * regarded as the same.
     *
     * @param columnSources
     */
    void setDBSrcColumns(Set columnSources) {
        this.columnSources = columnSources;
        flagChange.getAndSet(true);
    }

    @Override
    public Object dbSrcValueAt(int index) {
        return values[index];
    }
    
    /**
     * This method returns the value of the specified database column this field
     * is mapped to.
     * 
     *<br/>
     * This method must throw {@link IllegalArgumentException} if the 
     * specified database column name was not found. It is not proper 
     * to return null if not found because that could imply that the
     * column exist and the value is null which in fact is a gross
     * misleading assumption. The correct approach is to
     * throw {@link IllegalArgumentException} if not found. Client
     * is supposed to ensure the correct column name is passed as argument.
     * 
     * @param dbColumnName name of the database column 
     * @return the value of the database column
     */
    @Override
    public Object dbSrcValue(String dbColumnName) {
        for (int i = 0; i < values.length; i++) {
            if (dbColumnName.equalsIgnoreCase(getDBSrcColumnAt(i))) {
                return values[i];
            }
        }
        throw new IllegalArgumentException("Unknown databse column source! '" + dbColumnName + "' was not mapped to this field.");

    }

    @Override
    public String getDBSrcColumnAt(int index) {
        if (flagChange.get()) {
            backing_coln = columnSources.toArray();
            flagChange.getAndSet(false);
        }
        return (String) backing_coln[index];
    }

    @Override
    public int dbSrcCount() {
        return values.length;
    }

    void setDBSrcValueAt(int k, Object data) {
        if (values.length == 0) {
            this.values = new Object[columnSources.size()];
        }
        this.values[k] = data;
    }

    void copy(TableFieldSource columnSource) {
        columnName = columnSource.columnName;
        for (String obj : columnSource.getDBSrcColumns()) {
            columnSources.add(obj);
        }
        this.values = new Object[columnSources.size()];
    }

    @Override
    public SourceMath math() {
        return new SourceMathImpl(this);
    }

}

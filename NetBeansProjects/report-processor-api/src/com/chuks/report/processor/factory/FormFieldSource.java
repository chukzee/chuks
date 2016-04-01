/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.param.FormFieldGen;
import com.chuks.report.processor.SourceMath;
import javax.swing.JComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final class FormFieldSource implements FormFieldGen {

    private final JComponent comp;
    private final String[] sources;//names of database columns this field is derived from
    private Object[] values = {};

    FormFieldSource(JComponent comp, String[] sources) {
        this.comp = comp;
        this.sources = sources;
    }

    @Override
    public JComponent getComponent() {
        return comp;
    }

    @Override
    public String getAccessibleName() {
        return comp.getAccessibleContext().getAccessibleName();
    }

    String[] getDBSrcColumns() {
        return sources;
    }

    @Override
    public Object dbSrcValueAt(int index) {
        return values[index];
    }

    /**
     * This method returns the value of the specified database column this field
     * is mapped to.
     *
     * <br/>
     * This method must throw {@link IllegalArgumentException} if the specified
     * database column name was not found. It is not proper to return null if
     * not found because that could imply that the column exist and the value is
     * null which in fact is a gross misleading assumption. The correct approach
     * is to throw {@link IllegalArgumentException} if not found. Client is
     * supposed to ensure the correct column name is passed as argument.
     *
     * @param dbColumnName name of the database column
     * @return the value of the database column
     */
    @Override
    public Object dbSrcValue(String dbColumnName) {
        for (int i = 0; i < values.length; i++) {
            if (dbColumnName.equalsIgnoreCase(sources[i])) {
                return values[i];
            }
        }

        throw new IllegalArgumentException("Unknown databse column source! '" + dbColumnName + "' was not mapped to this " + comp.getName() + " field" + (getAccessibleName() == null ? " - No accessible name! Specify accessible name to help detect the affected field." : " with accessible name " + getAccessibleName()));

    }

    @Override
    public int dbSrcCount() {
        return values.length;
    }

    void setDBSrcValueAt(int k, Object data) {
        if (values.length == 0) {
            this.values = new Object[sources.length];
        }
        this.values[k] = data;
    }

    @Override
    public String getDBSrcColumnAt(int index) {
        if (index < 0) {
            return null;
        }
        return sources[index];
    }

    @Override
    public SourceMath math() {
        return new SourceMathImpl(this);
    }
}

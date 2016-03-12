/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.FormFieldGen;
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

    @Override
    public Object dbSrcValue(String dbColumnName) {
        for (int i = 0; i < values.length; i++) {
            if (dbColumnName.equalsIgnoreCase(sources[i])) {
                return values[i];
            }
        }
        return null;
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

}

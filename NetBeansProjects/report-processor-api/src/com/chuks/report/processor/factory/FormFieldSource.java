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
    private final String[] sources;
    Object[] values = {};

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

    @Override
    public Object srcValueAt(int index) {
        return values[index];
    }

    @Override
    public Object srcValue(String columnName) {
        for (int i = 0; i < values.length; i++) {
            if (columnName.equalsIgnoreCase(sources[i])) {
                return values[i];
            }
        }
        return null;
    }

    @Override
    public int srcCount() {
        return values.length;
    }

    void setValueAt(int k, Object data) {
        if (values.length == 0) {
            this.values = new Object[sources.length];
        }
        this.values[k] = data;
    }

}

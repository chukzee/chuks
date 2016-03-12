/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.IFormField;
import com.chuks.report.processor.Source;
import java.util.Set;
import javax.swing.JComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class FormFieldImpl implements IFormField {

    private final String accessible_name;
    private final Object old_value;
    private final Object value;
    private final JComponent comp;
    private String[] sources = new String[0];

    FormFieldImpl(String accessible_name, JComponent comp, Object old_value, Object value) {
        this.accessible_name = accessible_name;
        this.old_value = old_value;
        this.value = value;
        this.comp = comp;
    }

    void setSources(String[] srcs) {
        if (srcs == null) {
            return;
        }
        this.sources = srcs;
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
    public String getAccessibleName() {
        return accessible_name;
    }

    @Override
    public JComponent getComponent() {
        return comp;
    }

    @Override
    public String[] sources() {
        return sources;
    }

    @Override
    public boolean isUpdated() {
        if (value == null && old_value == null) {
            return false;
        }
        if (value != null) {
            if (value.equals(old_value)) {
                return false;
            }
        }
        if (old_value != null) {
            if (old_value.equals(value)) {
                return false;
            }
        }

        return true;
    }
}

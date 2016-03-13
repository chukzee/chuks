/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import javax.swing.JComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class FormFieldMapper {

    Map<JComponent, String[]> formFieldMap;//use LinkedHashMap for maintaining insert order - very important

    public FormFieldMapper map(JComponent comp, String... db_columns) {
        if (formFieldMap == null) {
            formFieldMap = new LinkedHashMap();//use LinkedHashMap for maintaining insert order - very important
        }
        formFieldMap.put(comp, db_columns);
        return this;
    }

    public String[] getSources(int field_index) {
        if (formFieldMap == null || formFieldMap.size() < 1 || field_index >= formFieldMap.size()) {
            return new String[0];
        }
        
        Object[] comps = formFieldMap.keySet().toArray();
        
        return formFieldMap.get((JComponent)comps[field_index]);
    }
    
    public JComponent[] getFields(){
        Set<JComponent> keySet = formFieldMap.keySet();
        JComponent[] fields = new JComponent[keySet.size()];
        keySet.toArray(fields);
        return fields;
    }
    
    public int count(){
        return formFieldMap.size();
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import com.chuks.report.processor.factory.TableFieldSource;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TableFieldMapper {

    Map<String, String[]> tableFieldMap;

    public TableFieldMapper map(String fieldColumName, String... db_columns) {
        if (tableFieldMap == null) {
            tableFieldMap = new LinkedHashMap();
        }
        tableFieldMap.put(fieldColumName, db_columns);
        return this;
    }
    
    public TableFieldSource[] getFieldSources(){
        Set<Map.Entry<String, String[]>> e = tableFieldMap.entrySet();
        Iterator<Map.Entry<String, String[]>> ei = e.iterator();
        TableFieldSource[] sources = new TableFieldSource[e.size()];
        int i = -1;
        while(ei.hasNext()){
            Map.Entry<String, String[]> entry = ei.next();
            i++;
            sources[i] = new TableFieldSource(entry.getKey());
            sources[i].addDBSources(entry.getValue());
        }
        
       return sources; 
    }
}

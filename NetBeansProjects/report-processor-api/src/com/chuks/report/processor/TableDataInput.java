/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface TableDataInput extends  ActionSQL,  PollAttributes{


    void setColumns(String... column_names);

    void setData(Object[][] data);
    
    void setJDBCSettings(JDBCSettings settings);

}

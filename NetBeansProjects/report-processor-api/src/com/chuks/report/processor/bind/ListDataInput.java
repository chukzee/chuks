/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.bind;

import com.chuks.report.processor.ActionSQL;
import com.chuks.report.processor.PollAttributes;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ListDataInput extends ActionSQL, PollAttributes{
    
    void setData(Object[] data);
    
    void setJDBCSettings(JDBCSettings settings);

}

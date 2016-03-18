/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.param;

import com.chuks.report.processor.PollAttributes;
import com.chuks.report.processor.util.JDBCSettings;
import javax.swing.JComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface FormDataInput  extends ActionSQL, PollAttributes{
    
    void setFieldComponents(JComponent... field_components);

    void setData(Object[][] data);
    
    void setJDBCSettings(JDBCSettings settings);
}

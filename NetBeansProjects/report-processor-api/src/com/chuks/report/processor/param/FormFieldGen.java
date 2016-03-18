/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.param;

import com.chuks.report.processor.Source;
import javax.swing.JComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface FormFieldGen extends Source{
 
    JComponent getComponent();
    
    String getAccessibleName();
       
}

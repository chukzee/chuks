/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import javax.swing.JComponent;

/**
 *
 * @author USER
 */
public interface ValidationHandler { 
    boolean isValid(JComponent comp, String accessible_name, String field_value);
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import java.awt.Component;
import javax.swing.JTable;
import com.chuks.report.processor.param.TableFieldGen;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface TableFieldRenderer {
    Component getFieldRendererComponent(JTable table, TableFieldGen field, Object value, boolean isSelected, boolean hasFocus, int row, int column);
}

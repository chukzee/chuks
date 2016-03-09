/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.form.controls.JFind;
import com.chuks.report.processor.form.controls.JPrevious;
import com.chuks.report.processor.form.controls.JMoveTo;
import com.chuks.report.processor.form.controls.JNext;
import com.chuks.report.processor.form.controls.JCounter;
import javax.swing.JComponent;
import javax.swing.JPanel;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface Form {

    JComponent[] getAllFields();

    JComponent[] getFields(String accessible_name);

    JComponent getField(int field_index);

    JPanel getJControllers();

    JNext getJNext();

    JPrevious getJPrevious();

    JMoveTo getJMoveTo();

    JCounter getJCounter();

    JFind getJFind();

    JFind getJSave();

    JFind getJReset();

}

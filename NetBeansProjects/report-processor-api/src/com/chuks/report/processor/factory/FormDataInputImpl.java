/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.FormDataInput;
import com.chuks.report.processor.sql.helper.DBHelper;
import com.chuks.report.processor.util.JDBCSettings;
import javax.swing.JComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class FormDataInputImpl  extends AbstractDataInput implements FormDataInput{
    private JComponent[] fieldComponents;

    public FormDataInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }
    
    @Override
    public void setJDBCSettings(JDBCSettings settings){
        this.jdbcSettings = settings;
        this.dbHelper = new DBHelper(this);
    }

    JComponent[] getFieldComponents() {
        return fieldComponents;
    }

    @Override
    public void setFieldComponents(JComponent... field_components) {
        this.fieldComponents = field_components;
    }

    Object[][] getData() {
        return (Object[][]) data;
    }

    @Override
    public void setData(Object[][] data) {
        this.data = data;
    }
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.ITableField;
import com.chuks.report.processor.Row;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class RowImpl implements Row {

    private ITableField[] fields;

    public void setFields(ITableField[] fields) {
        this.fields = fields;
    }

    @Override
    public ITableField[] rowFields() {
        return fields;
    }

    @Override
    public int fieldCount() {
        return fields.length;
    }

}

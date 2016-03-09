/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ITableField {
    /**
     * Gets the current value of the field after the last update operation. If 
     * there has been no update operation, then it just returns the current value.
     * 
     * @return 
     */
    Object getValue();
    /**
     * Gets the value of the field before the last update operation.
     * @return 
     */
    Object getOldValue();
    /**
     * Name of the column of the field
     * @return 
     */
    String getName();
    Source[] sources();
    Row getRow();
    int rowIndex();
    int columIndex();
}

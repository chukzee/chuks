/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.param;

import com.chuks.report.processor.param.ActionSQL;
import com.chuks.report.processor.PullAttributes;
import com.chuks.report.processor.util.JDBCSettings;
import java.util.List;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ListDataInput extends ActionSQL, PullAttributes {

    /**
     * Set a list of data
     *
     * @param data
     */
    void setData(List data);

    /**
     * Set an object that must be an array or a list of data. The array
     * can be either one or two dimensional. It two dimensional array is passed
     * then only the first colum values of the array is extracted.
     *
     * This method throws an {@link IllegalArgumentException} if the data passed
     * to it is not an array of one or two dimension or a type List.
     *
     * @param data
     */
    void setData(Object data);

    void setJDBCSettings(JDBCSettings settings);
}

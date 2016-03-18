/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.param;

import com.chuks.report.processor.Feedback;
import com.chuks.report.processor.ITableField;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface TableFieldUpdate extends Feedback{
    
    ITableField [] getChanges();
    int count();
        
    /**
     * Call this method to cause the record to be refreshed after the
     * {@link com.chuks.report.processor.handler.UpdateTableHandler} is executed.
     * The default implementation always refresh the records after the
     * handler is executed. Setting this method to false may be
     * useful in cases where an errors and the client does not which
     * to refresh the record as it is meaningless
     * @param is_refresh set to true to allow refresh otherwise false.
     */
    void refresh(boolean is_refresh);
    
        
    /**
     * Call this method to check whether records will be refreshed 
     * after the {@link com.chuks.report.processor.handler.UpdateTableHandler} is
     * executed. The records are refresh by default.
     */
    boolean isRefreshAllowed();
}

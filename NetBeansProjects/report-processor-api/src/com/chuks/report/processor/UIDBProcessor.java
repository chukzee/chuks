/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.param.ActionSQL;
import javax.swing.JComponent;
import com.chuks.report.processor.entry.FieldType;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author USER
 * @param <T>
 */
public interface UIDBProcessor<T> extends ActionSQL{

    void setDBSettings(JDBCSettings jdbcSettings);

    JDBCSettings getDBSettings();

    T getValue(JComponent comp, FieldType type);
    
    /**
     * Determines whether data polling should be activated. that is change
     * made to the data base will be reflected. if activated, a default 
     * polling interval based on the implementation is used.
     * @param isPull 
     */
    void setDataPollingEnabled(boolean isPull);
    
    /**
     * Used to check whether data polling is activated. 
     * @return true if activated otherwise false
     */
    boolean getDataPollingEnabled();

    /**
     * Set the data polling interval.
     * @param seconds 
     */
    void setDataPollingInterval(float seconds);
    /**
     * Gets the data polling interval
     * @return 
     */
    float getDataPollInterval();
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.PollAttributes;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class AbstractDataInput extends ActionSQLImpl implements PollAttributes{
    
    private boolean pollingEnabled;
    private float pollingInterval;
    protected Object data;

    public AbstractDataInput(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    
    
    public void setData(Object data) {
        this.data = data;
    }
    
    @Override
    public void setPollingEnabled(boolean isPoll) {
        this.pollingEnabled = isPoll;
    }

    @Override
    public boolean isPollingEnabled() {
        return pollingEnabled;
    }

    @Override
    public void setPollingInterval(float seconds) {
        this.pollingInterval = seconds;
    }

    @Override
    public float getPollingInterval() {
        return pollingInterval;
    }
}

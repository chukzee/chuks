/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.PullAttributes;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class AbstractDataInput extends ActionSQLImpl implements PullAttributes{
    
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
    public void setPullingEnabled(boolean isPull) {
        this.pollingEnabled = isPull;
    }

    @Override
    public boolean isPullingEnabled() {
        return pollingEnabled;
    }

    @Override
    public void setPullingInterval(float seconds) {
        this.pollingInterval = seconds;
    }

    @Override
    public float getPullingInterval() {
        return pollingInterval;
    }
}

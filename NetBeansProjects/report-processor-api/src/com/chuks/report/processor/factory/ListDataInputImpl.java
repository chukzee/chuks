/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.bind.ListDataInput;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */

class ListDataInputImpl extends ActionSQLImpl implements ListDataInput{

    ListDataInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void setPollingEnabled(boolean isPoll) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public boolean isPollingEnabled() {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return false;
    }

    @Override
    public void setPollingInterval(float seconds) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public float getPollingInterval() {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return 0;
    }
    
}

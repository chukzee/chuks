/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.*;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class StackedAreaChartSettingsImpl extends AbstractXYChartSettingsImpl implements StackedAreaChartSettings{

    private boolean create_symbols;

    @Override
    public void setCreateSymbols(boolean value) {
        create_symbols = value;
    }

    @Override
    public boolean getCreateSymbols() {
        return create_symbols;
    }
        
}

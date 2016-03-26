/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.BarChartSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class BarChartSettingsImpl  extends AbstractXYChartSettingsImpl implements BarChartSettings{
    private int bar_gap;
    private int category_gap;

    @Override
    public void setBarGap(int gap) {
        this.bar_gap = gap;
    }

    @Override
    public int getBarGap() {
        return bar_gap;
    }

    @Override
    public void setCategoryGap(int gap) {
        category_gap = gap;
    }

    @Override
    public int getCategoryGap() {
        return category_gap;
    }

    
}

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
    private double bar_gap = 4;
    private double category_gap = 10;

    @Override
    public void setBarGap(double gap) {
        this.bar_gap = gap;
    }

    @Override
    public double getBarGap() {
        return bar_gap;
    }

    @Override
    public void setCategoryGap(double gap) {
        category_gap = gap;
    }

    @Override
    public double getCategoryGap() {
        return category_gap;
    }

    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.LineChartSettings;
import javafx.scene.chart.LineChart.SortingPolicy;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class LineChartSettingsImpl  extends AbstractXYChartSettingsImpl implements LineChartSettings{
    private SortingPolicy axis_sorting_policy = SortingPolicy.X_AXIS;
    private boolean create_symbols = true;

    @Override
    public void setAxisSortingPolicy(SortingPolicy value) {
        axis_sorting_policy = value;
    }

    @Override
    public SortingPolicy getAxisSortingPolicy() {
        return axis_sorting_policy;
    }

    @Override
    public void setCreateSymbols(boolean value) {
        create_symbols=value;
    }

    @Override
    public boolean getCreateSymbols() {
        return create_symbols;
    }
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.*;
import com.chuks.report.processor.handler.*;
import com.chuks.report.processor.param.*;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;
import javafx.scene.chart.StackedAreaChart;
import javafx.scene.chart.XYChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class StackedAreaChartInputImpl extends AbstractXYChartInputImpl implements StackedAreaChartInput {

    private StackedAreaChart chart;

    public StackedAreaChartInputImpl(JDBCSettings jdbcSettings, StackedAreaChartSettings settings) {
        super(jdbcSettings, settings);
    }

    @Override
    protected XYChart getChart() {
        
        if (chart == null) {
            chart = new StackedAreaChart(xAxis, yAxis);
        }
        return chart;
    }

    @Override
    protected void setChatProperties() {
        super.setChatProperties(); 
        
        //TODO set other below
    }

    void setHandler(JFXPanel jfxPanel, StackedAreaChartInputHandler handler) {
        this.jfxPanel = jfxPanel;
        this.handler = handler;
    }

    @Override
    public void plot(double x, double y) {
        plotImpl(x, y);
    }

    @Override
    public void plot(String x, double y) {
        plotImpl(x, y);
    }

    @Override
    public void plot(double x, String y) {
        plotImpl(x, y);
    }

    @Override
    public void plot(String x, String y) {
        plotImpl(x, y);
    }

    @Override
    public void plotNewSeries(String seriesName) {
        plotNewSeriesImpl(seriesName);
    }

}

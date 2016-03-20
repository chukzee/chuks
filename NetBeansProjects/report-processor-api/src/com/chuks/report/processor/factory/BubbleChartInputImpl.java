/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.BubbleChartSettings;
import com.chuks.report.processor.handler.BubbleChartInputHandler;
import com.chuks.report.processor.param.BubbleChartInput;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Parent;
import javafx.scene.chart.BubbleChart;
import javafx.scene.chart.Chart;
import javafx.scene.chart.XYChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class BubbleChartInputImpl extends AbstractXYChartInputImpl implements BubbleChartInput {
    private BubbleChart chart;

    public BubbleChartInputImpl(JDBCSettings jdbcSettings, BubbleChartSettings settings) {
        super(jdbcSettings);
        this.settings = settings;
    }

    @Override
    protected XYChart getChart() {
        if (chart == null) {
            chart = new BubbleChart(xAxis, yAxis);//BubbleChart does not use a Category Axis.  Both X and Y axes should be of type NumberAxis.
        }
        return chart;
    }

    void setHandler(JFXPanel jfxPanel, BubbleChartInputHandler handler) {
        this.jfxPanel = jfxPanel;
        this.handler = handler;
    }

    @Override
    public void plot(double x, double y) {
        plotImpl(x, y);
    }

    @Override
    public void plotNewSeries(String seriesName) {
        plotNewSeriesImpl(seriesName);
    }

}

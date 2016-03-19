/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.handler.AreaChartInputHandler;
import com.chuks.report.processor.param.AreaChartInput;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.collections.ObservableList;
import javafx.embed.swing.JFXPanel;
import javafx.scene.chart.AreaChart;
import javafx.scene.chart.Chart;
import javafx.scene.chart.XYChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
 class AreaChartInputImpl extends AbstractXYChartInputImpl implements AreaChartInput{
    private AreaChart chart;

     //ObservableList list = new ObservableArrayList();
     
    public AreaChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    protected XYChart getChart() {
        if(chart==null)
            chart = new AreaChart(xAxis, yAxis);
        return chart;
    }

    void setHandler(JFXPanel jfxPanel, AreaChartInputHandler handler) {
        this.jfxPanel = jfxPanel;
        this.handler = handler;
    }
    
    @Override
    public void plot(double x, double y) {
         plotImpl(x, y);
    }
    
    @Override
    public void plot(String x, double y){
         plotImpl(x, y); 
    }
    
    @Override
    public void plot(double x, String y){
        plotImpl(x, y); 
    }
    
    @Override
    public void plot(String x, String y){
        plotImpl(x, y); 
    }

    @Override
    public void plotNewSeries(String seriesName) {
         plotNewSeriesImpl(seriesName);
    }

}

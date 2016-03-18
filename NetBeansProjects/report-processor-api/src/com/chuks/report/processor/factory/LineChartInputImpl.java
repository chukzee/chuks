/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.handler.LineChartInputHandler;
import com.chuks.report.processor.param.LineChartInput;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Parent;
import javafx.scene.chart.LineChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
 class LineChartInputImpl extends AbstractXYChartInputImpl implements LineChartInput{

    public LineChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    protected Parent getChart() {
        return new LineChart(xAxis, yAxis);
    }

    void setHandler(JFXPanel jfxPanel, LineChartInputHandler handler) {
        this.jfxPanel = jfxPanel;
        this.handler = handler;
    }
    
}

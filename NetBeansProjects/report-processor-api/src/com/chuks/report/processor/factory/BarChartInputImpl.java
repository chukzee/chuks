/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.DataPoll;
import com.chuks.report.processor.handler.BarChartInputHandler;
import com.chuks.report.processor.param.BarChartInput;
import com.chuks.report.processor.param.PieChartInput;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Parent;
import javafx.scene.chart.Axis;
import javafx.scene.chart.BarChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
 class BarChartInputImpl extends AbstractXYChartInputImpl implements BarChartInput{

    public BarChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    protected Parent getChart() {
        return new BarChart(xAxis,yAxis);
    }

    void setHandler(JFXPanel jfxPanel, BarChartInputHandler handler) {
        this.jfxPanel = jfxPanel;
        this.handler = handler;       
    }


}

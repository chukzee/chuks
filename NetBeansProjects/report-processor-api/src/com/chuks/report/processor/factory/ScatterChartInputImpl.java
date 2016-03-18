/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.handler.ScatterChartInputHandler;
import com.chuks.report.processor.param.ScatterChartInput;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Parent;
import javafx.scene.chart.ScatterChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
 class ScatterChartInputImpl extends AbstractXYChartInputImpl implements ScatterChartInput{

    public ScatterChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    protected Parent getChart() {
        return new ScatterChart(xAxis, yAxis);
    }

    void setHandler(JFXPanel jfxPanel, ScatterChartInputHandler handler) {
        this.jfxPanel = jfxPanel;
        this.handler = handler;
    }
    
}

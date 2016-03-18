/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.handler.BubbleChartInputHandler;
import com.chuks.report.processor.param.BubbleChartInput;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Parent;
import javafx.scene.chart.BubbleChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class BubbleChartInputImpl extends AbstractXYChartInputImpl implements BubbleChartInput{

    public BubbleChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    protected Parent getChart() {
        return new BubbleChart(xAxis, yAxis);
    }

    void setHandler(JFXPanel jfxPanel, BubbleChartInputHandler handler) {
        this.jfxPanel = jfxPanel;
        this.handler = handler;
    }
    
}

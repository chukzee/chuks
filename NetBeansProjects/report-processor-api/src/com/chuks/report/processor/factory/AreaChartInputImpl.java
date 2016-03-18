/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.handler.AreaChartInputHandler;
import com.chuks.report.processor.handler.ChatInputHandler;
import com.chuks.report.processor.param.AreaChartInput;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Parent;
import javafx.scene.chart.AreaChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
 class AreaChartInputImpl extends AbstractXYChartInputImpl implements AreaChartInput{

    public AreaChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    protected Parent getChart() {
        return new AreaChart(xAxis, yAxis);
    }

    void setHandler(JFXPanel jfxPanel, AreaChartInputHandler handler) {
        this.jfxPanel = jfxPanel;
        this.handler = handler;;
    }
    
}

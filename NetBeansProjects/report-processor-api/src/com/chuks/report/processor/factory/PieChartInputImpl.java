/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.DataPoll;
import com.chuks.report.processor.chart.PieChartSettings;
import com.chuks.report.processor.handler.PieChartInputHandler;
import com.chuks.report.processor.param.PieChartInput;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Parent;
import javafx.scene.chart.Chart;
import javafx.scene.chart.PieChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class PieChartInputImpl extends AbstractChartInputImpl implements PieChartInput {

    private PieChart chart;

    public PieChartInputImpl(JDBCSettings jdbcSettings, PieChartSettings settings) {
        super(jdbcSettings);
        this.settings = settings;
    }

    @Override
    protected Chart getChart() {
        if (chart == null) {
            chart = new PieChart();
        }
        return chart;
    }

    void setHandler(JFXPanel jfx_panel, PieChartInputHandler handler) {
        jfxPanel = jfx_panel;
        this.handler = handler;
    }

    @Override
    public void plot(String a, double b) {
        plotImpl(a, b);
    }

}

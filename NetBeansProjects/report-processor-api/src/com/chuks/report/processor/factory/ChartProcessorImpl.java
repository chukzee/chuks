/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.handler.AreaChartInputHandler;
import com.chuks.report.processor.handler.BarChartInputHandler;
import com.chuks.report.processor.ChartProcessor;
import com.chuks.report.processor.handler.PieChartInputHandler;
import com.chuks.report.processor.handler.BubbleChartInputHandler;
import com.chuks.report.processor.handler.DataPollHandler;
import com.chuks.report.processor.handler.LineChartInputHandler;
import com.chuks.report.processor.handler.ScatterChartInputHandler;
import com.chuks.report.processor.handler.StackedBarChartInputHandler;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class ChartProcessorImpl extends AbstractUIDBProcessor implements ChartProcessor {

    public ChartProcessorImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void loadChart(PieChartInputHandler handler, JFXPanel jfxPanel) {
        PieChartSettingsImpl settings = new PieChartSettingsImpl();
        PieChartInputImpl input = new PieChartInputImpl(jdbcSettings, settings);        
        handler.onShow(input, settings);
        input.setHandler(jfxPanel, handler);
        input.show();
        DataPollHandler.registerPoll(input);

    }

    @Override
    public void loadChart(BarChartInputHandler handler, JFXPanel jfxPanel) {
        BarChartSettingsImpl settings = new BarChartSettingsImpl();
        BarChartInputImpl input = new BarChartInputImpl(jdbcSettings, settings);
        handler.onShow(input, settings);
        input.setHandler(jfxPanel, handler);
        input.show();
        DataPollHandler.registerPoll(input);
    }

    @Override
    public void loadChart(StackedBarChartInputHandler handler, JFXPanel jfxPanel) {
        StackedBarChartSettingsImpl settings = new StackedBarChartSettingsImpl();
        StackedBarChartInputImpl input = new StackedBarChartInputImpl(jdbcSettings, settings);
        handler.onShow(input, settings);
        input.setHandler(jfxPanel, handler);
        input.show();
        DataPollHandler.registerPoll(input);
    }

    @Override
    public void loadChart(AreaChartInputHandler handler, JFXPanel jfxPanel) {
        AreaChartSettingsImpl settings = new AreaChartSettingsImpl();
        AreaChartInputImpl input = new AreaChartInputImpl(jdbcSettings, settings);
        handler.onShow(input, settings);
        input.setHandler(jfxPanel, handler);
        input.show();
        DataPollHandler.registerPoll(input);
        
    }

    @Override
    public void loadChart(BubbleChartInputHandler handler, JFXPanel jfxPanel) {
        BubbleChartSettingsImpl settings = new BubbleChartSettingsImpl();
        BubbleChartInputImpl input = new BubbleChartInputImpl(jdbcSettings, settings);
        handler.onShow(input, settings);
        input.setHandler(jfxPanel, handler);
        input.show();
        DataPollHandler.registerPoll(input);
    }

    @Override
    public void loadChart(LineChartInputHandler handler, JFXPanel jfxPanel) {
        LineChartSettingsImpl settings = new LineChartSettingsImpl();
        LineChartInputImpl input = new LineChartInputImpl(jdbcSettings, settings);
        handler.onShow(input, settings);
        input.setHandler(jfxPanel, handler);
        input.show();
        DataPollHandler.registerPoll(input);
    }

    @Override
    public void loadChart(ScatterChartInputHandler handler, JFXPanel jfxPanel) {
        ScatterChartSettingsImpl settings = new ScatterChartSettingsImpl();
        ScatterChartInputImpl input = new ScatterChartInputImpl(jdbcSettings,settings);
        handler.onShow(input, settings);
        input.setHandler(jfxPanel, handler);
        input.show();
        DataPollHandler.registerPoll(input);
    }    
}

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
import com.chuks.report.processor.param.AreaChartInput;
import com.chuks.report.processor.param.BarChartInput;
import com.chuks.report.processor.param.BubbleChartInput;
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
        PieChartInputImpl input = new PieChartInputImpl(jdbcSettings);
        handler.onShow(input);

        input.show();

        input.setHandler(jfxPanel, handler);

        DataPollHandler.registerPoll(input);

    }

    @Override
    public void loadChart(BarChartInputHandler handler, JFXPanel jfxPanel) {
        BarChartInputImpl input = new BarChartInputImpl(jdbcSettings);
        handler.onShow(input);

        input.show();

        input.setHandler(jfxPanel, handler);

        DataPollHandler.registerPoll(input);
    }

    @Override
    public void loadChart(AreaChartInputHandler handler, JFXPanel jfxPanel) {
        AreaChartInputImpl input = new AreaChartInputImpl(jdbcSettings);
        handler.onShow(input);

        input.show();

        input.setHandler(jfxPanel, handler);

        DataPollHandler.registerPoll(input);
        
    }

    @Override
    public void loadChart(BubbleChartInputHandler handler, JFXPanel jfxPanel) {
        BubbleChartInputImpl input = new BubbleChartInputImpl(jdbcSettings);
        handler.onShow(input);

        input.show();

        input.setHandler(jfxPanel, handler);

        DataPollHandler.registerPoll(input);
    }

    @Override
    public void loadChart(LineChartInputHandler handler, JFXPanel jfxPanel) {
        LineChartInputImpl input = new LineChartInputImpl(jdbcSettings);
        handler.onShow(input);

        input.show();

        input.setHandler(jfxPanel, handler);

        DataPollHandler.registerPoll(input);
    }

    @Override
    public void loadChart(ScatterChartInputHandler handler, JFXPanel jfxPanel) {
        ScatterChartInputImpl input = new ScatterChartInputImpl(jdbcSettings);
        handler.onShow(input);

        input.show();

        input.setHandler(jfxPanel, handler);

        DataPollHandler.registerPoll(input);
    }

}

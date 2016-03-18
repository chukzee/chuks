/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.DataPoll;
import com.chuks.report.processor.handler.ChatInputHandler;
import com.chuks.report.processor.util.JDBCSettings;
import com.sun.javafx.application.PlatformImpl;
import javafx.application.Platform;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.chart.BarChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractChartInputImpl extends AbstractUIDBProcessor implements DataPoll {

    protected String chart_title;
    protected JFXPanel jfxPanel;
    private long next_poll_time;
    protected ChatInputHandler handler;

    public AbstractChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings, true);//enable data polling
    }

    public void setChartTitle(String title) {
        this.chart_title = title;
    }

    public void setChartPanel(JFXPanel jfxPanel) {
        this.jfxPanel = jfxPanel;
    }

    protected abstract Parent getChart();

    
    @Override
    public void setNextPollTime(long next_poll_time) {
        this.next_poll_time = next_poll_time;
    }

    @Override
    public long getNextPollTime() {
        return next_poll_time;
    }

    @Override
    public boolean pause() {
        return !jfxPanel.isShowing();
    }

    @Override
    public void pollData() {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        
    }

    @Override
    public void setPollingEnabled(boolean isPoll) {
        data_polling_enabled = isPoll;
    }

    @Override
    public boolean isPollingEnabled() {
        return data_polling_enabled;
    }

    @Override
    public void setPollingInterval(float seconds) {
        data_polling_interval = seconds;
    }

    @Override
    public float getPollingInterval() {
        return data_polling_interval;
    }

    public void show() {

        PlatformImpl.startup(new Runnable() {

            @Override
            public void run() {
                
                Scene scene = new Scene(getChart(), jfxPanel.getWidth(), jfxPanel.getHeight());
                jfxPanel.setScene(scene);
            }

        });
        Platform.setImplicitExit(false);
    }
}

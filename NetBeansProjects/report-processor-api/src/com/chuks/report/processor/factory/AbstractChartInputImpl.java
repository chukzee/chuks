/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.DataPoll;
import com.chuks.report.processor.handler.ChatInputHandler;
import com.chuks.report.processor.param.ChartInput;
import com.chuks.report.processor.param.ChartXYInput;
import com.chuks.report.processor.util.JDBCSettings;
import com.sun.javafx.application.PlatformImpl;
import java.util.LinkedList;
import java.util.List;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.embed.swing.JFXPanel;
import javafx.event.EventHandler;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.chart.Chart;
import javafx.scene.chart.PieChart;
import javafx.scene.control.Label;
import javafx.scene.input.MouseEvent;
import javafx.scene.paint.Color;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractChartInputImpl extends AbstractUIDBProcessor implements ChartInput, DataPoll {

    protected String chart_title;
    protected JFXPanel jfxPanel;
    private long next_poll_time;
    protected ChatInputHandler handler;
    List<PieChart.Data> data = new LinkedList();
    private ObservableList<PieChart.Data> pieChartData;
    private Scene scene;

    public AbstractChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings, true);//enable data polling
    }

    @Override
    public void setChartTitle(String title) {
        this.chart_title = title;
    }

    public String getChartTitle() {
        return this.chart_title;
    }

    public void setChartPanel(JFXPanel jfxPanel) {
        this.jfxPanel = jfxPanel;
    }

    protected abstract Chart getChart();

    protected void plotImpl(Object a, Object b) {
        data.add(new PieChart.Data((String) a, (double) b));
    }

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
        
        data.clear();//first clear
        
        handler.onShow(this);

        final PieChart chart = (PieChart) this.getChart();
        pieChartData = FXCollections.observableArrayList(data);

        PlatformImpl.runAndWait(new Runnable() {

            @Override
            public void run() {
                if (scene == null) {
                    return;
                }
                ((Group) scene.getRoot()).getChildren().remove(getChart());
                chart.getData().clear();
                chart.setData(pieChartData);
                ((Group) scene.getRoot()).getChildren().add(getChart());
            }

        });
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
    Label caption;

    protected void generateChartView() {
        PieChart chart = (PieChart) this.getChart();
        chart.setTitle(chart_title);
        pieChartData
                = FXCollections.observableArrayList(data);
        chart.setData(pieChartData);

        caption = new Label("");
        caption.setTextFill(Color.FLORALWHITE);
        caption.setStyle("-fx-font: 24 arial;");

        scene = new Scene(new Group(), jfxPanel.getWidth(), jfxPanel.getHeight());

        ((Group) scene.getRoot()).getChildren().add(getChart());
        ((Group) scene.getRoot()).getChildren().add(caption);

        jfxPanel.setScene(scene);

        for (final PieChart.Data _data : chart.getData()) {

            _data.getNode().addEventHandler(MouseEvent.MOUSE_PRESSED,
                    new EventHandler<MouseEvent>() {
                        @Override
                        public void handle(MouseEvent e) {
                            caption.setTranslateX(e.getSceneX());
                            caption.setTranslateY(e.getSceneY());
                            caption.setText(String.valueOf(_data.getPieValue()) + "%");
                        }
                    });

        }
    }

    public void show() {

        PlatformImpl.startup(new Runnable() {

            @Override
            public void run() {
                generateChartView();
            }

        });
        Platform.setImplicitExit(false);
    }
}

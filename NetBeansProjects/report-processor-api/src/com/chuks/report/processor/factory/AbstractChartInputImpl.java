/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.DataPoll;
import com.chuks.report.processor.chart.ChartSettings;
import com.chuks.report.processor.handler.ChatInputHandler;
import com.chuks.report.processor.param.ChartInput;
import com.chuks.report.processor.param.ChartXYInput;
import com.chuks.report.processor.util.JDBCSettings;
import com.sun.javafx.application.PlatformImpl;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.embed.swing.JFXPanel;
import javafx.event.EventHandler;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Parent;
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
    protected Scene scene;
    protected ChartSettings settings;
    static Map<Integer, Integer> chartToPanelMapping = new HashMap();
    static ReentrantLock lock = new ReentrantLock();

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

    protected void initializes() {
        data.clear();
    }

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
    public boolean pausePoll() {
        return !jfxPanel.isShowing();
    }

    @Override
    public boolean stopPoll() {
        lock.lock();
        try {
            return !isChartStillMappedToPanel();
        } finally {
            lock.unlock();
        }
    }

    private boolean isChartStillMappedToPanel() {
        int mappedHash = chartToPanelMapping.get(jfxPanel.hashCode());
        return mappedHash != 0
                && mappedHash == this.hashCode();
    }

    @Override
    final public void pollData() {

        if (jfxPanel.getScene() == null) {
            return;//scene not ready
        }

        System.err.println("pollData ->" + this);
        System.err.println("pollData chart ->" + this.getChart());

        final AbstractChartInputImpl dThis = this;

        PlatformImpl.runAndWait(new Runnable() {

            @Override
            public void run() {

                lock.lock();

                initializes();

                handler.onShow(dThis, settings);

                try {
                    syncGenerateChartView();
                } finally {
                    lock.unlock();
                }

            }

        });
    }

    synchronized private void syncGenerateChartView() {
        if (isChartStillMappedToPanel()) {
            generateChartView();
        }
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

    Label pie_caption;

    protected void generateChartView() {

        if (scene == null) {
            scene = new Scene(new Group(), jfxPanel.getWidth(), jfxPanel.getHeight());
        } else {
            ((Group) scene.getRoot()).getChildren().clear();
        }

        PieChart chart = (PieChart) this.getChart();
        chart.setTitle(chart_title);
        pieChartData
                = FXCollections.observableArrayList(data);

        chart.getData().clear();//important! clear previous data if any
        chart.setData(pieChartData);

        createPiecCaption();
        ((Group) scene.getRoot()).getChildren().add(getChart());
        ((Group) scene.getRoot()).getChildren().add(pie_caption);

        jfxPanel.setScene(scene);
        setPieCaptionEvent(chart);
    }

    void createPiecCaption() {
        if (pie_caption == null) {
            pie_caption = new Label("");
            pie_caption.setTextFill(Color.FLORALWHITE);
            pie_caption.setStyle("-fx-font: 24 arial;");
        }
    }

    void setPieCaptionEvent(PieChart chart) {
        for (final PieChart.Data _data : chart.getData()) {
            _data.getNode().addEventHandler(MouseEvent.MOUSE_PRESSED,
                    new EventHandler<MouseEvent>() {
                        @Override
                        public void handle(MouseEvent e) {
                            pie_caption.setTranslateX(e.getSceneX());
                            pie_caption.setTranslateY(e.getSceneY());
                            pie_caption.setText(String.valueOf(_data.getPieValue()) + "%");
                        }
                    });

        }
    }

    public void show() {

        final AbstractChartInputImpl aThis = this;

        PlatformImpl.startup(new Runnable() {

            @Override
            public void run() {
                lock.lock();
                try {
                    chartToPanelMapping.put(jfxPanel.hashCode(), aThis.hashCode());//mapping the chart to the panel
                    syncGenerateChartView();
                } finally {
                    lock.unlock();
                }

            }

        });
        Platform.setImplicitExit(false);

    }
}

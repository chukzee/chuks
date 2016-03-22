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
import com.chuks.report.processor.util.JDBCSettings;
import com.sun.javafx.application.PlatformImpl;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;
import javafx.animation.TranslateTransition;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.embed.swing.JFXPanel;
import javafx.event.Event;
import javafx.event.EventHandler;
import javafx.event.EventType;
import javafx.geometry.Bounds;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.chart.Chart;
import javafx.scene.chart.PieChart;
import javafx.scene.control.Label;
import javafx.scene.input.MouseEvent;
import javafx.scene.paint.Color;
import javafx.util.Duration;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractChartInputImpl extends AbstractUIDBProcessor implements ChartInput, DataPoll {

    protected String chart_title;
    protected JFXPanel jfxPanel;
    private long next_poll_time;
    protected ChatInputHandler handler;
    private final List<PieChart.Data> data = new LinkedList();
    private ObservableList<PieChart.Data> pieChartData;
    protected Scene scene;
    protected ChartSettings settings;
    static Map<Integer, Integer> chartToPanelMapping = new HashMap();
    static ReentrantLock lock = new ReentrantLock();
    private Label pie_caption;
    private String pieValueSuffix = "";

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

    protected void generateChartView() {

        PieChart chart = (PieChart) this.getChart();
        chart.setTitle(chart_title);
        pieChartData = FXCollections.observableArrayList(data);

        if (scene == null) {
            scene = new Scene(new Group(), jfxPanel.getWidth(), jfxPanel.getHeight());
            createPieCaption();
            ((Group) scene.getRoot()).getChildren().add(getChart());
            ((Group) scene.getRoot()).getChildren().add(pie_caption);

            chart.setData(pieChartData);

            jfxPanel.setScene(scene);
            setDefaultPieEvent(chart);
        } else {
            ObservableList<PieChart.Data> prev_data = chart.getData();
            int max_len = Math.max(prev_data.size(), pieChartData.size());
            for (int i = 0; i < max_len; i++) {

                if (i >= pieChartData.size()) {
                    prev_data.remove(i, max_len);//remove the rest
                    break;
                } else if (i >= prev_data.size()) {
                    prev_data.add(i, pieChartData.get(i));
                } else if (pieChartData.get(i).getName().equals(prev_data.get(i).getName())) {
                    prev_data.get(i).setPieValue(pieChartData.get(i).getPieValue());
                } else {
                    prev_data.get(i).setName(pieChartData.get(i).getName());
                    prev_data.get(i).setPieValue(pieChartData.get(i).getPieValue());
                }
            }

            setDefaultPieEvent(chart);
        }

    }

    private void createPieCaption() {
        if (pie_caption == null) {
            pie_caption = new Label("");
            pie_caption.setTextFill(Color.FLORALWHITE);
            pie_caption.setStyle("-fx-font: 24 arial;");
        }
    }

    HashMap<Integer, DefaultPieMouseEventHandler> regHandler = new HashMap();

    private void setDefaultPieEvent(PieChart chart) {
        for (final PieChart.Data pieData : chart.getData()) {

            Node node = pieData.getNode();
            int node_hash = node.hashCode();
            if (regHandler.containsKey(node_hash)) {//remove previous DefaultPieMouseEventHandler
                node.removeEventHandler(MouseEvent.MOUSE_PRESSED, regHandler.get(node_hash));
                regHandler.remove(node_hash);
            }
            DefaultPieMouseEventHandler evtHndler = new DefaultPieMouseEventHandler(pieData);
            pieData.getNode().addEventHandler(MouseEvent.MOUSE_PRESSED, evtHndler);
            regHandler.put(node.hashCode(), evtHndler);

        }
    }

    public void show() {

        //JFXPanel initalization automatically starts the FX runtime, so check if it is null
        if (jfxPanel == null) {
            throw new IllegalStateException(jfxPanel.getClass().getName() + " must not be null.");
        }

        PlatformImpl.runAndWait(new ShowChartView(this));

        Platform.setImplicitExit(false);

    }

    class ShowChartView implements Runnable {

        private final AbstractChartInputImpl chartInputImpl;

        private ShowChartView(AbstractChartInputImpl chartInputImpl) {
            this.chartInputImpl = chartInputImpl;
        }

        @Override
        public void run() {

            lock.lock();
            try {
                chartToPanelMapping.put(jfxPanel.hashCode(), chartInputImpl.hashCode());//mapping the chart to the panel
                syncGenerateChartView();
            } finally {
                lock.unlock();
            }

        }

    }

    class DefaultPieMouseEventHandler implements EventHandler<MouseEvent> {

        private final PieChart.Data pieData;

        private DefaultPieMouseEventHandler(PieChart.Data pieData) {
            this.pieData = pieData;
        }

        @Override
        public void handle(MouseEvent e) {
            pie_caption.setTranslateX(e.getSceneX());
            pie_caption.setTranslateY(e.getSceneY());
            pie_caption.setText(String.valueOf(pieData.getPieValue()) + pieValueSuffix);

            Bounds b1 = pieData.getNode().getBoundsInLocal();
            double newX = (b1.getWidth()) / 2 + b1.getMinX();
            double newY = (b1.getHeight()) / 2 + b1.getMinY();
            // Make sure pie wedge location is reset
            pieData.getNode().setTranslateX(0);
            pieData.getNode().setTranslateY(0);
            TranslateTransition tt = new TranslateTransition(
                    Duration.millis(1500), pieData.getNode());
            tt.setByX(newX);
            tt.setByY(newY);
            tt.setAutoReverse(true);
            tt.setCycleCount(2);
            tt.play();

            TranslateTransition tt2 = new TranslateTransition(
                    Duration.millis(1500), pie_caption);
            tt2.setByX(newX);
            tt2.setByY(newY);
            tt2.setAutoReverse(true);
            tt2.setCycleCount(2);
            tt2.play();
        }

    }
}

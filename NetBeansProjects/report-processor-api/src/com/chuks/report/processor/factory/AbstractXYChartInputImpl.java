/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.ChartXYSettings;
import com.chuks.report.processor.param.ChartXYInput;
import com.chuks.report.processor.util.JDBCSettings;
import com.sun.javafx.application.PlatformImpl;
import java.util.LinkedList;
import java.util.List;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.chart.Axis;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractXYChartInputImpl extends AbstractChartInputImpl implements ChartXYInput {

    protected Axis xAxis;
    protected Axis yAxis;
    private String axisY_label;
    private String axisX_label;
    private boolean y_axis_category;
    private boolean x_axis_category;
    private int plot_count;
    List<XYChart.Series> seriesList = new LinkedList();
    protected ChartXYSettings settings;

    public AbstractXYChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void setLabelX(String axis_label) {
        this.axisX_label = axis_label;
    }

    @Override
    public void setLabelY(String axis_label) {
        this.axisY_label = axis_label;
    }

    protected void plotNewSeriesImpl(String seriesName) {
        XYChart.Series series = new XYChart.Series();
        series.setName(seriesName);
        this.seriesList.add(series);
    }

    void validatePlot(Object x, Object y){
        
        if (this.seriesList.isEmpty()) {
            plotNewSeriesImpl("");
        }

        boolean prev_x_axis_category = x_axis_category;
        boolean prev_y_axis_category = y_axis_category;

        if (x instanceof String) {
            x_axis_category = true;
        }

        if (y instanceof String) {
            y_axis_category = true;
        }

        if (plot_count > 0) {
            //check misuse

            if (prev_x_axis_category && !x_axis_category) {
                throw new IllegalArgumentException("plotted axis must maintain the same data type");
            }

            if (!prev_x_axis_category && x_axis_category) {
                throw new IllegalArgumentException("plotted axis must maintain the same data type");
            }

            if (prev_y_axis_category && !y_axis_category) {
                throw new IllegalArgumentException("plotted axis must maintain the same data type");
            }

            if (!prev_y_axis_category && y_axis_category) {
                throw new IllegalArgumentException("plotted axis must maintain the same data type");
            }
        }

        plot_count++;        
    }
    
    @Override
    protected void plotImpl(Object x, Object y) {
        validatePlot(x, y);
        seriesList.get(seriesList.size() - 1).getData().add(new XYChart.Data(x, y));
    }

    protected void plotImpl(Object x, Object y, Object extraValue){
        validatePlot(x, y);
        seriesList.get(seriesList.size() - 1).getData().add(new XYChart.Data(x, y, extraValue));        
    } 
    
    @Override
    final protected void generateChartView() {
        if (x_axis_category) {
            xAxis = new CategoryAxis();
        } else {
            xAxis = new NumberAxis();
        }

        if (y_axis_category) {
            yAxis = new CategoryAxis();
        } else {
            yAxis = new NumberAxis();
        }

        xAxis.setLabel(axisX_label);
        yAxis.setLabel(axisY_label);

        if (scene == null) {
            scene = new Scene(new Group(), jfxPanel.getWidth(), jfxPanel.getHeight());
            jfxPanel.setScene(scene);
        } else {
            ((Group) scene.getRoot()).getChildren().clear();
        }

        XYChart chart = this.getChart();
        chart.setTitle(chart_title);
        chart.getData().clear();//important! clear previous if any
        chart.getData().addAll(seriesList.toArray());

        ((Group) scene.getRoot()).getChildren().add(getChart());

    }

    @Override
    protected abstract XYChart getChart();

    @Override
    final protected void initializes() {
        //initialize control variables
        seriesList.clear();
        plot_count = 0;
        x_axis_category = false;
        y_axis_category = false;
    }

    protected Axis getAxisX() {
        return xAxis;
    }

    protected Axis getAxisY() {
        return yAxis;
    }

    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.XYChartSettings;
import com.chuks.report.processor.param.XYChartInput;
import com.chuks.report.processor.util.JDBCSettings;
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
abstract class AbstractXYChartInputImpl extends AbstractChartInputImpl implements XYChartInput {

    protected Axis xAxis;
    protected Axis yAxis;
    private boolean y_axis_category;
    private boolean x_axis_category;
    private int plot_count;
    List<XYChart.Series> seriesList = new LinkedList();
    protected XYChartSettings xy_chart_settings;

    public AbstractXYChartInputImpl(JDBCSettings jdbcSettings, XYChartSettings settings) {
        super(jdbcSettings, settings);
        this.xy_chart_settings = settings;
    }

    protected void plotNewSeriesImpl(String seriesName) {
        XYChart.Series series = new XYChart.Series();
        series.setName(seriesName);
        this.seriesList.add(series);
    }

    @Override
    protected void setChatProperties() {
        super.setChatProperties();

        XYChart chart = this.getChart();

        chart.setVerticalGridLinesVisible(xy_chart_settings.getVerticalGridLinesVisible());
        chart.setHorizontalGridLinesVisible(xy_chart_settings.getHorizontalGridLinesVisible());
        chart.setVerticalZeroLineVisible(xy_chart_settings.getVerticalZeroLineVisible());
        chart.setHorizontalZeroLineVisible(xy_chart_settings.getHorizontalZeroLineVisible());
        chart.setAlternativeColumnFillVisible(xy_chart_settings.getAlternativeColumnFillVisible());
        chart.setAlternativeRowFillVisible(xy_chart_settings.getAlternativeRowFillVisible());
        
        chart.getXAxis().setLabel(xy_chart_settings.getLabelX());
        chart.getYAxis().setLabel(xy_chart_settings.getLabelY());
        
        chart.getXAxis().setAnimated(xy_chart_settings.getAnimatedX());
        chart.getYAxis().setAnimated(xy_chart_settings.getAnimatedY());
        
        chart.getXAxis().setSide(xy_chart_settings.getSideX());
        chart.getYAxis().setSide(xy_chart_settings.getSideY());
        
        chart.getXAxis().setTickLabelFill(xy_chart_settings.getTickLabelFillX());
        chart.getYAxis().setTickLabelFill(xy_chart_settings.getTickLabelFillY());
        
        chart.getXAxis().setTickLabelFont(xy_chart_settings.getTickLabelFontX());
        chart.getYAxis().setTickLabelFont(xy_chart_settings.getTickLabelFontY());

        chart.getXAxis().setTickLabelGap(xy_chart_settings.getTickLabelGapX());
        chart.getYAxis().setTickLabelGap(xy_chart_settings.getTickLabelGapY());

        chart.getXAxis().setTickLabelRotation(xy_chart_settings.getTickLabelRotationX());
        chart.getYAxis().setTickLabelRotation(xy_chart_settings.getTickLabelRotationY());
        
        chart.getXAxis().setTickLabelsVisible(xy_chart_settings.getTickLabelIsVisibleX());
        chart.getYAxis().setTickLabelsVisible(xy_chart_settings.getTickLabelIsVisibleY());
        
        chart.getXAxis().setTickLength(xy_chart_settings.getTickLengthX());
        chart.getYAxis().setTickLength(xy_chart_settings.getTickLengthY());

        chart.getXAxis().setTickMarkVisible(xy_chart_settings.getTickMarkVisibleX());
        chart.getYAxis().setTickMarkVisible(xy_chart_settings.getTickMarkVisibleY());

        chart.getXAxis().setAutoRanging(xy_chart_settings.getAutoRangingX());
        chart.getYAxis().setAutoRanging(xy_chart_settings.getAutoRangingY());

        if(chart.getXAxis() instanceof NumberAxis){
            NumberAxis x_axis = (NumberAxis)chart.getXAxis();
            x_axis.setLowerBound(xy_chart_settings.getLowerBoundX());
            x_axis.setUpperBound(xy_chart_settings.getUpperBoundX());
            x_axis.setTickUnit(xy_chart_settings.getTickUnitX());
            x_axis.setMinorTickCount(xy_chart_settings.getMinorTickCountX());
            x_axis.setMinorTickLength(xy_chart_settings.getMinorTickLengthX());
            x_axis.setMinorTickVisible(xy_chart_settings.getMinorTickVisibleX());
        }
        
        if(chart.getYAxis() instanceof NumberAxis){
            NumberAxis y_axis = (NumberAxis)chart.getYAxis();      
            y_axis.setLowerBound(xy_chart_settings.getLowerBoundY());
            y_axis.setUpperBound(xy_chart_settings.getUpperBoundY());
            y_axis.setTickUnit(xy_chart_settings.getTickUnitY());
            y_axis.setMinorTickCount(xy_chart_settings.getMinorTickCountY());
            y_axis.setMinorTickLength(xy_chart_settings.getMinorTickLengthY());
            y_axis.setMinorTickVisible(xy_chart_settings.getMinorTickVisibleY());
        }
        
        if(chart.getXAxis() instanceof CategoryAxis){
            CategoryAxis x_axis = (CategoryAxis)chart.getXAxis(); 
            x_axis.setGapStartAndEnd(xy_chart_settings.getCategoryGapStartAndEndX());
            x_axis.setStartMargin(xy_chart_settings.getCategoryStartMarginX());
            x_axis.setEndMargin(xy_chart_settings.getCategoryEndMarginX());
        }
        
        if(chart.getYAxis() instanceof CategoryAxis){
            CategoryAxis y_axis = (CategoryAxis)chart.getYAxis();  
            y_axis.setGapStartAndEnd(xy_chart_settings.getCategoryGapStartAndEndY());
            y_axis.setStartMargin(xy_chart_settings.getCategoryStartMarginY());
            y_axis.setEndMargin(xy_chart_settings.getCategoryEndMarginY());           
            
        }
        
    }

    void validatePlot(Object x, Object y) {

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

    protected void plotImpl(Object x, Object y, Object extraValue) {
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

        //xAxis.setLabel(axisX_label);
        //yAxis.setLabel(axisY_label);
        if (scene == null) {
            scene = new Scene(new Group(), jfxPanel.getWidth(), jfxPanel.getHeight());
            jfxPanel.setScene(scene);
        } else {
            ((Group) scene.getRoot()).getChildren().clear();
        }

        XYChart chart = this.getChart();
        setChatProperties();
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

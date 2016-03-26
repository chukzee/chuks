/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.PieChartSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class PieChartSettingsImpl extends AbstractChartSettingsImpl implements PieChartSettings{
    private String pie_value_suffix = "";
    private boolean clockwise = true;
    private double label_line_length = 20d;
    private boolean labels_visible = true;
    private double start_angle; //defaults to zero

    @Override
    public void setPieValueSuffix(String pie_value_suffix) {
        this.pie_value_suffix = pie_value_suffix;
    }

    @Override
    public String getPieValueSuffix() {
        return pie_value_suffix;
    }

    @Override
    public void setClockwise(boolean value) {
        clockwise=value;
    }

    @Override
    public boolean getClockwise() {
        return clockwise;
    }

    @Override
    public void setLabelLineLength(double value) {
        label_line_length = value;
    }

    @Override
    public double getLabelLineLength() {
        return label_line_length;
    }

    @Override
    public void setLabelsVisible(boolean value) {
        labels_visible = value;
    }

    @Override
    public boolean getLabelsVisible() {
        return labels_visible;
    }

    @Override
    public void setStartAngle(double value) {
        start_angle = value;
    }

    @Override
    public double getStartAngle() {
        return start_angle;
    }

  
    
}

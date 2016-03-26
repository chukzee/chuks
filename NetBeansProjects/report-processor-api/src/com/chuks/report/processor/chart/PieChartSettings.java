/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.chart;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface PieChartSettings  extends ChartSettings{
    
    void setPieValueSuffix(String pie_value_suffix);

    String getPieValueSuffix();
    
    void setClockwise(boolean value);

    boolean getClockwise();
    
    void setLabelLineLength(double value);
    
    double getLabelLineLength();

    void setLabelsVisible(double value);

    double getLabelsVisible();
    
    void setStartAngle(double value);

    double getStartAngle();
    
}

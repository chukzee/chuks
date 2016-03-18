/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.DataPoll;
import com.chuks.report.processor.util.JDBCSettings;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javafx.scene.chart.Axis;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractXYChartInputImpl extends AbstractChartInputImpl{
    protected Axis xAxis;
    protected Axis yAxis;
    private List <LinkedHashMap> seriesList = new ArrayList();

    public AbstractXYChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }
   
    Map newSeries(){
        LinkedHashMap series = new LinkedHashMap();
        seriesList.add(series);
        return series;
    }
    
    public void setAxisX(AxisType type, String axis_label){
        if(type==AxisType.NUMBER){
            xAxis = new NumberAxis();
        }else if(type==AxisType.CATEGORY){
            xAxis = new CategoryAxis();
        }
        
        xAxis.setLabel(axis_label);
    }
   
    public void setAxisY(AxisType type, String axis_label){
        if(type==AxisType.NUMBER){
            yAxis = new NumberAxis();
        }else if(type==AxisType.CATEGORY){
            yAxis = new CategoryAxis();
        }
        
        yAxis.setLabel(axis_label);
    }
   
    protected Axis getAxisX() {
        return xAxis;
    }

    protected Axis getAxisY() {
        return yAxis;
    }

}

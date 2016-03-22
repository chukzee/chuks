/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.chart.BarChartSettings;
import com.chuks.report.processor.param.BarChartInput;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface BarChartInputHandler  extends ChatInputHandler <BarChartInput, BarChartSettings>{
    
    @Override
    void onShow(BarChartInput input , BarChartSettings settings);
}
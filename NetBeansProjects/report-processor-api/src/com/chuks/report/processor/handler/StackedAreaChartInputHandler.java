/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.chart.*;
import com.chuks.report.processor.param.*;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com> */
public interface  StackedAreaChartInputHandler extends ChatInputHandler <StackedAreaChartInput, StackedAreaChartSettings>{
   
    @Override
    void onShow(StackedAreaChartInput input, StackedAreaChartSettings settings);
}

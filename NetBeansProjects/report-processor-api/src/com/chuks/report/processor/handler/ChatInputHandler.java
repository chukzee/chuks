/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.chart.AreaChartSettings;
import com.chuks.report.processor.chart.ChartSettings;
import com.chuks.report.processor.param.ChartInput;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 * @param <T>
 * @param <E>
 */
public interface ChatInputHandler<T extends ChartInput,E extends ChartSettings> {
    
     void onShow(T input, E settings);
}

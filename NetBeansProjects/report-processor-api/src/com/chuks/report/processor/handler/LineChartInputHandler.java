/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.chart.LineChartSettings;
import com.chuks.report.processor.param.LineChartInput;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface LineChartInputHandler extends ChatInputHandler<LineChartInput, LineChartSettings> {

    @Override
    void onShow(LineChartInput input, LineChartSettings settings);

}
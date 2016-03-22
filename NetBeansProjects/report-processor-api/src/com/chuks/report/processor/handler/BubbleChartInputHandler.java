/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.chart.BubbleChartSettings;
import com.chuks.report.processor.param.BubbleChartInput;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface BubbleChartInputHandler extends ChatInputHandler<BubbleChartInput, BubbleChartSettings> {

    @Override
    void onShow(BubbleChartInput input, BubbleChartSettings settings);

}
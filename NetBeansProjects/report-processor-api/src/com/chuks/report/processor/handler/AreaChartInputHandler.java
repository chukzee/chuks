/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.param.AreaChartInput;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 * @param 
 */
public interface  AreaChartInputHandler extends ChatInputHandler <AreaChartInput>{
   
    @Override
    void onShow(AreaChartInput input);
}

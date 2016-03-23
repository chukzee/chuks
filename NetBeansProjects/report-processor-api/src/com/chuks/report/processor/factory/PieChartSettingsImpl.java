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

    @Override
    public void setPieValueSuffix(String pie_value_suffix) {
        this.pie_value_suffix = pie_value_suffix;
    }

  
    
}

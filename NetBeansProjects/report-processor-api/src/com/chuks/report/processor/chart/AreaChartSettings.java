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
public interface AreaChartSettings extends XYChartSettings{
    
    void setCreateSymbols(boolean value);
    boolean getCreateSymbols();
}

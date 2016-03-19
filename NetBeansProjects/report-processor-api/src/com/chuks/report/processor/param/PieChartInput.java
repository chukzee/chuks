/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.param;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface PieChartInput  extends ChartInput ,  ActionSQL{
    
    void addPie(String a, double b);
}

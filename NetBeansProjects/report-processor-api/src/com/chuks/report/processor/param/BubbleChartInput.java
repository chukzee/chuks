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
public interface BubbleChartInput  extends XYChartInput ,  ActionSQL{
    
    void plot(double x, double y);
    void plot(double x, double y, double radius);
}

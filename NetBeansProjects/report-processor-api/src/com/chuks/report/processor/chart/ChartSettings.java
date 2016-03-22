/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.chart;

import javafx.scene.effect.Effect;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ChartSettings {
    
    void setChartTitle(String chart_title);
    void setLegendSide(Side side);
    void setEffect(Effect effect);
    void setStyle(String css_path);
    void setAnimated(boolean animated);


}

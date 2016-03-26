/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.chart;

import javafx.geometry.Side;
import javafx.scene.effect.Effect;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ChartSettings {
    
    void setChartTitle(String chart_title);
    String getChartTitle();
    void setChartTitleSide(Side chart_title_side);
    Side getChartTitleSide();
    void setLegendSide(Side side);
    Side getLegendSide();
    void setEffect(Effect effect);
    Effect getEffect();
    void setStyle(String css_path);
    String getStyle();
    void setAnimated(boolean animated);
    boolean getAnimated();
    public void setLegendVisible(boolean is_visible);
    public boolean getLegendVisible();


}

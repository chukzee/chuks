/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.ChartSettings;
import com.chuks.report.processor.chart.Side;
import javafx.scene.effect.Effect;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractChartSettingsImpl implements ChartSettings{
    private String chart_title;
    private Side legend_side;
    private Effect effect;
    private String style_css_path;
    private boolean is_animated;

    @Override
    public void setChartTitle(String chart_title) {
        this.chart_title = chart_title;        
    }

    @Override
    public void setLegendSide(Side side) {
        legend_side = side;
    }

    @Override
    public void setEffect(Effect effect) {
        this.effect = effect;        
    }

    @Override
    public void setStyle(String css_path) {
        this.style_css_path = css_path;
    }

    @Override
    public void setAnimated(boolean animated) {
        this.is_animated=animated;
    }
    
}

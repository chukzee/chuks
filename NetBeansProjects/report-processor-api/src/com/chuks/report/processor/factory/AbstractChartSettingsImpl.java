/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.ChartSettings;
import javafx.geometry.Side;
import javafx.scene.effect.Effect;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractChartSettingsImpl implements ChartSettings {

    private String chart_title = "";
    private Side legend_side = Side.BOTTOM;
    private Effect effect;//defaults to null
    private String style_css_path;//defaults to null
    private boolean is_animated = true;
    private Side chart_title_side = Side.TOP;
    private boolean is_legend_visible = true;

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
        this.is_animated = animated;
    }

    @Override
    public String getChartTitle() {
        return chart_title;
    }

    @Override
    public void setChartTitleSide(Side chart_title_side) {
        this.chart_title_side = chart_title_side;
    }

    @Override
    public Side getChartTitleSide() {
        return chart_title_side;
    }

    @Override
    public Side getLegendSide() {
        return legend_side;
    }

    @Override
    public Effect getEffect() {
        return effect;
    }

    @Override
    public String getStyle() {
        return style_css_path;
    }

    @Override
    public boolean getAnimated() {
        return is_animated;
    }

    @Override
    public void setLegendVisible(boolean is_visible) {
        this.is_legend_visible = is_visible;
    }

    @Override
    public boolean getLegendVisible() {
        return is_legend_visible;
    }

}

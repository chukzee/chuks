/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.XYChartSettings;
import com.chuks.report.processor.chart.Side;
import javafx.scene.paint.Color;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractXYChartSettingsImpl extends AbstractChartSettingsImpl implements XYChartSettings {

    private Side side_x = Side.BOTTOM;
    private Side side_y = Side.LEFT;
    private String xAxisLabel = "";
    private String yAxisLabel = "";
    private int x_lower_bound;
    private int y_lower_bound;
    private int x_upper_bound;
    private int y_upper_bound;
    private int x_tick_unit;
    private int y_tick_unit;
    private int x_minor_tick_count;
    private int y_minor_tick_count;
    private boolean is_tick_label_visible = true;
    private int x_tick_length;
    private int y_tick_length;
    private int x_minor_tick_length;
    private int y_minor_tick_length;
    private boolean vertical_grid_lines_visible = true;
    private boolean horizontal_grid_lines_visible = true;
    private Color x_tick_label_fill_color;
    private Color y_tick_label_fill_color;
    private int x_tick_label_gap;
    private int y_tick_label_gap;
    private int x_tick_label_rotation;
    private int y_tick_label_rotation;
    private int category_gap;
    private boolean x_animated = true;
    private boolean y_animated = true;

    @Override
    public void setSideX(Side side) {
        this.side_x = side;
    }

    @Override
    public void setSideY(Side side) {
        this.side_y = side;
    }

    @Override
    public void setLabelX(String xAxisLabel) {
        this.xAxisLabel = xAxisLabel;
    }

    @Override
    public void setLabelY(String yAxisLabel) {
        this.yAxisLabel = yAxisLabel;
    }

    @Override
    public void setLowerBoundX(int x_lower_bound) {
        this.x_lower_bound = x_lower_bound;
    }

    @Override
    public void setLowerBoundY(int y_lower_bound) {
        this.y_lower_bound = y_lower_bound;
    }

    @Override
    public void setUpperBoundX(int x_upper_bound) {
        this.x_upper_bound = x_upper_bound;
    }

    @Override
    public void setUpperBoundY(int y_upper_bound) {
        this.y_upper_bound = y_upper_bound;
    }

    @Override
    public void setTickUnitX(int x_tick_unit) {
        this.x_tick_unit = x_tick_unit;
    }

    @Override
    public void setTickUnitY(int y_tick_unit) {
        this.y_tick_unit = y_tick_unit;
    }

    @Override
    public void setMinorTickCountX(int x_minor_tick_count) {
        this.x_minor_tick_count = x_minor_tick_count;
    }

    @Override
    public void setMinorTickCountY(int y_minor_tick_count) {
        this.y_minor_tick_count = y_minor_tick_count;
    }

    @Override
    public void setTickLabelIsVisible(boolean is_tick_label_visible) {
        this.is_tick_label_visible = is_tick_label_visible;
    }

    @Override
    public void setTickLengthX(int x_tick_length) {
        this.x_tick_length = x_tick_length;
    }

    @Override
    public void setTickLengthY(int y_tick_length) {
        this.y_tick_length = y_tick_length;
    }

    @Override
    public void setMinorTickLengthX(int x_minor_tick_length) {
        this.x_minor_tick_length = x_minor_tick_length;
    }

    @Override
    public void setMinorTickLengthY(int y_minor_tick_length) {
        this.y_minor_tick_length = y_minor_tick_length;
    }

    @Override
    public void setVerticalGridLinesVisible(boolean visible) {
        vertical_grid_lines_visible = visible;
    }

    @Override
    public void setHorizontalGridLinesVisible(boolean visible) {
        horizontal_grid_lines_visible = visible;
    }

    @Override
    public void setTickLabelFillX(Color color) {
        x_tick_label_fill_color = color;
    }

    @Override
    public void setTickLabelFillY(Color color) {
        y_tick_label_fill_color = color;
    }

    @Override
    public void setTickLabelGapX(int x_gap) {
        x_tick_label_gap = x_gap;
    }

    @Override
    public void setTickLabelGapY(int y_gap) {
        y_tick_label_gap = y_gap;
    }

    @Override
    public void setTickLabelRotationX(int x_rotation) {
        x_tick_label_rotation = x_rotation;
    }

    @Override
    public void setTickLabelRotationY(int y_rotation) {
        y_tick_label_rotation = y_rotation;
    }

    @Override
    public void setCategoryGap(int gap) {
        category_gap = gap;
    }

    @Override
    public void setAnimatedX(boolean x_animated) {
        this.x_animated = x_animated;
    }

    @Override
    public void setAnimatedY(boolean y_animated) {
        this.y_animated = y_animated;
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.chart.XYChartSettings;
import javafx.geometry.Side;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractXYChartSettingsImpl extends AbstractChartSettingsImpl implements XYChartSettings {

    private Side side_x = Side.BOTTOM;
    private Side side_y = Side.LEFT;
    private String xAxisLabel = "";
    private String yAxisLabel = "";
    private int x_lower_bound;//default to zero
    private int y_lower_bound;//default to zero
    private int x_upper_bound = 100;
    private int y_upper_bound = x_upper_bound;
    private int x_tick_unit = 5;
    private int y_tick_unit = x_tick_unit;
    private int x_minor_tick_count = 5;
    private int y_minor_tick_count = x_minor_tick_count;
    private boolean x_is_tick_label_visible = true;
    private boolean y_is_tick_label_visible = x_is_tick_label_visible;
    private int x_tick_length = 8;
    private int y_tick_length = x_tick_length;
    private int x_minor_tick_length = 5;
    private int y_minor_tick_length = x_minor_tick_length;
    private boolean vertical_grid_lines_visible = true;
    private boolean horizontal_grid_lines_visible = true;
    private Color x_tick_label_fill_color = Color.BLACK;
    private Color y_tick_label_fill_color = Color.BLACK;
    private int x_tick_label_gap = 3;
    private int y_tick_label_gap = x_tick_label_gap;
    private int x_tick_label_rotation;// default is zero
    private int y_tick_label_rotation;// default is zero
    private boolean x_animated = true;
    private boolean y_animated = true;
    private Font x_tick_label_font = Font.font("System", 8);
    private Font y_tick_label_font = x_tick_label_font;
    private boolean x_tick_mark_visible = true;
    private boolean y_tick_mark_visible = x_tick_mark_visible;
    private boolean x_auto_ranging = true;
    private boolean y_auto_ranging = x_auto_ranging;
    private boolean vertical_zero_line_visible = true;
    private boolean horizontal_zero_line_visible = true;
    private boolean alternative_column_fill_visible = false;//unlike row
    private boolean alternative_row_fill_visible = true;//unlike column
    private boolean x_category_gap_start_and_end = true;
    private boolean y_category_gap_start_and_end = x_category_gap_start_and_end;
    private double x_category_start_margin = 5;
    private double y_category_start_margin = x_category_start_margin;
    private double x_category_end_margin = 5;
    private double y_category_end_margin = x_category_end_margin;
    private boolean x_minor_tick_visible = true;
    private boolean y_minor_tick_visible = x_minor_tick_visible;

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
    public void setTickLabelIsVisibleX(boolean x_is_tick_label_visible) {
        this.x_is_tick_label_visible = x_is_tick_label_visible;
    }

    @Override
    public void setTickLabelIsVisibleY(boolean y_is_tick_label_visible) {
        this.y_is_tick_label_visible = y_is_tick_label_visible;
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
    public void setAnimatedX(boolean x_animated) {
        this.x_animated = x_animated;
    }

    @Override
    public void setAnimatedY(boolean y_animated) {
        this.y_animated = y_animated;
    }

    @Override
    public Side getSideX() {
        return side_x;
    }

    @Override
    public Side getSideY() {
        return side_y;
    }

    @Override
    public String getLabelX() {
        return xAxisLabel;
    }

    @Override
    public String getLabelY() {
        return yAxisLabel;
    }

    @Override
    public int getLowerBoundX() {
        return x_lower_bound;
    }

    @Override
    public int getLowerBoundY() {
        return y_lower_bound;
    }

    @Override
    public int getUpperBoundX() {
        return x_upper_bound;
    }

    @Override
    public int getUpperBoundY() {
        return y_upper_bound;
    }

    @Override
    public int getTickUnitX() {
        return x_tick_unit;
    }

    @Override
    public int getTickUnitY() {
        return y_tick_unit;
    }

    @Override
    public int getMinorTickCountX() {
        return x_minor_tick_count;
    }

    @Override
    public int getMinorTickCountY() {
        return y_minor_tick_count;
    }

    @Override
    public boolean getTickLabelIsVisibleX() {
        return x_is_tick_label_visible;
    }

    @Override
    public boolean getTickLabelIsVisibleY() {
        return y_is_tick_label_visible;
    }

    @Override
    public int getTickLengthX() {
        return x_tick_length;
    }

    @Override
    public int getTickLengthY() {
        return y_tick_length;
    }

    @Override
    public int getMinorTickLengthX() {
        return x_minor_tick_length;
    }

    @Override
    public int getMinorTickLengthY() {
        return y_minor_tick_length;
    }

    @Override
    public boolean getVerticalGridLinesVisible() {
        return vertical_grid_lines_visible;
    }

    @Override
    public boolean getHorizontalGridLinesVisible() {
        return horizontal_grid_lines_visible;
    }

    @Override
    public Color getTickLabelFillX() {
        return x_tick_label_fill_color;
    }

    @Override
    public Color getTickLabelFillY() {
        return y_tick_label_fill_color;
    }

    @Override
    public int getTickLabelGapX() {
        return x_tick_label_gap;
    }

    @Override
    public int getTickLabelGapY() {
        return y_tick_label_gap;
    }

    @Override
    public int getTickLabelRotationX() {
        return x_tick_label_rotation;
    }

    @Override
    public int getTickLabelRotationY() {
        return y_tick_label_rotation;
    }

    @Override
    public boolean getAnimatedX() {
        return x_animated;
    }

    @Override
    public boolean getAnimatedY() {
        return y_animated;
    }

    @Override
    public void setTickLabelFontX(Font x_tick_label_font) {
        this.x_tick_label_font = x_tick_label_font;
    }

    @Override
    public Font getTickLabelFontX() {
        return x_tick_label_font;
    }

    @Override
    public void setTickLabelFontY(Font y_tick_label_font) {
        this.y_tick_label_font = y_tick_label_font;
    }

    @Override
    public Font getTickLabelFontY() {
        return y_tick_label_font;
    }

    @Override
    public void setTickMarkVisibleX(boolean x_tick_mark_visible) {
        this.x_tick_mark_visible = x_tick_mark_visible;
    }

    @Override
    public boolean getTickMarkVisibleX() {
        return x_tick_mark_visible;
    }

    @Override
    public void setTickMarkVisibleY(boolean y_tick_mark_visible) {
        this.y_tick_mark_visible = y_tick_mark_visible;
    }

    @Override
    public boolean getTickMarkVisibleY() {
        return y_tick_mark_visible;
    }

    @Override
    public void setAutoRangingX(boolean x_auto_ranging) {
        this.x_auto_ranging = x_auto_ranging;
    }

    @Override
    public boolean getAutoRangingX() {
        return x_auto_ranging;
    }

    @Override
    public void setAutoRangingY(boolean y_auto_ranging) {
        this.y_auto_ranging = y_auto_ranging;
    }

    @Override
    public boolean getAutoRangingY() {
        return y_auto_ranging;
    }

    @Override
    public void setVerticalZeroLineVisible(boolean vertical_zero_line_visible) {
        this.vertical_zero_line_visible = vertical_zero_line_visible;
    }

    @Override
    public boolean getVerticalZeroLineVisible() {
        return vertical_zero_line_visible;
    }

    @Override
    public void setHorizontalZeroLineVisible(boolean horizontal_zero_line_visible) {
        this.horizontal_zero_line_visible = horizontal_zero_line_visible;
    }

    @Override
    public boolean getHorizontalZeroLineVisible() {
        return horizontal_zero_line_visible;
    }

    @Override
    public void setAlternativeColumnFillVisible(boolean alternative_column_fill_visible) {
        this.alternative_column_fill_visible = alternative_column_fill_visible;
    }

    @Override
    public boolean getAlternativeColumnFillVisible() {
        return alternative_column_fill_visible;
    }

    @Override
    public void setAlternativeRowFillVisible(boolean alternative_row_fill_visible) {
        this.alternative_row_fill_visible = alternative_row_fill_visible;
    }

    @Override
    public boolean getAlternativeRowFillVisible() {
        return alternative_row_fill_visible;
    }

    @Override
    public void setCategoryGapStartAndEndX(boolean x_category_gap_start_and_end) {
        this.x_category_gap_start_and_end = x_category_gap_start_and_end;
    }

    @Override
    public boolean getCategoryGapStartAndEndX() {
        return x_category_gap_start_and_end;
    }

    @Override
    public void setCategoryGapStartAndEndY(boolean y_category_gap_start_and_end) {
        this.y_category_gap_start_and_end = y_category_gap_start_and_end;
    }

    @Override
    public boolean getCategoryGapStartAndEndY() {
        return y_category_gap_start_and_end;
    }

    @Override
    public void setCategoryStartMarginX(double x_category_start_margin) {
        this.x_category_start_margin = x_category_start_margin;
    }

    @Override
    public double getCategoryStartMarginX() {
        return x_category_start_margin;
    }

    @Override
    public void setCategoryStartMarginY(double y_category_start_margin) {
        this.y_category_start_margin = y_category_start_margin;
    }

    @Override
    public double getCategoryStartMarginY() {
        return y_category_start_margin;
    }

    @Override
    public void setCategoryEndMarginX(double x_category_end_margin) {
        this.x_category_end_margin = x_category_end_margin;
    }

    @Override
    public double getCategoryEndMarginX() {
        return x_category_end_margin;
    }

    @Override
    public void setCategoryEndMarginY(double y_category_end_margin) {
        this.y_category_end_margin = y_category_end_margin;
    }

    @Override
    public double getCategoryEndMarginY() {
        return y_category_end_margin;
    }

    @Override
    public void setMinorTickVisibleX(boolean x_minor_tick_visible) {
        this.x_minor_tick_visible = x_minor_tick_visible;
    }

    @Override
    public boolean getMinorTickVisibleX() {
        return x_minor_tick_visible;
    }

    @Override
    public void setMinorTickVisibleY(boolean y_minor_tick_visible) {
        this.y_minor_tick_visible = y_minor_tick_visible;
    }

    @Override
    public boolean getMinorTickVisibleY() {
        return y_minor_tick_visible;
    }

}

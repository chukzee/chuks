/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.chart;

import javafx.geometry.Side;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface XYChartSettings extends ChartSettings {

    void setSideX(Side side);

    Side getSideX();

    void setSideY(Side side);

    Side getSideY();

    void setLabelX(String xAxisLabel);

    String getLabelX();

    void setLabelY(String yAxisLabel);

    String getLabelY();

    void setLowerBoundX(int x_lower_bound);

    int getLowerBoundX();

    void setLowerBoundY(int y_lower_bound);

    int getLowerBoundY();

    void setUpperBoundX(int x_upper_bound);

    int getUpperBoundX();

    void setUpperBoundY(int y_upper_bound);

    int getUpperBoundY();

    void setTickUnitX(int x_tick_unit);

    int getTickUnitX();

    void setTickUnitY(int y_tick_unit);

    int getTickUnitY();

    void setMinorTickCountX(int x_minor_tick_count);

    int getMinorTickCountX();

    void setMinorTickCountY(int y_minor_tick_count);

    int getMinorTickCountY();

    void setTickLabelIsVisibleX(boolean x_is_tick_label_visible);

    boolean getTickLabelIsVisibleX();

    void setTickLabelIsVisibleY(boolean y_is_tick_label_visible);

    boolean getTickLabelIsVisibleY();

    void setTickLengthX(int x_tick_length);

    int getTickLengthX();

    void setTickLengthY(int y_tick_length);

    int getTickLengthY();

    void setMinorTickLengthX(int x_minor_tick_length);

    int getMinorTickLengthX();

    void setMinorTickLengthY(int y_minor_tick_length);

    int getMinorTickLengthY();

    void setVerticalGridLinesVisible(boolean visible);

    boolean getVerticalGridLinesVisible();

    void setHorizontalGridLinesVisible(boolean visible);

    boolean getHorizontalGridLinesVisible();

    void setTickLabelFillX(Color color);

    Color getTickLabelFillX();

    void setTickLabelFillY(Color color);

    Color getTickLabelFillY();

    void setTickLabelGapX(int x_gap);

    int getTickLabelGapX();

    void setTickLabelGapY(int y_gap);

    int getTickLabelGapY();

    void setTickLabelRotationX(int x_rotation);

    int getTickLabelRotationX();

    void setTickLabelRotationY(int y_rotation);

    int getTickLabelRotationY();

    void setAnimatedX(boolean x_animated);

    boolean getAnimatedX();

    void setAnimatedY(boolean y_animated);

    boolean getAnimatedY();

    void setTickLabelFontX(Font x_tick_label_font);

    Font getTickLabelFontX();

    void setTickLabelFontY(Font y_tick_label_font);

    Font getTickLabelFontY();

    void setTickMarkVisibleX(boolean x_tick_mark_visible);

    boolean getTickMarkVisibleX();

    void setTickMarkVisibleY(boolean y_tick_mark_visible);

    boolean getTickMarkVisibleY();

    void setAutoRangingX(boolean x_auto_ranging);

    boolean getAutoRangingX();

    void setAutoRangingY(boolean y_auto_ranging);

    boolean getAutoRangingY();

    void setVerticalZeroLineVisible(boolean vertical_zero_line_visible);

    boolean getVerticalZeroLineVisible();

    void setHorizontalZeroLineVisible(boolean horizontal_zero_line_visible);

    boolean getHorizontalZeroLineVisible();

    void setAlternativeColumnFillVisible(boolean alternative_column_fill_visible);

    boolean getAlternativeColumnFillVisible();

    void setAlternativeRowFillVisible(boolean alternative_row_fill_visible);

    boolean getAlternativeRowFillVisible();

    void setCategoryGapStartAndEndX(boolean x_category_gap_start_and_end);

    boolean getCategoryGapStartAndEndX();

    void setCategoryGapStartAndEndY(boolean y_category_gap_start_and_end);

    boolean getCategoryGapStartAndEndY();

    void setCategoryStartMarginX(double x_category_start_margin);

    double getCategoryStartMarginX();

    void setCategoryStartMarginY(double y_category_start_margin);

    double getCategoryStartMarginY();

    void setCategoryEndMarginX(double x_category_end_margin);

    double getCategoryEndMarginX();

    void setCategoryEndMarginY(double y_category_end_margin);

    double getCategoryEndMarginY();

    void setMinorTickVisibleX(boolean x_minor_tick_visible);

    boolean getMinorTickVisibleX();

    void setMinorTickVisibleY(boolean y_minor_tick_visible);

    boolean getMinorTickVisibleY();

}

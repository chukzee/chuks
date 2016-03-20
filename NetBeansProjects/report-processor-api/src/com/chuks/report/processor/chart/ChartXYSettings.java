/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.chart;

import javafx.scene.effect.Effect;
import javafx.scene.paint.Color;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ChartXYSettings extends ChartSettings{
    
    void setSideX(Side side);
    void setSideY(Side side);
    void setLabelX(String xAxisLabel);
    void setLabelY(String yAxisLabel);
    void setLowerBoundX(int x_lower_bound);
    void setLowerBoundY(int y_lower_bound);
    void setUpperBoundX(int x_upper_bound);
    void setUpperBoundY(int y_upper_bound);
    void setTickUnitX(int x_tick_unit);
    void setTickUnitY(int y_tick_unit);
    void setMinorTickCountX(int x_minor_tick_count);
    void setMinorTickCountY(int y_minor_tick_count);
    void setTickLabelIsVisible(boolean is_tick_label_visible);
    void setTickLengthX(int x_tick_length);
    void setTickLengthY(int y_tick_length);
    void setMinorTickLengthX(int x_minor_tick_length);
    void setMinorTickLengthY(int y_minor_tick_length);
    void setVerticalGridLinesVisible(boolean visible);
    void setHorizontalGridLinesVisible(boolean visible);
    void setTickLabelFillX(Color color);
    void setTickLabelFillY(Color color);
    void setTickLabelGapX(int x_gap);
    void setTickLabelGapY(int y_gap);
    void setTickLabelRotationX(int x_rotation);
    void setTickLabelRotationY(int y_rotation);
    void setCategoryGap(int gap);
    void setAnimatedX(boolean x_animated);
    void setAnimatedY(boolean y_animated);

    
}

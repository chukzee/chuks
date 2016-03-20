/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.handler.AreaChartInputHandler;
import com.chuks.report.processor.handler.BubbleChartInputHandler;
import com.chuks.report.processor.handler.ScatterChartInputHandler;
import com.chuks.report.processor.handler.LineChartInputHandler;
import com.chuks.report.processor.handler.PieChartInputHandler;
import com.chuks.report.processor.handler.BarChartInputHandler;
import com.chuks.report.processor.handler.StackedBarChartInputHandler;
import javafx.embed.swing.JFXPanel;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 * @param <T>
 */
public interface ChartProcessor<T> extends UIDBProcessor {

    void loadChart(PieChartInputHandler handler, JFXPanel jfxPanel);

    void loadChart(BarChartInputHandler handler, JFXPanel jfxPanel);

    void loadChart(StackedBarChartInputHandler handler, JFXPanel jfxPanel);

    void loadChart(AreaChartInputHandler handler, JFXPanel jfxPanel);

    void loadChart(BubbleChartInputHandler handler, JFXPanel jfxPanel);

    void loadChart(LineChartInputHandler handler, JFXPanel jfxPanel);

    void loadChart(ScatterChartInputHandler handler, JFXPanel jfxPanel);
}

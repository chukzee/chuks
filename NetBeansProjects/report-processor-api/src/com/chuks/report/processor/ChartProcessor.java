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
import javafx.embed.swing.JFXPanel;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 * @param <T>
 */
public interface ChartProcessor<T> extends UIDBProcessor {

    void loadChart(PieChartInputHandler pieChartInputhandler, JFXPanel jfxPanel);

    void loadChart(BarChartInputHandler barChartInputhandler, JFXPanel jfxPanel);

    void loadChart(AreaChartInputHandler areaChartInputhandler, JFXPanel jfxPanel);

    void loadChart(BubbleChartInputHandler bubbleChartInputhandler, JFXPanel jfxPanel);

    void loadChart(LineChartInputHandler lineChartInputhandler, JFXPanel jfxPanel);

    void loadChart(ScatterChartInputHandler scatterChartInputhandler, JFXPanel jfxPanel);
}

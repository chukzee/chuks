/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.handler.AreaChartInputHandler;
import com.chuks.report.processor.handler.BarChartInputHandler;
import com.chuks.report.processor.ChartProcessor;
import com.chuks.report.processor.handler.PieChartInputHandler;
import com.chuks.report.processor.handler.BubbleChartInputHandler;
import com.chuks.report.processor.handler.LineChartInputHandler;
import com.chuks.report.processor.handler.ScatterChartInputHandler;
import com.chuks.report.processor.util.JDBCSettings;
import javafx.embed.swing.JFXPanel;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */

class ChartProcessorImpl  extends AbstractUIDBProcessor implements ChartProcessor {

    public ChartProcessorImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void loadChart(PieChartInputHandler pieChartInputhandler, JFXPanel jfxPanel) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        
    }

    @Override
    public void loadChart(BarChartInputHandler barChartInputhandler, JFXPanel jfxPanel) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        
    }

    @Override
    public void loadChart(AreaChartInputHandler areaChartInputhandler, JFXPanel jfxPanel) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        
    }

    @Override
    public void loadChart(BubbleChartInputHandler bubbleChartInputhandler, JFXPanel jfxPanel) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        
    }

    @Override
    public void loadChart(LineChartInputHandler lineChartInputhandler, JFXPanel jfxPanel) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        
    }

    @Override
    public void loadChart(ScatterChartInputHandler scatterChartInputhandler, JFXPanel jfxPanel) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        
    }
    
}

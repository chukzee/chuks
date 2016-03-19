/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.ChartProcessor;
import com.chuks.report.processor.FormProcessor;
import com.chuks.report.processor.TableProcessor;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author USER
 */
  class UIProcessorFactory extends AbstractUIProcessorFactory {

    public UIProcessorFactory(JDBCSettings jdbcSettings){
        super(jdbcSettings);
    }
    
    @Override
    public FormProcessor getFormControlsProcessor() {
        return new FormProcessorImpl(jdbcSettings);
    }

    @Override
    public TableProcessor getTableReportProcessor() {
        return new TableReportProcessorImpl(jdbcSettings);
    }

    @Override
    public ChartProcessor getChartReportProcessor() {
        return new ChartProcessorImpl(jdbcSettings);
    }
}

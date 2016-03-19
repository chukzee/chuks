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
abstract class AbstractUIProcessorFactory {

    protected JDBCSettings jdbcSettings = null;

    private AbstractUIProcessorFactory() {
    }

    public AbstractUIProcessorFactory(JDBCSettings jdbcSettings) {
        this.jdbcSettings = jdbcSettings;
    }

    abstract public FormProcessor getFormControlsProcessor();

    abstract public TableProcessor getTableReportProcessor();
    
    abstract public ChartProcessor getChartReportProcessor();

}

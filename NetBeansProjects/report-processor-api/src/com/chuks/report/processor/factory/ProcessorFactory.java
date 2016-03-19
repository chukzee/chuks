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
public class ProcessorFactory {
    
    public static FormProcessor getFormProcessor(JDBCSettings dbsettings){
        return new UIProcessorFactory(dbsettings).getFormControlsProcessor();
    }
    
    public static FormProcessor getFormProcessor(){
        return new UIProcessorFactory(null).getFormControlsProcessor();
    }
    
    public static TableProcessor getTableProcessor(JDBCSettings dbsettings){
        return new UIProcessorFactory(dbsettings).getTableReportProcessor();
    }
    
    public static TableProcessor getTableProcessor(){
        return new UIProcessorFactory(null).getTableReportProcessor();
    }
    
    public static ChartProcessor getChartProcessor(JDBCSettings dbsettings){
        return new UIProcessorFactory(dbsettings).getChartReportProcessor();
    }
    
    public static ChartProcessor getChartProcessor(){
        return new UIProcessorFactory(null).getChartReportProcessor();
    }
    
}

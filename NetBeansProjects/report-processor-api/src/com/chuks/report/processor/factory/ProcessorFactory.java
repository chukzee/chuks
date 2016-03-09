/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

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
    
    public static TableProcessor getTableProcessor(JDBCSettings dbsettings){
        return new UIProcessorFactory(dbsettings).getTableReportProcessor();
    }
}

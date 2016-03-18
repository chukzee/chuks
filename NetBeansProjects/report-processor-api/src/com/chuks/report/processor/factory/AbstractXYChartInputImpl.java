/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract class AbstractXYChartInputImpl extends AbstractChartInputImpl{

    public AbstractXYChartInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }
    
    
}

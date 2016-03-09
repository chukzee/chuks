/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import java.sql.SQLException;
import java.sql.Savepoint;
import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.ActionSQL;
import com.chuks.report.processor.sql.helper.DBDeletor;
import com.chuks.report.processor.sql.helper.DBHelper;
import com.chuks.report.processor.sql.helper.DBInsertor;
import com.chuks.report.processor.sql.helper.DBSelector;
import com.chuks.report.processor.sql.helper.DBUpdater;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
 class ActionSQLImpl extends AbstractUIDBProcessor implements ActionSQL{

    private ActionSQLImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    ActionSQLImpl(DBHelper dbHelper) {
        super(null);
    }
    
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import java.sql.SQLException;
import java.sql.Savepoint;
import javax.swing.JComponent;
import com.chuks.report.processor.entry.FieldType;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author USER
 */
public interface UIDBProcessor<T> extends ActionSQL{

    void setDBSettings(JDBCSettings jdbcSettings);

    JDBCSettings getDBSettings();

    T getValue(JComponent comp, FieldType type);
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.param;

import java.sql.SQLException;
import java.sql.Savepoint;
import com.chuks.report.processor.sql.helper.*;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ActionSQL {

    DBDeletor deleteFrom(String table) throws SQLException;

    DBSelector selectFrom(String table) throws SQLException;

    DBSelector selectDistictFrom(String table) throws SQLException;

    DBUpdater update(String table) throws SQLException;

    DBInsertor insert() throws SQLException;

    void close() throws SQLException;

    void transactionBegins() throws SQLException;

    void transactionEnds() throws SQLException;

    public void commit() throws SQLException;

    public void rollback() throws SQLException;

    public void rollback(Savepoint save_point) throws SQLException;

    public Savepoint setSavepoint() throws SQLException;

    public Savepoint setSavepoint(String name) throws SQLException;

    public DBUpdater update();

    public DBSelector select();

    public DBSelector selectDistinct();

    public DBDeletor delete();

    public JDBCSettings getDBSettings();

}

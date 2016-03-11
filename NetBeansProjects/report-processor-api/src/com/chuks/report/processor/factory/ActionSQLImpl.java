/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.*;
import com.chuks.report.processor.sql.helper.DBDeletor;
import com.chuks.report.processor.sql.helper.DBHelper;
import com.chuks.report.processor.sql.helper.DBInsertor;
import com.chuks.report.processor.sql.helper.DBSelector;
import com.chuks.report.processor.sql.helper.DBUpdater;
import com.chuks.report.processor.util.JDBCSettings;
import java.sql.SQLException;
import java.sql.Savepoint;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ActionSQLImpl implements ActionSQL {

    protected boolean isAutoCommit = true;//default is true
    protected JDBCSettings jdbcSettings;
    protected DBHelper dbHelper;

    public ActionSQLImpl(JDBCSettings jdbcSettings) {
        this.jdbcSettings = jdbcSettings;
        this.dbHelper = new DBHelper(this);
    }

    ActionSQLImpl(DBHelper dbHelper) {
        this.jdbcSettings = dbHelper.getJdbcSetting();
        this.dbHelper = dbHelper;
    }

    @Override
    public void transactionBegins() throws SQLException {
        isAutoCommit = false;
        dbHelper.setAutoCommit(isAutoCommit);
    }

    @Override
    public void transactionEnds() throws SQLException {
        isAutoCommit = true;
        commit();//commit changes
        dbHelper.setAutoCommit(isAutoCommit);
        dbHelper.removeTransantionConnections();
    }

    @Override
    public void commit() throws SQLException {
        dbHelper.commit();
    }

    @Override
    public void rollback() throws SQLException {
        dbHelper.rollback();
    }

    @Override
    public void close() throws SQLException {
        dbHelper.close();
    }

    @Override
    public void rollback(Savepoint save_point) throws SQLException {
        dbHelper.rollback(save_point);
    }

    @Override
    public Savepoint setSavepoint() throws SQLException {
        return dbHelper.setSavepoint();
    }

    @Override
    public Savepoint setSavepoint(String name) throws SQLException {
        return dbHelper.setSavepoint(name);
    }

    @Override
    public DBDeletor deleteFrom(String table) throws SQLException {
        return dbHelper.DBDeletor().from(table);
    }

    @Override
    public DBSelector selectFrom(String table) throws SQLException {
        return dbHelper.DBSelector().from(table);
    }

    @Override
    public DBSelector selectDistictFrom(String table) throws SQLException {
        return dbHelper.DBSelectorDistinct().from(table);
    }

    @Override
    public DBUpdater update(String table) throws SQLException {
        return dbHelper.DBUpdater().table(table);
    }

    @Override
    public DBInsertor insert() {
        return dbHelper.DBInsertor();
    }

    @Override
    public DBUpdater update() {
        return dbHelper.DBUpdater();
    }

    @Override
    public DBSelector select() {
        return dbHelper.DBSelector();
    }

    @Override
    public DBSelector selectDistinct() {
        return dbHelper.DBSelectorDistinct();
    }

    @Override
    public DBDeletor delete() {
        return dbHelper.DBDeletor();
    }

    @Override
    public JDBCSettings getDBSettings() {
        return jdbcSettings;
    }
}

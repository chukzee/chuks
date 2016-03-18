/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.sql.helper;

import java.sql.SQLException;
import org.jooq.DSLContext;
import org.jooq.DeleteWhereStep;
import org.jooq.Record;
import org.jooq.impl.DSL;
import static org.jooq.impl.DSL.table;
import org.jooq.util.mysql.MySQLDSL;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class DBDeletor {
    final DBHelper dBHelper;
    private DSLContext dctx;
    DeleteWhereStep<Record> dws;

    DBDeletor(DBHelper dbHelper) {
        this.dBHelper = dbHelper;
    }
    
    public DBDeletor from(String _table) throws SQLException{
        dBHelper.conn = dBHelper.getConnection(dBHelper.prc.getDBSettings());
        dctx = DSL.using(dBHelper.conn);

        dws = dctx.delete(table(_table));
        return this;
    }

    public DBPartFormer where() {
        return new DBPartFormer(dBHelper, this);
    }
    
    public int executeDelete() throws SQLException {
        return dws.execute();
    }    

}

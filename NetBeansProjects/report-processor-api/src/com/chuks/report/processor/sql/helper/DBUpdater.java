/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.sql.helper;

import java.sql.SQLException;
import java.util.Date;
import javax.swing.JComponent;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.UpdateSetFirstStep;
import org.jooq.UpdateSetMoreStep;
import org.jooq.impl.DSL;
import static org.jooq.impl.DSL.field;
import org.jooq.util.mysql.MySQLDSL;
import com.chuks.report.processor.entry.FieldType;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class DBUpdater {

    private UpdateSetFirstStep<Record> usfs;
    UpdateSetMoreStep<Record> usms;
    private final DBHelper dBHelper;

    public DBUpdater(DBHelper dBHelper) {
        this.dBHelper = dBHelper;
    }

    public DBUpdater table(String table_name) throws SQLException {
        dBHelper.conn = dBHelper.getConnection(dBHelper.prc.getDBSettings());
        DSLContext dctx = DSL.using(dBHelper.conn);
        usfs = dctx.update(org.jooq.impl.DSL.table(table_name));
        return this;
    }

    public DBUpdater set(String column, JComponent comp, FieldType field_ype) {
        usms = usfs.set(field(column), dBHelper.prc.getValue(comp, field_ype));
        return this;
    }

    public DBUpdater set(String column, String value) {
        usms = usfs.set(field(column), value);
        return this;
    }

    public DBUpdater set(String column, int value) {
        usms = usfs.set(field(column), value);
        return this;
    }

    public DBUpdater set(String column, float value) {
        usms = usfs.set(field(column), value);
        return this;
    }

    public DBUpdater set(String column, double value) {
        usms = usfs.set(field(column), value);
        return this;
    }

    public DBUpdater set(String column, Date date) {
        usms = usfs.set(field(column), date);
        return this;
    }

    public DBPartFormer where() {
        return new DBPartFormer(dBHelper, this);
    }
}

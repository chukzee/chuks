/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.sql.helper;

import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import javax.swing.JComponent;
import org.jooq.DSLContext;
import org.jooq.InsertSetMoreStep;
import org.jooq.InsertSetStep;
import org.jooq.Record;
import org.jooq.impl.DSL;
import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.table;
import org.jooq.util.mysql.MySQLDSL;
import com.chuks.report.processor.entry.FieldType;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class DBInsertor {

    Map<String, Object> mapComp = new HashMap();
    InsertSetMoreStep<Record> isms = null;
    private final DBHelper dbHelper;

    DBInsertor(DBHelper dbHelper) {
        this.dbHelper = dbHelper;
    }

    public DBInsertor value(String column, JComponent comp, FieldType field_ype) {
        mapComp.put(column, dbHelper.prc.getValue(comp, field_ype));
        return this;
    }

    public DBInsertor value(String column, Date date) {
        mapComp.put(column, date);
        return this;
    }

    public DBInsertor value(String column, String str) {
        mapComp.put(column, str);
        return this;
    }

    public DBInsertor value(String column, Integer value) {
        mapComp.put(column, value);
        return this;
    }

    public DBInsertor value(String column, Boolean value) {
        mapComp.put(column, value);
        return this;
    }

    public DBInsertor value(String column, Double value) {
        mapComp.put(column, value);
        return this;
    }

    public DBInsertor value(String column, Float value) {
        mapComp.put(column, value);
        return this;
    }

    public void into(String table_name) throws SQLException {
        
        dbHelper.conn = dbHelper.getConnection(dbHelper.prc.getDBSettings());
        dbHelper.conn.setAutoCommit(false);
        DSLContext dctx = DSL.using(dbHelper.conn);

        InsertSetStep<Record> iss = dctx.insertInto(table(table_name));
        /*mapComp.forEach((column, value) -> {
         isms = iss.set(field(column), value);
         });*/
        Set<Map.Entry<String, Object>> entries = mapComp.entrySet();
        for (Map.Entry<String, Object> entry : entries) {
            String column = entry.getKey();
            Object value = entry.getValue();
            isms = iss.set(field(column), value);
        }

        isms.execute();
        //dbHelper.conn.commit();
    }
}

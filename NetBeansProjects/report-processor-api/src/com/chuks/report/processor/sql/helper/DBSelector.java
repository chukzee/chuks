/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.sql.helper;

import java.sql.SQLException;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.GroupField;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.SelectSelectStep;
import org.jooq.UpdateSetMoreStep;
import org.jooq.impl.DSL;
import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.param;
import static org.jooq.impl.DSL.table;
import org.jooq.util.mysql.MySQLDSL;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class DBSelector {

    DSLContext dctx;
    SelectSelectStep<Record> sss;
    UpdateSetMoreStep<Record> usms;
    boolean isDistinct;
    DBHelper dBHelper;

    private DBSelector() {
    }

    public DBSelector(DBHelper dBHelper, boolean isDistinct) {
        this.dBHelper = dBHelper;
        this.isDistinct = isDistinct;
    }

    public DBSelector columns(String... columns) throws SQLException {
        dBHelper.conn = dBHelper.getConnection(dBHelper.prc.getDBSettings());
        dctx = DSL.using(dBHelper.conn);
        
        if (isDistinct) {
            sss = dctx.selectDistinct(toFields(columns));
        } else {
            sss = dctx.select(toFields(columns));
        }
        dBHelper.glb_sss = sss;

        return this;
    }

    public DBPartFormer where() {
        return new DBPartFormer(dBHelper, this);
    }

    public DBSelector from(String table_name) {
        sss.from(table_name);
        return this;
    }

    public JoinSelector newJoin(){
       throw new UnsupportedOperationException("NOT YET IMPLEMENTED - Use from() method and pass the tables to join as parameters e.g table1 as t1, table2 as t2");
       //return new JoinSelector();
    }
    
    public DBSelector join(JoinSelector joinSelector) {        
       throw new UnsupportedOperationException("NOT YET IMPLEMENTED - Use from() method and pass the tables to join as parameters e.g table1 as t1, table2 as t2");
        //return this;
    }

    public DBSelector on(String table_name) {
       throw new UnsupportedOperationException("NOT YEY IMPLEMENT - Use from() method and pass the tables to join as parameters e.g table1 as t1, table2 as t2");
       //return this;
    }

    public DBSelector orderBy(String... columns) {
        sss.orderBy(toFields(columns));
        return this;
    }

    public DBSelector groupBy(String... columns) {
        GroupField[] fields = new GroupField[columns.length];
        for (int i = 0; i < columns.length; i++) {
            fields[i] = field(columns[i]);
        }
        sss.groupBy(fields);
        
        return this;
    }

    public DBSelector having(String sql) {
        sss.having(sql);
        return this;
    }

    public DBSelector having(String sql, Object... bindings) {
        sss.having(sql,bindings);
        return this;
    }

    public DBSelector limit(int numOfRows) {
        sss.limit(numOfRows);
        return this;
    }

    public DBSelector limit(int numOfRows, String bindNumOfRows) {
        sss.limit(param(bindNumOfRows, numOfRows));
        return this;
    }
    
    public DBSelector limit(int offset, int numOfRows) {
        sss.limit(offset, numOfRows);
        return this;
    }  
          
    public DBSelector limit(int offset,String bindOffset,  int numOfRows) {
        sss.limit(param(bindOffset, offset), numOfRows);
        return this;
    }  
          
    public DBSelector limit(int offset,  int numOfRows, String bindNumOfRows) {
        sss.limit(offset, param(bindNumOfRows, numOfRows));
        return this;
    }        
          
    public DBSelector limit(int offset, String bindOffset,  int numOfRows, String bindNumOfRows) {
        sss.limit(param(bindOffset, offset), param(bindNumOfRows, numOfRows));
        return this;
    }        
        
    public Field[] toFields(String... columns) {
        Field[] fields = new Field[columns.length];
        for (int i = 0; i < columns.length; i++) {
            fields[i] = field(columns[i]);
        }
        return fields;
    }

    /*WE DO NOT WANT THIS
     public Map fetchMap(){
     Result rst = sss.fetch();
     return rst.intoMap(rst.fields());
     }*/
    public Object[][] fetchArray() {
        Result rst = sss.fetch();
        return rst.intoArray();
    }
    
    class JoinSelector{
        
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.sql.helper;

import java.sql.SQLException;
import org.jooq.Condition;
import org.jooq.DeleteWhereStep;
import org.jooq.Field;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.UpdateSetMoreStep;
import static org.jooq.impl.DSL.field;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class DBPartFormer {

    private Condition condition;
    private DBSelector dbSelector;
    private DBUpdater dbUpdater;
    UpdateSetMoreStep<Record> usms;
    LogicOp logicOpType = LogicOp.NOTTHING;
    private DBHelper dBHelper;
    private DBDeletor dbDeletor;
    private DeleteWhereStep<Record> dws;

    public DBPartFormer(DBHelper dBHelper, DBSelector dbSelector) {
        this.dBHelper = dBHelper;
        this.dbSelector = dbSelector;
        usms = dbSelector.usms;
    }

    public DBPartFormer(DBHelper dBHelper, DBUpdater dbUpdater) {
        this.dBHelper = dBHelper;
        this.dbUpdater = dbUpdater;
        usms = dbUpdater.usms;

    }

    public DBPartFormer(DBHelper dBHelper, DBDeletor dbDeletor) {
        this.dBHelper = dBHelper;
        this.dbDeletor = dbDeletor;
        dws = dbDeletor.dws;

    }

    public DBPartFormer like(String column, String value) throws SQLException {
        Condition cond = field(column).like(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer likeIgnoreCase(String column, String value) throws SQLException {
        Condition cond = field(column).likeIgnoreCase(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer betweenSymmetric(String column, Object value1, Object value2) throws SQLException {
        Condition cond = field(column).betweenSymmetric(value1, value2);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer betweenSymmetricColumns(String column, String column_compared1, String column_compared2) throws SQLException {
        Condition cond = field(column).betweenSymmetric(field(column_compared1), field(column_compared2));
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer between(String column, Object value1, Object value2) throws SQLException {
        Condition cond = field(column).between(value1, value2);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer betweenColumns(String column, String column_compared1, String column_compared2) throws SQLException {
        Condition cond = field(column).between(field(column_compared1), field(column_compared2));
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer equal(String column, Object value) throws SQLException {
        Condition cond = field(column).equal(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer equalColumn(String column, String column_compared) throws SQLException {
        Condition cond = field(column).equal(field(column_compared));
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer equalIgnoreCase(String column, String value) throws SQLException {
        Condition cond = field(column).equalIgnoreCase(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer greaterOrEqual(String column, Object value) {
        Condition cond = field(column).greaterOrEqual(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer greaterOrEqualColumn(String column, String column_compared) {
        Condition cond = field(column).greaterOrEqual(field(column_compared));
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer greaterThan(String column, Object value) {
        Condition cond = field(column).greaterThan(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer greaterThanColumn(String column, String column_compared) {
        Condition cond = field(column).greaterThan(field(column_compared));
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer lessOrEqual(String column, Object value) {
        Condition cond = field(column).lessOrEqual(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer lessOrEqualColumn(String column, String column_compared) {
        Condition cond = field(column).lessOrEqual(field(column_compared));
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer lessThan(String column, Object value) {
        Condition cond = field(column).lessThan(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer lessThanColumn(String column, String column_compared) {
        Condition cond = field(column).lessThan(field(column_compared));
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer isTrue(String column) {
        Condition cond = field(column).isTrue();
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer isFalse(String column) {
        Condition cond = field(column).isFalse();
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer isNull(String column) {
        Condition cond = field(column).isNull();
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer endsWith(String column, Object value) {
        Condition cond = field(column).endsWith(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer endsWithColumn(String column, String column_compared) {
        Condition cond = field(column).endsWith(field(column_compared));
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer startsWith(String column, Object value) {
        Condition cond = field(column).startsWith(value);
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer startsWithColumn(String column, String column_compared) {
        Condition cond = field(column).startsWith(field(column_compared));
        checkLogicOp(cond);
        return this;
    }

    public DBPartFormer and() throws SQLException {

        if (condition == null || logicOpType != LogicOp.NOTTHING) {
            throw new SQLException("Invalid method call. Method call will result in invalid SQL statement. Method call must follow a relational conditional statement!");
        }

        logicOpType = LogicOp.and;
        return this;
    }

    public DBPartFormer andNot() throws SQLException {
        if (condition == null || logicOpType != LogicOp.NOTTHING) {
            throw new SQLException("Invalid method call. Method call will result in invalid SQL statement. Method call must follow a relational conditional statement!");
        }

        logicOpType = LogicOp.andNot;
        return this;
    }

    public DBPartFormer or() throws SQLException {
        if (condition == null || logicOpType != LogicOp.NOTTHING) {
            throw new SQLException("Invalid method call. Method call will result in invalid SQL statement. Method call must follow a relational conditional statement!");
        }

        logicOpType = LogicOp.or;
        return this;
    }

    public DBPartFormer orNot() throws SQLException {
        if (condition == null || logicOpType != LogicOp.NOTTHING) {
            throw new SQLException("Invalid method call. Method call will result in invalid SQL statement. Method call must follow a relational conditional statement!");
        }

        logicOpType = LogicOp.orNot;
        return this;
    }

    public DBPartFormer not() throws SQLException {
        if (logicOpType != LogicOp.NOTTHING) {
            throw new SQLException("Invalid method call. Method call will result in invalid SQL statement. Method call cannot follow a logical operator!");
        }
        logicOpType = LogicOp.not;
        return this;
    }

    /*WE DO NOT WANT THIS
     public Map fetchMap() throws SQLException {
     Result<Record> rs;
            
     rs = dbSelector.sss.fetch();
     return rs.intoMap(rs.fields());//come back
     }*/
    public Object[][] fetchArray() throws SQLException {
        if (logicOpType != LogicOp.NOTTHING) {
            throw new SQLException("Invalid method call. Method call will result in invalid SQL statement. Method call cannot follow a logical operator!");
        }

        dbSelector.sss.where(dBHelper.glb_condition);
        dBHelper.glb_condition = null;//important! we do not need to set where case again
        Result rst = dbSelector.sss.fetch();
        return rst.intoArray();
    }

    public int executeUpdate() throws SQLException {
        if (logicOpType != LogicOp.NOTTHING) {
            throw new SQLException("Invalid method call. Method call will result in invalid SQL statement. Method call cannot follow a logical operator!");
        }

        usms.where(condition);
        return dbUpdater.usms.execute();
    }
    

    public int executeDelete() throws SQLException {
        if (logicOpType != LogicOp.NOTTHING) {
            throw new SQLException("Invalid method call. Method call will result in invalid SQL statement. Method call cannot follow a logical operator!");
        }

        dws.where(condition);
        return dbDeletor.dws.execute();
    }    

    private void checkLogicOp(Condition cond) {

        switch (logicOpType) {
            case and:
                condition = condition.and(cond);
                break;
            case andNot:
                condition = condition.andNot(cond);
                break;
            case or:
                condition = condition.or(cond);
                break;
            case orNot:
                condition = condition.orNot(cond);
                break;
            case not:
                condition = cond.not();//come back
                break;
            case NOTTHING:
                condition = cond;
                break;
        }

        dBHelper.glb_condition = condition;
        logicOpType = LogicOp.NOTTHING;
    }
}

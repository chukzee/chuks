/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.sql.helper;

import com.chuks.report.processor.param.ActionSQL;
import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import java.sql.Connection;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Savepoint;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.WeakHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sql.DataSource;
import org.jooq.Condition;
import org.jooq.Record;
import org.jooq.SelectSelectStep;
import com.chuks.report.processor.UIDBProcessor;
import com.chuks.report.processor.util.JDBCSettings;
import com.chuks.report.processor.util.NameValue;

/**
 *
 * @author USER
 */
public class DBHelper {

    Connection conn;
    static Map<Integer, DataSource> weakDataSourceMap;
    ActionSQL prc;
    SelectSelectStep<Record> glb_sss;
    Condition glb_condition;
    private boolean autoCommit = true;
    //DO NOT USE CONNECTION POOL BY APACHE - IT GAVE SOME PROBLEMS HERE.
    //IS DB PROCESS WILL RUN ON AWT THREAD , IT OK TO DO WITHOUT POOLING 
    //RATHER WILL ASSIGN CONNECTION FOR EACH DATASOURCE AND REUSE THE CONNECTION.
    static private final Map<Integer, Connection> transactConns = Collections.synchronizedMap(new HashMap());
    static private final Map<Integer, Connection> nonTranConns = Collections.synchronizedMap(new HashMap());
    private final int CONN_VALIDITY_TIMEOUT = 30000;
    private JDBCSettings jdbc_setting;

    static {
        try {
            Class.forName("java.sql.Driver");
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(DBHelper.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    

    private String arrStrAppend(NameValue[] arr) {
        if (arr == null || arr.length == 0) {
            return "";
        }
        StringBuilder str = new StringBuilder();
        for (NameValue arr1 : arr) {
            str.append(arr1);
        }
        return str.toString();
    }

    private DataSource findDataSourceByHash(int hash) {
        if (weakDataSourceMap == null) {
            weakDataSourceMap = Collections.synchronizedMap(new WeakHashMap());
            return null;
        }
        return weakDataSourceMap.get(hash);
    }

    public Connection getConnection(JDBCSettings jdbc_setting) throws SQLException {

        this.jdbc_setting = jdbc_setting;
        //DO NOT USE CONNECTION POOL BY APACHE - IT GAVE SOME PROBLEMS HERE.
        //IS DB PROCESS WILL RUN ON AWT THREAD , IT OK TO DO WITHOUT POOLING 
        //RATHER WILL ASSIGN CONNECTION FOR EACH DATASOURCE AND REUSE THE CONNECTION.
        StringBuilder s = new StringBuilder();

        s.append(jdbc_setting.getUrl())
                .append(jdbc_setting.getUsername())
                .append(jdbc_setting.getPassword())
                .append(arrStrAppend(jdbc_setting.getAdditionSettings()));

        int hash = (s.toString()).hashCode();

        if (!autoCommit) {//is transaction
            Connection tranConn = transactConns.get(hash);
            if (tranConn != null && tranConn.isValid(CONN_VALIDITY_TIMEOUT)) {
                return tranConn;
            }
        } else {
            Connection _conn = nonTranConns.get(hash);
            if (_conn != null && _conn.isValid(CONN_VALIDITY_TIMEOUT)) {
                return _conn;
            }
        }

        DataSource ds = findDataSourceByHash(hash);//find in cache

        try {

            if (ds == null) {
                MysqlDataSource d = new MysqlDataSource();
                d.setURL(jdbc_setting.getUrl());
                d.setUser(jdbc_setting.getUsername());
                d.setPassword(jdbc_setting.getPassword());
                ds = d;
            }
            
            Connection _conn = ds.getConnection();
            
            _conn.setAutoCommit(autoCommit);

            if (!autoCommit) {//transaction
                transactConns.put(hash, _conn);
            } else {
                nonTranConns.put(hash, _conn);
            }
            
            return _conn;//connect
        } catch (SQLException ex) {
            Logger.getLogger(DBHelper.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    public Object[][] fetchArray() {
        if (glb_sss == null) {
            return new Object[][]{};
        }
        if (glb_condition != null) {
            glb_sss.where(glb_condition);
            glb_condition = null;//important! condition is already set so nullify - we do not have to call 'where' clause again
        }

        return glb_sss.fetchArrays();
    }

    public JDBCSettings getJdbcSetting(){
        return this.jdbc_setting;
    }
    
    public String getSelectSQL() {
        return glb_sss == null ? null : this.glb_sss.getSQL();
    }

    public Map getSelectParams() {
        return glb_sss == null ? null : this.glb_sss.getParams();
    }

    public String[] getColumns(boolean isColumnAsIs) throws SQLException {
        ResultSetMetaData m = glb_sss.fetchResultSet().getMetaData();

        String[] cols = new String[m.getColumnCount()];
        for (int i = 0; i < cols.length; i++) {
            //get the column label just in case there is 'AS' clause.
            cols[i] = m.getColumnLabel(i + 1);//since first column is index 1
        }
        if (!isColumnAsIs) {
            for (int i = 0; i < cols.length; i++) {
                cols[i] = cols[i].replace('_', ' ');//remove underscores.
                cols[i] = cols[i].toUpperCase();//change to uppercase.
            }
        }

        return cols;
    }

    public DBHelper(ActionSQL prc) {
        this.prc = prc;
    }

    public DBInsertor DBInsertor() {
        return new DBInsertor(this);
    }

    public DBUpdater DBUpdater() {
        return new DBUpdater(this);
    }

    public DBSelector DBSelector() {
        return new DBSelector(this, false);
    }

    public DBSelector DBSelectorDistinct() {
        return new DBSelector(this, true);
    }

    public DBDeletor DBDeletor() {
        return new DBDeletor(this);
    }

    public void setAutoCommit(boolean autoCommit) throws SQLException {
        this.autoCommit = autoCommit;
        if (conn != null) {
            this.conn.setAutoCommit(autoCommit);
        }
    }

    public void commit() throws SQLException {
        if (conn == null) {
            return;
        }
        this.conn.commit();
    }

    public void rollback() throws SQLException {
        if (conn == null) {
            return;
        }
        this.conn.rollback();
    }

    public void close() throws SQLException {

        if (conn == null) {
            return;
        }
        if (glb_sss != null) {
            glb_sss.close();
        }
        //TODO: Close more abeg o!!!
        if (conn != null) {
            this.conn.close();
        }
    }

    public void rollback(Savepoint save_point) throws SQLException {
        if (conn == null) {
            return;
        }
        this.conn.rollback(save_point);
    }

    public Savepoint setSavepoint() throws SQLException {
        if (conn == null) {
            return null;
        }
        return this.conn.setSavepoint();
    }

    public Savepoint setSavepoint(String name) throws SQLException {
        if (conn == null) {
            return null;
        }
        return this.conn.setSavepoint(name);
    }

    public void removeTransantionConnections() {
        //just clear the map but do not null out. if other transactions remain, the connection will be got from pool
        transactConns.clear();
    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.JDBCSettings;
import chuks.server.ServerObject;
import static chuks.server.http.impl.ServerUtil.close;
import chuks.server.http.sql.SQLResultSetHandler;
import java.sql.Connection;
import java.sql.ParameterMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import javax.sql.DataSource;

/**
 *
 * @author USER
 */
abstract class AbstractServerObject<T> implements ServerObject{
    
    private boolean pmdKnownBroken;//refer to apache commons AbstractQueryRunner class for understanding
   
    protected abstract Connection getConnection(JDBCSettings jdbc_setting) throws SQLException ;
    
    @Override
    public T sqlQuery(JDBCSettings jdbc_setting, String query, SQLResultSetHandler handler, String... params) throws SQLException {
        //Technique to be considered    
            
        PreparedStatement stmt = null;
        T result = null;
        ResultSet resultSet = null;
        Connection conn = getConnection(jdbc_setting);
        
        try {
            stmt = conn.prepareStatement(query);
            this.fillStatement(stmt, params);
            result = (T) handler.handle(stmt.executeQuery());
        } catch (SQLException e) {
            throw e;
        } finally {
            close(resultSet);
            close(stmt);
            close(conn);
        }

        return result;    
    }

    @Override
    public T sqlInsert(JDBCSettings jdbc_setting, String sql, SQLResultSetHandler handler, String... params) throws SQLException {
        //Technique to be considered    
            
        PreparedStatement stmt = null;
        T generatedKeys = null;
        ResultSet resultSet = null;
        Connection conn = getConnection(jdbc_setting);
        
        try {
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            this.fillStatement(stmt, params);
            stmt.executeUpdate();
            resultSet = stmt.getGeneratedKeys();
            generatedKeys =  (T) handler.handle(resultSet);
        } catch (SQLException e) {
            throw e;
        } finally {
            close(resultSet);
            close(stmt);
            close(conn);
        }

        return generatedKeys;
    }
    
   
    
    @Override
    public int sqlUpudate(JDBCSettings jdbc_setting, String sql, String... params)  throws SQLException {

        PreparedStatement stmt = null;
        int rows = 0;

        Connection conn = getConnection(jdbc_setting);
        
        try {
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            this.fillStatement(stmt, params);
            rows = stmt.executeUpdate();

        } catch (SQLException e) {
            throw e;

        } finally {
            close(stmt);
            close(conn);
        }

        return rows;
    }
    
    //apache commons
    private void fillStatement(PreparedStatement stmt, String... params)
            throws SQLException {

        // check the parameter count, if we can
        ParameterMetaData pmd = null;
        if (!pmdKnownBroken) {
            pmd = stmt.getParameterMetaData();
            int stmtCount = pmd.getParameterCount();
            int paramsCount = params == null ? 0 : params.length;

            if (stmtCount != paramsCount) {
                throw new SQLException("Wrong number of parameters: expected "
                        + stmtCount + ", was given " + paramsCount);
            }
        }

        // nothing to do here
        if (params == null) {
            return;
        }

        for (int i = 0; i < params.length; i++) {
            if (params[i] != null) {
                stmt.setObject(i + 1, params[i]);
            } else {
                // VARCHAR works with many drivers regardless
                // of the actual column type. Oddly, NULL and
                // OTHER don't work with Oracle's drivers.
                int sqlType = Types.VARCHAR;
                if (!pmdKnownBroken) {
                    try {
                        /*
                         * It's not possible for pmdKnownBroken to change from
                         * true to false, (once true, always true) so pmd cannot
                         * be null here.
                         */
                        sqlType = pmd.getParameterType(i + 1);
                    } catch (SQLException e) {
                        pmdKnownBroken = true;
                    }
                }
                stmt.setNull(i + 1, sqlType);
            }
        }
    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.sql;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author USER
 */
public interface SQLResultSetHandler <T>{
    
    public T handle(ResultSet rs) throws SQLException ;
}

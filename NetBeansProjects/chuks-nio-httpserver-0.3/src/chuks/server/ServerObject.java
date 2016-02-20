/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

import chuks.server.cache.EntryType;
import chuks.server.cache.ICacheProperties;
import chuks.server.cache.IEntryAttributes;
import chuks.server.http.sql.SQLResultSetHandler;
import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.sql.SQLException;
import java.util.Map;
import java.util.Properties;
import org.json.JSONObject;

/**
 *
 * @author USER
 * @param <T>
 */
public interface ServerObject<T> {

    public void echo(String echo);

    public void echo(JSONObject echo);

    public void pdf(byte[] pdf_data);

    public void pdf(File pdf_fle);

    public void outputErrorToWeb(Exception ex);

    public void createCacheRegion(String region_name, ICacheProperties config);

    public void putCache(Serializable key, Serializable value) throws IOException;

    public void putCache(String region_name, Serializable key, Serializable value) throws IOException;

    public void putCache(Serializable key, Serializable value, IEntryAttributes attr) throws IOException;

    public void putCache(String region_name, Serializable key, Serializable value, IEntryAttributes attr) throws IOException;

    public Object getCache(Serializable key);

    public Object getCache(String regon_name, Serializable key);

    public Map getMatchingCache(String pattern);
    
    public Map getMatchingCache(String region_name, String pattern);

    public void removeCache(Serializable key);

    public void removeCache(String regon_name, Serializable key);

    public void removeAllCache() throws IOException ;

    public void removeAllCache(String regon_name) throws IOException ;
    
    public HttpSession getSession();

    public <T> T sqlQuery(JDBCSettings jdbc_setting, String sql, SQLResultSetHandler<T> handler, String... params) throws SQLException;

    public int sqlUpudate(JDBCSettings jdbc_setting, String sql, String... params) throws SQLException;

    public <T> T sqlInsert(JDBCSettings jdbc_setting, String sql, SQLResultSetHandler<T> handler, String... params) throws SQLException;

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

import chuks.server.cache.EntryType;
import chuks.server.http.sql.SQLResultSetHandler;
import java.io.File;
import java.io.Serializable;
import java.sql.SQLException;
import java.util.Properties;
import org.json.JSONObject;

/**
 *
 * @author USER
 * @param <T>
 */
public interface ServerObject <T>{  
    
    public void echo(String echo);
    public void echo(JSONObject echo);
    public void pdf(byte[] pdf_data);
    public void pdf(File pdf_fle);
    public void outputErrorToWeb(Exception ex);

    public void createCacheRegion(String region_name, Properties config);
 
    public void putCache(Serializable key, Serializable value, EntryType entry_type);
    public void putCache(Serializable key, Serializable value, int time_to_live_in_secs, EntryType entry_type);
    public void putCache(Serializable key, Serializable value, int time_to_live_in_secs, int max_idle_time_in_secs, EntryType entry_type);   
    public void putCache(String region_name, Serializable key, Serializable value, EntryType entry_type);
    public void putCache(String region_name, Serializable key, Serializable value, int time_to_live_in_secs, EntryType entry_type);
    public void putCache(String region_name, Serializable key, Serializable value, int time_to_live_in_secs, int max_idle_time_in_secs, EntryType entry_type);
        
    public Object getCache(Object key);    
    public Object getCache(String regon_name, Object key);

    public HttpSession getSession();
    public <T> T sqlQuery(JDBCSettings jdbc_setting, String sql, SQLResultSetHandler<T> handler, String... params) throws SQLException ;
    public int sqlUpudate(JDBCSettings jdbc_setting, String sql, String... params) throws SQLException ;
    public <T> T sqlInsert(JDBCSettings jdbc_setting, String sql, SQLResultSetHandler<T> handler, String... params) throws SQLException ;

}

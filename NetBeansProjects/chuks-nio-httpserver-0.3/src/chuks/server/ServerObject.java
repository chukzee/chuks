/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

import chuks.server.http.sql.SQLResultSetHandler;
import java.io.File;
import java.io.Serializable;
import java.sql.SQLException;
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
    
    public void putMmemoryCache(Object key, Object value);
    public void putMmemoryCache(Serializable key, Serializable value, int time_to_live_in_ms);
    public void putMmemoryCache(Serializable key, Serializable value, int time_to_live_in_ms, int max_idle_time_in_ms);
    public void putMmemoryCache(String region_name, Serializable key, Serializable value);
    public void putMmemoryCache(String region_name, Serializable key, Serializable value, int time_to_live_in_ms);
    public void putMmemoryCache(String region_name, Serializable key, Serializable value, int time_to_live_in_ms, int max_idle_time_in_ms);
    
    public void putDiskCache(Serializable key, Serializable value);
    public void putDiskCache(Serializable key, Serializable value, int time_to_live_in_ms);
    public void putDiskCache(Serializable key, Serializable value, int time_to_live_in_ms, int max_idle_time_in_ms);
    public void putDiskCache(String region_name, Serializable key, Serializable value);
    public void putDiskCache(String region_name, Serializable key, Serializable value, int time_to_live_in_ms);
    public void putDiskCache(String region_name, Serializable key, Serializable value, int time_to_live_in_ms, int max_idle_time_in_ms);
    
    public void putRemoteDiskCache(Serializable key, Serializable value);
    public void putRemoteDiskCache(Serializable key, Serializable value, int time_to_live_in_ms);
    public void putRemoteDiskCache(Serializable key, Serializable value, int time_to_live_in_ms, int max_idle_time_in_ms);
    public void putRemoteDiskCache(String region_name, Serializable key, Serializable value);
    public void putRemoteDiskCache(String region_name, Serializable key, Serializable value, int time_to_live_in_ms);
    public void putRemoteDiskCache(String region_name, Serializable key, Serializable value, int time_to_live_in_ms, int max_idle_time_in_ms);
    
    public void putRemoteMemoryCache(Serializable key, Serializable value);
    public void putRemoteMemoryCache(Serializable key, Serializable value, int time_to_live_in_ms);
    public void putRemoteMemoryCache(Serializable key, Serializable value, int time_to_live_in_ms, int max_idle_time_in_ms);
    public void putRemoteMemoryCache(String region_name, Serializable key, Serializable value);
    public void putRemoteMemoryCache(String region_name, Serializable key, Serializable value, int time_to_live_in_ms);
    public void putRemoteMemoryCache(String region_name, Serializable key, Serializable value, int time_to_live_in_ms, int max_idle_time_in_ms);
    
    public Object getMemoryCache(Object key);    
    public Object getDiskCache(Serializable key);
    public Object getRemoteMemoryCache(Serializable key);    
    public Object getRemoteDiskCache(Serializable key);  
    
    public HttpSession getSession();
    public <T> T sqlQuery(JDBCSettings jdbc_setting, String sql, SQLResultSetHandler<T> handler, String... params) throws SQLException ;
    public int sqlUpudate(JDBCSettings jdbc_setting, String sql, String... params) throws SQLException ;
    public <T> T sqlInsert(JDBCSettings jdbc_setting, String sql, SQLResultSetHandler<T> handler, String... params) throws SQLException ;

}

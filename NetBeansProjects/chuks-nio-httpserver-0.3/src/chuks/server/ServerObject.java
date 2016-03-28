/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

import chuks.server.api.html.TagCreator;
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

    /**
     * Send data to the client.
     *
     * @param echo string data to send
     */
    public void echo(String echo);

    /**
     * Send data to the client.
     *
     * @param echo JSON data to send
     */
    public void echo(JSONObject echo);

    /**
     * Send data to the client via a selected connection session using the
     * specified session id.
     *
     * @param session_id session id for locating the session through which data
     * will be sent.
     * @param echo JSON data to send
     */
    public void echo(String session_id, String echo);

    /**
     * Send data to the client via a selected connection session using the
     * specified session id.
     *
     * @param session_id session id for locating the session through which data
     * will be sent.
     * @param echo JSON data to send
     */
    public void echo(String session_id, JSONObject echo);

    /**
     * Send to data client in PDF format
     *
     * @param pdf_data PDF raw data in bytes
     */
    public void pdf(byte[] pdf_data);

    /**
     * Send to data client in PDF format.
     *
     * @param pdf_fle PDF file
     */
    public void pdf(File pdf_fle);

    /**
     * Send to data client in PDF format via a selected connection session using
     * the specified session id.
     *
     * @param session_id session id for locating the session through which data
     * will be sent.
     * @param pdf_data pdf raw data in bytes
     */
    public void pdf(String session_id, byte[] pdf_data);

    /**
     * Send to data client in PDF format via a selected connection session using
     * the specified session id.
     *
     * @param session_id session id for locating the session through which data
     * will be sent.
     * @param pdf_fle PDF file
     */
    public void pdf(String session_id, File pdf_fle);

    /**
     * Use for outputting Stack trace error to the client
     * @param ex 
     */
    public void outputErrorToWeb(Exception ex);

    public void createCacheRegion(String region_name, ICacheProperties config);

    public void putCache(Serializable key, Serializable value) throws IOException;

    public void putRgnCache(String region_name, Serializable key, Serializable value) throws IOException;

    public void putCache(Serializable key, Serializable value, IEntryAttributes attr) throws IOException;

    public void putRgnCache(String region_name, Serializable key, Serializable value, IEntryAttributes attr) throws IOException;

    public void dcou(Serializable key, Serializable value);

    public void dcou(String region_name, Serializable key, Serializable value);

    public Object getCache(Serializable key);

    public Object getRgnCache(String region_name, Serializable key);

    public Map getMatchingCache(String pattern);

    public Map getMatchingCache(String region_name, String pattern);

    public void removeCache(Serializable key);

    public void removeRgnCache(String region_name, Serializable key);

    public void removeAllCache() throws IOException;

    public void removeAllRgnCache(String region_name) throws IOException;

    public HttpSession getSession();

    public <T> T sqlQuery(JDBCSettings jdbc_setting, String sql, SQLResultSetHandler<T> handler, String... params) throws SQLException;

    public int sqlUpudate(JDBCSettings jdbc_setting, String sql, String... params) throws SQLException;

    public <T> T sqlInsert(JDBCSettings jdbc_setting, String sql, SQLResultSetHandler<T> handler, String... params) throws SQLException;

    static class HtmlTag extends TagCreator {
    }
}

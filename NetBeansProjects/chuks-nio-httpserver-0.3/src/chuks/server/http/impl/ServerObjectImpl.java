/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.Distributed;
import chuks.server.HttpSession;
import chuks.server.JDBCSettings;
import chuks.server.SimpleHttpServerException;
import chuks.server.cache.ICacheProperties;
import chuks.server.cache.IEntryAttributes;
import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.Serializable;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collections;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.WeakHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NameNotFoundException;
import javax.naming.NamingException;
import javax.sql.DataSource;
import org.apache.commons.dbcp2.ConnectionFactory;
import org.apache.commons.dbcp2.DriverManagerConnectionFactory;
import org.apache.commons.dbcp2.PoolableConnection;
import org.apache.commons.dbcp2.PoolableConnectionFactory;
import org.apache.commons.dbcp2.PoolingDataSource;
import org.apache.commons.jcs.engine.ElementAttributes;
import org.apache.commons.pool2.ObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.json.JSONObject;
import static chuks.server.http.impl.ServerCache.*;
import java.util.HashMap;
import org.apache.commons.jcs.engine.CacheElement;
import org.apache.commons.jcs.engine.behavior.ICacheElement;
import org.apache.commons.jcs.engine.behavior.IElementAttributes;
import org.apache.commons.jcs.engine.control.CompositeCache;

/**
 *
 * @author USER
 */
class ServerObjectImpl<K, V> extends AbstractServerObject {

    private StringBuilder html_buff;
    private byte[] pdf_buff;
    private Exception exception;
    private final Map<String, String> cookieMap;
    private HttpSession session;
    private final String sessionID;
    static private Map<Integer, DataSource> weakDataSourceMap;//REMIND: synchronization

    ServerObjectImpl(Map cookieMap, String sessionID) {
        this.cookieMap = cookieMap;
        this.sessionID = sessionID;

    }

    @Override
    public void echo(String echo) {
        if (html_buff == null) {
            html_buff = new StringBuilder();
        }
        html_buff.append(echo);
    }

    @Override
    public void echo(JSONObject echo) {
        if (html_buff == null) {
            html_buff = new StringBuilder();
        }
        html_buff.append(echo);
    }

    StringBuilder getHtml() {
        return html_buff;
    }

    Exception getError() {
        return exception;
    }

    byte[] getPdf() {
        return pdf_buff;
    }

    private void validatePdf() throws SimpleHttpServerException {
        if (html_buff != null) {
            if (html_buff.length() > 0) {
                throw new SimpleHttpServerException("data corruption - html mixed with pdf");
            }
        }
        if (pdf_buff != null) {
            if (pdf_buff.length > 0) {
                throw new SimpleHttpServerException("data corruption - pdf mixed with pdf");
            }
        }
    }

    @Override
    public void pdf(byte[] pdf_data) {
        try {
            validatePdf();
            this.pdf_buff = pdf_data;
        } catch (SimpleHttpServerException ex) {
            exception = new SimpleHttpServerException(ex.getMessage());
        }

    }

    @Override
    public void pdf(File pdf_fle) {

        FileInputStream fin = null;
        try {
            validatePdf();

            fin = new FileInputStream(pdf_fle);
            pdf_buff = new byte[(int) pdf_fle.length()];
            int byteRead = fin.read(pdf_buff);
            int offset = 0;
            while (byteRead > -1) {
                byteRead = fin.read(pdf_buff, offset, byteRead);
                offset += byteRead;
            }
        } catch (IOException | SimpleHttpServerException ex) {
            exception = new SimpleHttpServerException(ex.getMessage());
        } finally {
            try {
                if (fin != null) {
                    fin.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(ServerObjectImpl.class.getName()).log(Level.SEVERE, null, ex);
            }

        }
    }

    @Override
    public void outputErrorToWeb(Exception ex) {
        exception = ex;
    }

    @Override
    public HttpSession getSession() {
        return session;
    }

    StringBuilder getSessionCookies() {
        Set<Map.Entry<String, String>> s = cookieMap.entrySet();
        Iterator<Map.Entry<String, String>> i = s.iterator();
        StringBuilder cookie = new StringBuilder();
        cookie.append("sessionToken").append("=").append(sessionID).append("; ");
        while (i.hasNext()) {
            Map.Entry<String, String> e = i.next();
            cookie.append(e.getKey()).append("=").append(e.getValue()).append("; ");
        }

        return cookie;
    }

    /**
     * Get a connection pool DataSource using apache. Apache connection pool is
     * by far better than that of JDBC.
     *
     * @param connectURI
     * @param username
     * @param password
     * @return
     */
    public DataSource getConnectionPoolDataSource(String connectURI, String username, String password, NameValue[] additionalProperities) {
        //
        // First, we'll create a ConnectionFactory that the
        // pool will use to create Connections.
        // We'll use the DriverManagerConnectionFactory,
        // using the connect string
        //
        ConnectionFactory connectionFactory;
        if (additionalProperities == null) {
            connectionFactory = new DriverManagerConnectionFactory(connectURI, username, password);

        } else {
            Properties p = new Properties();
            p.put("user", username);//yes user
            p.put("password", password);
            for (NameValue additionalProperity : additionalProperities) {
                p.put(additionalProperity.getName(), additionalProperity.getValue());
            }
            connectionFactory = new DriverManagerConnectionFactory(connectURI, p);
        }
        //
        // Next we'll create the PoolableConnectionFactory, which wraps
        // the "real" Connections created by the ConnectionFactory with
        // the classes that implement the pooling functionality.
        //
        PoolableConnectionFactory poolableConnectionFactory = new PoolableConnectionFactory(connectionFactory, null);

        poolableConnectionFactory.setPoolStatements(true);//chuks added

        //
        // Now we'll need a ObjectPool that serves as the
        // actual pool of connections.
        //
        // We'll use a GenericObjectPool instance, although
        // any ObjectPool implementation will suffice.
        //
        ObjectPool<PoolableConnection> connectionPool = new GenericObjectPool<>(poolableConnectionFactory);

        // Set the factory's pool property to the owning pool
        poolableConnectionFactory.setPool(connectionPool);

        //
        // Finally, we create the PoolingDriver itself,
        // passing in the object pool we created.
        //
        return new PoolingDataSource<>(connectionPool);
    }

    /**
     *
     * @deprecated jdbc connection pool did not work for me - I have switched to
     * Apache.
     *
     * @param bind_name
     * @param host
     * @param port
     * @param dbname
     * @param username
     * @param password
     * @return
     */
    private DataSource initJNDIDatasource(String bind_name,
            String host,
            int port,
            String dbname,
            String username,
            String password) {

        File[] roots = File.listRoots();

        Hashtable env = new Hashtable();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.fscontext.RefFSContextFactory");
        env.put(Context.PROVIDER_URL, "file:" + "/jdbc/");
        Context ctx = null;
        DataSource ds = null;
        try {

            ctx = new InitialContext(env);
            ds = (DataSource) ctx.lookup(bind_name);

        } catch (NameNotFoundException ex) {
            File f = new File(roots[0] + "jdbc" + "/");

            if (!f.isDirectory()) {
                boolean result = f.mkdir();

                System.out.println(result);

                try {
                    ctx = new InitialContext(env);
                    System.err.println("created path: " + roots[0] + "jdbc" + "/");
                } catch (NamingException ex1) {
                    Logger.getLogger(DataSource.class.getName()).log(Level.SEVERE, null, ex1);
                }
            }
            MysqlDataSource mysql_ds = new MysqlDataSource();//using database for connection pooling
            mysql_ds.setServerName(host);
            mysql_ds.setPort(port);//default is 3306
            mysql_ds.setDatabaseName(dbname);
            mysql_ds.setUser(username);
            mysql_ds.setPassword(password);
            ds = mysql_ds;

            try {
                ctx.rebind(bind_name, ds);
                System.err.println("created bind for " + bind_name);
            } catch (NamingException ex1) {
                Logger.getLogger(ServerObjectImpl.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } catch (NamingException ex) {
            Logger.getLogger(ServerObjectImpl.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (ctx != null) {
                try {
                    ctx.close();
                } catch (NamingException ex) {
                }
            }
        }

        return ds;
    }

    @Override
    protected Connection getConnection(JDBCSettings jdbc_setting) throws SQLException {

        StringBuilder s = new StringBuilder();

        s.append(jdbc_setting.getUrl())
                .append(jdbc_setting.getUsername())
                .append(jdbc_setting.getPassword())
                .append(arrStrAppend(jdbc_setting.getAdditionSettings()));

        int hash = (s.toString()).hashCode();

        DataSource ds = findDataSourceByHash(hash);//find in cache
        try {
            if (ds != null) {
                return ds.getConnection();//connect
            }
            //create new one
            ds = getConnectionPoolDataSource(jdbc_setting.getUrl(), jdbc_setting.getUsername(), jdbc_setting.getPassword(), jdbc_setting.getAdditionSettings());
            if (ds != null) {
                weakDataSourceMap.put(hash, ds);//store in cache
                return ds.getConnection();//connect
            }
        } catch (SQLException ex) {
            Logger.getLogger(ServerObjectImpl.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
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

    @Override
    public void putCache(Serializable key, Serializable value) throws IOException {

        if (key == null) {
            throw new IllegalArgumentException("Cache key must not be null");
        }

        if (value == null) {
            throw new IllegalArgumentException("Cache value must not be null");
        }

        CacheElement ce = new CacheElement(jcsDefaultCache.getCacheName(), key, value);
        IElementAttributes cattr = jcsDefaultCache.getElementAttributes();
        ce.setElementAttributes(cattr);
        jcsDefaultCache.localUpdate(ce);//we are not intrested in JCS remote implementation - we've got ours

        if (defaultEntryAttr.isDistributed()) {
            RemoteCachePacket rmtEntry = new RemoteCachePacket(key, value,
                    SimpleHttpServer.getStrCacheSockAddr(), defaultEntryAttr);
            rmtEntry.setCacheRegionName(jcsDefaultCache.getCacheName());
            TCPCacheTransport.enqueueCache(rmtEntry);
        }

    }

    @Override
    public void putCache(Serializable key, Serializable value, IEntryAttributes attr) throws IOException {

        if (key == null) {
            throw new IllegalArgumentException("Cache key must not be null");
        }

        if (value == null) {
            throw new IllegalArgumentException("Cache value must not be null");
        }

        ElementAttributes elem_attr = new ElementAttributes();

        elem_attr.setIdleTime(attr.getMaxIdleTimeInSeconds());
        elem_attr.setMaxLife(attr.getTimeToLiveInSeconds());
        elem_attr.setIsSpool(attr.isSpool());
        elem_attr.setIsEternal(attr.isEternal());

        CacheElement ce = new CacheElement(jcsDefaultCache.getCacheName(), key, value);

        ce.setElementAttributes(elem_attr);

        jcsDefaultCache.localUpdate(ce);//we are not intrested in JCS remote implementation - we've got ours

        if (attr.isDistributed()) {
            RemoteCachePacket rmtEntry = new RemoteCachePacket(key, value,
                    SimpleHttpServer.getStrCacheSockAddr(), attr);
            rmtEntry.setCacheRegionName(jcsDefaultCache.getCacheName());
            TCPCacheTransport.enqueueCache(rmtEntry);
        }

    }

    @Override
    public void putCache(String region_name, Serializable key, Serializable value) throws IOException {

        if (key == null) {
            throw new IllegalArgumentException("Cache key must not be null");
        }

        if (value == null) {
            throw new IllegalArgumentException("Cache value must not be null");
        }

        CompositeCache cache;
        if (region_name == null) {
            cache = jcsDefaultCache;
        } else {
            cache = cMgr.getCache(region_name);
        }

        CacheElement ce = new CacheElement(region_name, key, value);
        IElementAttributes cattr = cache.getElementAttributes();
        ce.setElementAttributes(cattr);
        cache.localUpdate(ce);//we are not intrested in JCS remote implementation - we've got ours

        if (cattr != null && cattr.getIsRemote()) {
            RemoteCachePacket rmtEntry = new RemoteCachePacket(key, value,
                    SimpleHttpServer.getStrCacheSockAddr(), null);
            rmtEntry.setCacheRegionName(region_name);
            TCPCacheTransport.enqueueCache(rmtEntry);
        }
    }

    @Override
    public void putCache(String region_name, Serializable key, Serializable value, IEntryAttributes attr) throws IOException {

        if (key == null) {
            throw new IllegalArgumentException("Cache key must not be null");
        }

        if (value == null) {
            throw new IllegalArgumentException("Cache value must not be null");
        }

        CompositeCache cache;
        if (region_name == null) {
            cache = jcsDefaultCache;
        } else {
            cache = cMgr.getCache(region_name);
        }

        ElementAttributes elem_attr = new ElementAttributes();
        elem_attr.setIdleTime(attr.getMaxIdleTimeInSeconds());
        elem_attr.setMaxLife(attr.getTimeToLiveInSeconds());
        elem_attr.setIsSpool(attr.isSpool());
        elem_attr.setIsEternal(attr.isEternal());
        //elem_attr.setSize(size);//come back

        CacheElement ce = new CacheElement(region_name, key, value);
        IElementAttributes cattr = cache.getElementAttributes();
        ce.setElementAttributes(cattr);
        cache.localUpdate(ce);//we are not intrested in JCS remote implementation - we've got ours

        if (attr.isDistributed()) {
            RemoteCachePacket rmtEntry = new RemoteCachePacket(key, value,
                    SimpleHttpServer.getStrCacheSockAddr(), attr);
            rmtEntry.setCacheRegionName(region_name);
            TCPCacheTransport.enqueueCache(rmtEntry);
        }

    }

    @Override
    public Object getCache(Serializable key) {
        ICacheElement element = jcsDefaultCache.localGet(key);
        return (element != null) ? element.getVal() : null;//we are not intrested in JCS remote implementation - we've got ours
    }

    @Override
    public Object getCache(String region_name, Serializable key) {
        CompositeCache cache = cMgr.getCache(region_name);
        ICacheElement element = cache.localGet(key);
        return (element != null) ? element.getVal() : null;//we are not intrested in JCS remote implementation - we've got ours
    }

    @Override
    public void createCacheRegion(String region_name, ICacheProperties config) {
        newRegion(config);
    }

    @Override
    public Map getMatchingCache(String pattern) {
        return getMatchingCache(jcsDefaultCache, pattern);
    }

    @Override
    public Map getMatchingCache(String region_name, String pattern) {
        if (region_name == null) {
            return getMatchingCache(jcsDefaultCache, pattern);
        }
        CompositeCache cache = cMgr.getCache(region_name);
        return getMatchingCache(cache, pattern);
    }

    @Override
    public void dcou(Serializable key, Serializable value) {
        ICacheElement<Object, Object> element = jcsDefaultCache.localGet(key);
        if (element != null) {
            Distributed d = (Distributed) element.getVal();
            d.distributedCall(value);
        }
        RemoteCachePacket rmtEntry = new RemoteCachePacket(key, value,
                SimpleHttpServer.getStrCacheSockAddr(), null);
        rmtEntry.setCacheRegionName(jcsDefaultCache.getCacheName());
        rmtEntry.distributedCall(true);
        TCPCacheTransport.enqueueCache(rmtEntry);
    }

    @Override
    public void dcou(String region_name, Serializable key, Serializable value) {
        CompositeCache cache = cMgr.getCache(region_name);
        ICacheElement element = cache.localGet(key);
        if (element != null) {
            Distributed d = (Distributed) element.getVal();
            d.distributedCall(value);
        }
        RemoteCachePacket rmtEntry = new RemoteCachePacket(key, value,
                SimpleHttpServer.getStrCacheSockAddr(), null);
        rmtEntry.setCacheRegionName(region_name);
        rmtEntry.distributedCall(true);
        TCPCacheTransport.enqueueCache(rmtEntry);
    }

    private Map getMatchingCache(CompositeCache cache, String pattern) {
        HashMap unwrappedResults = new HashMap();
        Map wrappedResults = cache.getMatching(pattern);
        if (wrappedResults != null) {
            for (Object entry : wrappedResults.entrySet()) {
                Map.Entry en = (Map.Entry) entry;
                ICacheElement element = (ICacheElement) en.getValue();
                if (element != null) {
                    unwrappedResults.put(en.getKey(), element.getVal());
                }
            }
        }
        return unwrappedResults;
    }

    @Override
    public void removeCache(Serializable key) {
        removeCache(jcsDefaultCache, key);
    }

    @Override
    public void removeCache(String region_name, Serializable key) {
        if (region_name == null) {
            removeCache(jcsDefaultCache, key);
            return;
        }
        CompositeCache cache = cMgr.getCache(region_name);
        removeCache(cache, key);
    }

    private void removeCache(CompositeCache cache, Serializable key) {
        cache.localRemove(key);
        RemoteCachePacket rmtEntry = new RemoteCachePacket(key,
                SimpleHttpServer.getStrCacheSockAddr());
        rmtEntry.setCacheRegionName(cache.getCacheName());
        TCPCacheTransport.enqueueCache(rmtEntry);
    }

    @Override
    public void removeAllCache() throws IOException {
        removeAllCache(jcsDefaultCache);
    }

    @Override
    public void removeAllCache(String region_name) throws IOException {
        if (region_name == null) {
            removeAllCache(jcsDefaultCache);
            return;
        }
        CompositeCache cache = cMgr.getCache(region_name);
        removeAllCache(cache);
    }

    private void removeAllCache(CompositeCache cache) throws IOException {
        cache.localRemoveAll();
        RemoteCachePacket rmtEntry = new RemoteCachePacket(
                SimpleHttpServer.getStrCacheSockAddr());
        rmtEntry.setCacheRegionName(cache.getCacheName());
        TCPCacheTransport.enqueueCache(rmtEntry);
    }

}

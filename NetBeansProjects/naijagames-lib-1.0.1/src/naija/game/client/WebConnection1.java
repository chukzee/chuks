/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.http.HttpClientConnection;
import org.apache.http.HttpException;
import org.apache.http.HttpHost;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.conn.ConnectionPoolTimeoutException;
import org.apache.http.conn.ConnectionRequest;
import org.apache.http.conn.HttpClientConnectionManager;
import org.apache.http.conn.routing.HttpRoute;
import org.apache.http.impl.conn.BasicHttpClientConnectionManager;
import twitter4j.JSONObject;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class WebConnection1 implements IConnection, IProxy {

    private String host = "";
    private int port;
    final private String REQUEST_METHOD = "GET";
    String DEFAULT_REMOTE_PATH = "";
    private String PROTOCOL = "http://";
    private String proxy_host = "";
    private int proxy_port = -1;
    private boolean use_proxy;
    private int DEFAULT_SOCKET_TIMEOUT = 3000;
    private long NO_EXPIRY = -1;
    private final BasicHttpClientConnectionManager connMrg = new BasicHttpClientConnectionManager();
    private final HttpClientContext context = HttpClientContext.create();
    HttpRoute route;

    public WebConnection1(String host, int port) {
        this.host = host;
        this.port = port;
        route = new HttpRoute(new HttpHost(host, port));
    }

    @Override
    public void connect() {
    }

    @Override
    public void disconnect() {
    }

    @Override
    public String getHost() {
        return host;
    }

    @Override
    public int getPort() {
        return port;
    }

    @Override
    public JSONObject sendRequest(RequestPacket requestPacket) {

        try {

            // Request new connection. This can be a long process
            ConnectionRequest connRequest = connMrg.requestConnection(route, null);
            // Wait for connection up to 10 sec
            HttpClientConnection conn = connRequest.get(10, TimeUnit.SECONDS);
            try {
                // If not open
                if (!conn.isOpen()) {
                    // establish connection based on its route info
                    connMrg.connect(conn, route, 1000, context);
                    // and mark it as route complete
                    connMrg.routeComplete(conn, route, context);
                }
                // Do useful things with the connection
                URL url = requestUrl(requestPacket);
                HttpGet httpGet = new HttpGet(url.getPath());
                httpGet.addHeader("Host", url.getHost());
                httpGet.addHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.1; rv:43.0) Gecko/20100101 Firefox/43.0");
                httpGet.addHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
                httpGet.addHeader("Accept-Language", "en-US,en;q=0.5");
                httpGet.addHeader("Accept-Encoding", "gzip, deflate");
                httpGet.addHeader("Connection", "Keep-Alive");
                
                conn.sendRequestHeader(httpGet);
                conn.flush();
                System.out.println(conn);
                System.out.println(httpGet.toString());
                
            } catch (IOException ex) {
                Logger.getLogger(WebConnection1.class.getName()).log(Level.SEVERE, null, ex);
            } catch (HttpException ex) {
                Logger.getLogger(WebConnection1.class.getName()).log(Level.SEVERE, null, ex);
            } finally {
                //release connection to the manager so that it can be reused.
                connMrg.releaseConnection(conn, null, NO_EXPIRY, TimeUnit.MINUTES);
            }
            return null;
        } catch (InterruptedException ex) {
            Logger.getLogger(WebConnection1.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ExecutionException ex) {
            Logger.getLogger(WebConnection1.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ConnectionPoolTimeoutException ex) {
            Logger.getLogger(WebConnection1.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    private URL requestUrl(RequestPacket requestPack) throws MalformedURLException, UnsupportedEncodingException {
        List<NameValue> list = requestPack.getCommandList();
        String params = "";

        for (int i = 0; i < list.size(); i++) {
            if (i == 0) {
                params = "?";
            }
            NameValue nv = list.get(i);
            params += nv.getName() + "=" + nv.getValue();

            if (i < list.size() - 2) {
                params += "&";
            }
        }

        String encodedParams = URLEncoder.encode(params, "UTF-8");
        String path = requestPack.getPath();
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        String _host = host;
        if (!_host.startsWith(PROTOCOL)) {
            _host = PROTOCOL + host;
        }
        return new URL(_host + ":" + port + path + encodedParams);
    }

    @Override
    public void useProxy(boolean use_proxy) {
        this.use_proxy = use_proxy;
    }

    @Override
    public void proxyHost(String proxy_host) {
        this.proxy_host = proxy_host;
    }

    @Override
    public void proxyPort(int proxy_port) {
        this.proxy_port = proxy_port;
    }

    @Override
    public void close() {
    }
}
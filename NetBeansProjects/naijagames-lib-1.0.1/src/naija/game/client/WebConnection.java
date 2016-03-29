/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.io.DataInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import twitter4j.JSONException;
import twitter4j.JSONObject;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class WebConnection implements IConnection, IProxy {

    private String host = "";
    private int port;
    final private String REQUEST_METHOD = "POST";
    private String DEFAULT_REMOTE_PATH = "";
    private HttpURLConnection conn;
    private String PROTOCOL = "http://";
    private String proxy_host = "";
    private int proxy_port = -1;
    private boolean use_proxy;
    private int DEFAULT_SOCKET_TIMEOUT;

    public WebConnection(String host, int port) {
        this.host = host;
        this.port = port;
    }

    HttpURLConnection getHttpConnection(RequestPacket requestPack) throws IOException {
        URL url = requestUrl(requestPack);
        Proxy proxy;
        if (use_proxy) {
            proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxy_host, proxy_port));
        } else {
            proxy = Proxy.NO_PROXY;
        }

        return (HttpURLConnection) url.openConnection(proxy);
    }

    @Override
    public void connect() {
        try {
            if (conn == null) {
                RequestPacket requestPack = new RequestPacket(DEFAULT_REMOTE_PATH);
                conn = getHttpConnection(requestPack);
                conn.setDoInput(true); // Allow Inputs
                conn.setDoOutput(true); // Allow Outputs
                conn.setUseCaches(false); // Don't use a Cached Copy
                conn.setRequestMethod(REQUEST_METHOD);
                conn.setConnectTimeout(DEFAULT_SOCKET_TIMEOUT);
            }
            conn.connect();
        } catch (IOException ex) {
            conn=null;
            Logger.getLogger(WebConnection.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    @Override
    public void disconnect() {
        if (conn != null) {
            conn.disconnect();
        }
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

            conn = getHttpConnection(requestPacket);
            conn.setDoInput(true); // Allow Inputs
            conn.setDoOutput(true); // Allow Outputs
            conn.setUseCaches(false); // Don't use a Cached Copy
            conn.setRequestMethod(REQUEST_METHOD);
            conn.addRequestProperty("Keep-Alive", "true");//come back
            conn.setConnectTimeout(DEFAULT_SOCKET_TIMEOUT);
            connect();
            int serverResponseCode = conn.getResponseCode();
            if (serverResponseCode != 200) {
                return null;
            }
            byte[] b = new byte[conn.getContentLength()];//calling getContentLength() will automatically send the request
            DataInputStream din = new DataInputStream(conn.getInputStream());
            din.readFully(b);
            return new JSONObject(new String(b));

        } catch (IOException | JSONException ex) {
            Logger.getLogger(WebConnection.class.getName()).log(Level.SEVERE, null, ex);
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
}

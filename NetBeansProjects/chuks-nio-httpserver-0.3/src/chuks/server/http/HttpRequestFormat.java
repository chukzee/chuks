/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http;

import chuks.server.http.impl.Value;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Array;
import java.net.URLDecoder;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class HttpRequestFormat {

    private String[] headers_split;
    private char[] request_line;
    private int request_line_len;
    int method = HttpConstants.UNKNWON_METHOD;
    private int content_length = -1;//unknown
    private boolean isChunkedTransferEncoding;
    private boolean isChunkTranKnown;
    private StringBuilder boundary;
    private StringBuilder finalBoundaryEnd;
    private StringBuilder subBoundaryEnd;
    private Map<String, Value> queryMap = new HashMap();
    private String decoded_URI;
    private String uri_filename;
    private int request_length_known;
    private int header_length;
    private String queryString;
    private String cookieSessionToken;
    private Map cookiePair = new HashMap();

    public HttpRequestFormat() {
    }

    public void setRequest(String str_request) throws UnsupportedEncodingException, HttpContentLengthException {

        request_length_known = str_request.length();

        String _2x_crlf = "\r\n\r\n";
        header_length = str_request.indexOf(_2x_crlf) + 4;//4 means this length of the search string (ie. 4)

        this.headers_split = str_request.split("\r\n");

        request_line = headers_split[0].toCharArray();
        request_line_len = request_line.length;
        method = HttpConstants.UNKNWON_METHOD;
        uri_filename = null;

        getContentLength();

        decodeURI();
        mapQueryParameters();
        checkCookies();

    }

    private void checkCookies(){
        String cookie = getFieldValue("Cookie: ");
        String[] f = cookie.split(";");
        String sessionIDStr = "sessionToken=";
        for(int i=0; i<f.length; i++){
            String str = f[i].trim();//remove space
            if(str.startsWith(sessionIDStr)){
                cookieSessionToken = str.substring(sessionIDStr.length());
            }else{
                
                int index = str.indexOf('=');
                if(index==-1)
                    continue;
                String name = str.substring(0, index);
                String value = str.substring(index+1, str.length());
                cookiePair.put(name, value); 
            }
        }
    }
    
     public Map getCookiesPair(){
        return cookiePair;
    }

    public String getCookieSessionToken(){
        return cookieSessionToken;
    }
        
    private void mapQueryParameters() throws UnsupportedEncodingException {
        if (!decoded_URI.isEmpty()) {
            int index = decoded_URI.indexOf('?');
            if (index > -1) {
                mapParameters(queryMap, decoded_URI.substring(index + 1));
            }
        }
    }

    private void mapParameters(Map<String, Value> map, String uri) throws UnsupportedEncodingException {

        if (uri.isEmpty()) {
            return;
        }

        String[] params = uri.split("\\&");

        for (int i = 0; i < params.length; i++) {
            int eq_index = params[i].indexOf('=');
            if (eq_index == -1) {
                if (!params[i].isEmpty()) {//for the case of parameter with no value
                    String empty = "";
                    if (doArrayEntry(map, params[i], empty)) {
                        continue;
                    }
                    map.put(params[i], new Value(empty, false));
                }
                continue;
            }
            String name = params[i].substring(0, eq_index);
            String value = params[i].substring(eq_index + 1);

            name = URLDecoder.decode(name, "UTF-8");//any need again? - come back
            value = URLDecoder.decode(value, "UTF-8");//any need again? - come back

            if (doArrayEntry(map, name, value)) {
                continue;
            }
            map.put(name, new Value(value, false));
        }
    }

    private boolean doArrayEntry(Map<String, Value> map, String name, String value) {
        Value old;

        if (map.containsKey(name)) {
            old = map.get(name);
            if (!old.isArray()) {
                Object[] v = new Object[2];
                v[0] = old.get();
                v[1] = value;
                map.put(name, new Value(v, true));
            } else {
                Object[] prev = (Object[]) old.get();
                Object[] v = new Object[prev.length + 1];
                System.arraycopy(prev, 0, v, 0, prev.length);
                v[v.length - 1] = value;
                map.put(name,new Value(v, true));
            }
            return true;
        }

        return false;
    }

    public Map createParametersMap(byte[] request, int header_len) throws UnsupportedEncodingException {

        if (content_length != request.length - header_len) {
            return null;
        }

        String str_post = new String(request, header_len, request.length - header_len);

        str_post = URLDecoder.decode(str_post, "UTF-8");
        Map map = new HashMap();
        mapParameters(map, str_post);

        return map;
    }

    public boolean isHttpProtocol() {
        if (headers_split[0] == null) {
            return false;
        }
        return request_line[request_line_len - 8] == 'H'
                && request_line[request_line_len - 7] == 'T'
                && request_line[request_line_len - 6] == 'T'
                && request_line[request_line_len - 5] == 'P'
                && request_line[request_line_len - 4] == '/';
    }

    public String getProtocolVersion() {
        if (headers_split[0] == null) {
            return HttpConstants.UNKNOWN_HTTP_VERSION;
        }

        if (request_line[request_line_len - 3] == '2'
                && request_line[request_line_len - 2] == '.'
                && request_line[request_line_len - 1] == '0') {
            return HttpConstants.HTTP_2_0;
        }

        if (request_line[request_line_len - 3] == '1'
                && request_line[request_line_len - 2] == '.'
                && request_line[request_line_len - 1] == '1') {
            return HttpConstants.HTTP_1_1;
        }

        if (request_line[request_line_len - 3] == '1'
                && request_line[request_line_len - 2] == '.'
                && request_line[request_line_len - 1] == '0') {
            return HttpConstants.HTTP_1_0;
        }

        return HttpConstants.UNKNOWN_HTTP_VERSION;
    }

    public String getURIFileName() throws UnsupportedEncodingException {

        if (uri_filename != null) {
            return uri_filename;
        }

        
        if (headers_split[0] == null) {
            return uri_filename = "";//set to empty and return
        }
        
        headers_split[0] = URLDecoder.decode(headers_split[0], "UTF-8");
        
        int index = headers_split[0].indexOf('/') + 1;
        int index_2 = headers_split[0].indexOf('?');
        if (index_2 < 0)//yes
        {
            index_2 = headers_split[0].lastIndexOf('/') - 5;
        }
       
        uri_filename = headers_split[0].substring(index, index_2);

        return uri_filename;
    }

    private void decodeURI() throws UnsupportedEncodingException {
        if (headers_split[0] == null) {
            return;
        }

        int index = headers_split[0].indexOf('/') + 1;
        int index_2 = headers_split[0].lastIndexOf('/') - 5;

        String uri = headers_split[0].substring(index, index_2);
        decoded_URI = URLDecoder.decode(uri, "UTF-8");
        int inQ = decoded_URI.indexOf('?');
        if (inQ != -1) {
            queryString = decoded_URI.substring(inQ + 1);
        }
    }

    public Value getQueryValue(String name) throws UnsupportedEncodingException {
        if (this.queryMap == null) {
            return null;
        }
        Value v = queryMap.get(name);
        if (v == null) {
            return null;
        }
        return v;
    }

    public Map<String, Value> getQueryMap() throws UnsupportedEncodingException {        
        return queryMap;
    }

    /**
     * This will return every thing posted as it is
     *
     * @return
     */
    public String getPOST() {
        if (Method() != HttpConstants.POST_METHOD) {
            return null;
        }
        return headers_split[headers_split.length - 1];
    }

    public int Method() {
        if (method != HttpConstants.UNKNWON_METHOD) {
            return method;//good
        }

        //at this point the method is not known
        if (headers_split[0].startsWith("GET")) {
            return method = HttpConstants.GET_METHOD;
        }

        if (headers_split[0].startsWith("POST")) {
            return method = HttpConstants.POST_METHOD;
        }

        if (headers_split[0].startsWith("HEAD")) {
            return method = HttpConstants.HEAD_METHOD;
        }

        if (headers_split[0].startsWith("PUT")) {
            return method = HttpConstants.PUT_METHOD;
        }

        if (headers_split[0].startsWith("DELETE")) {
            return method = HttpConstants.DELETE_METHOD;
        }

        return HttpConstants.UNKNWON_METHOD;
    }

    public String getOrigin() {
        return getFieldValue("Origin: ");
    }

    public String getUserAgent() {
        return getFieldValue("User-Agent: ");
    }

    public String getCacheControl() {
        return getFieldValue("Cache-Control: ");
    }

    public String getConnection() {
        return getFieldValue("Connection: ");
    }

    public String getAccept() {
        return getFieldValue("Accept: ");
    }

    public String getAcceptEncoding() {
        return getFieldValue("Accept-Encoding: ");
    }

    public String getAcceptLanguage() {
        return getFieldValue("Accept-Language: ");
    }

    public String getAcceptCharset() {
        return getFieldValue("Accept-Charset: ");
    }

    public String getReferer() {
        return getFieldValue("Referer: ");
    }

    public String getHost() {
        return getFieldValue("Host: ");
    }

    public String getContentTransferEncoding() {
        return getFieldValue("Content-Transfer-Encoding: ");
    }

    public String getContentDisposition() {
        return getFieldValue("Content-Disposition: ");
    }

    public String getTransferEncoding() {
        return getFieldValue("Transfer-Encoding: ");
    }

    public String getContentType() {
        return getFieldValue("Content-Type: ");
    }

    public boolean isFormUrlEncoding() {
        String content_type = getContentType();
        if (content_type.indexOf("application/x-www-form-urlencoded") > -1) {//simple check - verify later if better check is really neccessary
            return true;
        }
        return false;
    }

    public String getCharSet() {
        String content_type = getContentType();
        String default_charset = "UTF-8";
        int index = content_type.indexOf("charset=");

        if (index == -1) {
            return default_charset;//if not provider will shall use the default
        }
        int index_2 = content_type.indexOf(";", index + 8);//start from end of charset= string
        if (index_2 == -1) {
            return content_type.substring(index + 8);
        } else {
            return content_type.substring(index + 8, index_2).trim();
        }

    }

    public boolean isChunkedTransferEncoding() {
        if (isChunkTranKnown) {
            return isChunkedTransferEncoding;
        }

        if (this.getContentTransferEncoding().equals("chunked")) {
            isChunkTranKnown = true;
            isChunkedTransferEncoding = true;
        }

        return isChunkedTransferEncoding;
    }

    public boolean isMultiPartFormData() {
        if (this.getContentType().startsWith("multipart/form-data")) {
            return true;
        }
        return false;
    }

    public StringBuilder getBoundary() {
        if (boundary != null) {
            return boundary;
        }
        String[] split = this.getContentType().split(";");
        String boundary_eq = "boundary=";
        for (int i = 0; i < split.length; i++) {
            String f = split[i].trim();
            if (f.startsWith(boundary_eq)) {
                boundary = new StringBuilder(f.substring(boundary_eq.length(), f.length()));
                return boundary;
            }
        }
        return null;//empty
    }

    public StringBuilder getSubBoundaryEnd() {
        if (this.getBoundary() == null) {
            return null;
        }
        if (subBoundaryEnd == null) {
            subBoundaryEnd = new StringBuilder();
            subBoundaryEnd.append("--").append(this.boundary).append("\r\n");
        }
        return subBoundaryEnd;
    }

    public StringBuilder getFinalBoundaryEnd() {
        if (this.getBoundary() == null) {
            return null;
        }
        if (finalBoundaryEnd == null) {
            finalBoundaryEnd = new StringBuilder();
            finalBoundaryEnd.append("--").append(this.boundary).append("--");
        }
        return finalBoundaryEnd;
    }

    public int getContentLength() throws HttpContentLengthException {

        if (content_length != -1) {
            return content_length;//already known
        }


        String str_content_len = getFieldValue("Content-Length: ");
        if (str_content_len.isEmpty()) {
            return 0;
        }
        try {
            content_length = Integer.parseInt(str_content_len);
        } catch (NumberFormatException ex) {
            throw new HttpContentLengthException("invalid content length - not a number");
        }
        if (content_length < 0) {
            throw new HttpContentLengthException("invalid content length - negative number");
        }

        return content_length;
    }

    private String getFieldValue(String field_name) {
        if (headers_split == null) {
            return "";
        }
        char first_char = field_name.charAt(0);
        for (int i = 1; i < headers_split.length; i++) {//skip request line
            if (headers_split[i].length() == 0) {
                continue;
            }
            if (headers_split[i].charAt(0) == first_char) {
                String field = field_name;
                if (headers_split[i].startsWith(field)) {
                    return headers_split[i].substring(field.length());
                }
            }
        }

        return "";
    }

    public static void main(String args[]) throws HttpContentLengthException, UnsupportedEncodingException {
        HttpRequestFormat h = new HttpRequestFormat();
        String _method = "GET";
        //String _method = "POST";
        h.setRequest(_method + " /winnerschapel/index.php HTTP/1.1\r\n"
                + "User-Agent: Opera/9.80 (Windows NT 6.1; U; en) Presto/2.10.289 Version/12.02\r\n"
                + "Host: localhost\r\n"
                + "Accept: text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1\r\n"
                + "Accept-Language: en-US,en;q=0.9\r\n"
                + "Accept-Encoding: gzip, deflate\r\n"
                + "Referer: http://localhost/\r\n"
                + "Connection: Keep-Alive\r\n"
                + "Content-Length: 45\r\n"
                + "Cookie: sessionToken=abcd; user=johnson; state=anambra\r\n"
                //+ "Content-Type: multipart/form-data;boundary=this_is_boundary"
                + "Content-Type: application/x-www-form-urlencoded; charset=UTF-8; anything"
                + "\r\n"
                + "user=yww123&pass=u9u37j43jg123&code=java_code");

        System.out.println(h.getURIFileName());
        System.out.println(h.isHttpProtocol());
        System.out.println(h.Method());
        System.out.println(h.getProtocolVersion());
        System.out.println(h.getAccept());
        System.out.println(h.getAcceptCharset());
        System.out.println(h.getAcceptEncoding());
        System.out.println(h.getAcceptLanguage());
        System.out.println(h.getUserAgent());
        System.out.println(h.getHost());
        System.out.println(h.getConnection());
        System.out.println(h.getReferer());
        //System.out.println(h.getGET("user"));
        //System.out.println(h.getGET("pass"));
        //System.out.println(h.getGET("code"));
        //System.out.println(h.getPOST("user"));
        //System.out.println(h.getPOST("pass"));
        //System.out.println(h.getPOST("code"));
        System.out.println(h.getPOST());
        System.out.println(h.getContentLength());
        System.out.println(h.getBoundary());
        System.out.println(h.isFormUrlEncoding());
        System.out.println(h.getCharSet());
        System.out.println(h.isMultiPartFormData());
        System.out.println(h.getCookieSessionToken());



    }
}

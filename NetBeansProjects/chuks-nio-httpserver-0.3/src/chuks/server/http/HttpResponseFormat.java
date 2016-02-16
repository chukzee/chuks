/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class HttpResponseFormat {

    private char[] statusLine = new char[0];
    private char[] Date = new char[0];
    private char[] Etag = new char[0];
    private char[] Server = new char[0];
    private char[] LastModified = new char[0];
    private char[] AacceptRanges = new char[0];
    private char[] end_line = {'\r', '\n'};
    private byte[] message_body = new byte[0];
    private char[] Content_Type = new char[0];
    private char[] Connection = new char[0];
    private char[] AccessControlAllowOrigin = new char[0];
    private long overwrite_content_length;
    private char[] Set_Cookie = new char[0];

    public HttpResponseFormat() {

    }


    public void overwriteContentLength(long overwrite_content_length) {
        this.overwrite_content_length = overwrite_content_length;
    }

    public byte[] getReponse() {

        StringBuilder str = new StringBuilder();

        if (statusLine.length > 0) {
            str.append(statusLine).append(end_line);
        }
        if (Date.length > 0) {
            str.append("Date: ").append(Date).append(end_line);
        }
        if (Server.length > 0) {
            str.append("Server: ").append(Server).append(end_line);
        }
        if (Etag.length > 0) {
            str.append("ETag: ").append(Etag).append(end_line);
        }

        if (LastModified.length > 0) {
            str.append("Last-Modified: ").append(LastModified).append(end_line);
        }
        if (Content_Type.length > 0) {
            str.append("Content-Type: ").append(Content_Type).append(end_line);
        }
        if (AacceptRanges.length > 0) {
            str.append("Accept-Ranges: ").append(AacceptRanges).append(end_line);
        }

        if (Connection.length > 0) {
            str.append("Connection: ").append(Connection).append(end_line);
        }

        if (AccessControlAllowOrigin.length > 0) {
            str.append("Access-Control-Allow-Origin: ").append(AccessControlAllowOrigin).append(end_line);
        }

        if (Set_Cookie.length > 0) {
            str.append(Set_Cookie).append(end_line);
        }



        //set Content-Length to length of the body
        long content_length = overwrite_content_length == 0 ? message_body.length : overwrite_content_length;
        str.append("Content-Length: ").append(content_length).append(end_line);

        str.append(end_line);


        char[] chars = new char[str.length()];
        str.getChars(0, str.length(), chars, 0);
        byte[] response = new byte[chars.length + message_body.length];
        for (int i = response.length - 1; i > -1; i--) {
            if (i >= chars.length) {
                response[i] = message_body[i - chars.length];
            } else {
                response[i] = (byte) chars[i];
            }
        }

        return response;
    }
    
    public void setCookie(String cookie_str){
        Set_Cookie = cookie_str.toCharArray();
    }

    public void setStatusCode_NotImplemented(String htttp_protocol_version) {
        setStatusLine(htttp_protocol_version+" 501 Not Implemented");
    }

    public void setStatusCode_BadRequest(String htttp_protocol_version) {
        setStatusLine(htttp_protocol_version+" 400 Bad Request");
    }

    public void setStatusCode_OK(String htttp_protocol_version) {
        setStatusLine(htttp_protocol_version+" 200 OK");
    }

    public void setStatusCode_FileNotFound(String htttp_protocol_version) {
        setStatusLine(htttp_protocol_version+" 404 File Not Found");
    }
    public void setStatusCode_FileTypeNotSupported(String htttp_protocol_version) {
        setStatusLine(htttp_protocol_version+" File Type Not Supported");//i do not know the code
    }

    public void setStatusCode_Forbidden(String htttp_protocol_version) {
        setStatusLine(htttp_protocol_version+" 403 Forbidden");
    }
    public void setStatusLine(String statusLine) {
        this.statusLine = statusLine.toCharArray();
    }

    public void setAccessControlAllowOrigin(String origin_server){
        this.AccessControlAllowOrigin = origin_server.toCharArray();;
    }

    public void setDate(String Date) {
        this.Date = Date.toCharArray();
    }

    public void setEtag(String Etag) {
        this.Etag = Etag.toCharArray();
    }

    public void setServer(String Server) {
        this.Server = Server.toCharArray();
    }

    public void setLastModified(String LastModified) {
        this.LastModified = LastModified.toCharArray();
    }

    public void setAacceptRanges(String AacceptRanges) {
        this.AacceptRanges = AacceptRanges.toCharArray();
    }

    public void setMessageBody(byte[] message_body) {
        this.message_body = message_body;
    }

    public void setContentType(String Content_Type) {
        this.Content_Type = Content_Type.toCharArray();
    }

    public void setConnection(String Connection) {
        this.Connection = Connection.toCharArray();
    }
    

    public static void main(String args[]) {
        HttpResponseFormat r = new HttpResponseFormat();
        r.setStatusCode_OK(HttpConstants.HTTP_1_1);
        r.setMessageBody("chuks alimele".getBytes());
        System.out.println(new String(r.getReponse()));

    }

}

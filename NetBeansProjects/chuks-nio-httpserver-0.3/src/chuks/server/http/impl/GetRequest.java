/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.SimpleServerApplication;
import chuks.server.http.HttpRequestFormat;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.channels.SocketChannel;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

/**
 *
 * @author USER
 */
class GetRequest extends RequestValidator {

    private final int headersLength;

    GetRequest(HttpRequestFormat request, SocketChannel out, RequestTask handler) throws UnsupportedEncodingException {
        super(request, out);
        this.headersLength = handler.headersLength;
    }

    @Override
    void validateRequest(byte[] recv, int offset, int size) throws UnsupportedEncodingException {
        
        long time = System.nanoTime();
        
        RequestObject req = new RequestObject();                
        req.setGet(request.getQueryMap());
        
        //System.out.println("TEST GET REQUEST OPTIMIZATION : " + (System.nanoTime() - time) / Math.pow(10.0, 9));
        
        notifyServerApp(req); 
        
        //System.out.println("TEST GET2 REQUEST OPTIMIZATION : " + (System.nanoTime() - time) / Math.pow(10.0, 9));
        
    }

}

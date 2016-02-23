/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.http.HttpRequestFormat;
import java.io.UnsupportedEncodingException;
import java.nio.channels.SocketChannel;

/**
 *
 * @author USER
 */
class HeadRequest extends RequestValidator{

    HeadRequest(HttpRequestFormat request, SocketChannel out, RequestTask handler) throws UnsupportedEncodingException{
        super(request, out);
    }
    
    @Override
    void validateRequest(byte[] recv, int offset, int size) {
        
    }
    
}

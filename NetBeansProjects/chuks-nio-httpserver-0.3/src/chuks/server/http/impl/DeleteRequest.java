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
class DeleteRequest extends RequestValidator {

    DeleteRequest(RequestTask task){
        super(task);        
    }

    @Override
    void validateRequest(byte[] recv, int offset, int size) {
    }
}

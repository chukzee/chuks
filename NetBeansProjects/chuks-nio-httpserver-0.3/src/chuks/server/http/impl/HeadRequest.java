/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import java.io.UnsupportedEncodingException;

/**
 *
 * @author USER
 */
class HeadRequest extends RequestValidator{

    HeadRequest(RequestTask task) throws UnsupportedEncodingException{
        super(task);
    }
    
    @Override
    void validateRequest(byte[] recv, int offset, int size) {
        
    }
    
}

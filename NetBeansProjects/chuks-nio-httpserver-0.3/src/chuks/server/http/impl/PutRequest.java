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

class PutRequest  extends RequestValidator{

    PutRequest(RequestTask task){
         super(task);         
    }
     
    @Override
     void validateRequest(byte[] recv, int offset, int size) {

    }
    
}

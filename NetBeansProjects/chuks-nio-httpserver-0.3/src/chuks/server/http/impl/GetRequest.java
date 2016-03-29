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
class GetRequest extends RequestValidator {

    private final int headersLength;

    GetRequest(RequestTask task) throws UnsupportedEncodingException {
        super(task);
        this.headersLength = task.headersLength;
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

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

    private final StringBuilder boundary;
    private final int headersLength;
    private final char[] final_boundary_end;
    private final char[] sub_boundary_end;
    private final int final_boundary_end_length;
    private final int sub_boundary_end_length;
    private final boolean hasBoundary;
    private final int content_length;

    DeleteRequest(HttpRequestFormat request, SocketChannel out, RequestTask handler) throws UnsupportedEncodingException {
        super(request, out);
        this.hasBoundary = handler.hasBoundary;
        this.boundary = handler.boundary;
        this.headersLength = handler.headersLength;
        this.final_boundary_end = handler.final_boundary_end;
        this.sub_boundary_end = handler.sub_boundary_end;
        this.final_boundary_end_length = handler.final_boundary_end_length;
        this.sub_boundary_end_length = handler.sub_boundary_end_length;
        this.content_length = handler.content_length;
        
    }

    @Override
    void validateRequest(byte[] recv, int offset, int size) {
    }
}

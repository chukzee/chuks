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

    DeleteRequest(RequestTask task) throws UnsupportedEncodingException {
        super(task);
        this.hasBoundary = task.hasBoundary;
        this.boundary = task.boundary;
        this.headersLength = task.headersLength;
        this.final_boundary_end = task.final_boundary_end;
        this.sub_boundary_end = task.sub_boundary_end;
        this.final_boundary_end_length = task.final_boundary_end_length;
        this.sub_boundary_end_length = task.sub_boundary_end_length;
        this.content_length = task.content_length;
        
    }

    @Override
    void validateRequest(byte[] recv, int offset, int size) {
    }
}

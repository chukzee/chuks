/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class EventPacket {
    private final String contentType;
    private final byte[] data;
    
    EventPacket(String content_type, byte[] data){
        this.contentType = content_type;
        this.data = data;
    }

    public String getContentType() {
        return contentType;
    }

    public byte[] getData() {
        return data;
    }
    
    
}

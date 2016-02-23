/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import java.nio.file.Path;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class RequestFileCacheEntry {
 
    String filePath;
    int status;
    byte[] data;
    String content_type;
    RequestFileCacheEntry(Path filePath, int status){
        this.filePath = filePath.toString();//important
        this.status = status;
    }
    RequestFileCacheEntry(Path filePath, int status,String content_type, byte[] data){
        this.filePath = filePath.toString();//important
        this.status = status;
        this.content_type = content_type;
        this.data = data;
    }
}

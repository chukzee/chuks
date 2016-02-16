/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.cache;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class RemoteMemoryCahce extends LRUMemoryCache{

    public RemoteMemoryCahce(int cacheSize) {
        super(cacheSize);
    }

    
}

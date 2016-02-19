/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.cache.config;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class MemoryCacheProperties extends CacheProperties{

    
    public MemoryCacheProperties() {
        super(false,false,false);
    }

    @Override
    final public boolean isSpool() {
        return false; 
    }
    
    
    
}

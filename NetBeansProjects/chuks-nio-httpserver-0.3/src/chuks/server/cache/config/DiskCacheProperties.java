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
public class DiskCacheProperties extends CacheProperties {

    public DiskCacheProperties() {
        super(true,true,true);
    }

    public DiskCacheProperties(boolean useDiskSwapStrategy) {
        super(true, useDiskSwapStrategy,true);
    }
    
    @Override
    final public boolean isSpool() {
        return true; 
    }

}

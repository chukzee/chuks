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
public class RemoteDiskCache extends LocalDiskCache implements IRemoteCache<Object, Object>{

    @Override
    public void putCache(Object key, Object value) {
        System.out.println("REMIND: Auto generated method body is not yet implemented");
        super.put(key, value);
    }
    
    
    
}

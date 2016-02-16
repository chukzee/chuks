/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.cache;

import chuks.server.util.DiskCache;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class LocalDiskCache implements DiskCache{

    @Override
    public String getPath() {
        System.out.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public void put(Object key, Object value) {
        System.out.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public Object get(Object key) {
        System.out.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public Object remove(Object key) {
        System.out.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public void clear() {
        System.out.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public int size() {
        System.out.println("REMIND: Auto generated method body is not yet implemented");
        return 0;
    }
    
}

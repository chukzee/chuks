/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.cache;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 * @param <K>
 * @param <V>
 */
public class LRUMemoryCache <K, V> extends LinkedHashMap<K, V> {
    
    private final int cacheSize;
    
    public LRUMemoryCache(int cacheSize) {
        super(cacheSize, 0.75f, true);
        this.cacheSize = cacheSize;
    }

    @Override
    public V put(K key, V value) {
        return super.put(key, value);
    }

    
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        //a return value of true indicates eldest entry will be remove by LRU policy        
        return size() > cacheSize;
    }    
}

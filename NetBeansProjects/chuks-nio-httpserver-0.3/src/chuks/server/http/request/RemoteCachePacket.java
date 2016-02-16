/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.cache.CacheActionType;
import chuks.server.cache.RemoteAction;
import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 * @param <K>
 * @param <V>
 */
 class RemoteCachePacket<K,V> implements Serializable , RemoteAction{
    static final long serialVersionUID = 4194045857493038438L; 
    private K key;
    private V value;
    private String origin;
    private CacheActionType cache_action_type;
    final private transient Map senders = Collections.synchronizedMap(new HashMap());//cheaper to use HashMap than HashSet since HashSet uses HashMap for implementation

    private RemoteCachePacket(){}
    
    RemoteCachePacket(K key, V value, String origin, CacheActionType cache_action_type) {
        this.key = key;
        this.value = value;
        this.origin = origin;
        this.cache_action_type = cache_action_type;
    }

    K getKey() {
        return key;
    }

    void setKey(K key) {
        this.key = key;
    }

    V getValue() {
        return value;
    }

    void setValue(V value) {
        this.value = value;
    }

    String getOrigin() {
        return origin;
    }

    void setOrigin(String origin) {
        this.origin = origin;
    }

    void registerConsumer(String name){
        this.senders.put(name,null);
    }
    
    boolean isConsumedBy(String name){
        return senders.containsKey(name);
    }

    int totalConsumers(){
        return senders.size();
    }
    
    @Override
    public CacheActionType getActionType() {
        return cache_action_type;
    }
}

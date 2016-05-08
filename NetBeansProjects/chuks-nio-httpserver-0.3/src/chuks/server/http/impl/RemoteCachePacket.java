/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.cache.CacheActionType;
import chuks.server.cache.ICacheProperties;
import chuks.server.cache.IEntryAttributes;
import chuks.server.cache.config.CacheProperties;
import chuks.server.cache.config.EntryAttributes;
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
class RemoteCachePacket<K, V> implements Serializable {

    static final long serialVersionUID = 4194045857493038438L;
    private K key;
    private V value;
    private String origin;
    private IEntryAttributes entryAttr;
    final private transient Map senders = Collections.synchronizedMap(new HashMap());//cheaper to use HashMap than HashSet since HashSet uses HashMap for implementation
    private long time_to_live_remaining = -1;//default is forever
    private long max_idle_time = -1;//default is forever
    private String region_name;
    private long last_update_time;
    private boolean remove;
    private boolean removeAll;
    private boolean is_distributed_call;

    private RemoteCachePacket() {
    }

    RemoteCachePacket(K key, V value, String origin, IEntryAttributes attr) {
        this.key = key;
        this.value = value;
        this.origin = origin;
        this.entryAttr = attr;
        last_update_time = System.currentTimeMillis();
        if (attr != null) {
            time_to_live_remaining = attr.getTimeToLiveInSeconds();
        }
    }

    /**
     * Use this construct to remote the cache with the specified key.
     *
     * @param key
     * @param origin
     */
    RemoteCachePacket(K key, String origin) {
        this.key = key;
        this.origin = origin;
        this.remove = true;
        last_update_time = System.currentTimeMillis();
    }

    /**
     * Use this construct to remote the cache with the specified key.
     *
     * @param key
     * @param origin
     */
    RemoteCachePacket(String origin) {
        this.key = key;
        this.origin = origin;
        this.remove = true;
        this.removeAll = true;
        last_update_time = System.currentTimeMillis();
    }
    
    IEntryAttributes getAttributes() {
        return entryAttr != null ? entryAttr : new EntryAttributes();
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

    void registerConsumer(String name) {
        this.senders.put(name, null);
    }

    boolean isConsumedBy(String name) {
        return senders.containsKey(name);
    }

    int totalConsumers() {
        return senders.size();
    }

    public boolean isRemoveCache() {
        return remove;
    }

    public boolean isRemoveAllCache() {
        return removeAll;
    }

    long getTimeToLiveRemaining() {
        return this.time_to_live_remaining;
    }

    long getTimeToLive() {
        return this.time_to_live_remaining;
    }

    long getMaxIdleTime() {
        return this.max_idle_time;
    }

    void updateCacheExpiry() {
        int elapse = (int) ((System.currentTimeMillis() - last_update_time) / 1000);//secs
        if (time_to_live_remaining > -1) {
            time_to_live_remaining -= elapse;
            if (time_to_live_remaining < 0) {
                time_to_live_remaining = 0;//expires
            }
        }

        last_update_time = System.currentTimeMillis();
    }

    void updateCacheExpiryAfterTransit() {
        int transit_delay = (int) ((System.currentTimeMillis() - last_update_time) / 1000);//secs 
        if (transit_delay > 0 && transit_delay < 10) {//we assume 10 to be max transit delay unless the system time at the two end points is not synchronized
            if (time_to_live_remaining > -1) {
                time_to_live_remaining -= transit_delay;
                if (time_to_live_remaining < 0) {
                    time_to_live_remaining = 0;//expires
                }
            }
        }
    }

    void setCacheRegionName(String region_name) {
        this.region_name = region_name;
    }

    String getCacheRegionName() {
        return this.region_name;
    }

    void distributedCall(boolean is_distributed_call) {
        this.is_distributed_call = is_distributed_call;
    }
    
    
    boolean isDistributedCall() {
        return is_distributed_call;
    }
}

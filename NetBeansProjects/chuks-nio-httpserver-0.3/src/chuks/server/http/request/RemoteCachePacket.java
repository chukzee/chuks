/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.cache.CacheActionType;
import chuks.server.cache.EntryType;
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
    private CacheActionType cache_action_type;
    final private transient Map senders = Collections.synchronizedMap(new HashMap());//cheaper to use HashMap than HashSet since HashSet uses HashMap for implementation
    private int time_to_live_in_secs = -1;//default is forever
    private int max_idle_time_in_secs = -1;//default is forever
    private String region_name;
    private long last_update_time;

    private RemoteCachePacket() {
    }

    RemoteCachePacket(K key, V value, String origin, CacheActionType cache_action_type) {
        this.key = key;
        this.value = value;
        this.origin = origin;
        this.cache_action_type = cache_action_type;
        last_update_time = System.currentTimeMillis();
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

    public CacheActionType getAction() {
        return cache_action_type;
    }

    void setTimeToLive(int time_to_live_in_secs) {
        this.time_to_live_in_secs = time_to_live_in_secs;
    }

    void setMaxIdleTime(int max_idle_time_in_secs) {
        this.max_idle_time_in_secs = max_idle_time_in_secs;
    }

    int getTimeToLiveRemaining() {
        return this.time_to_live_in_secs;
    }

    int getMaxIdleTimeRemaining() {
        return this.max_idle_time_in_secs;
    }

    void updateCacheExpiry() {
        int elapse = (int) ((System.currentTimeMillis() - last_update_time) / 1000);//secs
        if (time_to_live_in_secs > -1) {
            time_to_live_in_secs -= elapse;
            if (time_to_live_in_secs < 0) {
                time_to_live_in_secs = 0;//expires
            }
        }
        
        last_update_time = System.currentTimeMillis();
    }

    void updateCacheExpiryAfterTransit() {
        int transit_delay = (int) ((System.currentTimeMillis() - last_update_time) / 1000);//secs 
        if (transit_delay > 0 && transit_delay < 10) {//we assume 10 to be max transit delay unless the system time at the two end points is not synchronized
            if (time_to_live_in_secs > -1) {
                time_to_live_in_secs -= transit_delay;
                if (time_to_live_in_secs < 0) {
                    time_to_live_in_secs = 0;//expires
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
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.cache.CacheActionType;
import chuks.server.cache.LRUMemoryCache;
import chuks.server.cache.LRUOptimalCache;
import chuks.server.cache.LocalDiskCache;
import chuks.server.cache.RemoteDiskCache;
import chuks.server.cache.RemoteMemoryCahce;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.WeakHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final class ServerCache {

    static final Map<String, RequestFileCacheEntry> LRUOptimalCache;//used for cache requests
    static final LRUMemoryCache LRUMemoryCache;
    static final LocalDiskCache localDiskCache;
    static final RemoteMemoryCahce remoteMemoryCahce;
    static final RemoteDiskCache remoteDiskCache;
    static ServerCache cacheInstance;
    static ScheduledExecutorService execEvict;
    private final static Object lock = new Object();

    static {
        LRUOptimalCache = Collections.synchronizedMap(new LRUOptimalCache(1000));
        LRUMemoryCache = new LRUMemoryCache(ServerConfig.MAX_MEMORY_CACHE_SIZE);
        localDiskCache = new LocalDiskCache();
        remoteMemoryCahce = new RemoteMemoryCahce(ServerConfig.MAX_MEMORY_CACHE_SIZE);
        remoteDiskCache = new RemoteDiskCache();
    }

    public static ServerCache getInstance() {
        if (cacheInstance != null) {
            return cacheInstance;
        }

        synchronized (lock) {
            if (cacheInstance == null) {
                execEvict = Executors.newSingleThreadScheduledExecutor();
                cacheInstance = new ServerCache();
                execEvict.scheduleWithFixedDelay(new ServerCache.Evictor(), 1, 1, TimeUnit.SECONDS);
            }
        }

        return cacheInstance;
    }

    public static Object getRequestCache(String key) {
        return LRUOptimalCache.get(key);
    }

    public static Object getInMemory(Object key) {
        return LRUMemoryCache.get(key);
    }

    public static Object getInDisk(Object key) {
        return localDiskCache.get(key);
    }

    public static Object getInMemoryByRemoteEntry(Object key) {
        return remoteMemoryCahce.get(key);
    }

    public static Object getInDiskByByRemoteEntry(Object key) {
        return remoteDiskCache.get(key);
    }

    public static void putRCEInMemory(RemoteCachePacket RemoteCacheEntry) {
        remoteMemoryCahce.put(RemoteCacheEntry.getKey(), RemoteCacheEntry.getValue());
    }

    public static void putRCEInDisk(RemoteCachePacket RemoteCacheEntry) {
        remoteDiskCache.put(RemoteCacheEntry.getKey(), RemoteCacheEntry.getValue());
    }
    
    static private class Evictor implements Runnable{

        @Override
        public void run() {
            
            Set memKeys = LRUMemoryCache.keySet();
            Set rmtMemKeys = remoteMemoryCahce.keySet();
            
        }
        
    }
}

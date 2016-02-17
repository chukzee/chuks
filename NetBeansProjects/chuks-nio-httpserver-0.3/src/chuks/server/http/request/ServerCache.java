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
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.WeakHashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.apache.commons.jcs.JCS;
import org.apache.commons.jcs.access.CacheAccess;
import org.apache.commons.jcs.engine.ElementAttributes;
import org.apache.commons.jcs.engine.behavior.IElementAttributes;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final class ServerCache {

    static final Map<String, RequestFileCacheEntry> LRUOptimalCache;//used for cache requests

    static ServerCache cacheInstance;
    static ScheduledExecutorService execEvict;
    static CacheAccess<Object, Object> jcsCache;
    static ConcurrentHashMap<String, CacheAccess> jcsCacheRegions = new ConcurrentHashMap();
    final static IElementAttributes defaultMemoryElemtentAttr;
    final static IElementAttributes defaultDiskElemtentAttr;

    static {
        LRUOptimalCache = Collections.synchronizedMap(new LRUOptimalCache(1000));
        defaultMemoryElemtentAttr = new ElementAttributes();
        defaultMemoryElemtentAttr.setIsSpool(false);//store only in memory

        defaultDiskElemtentAttr = new ElementAttributes();
        defaultDiskElemtentAttr.setIsSpool(true);//will be flushed to disk
    }

    public static ServerCache getInstance() {
        if (cacheInstance != null) {
            return cacheInstance;
        }

        synchronized (ServerCache.class) {
            if (cacheInstance == null) {
                cacheInstance = new ServerCache();
                JCS.setConfigFilename("/chuks/server/cache/config/cache.ccf");
                jcsCache = JCS.getInstance("default");
            }
        }

        return cacheInstance;
    }

    public static Object getRequestCache(String key) {
        return LRUOptimalCache.get(key);
    }

    static void putRCEInMemory(RemoteCachePacket rmtPack) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    static void putRCEInDisk(RemoteCachePacket rmtPack) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        
    }

}

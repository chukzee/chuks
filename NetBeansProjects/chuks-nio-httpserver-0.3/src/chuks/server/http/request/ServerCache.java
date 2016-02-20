/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.cache.ICacheProperties;
import chuks.server.cache.IEntryAttributes;
import chuks.server.cache.LRUOptimalCache;
import chuks.server.cache.config.CacheProperties;
import chuks.server.cache.config.EntryAttributes;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.jcs.engine.CacheElement;
import org.apache.commons.jcs.engine.CompositeCacheAttributes;
import org.apache.commons.jcs.engine.ElementAttributes;
import org.apache.commons.jcs.engine.behavior.ICompositeCacheAttributes;
import org.apache.commons.jcs.engine.behavior.IElementAttributes;
import org.apache.commons.jcs.engine.control.CompositeCache;
import org.apache.commons.jcs.engine.control.CompositeCacheManager;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final class ServerCache {

    static final Map<String, RequestFileCacheEntry> LRUOptimalCache;//used for cache requests

    static ServerCache cacheInstance;
    static ScheduledExecutorService execEvict;
    static CompositeCache<Object, Object> jcsCache;
    static ConcurrentHashMap<String, CompositeCache> jcsCacheRegions = new ConcurrentHashMap();
    static IEntryAttributes defaultEntryAttr;

    static {
        LRUOptimalCache = Collections.synchronizedMap(new LRUOptimalCache(1000));
    }

    public static ServerCache getInstance() {
        if (cacheInstance != null) {
            return cacheInstance;
        }

        synchronized (ServerCache.class) {
            if (cacheInstance == null) {
                cacheInstance = new ServerCache();
            }
        }

        return cacheInstance;
    }

    public static Object getRequestCache(String key) {
        return LRUOptimalCache.get(key);
    }

    static void putRCE(RemoteCachePacket rmtPack) {

        try {
            CompositeCache cache;

            if (rmtPack.getCacheRegionName() == null) {
                cache = jcsCache;
            } else {
                cache = jcsCacheRegions.get(rmtPack.getCacheRegionName());
                if (cache == null) {
                    //region not found
                    return;
                }
            }

            IEntryAttributes cache_prop = rmtPack.getAttributes();
            ElementAttributes attr = new ElementAttributes();
            attr.setIsSpool(cache_prop.isSpool());
            attr.setMaxLife(rmtPack.getTimeToLiveRemaining());//set the time to live remain in this case
            attr.setIdleTime(cache_prop.getMaxIdleTimeInSeconds());

            CacheElement ce = new CacheElement(rmtPack.getCacheRegionName(), rmtPack.getKey(), rmtPack.getValue());
            ce.setElementAttributes(attr);
            cache.localUpdate(ce);//we are not intrested in JCS remote implementation - we've got ours

        } catch (IOException ex) {
            Logger.getLogger(ServerCache.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    static void removeRCE(RemoteCachePacket rmtPack) {
        CompositeCache cache;
        if (rmtPack.getCacheRegionName() == null) {
            cache = jcsCache;
        } else {
            cache = jcsCacheRegions.get(rmtPack.getCacheRegionName());
            if (cache == null) {
                //region not found
                return;
            }
        }

        cache.localRemove(rmtPack.getKey());
    }

    static void removeAllRCE(RemoteCachePacket rmtPack) {
        try {
            CompositeCache cache;
            if (rmtPack.getCacheRegionName() == null) {
                cache = jcsCache;
            } else {
                cache = jcsCacheRegions.get(rmtPack.getCacheRegionName());
                if (cache == null) {
                    //region not found
                    return;
                }
            }

            cache.localRemoveAll();

        } catch (IOException ex) {
            Logger.getLogger(ServerCache.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    static CompositeCache createRegion(IEntryAttributes e_attr) {
        ICacheProperties cacheProp = new CacheProperties();
        cacheProp.setDistributedCache(e_attr.isDistributed());
        cacheProp.setEternal(e_attr.isEternal());
        cacheProp.setTimeToLiveInSeconds(e_attr.getTimeToLiveInSeconds());
        cacheProp.setMaxMemoryIdleTimeInSeconds(e_attr.getMaxIdleTimeInSeconds());
        return createRegion(cacheProp);
    }

    static CompositeCache createRegion(ICacheProperties cache_prop) {
        CompositeCache ca = newRegion(cache_prop);
        jcsCacheRegions.put(cache_prop.getCacheRegionName(), ca);
        return ca;
    }

    static void createDefaultRegion(ICacheProperties cache_prop) {
        jcsCache = createRegion(cache_prop);

        defaultEntryAttr = new EntryAttributes();

        IElementAttributes eattr = jcsCache.getElementAttributes();
        defaultEntryAttr.setDistributed(eattr.getIsRemote());
        defaultEntryAttr.setEternal(eattr.getIsEternal());
        defaultEntryAttr.setIsSpool(eattr.getIsSpool());
        defaultEntryAttr.setMaxIdleTimeInSeconds(eattr.getIdleTime());
        defaultEntryAttr.setTimeToLiveInSeconds(eattr.getTimeToLiveSeconds());
    }

    static CompositeCache newRegion(ICacheProperties cache_prop) {

        CompositeCacheAttributes ccattr = new CompositeCacheAttributes();
        ElementAttributes eattr = new ElementAttributes();
        ccattr.setCacheName(cache_prop.getCacheRegionName());
        ccattr.setUseRemote(cache_prop.isDistributedCache());//come back abeg o!!!
        ccattr.setMaxMemoryIdleTimeSeconds(cache_prop.getMaxMemoryIdleTimeInSeconds());
        eattr.setIdleTime(cache_prop.getMaxMemoryIdleTimeInSeconds());//come back abeg o!!! -pls confirm if milliseconds
        eattr.setMaxLife(cache_prop.getTimeToLiveInSeconds());//come back abeg o!!! -pls confirm if milliseconds
        eattr.setIsEternal(cache_prop.isEternal());
        //eattr.setSize() //come back
        eattr.setIsSpool(cache_prop.isUseDiskCacheOnly());

        ICompositeCacheAttributes.DiskUsagePattern disk_patttern;
        if (cache_prop.isDiskSwapStrategy()) {
            disk_patttern = ICompositeCacheAttributes.DiskUsagePattern.SWAP;
        } else {
            disk_patttern = ICompositeCacheAttributes.DiskUsagePattern.UPDATE;
        }

        ccattr.setDiskUsagePattern(disk_patttern);
        ccattr.setMaxObjects(cache_prop.getMaxCacheObjects());
        ccattr.setMaxSpoolPerRun(cache_prop.getMaxSpoolPerRun());
        ccattr.setShrinkerIntervalSeconds(cache_prop.getShrinkerIntervalInSeconds());
        ccattr.setSpoolChunkSize(cache_prop.getSpoolChunkSize());
        ccattr.setUseDisk(cache_prop.isUseDisk());
        ccattr.setUseMemoryShrinker(cache_prop.isUseMemoryShrinker());

        CompositeCacheManager cMgr = CompositeCacheManager.getUnconfiguredInstance();
        cMgr.setDefaultCacheAttributes(ccattr);
        Properties p = new Properties();

        p.setProperty("jcs.default", "DC");
        String suffix = "";
        if (cache_prop.getCacheRegionName() == null) {
            suffix = "jcs.default";
        } else {
            suffix = "jcs.region." + cache_prop.getCacheRegionName();
        }
        p.setProperty(suffix, "DC");
        p.setProperty(suffix + ".cacheattributes", "org.apache.commons.jcs.engine.CompositeCacheAttributes");
        p.setProperty(suffix + ".cacheattributes.MemoryCacheName", "org.apache.commons.jcs.engine.memory.lru.LRUMemoryCache");
        p.setProperty(suffix + ".elementattributes", "org.apache.commons.jcs.engine.ElementAttributes");

        //Auxiliary configurable by user
        p.setProperty("jcs.auxiliary.DC.attributes", "org.apache.commons.jcs.auxiliary.disk.indexed.IndexedDiskCacheAttributes");
        p.setProperty("jcs.auxiliary.DC", "org.apache.commons.jcs.auxiliary.disk.indexed.IndexedDiskCacheFactory");
        p.setProperty("jcs.auxiliary.DC.attributes.DiskPath", String.valueOf(cache_prop.getDiskPath()));
        p.setProperty("jcs.auxiliary.DC.attributes.MaxPurgatorySize", String.valueOf(cache_prop.getDiskMaxPurgatorySize()));
        p.setProperty("jcs.auxiliary.DC.attributes.MaxKeySize", String.valueOf(cache_prop.getDisMaxKeySize()));
        p.setProperty("jcs.auxiliary.DC.attributes.OptimizeAtRemoveCount", String.valueOf(cache_prop.getDisOptimizeAtRemoveCount()));
        p.setProperty("jcs.auxiliary.DC.attributes.OptimizeOnShutdown", String.valueOf(cache_prop.getDisOptimizeOnShutdown()));
        p.setProperty("jcs.auxiliary.DC.attributes.MaxRecycleBinSize", String.valueOf(cache_prop.getDiskMaxRecyleBinSize()));
        p.setProperty("jcs.auxiliary.DC.attributes.DiskLimitType", cache_prop.getDiskLimitType().name());

        //Auxiliary configurable by server only        
        p.setProperty("jcs.auxiliary.DC2.attributes.EventQueueType", "POOLED");
        p.setProperty("jcs.auxiliary.DC2.attributes.EventQueuePoolName", "disk_cache_event_queue");

        //Thread pool configurable by server only
        p.setProperty("thread_pool.disk_cache_event_queue.useBoundary", "false");
        p.setProperty("thread_pool.disk_cache_event_queue.minimumPoolSize", "1");
        p.setProperty("thread_pool.disk_cache_event_queue.keepAliveTime", "3500");
        p.setProperty("thread_pool.disk_cache_event_queue.startUpSize", "1");
        cMgr.configure(p);

        //CacheAccess ca = JCS.defineRegion(cache_prop.getCacheRegionName());
        //OR use the CompositeCache
        CompositeCache<Object, Object> cache = cMgr.getCache(cache_prop.getCacheRegionName());
        cache.setCacheAttributes(ccattr);//important
        cache.setElementAttributes(eattr);//important
        return cache;
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.Distributed;
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
import org.apache.commons.jcs.engine.behavior.ICacheElement;
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
    static CompositeCache<Object, Object> jcsDefaultCache;
    static IEntryAttributes defaultEntryAttr;
    static CompositeCacheManager cMgr;
    static String DEFAULT_REGION_NAME = "default";

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

            if (rmtPack.getCacheRegionName().equals(DEFAULT_REGION_NAME)) {
                cache = jcsDefaultCache;
            } else {
                cache = cMgr.getCache(rmtPack.getCacheRegionName());
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

    static void distributedCallRCE(RemoteCachePacket rmtPack) {
            CompositeCache cache;

            if (rmtPack.getCacheRegionName().equals(DEFAULT_REGION_NAME)) {
                cache = jcsDefaultCache;
            } else {
                cache = cMgr.getCache(rmtPack.getCacheRegionName());
            }
            
        ICacheElement element = cache.localGet(rmtPack.getKey());
        if(element!=null){
            Distributed d = (Distributed) element.getVal();
            d.distributedCall(rmtPack.getValue());
        }
    }

    static void removeRCE(RemoteCachePacket rmtPack) {
        CompositeCache cache;
        if (rmtPack.getCacheRegionName().equals(DEFAULT_REGION_NAME)) {
            cache = jcsDefaultCache;
        } else {
            cache = cMgr.getCache(rmtPack.getCacheRegionName());
        }

        cache.localRemove(rmtPack.getKey());
    }

    static void removeAllRCE(RemoteCachePacket rmtPack) {
        try {
            CompositeCache cache;
            if (rmtPack.getCacheRegionName().equals(DEFAULT_REGION_NAME)) {
                cache = jcsDefaultCache;
            } else {
                cache = cMgr.getCache(rmtPack.getCacheRegionName());
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
        return newRegion(cacheProp);
    }

    static void createDefaultRegion(ICacheProperties cache_prop) {
        jcsDefaultCache = newRegion(cache_prop);

        defaultEntryAttr = new EntryAttributes();

        IElementAttributes eattr = jcsDefaultCache.getElementAttributes();
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
        eattr.setIsSpool(cache_prop.isUse_Disk_Cache_Only());

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
        ccattr.setUseDisk(cache_prop.isUseDiskCache());
        ccattr.setUseMemoryShrinker(cache_prop.isUseMemoryShrinker());

        cMgr = CompositeCacheManager.getUnconfiguredInstance();
        cMgr.setDefaultCacheAttributes(ccattr);
        Properties p = new Properties();

        String suffix;
        if (cache_prop.getCacheRegionName().equals(DEFAULT_REGION_NAME)) {
            suffix = "jcs.default";
        } else {
            suffix = "jcs.region." + cache_prop.getCacheRegionName();
        }

        p.setProperty(suffix + ".cacheattributes", "org.apache.commons.jcs.engine.CompositeCacheAttributes");
        p.setProperty(suffix + ".cacheattributes.MemoryCacheName", "org.apache.commons.jcs.engine.memory.lru.LRUMemoryCache");
        p.setProperty(suffix + ".elementattributes", "org.apache.commons.jcs.engine.ElementAttributes");

        //-----Auxiliary configurable by user.------
        //auiliary configuration is only necessary if UseDisk attribute is true
        if (ccattr.isUseDisk()) {
            p.setProperty(suffix, "DC");//compulsory
            p.setProperty("jcs.auxiliary.DC.attributes", "org.apache.commons.jcs.auxiliary.disk.indexed.IndexedDiskCacheAttributes");
            p.setProperty("jcs.auxiliary.DC", "org.apache.commons.jcs.auxiliary.disk.indexed.IndexedDiskCacheFactory");
            p.setProperty("jcs.auxiliary.DC.attributes.DiskPath", String.valueOf(cache_prop.getDiskPath()));
            p.setProperty("jcs.auxiliary.DC.attributes.MaxPurgatorySize", String.valueOf(cache_prop.getDiskMaxPurgatorySize()));
            p.setProperty("jcs.auxiliary.DC.attributes.MaxKeySize", String.valueOf(cache_prop.getDiskMaxKeySize()));
            p.setProperty("jcs.auxiliary.DC.attributes.OptimizeAtRemoveCount", String.valueOf(cache_prop.getDisOptimizeAtRemoveCount()));
            p.setProperty("jcs.auxiliary.DC.attributes.OptimizeOnShutdown", String.valueOf(cache_prop.isDistOptimizeOnShutdown()));
            p.setProperty("jcs.auxiliary.DC.attributes.MaxRecycleBinSize", String.valueOf(cache_prop.getDiskMaxRecyleBinSize()));
            p.setProperty("jcs.auxiliary.DC.attributes.DiskLimitType", cache_prop.getDiskLimitType().name());
            p.setProperty("jcs.auxiliary.DC.attributes.ClearDiskOnStartup", String.valueOf(cache_prop.isClearDiskCacheOnStartup()));
            p.setProperty("jcs.auxiliary.DC.attributes.ShutdownSpoolTimeLimit", String.valueOf(cache_prop.getShutdownSpoolTimeLimit()));

            //Auxiliary configurable by server only        
            p.setProperty("jcs.auxiliary.DC2.attributes.EventQueueType", "POOLED");
            p.setProperty("jcs.auxiliary.DC2.attributes.EventQueuePoolName", "disk_cache_event_queue");

            //Thread pool configurable by server only
            p.setProperty("thread_pool.disk_cache_event_queue.useBoundary", "false");
            p.setProperty("thread_pool.disk_cache_event_queue.minimumPoolSize", "1");
            p.setProperty("thread_pool.disk_cache_event_queue.keepAliveTime", "3500");
            p.setProperty("thread_pool.disk_cache_event_queue.startUpSize", "1");            
        }
        
        cMgr.configure(p);

        //CacheAccess ca = JCS.defineRegion(cache_prop.getCacheRegionName());
        //OR use the CompositeCache
        CompositeCache<Object, Object> cache = cMgr.getCache(cache_prop.getCacheRegionName());
        cache.setCacheAttributes(ccattr);//important
        cache.setElementAttributes(eattr);//important
        
        return cache;
    }
}
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
import java.util.Collections;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import org.apache.commons.jcs.JCS;
import org.apache.commons.jcs.access.CacheAccess;
import org.apache.commons.jcs.engine.CompositeCacheAttributes;
import org.apache.commons.jcs.engine.ElementAttributes;
import org.apache.commons.jcs.engine.behavior.ICompositeCacheAttributes;
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
    static ICacheProperties defaultCacheProperties;
    static IEntryAttributes defaultEntryAttr;

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

    static void putRCE(RemoteCachePacket rmtPack) {

        CacheAccess cacheAcsess;

        if (rmtPack.getCacheRegionName() == null) {
            cacheAcsess = jcsCache;
        } else {
            cacheAcsess = jcsCacheRegions.get(rmtPack.getCacheRegionName());
            if (cacheAcsess == null) {
                //region not found
                return;
            }
        }
        
        IEntryAttributes cache_prop = rmtPack.getAttributes();
        ElementAttributes attr = new ElementAttributes();
        attr.setIsSpool(cache_prop.isSpool());
        attr.setMaxLife(rmtPack.getTimeToLiveRemaining());//set the time to live remain in this case
        attr.setIdleTime(cache_prop.getMaxIdleTimeInSeconds());
        
        cacheAcsess.put(rmtPack, rmtPack, attr);

    }

    static void removeRCE(RemoteCachePacket rmtPack) {
        CacheAccess cacheAcsess;
        if (rmtPack.getCacheRegionName() == null) {
            cacheAcsess = jcsCache;
        } else {
            cacheAcsess = jcsCacheRegions.get(rmtPack.getCacheRegionName());
            if (cacheAcsess == null) {
                //region not found
                return;
            }
        }
        
        cacheAcsess.getCacheControl().localRemove(rmtPack.getKey());
    }
    static CacheAccess createRegion(IEntryAttributes e_attr) {
        ICacheProperties cacheProp = new CacheProperties();
        cacheProp.setDistributedCache(e_attr.isDistributed());
        cacheProp.setEternal(e_attr.isEternal());
        cacheProp.setTimeToLiveInSeconds(e_attr.getTimeToLiveInSeconds());
        cacheProp.setMaxMemoryIdleTimeInSeconds(e_attr.getMaxIdleTimeInSeconds());
        return createRegion(cacheProp);
    }

    static CacheAccess createRegion(ICacheProperties cache_prop) {
        CacheAccess ca = newRegion(cache_prop);
        jcsCacheRegions.put(cache_prop.getCacheRegionName(), ca);
        return ca;
    }

    static void createDefaultRegion(ICacheProperties cache_prop) {
        jcsCache = createRegion(cache_prop);     //come back   
    }

    static CacheAccess newRegion(ICacheProperties cache_prop) {
        CompositeCacheAttributes ccattr = new CompositeCacheAttributes();
        ElementAttributes eattr = new ElementAttributes();
        ccattr.setCacheName(cache_prop.getCacheRegionName());
        //ccattr.setUseRemote(cache_prop.isDistributedCache());//come back abeg o!!!
        ccattr.setMaxMemoryIdleTimeSeconds(cache_prop.getMaxMemoryIdleTimeInSeconds());
        eattr.setIdleTime(cache_prop.getMaxMemoryIdleTimeInSeconds());//come back abeg o!!! -pls confirm if milliseconds
        eattr.setMaxLife(cache_prop.getTimeToLiveInSeconds());//come back abeg o!!! -pls confirm if milliseconds
        eattr.setIsEternal(cache_prop.isEternal());
        //eattr.setSize() //come back
        eattr.setIsSpool(cache_prop.isSpool());

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

        CacheAccess ca = JCS.defineRegion(cache_prop.getCacheRegionName(), ccattr, eattr);

        return ca;
    }

}

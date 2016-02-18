/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.request;

import chuks.server.cache.LRUOptimalCache;
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

        CacheAccess cacheAcsess;

        if (rmtPack.getCacheRegionName() == null) {
            cacheAcsess = jcsCache;
        } else {
            cacheAcsess = jcsCacheRegions.get(rmtPack.getCacheRegionName());
            if (cacheAcsess == null) {
                Properties prop = new Properties();
                prop.put(Attr.CacheTimeToLive.name(), rmtPack.getTimeToLiveRemaining());
                prop.put(Attr.MaxMemoryCacheIdleTime.name(), rmtPack.getMaxIdleTimeRemaining());
                cacheAcsess = createRegion(rmtPack.getCacheRegionName(), prop, true);
            }
        }
        ElementAttributes attr = new ElementAttributes();
        attr.setIsSpool(false);//store only in memory
        attr.setMaxLife(rmtPack.getTimeToLiveRemaining());
        attr.setIdleTime(rmtPack.getMaxIdleTimeRemaining());
        cacheAcsess.put(rmtPack, rmtPack, attr);

    }

    static void putRCEInDisk(RemoteCachePacket rmtPack) {

        CacheAccess cacheAcsess;

        if (rmtPack.getCacheRegionName() == null) {
            cacheAcsess = jcsCache;
        } else {
            cacheAcsess = jcsCacheRegions.get(rmtPack.getCacheRegionName());
            if (cacheAcsess == null) {
                Properties prop = new Properties();
                prop.put(Attr.CacheTimeToLive.name(), rmtPack.getTimeToLiveRemaining());
                prop.put(Attr.MaxMemoryCacheIdleTime.name(), rmtPack.getMaxIdleTimeRemaining());
                cacheAcsess = createRegion(rmtPack.getCacheRegionName(), prop, true);
            }
        }
        ElementAttributes attr = new ElementAttributes();
        attr.setIsSpool(true);//will be flushed to disk
        attr.setMaxLife(rmtPack.getTimeToLiveRemaining());
        attr.setIdleTime(rmtPack.getMaxIdleTimeRemaining());
        cacheAcsess.put(rmtPack, rmtPack, attr);

    }

    static CacheAccess createRegion(String region_name, Properties config, boolean filter) {      
        CacheAccess ca = newRegion(region_name, config, filter);
        jcsCacheRegions.put(region_name, ca);
        return ca;
    }

    static void createDefaultRegion(Properties config, boolean filter) {      
        jcsCache = newRegion("default", config, filter);        
    }

    static CacheAccess newRegion(String region_name, Properties config, boolean filter){
        CompositeCacheAttributes ccattr = new CompositeCacheAttributes();
        ElementAttributes eattr = new ElementAttributes();
        ccattr.setCacheName(region_name);
        //get the values from the properties -  if not found then return the default.
        //put all in try catch block to swallow errors - by that we still have the default anyways.
        try {//yes long data type
            ccattr.setMaxMemoryIdleTimeSeconds((long) config.getOrDefault(Attr.MaxMemoryCacheIdleTime.name(), ccattr.getMaxMemoryIdleTimeSeconds()));
        } catch (Exception e) {
        }
        try {//yes long data type
            eattr.setIdleTime((long) config.getOrDefault(Attr.MaxMemoryCacheIdleTime.name(), eattr.getIdleTime()));
        } catch (Exception e) {
        }
        try {//yes long data type
            eattr.setMaxLife((long) config.getOrDefault(Attr.CacheTimeToLive.name(), eattr.getMaxLife()));
        } catch (Exception e) {
        }
        
        if (!filter) {

            try {
                eattr.setIsEternal((boolean) config.getOrDefault(Attr.IsCacheEternal.name(), eattr.getIsEternal()));
            } catch (Exception e) {
            }
            try {
                eattr.setSize((int) config.getOrDefault(Attr.MaxCacheSize.name(), eattr.getSize()));
            } catch (Exception e) {
            }
            try {
                eattr.setIsSpool((boolean) config.getOrDefault(Attr.SpoolCache.name(), eattr.getIsSpool()));
            } catch (Exception e) {
            }

            Object objswap = config.get(Attr.SwapCacheToDisk.name());
            ICompositeCacheAttributes.DiskUsagePattern disk_patttern = ccattr.getDiskUsagePattern();
            if (objswap != null) {
                if (objswap instanceof Boolean) {
                    boolean is_swap = (Boolean) objswap;
                    if (is_swap) {
                        disk_patttern = ICompositeCacheAttributes.DiskUsagePattern.SWAP;
                    } else {
                        disk_patttern = ICompositeCacheAttributes.DiskUsagePattern.UPDATE;
                    }
                }
            }
            ccattr.setDiskUsagePattern(disk_patttern);
            try {
                ccattr.setMaxObjects((int) config.getOrDefault(Attr.MaxCachedObjects.name(), ccattr.getMaxObjects()));
            } catch (Exception e) {
            }
            try {
                ccattr.setMaxSpoolPerRun((int) config.getOrDefault(Attr.MaxCacheSpoolPerRun.name(), ccattr.getMaxSpoolPerRun()));
            } catch (Exception e) {
            }
            try {
                ccattr.setShrinkerIntervalSeconds((long) config.getOrDefault(Attr.MemoryCacheShrinkerInterval.name(), ccattr.getMaxMemoryIdleTimeSeconds()));
            } catch (Exception e) {
            }
            try {
                ccattr.setSpoolChunkSize((int) config.getOrDefault(Attr.CacheSpoolChunkSize.name(), ccattr.getSpoolChunkSize()));
            } catch (Exception e) {
            }
            try {
                ccattr.setUseDisk((boolean) config.getOrDefault(Attr.UseDiskCache.name(), ccattr.isUseDisk()));
            } catch (Exception e) {
            }
            try {
                ccattr.setUseMemoryShrinker((boolean) config.getOrDefault(Attr.UseMemoryCacheShrinker.name(), ccattr.isUseMemoryShrinker()));
            } catch (Exception e) {
            }
        }

        CacheAccess ca = JCS.defineRegion(region_name, ccattr, eattr);
        return ca;        
    }
}

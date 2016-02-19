/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.cache.config;

import chuks.server.cache.ICacheProperties;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class CacheProperties implements ICacheProperties{
    
    protected boolean useDiskSwapStrategy;
    protected int maxCacheObject;
    protected boolean useDisk;
    private boolean useRemoteCache;
    private String regionName;
    private boolean useMemoryShrinker = false;
    private long maxMemoryIdleTime = -1;//default is -1 meaning forever
    private long shrinkerInterval = 30;
    private int maxSpoolPerRun = -1;
    private int spoolChunkSize = 2;
    private boolean eternal;
    private boolean isSpool;
    private long timeToLive = -1;//default is -1 meaning forever

    
    public CacheProperties(){
        
    }
    /**Configure the cache to use disk and set the disk strategy.
     * <br/>
     * The parameter {@code useDiskSwapStrategy} determines whether items will only go to disk when the memory limit is reached.
     * If set to true then items go to disk upon memory limit while if false then item
     * go to disk on a normal put
     * <br/>
     * The parameter {@code spool} is used to set whether is cache should go straight to the disk or not. 
     * 
     * @param useDiskCache
     * @param useDiskSwapStrategy
     * @param spool if true the cache moves straight to the disk
     */
    public CacheProperties(boolean useDiskCache, boolean useDiskSwapStrategy, boolean spool){
        this.useDisk = useDiskCache;
        this.useDiskSwapStrategy = useDiskSwapStrategy;
        this.isSpool = spool;
       
    }
    
    
    @Override
    public boolean isDiskSwapStrategy() {
        return this.useDiskSwapStrategy;
    }

    @Override
    public void setMaxCacheObjects(int size) {
        maxCacheObject = size;
    }

    @Override
    public int getMaxCacheObjects() {
        return maxCacheObject;
    }

    @Override
    public boolean isUseDisk(){
        return this.useDisk;
    }

    @Override
    public void setDistributedCache(boolean useRemoteCache) {
        this.useRemoteCache = useRemoteCache;
    }

    @Override
    public boolean isDistributedCache() {
        return useRemoteCache;
    }

    @Override
    public void setCacheRegionName(String regionName) {
        this.regionName = regionName;
    }

    @Override
    public String getCacheRegionName() {
        return regionName;
    }

    @Override
    public void setUseMemoryShrinker(boolean useShrinker) {
        useMemoryShrinker = useShrinker;
    }

    @Override
    public boolean isUseMemoryShrinker() {
        return useMemoryShrinker;
    }

    @Override
    public void setMaxMemoryIdleTimeInSeconds(long seconds) {
        this.maxMemoryIdleTime = seconds;
    }

    @Override
    public long getMaxMemoryIdleTimeInSeconds() {
        return maxMemoryIdleTime;
    }

    @Override
    public void setShrinkerIntervalInSeconds(long seconds) {
        this.shrinkerInterval = seconds;
    }

    @Override
    public long getShrinkerIntervalInSeconds() {
        return shrinkerInterval;
    }

    @Override
    public void setMaxSpoolPerRun(int maxSpoolPerRun) {
        this.maxSpoolPerRun = maxSpoolPerRun;
    }

    @Override
    public int getMaxSpoolPerRun() {
        return maxSpoolPerRun;
    }

    @Override
    public void setSpoolChunkSize(int spoolChunkSize) {
        this.spoolChunkSize = spoolChunkSize;
    }
    
    @Override
    public int getSpoolChunkSize() {
        return spoolChunkSize;
    }

    @Override
    public void setTimeToLiveInSeconds(long seconds) {
        this.timeToLive = seconds;
    }

    @Override
    public long getTimeToLiveInSeconds() {
        return timeToLive;
    }

    @Override
    public boolean isSpool() {
        return isSpool;
    }

    @Override
    public void setEternal(boolean eternal) {
        this.eternal = eternal;
    }

    @Override
    public boolean isEternal() {
        return eternal;
    }
    
}

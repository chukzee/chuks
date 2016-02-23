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
final public class CacheProperties implements ICacheProperties {

    protected boolean useDiskSwapStrategy = true;
    protected int maxCacheObject = 1000;
    protected boolean useDisk = true;
    private boolean useRemoteCache = false;
    private String regionName;
    private boolean useMemoryShrinker = false;
    private long maxMemoryIdleTime = -1;//default is -1 meaning forever
    private long shrinkerInterval = 30;
    private int maxSpoolPerRun = -1;
    private int spoolChunkSize = 2;
    private boolean eternal = false;
    private long timeToLive = -1;//default is -1 meaning forever
    private String diskPath;
    private int diskMaxPurgatorySize = 10000;
    private int diskMaxKeySize = 10000;
    private int diskOptimizeAtRemoveCount = 300000;
    private boolean diskOptimizeOnShutdown = true;
    private int diskMaxRecyleBinSize = 500;
    private DiskLimitType diskLimitType = DiskLimitType.COUNT;
    private boolean useDiskCacheOnly = false;

    public CacheProperties() {

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
    public boolean isUseDisk() {
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
    public void setEternal(boolean eternal) {
        this.eternal = eternal;
    }

    @Override
    public boolean isEternal() {
        return eternal;
    }

    @Override
    public void setDiskPath(String disk_path) {
        this.diskPath = disk_path;
    }

    @Override
    public String getDiskPath() {
        return diskPath;
    }

    @Override
    public void setDiskMaxPurgatorySize(int size) {
        diskMaxPurgatorySize = size;
    }

    @Override
    public int getDiskMaxPurgatorySize() {
        return diskMaxPurgatorySize;
    }

    @Override
    public void setDiskMaxKeySize(int size) {
        diskMaxKeySize = size;
    }

    @Override
    public int getDiskMaxKeySize() {
        return diskMaxKeySize;
    }

    @Override
    public void setDiskOptimizeAtRemoveCount(int count) {
        diskOptimizeAtRemoveCount = count;
    }

    @Override
    public int getDisOptimizeAtRemoveCount() {
        return diskOptimizeAtRemoveCount;
    }

    @Override
    public void setDiskOptimizeOnShutdown(boolean optimize) {
        diskOptimizeOnShutdown = optimize;
    }

    @Override
    public boolean getDisOptimizeOnShutdown() {
        return diskOptimizeOnShutdown;
    }

    @Override
    public void setDiskMaxRecyleBinSize(int size) {
        diskMaxRecyleBinSize = size;
    }

    @Override
    public int getDiskMaxRecyleBinSize() {
        return diskMaxRecyleBinSize;
    }

    @Override
    public void setDiskLimitType(DiskLimitType type) {
        diskLimitType = type;
    }

    @Override
    public DiskLimitType getDiskLimitType() {
        return diskLimitType;
    }

    @Override
    public void setUseDiskCacheOnly(boolean spool) {
        useDiskCacheOnly = spool;
    }

    @Override
    public boolean isUseDiskCacheOnly() {
        return useDiskCacheOnly;
    }

}

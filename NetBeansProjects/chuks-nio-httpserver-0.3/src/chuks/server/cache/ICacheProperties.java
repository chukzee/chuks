/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.cache;

import java.io.Serializable;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ICacheProperties extends Serializable {

    enum DiskLimitType {

        COUNT, SIZE
    }

    public void setTimeToLiveInSeconds(long seconds);

    public long getTimeToLiveInSeconds();

    public void setEternal(boolean eternal);

    public boolean isEternal();

    public void setUseDiskCacheOnly(boolean spool);

    public boolean isUseDiskCacheOnly();

    /**
     * Gets the disk swap strategy property
     *
     * @return
     */
    public boolean isDiskSwapStrategy();

    /**
     * setMaxCacheObjects is used to set the property to determine the maximum
     * number of objects allowed in the memory cache. If the max number of
     * objects or the cache size is set, the default for the one not set is
     * ignored. If both are set, both are used to determine the capacity of the
     * cache, i.e., object will be removed from the cache if either limit is
     * reached.
     * <p>
     * @param size The new maxObjects value
     */
    void setMaxCacheObjects(int size);

    /**
     * Gets the maximum cache objects
     * <p>
     * @return The maxObjects value
     */
    int getMaxCacheObjects();

    /**
     * Gets the useDisk property
     * <p>
     * @return The useDisk value
     */
    boolean isUseDisk();

    /**
     * Sets whether the cache is remote enabled
     * <p>
     * @param isRemote The new useRemote value
     */
    void setDistributedCache(boolean isRemote);

    /**
     * returns whether the cache is remote enabled
     * <p>
     * @return The useRemote value
     */
    boolean isDistributedCache();

    /**
     * Sets the name of the cache region.
     * <p>
     * @param s The new Region name
     */
    void setCacheRegionName(String s);

    /**
     * Gets the Region name
     * <p>
     * @return The Region name
     */
    String getCacheRegionName();

    /**
     * Whether the memory cache should perform background memory shrinkage.
     * <p>
     * @param useShrinker The new UseMemoryShrinker value
     */
    void setUseMemoryShrinker(boolean useShrinker);

    /**
     * Whether the memory cache should perform background memory shrinkage.
     * <p>
     * @return The UseMemoryShrinker value
     */
    boolean isUseMemoryShrinker();

    /**
     * If UseMemoryShrinker is true the memory cache should auto-expire elements
     * to reclaim space.
     * <p>
     * @param seconds The new MaxMemoryIdleTimeSeconds value
     */
    void setMaxMemoryIdleTimeInSeconds(long seconds);

    /**
     * If UseMemoryShrinker is true the memory cache should auto-expire elements
     * to reclaim space.
     * <p>
     * @return The MaxMemoryIdleTimeSeconds value
     */
    long getMaxMemoryIdleTimeInSeconds();

    /**
     * If UseMemoryShrinker is true the memory cache should auto-expire elements
     * to reclaim space. This sets the shrinker interval.
     * <p>
     * @param seconds The new ShrinkerIntervalSeconds value
     */
    void setShrinkerIntervalInSeconds(long seconds);

    /**
     * If UseMemoryShrinker is true the memory cache should auto-expire elements
     * to reclaim space. This gets the shrinker interval.
     * <p>
     * @return The ShrinkerIntervalSeconds value
     */
    long getShrinkerIntervalInSeconds();

    /**
     * If UseMemoryShrinker is true the memory cache should auto-expire elements
     * to reclaim space. This sets the maximum number of items to spool per run.
     * <p>
     * @param maxSpoolPerRun The new maxSpoolPerRun value
     */
    void setMaxSpoolPerRun(int maxSpoolPerRun);

    /**
     * If UseMemoryShrinker is true the memory cache should auto-expire elements
     * to reclaim space. This gets the maximum number of items to spool per run.
     * <p>
     * @return The maxSpoolPerRun value
     */
    int getMaxSpoolPerRun();

    /**
     * Number to send to disk at at time when memory is full.
     * <p>
     * @return int
     */
    int getSpoolChunkSize();

    /**
     * Number to send to disk at a time.
     * <p>
     * @param spoolChunkSize
     */
    void setSpoolChunkSize(int spoolChunkSize);

    void setDiskPath(String disk_path);

    String getDiskPath();

    void setDiskMaxPurgatorySize(int size);

    int getDiskMaxPurgatorySize();

    void setDiskMaxKeySize(int size);

    int getDisMaxKeySize();

    void setDiskOptimizeAtRemoveCount(int count);

    int getDisOptimizeAtRemoveCount();

    void setDiskOptimizeOnShutdown(boolean optimize);

    boolean getDisOptimizeOnShutdown();

    void setDiskMaxRecyleBinSize(int size);

    int getDiskMaxRecyleBinSize();

    void setDiskLimitType(DiskLimitType type);

    DiskLimitType getDiskLimitType();

}

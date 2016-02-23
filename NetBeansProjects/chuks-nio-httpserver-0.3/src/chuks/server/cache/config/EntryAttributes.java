/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.cache.config;

import chuks.server.cache.IEntryAttributes;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class EntryAttributes implements IEntryAttributes {

    /**
     * Do not edit.
     */
    private static final long serialVersionUID = 3483029485034850344L;

    /**
     * Max time in seconds the cache can live before being evicted.
     */
    private long timeToLive = -1;
    /**
     * Whether this item be flushed to disk
     */
    private boolean spoolToDisk;

    /**
     * You can turn off expiration by setting this to true. This causes the
     * cache to bypass both max life and idle time expiration.
     */
    private boolean eternal;
    /**
     * Can this item be sent to the remote cache
     */
    private boolean remote;
    /**
     * The maximum time an entry can be idle. Setting this to -1 causes the idle
     * time check to be ignored.
     */
    private long maxIdleTime = -1;

    /**
     * Max time in seconds the cache can live before being evicted.
     *
     * @param seconds
     */
    @Override
    public void setTimeToLiveInSeconds(long seconds) {
        timeToLive = seconds;
    }

    @Override
    public long getTimeToLiveInSeconds() {
        return timeToLive;
    }

    /**
     * The maximum time an entry can be idle. Setting this to -1 causes the idle
     * time check to be ignored.
     *
     * @param maxIdleTime time in seconds
     */
    @Override
    public void setMaxIdleTimeInSeconds(long maxIdleTime) {
        this.maxIdleTime = maxIdleTime;
    }

    @Override
    public long getMaxIdleTimeInSeconds() {
        return maxIdleTime;
    }

    /**
     * Whether this item be flushed to disk. Setting to true will cause the
     * cache to be flushed to disk.
     *
     * @param spoolToDisk
     */
    @Override
    public void setIsSpool(boolean spoolToDisk) {
        this.spoolToDisk = spoolToDisk;
    }

    @Override
    public boolean isSpool() {
        return spoolToDisk;
    }

    /**
     * You can turn off expiration by setting this to true. This causes the
     * cache to bypass both max life and idle time expiration.
     *
     * @param eternal
     */
    @Override
    public void setEternal(boolean eternal) {
        this.eternal = eternal;
    }

    @Override
    public boolean isEternal() {
        return eternal;
    }

    /**
     * Can this item be sent to the remote cache. Note that the item sent to
     * remote cache must obey all serialization rules. It is the duty of the
     * application to ensure the class of the object to be sent is completely
     * serializable including its member fields. Failure to obey serialization
     * rules will cause failure in transit.
     *
     * @param remote
     */
    @Override
    public void setDistributed(boolean remote) {
        this.remote = remote;
    }

    @Override
    public boolean isDistributed() {
        return remote;
    }

}

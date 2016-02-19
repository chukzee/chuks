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
public class EntryAttributes implements IEntryAttributes{
    private long timeToLive = -1;
    private boolean spoolToDisk;
    private boolean eternal;
    private boolean remote;
    private long maxIdleTime = -1;

    @Override
    public void setTimeToLiveInSeconds(long seconds) {
        timeToLive = seconds;
    }

    @Override
    public long getTimeToLiveInSeconds() {
        return timeToLive;
    }

    @Override
    public void setMaxIdleTimeInSeconds(long maxIdleTime) {
        this.maxIdleTime = maxIdleTime;
    }

    @Override
    public long getMaxIdleTimeInSeconds() {
        return maxIdleTime;
    }
    
    @Override
    public void setIsSpool(boolean spoolToDisk) {
        this.spoolToDisk = spoolToDisk;
    }

    @Override
    public boolean isSpool() {
        return spoolToDisk;
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
    public void setDistributed(boolean remote) {
        this.remote= remote;
    }

    @Override
    public boolean isDistributed() {
        return remote;
    }

}

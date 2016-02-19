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
public interface IEntryAttributes extends Serializable{

    public void setTimeToLiveInSeconds(long seconds);

    public long getTimeToLiveInSeconds();
    
    public void setMaxIdleTimeInSeconds(long maxIdleTime);

    public long getMaxIdleTimeInSeconds();

    public void setIsSpool(boolean spoolToDisk);
    
    public boolean isSpool();
    
    public void setEternal(boolean eternal);

    public boolean isEternal();

    public void setDistributed(boolean remote);
    
    public boolean isDistributed();

    
}

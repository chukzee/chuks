/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface PollAttributes {
    
    void setPollingEnabled(boolean isPoll);

    boolean isPollingEnabled();

    void setPollingInterval(float seconds);

    float getPollingInterval();
    
}
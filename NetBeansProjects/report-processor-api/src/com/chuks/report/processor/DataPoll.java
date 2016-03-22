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
public interface DataPoll extends PollAttributes {

    void setNextPollTime(long next_poll_time);

    long getNextPollTime();

    boolean pausePoll();
    
    boolean stopPoll();

    void pollData();
}
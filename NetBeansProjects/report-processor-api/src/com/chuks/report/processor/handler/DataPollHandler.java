/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.DataPoll;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.SwingUtilities;
import javax.swing.SwingWorker;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class DataPollHandler implements Runnable {

    static ConcurrentHashMap m;
    static List<DataPoll> dataPollList = Collections.synchronizedList(new LinkedList());
    static private boolean stop;
    static DataPollHandler instance;
    static ExecutorService exec;

    private DataPollHandler() {
    }

    public static void registerPoll(DataPoll poll) {
        if (!poll.isPollingEnabled()) {
            return;
        }
        synchronized (DataPollHandler.class) {
            if (instance == null) {
                instance = new DataPollHandler();
                exec = Executors.newSingleThreadExecutor();
                exec.execute(instance);
            }
        }
        //register for polling
        dataPollList.add(poll);
        setNextPollTime(poll, System.currentTimeMillis());
    }

    static private void setNextPollTime(DataPoll poll, long now) {
        long increase = (long) (poll.getPollingInterval() * 1000);//important!
        long next_time = now + increase;
        poll.setNextPollTime(next_time);
    }

    @Override
    public void run() {
        while (!stop) {
            Object[] polls = dataPollList.toArray();
            for (int i = 0; i < polls.length; i++) {
                final DataPoll poll = (DataPoll) polls[i];
                long now = System.currentTimeMillis();
                if (now >= poll.getNextPollTime()) {
                    try {
                        SwingUtilities.invokeAndWait(new Runnable() {

                            @Override
                            public void run() {

                                if (poll.stopPoll()) {
                                    dataPollList.remove(poll);//remove from this poll list
                                    return;
                                }

                                if (poll.pausePoll()) {
                                    return;//skip poll for now
                                }

                                poll.pollData();
                            }
                        });

                        setNextPollTime(poll, now);
                    } catch (InterruptedException | InvocationTargetException ex) {
                        Logger.getLogger(DataPollHandler.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (NullPointerException ex) {
                        Logger.getLogger(DataPollHandler.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (Exception ex) {
                        Logger.getLogger(DataPollHandler.class.getName()).log(Level.SEVERE, null, ex);
                    }

                }

            }
        }

    }

}

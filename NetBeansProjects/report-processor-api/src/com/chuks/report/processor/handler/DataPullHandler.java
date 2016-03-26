/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.DataPull;
import java.lang.reflect.InvocationTargetException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.SwingUtilities;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class DataPullHandler implements Runnable {

    static ConcurrentHashMap m;
    static List<DataPull> dataPollList = Collections.synchronizedList(new LinkedList());
    static private boolean stop;
    static DataPullHandler instance;
    static ExecutorService exec;

    private DataPullHandler() {
    }

    public static void registerPoll(DataPull pull) {
        if (!pull.isPullingEnabled()) {
            return;
        }
        synchronized (DataPullHandler.class) {
            if (instance == null) {
                instance = new DataPullHandler();
                exec = Executors.newSingleThreadExecutor();
                exec.execute(instance);
            }
        }
        //register for polling
        dataPollList.add(pull);
        setNextPollTime(pull, System.currentTimeMillis());
    }

    static private void setNextPollTime(DataPull pull, long now) {
        long increase = (long) (pull.getPullingInterval() * 1000);//important!
        long next_time = now + increase;
        pull.setNextPullTime(next_time);
    }

    @Override
    public void run() {
        while (!stop) {
            Object[] polls = dataPollList.toArray();
            for (int i = 0; i < polls.length; i++) {
                final DataPull pull = (DataPull) polls[i];
                long now = System.currentTimeMillis();
                if (now >= pull.getNextPullTime()) {
                    try {
                        SwingUtilities.invokeAndWait(new Runnable() {

                            @Override
                            public void run() {

                                if (pull.stopPull()) {
                                    dataPollList.remove(pull);//remove from this pull list
                                    return;
                                }

                                if (pull.pausePull()) {
                                    return;//skip pull for now
                                }

                                pull.pullData();
                            }
                        });

                        setNextPollTime(pull, now);
                    } catch (InterruptedException | InvocationTargetException ex) {
                        Logger.getLogger(DataPullHandler.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (NullPointerException ex) {
                        Logger.getLogger(DataPullHandler.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (Exception ex) {
                        Logger.getLogger(DataPullHandler.class.getName()).log(Level.SEVERE, null, ex);
                    }

                }

            }
        }

    }

}

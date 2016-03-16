/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.DataPoll;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.SwingUtilities;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class DataPollHandler implements Runnable {

    static ArrayList<DataPoll> dataPollList = new ArrayList();
    static ExecutorService pollExec;
    static private boolean stop;

    private DataPollHandler() {
    }

    static void registerPoll(DataPoll poll) {
        if (!poll.isPollingEnabled()) {
            return;
        }
        synchronized (DataPollHandler.class) {
            if (pollExec == null) {
                pollExec = Executors.newSingleThreadExecutor();
                pollExec.execute(new DataPollHandler());
            }
        }
        //register for polling
        dataPollList.add(poll);
        setNextPollTime(poll);
    }

    @Override
    public void run() {
        while (!stop) {
            Iterator<DataPoll> i = dataPollList.iterator();
            while (i.hasNext()) {
                final DataPoll poll = i.next();

                if (poll.getNextPollTime() >= System.currentTimeMillis()) {
                    try {
                        SwingUtilities.invokeAndWait(new Runnable() {
                            @Override
                            public void run() {
                                if (poll.pause()) {
                                    return;
                                }
                                poll.pollData();
                                setNextPollTime(poll);
                            }
                        });
                    } catch (InterruptedException | InvocationTargetException ex) {
                        Logger.getLogger(DataPollHandler.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            }
        }
    }

    static private void setNextPollTime(DataPoll poll) {
        long next_time = (long) (System.currentTimeMillis() + poll.getPollingInterval() * 1000);
        poll.setNextPollTime(next_time);
    }
}

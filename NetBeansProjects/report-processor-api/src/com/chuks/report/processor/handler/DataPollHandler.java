/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.DataPoll;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
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
public class DataPollHandler extends SwingWorker<DataPoll, DataPoll> implements Runnable {

    static ArrayList<DataPoll> dataPollList = new ArrayList();
    static private boolean stop;
    static DataPollHandler  instance;
    private DataPollHandler() {
    }

    public static void registerPoll(DataPoll poll) {
        if (!poll.isPollingEnabled()) {
            return;
        }
        synchronized (DataPollHandler.class) {
            if(instance==null){
                instance = new DataPollHandler();
                instance.execute();
            }
        }
        //register for polling
        dataPollList.add(poll);
        setNextPollTime(poll);
    }

    static private void setNextPollTime(DataPoll poll) {
        long next_time = (long) (System.currentTimeMillis() + poll.getPollingInterval() * 1000);
        poll.setNextPollTime(next_time);
    }

    @Override
    protected DataPoll doInBackground() throws Exception {
        while (!stop) {
            Iterator<DataPoll> i = dataPollList.iterator();
            while (i.hasNext()) {
                final DataPoll poll = i.next();

                if (poll.getNextPollTime() >= System.currentTimeMillis()) {
                    this.publish(poll);
                }
            }
        }

        return null;
    }

    @Override
    protected void process(List<DataPoll> chunks) {
        for (DataPoll poll : chunks) {
            if (poll.pause()) {
                return;
            }
            poll.pollData();
            setNextPollTime(poll);
        }
    }

}

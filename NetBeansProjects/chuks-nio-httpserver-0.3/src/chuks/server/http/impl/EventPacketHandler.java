/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class EventPacketHandler implements Runnable {

    static Map<String, List<EventPacket>> enqueuePack = Collections.synchronizedMap(new HashMap());
    private static EventPacketHandler instance;
    private static boolean isStarted;
    private static ScheduledExecutorService exec;

    private EventPacketHandler() {
    }

    static EventPacketHandler getInstance() {
        if (instance != null) {
            return instance;
        }
        synchronized (EventPacketHandler.class) {
            if (instance != null) {
                return instance;
            }
            instance = new EventPacketHandler();
            return instance;
        }
    }

    static void start() {

        synchronized (EventPacketHandler.class) {
            if (isStarted) {
                return;
            }
            isStarted = true;
        }

        exec = Executors.newSingleThreadScheduledExecutor();
        exec.scheduleAtFixedRate(instance, 0, 1, TimeUnit.MILLISECONDS);
    }

    static void stop() {
        if (exec != null) {
            exec.shutdownNow();
            instance = null;
        }
    }

    static boolean isStop() {
        return exec.isTerminated();
    }

    public static void enqueueEventPacket(String clientSessionID, String content_type, byte[] data) {
        EventPacket eventPacket = new EventPacket(content_type, data);
        List list = enqueuePack.get(clientSessionID);
        if (list == null) {
            list = new ArrayList();
            list.add(eventPacket);
            enqueuePack.put(clientSessionID, list);
        } else {
            list.add(eventPacket);
        }
    }

    @Override
    public void run() {
        try {

            Iterator<RequestTask> i = ServerHandler.tasks.iterator();
            while (i.hasNext()) {
                RequestTask r = i.next();
                List q = enqueuePack.remove(r.getSessionID());//retrive and remove
                if (q != null) {
                    r.setEventPacket(q);
                }
            }
        } catch (NullPointerException ex) {
            Logger.getLogger(EventPacketHandler.class.getName()).log(Level.SEVERE, null, ex);

        }
    }
}

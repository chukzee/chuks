/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.HttpSession;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Set;

/**
 *
 * @author USER
 */
public class HttpSessionImpl implements HttpSession{
    private boolean isNew;
    private long maxInactiveTime;
    private long lastSessionTime;
    private long timeCreated;
    private String SessionID;
    Map<String, Object> attbrMap = Collections.synchronizedMap(new HashMap());
    
    
    void setSession(Map cookieMap, String sessionID) {
        
        //ABEG COME BACK!!!
        Set<Map.Entry<String, String>> s = cookieMap.entrySet();
        Iterator<Map.Entry<String, String>> i = s.iterator();
        StringBuilder cookie = new StringBuilder();
        cookie.append("sessionToken").append("=").append(sessionID).append("; ");
        while (i.hasNext()) {
            Map.Entry<String, String> e = i.next();
            cookie.append(e.getKey()).append("=").append(e.getValue()).append("; ");
        }

    }

    
    @Override
    public String getID() {
        return SessionID;
    }

    @Override
    public Object getAttribute(String name) {
        return attbrMap.get(name);
    }

    @Override
    public Set<String> getAttributeNames() {
        return attbrMap.keySet();
    }

    @Override
    public long getTimeCreated() {
        return timeCreated;
    }

    @Override
    public long getLastSessionTime() {
        return lastSessionTime;
    }

    @Override
    public long getMaxInactiveTime() {
        return maxInactiveTime;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @Override
    public void setAttribute(String name, Object value) {
        attbrMap.put(name, value);
    }

    @Override
    public void setMaxInactiveTime(int times_in_seconds) {
        this.maxInactiveTime = times_in_seconds;
    }
    
}

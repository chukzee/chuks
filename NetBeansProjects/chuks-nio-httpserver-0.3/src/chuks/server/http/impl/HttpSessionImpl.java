/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import chuks.server.HttpSession;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.ListIterator;

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
    List listAttbr = new ArrayList();
    @Override
    public String getID() {
        return SessionID;
    }

    @Override
    public Object getAttribute(String name) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public ListIterator getAttributeNames() {
        return listAttbr.listIterator();
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
    }

    @Override
    public void setMaxInactiveTime(int times_in_seconds) {
    }
    
}

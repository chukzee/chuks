/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

import java.util.ListIterator;

/**
 *
 * @author USER
 */
public interface HttpSession {

    String getID();
    Object getAttribute(String name);
    ListIterator<String> getAttributeNames();
    long getTimeCreated();
    long getLastSessionTime();
    long getMaxInactiveTime();
    boolean isNew();
    void setAttribute(String name, Object value);
    void setMaxInactiveTime(int times_in_seconds);
    
}

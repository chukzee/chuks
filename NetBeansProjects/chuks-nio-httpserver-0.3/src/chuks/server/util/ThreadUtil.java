/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.util;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author USER
 */
public class ThreadUtil {
    
    static public void sleep(long millis){
        try {
            Thread.sleep(millis);
        } catch (InterruptedException ex) {
            Logger.getLogger(ThreadUtil.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    static public void sleep(long millis, int nanos){
        try {
            Thread.sleep(millis, nanos);
        } catch (InterruptedException ex) {
            Logger.getLogger(ThreadUtil.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}

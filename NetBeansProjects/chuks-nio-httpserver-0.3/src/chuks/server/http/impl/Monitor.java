/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

/**
 *Use this class to check or monitor the workings of the server if all is well or not
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Monitor {

    volatile static long distributedCallBeginTime;
    volatile static long distributedCallEndTime;

    /**Call this method to check if the {@code distributedCall()} method of {@link  chuks.server.Distributed} is blocking
     * 
     * @return 
     */
    boolean isDistributedCallBlocking() {
        
        int seconds = 10;
        if (distributedCallEndTime - distributedCallBeginTime < 0) {
            if ((System.nanoTime() - distributedCallBeginTime) / Math.pow(10, 9) >= seconds) {
                return true;
            }
        }

        return false;
    }

    long getDistributedCallBlockingSeconds() {
        if (distributedCallEndTime - distributedCallBeginTime < 0) {
            return (long) ((System.nanoTime() - distributedCallBeginTime) / Math.pow(10, 9));
        }
        return 0;
    }

}

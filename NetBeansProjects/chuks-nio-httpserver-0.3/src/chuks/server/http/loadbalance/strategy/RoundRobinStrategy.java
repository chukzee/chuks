/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.loadbalance.strategy;

import chuks.server.http.impl.ServerConfig;
import chuks.server.http.loadbalance.LoadBalanceStrategy;
import java.util.Arrays;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class RoundRobinStrategy implements LoadBalanceStrategy {

    private boolean isRedirect;
    int next = -1;

    @Override
    public String getRedirectServerAddress() {
        String addr;
        try {
            //first check if the list is exhausted
            if (next >= ServerConfig.getClusterServersAddresses().length) {
                next = -1;//start from begining
                isRedirect = false;
                return null;//implies request should not be redirected
            }
            next++;
            addr = ServerConfig.getClusterServersAddresses()[next];
            isRedirect = true;
        } catch (ArrayIndexOutOfBoundsException ex) {//just in case the config was modified while server is running
            next = -1;//start from begining
            isRedirect = false;
            return null;//implies request should not be redirected
        }
        return addr;
    }

    @Override
    public boolean isRedirect() {
        return isRedirect;
    }

}

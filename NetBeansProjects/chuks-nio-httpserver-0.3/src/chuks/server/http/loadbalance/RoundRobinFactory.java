/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.loadbalance;

import chuks.server.http.loadbalance.strategy.RoundRobinStrategy;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class RoundRobinFactory extends AbstractLoadBalanceFactory{

    @Override
    public LoadBalanceStrategy getStrategy() {
        return new RoundRobinStrategy();
    }
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.loadbalance;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public abstract class AbstractLoadBalanceFactory {
    
    public abstract LoadBalanceStrategy getStrategy();
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

import java.io.Serializable;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface Distributed extends Serializable{
    
    public void distributedCall(Object obj);
}

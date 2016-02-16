/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.util.Iterator;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Test1 {
    
    public static void main(String... args){
        ConcurrentLinkedQueue q = new ConcurrentLinkedQueue();
        q.add("1");
        Iterator i = q.iterator();
        Iterator i1 = q.iterator();
        System.out.println(i.hasNext());
        i.next();
        System.out.println(i.hasNext());
        System.out.println(i1.hasNext());
    }
}

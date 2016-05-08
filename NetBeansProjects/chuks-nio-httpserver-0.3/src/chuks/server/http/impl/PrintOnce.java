/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final class PrintOnce {

    static List l = Collections.synchronizedList(new LinkedList());

    static void err(String key, String msg) {
        if (l.contains(key)) {
            return;
        }
        System.err.println(msg);
        l.add(key);
    }

    static void out(String key, String msg) {
        if (l.contains(key)) {
            return;
        }
        System.out.println(msg);
        l.add(key);
    }
}

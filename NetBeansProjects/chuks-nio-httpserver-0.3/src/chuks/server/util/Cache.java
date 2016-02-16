/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.util;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 * @param <K>
 * @param <V>
 */
public interface Cache<K,V> {
    
    void put(K key, V value);
    V get(K key);
    V remove(K key);
    void clear();
    int size();
}

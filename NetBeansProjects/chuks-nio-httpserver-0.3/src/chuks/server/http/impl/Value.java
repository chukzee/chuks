/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

/**
 *
 * @author USER
 */
public class Value<T> {

    boolean isArray;
    T value;

    public Value(T v, boolean is_array) {
        value = v;
        isArray = is_array;
    }

    public T get() {
        return value;
    }

    public boolean isArray() {
        return this.isArray;
    }

    @Override
    public String toString() {
        if (isArray) {
            T[] v1 = (T[]) value;
            String s = "[";
            for (int i = 0; i < v1.length; i++) {
                s += i < v1.length - 1 ? v1[i] + "," : v1[i];
            }
            s += "]";
            return s;
        }
        return value.toString();
    }
}

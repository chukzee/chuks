/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server.http.impl;

/**
 *
 * @author USER
 */
public class NameValue {

    Object value;
    String name;

    public NameValue(String name, Object value) {
        this.name = name;
        this.value = value;
    }

    public Object getValue() {
        return value;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return name + " : " + (value != null ? value : "");
    }
    
}

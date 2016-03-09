/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.util;

/**
 *
 * @author USER
 */
public class NameValue {

    String value;
    String name;

    public NameValue(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public String getValue() {
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

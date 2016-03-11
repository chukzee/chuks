/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.form.controls.JNext;
import com.chuks.report.processor.form.controls.JPrevious;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TestCast {
    public static void main(String[] args) {
        JNext jnext1 = new JNext();
        jnext1.setText("next 1");
        
        JNext jnext2 = new JNext();
        jnext2.setText("next 2");
        
        jnext1.getClass().cast(jnext2);
        
        System.out.println(jnext1);
        System.out.println(jnext2);
        System.out.println("----------");
        System.out.println(jnext1.getText());
        System.out.println(jnext2.getText());
    }
}

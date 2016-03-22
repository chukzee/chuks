/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.form.controls;

import com.chuks.report.processor.event.FormActionListener;
import java.awt.event.ActionListener;
import javax.swing.JButton;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final public class JFirst extends JButton implements FormControl {

    private boolean failed;

    public JFirst() {
        super();
    }

    public JFirst(String text) {
        super(text);
    }

    /**
     * override <code>addActionListener()</code> method and prevent problems
     * arising from multiple use of form action listeners by same control
     *
     * @param l
     */
    @Override
    public void addActionListener(ActionListener l) {
        ActionListener[] listeners = this.getActionListeners();
        int count = 0;
        for (ActionListener listener : listeners) {
            if (listener instanceof FormActionListener) {
                count++;
                if (count > 0) {//already has
                    throw new IllegalStateException("Cannot add another form action listener! Control already bound to another form - " + this.getClass().getName());
                }
            }
        }
        super.addActionListener(l);
    }

    public void controlFailedState(boolean failed) {
        if (failed) {
            this.failed = failed;
            super.setEnabled(false);
        }
    }

    @Override
    public void setEnabled(boolean enabled) {
        if (failed) {
            super.setEnabled(false);
            return;
        }
        super.setEnabled(enabled); //To change body of generated methods, choose Tools | Templates.
    }

}
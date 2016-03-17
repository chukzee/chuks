/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.form.controls;

import com.chuks.report.processor.event.FormActionListener;
import java.awt.Component;
import java.awt.LayoutManager;
import java.awt.event.ActionListener;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final public class JMoveTo extends Box implements FormControl {

    private int num;
    /**
     * extend JTextField to override <code>addActionListener()</code> method and
     * prevent problems arising from multiple use of form action listeners by
     * same control
     */
    private JTextField txt = new JTextField() {
        @Override
        public void addActionListener(ActionListener l) {
            ActionListener[] listeners = this.getActionListeners();
            int count = 0;
            for (ActionListener listener : listeners) {
                if (listener instanceof FormActionListener) {
                    count++;
                    System.out.println("count " + count);
                    if (count > 0) {//already has
                        throw new IllegalStateException("Cannot add another form action listener! Control already bound to another form - " + this.getClass().getName());
                    }
                }
            }
            super.addActionListener(l);
        }
    };

    /**
     * extend JButton to override <code>addActionListener()</code> method and
     * prevent problems arising from multiple use of form action listeners by
     * same control
     */
    private JButton btn = new JButton("Go") {

        @Override
        public void addActionListener(ActionListener l) {
            ActionListener[] listeners = this.getActionListeners();
            int count = 0;
            for (ActionListener listener : listeners) {
                if (listener instanceof FormActionListener) {
                    count++;
                    System.out.println("count " + count);
                    if (count > 0) {//already has
                        throw new IllegalStateException("Cannot add another form action listener! Control already bound to another form - " + this.getClass().getName());
                    }
                }
            }
            super.addActionListener(l);
        }
    };

    int indexComp = -1;
    private boolean failed;

    public JMoveTo() {
        super(BoxLayout.LINE_AXIS);

        add(txt);
        add(btn);

        btn.setSize(50, 20);

        txt.addFocusListener(new FocusAdapter() {

            @Override
            public void focusLost(FocusEvent e) {
                validateText(txt.getText());
            }

        });
    }

    public void addButtonActionListener(ActionListener l) {
        btn.addActionListener(l);
    }

    public void removeButtonActionListener(ActionListener l) {
        btn.removeActionListener(l);
    }

    public void addTextActionListener(ActionListener l) {
        txt.addActionListener(l);
    }

    public void removeTextActionListener(ActionListener l) {
        txt.removeActionListener(l);
    }

    private int validateText(String text) {
        try {
            int prev = num;
            num = Integer.parseInt(txt.getText());
            if (num < 0) {
                num = prev;
                txt.setText(String.valueOf(num));
            }
        } catch (NumberFormatException ex) {
            txt.setText(String.valueOf(num));
        }
        return num;
    }

    public int getMoveToIndex() {
        if (txt.getText().isEmpty()) {
            return -1;
        }
        int record_number = validateText(txt.getText());
        int record_index = record_number - 1;
        return record_index;
    }

    public void setRecordNumber(int num) {
        txt.setText(Integer.toString(num));
        this.num = num;
    }

    /*
     @Override
     final protected void addImpl(Component comp, Object constraints, int index) {
     if (txt != null && btn != null) {
     return;
     }
     if (!(comp instanceof JTextField) && !(comp instanceof JButton)) {
     return;
     }
     if (comp instanceof JTextField && txt != null) {
     return;
     }
     if (comp instanceof JButton && btn != null) {
     return;
     }

     indexComp++;
     if (indexComp == 0 && !(comp instanceof JTextField)) {
     throw new IllegalArgumentException("Text field should be added first.");
     }
     super.addImpl(comp, constraints, index); //To change body of generated methods, choose Tools | Templates.
     }

     @Override
     final public void remove(int index) {
     super.remove(index);
     }
     */

    @Override
    public void setToolTipText(String text) {
        txt.setToolTipText(text);
        btn.setToolTipText(text);
        super.setToolTipText(text); //To change body of generated methods, choose Tools | Templates.
    }
    
    public void  controlFailedState(boolean failed){
        if(failed){
            this.failed= failed;
            super.setEnabled(false);
        }
    }

    @Override
    public void setEnabled(boolean enabled) {
       if(failed){
           super.setEnabled(false);
           return;
       }
        super.setEnabled(enabled); //To change body of generated methods, choose Tools | Templates.
    }
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.form.controls;

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
final public class JMoveTo extends JPanel implements FormControl {

    private JTextField txt;
    private JButton btn;
    int indexComp = -1;

    public JMoveTo() {
        super(true);

        txt = new JTextField();
        btn = new JButton("Go");
        add(btn);
        add(txt);
                
        txt.setBounds(0,0, 40, 20);
        btn.setBounds(40,0, 50, 20);
        btn.getInsets().set(0, 0, 0, 0);//not working
        //this.setLayout(new BoxLayout(this, BoxLayout.X_AXIS));//not working, i do not know why.
        
        txt.addFocusListener(new FocusAdapter() {
            private int num;

            @Override
            public void focusLost(FocusEvent e) {
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

    public int getMoveToIndex() {
        if (txt.getText().isEmpty()) {
            return -1;
        }
        return Integer.parseInt(txt.getText());
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
}

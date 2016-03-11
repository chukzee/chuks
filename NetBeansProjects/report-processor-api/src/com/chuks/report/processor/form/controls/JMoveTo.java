/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.form.controls;

import java.awt.Component;
import java.awt.event.ActionListener;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTextField;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final public class JMoveTo extends Box implements FormControl {

    private JTextField txt;
    private JButton btn;
    int indexComp = -1;
    
     public JMoveTo() {
        super(BoxLayout.LINE_AXIS);
    }
    
    private JMoveTo(int axis) {
        
        super(axis);
        txt = new JTextField();
        btn = new JButton();
        add(txt);
        add(btn);
        
        
    }

   public void addButtonActionListener(ActionListener l){
       btn.addActionListener(l);
   }

   public void removeButtonActionListener(ActionListener l){
       btn.removeActionListener(l);
   }
   
   public void addTextActionListener(ActionListener l){
       txt.addActionListener(l);
   }

   public void removeTextActionListener(ActionListener l){
       txt.removeActionListener(l);
   }
   
    @Override
    final protected void addImpl(Component comp, Object constraints, int index) {
        if (txt != null && btn != null) {
            return;
        }
        if (!(comp instanceof JTextField) && !(comp instanceof JButton)) {
            return;
        }
        if (comp instanceof JTextField && txt != null ) {
            return;
        }
        if (comp instanceof JButton && btn != null ) {
            return;
        }
        
        indexComp ++;
        if(indexComp==0 && !(comp instanceof JTextField)){
            throw new IllegalArgumentException("Text field should be added first.");
        }
        super.addImpl(comp, constraints, index); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    final public void remove(int index) {
        super.remove(index);
    }

    public int getMoveToIndex() {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return Integer.parseInt(txt.getText());
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.form.controls;

import java.awt.Component;
import java.awt.Dimension;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.Box;
import javax.swing.BoxLayout;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final public class JControllerPane extends Box {

    List formControls = new ArrayList();
    Map compMap = new HashMap();

    //private static final String[] CONTROLS_NAMES ={}; 
    enum CONTROLS_NAMES {

        jfind, jmoveto, jprevious, jnext, jsave, jcounter, jreset, jfirst, jlast,
    }

    public JControllerPane() {
        super(BoxLayout.LINE_AXIS);

        addJFind();
        addJMoveTo();
        addJCounter();
        addJPrevious();
        addJNext();
        addJSave();
        addJReset();
        addJFirst();
        addJLast();

    }

    public FormControl[] getPaneControls() {
        Collection v = this.compMap.values();
        FormControl[] controls = new FormControl[compMap.size()];
        v.toArray(controls);
        return controls;
    }

    @Override
    protected void addImpl(Component comp, Object constraints, int index) {
        if (!(comp instanceof JSave)
                && !(comp instanceof JReset)
                && !(comp instanceof JFind)
                && !(comp instanceof JNext)
                && !(comp instanceof JPrevious)
                && !(comp instanceof JFirst)
                && !(comp instanceof JLast)
                && !(comp instanceof JCounter)
                && !(comp instanceof JMoveTo)) {

            return;
        }

        if (compMap.containsKey(comp.getClass().getName())) {
            return;
        }

        if (comp instanceof JSave) {
            compMap.put(comp.getClass().getName(), comp);
            formControls.add("jsave");
        }
        if (comp instanceof JReset) {
            compMap.put(comp.getClass().getName(), comp);
            formControls.add("jreset");
        }
        if (comp instanceof JFind) {
            compMap.put(comp.getClass().getName(), comp);
            formControls.add("jfind");
        }
        if (comp instanceof JNext) {
            compMap.put(comp.getClass().getName(), comp);
            formControls.add("jnext");
        }
        if (comp instanceof JPrevious) {
            compMap.put(comp.getClass().getName(), comp);
            formControls.add("jprevious");
        }
        if (comp instanceof JFirst) {
            compMap.put(comp.getClass().getName(), comp);
            formControls.add("jfirst");
        }
        if (comp instanceof JLast) {
            compMap.put(comp.getClass().getName(), comp);
            formControls.add("jlast");
        }
        if (comp instanceof JMoveTo) {
            compMap.put(comp.getClass().getName(), comp);
            formControls.add("jmoveto");
        }
        if (comp instanceof JCounter) {
            compMap.put(comp.getClass().getName(), comp);
            formControls.add("jcounter");
        }

        super.addImpl(comp, constraints, index);
    }

    private void addJSave() {
        JSave jsave = new JSave("Save");
        jsave.setSize(new Dimension(80, 35));
        jsave.setToolTipText("Save");
        add(jsave);

    }

    private void addJReset() {
        JReset jreset = new JReset("Reset");
        jreset.setSize(new Dimension(80, 35));
        jreset.setToolTipText("Reset the form");

        add(jreset);

    }

    private void addJFind() {

        JFind jfind = new JFind();
        jfind.setSize(new Dimension(120, 35));
        add(jfind);

    }

    private void addJNext() {

        JNext jnext = new JNext(">>");
        jnext.setSize(new Dimension(80, 35));
        jnext.setToolTipText("Move to next record");

        add(jnext);
    }

    private void addJPrevious() {

        JPrevious jprevious = new JPrevious("<<");
        jprevious.setSize(new Dimension(80, 35));
        jprevious.setToolTipText("Move to previous record");

        add(jprevious);
    }

    private void addJFirst() {

        JFirst jfirst = new JFirst("F");
        jfirst.setSize(new Dimension(80, 35));
        jfirst.setToolTipText("Move to first record");

        add(jfirst);
    }

    private void addJLast() {

        JLast jlast = new JLast("L");
        jlast.setSize(new Dimension(80, 35));
        jlast.setToolTipText("Move to last record");

        add(jlast);
    }

    private void addJMoveTo() {

        JMoveTo jmoveto = new JMoveTo();
        jmoveto.setSize(new Dimension(80, 35));
        jmoveto.setToolTipText("Move to record number");

        add(jmoveto);
    }

    private void addJCounter() {

        JCounter jcounter = new JCounter();
        jcounter.setSize(new Dimension(70, 35));
        jcounter.setAppendedText("Record");
        jcounter.setAppendedTextPlural("Records");
        add(jcounter);
    }

    public void removeJSave() {
        Component[] comps = this.getComponents();
        JSave jsave = null;
        for (Component comp : comps) {
            if (comp instanceof JSave) {
                jsave = (JSave) comp;
                break;
            }
        }
        if (jsave == null) {
            return;
        }
        this.remove(jsave);
        compMap.remove(jsave.getClass().getName());
        this.repaint();
    }

    public void removeJReset() {
        Component[] comps = this.getComponents();
        JReset jreset = null;
        for (Component comp : comps) {
            if (comp instanceof JReset) {
                jreset = (JReset) comp;
                break;
            }
        }
        if (jreset == null) {
            return;
        }
        this.remove(jreset);
        compMap.remove(jreset.getClass().getName());
        this.repaint();
    }

    public void removeJFind() {
        Component[] comps = this.getComponents();
        JFind jfind = null;
        for (Component comp : comps) {
            if (comp instanceof JFind) {
                jfind = (JFind) comp;
                break;
            }
        }
        if (jfind == null) {
            return;
        }
        this.remove(jfind);
        compMap.remove(jfind.getClass().getName());
        this.repaint();
    }

    public void removeJNext() {
        Component[] comps = this.getComponents();
        JNext jnext = null;
        for (Component comp : comps) {
            if (comp instanceof JNext) {
                jnext = (JNext) comp;
                break;
            }
        }
        if (jnext == null) {
            return;
        }
        this.remove(jnext);
        compMap.remove(jnext.getClass().getName());
        this.repaint();
    }

    public void removeJPrevious() {
        Component[] comps = this.getComponents();
        JPrevious jprevious = null;
        for (Component comp : comps) {
            if (comp instanceof JPrevious) {
                jprevious = (JPrevious) comp;
                break;
            }
        }
        if (jprevious == null) {
            return;
        }
        this.remove(jprevious);
        compMap.remove(jprevious.getClass().getName());
        this.repaint();
    }

    public void removeJFirst() {
        Component[] comps = this.getComponents();
        JFirst jfirst = null;
        for (Component comp : comps) {
            if (comp instanceof JFirst) {
                jfirst = (JFirst) comp;
                break;
            }
        }
        if (jfirst == null) {
            return;
        }
        this.remove(jfirst);
        compMap.remove(jfirst.getClass().getName());
        this.repaint();
    }

    public void removeJLast() {
        Component[] comps = this.getComponents();
        JLast jlast = null;
        for (Component comp : comps) {
            if (comp instanceof JLast) {
                jlast = (JLast) comp;
                break;
            }
        }
        if (jlast == null) {
            return;
        }
        this.remove(jlast);
        compMap.remove(jlast.getClass().getName());
        this.repaint();
    }

    public void removeJMoveTo() {
        Component[] comps = this.getComponents();
        JMoveTo jmoveto = null;
        for (Component comp : comps) {
            if (comp instanceof JMoveTo) {
                jmoveto = (JMoveTo) comp;
                break;
            }
        }
        if (jmoveto == null) {
            return;
        }
        this.remove(jmoveto);
        compMap.remove(jmoveto.getClass().getName());
        this.repaint();
    }

    public void removeJCounter() {
        Component[] comps = this.getComponents();
        JCounter jcounter = null;
        for (Component comp : comps) {
            if (comp instanceof JCounter) {
                jcounter = (JCounter) comp;
                break;
            }
        }
        if (jcounter == null) {
            return;
        }
        this.remove(jcounter);
        compMap.remove(jcounter.getClass().getName());
        this.repaint();
    }

    public void removeAllFormCotrols() {
        this.removeAll();
        this.repaint();
        formControls.clear();
        compMap.clear();
    }

    public void setFormControls(String... controls) {

        for (int i = 0; i < controls.length; i++) {
            String control = controls[i];
            control = control.toLowerCase();//convert to lowercase - all must be in lower case
            if (!isKnown(control)) {
                controls[i] = null;//cancel
            }
        }

        removeAllFormCotrols();

        for (String control : controls) {
            if (control == null) {
                continue;//was cancelled
            }
            addControlByName(control);
        }
    }

    private void addControlByName(String control) {
        switch (control) {
            case "jsave":
                addJSave();
                break;
            case "jfind":
                addJFind();
                break;
            case "jmoveto":
                addJMoveTo();
                break;
            case "jnext":
                addJNext();
                break;
            case "jprevious":
                addJPrevious();
                break;
            case "jreset":
                addJReset();
                break;
            case "jfirst":
                addJFirst();
                break;
            case "jlast":
                addJLast();
                break;
            case "jcounter":
                addJCounter();
                break;
        }
    }

    public String[] getFormControls() {
        String[] names = new String[formControls.size()];
        formControls.toArray(names);
        return names;
    }

    private boolean isKnown(String name) {
        for (CONTROLS_NAMES c : CONTROLS_NAMES.values()) {
            if (c.name().equalsIgnoreCase(name)) {
                return true;
            }
        }
        return false;
    }
}

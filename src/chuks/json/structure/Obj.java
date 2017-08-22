/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.json.structure;

/**
 *
 * @author USER
 */
public class Obj {
    String[] js = new String[0];
    String[] css = new String[0];
    String[] load_exceptions = new String[0];

    public String[] getJs() {
        return js == null? js = new String[0]: js;
    }

    public void setJs(String[] js) {
        this.js = js;
    }

    public String[] getCss() {
        return css == null? css = new String[0]: css;
    }

    public void setCss(String[] css) {
        this.css = css;
    }

    public String[] getLoadExceptions() {
        return load_exceptions == null? load_exceptions = new String[0]: load_exceptions;
    }

    public void setLoad_exceptions(String[] load_exceptions) {
        this.load_exceptions = load_exceptions;
    }
    
    
}

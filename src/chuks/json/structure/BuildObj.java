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
public class BuildObj extends BaseObj{
    
    boolean prod;
    String[] merge_js = new String[0];

    public boolean isProd() {
        return prod;
    }

    public void setProd(boolean prod) {
        this.prod = prod;
    }

    public String[] getMergeJs() {
        return merge_js;
    }

    public void setMergeJs(String[] merge_js) {
        this.merge_js = merge_js;
    }
    
    
    
}

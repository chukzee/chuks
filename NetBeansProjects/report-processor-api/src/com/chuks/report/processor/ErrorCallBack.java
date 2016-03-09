/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import javax.swing.JComponent;

/**
 *
 * @author USER
 */
public interface ErrorCallBack {
    void onError(JComponent compent, String accessible_name);
}

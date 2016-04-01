/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.param;

import com.chuks.report.processor.Feedback;
import com.chuks.report.processor.Option;
import java.awt.Component;
import javax.swing.JComponent;
import javax.swing.JOptionPane;

/**
 *
 * @author USER
 */
final public class ErrorAlert implements ErrorCallBack {

    private String msg_append = "";
    private String title = "Invalid";
    private final Feedback feedback;

    public ErrorAlert(Feedback feedback) {
        this.feedback = feedback;
    }

    public void setMsgAppend(String msg_append) {
        this.msg_append = msg_append;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public void onError(JComponent compent, String accessible_name) {
        feedback.alert(accessible_name == null ? 
                msg_append : (accessible_name + " " + msg_append), 
                title, Option.ERROR);
    }
}

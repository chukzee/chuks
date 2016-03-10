/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.bind.ListBindHanler;
import com.chuks.report.processor.bind.TextBindHandler;
import java.awt.Container;
import java.sql.SQLException;
import javax.swing.Box;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import com.chuks.report.processor.form.controls.FormControl;
import com.chuks.report.processor.form.controls.JControllerPane;
import javax.swing.JComboBox;
import javax.swing.JList;
import javax.swing.JTextField;

/**
 *
 * @author USER
 * @param <T>
 */
public interface FormProcessor<T> extends UIDBProcessor, IValidator {

    void bind(JList list, ListBindHanler handler);

    void bind(JComboBox combo, ListBindHanler handler);

    void bind(JTextField textField, TextBindHandler handler);

    void bind(JLabel label, TextBindHandler handler);

    Form loadOnForm(FormFieldMapper mapper, FormControl... controls) throws SQLException;

    Form loadOnForm(FormFieldMapper mapper, JControllerPane controllers_pane) throws SQLException;

    void showJNext(boolean display);

    void showJPrevious(boolean display);

    void showJMove(boolean display);

    void showJCounter(boolean display);

    void showJFind(boolean display);

    void showJSave(boolean display);

    void showJReset(boolean display);

}

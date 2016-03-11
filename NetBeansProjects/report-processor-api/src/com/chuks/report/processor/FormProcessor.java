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
    
    /**
     *
     * @param dataInputHandler
     * @param updateFieldHandler
     * @param controls
     * @throws java.sql.SQLException
     */
    void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, FormControl... controls) throws SQLException ;
    

    /**
     *
     * @param dataInputHandler
     * @param updateFieldHandler
     * @param controllers_pane
     * @throws java.sql.SQLException
     */
    void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, JControllerPane controllers_pane) throws SQLException ;
    
    void formLoad(FormFieldCallBack callBack, FormFieldMapper mapper,  FormPostHandler updateFieldHandler, FormControl... controls) throws SQLException;

    void formLoad(FormFieldCallBack callBack, FormFieldMapper mapper,  FormPostHandler updateFieldHandler, JControllerPane controllers_pane) throws SQLException;

}

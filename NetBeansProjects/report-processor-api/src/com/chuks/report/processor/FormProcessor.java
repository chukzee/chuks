/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.bind.ListBindHanler;
import com.chuks.report.processor.bind.TextBindHandler;
import javax.swing.JLabel;
import com.chuks.report.processor.form.controls.FormControl;
import com.chuks.report.processor.form.controls.JControllerPane;
import javax.swing.JComboBox;
import javax.swing.JList;
import javax.swing.text.JTextComponent;

/**
 *
 * @author USER
 * @param <T>
 */
public interface FormProcessor<T> extends UIDBProcessor, IValidator {

    void bind(JList list, ListBindHanler handler);

    void bind(JComboBox combo, ListBindHanler handler);

    void bind(JTextComponent textComp, TextBindHandler handler);

    void bind(JLabel label, TextBindHandler handler);

    /**
     *
     * @param dataInputHandler
     * @param postFieldHandler
     * @param controls
     */
    void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler postFieldHandler, FormControl... controls);

    /**
     *
     * @param dataInputHandler
     * @param updateFieldHandler
     * @param controllers_pane
     */
    void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, JControllerPane controllers_pane);

    void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, JControllerPane controllers_pane, FormControl... controls);

    void formLoad(FormFieldCallBack callBack, FormPostHandler updateFieldHandler, FormFieldMapper mapper, FormControl... controls);

    void formLoad(FormFieldCallBack callBack, FormPostHandler updateFieldHandler, FormFieldMapper mapper, JControllerPane controllers_pane);

    void formLoad(FormFieldCallBack callBack, FormPostHandler updateFieldHandler, FormFieldMapper mapper, JControllerPane controllers_pane, FormControl... controls);

}

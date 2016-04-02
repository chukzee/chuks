/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.param.FormFieldMapper;
import com.chuks.report.processor.param.FormFieldCallBack;
import com.chuks.report.processor.handler.FormDataInputHandler;
import com.chuks.report.processor.handler.FormPostHandler;
import com.chuks.report.processor.handler.ListBindHanler;
import com.chuks.report.processor.handler.TextBindHandler;
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
     * Use this method to have flexibility on how data is sent to the form. This
     * method also allow loading a form without any data. That is, form data can
     * be posted even when the form was not loaded with data.
     *
     * @param dataInputHandler
     * @param postFieldHandler
     * @param controls
     */
    void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler postFieldHandler, FormControl... controls);

    /**
     * Use this method to have flexibility on how data is sent to the form. This
     * method also allow loading a form without any data. That is, form data can
     * be posted even when the form was not loaded with data.
     *
     * @param dataInputHandler
     * @param updateFieldHandler
     * @param controllers_pane
     */
    void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, JControllerPane controllers_pane);

    /**
     * Use this method to have flexibility on how data is sent to the form. This
     * method also allow loading a form without any data. That is, form data can
     * be posted even when the form was not loaded with data.
     *
     * @param dataInputHandler
     * @param updateFieldHandler
     * @param controllers_pane
     * @param controls
     */
    void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, JControllerPane controllers_pane, FormControl... controls);

    /**
     * This method is useful when the data is only from a database. This method
     * also don allow loading a form without any data. That is, form data cannot
     * be posted when the form was not loaded with data. For form to be posted
     * the fields must have been mapped to columns in the database an it is
     * illegal to map field to columns in database without columns being
     * selected in a select query. Therefore , not performing a select query
     * before the form is loaded renders the form unusable.
     *
     * @param callBack
     * @param updateFieldHandler
     * @param mapper
     * @param controls
     */
    void formLoad(FormFieldCallBack callBack, FormPostHandler updateFieldHandler, FormFieldMapper mapper, FormControl... controls);

    /**
     * This method is useful when the data is only from a database. This method
     * also don allow loading a form without any data. That is, form data cannot
     * be posted when the form was not loaded with data. For form to be posted
     * the fields must have been mapped to columns in the database an it is
     * illegal to map field to columns in database without columns being
     * selected in a select query. Therefore , not performing a select query
     * before the form is loaded renders the form unusable.
     *
     * @param callBack
     * @param updateFieldHandler
     * @param mapper
     * @param controllers_pane
     */
    void formLoad(FormFieldCallBack callBack, FormPostHandler updateFieldHandler, FormFieldMapper mapper, JControllerPane controllers_pane);

    /**
     * This method is useful when the data is only from a database. This method
     * also don allow loading a form without any data. That is, form data cannot
     * be posted when the form was not loaded with data. For form to be posted
     * the fields must have been mapped to columns in the database an it is
     * illegal to map field to columns in database without columns being
     * selected in a select query. Therefore , not performing a select query
     * before the form is loaded renders the form unusable.
     *
     * @param callBack
     * @param updateFieldHandler
     * @param mapper
     * @param controllers_pane
     * @param controls
     */
    void formLoad(FormFieldCallBack callBack, FormPostHandler updateFieldHandler, FormFieldMapper mapper, JControllerPane controllers_pane, FormControl... controls);
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import java.awt.Component;
import javax.swing.JComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface FormFieldPost extends Feedback {

    /**
     * Gets an array of field objects representing the form fields. It returns
     * the fields if the record index is beyond the reset value ie -1 otherwise
     * it return null or empty array depending on the implementation. To check
     * if the field objects can be retrieved call  <code>isUpdate()</code>method.
     * A value of true indicates the field objects are available otherwise
     * false.
     * <br/>
     * Note unlike Table field update, this method returns all fields in the
     * form. It is upto the client to post all fields or only the changes made
     * by comparing the old and new value of the field or simply checking the
     * return value of <code>isUpdated()</code> of {@link IFormField} object
     *
     * @return
     */
    IFormField[] getFormFields();

    /**
     * Returns true if the form fields is on reset. ie the record index is at
     * reset value of -1.
     *
     * @return
     */
    boolean isNew();

    /**
     * Returns true if the form fields is not on reset. ie the record index is
     * greater than reset value of -1.
     *
     * @return
     */
    boolean isUpdate();

    /**
     * Number of the field objects returned . Actually this returns the total
     * fields in the form.
     *
     * @return
     */
    int count();

    /**
     * Call this method to cause the record to be refreshed after the
     * {@link com.chuks.report.processor.FormPostHandler} is executed. The
     * default implementation always refresh the records after the handler is
     * executed. Setting this method to false may be useful in cases where an
     * errors and the client does not which to refresh the record as it is
     * meaningless
     *
     * @param is_refresh set to true to allow refresh otherwise false.
     */
    void refresh(boolean is_refresh);

    /**
     * Call this method to check whether records will be refreshed after the
     * {@link com.chuks.report.processor.FormPostHandler} is executed. The
     * records are refresh by default.
     */
    boolean isRefreshAllowed();

    JComponent[] getComponents();

    void runAllValidations(boolean s);

    boolean isRunAllValidations();
    
    boolean validateAnyEmtpy();

    boolean validateEmtpy(String... accessible_name);

    boolean validateEmtpy(JComponent... comps);

    boolean validateAnyEmtpy(ErrorCallBack errCall);

    boolean validateEmtpy(ErrorCallBack errCall, String... accessible_name);

    boolean validateEmtpy(ErrorCallBack errCall, JComponent... comps);

    boolean validateAnyNumeric();

    boolean validateNumeric(String... accessible_name);

    boolean validateNumeric(JComponent... comps);

    boolean validateAnyNumeric(ErrorCallBack errCall);

    boolean validateNumeric(ErrorCallBack errCall, String... accessible_name);

    boolean validateNumeric(ErrorCallBack errCall, JComponent... comps);

    boolean validateAnyNumber();

    boolean validateNumber(String... accessible_name);

    boolean validateNumber(JComponent... comps);

    boolean validateAnyNumber(ErrorCallBack errCall);

    boolean validateNumber(ErrorCallBack errCall, String... accessible_name);

    boolean validateNumber(ErrorCallBack errCall, JComponent... comps);

    boolean validateAnyCustom(ValidationHandler validationHandler);

    boolean validateCustom(ValidationHandler validationHandler, String... accessible_name);

    boolean validateCustom(ValidationHandler validationHandler, JComponent... comps);

}

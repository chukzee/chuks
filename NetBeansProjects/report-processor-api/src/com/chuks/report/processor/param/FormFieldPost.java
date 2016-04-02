/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.param;

import com.chuks.report.processor.Feedback;
import com.chuks.report.processor.IFormField;
import com.chuks.report.processor.handler.ValidationHandler;
import java.awt.Color;
import java.awt.Component;
import javax.swing.JComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface FormFieldPost extends Feedback {

    /**
     * Call this method to reset the form after form post or update.
     */
    void reset();

    /**
     * Gets an array of field objects representing the form fields. It returns
     * the fields if the record index is beyond the reset value ie -1 otherwise
     * it return null or empty array depending on the implementation. To check
     * if the field objects can be retrieved call
     * <code>isUpdate()</code>method. A value of true indicates the field
     * objects are available otherwise false.
     * <br/>
     * Note unlike Table field update, this method returns all fields in the
     * form. It is upto the client to post all fields or only the changes made
     * by comparing the old and new value of the field or simply checking the
     * return value of
     * <code>isUpdated()</code> of {@link IFormField} object
     *
     * @return
     */
    IFormField[] getFormFields();

    /**
     * Returns true if the form is on reset. ie the record index is at reset
     * value of -1.
     *
     * @return
     */
    boolean isNew();

    /**
     * Returns true if the form is not on reset. ie the record index is greater
     * than reset value of -1.
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
     * error occured and the client does not which to refresh the record as it is
     * meaningless.
     *
     * @param is_refresh set to true to allow refresh otherwise false.
     */
    void refresh(boolean is_refresh);

    IFormField field(String accessible_name);

    Object value(String accessible_name);

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

    boolean validateAlertAnyEmtpy();

    boolean validateAlertEmtpy(String... accessible_name);

    boolean validateAlertEmtpy(JComponent... comps);

    boolean validateAnyNumeric();

    boolean validateNumeric(String... accessible_name);

    boolean validateNumeric(JComponent... comps);

    boolean validateAlertAnyNumeric();

    boolean validateAlertNumeric(String... accessible_name);

    boolean validateAlertNumeric(JComponent... comps);

    boolean validateAnyNumeric(ErrorCallBack errCall);

    boolean validateNumeric(ErrorCallBack errCall, String... accessible_name);

    boolean validateNumeric(ErrorCallBack errCall, JComponent... comps);

    boolean validateAnyNumber();

    boolean validateNumber(String... accessible_name);

    boolean validateNumber(JComponent... comps);

    boolean validateAnyNumber(ErrorCallBack errCall);

    boolean validateNumber(ErrorCallBack errCall, String... accessible_name);

    boolean validateNumber(ErrorCallBack errCall, JComponent... comps);

    boolean validateAlertAnyNumber();

    boolean validateAlertNumber(String... accessible_name);

    boolean validateAlertNumber(JComponent... comps);

    boolean validateAnyCustom(ValidationHandler validationHandler);

    boolean validateCustom(ValidationHandler validationHandler, String... accessible_name);

    boolean validateCustom(ValidationHandler validationHandler, JComponent... comps);

    /**
     * Sets the background color that indicates a failed validation
     *
     * @param bgColor
     */
    void setErrorIndicator(Color bgColor);

    /**
     * Sets the background and forground colors that indicate a failed
     * validation
     *
     * @param bgColor
     * @param fgColor
     */
    void setErrorIndicator(Color bgColor, Color fgColor);
}

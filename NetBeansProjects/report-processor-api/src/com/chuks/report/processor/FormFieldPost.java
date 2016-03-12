/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface FormFieldPost {
    
    /**Gets an array of field  objects representing the form fields.
     * It returns the fields if the record index is beyond the reset
     * value ie -1 otherwise it return null or empty array depending
     * on the implementation. To check if the field objects can be
     * retrieved call  <code>isUpdate()</code>method. A value of true
     * indicates the field objects are available otherwise false.
     * <br/>
     * Note unlike Table field update, this method returns all fields 
     * in the form. It is upto the client to post all fields or 
     * only the changes made by comparing the old and new value of the 
     * field or simply checking the return value of <code>isUpdated()</code>
     * of {@link IFormField}
     * object
     * 
     * @return 
     */
    IFormField [] getFormFields();
    
    /**
     * Returns true if the form fields is on reset. ie the record index
     * is at reset value of -1.
     * @return 
     */
    boolean isNew();
    
    /**
     * Returns true if the form fields is not on reset. ie the record index
     * is greater than reset value of -1.
     * @return 
     */
    boolean isUpdate();
    
    /**Number of the field objects returned . Actually  this returns
     * the total fields in the form.
     * 
     * @return 
     */
    int count();
}

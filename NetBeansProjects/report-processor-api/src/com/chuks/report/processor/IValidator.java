/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.param.ErrorCallBack;
import com.chuks.report.processor.handler.ValidationHandler;
import javax.swing.JComponent;
import javax.swing.JDialog;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface IValidator {

    void runAllValidations(boolean s);

    boolean isRunAllValidations();

    boolean validateEmpty(JComponent... comps);

    boolean validateEmpty(JDialog dialog);

    boolean validateEmpty(ErrorCallBack errCall, JComponent... comps);

    boolean validateEmpty(ErrorCallBack errCall, JDialog dialog);

    boolean validateNumeric(JComponent... comps);

    boolean validateNumeric(JDialog dialog);

    boolean validateNumeric(ErrorCallBack errCall, JComponent... comps);

    boolean validateNumeric(ErrorCallBack errCall, JDialog dialog);

    boolean validateNumber(JComponent... comps);

    boolean validateNumber(JDialog dialog);

    boolean validateNumber(ErrorCallBack errCall, JComponent... comps);

    boolean validateNumber(ErrorCallBack errCall, JDialog dialog);

    boolean validateCustom(ValidationHandler vHandler, JComponent... comps);

    boolean validateCustom(ValidationHandler vHandler, JDialog dialog);
    
}

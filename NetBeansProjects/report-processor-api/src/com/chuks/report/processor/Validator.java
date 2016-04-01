/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.param.ErrorCallBack;
import com.chuks.report.processor.handler.ValidationHandler;
import java.awt.Color;
import java.awt.Component;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JFormattedTextField;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.text.JTextComponent;
import org.jdesktop.swingx.JXDatePicker;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Validator implements IValidator {

    private boolean isRunAllVaidation;

    public Validator() {
    }

    @Override
    public void runAllValidations(boolean isRunAllVaidation) {
        this.isRunAllVaidation = isRunAllVaidation;
    }

    @Override
    public boolean isRunAllValidations() {
        return isRunAllVaidation;
    }

    /**
     * Subclass can override this method to change the component foreground if
     * the validation fails or succeeds.
     * The default implementation does nothing
     *
     * @param comp
     */
    protected void setComponentForeground(JComponent comp, boolean is_valid) {
    }

    /**
     * Subclass can override this method to change the component background if
     * the validation fails or succeeds.
     * The default implementation does nothing
     *
     * @param comp
     */
    protected void setComponentBackground(JComponent comp, boolean is_valid) {
    }

    class NumericValidationHandler implements ValidationHandler {

        @Override
        public boolean isValid(JComponent comp, String accessible_name, String field_value) {
            try {
                Double.parseDouble(field_value);
            } catch (NumberFormatException ex) {
                return false;
            }

            return true;
        }
    }

    class NumberValidationHandler implements ValidationHandler {

        @Override
        public boolean isValid(JComponent comp, String accessible_name, String field_value) {
            try {
                Integer.parseInt(field_value);
            } catch (NumberFormatException ex) {
                return false;
            }

            return true;
        }
    }

    class EmptyValidationHandler implements ValidationHandler {

        @Override
        public boolean isValid(JComponent comp, String accessible_name, String field_value) {
            return !field_value.isEmpty();
        }
    }

    @Override
    public boolean validateEmpty(JComponent... comps) {
        return validateEntry(new EmptyValidationHandler(), null, comps);
    }

    @Override
    public boolean validateEmpty(JDialog dialog) {
        JComponent[] comps = getDialogComponents(dialog);
        return validateEntry(new EmptyValidationHandler(), null, comps);
    }

    @Override
    public boolean validateEmpty(ErrorCallBack errCall, JComponent... comps) {
        return validateEntry(new EmptyValidationHandler(), errCall, comps);
    }

    @Override
    public boolean validateEmpty(ErrorCallBack errCall, JDialog dialog) {
        JComponent[] comps = getDialogComponents(dialog);
        return validateEntry(new EmptyValidationHandler(), errCall, comps);
    }

    @Override
    public boolean validateNumeric(JComponent... comps) {
        return validateEntry(new NumericValidationHandler(), null, comps);
    }

    @Override
    public boolean validateNumeric(JDialog dialog) {
        JComponent[] comps = getDialogComponents(dialog);
        return validateEntry(new NumericValidationHandler(), null, comps);
    }

    @Override
    public boolean validateNumeric(ErrorCallBack errCall, JComponent... comps) {
        return validateEntry(new NumericValidationHandler(), errCall, comps);
    }

    @Override
    public boolean validateNumeric(ErrorCallBack errCall, JDialog dialog) {
        JComponent[] comps = getDialogComponents(dialog);
        return validateEntry(new NumericValidationHandler(), errCall, comps);
    }

    @Override
    public boolean validateNumber(JComponent... comps) {
        return validateEntry(new NumberValidationHandler(), null, comps);
    }

    @Override
    public boolean validateNumber(JDialog dialog) {
        JComponent[] comps = getDialogComponents(dialog);
        return validateEntry(new NumberValidationHandler(), null, comps);
    }

    @Override
    public boolean validateNumber(ErrorCallBack errCall, JComponent... comps) {
        return validateEntry(new NumberValidationHandler(), errCall, comps);
    }

    @Override
    public boolean validateNumber(ErrorCallBack errCall, JDialog dialog) {
        JComponent[] comps = getDialogComponents(dialog);
        return validateEntry(new NumberValidationHandler(), errCall, comps);
    }

    @Override
    public boolean validateCustom(ValidationHandler vHandler, JComponent... comps) {
        return validateEntry(vHandler, null, comps);
    }

    @Override
    public boolean validateCustom(ValidationHandler vHandler, JDialog dialog) {
        JComponent[] comps = getDialogComponents(dialog);
        return validateEntry(vHandler, null, comps);
    }

    private boolean validateEntry(ValidationHandler vHandler, ErrorCallBack errCall, JComponent... comps) {
        boolean is_valid = true;
        for (JComponent comp : comps) {

            if (comp instanceof JPanel) {
                Component[] pcomps = comp.getComponents();
                JComponent[] jpcomps = getJComponents(pcomps);
                validateEntry(vHandler, errCall, jpcomps);//come back for test
            }

            if (!validateEntry0(vHandler, errCall, comp)) {
                setComponentBackground(comp, false);
                setComponentForeground(comp, false);
                is_valid = false;
                if (errCall != null) {
                    errCall.onError(comp, comp.getAccessibleContext().getAccessibleName());
                }
                if (!isRunAllVaidation) {
                    return is_valid;
                }
            } else {
                setComponentBackground(comp, true);
                setComponentForeground(comp, true);
            }
        }

        return is_valid;
    }

    private boolean validateEntry0(ValidationHandler vHandler, ErrorCallBack errCall, JComponent comp) {
        String value = "";

        if (comp instanceof JTextField
                || comp instanceof JFormattedTextField
                || comp instanceof JXDatePicker) {

            JTextComponent field = null;

            if (comp instanceof JXDatePicker) {
                field = ((JXDatePicker) comp).getEditor();
            } else {
                field = (JTextComponent) comp;
            }

            if (field != null) {
                value = field.getText();
            }

        } else if (comp instanceof JPasswordField) {
            JPasswordField pwdfield = (JPasswordField) comp;
            value = new String(pwdfield.getPassword());
        } else if (comp instanceof JComboBox) {
            JComboBox cb = (JComboBox) comp;
            if (cb.getSelectedIndex() < 0) {
                value = "";
            } else {
                value = cb.getSelectedItem().toString();
            }

        } else if (comp instanceof JList) {
            JList cb = (JList) comp;
            if (cb.getSelectedIndex() < 0) {
                value = "";
            } else {
                value = cb.getSelectedValue().toString();
            }

        } else if (comp instanceof JTextArea) {
            JTextArea txa = (JTextArea) comp;
            value = txa.getText();

        } else if (comp instanceof JScrollPane) {
            //search the component in a scroll pane
            JScrollPane s = (JScrollPane) comp;
            for (int k = 0; k < s.getComponentCount(); k++) {
                if (s.getComponent(k) instanceof javax.swing.JViewport) {
                    javax.swing.JViewport vp = (javax.swing.JViewport) s.getComponent(k);
                    JComponent[] jcomps = getJComponents(vp.getComponents());
                    if (jcomps.length > 0) {
                        validateEntry(vHandler, errCall, jcomps);
                    }
                }
            }
            return true;//we return true here because JScrollPane is not the component to be validated
        } else {
            return true;//we return true here because the component is not among those to be validated
        }

        return vHandler.isValid(comp, comp.getAccessibleContext().getAccessibleName(), value);
    }

    private JComponent[] getDialogComponents(JDialog dialog) {
        Component[] comps = dialog.getComponents();
        return getJComponents(comps);
    }

    private JComponent[] getJComponents(Component[] comps) {
        int count = 0;
        for (Component comp : comps) {
            if (comp instanceof JComponent) {
                count++;
            }
        }

        JComponent[] jcomps = new JComponent[count];
        int index = -1;
        for (Component comp : comps) {
            if (comp instanceof JComponent) {
                index++;
                jcomps[index] = (JComponent) comp;
            }
        }

        return jcomps;
    }
}

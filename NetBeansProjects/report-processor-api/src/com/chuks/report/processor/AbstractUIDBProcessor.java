/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import java.text.SimpleDateFormat;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFormattedTextField;
import javax.swing.JLabel;
import javax.swing.JPasswordField;
import javax.swing.JRadioButton;
import javax.swing.JSpinner;
import javax.swing.JTextField;
import com.chuks.report.processor.entry.FieldType;
import com.chuks.report.processor.factory.ActionSQLImpl;
import com.chuks.report.processor.util.JDBCSettings;
import javax.swing.JDialog;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public abstract class AbstractUIDBProcessor<T> extends ActionSQLImpl implements UIDBProcessor, IValidator {

    final private Validator validator = new Validator();
    private boolean dataPollingEnabled;
    private final float DEFAULT_POLL_INTERVAL = 10;//Seconds
    private float dataPollingInterval = DEFAULT_POLL_INTERVAL;

    public AbstractUIDBProcessor(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void setDBSettings(JDBCSettings jdbcSettings) {
        this.jdbcSettings = jdbcSettings;
    }

    @Override
    public JDBCSettings getDBSettings() {
        return jdbcSettings;
    }

    @Override
    public void setDataPollingEnabled(boolean isPoll) {
        dataPollingEnabled = isPoll;
    }

    @Override
    public boolean getDataPollingEnabled() {
        return dataPollingEnabled;
    }

    @Override
    public void setDataPollingInterval(float seconds) {
        dataPollingInterval = seconds;
    }

    @Override
    public float getDataPollInterval() {
        return dataPollingInterval;
    }

    @Override
    public void runAllValidations(boolean s) {
        validator.runAllValidations(s);
    }

    @Override
    public boolean isRunAllValidations() {
        return validator.isRunAllValidations();
    }

    @Override
    public boolean validateEmpty(JComponent... comps) {
        return validator.validateEmpty(comps);
    }

    @Override
    public boolean validateEmpty(JDialog dialog) {
        return validator.validateEmpty(dialog);
    }

    @Override
    public boolean validateEmpty(ErrorCallBack errCall, JComponent... comps) {
        return validator.validateEmpty(errCall, comps);
    }

    @Override
    public boolean validateEmpty(ErrorCallBack errCall, JDialog dialog) {
        return validator.validateEmpty(errCall, dialog);
    }

    @Override
    public boolean validateNumeric(JComponent... comps) {
        return validator.validateNumeric(comps);
    }

    @Override
    public boolean validateNumeric(JDialog dialog) {
        return validator.validateNumeric(dialog);
    }

    @Override
    public boolean validateNumeric(ErrorCallBack errCall, JComponent... comps) {
        return validator.validateNumeric(errCall, comps);
    }

    @Override
    public boolean validateNumeric(ErrorCallBack errCall, JDialog dialog) {
        return validator.validateNumeric(errCall, dialog);
    }

    @Override
    public boolean validateNumber(JComponent... comps) {
        return validator.validateNumber(comps);
    }

    @Override
    public boolean validateNumber(JDialog dialog) {
        return validator.validateNumber(dialog);
    }

    @Override
    public boolean validateNumber(ErrorCallBack errCall, JComponent... comps) {
        return validator.validateNumber(errCall, comps);
    }

    @Override
    public boolean validateNumber(ErrorCallBack errCall, JDialog dialog) {
        return validator.validateNumber(errCall, dialog);
    }

    @Override
    public boolean validateCustom(ValidationHandler vHandler, JComponent... comps) {
        return validator.validateCustom(vHandler, comps);
    }

    @Override
    public boolean validateCustom(ValidationHandler vHandler, JDialog dialog) {
        return validator.validateCustom(vHandler, dialog);
    }

    @Override
    public T getValue(JComponent comp, FieldType type) {

        if (comp instanceof JTextField) {
            return convertTo(((JTextField) comp).getText(), type);
        } else if (comp instanceof JFormattedTextField) {
            return convertTo(((JFormattedTextField) comp).getText(), type);
        } else if (comp instanceof JPasswordField) {
            return convertTo(String.valueOf(((JPasswordField) comp).getPassword()), type);
        } else if (comp instanceof JComboBox) {
            return convertTo(((JComboBox) comp).getSelectedItem().toString(), type);
        } else if (comp instanceof JLabel) {
            return convertTo(((JLabel) comp).getText(), type);
        } else if (comp instanceof JRadioButton) {
            return convertTo(Boolean.valueOf(((JRadioButton) comp).isSelected()).toString(), type);//ok - do not change
        } else if (comp instanceof JCheckBox) {
            return convertTo(Boolean.valueOf(((JCheckBox) comp).isSelected()).toString(), type);//ok - do not change
        } else if (comp instanceof JSpinner) {
            return convertTo(((JSpinner) comp).getValue().toString(), type);
        } else {
            throw new UnsupportedOperationException("Form component type not supported - " + comp.getName());

        }
    }

    private T convertTo(String str, FieldType type) {

        switch (type) {
            case BOOLEAN: {
                try {
                    return (T) Boolean.valueOf(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values " + str + " is not of type " + type);
                }
            }
            case DATE_yyyy_MM_dd: {
                String format = "yyyy-MM-dd";
                try {
                    return (T) new SimpleDateFormat(format).parse(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values " + str + " is not of date type with format " + format);
                }
            }
            case DATE_yyyy_MM_dd_HH_mm_ss: {
                String format = "yyyy-MM-dd HH:mm:ss";
                try {
                    return (T) new SimpleDateFormat(format).parse(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values " + str + " is not of date type with format " + format);
                }
            }
            case DOUBLE: {
                try {
                    return (T) Double.valueOf(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values " + str + " is not of type " + type);
                }
            }
            case FLOAT: {
                try {
                    return (T) Float.valueOf(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values " + str + " is not of type " + type);
                }
            }
            case INTEGER: {
                try {
                    return (T) Integer.valueOf(str);
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values " + str + " is not of type " + type);
                }
            }
            case STRING: {
                try {
                    return (T) str;
                } catch (Exception ex) {
                    throw new IllegalArgumentException("values " + str + " is not of type " + type);
                }
            }

            default:
                throw new UnsupportedOperationException("type not supported : " + type);

        }

    }

}

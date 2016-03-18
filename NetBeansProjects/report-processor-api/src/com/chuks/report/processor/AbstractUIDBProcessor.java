/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

import com.chuks.report.processor.param.ErrorCallBack;
import com.chuks.report.processor.handler.ValidationHandler;
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
import java.awt.Component;
import java.awt.Container;
import java.awt.Window;
import javax.swing.JDialog;
import javax.swing.text.JTextComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public abstract class AbstractUIDBProcessor<T> extends ActionSQLImpl implements UIDBProcessor, IValidator {

    final private Validator validator = new Validator();
    protected boolean data_polling_enabled;
    private final float DEFAULT_POLL_INTERVAL = 10;//Seconds
    protected float data_polling_interval = DEFAULT_POLL_INTERVAL;

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
        data_polling_enabled = isPoll;
    }

    @Override
    public boolean getDataPollingEnabled() {
        return data_polling_enabled;
    }

    @Override
    public void setDataPollingInterval(float seconds) {
        data_polling_interval = seconds;
    }

    @Override
    public float getDataPollInterval() {
        return data_polling_interval;
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

    protected Object getValue(JComponent comp) {

        if (comp instanceof JPasswordField) {
            return String.valueOf(((JPasswordField) comp).getPassword());
        } else if (comp instanceof JTextComponent) {
            return ((JTextComponent) comp).getText();
        } else if (comp instanceof JComboBox) {
            return ((JComboBox) comp).getSelectedItem();
        }  else if (comp instanceof JLabel) {
            return ((JLabel) comp).getText();
        } else if (comp instanceof JRadioButton) {
            return ((JRadioButton) comp).isSelected();
        } else if (comp instanceof JCheckBox) {
            return ((JCheckBox) comp).isSelected();
        } else if (comp instanceof JSpinner) {
            return ((JSpinner) comp).getValue();
        } else {
            throw new UnsupportedOperationException("Form component type not supported - " + comp.getName());

        }
    }
    
    @Override
    public T getValue(JComponent comp, FieldType type) {

        if (comp instanceof JPasswordField) {//first check password since it extends JTextComponent, we should get the text in more secure way
            return convertTo(String.valueOf(((JPasswordField) comp).getPassword()), type);
        }  else if (comp instanceof JTextComponent) {//ok, all component that extend JTextComponent e.g JTextField , JTextArea
            return convertTo(((JTextComponent) comp).getText(), type);
        } else if (comp instanceof JComboBox) {
            return convertTo(((JComboBox) comp).getSelectedItem().toString(), type);
        } else if (comp instanceof JLabel) {//JLabel does not extend JTextComponent
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

    protected Component getFrame(JComponent comp) {
        
        if (comp == null) {
            return null;
        }
        
        Container parent = comp;
        int count = 0;
        while (true) {
            Container p = parent.getParent();
            if (p instanceof Window) {//Window will take care of Frame and Dialog since both extend Window class
                return parent;
            }
            if (p == null) {
                return comp;
            }
            count++;
            if (count >= 100000) {
                return comp;//SHOCKER!!!  - this should not happen!!!
            }
            parent = p;
        }
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.form.controls.JFind;
import com.chuks.report.processor.form.controls.JPrevious;
import com.chuks.report.processor.form.controls.FormControl;
import com.chuks.report.processor.form.controls.JMoveTo;
import com.chuks.report.processor.form.controls.JNext;
import com.chuks.report.processor.form.controls.JCounter;
import com.chuks.report.processor.form.controls.JControllerPane;
import java.sql.SQLException;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import com.chuks.report.processor.util.JDBCSettings;
import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.bind.ListBindHanler;
import com.chuks.report.processor.FormFieldMapper;
import com.chuks.report.processor.Form;
import com.chuks.report.processor.FormFieldCallBack;
import com.chuks.report.processor.FormProcessor;
import com.chuks.report.processor.bind.TextBindHandler;
import com.chuks.report.processor.form.controls.JFirst;
import com.chuks.report.processor.form.controls.JLast;
import com.chuks.report.processor.form.controls.JReset;
import com.chuks.report.processor.form.controls.JSave;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JComboBox;
import javax.swing.JList;
import javax.swing.JTextField;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class FormProcessorImpl<T> extends AbstractUIDBProcessor implements FormProcessor {

    public FormProcessorImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public Form loadOnForm(FormFieldCallBack callBack, FormFieldMapper mapper, FormControl... controls) throws SQLException {
        String[] columms = dbHelper.getColumns(true);
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        int record_index = 0;
        Object b = callBack.onBeforeAdd(null, record_index);
        return new DefaultFormModel(null, dbHelper.fetchArray());//come back
    }

    @Override
    public Form loadOnForm(FormFieldCallBack callBack, FormFieldMapper mapper, JControllerPane controllers_pane) throws SQLException {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        
        return new DefaultFormModel(null, null);//come back
    }

    @Override
    public void showJNext(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJPrevious(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJMove(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJCounter(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJFind(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJSave(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void showJReset(boolean display) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void bind(JList list, ListBindHanler handler) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void bind(JComboBox combo, ListBindHanler handler) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void bind(JTextField textField, TextBindHandler handler) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    @Override
    public void bind(JLabel label, TextBindHandler handler) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    class DefaultFormModel implements Form {

        JComponent[] comps;
        Object[][] data;
        int record_index = -1;

        DefaultFormModel(JComponent[] comps, Object[][] data) {
            this.comps = comps;
            this.data = data;

            //set action listeners of the components
            for (JComponent comp : comps) {
                if (comp instanceof JNext) {
                    JNext jnext = (JNext) comp;
                    jnext.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jnextAcitionPerform(e);
                        }
                    });
                } else if (comp instanceof JPrevious) {
                    JPrevious jprevious = (JPrevious) comp;
                    jprevious.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jpreviousAcitionPerform(e);
                        }
                    });
                } else if (comp instanceof JFirst) {
                    JFirst jfirst = (JFirst) comp;
                    jfirst.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jfirstAcitionPerform(e);
                        }
                    });
                } else if (comp instanceof JLast) {
                    JLast jlast = (JLast) comp;
                    jlast.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jlastAcitionPerform(e);
                        }
                    });
                } else if (comp instanceof JReset) {
                    JReset jreset = (JReset) comp;
                    jreset.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jresetAcitionPerform(e);
                        }
                    });
                } else if (comp instanceof JSave) {
                    JSave jsave = (JSave) comp;
                    jsave.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jsaveAcitionPerform(e);
                        }
                    });
                }  else if (comp instanceof JMoveTo) {
                    JMoveTo jmoveTo = (JMoveTo) comp;
                    jmoveTo.addButtonActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jmoveToAcitionPerform(e);
                        }
                    });
                    jmoveTo.addTextActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jmoveToAcitionPerform(e);
                        }
                    });
                } else if (comp instanceof JFind) {
                    JFind jfind = (JFind) comp;
                    //COME BACK
                }  else if (comp instanceof JCounter) {
                    JCounter jreset = (JCounter) comp;
                    //COME BACK
                }  else if (comp instanceof JControllerPane) {
                    JControllerPane jreset = (JControllerPane) comp;
                    //COME BACK
                }  else{
                    throw new IllegalArgumentException("Component not supported!");
                }

            }
        }

        boolean hasNext() {
            return record_index < data.length - 1;
        }

        boolean hasPrevious() {
            return record_index > 0;
        }

        Object[] next() {
            ++record_index;
            return data[record_index];
        }

        Object[] previous() {
            --record_index;
            return data[record_index];
        }

        Object[] first() {
            record_index = 0;
            return data[record_index];
        }

        Object[] last() {
            record_index = data.length - 1;
            return data[data.length - 1];
        }

        Object[] moveTo(int index) {
            record_index = index;
            return data[record_index];
        }

        int getRecordIndex() {
            return record_index;
        }

        boolean isFirst() {
            return record_index == 0;
        }

        boolean isBeforeFirst() {
            return record_index < 0;
        }

        boolean isLast() {
            return record_index >= data.length - 1;
        }

        Object getFieldItem(int field_index) {
            return data[record_index][field_index];
        }

        private void jnextAcitionPerform(ActionEvent e) {

        }

        private void jpreviousAcitionPerform(ActionEvent e) {

        }

        private void jfirstAcitionPerform(ActionEvent e) {

        }

        private void jlastAcitionPerform(ActionEvent e) {

        }

        private void jresetAcitionPerform(ActionEvent e) {

        }

        private void jsaveAcitionPerform(ActionEvent e) {

        }

        private void jmoveToAcitionPerform(ActionEvent e) {

        }

        private void jfindAcitionPerform(ActionEvent e) {

        }

        @Override
        public JPanel getJControllers() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JNext getJNext() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JPrevious getJPrevious() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JMoveTo getJMoveTo() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JCounter getJCounter() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JFind getJFind() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JFind getJSave() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JFind getJReset() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JComponent[] getAllFields() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JComponent[] getFields(String accessible_name) {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }

        @Override
        public JComponent getField(int field_index) {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
            return null;
        }
    }

}

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
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import com.chuks.report.processor.util.JDBCSettings;
import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.FormDataInput;
import com.chuks.report.processor.bind.ListBindHanler;
import com.chuks.report.processor.FormFieldMapper;
import com.chuks.report.processor.FormDataInputHandler;
import com.chuks.report.processor.FormFieldCallBack;
import com.chuks.report.processor.FormProcessor;
import com.chuks.report.processor.UpdateFormHandler;
import com.chuks.report.processor.bind.ListDataInput;
import com.chuks.report.processor.bind.TextBindHandler;
import com.chuks.report.processor.form.controls.JFirst;
import com.chuks.report.processor.form.controls.JLast;
import com.chuks.report.processor.form.controls.JReset;
import com.chuks.report.processor.form.controls.JSave;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JFormattedTextField;
import javax.swing.JList;
import javax.swing.JPasswordField;
import javax.swing.JRadioButton;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.JTextPane;
import javax.swing.ListModel;
import javax.swing.text.JTextComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class FormProcessorImpl<T> extends AbstractUIDBProcessor implements FormProcessor {

    public FormProcessorImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void formLoad(FormDataInputHandler dataInputHandler, UpdateFormHandler updateFieldHandler, FormControl... controls) throws SQLException {
        DefaultFormModel formModel = new FormModelBuilder()
                .setDataInputHandler(dataInputHandler)
                .setUpdateFormHandler(updateFieldHandler)
                .setFormControl(controls)
                .build();
    }

    @Override
    public void formLoad(FormDataInputHandler dataInputHandler, UpdateFormHandler updateFieldHandler, JControllerPane controllers_pane) throws SQLException {
        DefaultFormModel formModel = new FormModelBuilder()
                .setDataInputHandler(dataInputHandler)
                .setUpdateFormHandler(updateFieldHandler)
                .setJControllerPane(controllers_pane)
                .build();
    }

    @Override
    public void formLoad(FormFieldCallBack callBack, FormFieldMapper mapper, UpdateFormHandler updateFieldHandler, FormControl... controls) throws SQLException {
        DefaultFormModel formModel = new FormModelBuilder()
                .setFormFieldCallBack(callBack)
                .setFormFieldMapper(mapper)
                .setUpdateFormHandler(updateFieldHandler)
                .setFormControl(controls)
                .build();

    }

    @Override
    public void formLoad(FormFieldCallBack callBack, FormFieldMapper mapper, UpdateFormHandler updateFieldHandler, JControllerPane controllers_pane) throws SQLException {
        DefaultFormModel formModel = new FormModelBuilder()
                .setFormFieldCallBack(callBack)
                .setFormFieldMapper(mapper)
                .setUpdateFormHandler(updateFieldHandler)
                .setJControllerPane(controllers_pane)
                .build();
    }

    @Override
    public void bind(JList list, ListBindHanler handler) {
        ListDataInputImpl input = new ListDataInputImpl(jdbcSettings);
        input = (ListDataInputImpl) handler.data(input);

        if (input.getData() == null) {
            return;
        }

        list.setListData(input.getData());

        //TODO data polling
    }

    @Override
    public void bind(JComboBox combo, ListBindHanler handler) {
        ListDataInputImpl input = new ListDataInputImpl(jdbcSettings);
        input = (ListDataInputImpl) handler.data(input);

        if (input.getData() == null) {
            return;
        }

        combo.removeAllItems();//first remove all previous items

        for (Object data : input.getData()) {
            combo.addItem(data);
        }

        //TODO data polling
    }

    @Override
    public void bind(JTextField textField, TextBindHandler handler) {
        TextDataInputImpl input = new TextDataInputImpl(jdbcSettings);
        input = (TextDataInputImpl) handler.data(input);

        if (input.getData() == null) {
            return;
        }

        textField.setText(input.getData().toString());

        //TODO data polling
    }

    @Override
    public void bind(JLabel label, TextBindHandler handler) {
        TextDataInputImpl input = new TextDataInputImpl(jdbcSettings);
        input = (TextDataInputImpl) handler.data(input);

        if (input.getData() == null) {
            return;
        }

        label.setText(input.getData().toString());

        //TODO data polling
    }

    class FormModelBuilder {

        private FormDataInputHandler dataInputHandler;
        private UpdateFormHandler updateFieldHandler;
        private FormControl[] controls;
        private JControllerPane controllers_pane;
        private FormFieldCallBack callBack;
        private FormFieldMapper mapper;

        private FormModelBuilder setDataInputHandler(FormDataInputHandler dataInputHandler) {
            this.dataInputHandler = dataInputHandler;
            return this;
        }

        private FormModelBuilder setUpdateFormHandler(UpdateFormHandler updateFieldHandler) {
            this.updateFieldHandler = updateFieldHandler;
            return this;
        }

        private FormModelBuilder setFormControl(FormControl[] controls) {
            this.controls = controls;
            return this;
        }

        private FormModelBuilder setJControllerPane(JControllerPane controllers_pane) {
            this.controllers_pane = controllers_pane;
            return this;
        }

        private FormModelBuilder setFormFieldCallBack(FormFieldCallBack callBack) {
            this.callBack = callBack;
            return this;
        }

        private FormModelBuilder setFormFieldMapper(FormFieldMapper mapper) {
            this.mapper = mapper;
            return this;
        }

        private DefaultFormModel build() {
            return new DefaultFormModel(this);
        }

    }

    class DefaultFormModel {

        FormControl[] controls;
        JComponent[] fieldsComponents;
        private final JControllerPane controllers_pane;
        Object[][] data;
        int record_index = -1;
        private final FormFieldCallBack callBack;
        private final FormDataInputHandler dataInputHandler;
        private final FormFieldMapper mapper;
        private final UpdateFormHandler updateFieldHandler;
        private final String selectSQL;
        private final Map selectParam;
        private final JDBCSettings jdbc_settings;

        private DefaultFormModel(FormModelBuilder builder) {

            this.callBack = builder.callBack;
            this.dataInputHandler = builder.dataInputHandler;
            this.mapper = builder.mapper;
            this.updateFieldHandler = builder.updateFieldHandler;
            this.controls = builder.controls;
            this.controllers_pane = builder.controllers_pane;

            data = dbHelper.fetchArray();
            selectSQL = dbHelper.getSelectSQL();
            selectParam = dbHelper.getSelectParams();
            jdbc_settings = dbHelper.getJdbcSetting();

            if (mapper != null) {
                fieldsComponents = mapper.getFields();
            }

            if (dataInputHandler != null) {
                FormDataInputImpl input = new FormDataInputImpl(jdbcSettings);
                input = (FormDataInputImpl) dataInputHandler.onInput(input);
                data = input.getData();
                fieldsComponents = input.getFieldComponents();
            }

            checksControlRepitition();
            initControls();
            initControllerPane();
        }

        private void initControllerPane() {
            if (controllers_pane == null) {
                return;
            }
            //TODO add the control to the controller pane
        }

        private void initControls() {

            //set action listeners of the components
            for (FormControl control : controls) {
                if (control instanceof JNext) {
                    JNext jnext = (JNext) control;
                    jnext.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jnextAcitionPerform(e);
                        }
                    });
                } else if (control instanceof JPrevious) {
                    JPrevious jprevious = (JPrevious) control;
                    jprevious.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jpreviousAcitionPerform(e);
                        }
                    });
                } else if (control instanceof JFirst) {
                    JFirst jfirst = (JFirst) control;
                    jfirst.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jfirstAcitionPerform(e);
                        }
                    });
                } else if (control instanceof JLast) {
                    JLast jlast = (JLast) control;
                    jlast.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jlastAcitionPerform(e);
                        }
                    });
                } else if (control instanceof JReset) {
                    JReset jreset = (JReset) control;
                    jreset.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jresetAcitionPerform(e);
                        }
                    });
                } else if (control instanceof JSave) {
                    JSave jsave = (JSave) control;
                    jsave.addActionListener(new ActionListener() {
                        @Override
                        public void actionPerformed(ActionEvent e) {
                            jsaveAcitionPerform(e);
                        }
                    });
                } else if (control instanceof JMoveTo) {
                    JMoveTo jmoveTo = (JMoveTo) control;
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
                } else if (control instanceof JFind) {
                    JFind jfind = (JFind) control;
                    //COME BACK
                } else if (control instanceof JCounter) {
                    JCounter jcounter = (JCounter) control;
                    //COME BACK
                } else {
                    throw new IllegalArgumentException("Component not supported!");
                }

            }
        }

        private void checksControlRepitition() {

            if (controls == null) {
                return;
            }

            for (int i = 0; i < controls.length; i++) {
                for (int k = 0; k < controls.length; k++) {
                    if (k == i) {
                        continue;
                    }
                    try {
                        controls[i].getClass().cast(controls[k]);
                        throw new IllegalArgumentException("Form control duplicate detected! cannot repeat form control or its sub class - " + controls[i].getClass().getName());
                    } catch (ClassCastException ex) {
                    }
                }
            }
        }

        void refresh() {
            //TOOD: Implementation

        }

        void displayRecord(Object[] record_data) {
            for (int i = 0; i < this.fieldsComponents.length; i++) {
                if (record_data != null) {
                    setComponentData(fieldsComponents[i], record_data[i]);
                } else {
                    setComponentData(fieldsComponents[i], null);//reset the components using null                    
                }
            }
        }

        void setComponentData(JComponent comp, Object compData) {

            String strData = compData != null ? compData.toString() : null; // null will clear the text.
            if (comp instanceof JTextComponent) {//All components that extends JTextComponent.
                ((JTextComponent) comp).setText(strData);
            } else if (comp instanceof JList) {
                JList lst = (JList) comp;
                if (compData != null) {
                    ListModel m = lst.getModel();
                    boolean found = false;
                    List items = new ArrayList();
                    for (int i = 0; i < m.getSize(); i++) {
                        if (m.getElementAt(i).equals(compData)) {
                            found = true;
                            items.add(compData);
                        }
                    }

                    if (found) {
                        lst.setListData(items.toArray());
                        lst.setSelectedValue(compData, true);
                    } else {
                        items.add(compData);//add since not found
                        lst.setListData(items.toArray());
                        lst.setSelectedValue(compData, true);
                    }
                } else {
                    lst.clearSelection();
                }
            } else if (comp instanceof JComboBox) {
                JComboBox cbo = (JComboBox) comp;
                if (compData != null) {
                    boolean found = false;
                    for (int i = 0; i < cbo.getItemCount(); i++) {
                        if (cbo.getItemAt(i).equals(compData)) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        cbo.addItem(compData);
                    }
                    cbo.setSelectedItem(compData);
                } else {
                    cbo.setSelectedItem(null);//clear selection
                }
            } else if (comp instanceof JCheckBox) {
                if (compData == null) {
                    ((JCheckBox) comp).setSelected(false);
                } else if (!(compData instanceof Boolean)) {//ok if compData is null - will not raise NullPointerException.
                    throw new IllegalArgumentException("Invalid data type for check box! expected Boolean - " + compData);
                } else {
                    ((JCheckBox) comp).setSelected(Boolean.parseBoolean(strData));
                }
            } else if (comp instanceof JRadioButton) {
                if (compData == null) {
                    ((JRadioButton) comp).setSelected(false);
                } else if (!(compData instanceof Boolean)) {//ok if compData is null - will not raise NullPointerException.
                    throw new IllegalArgumentException("Invalid data type for check box! expected Boolean - " + compData);
                } else {
                    ((JRadioButton) comp).setSelected(Boolean.parseBoolean(strData));
                }
            } else {
                throw new IllegalArgumentException("Form component not supported - " + comp.getClass().getName());
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

        Object getValueAt(int field_index) {
            return data[record_index][field_index];
        }

        private void jnextAcitionPerform(ActionEvent e) {
            if (hasNext()) {
                displayRecord(next());
            }
        }

        private void jpreviousAcitionPerform(ActionEvent e) {
            if (hasPrevious()) {
                displayRecord(previous());
            }
        }

        private void jfirstAcitionPerform(ActionEvent e) {
            displayRecord(first());
        }

        private void jlastAcitionPerform(ActionEvent e) {
            displayRecord(last());
        }

        private void jresetAcitionPerform(ActionEvent e) {
            displayRecord(reset());//this will reset the form components
        }

        private void jsaveAcitionPerform(ActionEvent e) {
            saveRecord();
        }

        private void jmoveToAcitionPerform(ActionEvent e) {
            JMoveTo comp = this.getJMoveTo();
            if (comp == null) {
                return;
            }

            int move_index = comp.getMoveToIndex();
            if (move_index < 0) {
                return;//though negative do nothing. do not even reset! not your job.
            }
            displayRecord(moveTo(move_index));
        }

        private void jfindAcitionPerform(ActionEvent e) {

        }

        JMoveTo getJMoveTo() {
            for (int i = 0; i < controls.length; i++) {
                if (controls[i] instanceof JMoveTo) {
                    return (JMoveTo) controls[i];
                }
            }
            return null;
        }

        public JComponent[] getAllFields() {
            return fieldsComponents;
        }

        public JComponent[] getFields(String accessible_name) {
            List<JComponent> list = new ArrayList();
            for (JComponent fieldsComponent : fieldsComponents) {
                if (accessible_name.equals(fieldsComponent.getAccessibleContext().getAccessibleName())) {
                    list.add(fieldsComponent);
                }
            }
            JComponent[] comps = new JComponent[list.size()];
            list.toArray(comps);
            return comps;
        }

        public JComponent getFieldAt(int field_index) {
            return fieldsComponents[field_index];
        }

        private Object[] reset() {
            this.record_index = -1;
            return null;//force form components reset by returning null
        }

        private void saveRecord() {
            System.err.println("REMIND: Auto generated method body is not yet implemented");
        }
    }

}

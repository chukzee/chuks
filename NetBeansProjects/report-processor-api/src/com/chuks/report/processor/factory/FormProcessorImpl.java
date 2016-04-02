/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.handler.DataPullHandler;
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
import com.chuks.report.processor.util.JDBCSettings;
import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.DataPull;
import com.chuks.report.processor.param.ErrorCallBack;
import com.chuks.report.processor.handler.ListBindHanler;
import com.chuks.report.processor.param.FormFieldMapper;
import com.chuks.report.processor.handler.FormDataInputHandler;
import com.chuks.report.processor.param.FormFieldCallBack;
import com.chuks.report.processor.param.FormFieldGen;
import com.chuks.report.processor.param.FormFieldPost;
import com.chuks.report.processor.FormProcessor;
import com.chuks.report.processor.handler.FormPostHandler;
import com.chuks.report.processor.IFormField;
import com.chuks.report.processor.Option;
import com.chuks.report.processor.handler.ValidationHandler;
import com.chuks.report.processor.Validator;
import com.chuks.report.processor.handler.TextBindHandler;
import com.chuks.report.processor.event.FormActionListener;
import com.chuks.report.processor.event.SearchObserver;
import com.chuks.report.processor.form.controls.JFirst;
import com.chuks.report.processor.form.controls.JLast;
import com.chuks.report.processor.form.controls.JReset;
import com.chuks.report.processor.form.controls.JSave;
import com.chuks.report.processor.param.ErrorAlert;
import java.awt.Color;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.Icon;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JRadioButton;
import javax.swing.ListModel;
import javax.swing.text.JTextComponent;
import org.jooq.Param;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class FormProcessorImpl<T> extends AbstractUIDBProcessor implements FormProcessor {

    public FormProcessorImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, FormControl... controls) {
        DefaultFormModel formModel = new FormModelBuilder()
                .setDataInputHandler(dataInputHandler)
                .setUpdateFormHandler(updateFieldHandler)
                .setFormControl(controls)
                .build();

        DataPullHandler.registerPoll(formModel);
    }

    @Override
    public void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, JControllerPane controllers_pane) {
        DefaultFormModel formModel = new FormModelBuilder()
                .setDataInputHandler(dataInputHandler)
                .setUpdateFormHandler(updateFieldHandler)
                .setJControllerPane(controllers_pane)
                .build();

        DataPullHandler.registerPoll(formModel);
    }

    @Override
    public void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, JControllerPane controllers_pane, FormControl... controls) {
        DefaultFormModel formModel = new FormModelBuilder()
                .setDataInputHandler(dataInputHandler)
                .setUpdateFormHandler(updateFieldHandler)
                .setJControllerPane(controllers_pane)
                .setFormControl(controls)
                .build();

        DataPullHandler.registerPoll(formModel);
    }

    @Override
    public void formLoad(FormFieldCallBack callBack, FormPostHandler updateFieldHandler, FormFieldMapper mapper, FormControl... controls) {

        DefaultFormModel formModel = new FormModelBuilder()
                .setFormFieldCallBack(callBack)
                .setFormFieldMapper(mapper)
                .setUpdateFormHandler(updateFieldHandler)
                .setFormControl(controls)
                .build();

        DataPullHandler.registerPoll(formModel);
    }

    @Override
    public void formLoad(FormFieldCallBack callBack, FormPostHandler updateFieldHandler, FormFieldMapper mapper, JControllerPane controllers_pane) {
        DefaultFormModel formModel = new FormModelBuilder()
                .setFormFieldCallBack(callBack)
                .setFormFieldMapper(mapper)
                .setUpdateFormHandler(updateFieldHandler)
                .setJControllerPane(controllers_pane)
                .build();

        DataPullHandler.registerPoll(formModel);
    }

    @Override
    public void formLoad(FormFieldCallBack callBack, FormPostHandler updateFieldHandler, FormFieldMapper mapper, JControllerPane controllers_pane, FormControl... controls) {
        DefaultFormModel formModel = new FormModelBuilder()
                .setFormFieldCallBack(callBack)
                .setFormFieldMapper(mapper)
                .setUpdateFormHandler(updateFieldHandler)
                .setJControllerPane(controllers_pane)
                .setFormControl(controls)
                .build();

        DataPullHandler.registerPoll(formModel);
    }

    @Override
    public void bind(JList list, ListBindHanler handler) {
        ListDataInputImpl input = new ListDataInputImpl(jdbcSettings);
        handler.data(input);

        if (input.getData() == null) {
            Object[][] fetch = input.dbHelper.fetchArray();
            if (fetch != null && fetch.length > 0) {
                input.setData(fetch); 
            } else {
                return;
            }
        }

        list.setListData(input.getData());

        input.setHandler(list, handler);

        DataPullHandler.registerPoll(input);

    }

    @Override
    public void bind(JComboBox combo, ListBindHanler handler) {
        ListDataInputImpl input = new ListDataInputImpl(jdbcSettings);
        handler.data(input);

        if (input.getData() == null) {
            Object[][] fetch = input.dbHelper.fetchArray();
            if (fetch != null && fetch.length > 0) {
                input.setData(fetch);
            } else {
                return;
            }
        }

        combo.removeAllItems();//first remove all previous items

        for (Object data : input.getData()) {
            combo.addItem(data);
        }

        input.setHandler(combo, handler);

        DataPullHandler.registerPoll(input);

    }

    @Override
    public void bind(JTextComponent textComp, TextBindHandler handler) {
        TextDataInputImpl input = new TextDataInputImpl(jdbcSettings);
        handler.data(input);

        if (input.getData() == null) {
            Object[][] fetch = input.dbHelper.fetchArray();
            if (fetch != null && fetch.length > 0) {
                input.setData(fetch[0][0]);
            } else {
                return;
            }
        }

        textComp.setText(input.getData().toString());

        input.setHandler(textComp, handler);

        DataPullHandler.registerPoll(input);

    }

    @Override
    public void bind(JLabel label, TextBindHandler handler) {
        TextDataInputImpl input = new TextDataInputImpl(jdbcSettings);
        handler.data(input);

        if (input.getData() == null) {
            Object[][] fetch = input.dbHelper.fetchArray();
            if (fetch != null && fetch.length > 0) {
                input.setData(fetch[0][0]);
            } else {
                return;
            }
        }

        label.setText(input.getData().toString());

        input.setHandler(label, handler);

        DataPullHandler.registerPoll(input);

    }

    class FormModelBuilder {

        private FormDataInputHandler dataInputHandler;
        private FormPostHandler updateFieldHandler;
        private FormControl[] controls;
        private JControllerPane controllers_pane;
        private FormFieldCallBack callBack;
        private FormFieldMapper mapper;

        private FormModelBuilder setDataInputHandler(FormDataInputHandler dataInputHandler) {
            this.dataInputHandler = dataInputHandler;
            return this;
        }

        private FormModelBuilder setUpdateFormHandler(FormPostHandler updateFieldHandler) {
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

    class DefaultFormModel implements SearchObserver, DataPull {

        private FormControl[] pane_controls;//controls in the controller pane
        FormControl[] x_controls;//controls not in the controller pane
        JComponent[] fieldsComponents;
        private JControllerPane controllers_pane;
        Object[][] data;
        private final int RESET_INDEX = -1;
        int record_index = RESET_INDEX;
        private FormFieldCallBack callBack;
        private FormDataInputHandler dataInputHandler;
        private FormFieldMapper mapper;
        private FormPostHandler formFieldsPostHandler;
        private String selectSQL;
        private Map selectParam;
        private JDBCSettings model_jdbc_settings;
        String[] db_columns;
        private JMoveTo jMoveTo;
        private JCounter jCounter;
        private JSave jSave;
        private long next_poll_time;
        private boolean dataPollEnabled;
        private float dataPollInterval;
        private Map<Integer, Color> intialCompForeground = new HashMap();
        private Map<Integer, Color> intialCompBackground = new HashMap();

        private DefaultFormModel(FormModelBuilder builder) {
            try {

                this.callBack = builder.callBack;
                this.dataInputHandler = builder.dataInputHandler;
                this.mapper = builder.mapper;
                this.formFieldsPostHandler = builder.updateFieldHandler;
                this.x_controls = builder.controls;
                this.controllers_pane = builder.controllers_pane;

                if (callBack != null && mapper != null) {
                    db_columns = dbHelper.getColumns(true);
                    data = dbHelper.fetchArray();
                    selectSQL = dbHelper.getSelectSQL();
                    selectParam = dbHelper.getSelectParams();
                    if (dbHelper.getJdbcSetting() != null) {
                        model_jdbc_settings = new JDBCSettings(dbHelper.getJdbcSetting());//we need to copy
                    }
                    fieldsComponents = mapper.getFields();
                    data = generateCallBackData(db_columns);
                    this.dataPollEnabled = data_pulling_enabled;
                    this.dataPollInterval = data_pulling_interval;
                }

                if (dataInputHandler != null) {
                    FormDataInputImpl input = new FormDataInputImpl(jdbcSettings);
                    dataInputHandler.doInput(input);

                    data = input.getData();//get data whether available or not

                    if (input.dbHelper != null) {//database is the source of data
                        if (data == null || data.length == 0) {//lets try to fetch it to see if it is available
                            data = input.dbHelper.fetchArray();
                        }
                        selectSQL = input.dbHelper.getSelectSQL();
                        selectParam = input.dbHelper.getSelectParams();
                        if (dbHelper.getJdbcSetting() != null) {
                            model_jdbc_settings = new JDBCSettings(input.dbHelper.getJdbcSetting());//we need to copy                
                        }

                        if (input.getDBSettings() != null) {
                            model_jdbc_settings = new JDBCSettings(input.getDBSettings());//we need to copy                                            
                        }
                    }

                    fieldsComponents = input.getFieldComponents();
                    this.dataPollEnabled = input.isPullingEnabled();
                    this.dataPollInterval = input.getPullingInterval();
                }

                checksControlRepitition();
                initControllerPane();
                initControls();
                initValidationColor();

                if (data != null || data.length > 0) {
                    displayRecord(moveTo(0));//move to the first record
                    updateJCounter();
                }
            } catch (SQLException ex) {
                Logger.getLogger(FormProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                disableAllFormControls();
            }
        }

        private void initControllerPane() {
            if (controllers_pane == null) {
                return;
            }

            pane_controls = controllers_pane.getPaneControls();
            //set action listeners of the controls in the controller pane
            for (FormControl control : pane_controls) {
                doControlInit(control);
            }
        }

        private void initValidationColor() {
            for (int i = 0; i < fieldsComponents.length; i++) {
                intialCompBackground.put(fieldsComponents[i].hashCode(), fieldsComponents[i].getBackground());
                intialCompForeground.put(fieldsComponents[i].hashCode(), fieldsComponents[i].getForeground());
            }
        }

        private Object[][] generateCallBackData(String[] db_columns) throws SQLException {
            checkValidColumn(db_columns);
            return fieldSourceData(data, db_columns);
        }

        private Object[][] fieldSourceData(Object[][] data, String[] colNames) {

            Object[][] new_data = new Object[data.length][];
            JComponent[] fieldComps = mapper.getFields();
            for (int i = 0; i < data.length; i++) {
                FormFieldGen[] cs = new FormFieldGen[mapper.count()];
                for (int j = 0; j < cs.length; j++) {
                    FormFieldSource new_col_src = new FormFieldSource(fieldComps[j], mapper.getSources(j));
                    cs[j] = new_col_src;
                    String[] src_arr = mapper.getSources(j);
                    for (int k = 0; k < src_arr.length; k++) {
                        String coln = src_arr[k];
                        for (int col = 0; col < data[i].length; col++) {
                            if (coln.equalsIgnoreCase(colNames[col])) {
                                new_col_src.setDBSrcValueAt(k, data[i][col]);
                                break;
                            }
                        }
                    }
                }
                new_data[i] = cs;
            }

            return new_data;
        }

        private void checkValidColumn(String[] db_columns) throws SQLException {
            //check if valid column source names where provided
            for (int i = 0; i < mapper.count(); i++) {
                String[] fld_srcs = mapper.getSources(i);
                for (String col : fld_srcs) {
                    String[] cols = db_columns; //get colums as they are. that is what we want here.
                    boolean found = false;
                    for (String col1 : cols) {
                        if (col1.equalsIgnoreCase(col)) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        throw new IllegalArgumentException("Missing column source. One or more columns source was not found. All column sources must be selected!");
                    }
                }
            }

        }

        private void initControls() {
            if (x_controls == null) {
                return;
            }
            //set action listeners of the controls not in the controller pane
            for (FormControl control : x_controls) {
                doControlInit(control);
            }
        }

        private void doControlInit(FormControl control) {

            if (control instanceof JNext) {
                JNext jnext = (JNext) control;
                jnext.addActionListener(new FormActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        jnextAcitionPerform(e);
                    }
                });
            } else if (control instanceof JPrevious) {
                JPrevious jprevious = (JPrevious) control;
                jprevious.addActionListener(new FormActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        jpreviousAcitionPerform(e);
                    }
                });
            } else if (control instanceof JFirst) {
                JFirst jfirst = (JFirst) control;
                jfirst.addActionListener(new FormActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        jfirstAcitionPerform(e);
                    }
                });
            } else if (control instanceof JLast) {
                JLast jlast = (JLast) control;
                jlast.addActionListener(new FormActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        jlastAcitionPerform(e);
                    }
                });
            } else if (control instanceof JReset) {
                JReset jreset = (JReset) control;
                jreset.addActionListener(new FormActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        jresetAcitionPerform(e);
                    }
                });
            } else if (control instanceof JSave) {
                JSave jsave = (JSave) control;
                jsave.addActionListener(new FormActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        jsaveAcitionPerform(e);
                    }
                });
            } else if (control instanceof JMoveTo) {
                JMoveTo jmoveTo = (JMoveTo) control;
                jmoveTo.addButtonActionListener(new FormActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        jmoveToAcitionPerform(e);
                    }
                });
                jmoveTo.addTextActionListener(new FormActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        jmoveToAcitionPerform(e);
                    }
                });
            } else if (control instanceof JFind) {
                JFind jfind = (JFind) control;
                jfind.setSearchObserver(this, jfind);
            } else if (control instanceof JCounter) {
                JCounter jcounter = (JCounter) control;
                //do nothing.
            } else {
                throw new IllegalArgumentException("Component not supported!");
            }

        }

        private void checksControlRepitition() {

            if (x_controls == null) {
                return;
            }
            //we do not want any two control of same type e.g jNext1 and jNext2
            for (int i = 0; i < x_controls.length; i++) {
                for (int k = 0; k < x_controls.length; k++) {
                    if (k == i) {
                        continue;//skip itself
                    }
                    try {//check if it is its type and throw exception if true
                        x_controls[i].getClass().cast(x_controls[k]);
                        //here it is its type so throw exception
                        throw new IllegalArgumentException("Form control duplicate detected! cannot repeat form control or its sub class - " + x_controls[i].getClass().getName());
                    } catch (ClassCastException ex) {
                        //Good, not its type
                    }
                }
            }
        }

        private boolean refresh() {

            Object[][] freshData;

            if (dataInputHandler == null) {
                freshData = refreshUsingSql();
            } else {
                freshData = refreshUsingDataInputHandler();
            }

            if (freshData != null) {
                if (record_index > freshData.length - 1) {
                    record_index = freshData.length - 1;
                }

                data = freshData;

                displayRecord(moveTo(record_index));//move to the current record
                updateJCounter();
            }

            return freshData != null;
        }

        private Object[][] refreshUsingDataInputHandler() {

            FormDataInputImpl input = new FormDataInputImpl(model_jdbc_settings);
            dataInputHandler.doInput(input);

            if (input.getData() == null) {
                Object[][] fetch = input.dbHelper.fetchArray();
                if (fetch != null && fetch.length > 0) {
                    input.setData(fetch);
                }
            }

            return input.getData();
        }

        private Object[][] refreshUsingSql() {

            Connection conn = null;
            PreparedStatement stmt = null;
            ResultSet rs = null;
            try {

                if (selectSQL == null || selectSQL.isEmpty()) {
                    return null;
                }

                conn = dbHelper.getConnection(model_jdbc_settings);

                if (conn == null) {
                    return null;
                }
                if (selectSQL == null || selectSQL.isEmpty()) {
                    return null;
                }

                stmt = conn.prepareStatement(selectSQL);
                Set<Map.Entry<String, Param>> e = selectParam.entrySet();
                for (Map.Entry<String, Param> entry : e) {
                    stmt.setObject(Integer.parseInt(entry.getKey()), entry.getValue().getValue());
                }
                rs = stmt.executeQuery();
                ResultSetMetaData m = rs.getMetaData();
                String[] db_cols = new String[m.getColumnCount()];
                ArrayList<Object[]> l = new ArrayList();

                while (rs.next()) {

                    Object[] row = new Object[db_cols.length];
                    for (int i = 0; i < db_cols.length; i++) {
                        //set column name using getColumnLabel method which more apporiate just in case there is AS clause
                        db_cols[i] = m.getColumnLabel(i + 1);//first column starts from 1, second from 2 and so on.

                        //set db field value
                        row[i] = rs.getObject(i + 1);//first column starts from 1, second from 2 and so on.
                    }
                    l.add(row);
                }

                Object[][] _data = new Object[l.size()][db_cols.length];
                for (int i = 0; i < l.size(); i++) {
                    _data[i] = l.get(i);
                }

                return fieldSourceData(_data, db_cols);

            } catch (SQLException ex) {
                String err_msg = "Failed to refresh record after operation!";
                System.err.println(err_msg);
                Logger.getLogger(FormProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                //use any of the form component to get the frame to display the message dialog
                JOptionPane.showMessageDialog(getFrame(fieldsComponents[0]), err_msg, "Refresh Failed", JOptionPane.ERROR_MESSAGE);
            } finally {
                if (stmt != null) {
                    try {
                        stmt.close();
                    } catch (SQLException ex) {
                        Logger.getLogger(FormProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                if (rs != null) {
                    try {
                        rs.close();
                    } catch (SQLException ex) {
                        Logger.getLogger(FormProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                if (conn != null) {
                    try {
                        conn.close();
                    } catch (SQLException ex) {
                        Logger.getLogger(FormProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            }

            return null;
        }

        Object getFieldValue(Object[] record_data, int field_index) {
            Object fieldValue = record_data[field_index];
            if (callBack != null) {
                FormFieldGen fieldGen = (FormFieldGen) fieldValue;
                fieldValue = callBack.doInput(fieldGen, record_index);
            }

            return fieldValue;
        }

        Object getFieldValue(Object value) {
            Object fieldValue = value;
            if (callBack != null) {
                FormFieldGen fieldGen = (FormFieldGen) fieldValue;
                fieldValue = callBack.doInput(fieldGen, record_index);
            }

            return fieldValue;
        }

        private void displayRecord(Object[] record_data) {
            for (int i = 0; i < this.fieldsComponents.length; i++) {
                if (record_data != null) {
                    Object fieldValue = getFieldValue(record_data[i]);
                    setComponentData(fieldsComponents[i], fieldValue);
                } else {
                    setComponentData(fieldsComponents[i], null);//reset the field components using null                    
                }
            }
        }

        void setComponentData(JComponent comp, Object compData) {

            String strData = compData != null ? compData.toString() : null; // null will clear the text.
            if (comp instanceof JTextComponent) {//All components that extend JTextComponent.
                ((JTextComponent) comp).setText(strData);
            } else if (comp instanceof JLabel) {//JLabel does not extend JTextComponent.
                ((JLabel) comp).setText(strData);
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

        private boolean hasNext() {
            return record_index < data.length - 1;
        }

        private boolean hasPrevious() {
            return record_index > 0;
        }

        private Object[] next() {
            ++record_index;
            return data[record_index];
        }

        private Object[] previous() {
            --record_index;
            return data[record_index];
        }

        private Object[] first() {
            record_index = 0;
            return data[record_index];
        }

        private Object[] last() {
            record_index = data.length - 1;
            return data[data.length - 1];
        }

        private Object[] moveTo(int index) {
            if (index >= data.length || index < 0) {
                return null;
            }
            record_index = index;
            return data[record_index];
        }

        int getRecordIndex() {
            return record_index;
        }

        private boolean isFirst() {
            return record_index == 0;
        }

        private boolean isBeforeFirst() {
            return record_index < 0;
        }

        private boolean isLast() {
            return record_index >= data.length - 1;
        }

        Object getValueAt(int field_index) {
            return data[record_index][field_index];
        }

        private void jnextAcitionPerform(ActionEvent e) {
            if (hasNext()) {
                displayRecord(next());
                updateJCounter();
            }
        }

        private void jpreviousAcitionPerform(ActionEvent e) {
            if (hasPrevious()) {
                displayRecord(previous());
                updateJCounter();
            }
        }

        private void jfirstAcitionPerform(ActionEvent e) {
            displayRecord(first());
            updateJCounter();
        }

        private void jlastAcitionPerform(ActionEvent e) {
            displayRecord(last());
            updateJCounter();
        }

        private void jresetAcitionPerform(ActionEvent e) {
            displayRecord(reset());//this will reset the form components
            updateJCounter();
        }

        private void jsaveAcitionPerform(ActionEvent e) {
            if (saveRecord()) {
                if (reset_form_after_save) {
                    reset();//reset the form
                    displayRecord(moveTo(record_index));
                    updateJCounter();
                }
            }
        }

        private void jmoveToAcitionPerform(ActionEvent e) {
            JMoveTo comp = this.getJMoveTo();
            if (comp == null) {
                return;
            }

            int move_index = comp.getMoveToIndex();
            if (move_index < 0) {
                comp.setRecordNumber(1);//go to first record
                return;//though negative do nothing. do not even reset! not your job.
            }

            if (move_index > data.length - 1) {
                comp.setRecordNumber(data.length);
                return;
            }

            displayRecord(moveTo(move_index));
            updateJCounter();
        }

        /**
         * Called when the search is found.
         *
         * @param found_index
         */
        private void jfindAcitionPerform(int found_index) {
            displayRecord(moveTo(found_index));
            updateJCounter();//finally
        }

        private void updateJCounter() {
            if (getJCounter() == null || data == null) {
                return;//do nothing
            }

            jCounter.setRecordLabel(record_index + 1, data.length);
        }

        JMoveTo getJMoveTo() {
            if (jMoveTo != null) {
                return jMoveTo;
            }
            if (x_controls != null) {
                for (FormControl control : x_controls) {
                    if (control instanceof JMoveTo) {
                        jMoveTo = (JMoveTo) control;
                        return jMoveTo;
                    }
                }
            }

            if (pane_controls != null) {
                for (FormControl control : pane_controls) {
                    if (control instanceof JMoveTo) {
                        jMoveTo = (JMoveTo) control;
                        return jMoveTo;
                    }
                }
            }
            return null;
        }

        JCounter getJCounter() {
            if (jCounter != null) {
                return jCounter;
            }

            if (x_controls != null) {
                for (FormControl control : x_controls) {
                    if (control instanceof JCounter) {
                        jCounter = (JCounter) control;
                        return jCounter;
                    }
                }
            }

            if (pane_controls != null) {
                for (FormControl control : pane_controls) {
                    if (control instanceof JCounter) {
                        jCounter = (JCounter) control;
                        return jCounter;
                    }
                }
            }
            return null;
        }

        JSave getJSave() {
            if (jSave != null) {
                return jSave;
            }

            if (x_controls != null) {
                for (FormControl control : x_controls) {
                    if (control instanceof JSave) {
                        jSave = (JSave) control;
                        return jSave;
                    }
                }
            }

            if (pane_controls != null) {
                for (FormControl control : pane_controls) {
                    if (control instanceof JSave) {
                        jSave = (JSave) control;
                        return jSave;
                    }
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
            this.record_index = RESET_INDEX;
            return null;//force form components reset by returning null
        }
        boolean reset_form_after_save;

        private boolean saveRecord() {

            FormFieldPost post = new FormFieldPost() {
                FormFieldImpl[] updateEntries = new FormFieldImpl[0];
                private boolean is_refresh = true;//refresh by default
                private Color bgColor;
                private Color fgColor;
                Validator validator = new Validator() {
                    @Override
                    protected void setComponentForeground(JComponent comp, boolean is_valid) {
                        Color fg_color = intialCompForeground.get(comp.hashCode());
                        if (fg_color == null) {
                            return;
                        }
                        if (is_valid) {
                            comp.setForeground(fg_color);
                        } else {
                            if (fgColor != null) {
                                comp.setForeground(fgColor);
                            }
                        }
                    }

                    @Override
                    protected void setComponentBackground(JComponent comp, boolean is_valid) {
                        Color bg_color = intialCompBackground.get(comp.hashCode());
                        if (bg_color == null) {
                            return;
                        }
                        if (is_valid) {
                            comp.setBackground(bg_color);
                        } else {
                            if (bgColor != null) {
                                comp.setBackground(bgColor);
                            }
                        }
                    }
                };

                {
                    reset_form_after_save = false;
                }

                @Override
                public IFormField[] getFormFields() {

                    if (updateEntries.length > 0) {
                        return updateEntries;//already have them
                    }

                    updateEntries = new FormFieldImpl[fieldsComponents.length];
                    for (int field_index = 0; field_index < updateEntries.length; field_index++) {
                        String accessible_name = fieldsComponents[field_index].getAccessibleContext().getAccessibleName();
                        Object old_value = record_index > RESET_INDEX ? getFieldValue(data[record_index], field_index) : null;
                        Object value = getValue(fieldsComponents[field_index]);
                        updateEntries[field_index] = new FormFieldImpl(accessible_name, fieldsComponents[field_index], old_value, value);
                        if (callBack != null && old_value != null) {
                            FormFieldSource fieldSource = (FormFieldSource) data[record_index][field_index];
                            updateEntries[field_index].setSources(fieldSource.getDBSrcColumns());
                        }

                    }
                    return updateEntries;
                }

                @Override
                public boolean isNew() {
                    return record_index == RESET_INDEX;
                }

                @Override
                public boolean isUpdate() {
                    return record_index > RESET_INDEX;
                }

                @Override
                public int count() {
                    return getFormFields().length;
                }

                private int getIntType(Option type) {
                    switch (type) {
                        case SUCCESS:
                            return JOptionPane.INFORMATION_MESSAGE;//come back to use custom later
                        case INFO:
                            return JOptionPane.INFORMATION_MESSAGE;
                        case WARNING:
                            return JOptionPane.WARNING_MESSAGE;
                        case ERROR:
                            return JOptionPane.ERROR_MESSAGE;
                        case OK_CANCEL:
                            return JOptionPane.OK_CANCEL_OPTION;
                        case YES_NO:
                            return JOptionPane.YES_NO_OPTION;
                        case YES_NO_CANCEL:
                            return JOptionPane.YES_NO_CANCEL_OPTION;
                        default:
                            return JOptionPane.INFORMATION_MESSAGE;
                    }
                }

                @Override
                public void alert(String message, String title) {
                    JOptionPane.showMessageDialog(getFrame(getJSave()), message, title, JOptionPane.INFORMATION_MESSAGE);
                }

                @Override
                public void alert(String message, String title, Option type) {
                    JOptionPane.showMessageDialog(getFrame(getJSave()), message, title, getIntType(type));
                }

                @Override
                public void alert(String message, String title, Option type, Icon icon) {
                    JOptionPane.showMessageDialog(getFrame(getJSave()), message, title, getIntType(type), icon);
                }

                @Override
                public void alert(Component container, String message, String title) {
                    JOptionPane.showMessageDialog(container, message, title, JOptionPane.INFORMATION_MESSAGE);
                }

                @Override
                public void alert(Component container, String message, String title, Option type) {
                    JOptionPane.showMessageDialog(container, message, title, getIntType(type));
                }

                @Override
                public void alert(Component container, String message, String title, Option type, Icon icon) {
                    JOptionPane.showMessageDialog(container, message, title, getIntType(type), icon);
                }

                @Override
                public void refresh(boolean is_refresh) {
                    this.is_refresh = is_refresh;
                }

                @Override
                public boolean isRefreshAllowed() {
                    return is_refresh;
                }

                @Override
                public Option comfirm(String message, String title, Option OptType) {
                    int result = JOptionPane.showConfirmDialog(getFrame(getJSave()), message, title, getIntType(OptType));
                    return getOpiton(result);
                }

                @Override
                public Option comfirm(String message, String title, Option OptType, Option msg_type) {
                    int result = JOptionPane.showConfirmDialog(getFrame(getJSave()), message, title, getIntType(OptType), getIntType(msg_type));
                    return getOpiton(result);
                }

                @Override
                public Option comfirm(String message, String title, Option OptType, Option msg_type, Icon icon) {
                    int result = JOptionPane.showConfirmDialog(getFrame(getJSave()), message, title, getIntType(OptType), getIntType(msg_type), icon);
                    return getOpiton(result);
                }

                @Override
                public Option comfirm(Component container, String message, String title, Option OptType) {
                    int result = JOptionPane.showConfirmDialog(container, message, title, getIntType(OptType));
                    return getOpiton(result);
                }

                @Override
                public Option comfirm(Component container, String message, String title, Option OptType, Option msg_type) {
                    int result = JOptionPane.showConfirmDialog(container, message, title, getIntType(OptType), getIntType(msg_type));
                    return getOpiton(result);
                }

                @Override
                public Option comfirm(Component container, String message, String title, Option OptType, Option msg_type, Icon icon) {
                    int result = JOptionPane.showConfirmDialog(container, message, title, getIntType(OptType), getIntType(msg_type), icon);
                    return getOpiton(result);
                }

                private Option getOpiton(int result) {
                    if (result == JOptionPane.YES_OPTION) {
                        return Option.YES;
                    }
                    switch (result) {
                        case JOptionPane.OK_OPTION:
                            return Option.OK;
                        case JOptionPane.NO_OPTION:
                            return Option.NO;
                        case JOptionPane.CANCEL_OPTION:
                            return Option.CANCEL;
                        case JOptionPane.CLOSED_OPTION:
                            return Option.CLOSED;
                    }
                    return Option.CLOSED;
                }

                JComponent[] getComponentsByAccessNames(String... accessible_names) {
                    if (accessible_names == null) {
                        return new JComponent[0];
                    }
                    Set<JComponent> set = new HashSet();
                    for (JComponent fieldsComponent : fieldsComponents) {
                        for (String accessible_name : accessible_names) {
                            if (accessible_name == null) {
                                continue;
                            }
                            if (accessible_name.equals(fieldsComponent.getAccessibleContext().getAccessibleName())) {
                                set.add(fieldsComponent);
                            }
                        }
                    }

                    JComponent[] comps = new JComponent[set.size()];
                    set.toArray(comps);
                    return comps;
                }

                @Override
                public void runAllValidations(boolean is_validate_all) {
                    validator.runAllValidations(is_validate_all);
                }

                @Override
                public boolean isRunAllValidations() {
                    return validator.isRunAllValidations();
                }

                @Override
                public boolean validateAnyEmtpy() {
                    return validator.validateEmpty(fieldsComponents);
                }

                @Override
                public boolean validateEmtpy(String... accessible_names) {
                    return validator.validateEmpty(getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateEmtpy(JComponent... comps) {
                    return validator.validateEmpty(comps);
                }

                @Override
                public boolean validateAnyEmtpy(ErrorCallBack errCall) {
                    return validator.validateEmpty(errCall, fieldsComponents);
                }

                @Override
                public boolean validateEmtpy(ErrorCallBack errCall, String... accessible_names) {
                    return validator.validateEmpty(errCall, getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateEmtpy(ErrorCallBack errCall, JComponent... comps) {
                    return validator.validateEmpty(errCall, comps);
                }

                @Override
                public boolean validateAlertAnyEmtpy() {
                    ErrorAlert errAlert = new ErrorAlert(this);
                    errAlert.setMsgAppend("field cannot be empty!");
                    return validator.validateEmpty(errAlert, fieldsComponents);
                }

                @Override
                public boolean validateAlertEmtpy(String... accessible_names) {
                    ErrorAlert errAlert = new ErrorAlert(this);
                    errAlert.setMsgAppend("field cannot be empty!");
                    return validator.validateEmpty(errAlert, getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateAlertEmtpy(JComponent... comps) {
                    ErrorAlert errAlert = new ErrorAlert(this);
                    errAlert.setMsgAppend("field cannot be empty!");
                    return validator.validateEmpty(errAlert, comps);
                }

                @Override
                public boolean validateAnyNumeric() {
                    return validator.validateNumeric(fieldsComponents);
                }

                @Override
                public boolean validateNumeric(String... accessible_names) {
                    return validator.validateNumeric(getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateNumeric(JComponent... comps) {
                    return validator.validateNumeric(comps);
                }

                @Override
                public boolean validateAnyNumeric(ErrorCallBack errCall) {
                    return validator.validateNumeric(errCall, fieldsComponents);
                }

                @Override
                public boolean validateNumeric(ErrorCallBack errCall, String... accessible_names) {
                    return validator.validateNumeric(errCall, getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateNumeric(ErrorCallBack errCall, JComponent... comps) {
                    return validator.validateNumeric(errCall, comps);
                }

                @Override
                public boolean validateAlertAnyNumeric() {
                    ErrorAlert errAlert = new ErrorAlert(this);
                    errAlert.setMsgAppend("field must be numeric!");
                    return validator.validateEmpty(errAlert, fieldsComponents);
                }

                @Override
                public boolean validateAlertNumeric(String... accessible_names) {
                    ErrorAlert errAlert = new ErrorAlert(this);
                    errAlert.setMsgAppend("field cannot be empty!");
                    return validator.validateEmpty(errAlert, getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateAlertNumeric(JComponent... comps) {
                    ErrorAlert errAlert = new ErrorAlert(this);
                    errAlert.setMsgAppend("field cannot be empty!");
                    return validator.validateEmpty(errAlert, comps);
                }

                @Override
                public boolean validateAnyNumber() {
                    return validator.validateNumber(fieldsComponents);
                }

                @Override
                public boolean validateNumber(String... accessible_names) {
                    return validator.validateNumber(getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateNumber(JComponent... comp) {
                    return validator.validateNumber(comp);
                }

                @Override
                public boolean validateAnyNumber(ErrorCallBack errCall) {
                    return validator.validateNumber(errCall, fieldsComponents);
                }

                @Override
                public boolean validateNumber(ErrorCallBack errCall, String... accessible_names) {
                    return validator.validateNumber(errCall, getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateNumber(ErrorCallBack errCall, JComponent... comp) {
                    return validator.validateNumber(errCall, comp);
                }

                @Override
                public boolean validateAlertAnyNumber() {
                    ErrorAlert errAlert = new ErrorAlert(this);
                    errAlert.setMsgAppend("field must be a number!");
                    return validator.validateEmpty(errAlert, fieldsComponents);
                }

                @Override
                public boolean validateAlertNumber(String... accessible_names) {
                    ErrorAlert errAlert = new ErrorAlert(this);
                    errAlert.setMsgAppend("field cannot be a number!");
                    return validator.validateEmpty(errAlert, getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateAlertNumber(JComponent... comps) {
                    ErrorAlert errAlert = new ErrorAlert(this);
                    errAlert.setMsgAppend("field cannot be a number!");
                    return validator.validateEmpty(errAlert, comps);
                }

                @Override
                public boolean validateAnyCustom(ValidationHandler validationHandler) {
                    return validator.validateCustom(validationHandler, fieldsComponents);
                }

                @Override
                public boolean validateCustom(ValidationHandler validationHandler, String... accessible_names) {
                    return validator.validateCustom(validationHandler, getComponentsByAccessNames(accessible_names));
                }

                @Override
                public boolean validateCustom(ValidationHandler validationHandler, JComponent... comps) {
                    return validator.validateCustom(validationHandler, comps);
                }

                @Override
                public JComponent[] getComponents() {
                    return fieldsComponents;
                }

                @Override
                public IFormField field(String accessible_name) {
                    if (accessible_name == null) {
                        throw new NullPointerException("accessible name must not be null");
                    }

                    IFormField[] fields = getFormFields();
                    for (IFormField field : fields) {
                        if (accessible_name.equals(field.getAccessibleName())) {
                            return field;
                        }
                    }
                    throw new IllegalArgumentException("accessible name must be known - " + accessible_name + " not found");
                }

                @Override
                public Object value(String accessible_name) {
                    if (accessible_name == null) {
                        throw new NullPointerException("accessible name must not be null");
                    }
                    IFormField[] fields = getFormFields();
                    for (IFormField field : fields) {
                        if (accessible_name.equals(field.getAccessibleName())) {
                            return field.getValue();
                        }
                    }
                    throw new IllegalArgumentException("accessible name must be known - " + accessible_name + " not found");

                }

                @Override
                public void reset() {
                    reset_form_after_save = true;
                }

                @Override
                public void setErrorIndicator(Color bgColor) {
                    this.bgColor = bgColor;
                }

                @Override
                public void setErrorIndicator(Color bgColor, Color fgColor) {
                    this.bgColor = bgColor;
                    this.fgColor = fgColor;
                }
            };

            formFieldsPostHandler.doPost(new ActionSQLImpl(model_jdbc_settings), post);

            if (post.isRefreshAllowed()) {
                return refresh();
            }

            return true;

        }

        @Override
        public Object[][] searchedData() {
            Object[][] backing_data = new Object[data.length][];
            for (int i = 0; i < data.length; i++) {

                Object[] d = data[i];
                backing_data[i] = new Object[d.length];
                for (int k = 0; k < d.length; k++) {
                    if (callBack == null) {
                        backing_data[i][k] = d[k];
                    } else {
                        FormFieldGen fieldGen = ((FormFieldGen[]) d)[k];
                        backing_data[i][k] = callBack.doInput(fieldGen, i);
                    }
                }
            }

            return backing_data;
        }

        @Override
        public void foundSearch(JComponent source_component, String searchStr, int found_index) {
            jfindAcitionPerform(found_index);
        }

        @Override
        public void finishedSearch(JComponent source_component, String searchStr, int total_found) {
            String match_str = total_found > 1 ? total_found + " matches" : total_found + " match";
            JOptionPane.showMessageDialog(getFrame(source_component), "Finished searching " + searchStr,
                    "Finished - " + match_str, JOptionPane.INFORMATION_MESSAGE);
        }

        @Override
        public void notFound(JComponent source_component, String searchStr) {
            JOptionPane.showMessageDialog(getFrame(source_component), searchStr + " was not found.", "Not found", JOptionPane.INFORMATION_MESSAGE);
        }

        @Override
        public void setNextPullTime(long next_poll_time) {
            this.next_poll_time = next_poll_time;
        }

        @Override
        public long getNextPullTime() {
            return next_poll_time;
        }

        @Override
        public void pullData() {

            Object[][] poll_data = null;
            if (dataInputHandler != null) {
                poll_data = refreshUsingDataInputHandler();
            }

            if (callBack != null) {
                poll_data = refreshUsingSql();
            }

            boolean external_change = false;
            for (int i = 0; i < data.length || i < poll_data.length; i++) {
                for (int k = 0; k < data[i].length; k++) {
                    Object cur_value = getFieldValue(data, k);
                    Object poll_value = getFieldValue(poll_data, k);
                    if (!cur_value.equals(poll_value)) {
                        external_change = true;
                        break;
                    }
                }
            }

            if (poll_data.length < data.length) {
                external_change = true;
            }

            if (external_change) {
                //TO BE TESTED!!!
                JOptionPane.showMessageDialog(getFrame(fieldsComponents[0]), "Current form record(s) is being updated!\nThis may undo your last changes made before your last save operation.", "External Update", JOptionPane.INFORMATION_MESSAGE);
            }

            if (record_index > poll_data.length - 1) {
                record_index = poll_data.length - 1;
            }

            data = poll_data;

            displayRecord(moveTo(record_index));//move to the current record
            updateJCounter();

        }

        @Override
        public void setPullingEnabled(boolean isPull) {
            dataPollEnabled = isPull;
        }

        @Override
        public boolean isPullingEnabled() {
            return dataPollEnabled;
        }

        @Override
        public void setPullingInterval(float seconds) {
            dataPollInterval = seconds;
        }

        @Override
        public float getPullingInterval() {
            return dataPollInterval;
        }

        /**
         * This method will pause the data pull if all the form components are
         * not showing.
         *
         * @return
         */
        @Override
        public boolean pausePull() {
            //check if any of the form component is showing
            for (JComponent fieldsComponent : fieldsComponents) {
                if (fieldsComponent.isShowing()) {
                    return false;//at least a component is showing so do not pausePull
                }
            }
            return true;//all components are hidden so pausePull
        }

        @Override
        public boolean stopPull() {
            return false;
        }

        private void disableAllFormControls() {
            if (controllers_pane != null) {
                controllers_pane.controlFailedState(true);
            }
            if (x_controls != null) {
                for (int i = 0; i < x_controls.length; i++) {
                    x_controls[i].controlFailedState(true);
                }
            }
        }
    }
}

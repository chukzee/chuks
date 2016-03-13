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
import com.chuks.report.processor.util.JDBCSettings;
import com.chuks.report.processor.AbstractUIDBProcessor;
import com.chuks.report.processor.bind.ListBindHanler;
import com.chuks.report.processor.FormFieldMapper;
import com.chuks.report.processor.FormDataInputHandler;
import com.chuks.report.processor.FormFieldCallBack;
import com.chuks.report.processor.FormFieldGen;
import com.chuks.report.processor.FormFieldPost;
import com.chuks.report.processor.FormProcessor;
import com.chuks.report.processor.FormPostHandler;
import com.chuks.report.processor.IFormField;
import com.chuks.report.processor.TableFieldGen;
import com.chuks.report.processor.bind.TextBindHandler;
import com.chuks.report.processor.event.FormActionListener;
import com.chuks.report.processor.event.SearchObserver;
import com.chuks.report.processor.form.controls.JFirst;
import com.chuks.report.processor.form.controls.JLast;
import com.chuks.report.processor.form.controls.JReset;
import com.chuks.report.processor.form.controls.JSave;
import java.awt.event.ActionEvent;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JRadioButton;
import javax.swing.JTextField;
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
    public void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, FormControl... controls) throws SQLException {
        DefaultFormModel formModel = new FormModelBuilder()
                .setDataInputHandler(dataInputHandler)
                .setUpdateFormHandler(updateFieldHandler)
                .setFormControl(controls)
                .build();
    }

    @Override
    public void formLoad(FormDataInputHandler dataInputHandler, FormPostHandler updateFieldHandler, JControllerPane controllers_pane) throws SQLException {
        DefaultFormModel formModel = new FormModelBuilder()
                .setDataInputHandler(dataInputHandler)
                .setUpdateFormHandler(updateFieldHandler)
                .setJControllerPane(controllers_pane)
                .build();
    }

    @Override
    public void formLoad(FormFieldCallBack callBack, FormFieldMapper mapper, FormPostHandler updateFieldHandler, FormControl... controls) throws SQLException {

        DefaultFormModel formModel = new FormModelBuilder()
                .setFormFieldCallBack(callBack)
                .setFormFieldMapper(mapper)
                .setUpdateFormHandler(updateFieldHandler)
                .setFormControl(controls)
                .build();

    }

    @Override
    public void formLoad(FormFieldCallBack callBack, FormFieldMapper mapper, FormPostHandler updateFieldHandler, JControllerPane controllers_pane) throws SQLException {
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
        handler.data(input);

        if (input.getData() == null) {
            return;
        }

        list.setListData(input.getData());

        //TODO data polling
    }

    @Override
    public void bind(JComboBox combo, ListBindHanler handler) {
        ListDataInputImpl input = new ListDataInputImpl(jdbcSettings);
        handler.data(input);

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
        handler.data(input);

        if (input.getData() == null) {
            return;
        }

        textField.setText(input.getData().toString());

        //TODO data polling
    }

    @Override
    public void bind(JLabel label, TextBindHandler handler) {
        TextDataInputImpl input = new TextDataInputImpl(jdbcSettings);
        handler.data(input);

        if (input.getData() == null) {
            return;
        }

        label.setText(input.getData().toString());

        //TODO data polling
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

        private DefaultFormModel build() throws SQLException {
            return new DefaultFormModel(this);
        }

    }

    class DefaultFormModel implements SearchObserver {

        FormControl[] controls;
        JComponent[] fieldsComponents;
        private final JControllerPane controllers_pane;
        Object[][] data;
        private final int RESET_INDEX = -1;
        int record_index = RESET_INDEX;
        private final FormFieldCallBack callBack;
        private final FormDataInputHandler dataInputHandler;
        private final FormFieldMapper mapper;
        private final FormPostHandler formFieldsPostHandler;
        private final String selectSQL;
        private final Map selectParam;
        private final JDBCSettings model_jdbc_settings;
        String[] db_columns;
        private JMoveTo jMoveTo;
        private JCounter jCounter;

        private DefaultFormModel(FormModelBuilder builder) throws SQLException {

            this.callBack = builder.callBack;
            this.dataInputHandler = builder.dataInputHandler;
            this.mapper = builder.mapper;
            this.formFieldsPostHandler = builder.updateFieldHandler;
            this.controls = builder.controls;
            this.controllers_pane = builder.controllers_pane;

            data = dbHelper.fetchArray();
            selectSQL = dbHelper.getSelectSQL();
            selectParam = dbHelper.getSelectParams();
            model_jdbc_settings = new JDBCSettings(dbHelper.getJdbcSetting());//we need to copy
            db_columns = dbHelper.getColumns(true);

            if (callBack != null && mapper != null) {
                fieldsComponents = mapper.getFields();
                data = generateCallBackData();
            }

            if (dataInputHandler != null) {
                FormDataInputImpl input = new FormDataInputImpl(jdbcSettings);
                dataInputHandler.onInput(input);
                data = input.getData();
                fieldsComponents = input.getFieldComponents();
            }

            checksControlRepitition();
            initControls();
            initControllerPane();

            if (data!=null || data.length > 0) {
                displayRecord(moveTo(0));//move to the first record
                updateJCounter();
            }
        }

        private void initControllerPane() {
            if (controllers_pane == null) {
                return;
            }

            //TODO add the control to the controller pane
        }

        private Object[][] generateCallBackData() throws SQLException {
            checkValidColumn();
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

        private void checkValidColumn() throws SQLException {
            //check if valid column source names where provided
            for (int i = 0; i < mapper.count(); i++) {
                String[] fld_srcs = mapper.getSources(i);
                for (String col : fld_srcs) {
                    String[] cols = dbHelper.getColumns(true); //get colums as they are. that is what we want here.
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

            //set action listeners of the components
            for (FormControl control : controls) {
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
        }

        private void checksControlRepitition() {

            if (controls == null) {
                return;
            }
            //we do not want any two control of same type e.g jNext1 and jNext2
            for (int i = 0; i < controls.length; i++) {
                for (int k = 0; k < controls.length; k++) {
                    if (k == i) {
                        continue;//skip itself
                    }
                    try {//check if it is its type and throw exception if true
                        controls[i].getClass().cast(controls[k]);
                        //here it is its type so throw exception
                        throw new IllegalArgumentException("Form control duplicate detected! cannot repeat form control or its sub class - " + controls[i].getClass().getName());
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

            updateJCounter();

            return freshData != null;
        }

        private Object[][] refreshUsingDataInputHandler() {

            FormDataInputImpl input = new FormDataInputImpl(model_jdbc_settings);
            dataInputHandler.onInput(input);
            return input.getData();
        }

        private Object[][] refreshUsingSql() {

            Connection conn = null;
            PreparedStatement stmt = null;
            ResultSet rs = null;
            try {

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
                String err_msg = "Failed to refresh table after operation!";
                System.err.println(err_msg);
                Logger.getLogger(FormProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                //use any of the form component to get the frame to display the message dialog
                JOptionPane.showMessageDialog(fieldsComponents[0], err_msg, "Refresh Failed", JOptionPane.ERROR_MESSAGE);
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
                fieldValue = callBack.onBeforeInput(fieldGen, record_index);
            }

            return fieldValue;
        }

        Object getFieldValue(Object value) {
            Object fieldValue = value;
            if (callBack != null) {
                FormFieldGen fieldGen = (FormFieldGen) fieldValue;
                fieldValue = callBack.onBeforeInput(fieldGen, record_index);
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
            if (index >= data.length) {
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
                reset();//after every successful save, reset the form
                updateJCounter();
            }
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
            for (FormControl control : controls) {
                if (control instanceof JMoveTo) {
                    jMoveTo = (JMoveTo) control;
                    return jMoveTo;
                }
            }
            return null;
        }

        JCounter getJCounter() {
            if (jCounter != null) {
                return jCounter;
            }
            for (FormControl control : controls) {
                if (control instanceof JCounter) {
                    jCounter = (JCounter) control;
                    return jCounter;
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

        private boolean saveRecord() {

            FormFieldPost post = new FormFieldPost() {
                FormFieldImpl[] updateEntries = new FormFieldImpl[0];

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

            };

            formFieldsPostHandler.doPost(new ActionSQLImpl(model_jdbc_settings), post);

            return refresh();

        }

        @Override
        public Object[][] searchedData() {
            Object[][] backing_data = new Object[data.length][];
            for (int i = 0; i < data.length; i++) {
                
                Object[] d =  data[i];
                backing_data[i] = new Object[d.length];
                for (int k = 0; k < d.length; k++) {
                    if (callBack == null) {
                        backing_data[i][k] = d[k];
                    } else {
                        FormFieldGen fieldGen = ((FormFieldGen[]) d)[k];
                        backing_data[i][k] = callBack.onBeforeInput(fieldGen, i);
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
            JOptionPane.showMessageDialog(source_component, "Finished searching " + searchStr,
                    "Finished - " + match_str, JOptionPane.INFORMATION_MESSAGE);
        }

        @Override
        public void notFound(JComponent source_component, String searchStr) {
            JOptionPane.showMessageDialog(source_component, searchStr + " was not found.", "Not found", JOptionPane.INFORMATION_MESSAGE);
        }
    }
}

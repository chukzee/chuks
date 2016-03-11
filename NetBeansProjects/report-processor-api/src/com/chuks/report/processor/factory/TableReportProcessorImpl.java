/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.*;
import java.util.*;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.*;
import javax.swing.table.*;
import org.jooq.Param;
import com.chuks.report.processor.*;
import com.chuks.report.processor.util.JDBCSettings;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class TableReportProcessorImpl<T> extends AbstractUIDBProcessor implements TableProcessor, Cloneable {

    private boolean isColumnAsIs;
    static private List boxHashes = Collections.synchronizedList(new ArrayList());
    private Box table_toolbox;
    private boolean isDisplayToolbox;
    private boolean isDisplayFine;
    private boolean isDisplayFilter;

    public TableReportProcessorImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override  //NOT YET TESTED
    public void tableLoad(JTable table, TableDataInputHandler dataInputHandler, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler) throws SQLException {

        ReportTableModel tableModel = load0(table, dataInputHandler, updateFieldHandler, deleteRowHandler);

        if (tableModel == null) {
            return;
        }

        table.setModel(tableModel);

        setRowSorter(table);
        relayoutTableReport(table);

    }

    @Override  //NOT YET TESTED
    public void tableLoad(JComponent container, TableDataInputHandler dataInputHandler, TableFieldRenderer renderer, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler) throws SQLException {

        if (container instanceof JTable) {
            throw new IllegalArgumentException("Container type cannot be a JTable or its sub class!  You may use JPanel.");
        }

        //set the table parameter to null in the meantime. we shall create it later
        ReportTableModel tableModel = load0(null, dataInputHandler, updateFieldHandler, deleteRowHandler);

        if (tableModel == null) {
            return;
        }

        //we promised to create the table later
        JTable table = createTable(renderer, tableModel);//now create the table

        table.setModel(tableModel);

        JScrollPane scrollPane1 = new JScrollPane();
        scrollPane1.setViewportView(table);
        container.add(scrollPane1);

        setRowSorter(table);
        relayoutTableReport(table);

    }

    public ReportTableModel load0(JTable table, TableDataInputHandler dataInputHandler, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler) throws SQLException {

        TableDataInputImpl input = new TableDataInputImpl(new JDBCSettings(jdbcSettings));//copy jdbcSettings 
        dataInputHandler.onInput(input);
        this.setDataPollingEnabled(input.isPollingEnabled());
        this.setDataPollingInterval(input.getPollingInterval());

        if (input.getData() == null) {
            return null;
        }

        List list = new ArrayList();
        for (Object[] data : input.getData()) {
            list.add(data);
        }
        ReportTableModel tableModel = new ReportTableModel(null,
                updateFieldHandler, deleteRowHandler,
                dbHelper.getSelectSQL(), dbHelper.getSelectParams(),
                input.getDBSettings());//ok. input.getDBSettings() already copied jdbcSettings - see above!

        tableModel.setColumnNames(input.getColumns());
        tableModel.setTableFieldSource(null);
        tableModel.addRangeRowData(list);
        tableModel.setDataInputHandler(dataInputHandler);

        return tableModel;
    }

    @Override
    public void tableLoad(JTable table, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler) throws SQLException {

        List<Object[]> list = new ArrayList();
        list.addAll(Arrays.asList(dbHelper.fetchArray()));
        ReportTableModel tableModel = new ReportTableModel(null, updateFieldHandler,
                deleteRowHandler, dbHelper.getSelectSQL(), dbHelper.getSelectParams(),
                dbHelper.getJdbcSetting());
        tableModel.setColumnNames(dbHelper.getColumns(isColumnAsIs));
        tableModel.setTableFieldSource(null);
        tableModel.addRangeRowData(list);

        table.setModel(tableModel);

        setRowSorter(table);
        relayoutTableReport(table);
    }

    @Override
    public void tableLoad(JTable table, Object[][] data, String... columns) {
        if (columns.length < data.length) {
            //TODO
        } else if (columns.length > data.length) {
            //TODO
        }

        List<Object[]> list = new ArrayList();
        list.addAll(Arrays.asList(data));
        ReportTableModel tableModel = new ReportTableModel(null, null, null, null, null, null);
        tableModel.setColumnNames(columns);
        tableModel.setTableFieldSource(null);
        tableModel.addRangeRowData(list);

        table.setModel(tableModel);
        setRowSorter(table);
        relayoutTableReport(table);
    }

    @Override
    public void tableLoad(JTable table, TableFieldCallBack inputCallBack, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler, TableFieldSource... columnSources) throws SQLException {
        ReportTableModel tableModel = createTableModel(inputCallBack, updateFieldHandler, deleteRowHandler, columnSources);
        table.setModel(tableModel);
        setRowSorter(table);
        relayoutTableReport(table);
    }

    @Override
    public void tableLoad(JTable table, TableFieldCallBack inputCallBack, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler, TableFieldMapper mapper) throws SQLException {
        tableLoad(table, inputCallBack, updateFieldHandler, deleteRowHandler, mapper.getFieldSources());
    }

    @Override
    public JTable tableLoad(JComponent container, TableFieldCallBack inputCallBack, TableFieldRenderer renderer, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler, TableFieldMapper mapper) throws SQLException {
        return tableLoad(container, inputCallBack, renderer, updateFieldHandler, deleteRowHandler, mapper.getFieldSources());
    }

    @Override
    public JTable tableLoad(JComponent container, TableFieldCallBack inputCallBack, final TableFieldRenderer renderer, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler, TableFieldSource... columnSources) throws SQLException {

        if (container instanceof JTable) {
            throw new IllegalArgumentException("Container type cannot be a JTable or its sub class!  You may use JPanel.");
        }

        final ReportTableModel tableModel = createTableModel(inputCallBack, updateFieldHandler, deleteRowHandler, columnSources);

        JTable table = createTable(renderer, tableModel);

        table.setModel(tableModel);
        setRowSorter(table);
        JScrollPane scrollPane1 = new JScrollPane();
        scrollPane1.setViewportView(table);
        container.add(scrollPane1);
        relayoutTableReport(table);
        return table;
    }

    private JTable createTable(final TableFieldRenderer renderer, final ReportTableModel tableModel) {

        if (renderer == null) {
            return new JTable();
        }

        JTable table = new JTable() {
            @Override
            public TableCellRenderer getCellRenderer(int row, int column) {
                return new TableCellRenderer() {
                    @Override
                    public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                        TableFieldGen field = ((TableFieldGen[]) tableModel.data.get(row))[column];
                        return renderer.getFieldRendererComponent(table, field, value, isSelected, hasFocus, row, column);
                    }
                };
            }

        };
        return table;
    }

    private void relayoutTableReport(JTable table) {
        Container p = table.getParent();
        Container main_cn = null;
        Component rmv = null;//component to remove from container
        int pos = -1;
        Rectangle bounds;
        if (p != null) {
            if (p instanceof javax.swing.JViewport) {
                Container p1 = p.getParent();
                if (p1 instanceof javax.swing.JScrollPane) {
                    main_cn = p1.getParent();
                    rmv = p1;
                } else {
                    main_cn = p1;
                    rmv = p;
                }
            } else {
                main_cn = p;
                rmv = table;
            }
        } else {
            throw new IllegalStateException("No parent found - JTable must have a parent container!");
        }

        bounds = rmv.getBounds();
        String tab_title = "";
        String tab_tip = "";
        Icon tab_icon = null;
        if (main_cn instanceof javax.swing.JTabbedPane) {
            javax.swing.JTabbedPane tab = (javax.swing.JTabbedPane) main_cn;
            for (int i = 0; i < tab.getTabCount(); i++) {
                System.out.println("i " + i + " ----> " + tab.getComponentAt(i));
                if (rmv.equals(tab.getComponentAt(i))) {
                    tab_title = tab.getTitleAt(i);
                    tab_tip = tab.getToolTipTextAt(i);
                    tab_icon = tab.getIconAt(i);
                    tab.removeTabAt(i);
                    pos = i;
                    break;
                }
            }
        } else {
            pos = removeGetPosition(main_cn, rmv);
        }

        if (pos < -1) {
            return;//failure
        }

        System.out.println("main_cn " + main_cn);
        System.out.println("main_cn hash " + main_cn.hashCode());
        //check if our box component has been assign to this table
        Box table_box;
        if (boxHashes.contains(main_cn.hashCode()) && main_cn instanceof Box) {
            //o.k we have added this box hash before - we shall only replace the table
            System.out.println("yes");

            table_box = (Box) main_cn;
            JScrollPane scrollPane = new JScrollPane();
            scrollPane.setSize(table_box.getSize());
            scrollPane.setViewportView(table);
            table_box.add(scrollPane, pos);
            table_box.repaint();

        } else {

            table_box = new Box(BoxLayout.PAGE_AXIS);
            table_box.setBounds(bounds);
            createToolbox(table, table_box);
            JScrollPane scrollPane = new JScrollPane();
            scrollPane.setViewportView(table);
            scrollPane.setSize(table_box.getSize());
            table_box.add(scrollPane);

            if (main_cn instanceof javax.swing.JTabbedPane) {
                javax.swing.JTabbedPane tab = (javax.swing.JTabbedPane) main_cn;
                tab.insertTab(tab_title, tab_icon, table_box, tab_tip, pos);
                tab.setSelectedIndex(pos);
            } else {
                main_cn.add(table_box, pos);
            }

            main_cn.repaint();
            int h = table_box.hashCode();

            System.out.println(h);
            System.out.println(table_box.hashCode());

            boxHashes.add(table_box.hashCode());

        }

    }

    private int removeGetPosition(Container parent, Component child) {
        Component[] comps = parent.getComponents();
        for (int i = 0; i < comps.length; i++) {
            if (comps[i].equals(child)) {
                parent.remove(child);
                return i;
            }
        }
        return -1;
    }

    private ReportTableModel createTableModel(TableFieldCallBack inputCallBack, UpdateTableHandler updateFieldHandler, DeleteRowHandler deleteRowHandler, TableFieldSource... columnSources) throws SQLException {

        if (inputCallBack == null) {
            throw new NullPointerException("Table field call back must not be null!");
        }

        //check if valid column source names where provided
        String[] columns = new String[columnSources.length];
        for (int i = 0; i < columnSources.length; i++) {
            columns[i] = columnSources[i].fieldColumn();
            Object[] srcList = columnSources[i].getColumnSources().toArray();
            for (Object srcList1 : srcList) {
                String col = (String) srcList1;
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

        //add the respective column source values to the column
        Object[][] data = dbHelper.fetchArray();
        String[] colNames = dbHelper.getColumns(true);

        List list = columnSourceList(data, colNames, columnSources);

        ReportTableModel tableModel = new ReportTableModel(inputCallBack,
                updateFieldHandler, deleteRowHandler,
                dbHelper.getSelectSQL(), dbHelper.getSelectParams(),
                dbHelper.getJdbcSetting());

        tableModel.setColumnNames(columns);
        tableModel.setTableFieldSource(columnSources);
        tableModel.addRangeRowData(list);
        return tableModel;
    }

    private List columnSourceList(Object[][] data, String[] colNames, TableFieldSource... columnSources) {
        List<Object[]> list = new ArrayList();
        for (Object[] data1 : data) {
            TableFieldGen[] cs = new TableFieldGen[columnSources.length];
            for (int j = 0; j < columnSources.length; j++) {
                TableFieldSource new_col_src = new TableFieldSource();
                new_col_src.copy(columnSources[j]);
                cs[j] = new_col_src;
                Object[] src_list = new_col_src.getColumnSources().toArray();
                for (int k = 0; k < src_list.length; k++) {
                    String coln = (String) src_list[k];
                    for (int col = 0; col < data1.length; col++) {
                        if (coln.equalsIgnoreCase(colNames[col])) {
                            new_col_src.setValueAt(k, data1[col]);
                            break;
                        }
                    }
                }
            }
            list.add(cs);
        }

        return list;
    }

    private void setRowSorter(JTable table) {
        TableRowSorter sorter = new TableRowSorter(table.getModel());
        table.setRowSorter(sorter);
    }

    @Override
    public void columnsAsIs(boolean is_column_as_is) {
        this.isColumnAsIs = is_column_as_is;
    }

    @Override
    public boolean isColumnAsIs() {
        return isColumnAsIs;
    }

    private void createToolbox(final JTable table, Box table_box) {

        table_toolbox = new Box(BoxLayout.LINE_AXIS);
        table_toolbox.setSize(35, (int) table_box.getBounds().getWidth());
        table_toolbox.setBackground(Color.red);

        JLabel lblFind = new JLabel("Find : ");
        table_toolbox.add(lblFind);

        JTextField txtFind = new JTextField();
        txtFind.setSize(new Dimension(35, 120));
        table_toolbox.add(txtFind);

        table_toolbox.add(Box.createHorizontalStrut(20));
        //table_toolbox.add(Box.createHorizontalGlue());//Glue not working - i do not know why?

        JLabel lblFilter = new JLabel("Filter : ");
        table_toolbox.add(lblFilter);

        JTextField txtFilter = new JTextField();
        txtFilter.setSize(new Dimension(35, 120));

        table_toolbox.add(txtFilter);

        table_toolbox.add(Box.createHorizontalStrut(20));

        addSelectButton(table, table_toolbox);

        table_toolbox.add(Box.createHorizontalStrut(20));

        addDeleteButton(table, table_toolbox);

        table_toolbox.add(Box.createHorizontalStrut(20));

        addUpdateButton(table, table_toolbox);

        table_box.add(table_toolbox);

    }

    private void addDeleteButton(final JTable table, Box toolbox) {
        final TableReportProcessorImpl.ReportTableModel model = checkModel(table);
        if (model == null) {
            return;
        }

        if (model.deleteRowHandler == null) {
            return;
        }

        JButton cmdDelete = new JButton("Delete");//TODO : may use icon later
        cmdDelete.setToolTipText("Delete selected rows.");
        toolbox.add(cmdDelete);
        cmdDelete.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                performDeleteOperation(table);
            }

        });

    }

    private void addUpdateButton(final JTable table, Box toolbox) {
        final TableReportProcessorImpl.ReportTableModel model = checkModel(table);
        if (model == null) {
            return;
        }

        if (model.updateFieldHandler == null) {
            return;
        }

        JButton cmdUpdate = new JButton("Update");//TODO : may use icon later
        cmdUpdate.setToolTipText("Update changes made.");
        toolbox.add(cmdUpdate);
        cmdUpdate.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                performUpdateOperation(table);
            }
        });

    }

    private void addSelectButton(final JTable table, Box toolbox) {
        final TableReportProcessorImpl.ReportTableModel model = checkModel(table);
        if (model == null) {
            return;
        }

        if (model.deleteRowHandler == null) {
            return;
        }

        final String selecAllStr = "Select All";
        final String selectAllTipStr = "Select all rows.";
        final JButton cmdSelectAll = new JButton(selecAllStr);//TODO : may use icon later
        cmdSelectAll.setToolTipText(selectAllTipStr);
        toolbox.add(cmdSelectAll);
        cmdSelectAll.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (cmdSelectAll.getText().equals(selecAllStr)) {
                    table.selectAll();
                    cmdSelectAll.setText("Deselect All");
                    cmdSelectAll.setToolTipText("Deselect all rows.");
                } else {
                    table.clearSelection();
                    cmdSelectAll.setText(selecAllStr);
                    cmdSelectAll.setToolTipText(selectAllTipStr);
                }
            }
        });
    }

    private void performDeleteOperation(final JTable table) {
        final TableReportProcessorImpl.ReportTableModel model = checkModel(table);
        if (model == null) {
            return;
        }

        //perform the delete operation
        RowSelection r = new RowSelection() {
            private Object[][] selData;
            private ITableField[][] fields;
            Row[] rows;

            @Override
            public Object[][] getData() {
                if (selData == null) {
                    int[] seleceted_rows = table.getSelectedRows();
                    selData = new Object[seleceted_rows.length][table.getColumnCount()];
                    for (int r = 0; r < seleceted_rows.length; r++) {
                        for (int c = 0; c < table.getColumnCount(); c++) {
                            int row = table.convertRowIndexToModel(seleceted_rows[r]);
                            int col = table.convertColumnIndexToModel(c);
                            selData[r][c] = model.backing_data[row][col];
                        }
                    }
                }
                return selData;
            }

            @Override
            public Object getValueAt(int index_of_row, String columnName) {
                int col_index = model.findColumn(columnName);
                if (col_index < 0) {
                    throw new java.lang.ArrayIndexOutOfBoundsException("specified column name not found - " + columnName);
                }

                //int row = table.convertRowIndexToModel(index_of_row);//not required here
                //int col = table.convertColumnIndexToModel(index);//not required here
                return getData()[index_of_row][col_index];
            }

            @Override
            public int count() {
                return table.getSelectedRowCount();
            }

            @Override
            public ITableField[][] getFields() {
                if (selData == null) {
                    getData();
                }
                if (fields == null) {
                    fields = new ITableField[selData.length][selData[0].length];//please come back to comfirm
                    int[] seleceted_rows = table.getSelectedRows();
                    rows = new Row[seleceted_rows.length];//important! store the row

                    for (int i = 0; i < seleceted_rows.length; i++) {
                        RowImpl row = new RowImpl();
                        for (int j = 0; j < selData[i].length; j++) {

                            int row_index = table.convertRowIndexToModel(seleceted_rows[i]);//important!
                            int col_index = table.convertColumnIndexToModel(j);//important!

                            String name = model.getColumnName(col_index);
                            Object old_value = model.getOldValueAt(row_index, col_index);
                            Object value = model.getValueAt(row_index, col_index);

                            TableFieldImpl f = new TableFieldImpl(name, old_value, value, row_index, col_index);
                            f.setSource(model.getFieldSources() != null ? model.getFieldSources()[col_index].getColumnSources() : null);
                            f.setRow(row);
                            row.setFields(fields[i]);
                            fields[i][j] = f;
                        }

                        rows[i] = row;//important
                    }
                }

                return fields;
            }

            @Override
            public Row[] getRows() {
                if (rows == null) {
                    getFields();
                }
                return rows;
            }

        };

        model.deleteRowHandler.doDelete(new ActionSQLImpl(model.jdbc_settings), r);

        model.refresh(table);
    }

    private void performUpdateOperation(final JTable table) {
        final TableReportProcessorImpl.ReportTableModel model = checkModel(table);
        if (model != null) {
            return;
        }

        //perform the update operation
        TableFieldChange f = new TableFieldChange() {
            TableFieldImpl[] fields;

            @Override
            public ITableField[] getChanges() {
                if (fields == null) {
                    fields = new TableFieldImpl[model.oldFieldVal.size()];
                    Set<Map.Entry<String, Object>> e = model.oldFieldVal.entrySet();
                    Iterator<Map.Entry<String, Object>> itr = e.iterator();
                    int i = -1;
                    while (itr.hasNext()) {
                        Map.Entry<String, Object> entry = itr.next();
                        String key = entry.getKey();
                        int index = key.indexOf('_');
                        int row = table.convertRowIndexToModel(Integer.parseInt(key.substring(0, index)));//important!
                        int col = table.convertColumnIndexToModel(Integer.parseInt(key.substring(index + 1)));//important!
                        String name = model.getColumnName(col);
                        Object old_value = model.getOldValueAt(row, col);
                        Object value = model.getValueAt(row, col);
                        TableFieldImpl f = new TableFieldImpl(name, old_value, value, row, col);
                        f.setSource(model.getFieldSources() != null ? model.getFieldSources()[col].getColumnSources() : null);
                        i++;
                        fields[i] = f;
                    }

                    for (i = 0; i < fields.length; i++) {
                        //rowIndex is already converted. see above.
                        int row = fields[i].rowIndex();//already the conversion - no need for calling table.convertRowIndexToModel() here 
                        RowImpl rowImpl = new RowImpl();
                        TableFieldImpl[] rowFieds = new TableFieldImpl[model.getColumnCount()];
                        for (int c = 0; c < model.getColumnCount(); c++) {
                            int col = table.convertColumnIndexToModel(c);//convert column index.
                            String name = model.getColumnName(col);
                            Object old_value = model.getOldValueAt(row, col);
                            Object value = model.getValueAt(row, col);
                            TableFieldImpl f = new TableFieldImpl(name, old_value, value, row, col);
                            f.setSource(model.getFieldSources() != null ? model.getFieldSources()[col].getColumnSources() : null);
                            rowFieds[c] = f;
                            rowImpl.setFields(rowFieds);
                            fields[i].setRow(rowImpl);
                        }

                    }

                }
                return fields;
            }

            @Override
            public int count() {
                if (fields == null) {
                    getChanges();
                }
                return fields.length;
            }

        };

        model.updateFieldHandler.doUpdate(new ActionSQLImpl(model.jdbc_settings), f);
        model.refresh(table);

    }

    private TableReportProcessorImpl.ReportTableModel checkModel(JTable table) {

        if (table.getModel() instanceof TableReportProcessorImpl.ReportTableModel) {
            return (TableReportProcessorImpl.ReportTableModel) table.getModel();
        } else {
            System.err.println("WARNING : Unsupported table model - expected : " + TableReportProcessorImpl.ReportTableModel.class.getName());
            return null;
        }

    }

    @Override
    public void displayToolbox(boolean isShow) {
        isDisplayToolbox = isShow;
        if (table_toolbox != null) {
            table_toolbox.setVisible(isShow);
        }
    }

    @Override
    public void displayFind(boolean isShow) {
        isDisplayFine = isShow;
    }

    @Override
    public void displayFilter(boolean isShow) {
        isDisplayFilter = isShow;
    }

    class ReportTableModel extends AbstractTableModel {

        private String[] columnNames = {};

        private final ArrayList data = new ArrayList<>();
        private Object[][] backing_data;
        TableFieldCallBack inputCallBack;
        private UpdateTableHandler updateFieldHandler;
        private DeleteRowHandler deleteRowHandler;
        private String select_sql;
        private TableFieldSource[] fieldSources;
        private Map<String, Param> select_params;
        private JDBCSettings jdbc_settings;
        private Map<String, Object> oldFieldVal = Collections.synchronizedMap(new HashMap());
        private TableDataInputHandler dataInputHandler;

        private ReportTableModel() {
        }

        ReportTableModel(TableFieldCallBack inputCallBack,
                UpdateTableHandler updateFieldHandler,
                DeleteRowHandler deleteRowHandler,
                String select_sql,
                Map<String, Param> select_params,
                JDBCSettings jdbc_settings) {
            this.inputCallBack = inputCallBack;
            this.updateFieldHandler = updateFieldHandler;
            this.deleteRowHandler = deleteRowHandler;
            this.select_sql = select_sql;
            this.select_params = select_params;
            this.jdbc_settings = new JDBCSettings(jdbc_settings);//we need to copy
        }

        private void setDataInputHandler(TableDataInputHandler dataInputHandler) {
            this.dataInputHandler = dataInputHandler;
        }

        private void refresh(JTable table) {
            Connection conn = null;
            PreparedStatement stmt = null;
            ResultSet rs = null;
            try {
                System.out.println("connecting...");

                conn = dbHelper.getConnection(jdbc_settings);

                System.out.println("connected");

                if (conn == null) {
                    return;
                }
                if (select_sql == null || select_sql.isEmpty()) {
                    return;
                }

                stmt = conn.prepareStatement(select_sql);
                Set<Map.Entry<String, Param>> e = select_params.entrySet();
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

                List list = columnSourceList(_data, db_cols, fieldSources);

                clear();
                addRangeRowData(list);

            } catch (SQLException ex) {
                String err_msg = "Failed to refresh table after operation!";
                System.err.println(err_msg);
                Logger.getLogger(TableReportProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(table, err_msg, "Refresh Failed", JOptionPane.ERROR_MESSAGE);
            } finally {
                if (stmt != null) {
                    try {
                        stmt.close();
                    } catch (SQLException ex) {
                        Logger.getLogger(TableReportProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                if (rs != null) {
                    try {
                        rs.close();
                    } catch (SQLException ex) {
                        Logger.getLogger(TableReportProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
                if (conn != null) {
                    try {
                        conn.close();
                    } catch (SQLException ex) {
                        Logger.getLogger(TableReportProcessorImpl.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            }

        }

        void setColumnNames(String... columns) {
            columnNames = columns;
        }

        void insertRowData(int index, Object row) {
            data.add(index, row);
            fireTableRowsInserted(index, index);
        }

        void addRowData(Object row) {
            data.add(row);
            int index = data.size() - 1;
            fireTableRowsInserted(index, index);
        }

        void addRangeRowData(List rows) {
            for (int i = 0; i < rows.size(); i++) {
                data.add(rows.get(i));
                fireTableRowsInserted(i, i);
            }
        }

        TableFieldSource[] getFieldSources() {
            return this.fieldSources;
        }

        Object getOldValueAt(int row, int col) {
            return this.oldFieldVal.get(row + "_" + col);
        }

        @Override
        public boolean isCellEditable(int row, int column) {
            return true;
        }

        @Override
        public int getColumnCount() {
            return columnNames.length;
        }

        @Override
        public int getRowCount() {
            return data.size();
        }

        @Override
        public String getColumnName(int col) {
            return columnNames[col];
        }

        @Override
        public Object getValueAt(int row, int col) {
            if (inputCallBack == null) {
                return backing_data[row][col] = ((Object[]) data.get(row))[col];
            } else {
                if (backing_data == null) {
                    backing_data = new Object[data.size()][columnNames.length];
                }
                if (backing_data[row][col] != null) {
                    return backing_data[row][col];
                }
                TableFieldGen fieldGen = ((TableFieldGen[]) data.get(row))[col];
                return backing_data[row][col] = inputCallBack.onBeforeInput(fieldGen, row, col);
            }
        }

        @Override
        public void setValueAt(Object aValue, int rowIndex, int columnIndex) {
            String key = rowIndex + "_" + columnIndex;
            if (!oldFieldVal.containsKey(key)) {
                oldFieldVal.put(key, backing_data[rowIndex][columnIndex]);
            }

            backing_data[rowIndex][columnIndex] = aValue;

            fireTableCellUpdated(rowIndex, columnIndex);
        }

        @Override
        public Class<?> getColumnClass(int columnIndex) {
            return Object.class;
            //return getValueAt(0, columnIndex).getClass();
        }

        private void setTableFieldSource(TableFieldSource[] columnSources) {
            this.fieldSources = columnSources;
        }

        private void clear() {
            int size = data.size();
            data.clear();
            backing_data = null;//important!
            oldFieldVal.clear();

            fireTableRowsDeleted(0, size - 1);
        }

    }
}

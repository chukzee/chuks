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

    @Override
    public void loadOnTable(JTable table, UpdateFieldHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler) throws SQLException {

        List<Object[]> list = new ArrayList();
        list.addAll(Arrays.asList(dbHelper.fetchArray()));
        ReportTableModel tableModel = new ReportTableModel(null, updateFieldHandler,
                deleteRowsHandler, dbHelper.getSelectSQL(), dbHelper.getSelectParams(),
                dbHelper.getJdbcSetting());
        tableModel.setColumnNames(dbHelper.getColumns(isColumnAsIs));
        tableModel.setTableFieldSource(null);
        tableModel.addRangeRowData(list);

        table.setModel(tableModel);
        setRowSorter(table);
        relayoutTableReport(table);
    }

    @Override
    public void loadOnTable(JTable table, Object[][] data, String... columns) {
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
    public void loadOnTable(JTable table, TableFieldCallBack inputCallBack, UpdateFieldHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler, TableFieldSource... columnSources) throws SQLException {
        ReportTableModel tableModel = createTableModel(inputCallBack, updateFieldHandler, deleteRowsHandler, columnSources);
        table.setModel(tableModel);
        setRowSorter(table);
        relayoutTableReport(table);
    }

    @Override
    public void loadOnTable(JTable table, TableFieldCallBack inputCallBack, UpdateFieldHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler, TableFieldMapper mapper) throws SQLException {
        loadOnTable(table, inputCallBack, updateFieldHandler, deleteRowsHandler, mapper.getFieldSources());
    }

    @Override
    public JTable loadOnTable(JComponent container, TableFieldCallBack inputCallBack, TableFieldRenderer renderer, UpdateFieldHandler updateFieldHandler, DeleteRowHandler deleteRowHandler, TableFieldMapper mapper) throws SQLException {
        return loadOnTable(container, inputCallBack, renderer, updateFieldHandler, deleteRowHandler, mapper.getFieldSources());
    }

    @Override
    public JTable loadOnTable(JComponent container, TableFieldCallBack inputCallBack, final TableFieldRenderer renderer, UpdateFieldHandler updateFieldHandler, DeleteRowHandler deleteRowHandler, TableFieldSource... columnSources) throws SQLException {

        if (container instanceof JTable) {
            throw new IllegalArgumentException("Container type cannot be a JTable or its sub class!  You may use JPanel.");
        }

        final ReportTableModel tableModel = createTableModel(inputCallBack, updateFieldHandler, deleteRowHandler, columnSources);

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

        table.setModel(tableModel);
        setRowSorter(table);
        JScrollPane scrollPane1 = new JScrollPane();
        scrollPane1.setViewportView(table);
        container.add(scrollPane1);
        relayoutTableReport(table);
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
            throw new IllegalStateException("Not parent found - JTable must have a parent container!");
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

    private ReportTableModel createTableModel(TableFieldCallBack inputCallBack, UpdateFieldHandler updateFieldHandler, DeleteRowHandler deleteRowsHandler, TableFieldSource... columnSources) throws SQLException {

        if (inputCallBack == null) {
            throw new NullPointerException("column input call back must not be null!");
        }

        //check is valid colum source names where provided
        String[] columns = new String[columnSources.length];
        for (int i = 0; i < columnSources.length; i++) {
            columns[i] = columnSources[i].fieldColumn();
            Object[] srcList = columnSources[i].getColumnSources().toArray();
            for (int k = 0; k < srcList.length; k++) {
                String col = (String) srcList[k];
                String[] cols = dbHelper.getColumns(true); //get colums as they are. that is what we want here.
                boolean found = false;
                for (int n = 0; n < cols.length; n++) {
                    if (cols[n].equalsIgnoreCase(col)) {
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
                updateFieldHandler, deleteRowsHandler,
                dbHelper.getSelectSQL(), dbHelper.getSelectParams(),
                dbHelper.getJdbcSetting());

        tableModel.setColumnNames(columns);
        tableModel.setTableFieldSource(columnSources);
        tableModel.addRangeRowData(list);
        return tableModel;
    }

    private List columnSourceList(Object[][] data, String[] colNames, TableFieldSource... columnSources) {
        List<Object[]> list = new ArrayList();
        for (int row = 0; row < data.length; row++) {
            TableFieldGen[] cs = new TableFieldGen[columnSources.length];
            for (int j = 0; j < columnSources.length; j++) {
                TableFieldSource new_col_src = new TableFieldSource();
                new_col_src.copy(columnSources[j]);
                cs[j] = new_col_src;
                Object[] src_list = new_col_src.getColumnSources().toArray();
                for (int k = 0; k < src_list.length; k++) {
                    String coln = (String) src_list[k];
                    for (int col = 0; col < data[row].length; col++) {
                        if (coln.equalsIgnoreCase(colNames[col])) {
                            new_col_src.setValueAt(k, data[row][col]);
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

        if (model.deleteRowsHandler == null) {
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

        if (model.deleteRowsHandler == null) {
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

            @Override
            public Object[][] getData() {
                if (selData == null) {
                    int[] rows = table.getSelectedRows();
                    selData = new Object[rows.length][table.getColumnCount()];
                    for (int r = 0; r < rows.length; r++) {
                        for (int col = 0; col < table.getColumnCount(); col++) {
                            selData[r][col] = model.backing_data[rows[r]][col];
                        }
                    }
                }
                return selData;
            }

            @Override
            public Object getValueAt(int index_of_selection, String columnName) {
                int index = model.findColumn(columnName);
                if (index < 0) {
                    throw new java.lang.ArrayIndexOutOfBoundsException("specified column name not found - " + columnName);
                }
                return getData()[index_of_selection][index];
            }

            @Override
            public int count() {
                return table.getSelectedRowCount();
            }

            @Override
            public ITableField[][] getFields() {
                System.err.println("REMIND: Auto generated method body is not yet implemented");
                return null;
            }

            @Override
            public Row[] getRows() {
                
                System.err.println("REMIND: Auto generated method body is not yet implemented");
                return null;
            }

        };

        model.deleteRowsHandler.doDelete(new ActionSQLImpl(dbHelper), r);

        model.refresh(table);
    }

    private void performUpdateOperation(JTable table) {
        TableReportProcessorImpl.ReportTableModel model = checkModel(table);
        if (model != null) {
            return;
        }

        //perform the update operation
        TableFieldChange f = new TableFieldChange() {

            @Override
            public ITableField[] getChanges() {
                System.err.println("REMIND: Auto generated method body is not yet implemented");
                return null;
            }

            @Override
            public int count() {
                System.err.println("REMIND: Auto generated method body is not yet implemented");
                return 0;
            }

        };

        model.updateFieldHandler.doUpdate(new ActionSQLImpl(dbHelper), f);
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
        private UpdateFieldHandler updateFieldHandler;
        private DeleteRowHandler deleteRowsHandler;
        private String select_sql;
        private TableFieldSource[] fieldSources;
        private Map<String, Param> select_params;
        private JDBCSettings jdbc_settings;

        private ReportTableModel() {
        }

        ReportTableModel(TableFieldCallBack inputCallBack,
                UpdateFieldHandler updateFieldHandler,
                DeleteRowHandler deleteRowsHandler,
                String select_sql,
                Map<String, Param> select_params,
                JDBCSettings jdbc_settings) {
            this.inputCallBack = inputCallBack;
            this.updateFieldHandler = updateFieldHandler;
            this.deleteRowsHandler = deleteRowsHandler;
            this.select_sql = select_sql;
            this.select_params = select_params;
            this.jdbc_settings = jdbc_settings;
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
                Iterator ie = e.iterator();
                while (ie.hasNext()) {
                    Map.Entry<String, Param> entry = (Map.Entry<String, Param>) ie.next();
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
                TableFieldGen field = ((TableFieldGen[]) data.get(row))[col];
                return backing_data[row][col] = inputCallBack.onBeforeAdd(field, row, col);
            }
        }

        @Override
        public void setValueAt(Object aValue, int rowIndex, int columnIndex) {
            if (inputCallBack == null) {
                ((Object[]) data.get(rowIndex))[columnIndex] = aValue;
            } else {
                ((TableFieldGen[]) data.get(rowIndex))[columnIndex] = (TableFieldGen) aValue;
            }

            fireTableCellUpdated(rowIndex, columnIndex);
        }

        @Override
        public Class<?> getColumnClass(int columnIndex) {
            return getValueAt(0, columnIndex).getClass();
        }

        private void setTableFieldSource(TableFieldSource[] columnSources) {
            this.fieldSources = columnSources;
        }

        private void clear() {
            int size = data.size();
            data.clear();
            backing_data = null;//important!
            fireTableRowsDeleted(0, size - 1);
        }

    }
}

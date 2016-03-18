/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.ui.model;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.table.AbstractTableModel;
import manager.util.DataTable;

/**
 *
 * @author ogaga
 */
public class MngKidnapReportModel extends AbstractTableModel {

    private String[] columnNames = {"Captive", "Detail"};
    private ArrayList<Object[]> data = new ArrayList<>();

    public Image getCaptivePhoto(int row) {
        int col_index = findComlumn("Captive");
        return (Image) data.get(row)[col_index];
    }

    public String getDetail(int row) {
        int col_index = findComlumn("Detail");
        return (String) data.get(row)[col_index];
    }

    private int findComlumn(String name) {
        for (int i = 0; i < columnNames.length; i++) {
            if (columnNames[i].equalsIgnoreCase(name)) {
                return i;
            }
        }

        return -1;
    }

    public void insertRowData(int index, String url, String json) {
        data.add(index, new Object[]{url, json});
        fireTableRowsInserted(index, index);
    }

    public void add(String url, String json) {
        this.data.add(new Object[]{url, json});
        fireTableRowsInserted(0, data.size() - 1);
    }

    public void addTopRowData(String url, String json) {
        data.add(0, new Object[]{url, json});
        fireTableRowsInserted(0, 0);
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
        return data.get(row)[col];
    }

    @Override
    public void setValueAt(Object aValue, int rowIndex, int columnIndex) {

        data.get(rowIndex)[columnIndex] = aValue;
        fireTableCellUpdated(rowIndex, columnIndex);
    }

    @Override
    public Class<?> getColumnClass(int columnIndex) {
        return getValueAt(0, columnIndex).getClass();
    }

    Object[] getRowData(int selected_row_index) {
        return this.data.get(selected_row_index);
    }

    public void clearData() {
        data.clear();
    }

}

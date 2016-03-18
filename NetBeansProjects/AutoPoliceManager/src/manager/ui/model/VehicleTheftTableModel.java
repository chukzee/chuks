/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.ui.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import javax.swing.table.AbstractTableModel;

/**
 *
 * @author user
 */
public class VehicleTheftTableModel extends AbstractTableModel{

    private String[] columnNames = {"S/N","ACTION TAKEN","TIME",
                                    "REPORTER",
                                    "REPORT DETAILS"};
    
    private ArrayList<Object[]> data = new ArrayList<>();
    
    
    public void setActionTaken(int row, String value){
            int col_index = findComlumn("ACTION TAKEN");
             data.get(row)[col_index] = value;
             this.fireTableRowsUpdated(row, row);
    }

    public int getSerialNo(int row){
            int col_index = findComlumn("S/N");
            return (int)Integer.parseInt((String)data.get(row)[col_index]);
    }
    
    public String getActionTaken(int row){
            int col_index = findComlumn("ACTION TAKEN");
            return (String)data.get(row)[col_index];
    }

    public Date getReportTime(int row){
            int col_index = findComlumn("TIME");
            return (Date)data.get(row)[col_index];
    }
    
    public String getReporter(int row){
            int col_index = findComlumn("REPORTER");
            return (String)data.get(row)[col_index];
    }
    
    public String getReportDetials(int row){
            int col_index = findComlumn("REPORT DETAILS");
            return (String)data.get(row)[col_index];
    }                
        
    private int findComlumn(String name){
           for(int i=0; i<columnNames.length; i++)
               if(columnNames[i].equalsIgnoreCase(name))
                   return i;
           
           return -1;
    }
    
    public void insertRowData(int index, Object[] row) {
        data.add(index, row);
        fireTableRowsInserted(index, index);
    }
    
    public void addTopRowData(Object[] row) {
        data.add(0,row);
        fireTableRowsInserted(0, 0);        
    }
    
    
    public void addTopRangeRowData(ArrayList<Object[]> rows) {
        for(int i=0; i<rows.size(); i++){
            data.add(0,rows.get(i));
            fireTableRowsInserted(0, 0);
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
    
}

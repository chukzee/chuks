/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.util;

import exception.DataTableException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 *
 * @author ogaga
 */
public class DataTable {

    private ArrayList<String> Columns = new ArrayList<String>();
    private ArrayList<Object[]> RowValues = new ArrayList<Object[]>();

    private boolean isEntryEnded;
    private boolean isEntryStarted;

    public void startEntry() {
        RowValues.clear();
        isEntryEnded = false;
        isEntryStarted = true;
    }

    public void endEntry() throws DataTableException {
        if (!isEntryStarted) {
            throw new DataTableException("Illegal operation. Entry not started!");
        }
        isEntryEnded = true;
        isEntryStarted = false;
    }

    public void enterRowData(Object... row) throws DataTableException {
        if (!isEntryStarted) {
            throw new DataTableException("Illegal operation. Entry not started!");
        }

        if (Columns.isEmpty()) {
            throw new DataTableException("No column definition");
        }

        if (row.length != Columns.size()) {
            throw new DataTableException("row field length not equal to column length!");
        }

        this.RowValues.add(row);
       
    }

    public void defineColumns(String... columns) throws DataTableException {
        for (String column : columns) {
            if (Columns.contains(column)) {
                throw new DataTableException("duplicate column name.");
            }

            Columns.add(column);
        }
    }

    public Object[][] get(String... columns) throws DataTableException {
        if (RowValues.get(0) == null) {
            return new Object[0][0];
        }

        return get(0, RowValues.get(0).length, columns);
    }

    public Object[][] get(int from_row_index, int to_row_index, String... cols) throws DataTableException {
        
        if (!this.isEntryEnded) {
            throw new DataTableException("Illegal operation. Entry not explicitly ended!");
        }
        
        if (RowValues.get(0) == null) {
            return new Object[0][0];
        }

        String[] all_cols = new String[0];
        Columns.toArray(all_cols);
        Map index_map = new HashMap();
        for (int i = 0; i < cols.length; i++) {

            if (!Columns.contains(cols[i])) {
                throw new DataTableException("Column name not found - " + cols[i]);
            }

            for (int col_index_loc = 0; col_index_loc < all_cols.length; col_index_loc++) {
                if (all_cols[col_index_loc].equals(cols[i])) {
                    index_map.put(i, col_index_loc);
                    break;
                }
            }
        }

        int row_count = to_row_index - from_row_index + 1;
        int column_count = cols.length;
        Object[][] values = new Object[row_count][column_count];//come back
        for (int i = 0; i < row_count; i++) {
            for (int k = 0; k < column_count; k++) {
                int col_index_loc = (int) index_map.get(k);
                values[i][k] = RowValues.get(i)[col_index_loc];
            }
        }

        return values;
    }
    
    public DataTable select(String... columns){
        return this;
    }
    
        
    public DataTable whereEqual(String column , Object value){
        return this;
    }
               
    public DataTable And(){
        return this;
    }
                   
    public DataTable Or(){
        return this;
    }
                   
    public Object getResutSet(){
        return null;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.util;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class SearchUtil {

    /**
     * Used to start search from a specified row index.
     *
     * @param data
     * @param row_start_index
     * @param regex
     * @param match_case
     * @param whole_word
     * @return
     */
    public static int find(Object[][] data, int row_start_index, String regex, boolean match_case, boolean whole_word) {
        if (data == null || data.length == 0) {
            return -1;//not searchable
        }
        if (regex == null || row_start_index < 0 || row_start_index >= data.length) {
            return -1;//not searchable
        }
        String lowe_case_regex = regex.toLowerCase();
        for (int i = row_start_index; i < data.length; i++) {
            for (int k = 0; k < data[i].length; k++) {
                
                if (data[i][k] == null) {
                    continue;//avoid NullPointerException
                }
                String str = data[i][k].toString();
                if (whole_word && !match_case) {
                    if (str.equalsIgnoreCase(regex)) {
                        return i;
                    }
                } else if (!whole_word && match_case) {
                    if (str.contains(regex)) {
                        return i;
                    }
                } else if (whole_word && match_case) {
                    if (str.equals(regex)) {
                        return i;
                    }
                } else if (!whole_word && !match_case) {
                    if (str.toLowerCase().contains(lowe_case_regex)) {
                        return i;
                    }
                }

            }
        }

        return -1;//not found
    }

    public static int find(String[][] data, String regex, boolean match_case, boolean whole_word) {
        return find(data, 0, regex, match_case, whole_word);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.form.controls;

import javax.swing.JComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface SearchObserver {
     Object[][] searchedData();
     void foundSearch(JComponent source_component, String searchStr, int found_index);
     void finishedSearch(JComponent source_component, String searchStr);
     void notFound(JComponent source_component, String searchStr);
}

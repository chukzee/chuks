/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.form.controls;

import com.chuks.report.processor.event.SearchObserver;
import com.chuks.report.processor.util.SearchUtil;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.PatternSyntaxException;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.JToggleButton;
import javax.swing.RowFilter;
import javax.swing.RowSorter;
import javax.swing.table.TableModel;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final public class JFilter extends Box implements FormControl {

    private final JLabel lblFilter;
    private JTable table;

    public JFilter() {
        super(BoxLayout.LINE_AXIS);

        lblFilter = new JLabel("Filter: ");
        add(lblFilter);

        final JTextField cboFilter = new JTextField();
        cboFilter.setSize(new Dimension(35, 120));
        cboFilter.setToolTipText("Press enter key to filter");
        add(cboFilter);

        //great trick!!! - and the action listener to the getEditor() only to avoid double call
        cboFilter.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String text = cboFilter.getText();
                RowSorter<? extends TableModel> so = table.getRowSorter();
                if (so == null) {
                    return;
                }
                if (!(so instanceof TableRowSorter)) {
                    return;
                }
                TableRowSorter sorter = (TableRowSorter) so;

                if (text.length() == 0) {
                    sorter.setRowFilter(null);
                } else {
                    try {
                        sorter.setRowFilter(RowFilter.regexFilter(text));
                    } catch (PatternSyntaxException ex) {
                       
                    }
                }
            }
        });

    }

    public void setTable(JTable table) {
        this.table = table;
    }

}

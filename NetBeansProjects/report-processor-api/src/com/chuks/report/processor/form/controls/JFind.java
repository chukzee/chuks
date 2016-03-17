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
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JToggleButton;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final public class JFind extends Box implements FormControl {

    private final JLabel lblFind;
    private final JToggleButton matchCase;
    private final JToggleButton wholeWord;
    private SearchObserver searchObserver;
    private int lastSearchIndex = -1;
    private int searchCount;
    private String lastSearchStr;
    private JComponent source_component;
    private boolean failed;

    public JFind() {
        super(BoxLayout.LINE_AXIS);

        lblFind = new JLabel("Find: ");
        add(lblFind);

        final JComboBox cboFind = new JComboBox();
        cboFind.setEditable(true);
        cboFind.setSize(new Dimension(35, 120));
        cboFind.setToolTipText("Press enter key to search");
        add(cboFind);

        matchCase = new JToggleButton("C");
        matchCase.setSize(new Dimension(35, 20));
        matchCase.setToolTipText("Match case");
        add(matchCase);

        wholeWord = new JToggleButton("W");
        wholeWord.setSize(new Dimension(35, 20));
        wholeWord.setToolTipText("Match whole word");
        add(wholeWord);

        //great trick!!! - and the action listener to the getEditor() only to avoid double call
        cboFind.getEditor().addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (searchObserver == null) {
                    return;//no point!
                }
                Object search_obj = cboFind.getEditor().getItem();
                if (search_obj == null) {
                    return;
                }
                String search_str = search_obj.toString();
                if (!search_str.equals(lastSearchStr)) {
                    searchCount = 0;
                    lastSearchIndex = -1;//reset to before start of row
                }

                boolean isContinueSearch = lastSearchIndex > -1;

                lastSearchIndex += 1; //start search from next row

                lastSearchIndex = SearchUtil.find(searchObserver.searchedData(), lastSearchIndex, search_str, matchCase.isSelected(), wholeWord.isSelected());
                if (!search_str.equals(lastSearchStr)) {
                    cboFind.addItem(search_str);
                    cboFind.setSelectedItem(search_str);
                }
                lastSearchStr = search_str;

                if (lastSearchIndex > -1) {//search found
                    searchCount++;
                    searchObserver.foundSearch(source_component, lastSearchStr, lastSearchIndex);
                }

                if (lastSearchIndex < 0 && isContinueSearch) {
                    searchObserver.finishedSearch(source_component, lastSearchStr, searchCount);
                }

                if (lastSearchIndex < 0 && !isContinueSearch) {
                    searchObserver.notFound(source_component, lastSearchStr);
                }

                if (lastSearchIndex < 0) {
                    searchCount = 0;//initialize search count
                }
            }
        });

    }

    public void setSearchObserver(SearchObserver searchObserver, JComponent source_component) {
        this.searchObserver = searchObserver;
        this.source_component = source_component;
        lastSearchIndex = -1;
        searchCount = 0;
        lastSearchStr = null;
    }

    public void  controlFailedState(boolean failed){
        if(failed){
            this.failed= failed;
            super.setEnabled(false);
        }
    }

    @Override
    public void setEnabled(boolean enabled) {
       if(failed){
           super.setEnabled(false);
           return;
       }
        super.setEnabled(enabled); //To change body of generated methods, choose Tools | Templates.
    }
    
}

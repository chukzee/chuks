/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.DataPoll;
import com.chuks.report.processor.handler.ListBindHanler;
import com.chuks.report.processor.param.ListDataInput;
import com.chuks.report.processor.sql.helper.DBHelper;
import com.chuks.report.processor.util.JDBCSettings;
import javax.swing.JComboBox;
import javax.swing.JList;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class ListDataInputImpl extends AbstractDataInput implements ListDataInput, DataPoll {

    private ListBindHanler handler;
    private JComboBox combo;
    private JList list;
    private long next_poll_time;

    ListDataInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void setJDBCSettings(JDBCSettings settings) {
        this.jdbcSettings = settings;
        this.dbHelper = new DBHelper(this);
    }

    @Override
    public void setData(Object[] data) {
        this.data = data;
    }

    Object[] getData() {
        return (Object[]) data;
    }

    @Override
    public void setNextPollTime(long next_poll_time) {
        this.next_poll_time = next_poll_time;
    }

    @Override
    public long getNextPollTime() {
        return next_poll_time;
    }

    @Override
    public void pollData() {

        handler.data(this);

        if (this.getData() == null) {
            Object[][] fetch = this.dbHelper.fetchArray();
            if (fetch != null && fetch.length > 0) {
                this.setData(fetch[0]);
            } else {
                return;
            }
        }

        if (combo != null) {
            combo.removeAllItems();//first remove all previous items
            for (Object _data : this.getData()) {
                combo.addItem(_data);
            }
        }

        if (list != null) {
            list.setListData(this.getData());
        }

    }

    void setHandler(JList list, ListBindHanler handler) {
        this.list = list;
        this.handler = handler;
    }

    void setHandler(JComboBox combo, ListBindHanler handler) {
        this.combo = combo;
        this.handler = handler;
    }

    /**
     * This method will pause the data poll if the component is not showing
     *
     * @return
     */
    @Override
    public boolean pausePoll() {
        if (combo != null) {
            return !combo.isShowing();
        }
        if (list != null) {
            return !list.isShowing();
        }
        return true;
    }

    @Override
    public boolean stopPoll() {
        return false;
    }

}
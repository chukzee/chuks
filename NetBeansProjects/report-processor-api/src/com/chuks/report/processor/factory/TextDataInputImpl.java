/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.DataPoll;
import com.chuks.report.processor.handler.TextBindHandler;
import com.chuks.report.processor.param.TextDataInput;
import com.chuks.report.processor.sql.helper.DBHelper;
import com.chuks.report.processor.util.JDBCSettings;
import javax.swing.JLabel;
import javax.swing.text.JTextComponent;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class TextDataInputImpl extends AbstractDataInput implements TextDataInput, DataPoll {

    private Object data;
    private long next_poll_time;
    private JTextComponent textComp;
    private TextBindHandler handler;
    private JLabel label;

    TextDataInputImpl(JDBCSettings jdbcSettings) {
        super(jdbcSettings);
    }

    @Override
    public void setJDBCSettings(JDBCSettings settings){
        this.jdbcSettings = settings;
        this.dbHelper = new DBHelper(this);
    }

    @Override
    public void setData(Object data) {
        this.data = data;
    }

    Object getData() {
        return data;
    }

    @Override
    public void setNextPollTime(long next_poll_time) {
        this.next_poll_time = next_poll_time;;
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
                this.setData(fetch[0][0]);
            } else {
                return;
            }
        }

        if (label != null) {
            label.setText(this.getData().toString());
        }

        if (textComp != null) {
            textComp.setText(this.getData().toString());
        }

    }

    void setHandler(JLabel label, TextBindHandler handler) {
        this.label = label;
        this.handler = handler;
    }

    void setHandler(JTextComponent textComp, TextBindHandler handler) {
        this.textComp = textComp;
        this.handler = handler;
    }

    /**
     * This method will pause the data poll if the component is not showing
     * @return 
     */
    @Override
    public boolean pause() {
        if (label != null) {
            return !label.isShowing();
        }
        if (textComp != null) {
            return !textComp.isShowing();
        }
        return true;
    }
}

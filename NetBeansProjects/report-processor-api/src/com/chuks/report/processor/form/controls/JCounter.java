/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.form.controls;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JLabel;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
final public class JCounter extends JLabel implements FormControl {

    private int record_number;
    private int total_records;
    private String appended_text;
    final private String OF = " of ";
    private String appended_text_plural;

    public JCounter() {
        setText(record_number + OF + total_records);
    }

    public void setRecordLabel(int record_number, int total_records) {
        this.record_number = record_number;
        this.total_records = total_records;
        String space = " ";
        if (appended_text == null || appended_text.isEmpty()) {
            appended_text = "";//in case null
            space = "";
        }
        String txt_append = appended_text;
        if (this.total_records > 1) {
            if (appended_text_plural != null && !appended_text_plural.isEmpty()) {
                txt_append = appended_text_plural;
            }
        }

        this.setText(record_number + OF + total_records + space + txt_append);
    }

    public int getRecordNumber() {
        return record_number;
    }

    public int getRecordCount() {
        return total_records;
    }

    public String getAppendedText() {
        return this.appended_text;
    }

    public String getAppendedTextPlural() {
        return this.appended_text_plural;
    }

    public void setAppendedText(String appended_text) {
        this.appended_text = appended_text;
        setRecordLabel(record_number, total_records);
    }

    public void setAppendedTextPlural(String appended_text_plural) {
        this.appended_text_plural = appended_text_plural;
        setRecordLabel(record_number, total_records);
    }

    @Override
    final public void setText(String text) {
        try {

            if (text == null || text.isEmpty()) {
                return;//do nothing
            }
            //validate format
            String[] split = text.split(" ");

            try {//check if the first is integer
                Integer.parseInt(split[0]);
            } catch (NumberFormatException ex) {
                setRecordLabel(record_number, total_records);//failed so correct the format
                Logger.getLogger(JCounter.class.getName()).log(Level.WARNING, "Text adjusted to required format", ex);
                return;//failed so do not render text
            }
            //check if the second if OF
            if (!split[1].equals(OF.trim())) {
                setRecordLabel(record_number, total_records);//failed so correct the format
                Logger.getLogger(JCounter.class.getName()).log(Level.WARNING, "Text adjusted to required format");
                return;
            }

            try {//check if the third is integer
                Integer.parseInt(split[2]);
            } catch (NumberFormatException ex) {
                setRecordLabel(record_number, total_records);//failed so correct the format
                Logger.getLogger(JCounter.class.getName()).log(Level.WARNING, "Text adjusted to required format", ex);
                return;
            }

            super.setText(text);

        } catch (ArrayIndexOutOfBoundsException ex) {
            setRecordLabel(record_number, total_records);
            Logger.getLogger(JCounter.class.getName()).log(Level.WARNING, "Text adjusted to required format", ex);
        }
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.param.ActionSQL;
import com.chuks.report.processor.param.FormFieldPost;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface FormPostHandler {

    void doPost(ActionSQL a, FormFieldPost f);
}
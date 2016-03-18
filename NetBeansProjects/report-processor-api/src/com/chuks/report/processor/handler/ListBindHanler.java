/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.handler;

import com.chuks.report.processor.param.ListDataInput;
import com.chuks.report.processor.PollAttributes;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */

public interface ListBindHanler extends PollAttributes{
    
    void data(ListDataInput input);
}

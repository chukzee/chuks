/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.bind;

import com.chuks.report.processor.DataPoll;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */

public interface ListBindHanler extends DataPoll{
    
    void data(ListDataInput input);
}

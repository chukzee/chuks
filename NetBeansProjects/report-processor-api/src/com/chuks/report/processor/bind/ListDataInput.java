/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.bind;

import com.chuks.report.processor.PollAttributes;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ListDataInput extends PollAttributes{
    
    void setData(Object[] data);
}

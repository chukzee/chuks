/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface Source {

    SourceMath math();

    Object dbSrcValueAt(int index);

    Object dbSrcValue(String dbColumnName);

    String getDBSrcColumnAt(int index);

    int dbSrcCount();

}

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
public interface SourceMath {

    double ans();

    int ansInt();

    SourceMath min(String... columns);

    SourceMath max(String... columns);

    SourceMath add(String... columns);

    SourceMath add(SourceMath prev, String... columns);

    SourceMath minus(String... columns);

    SourceMath minus(SourceMath prev, String... columns);

    SourceMath avg(String... columns);

    SourceMath avg(SourceMath prev, String... columns);

    SourceMath negate(String column);

    SourceMath negate(SourceMath prev);

    SourceMath abs(String column);

    SourceMath abs(SourceMath prev);

    SourceMath pow(String column, double exp);

    SourceMath pow(SourceMath prev, double exp);

    SourceMath div(String column, double arg);

    SourceMath div(SourceMath prev, double arg);

    SourceMath div(String... columns);

    SourceMath div(SourceMath prev, String... columns);

    SourceMath mult(String column, double arg);

    SourceMath mult(SourceMath prev, String columns, double arg);

    SourceMath mult(String... columns);

    SourceMath mult(SourceMath prev, String... columns);

}

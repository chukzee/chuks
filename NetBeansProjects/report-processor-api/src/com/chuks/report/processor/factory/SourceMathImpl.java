/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.factory;

import com.chuks.report.processor.Source;
import com.chuks.report.processor.SourceMath;
import java.util.Date;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class SourceMathImpl implements SourceMath {

    private final Source source;
    private double ans = 0;

    SourceMathImpl(Source source) {
        this.source = source;
    }

    @Override
    public String toString(){
        return Double.toString(ans);
    }
    
    @Override
    public double ans() {
        return ans;
    }

    @Override
    public int ansInt() {
        return (int) ans;
    }

    @Override
    public SourceMath min(String... columns) {
        double smallest = Double.MAX_VALUE;
        for (int i = 0; i < columns.length; i++) {
            double val = Double.parseDouble(source.dbSrcValue(columns[i]).toString());
            if (smallest > val) {
                smallest = val;
            }
        }
        ans = smallest;
        return this;
    }

    @Override
    public SourceMath max(String... columns) {
        double biggest = Double.MIN_VALUE;
        for (int i = 0; i < columns.length; i++) {
            double val = Double.parseDouble(source.dbSrcValue(columns[i]).toString());
            if (biggest < val) {
                biggest = val;
            }
        }
        ans = biggest;
        return this;
    }

    @Override
    public SourceMath add(String... columns) {
        double val = 0;
        for (int i = 0; i < columns.length; i++) {
            val += Double.parseDouble(source.dbSrcValue(columns[i]).toString());
        }
        ans = val;
        return this;
    }

    @Override
    public SourceMath add(SourceMath prev, String... columns) {
        double val = prev.ans();
        for (int i = 0; i < columns.length; i++) {
            val += Double.parseDouble(source.dbSrcValue(columns[i]).toString());
        }
        ans = val;
        return this;
    }

    @Override
    public SourceMath minus(String... columns) {
        double val = 0;
        for (int i = 0; i < columns.length; i++) {
            if (i == 0) {
                val = Double.parseDouble(source.dbSrcValue(columns[i]).toString());
                continue;
            }
            val -= Double.parseDouble(source.dbSrcValue(columns[i]).toString());
        }
        ans = val;
        return this;
    }

    @Override
    public SourceMath minus(SourceMath prev, String... columns) {
        double val = prev.ans();
        for (int i = 0; i < columns.length; i++) {
            /*//NOT REQUIRED IN THIS CASE
             *if (i == 0) {
             val = Double.parseDouble(source.dbSrcValue(columns[i]).toString());
             continue;
             }*/
            val -= Double.parseDouble(source.dbSrcValue(columns[i]).toString());
        }
        ans = val;
        return this;
    }

    @Override
    public SourceMath avg(String... columns) {
        double val = 0;
        for (int i = 0; i < columns.length; i++) {
            val += Double.parseDouble(source.dbSrcValue(columns[i]).toString());
        }
        ans = val / columns.length;
        return this;
    }

    @Override
    public SourceMath avg(SourceMath prev, String... columns) {
        ans = (prev.ans() + avg(columns).ans()) / 2;
        return this;
    }

    @Override
    public SourceMath negate(String column) {
        double val = -Math.abs(Double.parseDouble(source.dbSrcValue(column).toString()));
        ans = val;
        return this;
    }

    @Override
    public SourceMath negate(SourceMath prev) {
        double val = -Math.abs(prev.ans());
        ans = val;
        return this;
    }

    @Override
    public SourceMath abs(String column) {
        double val = Math.abs(Double.parseDouble(source.dbSrcValue(column).toString()));
        ans = val;
        return this;
    }

    @Override
    public SourceMath abs(SourceMath prev) {
        double val = Math.abs(prev.ans());
        ans = val;
        return this;
    }

    @Override
    public SourceMath pow(String column, double exp) {
        double val = Double.parseDouble(source.dbSrcValue(column).toString());
        ans = Math.pow(val, exp);
        return this;
    }

    @Override
    public SourceMath pow(SourceMath prev, double exp) {
        ans = Math.pow(prev.ans(), exp);
        return this;
    }

    @Override
    public SourceMath div(String column, double arg) {
        double val = Double.parseDouble(source.dbSrcValue(column).toString());
        ans = val / arg;
        return this;
    }

    @Override
    public SourceMath div(SourceMath prev, double arg) {
        ans = prev.ans() / arg;
        return this;
    }

    @Override
    public SourceMath div(String... columns) {
        double val = 0;
        for (int i = 0; i < columns.length; i++) {
            if (i == 0) {
                val = Double.parseDouble(source.dbSrcValue(columns[i]).toString());
                continue;
            }
            val /= Double.parseDouble(source.dbSrcValue(columns[i]).toString());
        }
        ans = val;
        return this;
    }

    @Override
    public SourceMath div(SourceMath prev, String... columns) {
        double val = prev.ans();
        for (int i = 0; i < columns.length; i++) {
            /*//NOT REQUIRED IN THIS CASE
             *if (i == 0) {
             val = Double.parseDouble(source.dbSrcValue(columns[i]).toString());
             continue;
             }*/
            val /= Double.parseDouble(source.dbSrcValue(columns[i]).toString());
        }
        ans = val;
        return this;
    }

    @Override
    public SourceMath mult(String column, double arg) {
        ans = Double.parseDouble(source.dbSrcValue(column).toString()) * arg;
        return this;
    }

    @Override
    public SourceMath mult(SourceMath prev, String columns, double arg) {
        ans = prev.ans() * arg;
        return this;
    }

    @Override
    public SourceMath mult(String... columns) {
        double val = 1;//yes 1
        for (int i = 0; i < columns.length; i++) {
            val *= Double.parseDouble(source.dbSrcValue(columns[i]).toString());
        }
        ans = val;
        return this;
    }

    @Override
    public SourceMath mult(SourceMath prev, String... columns) {
        double val = prev.ans();
        for (int i = 0; i < columns.length; i++) {
            val *= Double.parseDouble(source.dbSrcValue(columns[i]).toString());
        }
        ans = val;
        return this;
    }

    @Override
    public Date ansDate() {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public long ansTime() {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return 0;
    }

    @Override
    public SourceMath dateAdd(String date_column, long milli_seconds) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath dateDiff(String date_column1, String date_column2) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath dateDayOfWeek(String date_column) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath dateDayOfMonth(String date_column) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath dateDayOfYear(String date_column) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath dateTime(String date_column) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath dateMonth(String date_column) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath dateWeekOfMonth(String date_column) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath dateWeekOfYear(String date_column) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath dateYear(String date_column) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath toWords(long number) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath toWords(double number) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    public SourceMath toWords(String column) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 *
 * @author Samuel Akpokpokpor
 */
public class Util {

    static String date_format = "yyyy-MM-dd";//mysql format for date    
    static String datetime_format = "yyyy-MM-dd HH:mm:ss";//mysql format for datetime
    public static String RequestFormattedTime = "";
    public static long RequestLongTime;
    static String EMPTY = "";
    static String ZERO = "0";
    static String DEFAULT_DATE_STR = "1600-01-01";
    static String DEFAULT_TIME_STR = "00:00:00";
    static String DEFAULT_DATETIME_STR = "1600-01-01 00:00:00";
    static String PHOTO_FILE_SEPERATOR = "/";
    public static final Calendar calendar;
    private static final SimpleDateFormat date_time_format;
    static public String CRYPTO_KEY = "LIVING_FAITH_CHURCH_JAKPA_IN_GOD_WE_TRUST";//DO NOT CHANGE THIS VALUE - IT IS USED BY OTHER APPLICATIONS

    static {
        calendar = Calendar.getInstance();
        RequestLongTime = calendar.getTimeInMillis();
        date_time_format = new SimpleDateFormat(Util.datetime_format);
        RequestFormattedTime = date_time_format.format(calendar.getTime());
    }

    public static String toCommaSeperated(String[] arr) {
        String str = "";
        for (int i = 0; i < arr.length; i++) {
            str = i < arr.length - 1 ? arr[i] + "," : arr[i];
        }
        return str;
    }

    public static String getDateFormat() {
        return date_format;
    }

    public static String getCurrentMonth() throws ParseException {
        return getMonth(RequestFormattedTime);
    }

    public static int getCurrentYear() throws ParseException {
        return calendar.get(Calendar.YEAR);
    }

    public static String getMonth(String str_date) throws ParseException {

        String str_month = "";

        switch (getIntMonth(str_date)) {
            case 0:
                str_month = "January";
                break;
            case 1:
                str_month = "February";
                break;
            case 2:
                str_month = "March";
                break;
            case 3:
                str_month = "April";
                break;
            case 4:
                str_month = "May";
                break;
            case 5:
                str_month = "June";
                break;
            case 6:
                str_month = "July";
                break;
            case 7:
                str_month = "August";
                break;
            case 8:
                str_month = "September";
                break;
            case 9:
                str_month = "October";
                break;
            case 10:
                str_month = "November";
                break;
            case 11:
                str_month = "December";
                break;
        }

        return str_month;
    }

    public static int getIntMonth(String str_date) throws ParseException {
        str_date = checkDateFormat(str_date);
        SimpleDateFormat date_time_format = new SimpleDateFormat(date_format);
        int month = date_time_format.parse(str_date).getMonth();
        return month;
    }

    //REMIND: CHANGE THIS CODE IF RE-WRITTEN IN ANOTHER LANGUAGE
    public static int getYear(String str_date) throws ParseException {
        str_date = checkDateFormat(str_date);
        SimpleDateFormat date_time_format = new SimpleDateFormat(date_format);
        int year = date_time_format.parse(str_date).getYear();
        if (year < 2000) {//e.g 114 which I observed means 2014 in java. I am supposing that java has not change this style
            year -= 100;
            year += 2000;
        }
        return year;
    }

    static String checkDateFormat(String str_date) {//important

        if (str_date.equals(Util.EMPTY))//very important!
        {
            return Util.DEFAULT_DATE_STR;
        }

        if (date_format.contains("-")) {
            str_date = str_date.replaceAll("/", "-");
        } else if (date_format.contains("/")) {
            str_date = str_date.replaceAll("-", "/");
        }

        return str_date;
    }

    static String convertMySqlNumericMonthToAbbr(int mysql_numeric_month) {

        switch (mysql_numeric_month) {
            case 1:
                return "Jan";
            case 2:
                return "Feb";
            case 3:
                return "Mar";
            case 4:
                return "Apr";
            case 5:
                return "May";
            case 6:
                return "Jun";
            case 7:
                return "Jul";
            case 8:
                return "Aug";
            case 9:
                return "Sep";
            case 10:
                return "Oct";
            case 11:
                return "Nov";
            case 12:
                return "Dec";

        }

        return "";
    }

    static String convertMySqlNumericMonthToFullName(int mysql_numeric_month) {

        switch (mysql_numeric_month) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";

        }

        return "";
    }

    public static String amountInWords(String amount) {

        try {//test if it is a number
            float n = Float.parseFloat(amount);
        } catch (Exception ex) {
            return "zero"; //not a number
        }

        int dot_index = amount.indexOf(".");
        String amount_1 = amount;
        if (dot_index > -1) {
            amount_1 = amount.substring(0, dot_index);
        }

        String amount_2 = "";
        if (dot_index > -1) {
            amount_2 = amount.substring(dot_index + 1);
        }

        String in_words = amtToWords(amount_1, 1, "", "", false);
        int len = in_words.length();
        if (in_words.codePointAt(len - 1) == 32) {
            in_words = in_words.substring(0, len - 1);
        }

        String fraction = getFractionAmountInWord(amount_2);
        if (!fraction.isEmpty()) {
            in_words += " " + fraction;
        }
        return in_words;
    }

    private static String getFractionAmountInWord(String amt) {

        if (amt.length() == 0) {
            return "";
        }

        String word = "point";

        for (int i = 0; i < amt.length(); i++) {
            int num = Integer.parseInt(amt.substring(i));
            if (num == 0 && i == 0) {
                return "";
            } else if (num == 0) {
                return word;
            }

            String unit = getUnit(amt.charAt(i));
            if (unit.isEmpty()) {
                unit = "zero";
            }

            word += " " + unit;
        }

        return word;
    }

    private static String amtToWords(String amount, int block_count, String block, String word, boolean is_done) {

        if (block.isEmpty()) {
            amount = removePrefixZero(amount);
            if (amount.length() > 3) {
                block = amount.substring(amount.length() - 3);
            } else {
                block = amount;
                is_done = true;
            }

            if (amount.equals("")) {
                return "zero";
            }
        }

        int block_length = block.length();
        char c1 = '0';
        char c2 = '0';
        char c3 = '0';

        if (block_length == 3) {
            c1 = block.charAt(0);
            c2 = block.charAt(1);
            c3 = block.charAt(2);
        } else if (block_length == 2) {
            c2 = block.charAt(0);
            c3 = block.charAt(1);
        } else if (block_length == 1) {
            c3 = block.charAt(0);
        }

        String next_word = "";
        boolean is_less_than_hundred = false;
        if (c1 == '0' && c2 == '0' && c3 == '0') {
            //do nothing			
        } else if (c1 == '0' && c2 == '0' && c3 != '0') {
            next_word = getUnit(c3);
            is_less_than_hundred = true;
        } else if (c1 == '0' && c2 != '0') {
            next_word = getTens(c2, c3);
            is_less_than_hundred = true;
        } else if (c1 != '0') {
            next_word = getHundred(c1, c2, c3);
        }

        if (block_count == 1 && is_less_than_hundred && amount.length() > 3) {
            next_word = "and " + next_word;
        }

        if (!next_word.isEmpty()) {
            if (next_word.charAt(next_word.length() - 1) == 32) {
                next_word = next_word.substring(0, next_word.length() - 1);
            }

            switch (block_count) {
                case 2:
                    next_word += " thousand ";
                    break;
                case 3:
                    next_word += " million ";
                    break;
                case 4:
                    next_word += " billion ";
                    break;
                case 5:
                    next_word += " trillion ";
                    break;
                case 6:
                    next_word += " quadrillion ";
                    break;
                case 7:
                    next_word += " quintillion ";
                    break;
                case 8:
                    next_word += " sextillion ";
                    break;
                case 9:
                    next_word += " septillion ";
                    break;
                case 10:
                    next_word += " octillion ";
                    break;
                case 11:
                    next_word += " nonillion ";
                    break;
                case 12:
                    next_word += " decillion ";
                    break;
                case 13:
                    next_word += " undecillion ";
                    break;
                case 14:
                    next_word += " deodecillion ";
                    break;

            }
        }

        next_word += word;

        if (is_done) {
            return next_word;
        }

        int next_block_count = block_count + 1;
        int start_index = amount.length() - next_block_count * 3;
        int end_index = start_index + 3;

        if (start_index <= 0) {
            start_index = 0;
            is_done = true;
        }

        String next_block = amount.substring(start_index, end_index);

        return amtToWords(amount, next_block_count, next_block, next_word, is_done);
    }

    private static String getUnit(char c3) {
        switch (c3) {
            case '1':
                return "one";
            case '2':
                return "two";
            case '3':
                return "three";
            case '4':
                return "four";
            case '5':
                return "five";
            case '6':
                return "six";
            case '7':
                return "seven";
            case '8':
                return "eight";
            case '9':
                return "nine";
            default:
                return "";
        }
    }

    private static String getTens(char c2, char c3) {

        String d1 = getUnit(c3);

        if (c2 > '1') {
            switch (c2) {
                case '2':
                    return "twenty " + d1;
                case '3':
                    return "thirty " + d1;
                case '4':
                    return "forty " + d1;
                case '5':
                    return "fifty " + d1;
                case '6':
                    return "sixty " + d1;
                case '7':
                    return "seventy " + d1;
                case '8':
                    return "eighty " + d1;
                case '9':
                    return "ninty " + d1;
            }
        }

        if (c2 == '1') {
            switch (c3) {
                case '0':
                    return "ten";
                case '1':
                    return "eleven";
                case '2':
                    return "twelve";
                case '3':
                    return "thirteen";
                case '4':
                    return "fourteen";
                case '5':
                    return "fifteen";
                case '6':
                    return "sixteen";
                case '7':
                    return "seventeen";
                case '8':
                    return "eighteen";
                case '9':
                    return "nineteen";
            }
        }

        return "";
    }

    private static String getHundred(char c1, char c2, char c3) {

        if (c2 == '0') {
            String d1 = getUnit(c3);
            d1 = d1.isEmpty() ? "" : " and " + d1;
            switch (c1) {
                case '1':
                    return "one hundred" + d1;
                case '2':
                    return "two hundred" + d1;
                case '3':
                    return "three hundred" + d1;
                case '4':
                    return "four hundred" + d1;
                case '5':
                    return "five hundred" + d1;
                case '6':
                    return "six hundred" + d1;
                case '7':
                    return "seven hundred" + d1;
                case '8':
                    return "eight hundred" + d1;
                case '9':
                    return "nine hundred" + d1;

            }

        }

        if (c2 > '0') {
            String d2 = getTens(c2, c3);
            d2 = d2.isEmpty() ? "" : " and " + d2;
            switch (c1) {
                case '1':
                    return "one hundred" + d2;
                case '2':
                    return "two hundred" + d2;
                case '3':
                    return "three hundred" + d2;
                case '4':
                    return "four hundred" + d2;
                case '5':
                    return "five hundred" + d2;
                case '6':
                    return "six hundred" + d2;
                case '7':
                    return "seven hundred" + d2;
                case '8':
                    return "eight hundred" + d2;
                case '9':
                    return "nine hundred" + d2;
            }
        }

        return "";
    }

    private static String removePrefixZero(String amount) {
        for (int i = 0; i < amount.length(); i++) {
            if (amount.charAt(i) != '0') {
                return amount.substring(i);
            }
        }
        return "";
    }

    public static boolean isFound(String[] arr, String match) {

        for (String arr1 : arr) {
            if (arr1 == null) {
                continue;
            }
            if (arr1.equals(match)) {
                return true;
            }
        }

        return false;
    }

    public static int getAge(String dob) throws ParseException {
        int current_year = getCurrentYear();
        String[] split_dob = dob.split("-");
        if (split_dob.length < 3) {
            split_dob = dob.split("/");
        }

        int year = Integer.parseInt(split_dob[0]);
        int month = Integer.parseInt(split_dob[1]);
        int day = Integer.parseInt(split_dob[2]);

        int age = current_year - year;
        int current_month = calendar.get(Calendar.MONTH) + 1;//converting to non-zero base month
        int current_day = calendar.get(Calendar.DAY_OF_MONTH);

        if (current_month < month) {
            age = age - 1;
        } else if (current_month == month && current_day < day) {
            age = age - 1;
        }

        return age;
    }

    public static int weeksInMonth(int year, int java_month, int days_of_month, int reference_day) throws ParseException {
        int non_zero_base_month = java_month + 1;
        String str_date = year + "-" + (non_zero_base_month < 10 ? "0" + non_zero_base_month : non_zero_base_month) + "-01 00:00:00";
        int first_day = date_time_format.parse(str_date).getDay();
        int first_day_of_reference = 7 - first_day + reference_day + 1;
        if (first_day_of_reference > 7) {
            first_day_of_reference = first_day_of_reference - 7;
        }

        int days_remaining = days_of_month - first_day_of_reference;
        if (days_remaining >= 28) {
            return 5;
        }

        return 4;
    }

    public static String getFirstDateOfMonth(int zero_based_month, int year) {
        int non_zero_base_month = zero_based_month + 1;
        return year + "-" + (non_zero_base_month < 10 ? "0" + non_zero_base_month : non_zero_base_month) + "-01 00:00:00";
    }

    public static long getFirstTimeOfMonth(int zero_based_month, int year) throws ParseException {
        String date_str = getFirstDateOfMonth(zero_based_month, year);
        return date_time_format.parse(date_str).getTime();
    }

    public static String getFileExtension(String filename) {
        int index = filename.lastIndexOf(".");
        if (index < 0) {
            return "";
        }
        return filename.substring(index + 1);
    }

    public static Date strToDate(String str_date) throws ParseException, Exception {
        if (!date_format.equals("yyyy-MM-dd"))//this date format must not be changed
        {
            throw new Exception("Who asked you to change the date format from yyyy-MM-dd");
        }

        str_date = checkDateFormat(str_date);
        return new SimpleDateFormat(date_format).parse(str_date);
    }

    public static void main(String args[]) throws ParseException {
        //String amount = "1112233122";
        //String amount = "10056437";
        String amount = "100000000000000000000000000000000000000000";
        String in_word = Util.amountInWords(amount);
        System.out.println(in_word);
        System.out.println(((31 - 1) / 7 + 1));
        System.out.println(getAge("2000/02/24"));
        System.out.println("-----------");
        for (int i = 0; i < 7; i++) {
            System.out.println(weeksInMonth(2015, 5, 30, i));
        }

        System.out.println(RequestFormattedTime);

        System.out.println("----------------");

        System.out.println(getFirstTimeOfMonth(3, 2015));

    }

    public static int getNonZeroBaseMonth(String month) {
        month = month.toUpperCase();
        if (month.length() == 3) {
            if (month.equals("JAN")) {
                return 1;
            } else if (month.equals("FEB")) {
                return 2;
            } else if (month.equals("MAR")) {
                return 3;
            } else if (month.equals("APR")) {
                return 4;
            } else if (month.equals("MAY")) {
                return 5;
            } else if (month.equals("JUN")) {
                return 6;
            } else if (month.equals("JUL")) {
                return 7;
            } else if (month.equals("AUG")) {
                return 8;
            } else if (month.equals("SEP")) {
                return 9;
            } else if (month.equals("OCT")) {
                return 10;
            } else if (month.equals("NOV")) {
                return 11;
            } else if (month.equals("DEC")) {
                return 12;
            }

        } else {
            if (month.equals("JANUARY")) {
                return 1;
            } else if (month.equals("FEBRUARY")) {
                return 2;
            } else if (month.equals("MARCH")) {
                return 3;
            } else if (month.equals("APRIL")) {
                return 4;
            } else if (month.equals("MAY")) {
                return 5;
            } else if (month.equals("JUNE")) {
                return 6;
            } else if (month.equals("JULY")) {
                return 7;
            } else if (month.equals("AUGUST")) {
                return 8;
            } else if (month.equals("SEPTEMBER")) {
                return 9;
            } else if (month.equals("OCTOBER")) {
                return 10;
            } else if (month.equals("NOVEMBER")) {
                return 11;
            } else if (month.equals("DECEMBER")) {
                return 12;
            }
        }

        return -1;
    }

}

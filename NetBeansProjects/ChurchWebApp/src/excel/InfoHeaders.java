/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package excel;

import java.io.Serializable;
import java.util.ArrayList;
import exception.TransactionRecordException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Vector;
import util.TracerConstants;
import util.Util;

/**
 *
 * @author WILL-PARRY PC
 */
public abstract class InfoHeaders implements TracerConstants{

    protected List<String> predefined_cols = new ArrayList();
    protected List<String> user_cols = new ArrayList();
    protected List<Integer> transaction_col_indexes = new ArrayList();
    protected int max_cell_count = -1;//yes
    protected boolean valid = false;
    protected String columnName = "";
    protected String[] ImportantColumns = {TRANDATE, TRANCODE,
                                            REMARKS, DEBIT,
                                            CREDIT, CRNT_BALANCE};

    protected String customer_name = "";
    protected String customer_number = "";
    protected String statement_period = "";
    protected Calendar calendar = Calendar.getInstance();

    private int customer_name_row_index = -1;
    private int customer_number_row_index = -1;
    private int statement_period_index = -1;
    protected String ReasonInvalid = "";
    private final String[] CUSTORMER_NAME = {"CUSTOMER NAME", "CUST_NAME", "AC NAME",
        "ACCOUNT NAME", "ACC. NAME", "ACCT. NAME",
        "ACCT NAME", "A/C NAME", "A\\C NAME"};

    private final String[] CUSTORMER_NUMBER = {"CUSTOMER NUMBER", "CUST_NUMBER", "AC NUMBER",
        "ACCOUNT NUMBER", "ACC. NUMBER", "ACCT. NUMBER",
        "ACCT NUMBER", "A/C NUMBER", "A\\C NUMBER", "CUSTOMER NO", "CUSTOMER NO.",
        "CUST_NO", "AC. NO.", "AC. NO", "AC NO.", "ACCOUNT NO", "ACC. NO",
        "ACCT. NO.", "ACCT NO.", "ACCT. NO", "ACCT NO",
        "A/C NO", "A/C NO.", "A/C. NO.", "A/C. NO", "A\\C NO", "ACCOUNT NO.", "A\\C NO."};

    protected Date ToDate;
    protected Date FromDate;
    protected boolean canHaveORIGINATION;
    protected boolean canHaveTRA_SEQ1;
    protected boolean canHaveTRA_SEQ2;
    protected boolean canHaveVALUE_DATE;

    protected void SetCanHaveORIGINATION(boolean can) {
        canHaveORIGINATION = can;
    }

    protected void SetCanHaveTRA_SEQ1(boolean can) {
        canHaveTRA_SEQ1 = can;
    }

    protected void SetCanHaveTRA_SEQ2(boolean can) {
        canHaveTRA_SEQ2 = can;
    }

    protected void SetCanHaveVALUE_DATE(boolean can) {
        canHaveVALUE_DATE = can;
    }

    protected boolean addHeaderColumn(String col, int cell_index) throws TransactionRecordException {
        col = col.trim();
        Validate(col);

        if (valid) {
            if (col.contains(",")) {
                throw new TransactionRecordException("column name cannot contain the character comma (,)");
            }
            predefined_cols.add(columnName);
            user_cols.add(col);
            transaction_col_indexes.add(cell_index);
            checkOrder();
            return true;
        }

        return false;
    }

    protected void removeHeaderColumn(String col) {
        
        int index = predefined_cols.indexOf(col);
        if (index > -1) {
            predefined_cols.remove(index);
            user_cols.remove(index);
            transaction_col_indexes.remove(index);
        }

    }

    protected void setCustormerName(String str, int row_index) {
        if (!this.customer_name.isEmpty()) {
            return;
        }
        if (!this.isCustomerName(str)) {
            return;
        }

        customer_name_row_index = row_index;

        for (String CUSTORMER_NAME1 : this.CUSTORMER_NAME) {
            if (str.startsWith(CUSTORMER_NAME1)) {
                String cust_name = str.substring(CUSTORMER_NAME1.length());
                int index = 0;
                for (int i = 0; i < cust_name.length(); i++) {
                    if (Character.isLetterOrDigit(cust_name.charAt(i))) {
                        index = i;
                        break;
                    }
                }
                this.customer_name = cust_name.substring(index).trim();
            }
        }

    }

    protected void setCustormerNumber(String str, int row_index) {
        if (!this.customer_number.isEmpty()) {
            return;
        }
        if (!this.isCustomerNumber(str)) {
            return;
        }

        this.customer_number_row_index = row_index;

        for (String CUSTORMER_NUMBER1 : this.CUSTORMER_NUMBER) {
            if (str.startsWith(CUSTORMER_NUMBER1)) {
                String cust_no = str.substring(CUSTORMER_NUMBER1.length());
                int index = 0;
                for (int i = 0; i < cust_no.length(); i++) {
                    if (Character.isLetterOrDigit(cust_no.charAt(i))) {
                        index = i;
                        break;
                    }
                }
                this.customer_number = cust_no.substring(index).trim();
            }
        }
    }

    protected void setStatementPeriod(String str, int row_index) throws TransactionRecordException {
        if (!this.statement_period.isEmpty()) {
            return;
        }
        if (!this.isStatementPerioid(str)) {
            return;
        }

        this.statement_period_index = row_index;

        String[] str_split = str.split(" ");
        int count_date = 0;
        for (String str_split1 : str_split) {
            int index = 0;
            for (int k = 0; k < str_split1.length(); k++) {
                if (Character.isDigit(str_split1.charAt(k))) {
                    index = k;
                    break;
                }
            }

            String expected_date = str_split1.substring(index);

            if (isDateStr(expected_date)) {
                count_date++;
                this.statement_period += expected_date + (count_date == 1 ? " AND " : "");
                if (count_date == 1) {
                    this.FromDate = toRequiredDate(expected_date);
                } else {
                    this.ToDate = toRequiredDate(expected_date);
                }
            }
        }

        if (count_date != 2) {
            this.statement_period = "";//cancel
        } else {
            if (FromDate.after(ToDate)) {
                throw new TransactionRecordException("Invalid statement period - dates in reverse order.");
            }
        }
    }

    protected String reasonInvalid() {
        return this.ReasonInvalid;
    }

    private void Validate(String col) throws TransactionRecordException {
        valid = false;

        if (this.user_cols.contains(col)) {
            throw new TransactionRecordException("Invalid record format: column '" + col + "' repeated!");
        } else if (this.isTrandate(col)) {
            this.columnName = TRANDATE;
            valid = true;
        } else if (this.isTrancode(col)) {
            this.columnName = TRANCODE;
            valid = true;
        } else if (this.isDebit(col)) {
            this.columnName = DEBIT;
            valid = true;
        } else if (this.isCredit(col)) {
            this.columnName = CREDIT;
            valid = true;
        } else if (this.isRemarks(col)) {
            this.columnName = REMARKS;
            valid = true;
        } else if (this.isBalance(col)) {
            this.columnName = CRNT_BALANCE;
            valid = true;
        } else if (this.isTransactionType(col)) {
            this.columnName = TYPE_OF_TRANSACTION;
            valid = true;
        } else if (this.isOrigination(col) && canHaveORIGINATION) {
            this.columnName = ORIGINATION;
            valid = true;
        } else if (this.isSerialNo(col)) {
            this.columnName = SN;
            valid = true;
        } else if (this.isTranSeq1(col) && canHaveTRA_SEQ1) {
            this.columnName = TRA_SEQ1;
            valid = true;
        } else if (this.isTranSeq2(col) && canHaveTRA_SEQ2) {
            this.columnName = TRA_SEQ2;
            valid = true;
        } else if (this.isValueDate(col) && canHaveVALUE_DATE) {
            this.columnName = VALUE_DATE;
            valid = true;
        }

        if (valid) {
            //here confirm the validity.

            if (this.predefined_cols.contains(columnName)) {
                throw new TransactionRecordException("Invalid record format: could not understand '" + col + "'."
                        + "\nPlease use another descriptive name.");
            }

            //check whether the transaction date of the user is named DATE
            //and another column contains DATE in its string e.g VALUE DATE.
            //show warning in such case
            for (int i = 0; i < this.user_cols.size(); i++) {
                String column = this.user_cols.get(i);
                if (column.equalsIgnoreCase("DATE")) {
                    String m_col = col.toUpperCase();
                    if (m_col.contains(" DATE")
                            || m_col.contains("DATE ")
                            || m_col.contains("DATE_")
                            || m_col.contains("_DATE")) {

                        throw new TransactionRecordException("Invalid record format:"
                                + " Confusing record. The transaction date has been"
                                + " mapped to 'DATE'. Using '" + col + "'"
                                + " for another column header is not allowed."
                                + "\nPlease use another descriptive name.");

                    }

                }
            }

        }

    }

    public int getCellIndex(String col) {
        int index = predefined_cols.indexOf(col);
        if (index < 0) {
            return index;
        }
        return transaction_col_indexes.get(predefined_cols.indexOf(col));
    }

    public int getPredefinedStackIndex(String col) {
        return predefined_cols.indexOf(col);
    }

    protected boolean isSerialNo(String col) {
        col = normalizeCol(col);
        return col.equals("NO")
                || col.equals("NO.")
                || col.equals("SN")
                || col.equals("S/N.")
                || col.equals("S\\N.")
                || col.equals("SERIAL")
                || col.equals("SERIAL NO")
                || col.equals("SERIAL_NO");
    }

    protected boolean isTrandate(String col) {
        col = normalizeCol(col);
        return col.equals("DATE")
                || col.equals("TRANDATE")
                || col.equals("TRANC DATE")
                || col.equals("TRAN DATE")
                || col.equals("TRAN. DATE")
                || col.equals("TRANS DATE")
                || col.equals("TRANS. DATE")
                || col.equals("TRANSAC DATE")
                || col.equals("TRANSACT DATE")
                || col.equals("TRANSACTION DATE")
                || col.equals("DATE OF TRAN")
                || col.equals("DATE_OF_TRAN.")
                || col.equals("DATE OF TRANSACTION")
                || col.equals("DATE_OF_TRANSACTION")
                || col.equals("DATE OF TRANS")
                || col.equals("DATE_OF_TRANS")
                || col.equals("DATE OF TRAN")
                || col.equals("DATE_OF_TRAN")
                || col.equals("DATE OF TRAN.")
                || col.equals("DATE_OF_TRAN.")
                || col.equals("DATE OF TRANSACT")
                || col.equals("DATE_OF_TRANSACT")
                || col.equals("DATE OF TRANSAC")
                || col.equals("DATE_OF_TRANSAC");
    }

    protected boolean isTrancode(String col) {
        col = normalizeCol(col);
        return col.equals("TRANCODE")
                || col.equals("TRAN. CODE")
                || col.equals("TRANSACTION CODE")
                || col.equals("TRANSACT CODE")
                || col.equals("REF")
                || col.equals("REF.")
                || col.equals("REFER")
                || col.equals("REFER.")
                || col.equals("CODE");
    }

    protected boolean isTranSeq1(String col) {
        col = normalizeCol(col);
        return col.equals("TRA_SEQ1")
                || col.equals("TRA SEQ1")
                || col.equals("TRAN_SEQ1")
                || col.equals("TRAN SEQ1");
    }

    protected boolean isTranSeq2(String col) {
        col = normalizeCol(col);
        return col.equals("TRA_SEQ2")
                || col.equals("TRA SEQ2")
                || col.equals("TRAN_SEQ2")
                || col.equals("TRAN SEQ2");
    }

    protected boolean isValueDate(String col) {
        col = normalizeCol(col);
        return col.equals("VALUE DATE")
                || col.equals("VALUE_DATE");
    }

    protected boolean isOrigination(String col) {
        col = normalizeCol(col);
        return col.equals("ORIGINATION");
    }

    protected boolean isRemarks(String col) {
        col = normalizeCol(col);
        return col.equals("REMARKS")
                || col.equals("REMARK")
                || col.equals("DETAIL")
                || col.equals("DETAILS")
                || col.equals("DESCRIP")
                || col.equals("DESC")
                || col.equals("DESCRIPTION")
                || col.equals("DESCRIPTIONS")
                || col.equals("DESCRIBE")
                || col.equals("DESCR")
                || col.equals("TRAN REMARKS")
                || col.equals("TRAN REMARK")
                || col.equals("TRAN DETAIL")
                || col.equals("TRAN DETAILS")
                || col.equals("TRAN DESCRIP")
                || col.equals("TRAN DESC")
                || col.equals("TRAN DESCRIPTION")
                || col.equals("TRAN DESCRIPTIONS")
                || col.equals("TRAN DESCRIBE")
                || col.equals("TRAN DESCR")
                || col.equals("TRANS REMARKS")
                || col.equals("TRANS REMARK")
                || col.equals("TRANS DETAIL")
                || col.equals("TRANS DETAILS")
                || col.equals("TRANS DESCRIP")
                || col.equals("TRANS DESC")
                || col.equals("TRANS DESCRIPTION")
                || col.equals("TRANS DESCRIPTIONS")
                || col.equals("TRANS DESCRIBE")
                || col.equals("TRANS DESCR")
                || col.equals("TRANSACTION REMARKS")
                || col.equals("TRANSACTION REMARK")
                || col.equals("TRANSACTION DETAIL")
                || col.equals("TRANSACTION DETAILS")
                || col.equals("TRANSACTION DESCRIP")
                || col.equals("TRANSACTION DESC")
                || col.equals("TRANSACTION DESCRIPTION")
                || col.equals("TRANSACTION DESCRIPTIONS")
                || col.equals("TRANSACTION DESCRIBE")
                || col.equals("TRANSACTION DESCR");
    }

    protected boolean isDebit(String col) {
        col = normalizeCol(col);
        return col.equals("DEBIT")
                || col.equals("DB")
                || col.equals("DR")
                || col.equals("DB.")
                || col.equals("DR.");
    }

    protected boolean isCredit(String col) {
        col = normalizeCol(col);
        return col.equals("CREDIT")
                || col.equals("CR")
                || col.equals("CR.");
    }

    protected boolean isBalance(String col) {
        col = normalizeCol(col);
        return col.equals("BALANCE")
                || col.equals("BALANC")
                || col.equals("CURRENT BALANCE")
                || col.equals("CURRENT BAL")
                || col.equals("CURRENT BAL.")
                || col.equals("CRNT BALANCE")
                || col.equals("CRNT BAL.")
                || col.equals("CRNT BAL.")
                || col.equals("BAL.")
                || col.equals("BAL");
    }

    protected boolean isTransactionType(String col) {
        col = normalizeCol(col);
        return col.equals("TRANSACTION TYPE")
                || col.equals("TRAN TYPE")
                || col.equals("TRANS TYPE")
                || col.equals("TRANSACT TYPE")
                || col.equals("TRANSAC TYPE")
                || col.equals("TYPE OF TRAN")
                || col.equals("TYPE OF TRAN.")
                || col.equals("TYPE OF TRANSAC")
                || col.equals("TYPE OF TRANSACT")
                || col.equals("TYPE OF TRANS.")
                || col.equals("TRANS. TYPE")
                || col.equals("TRAN. TYPE");

    }

    protected String normalizeCol(String col) {
        col = col.trim();
        col = col.toUpperCase();
        if (col.indexOf('.') > -1) {
            col = col.replaceAll("\\.", "");
        }
        if (col.indexOf("  ") > -1)//double space
        {
            col = col.replaceAll("  ", " ");//replace   double space with single space     
        }
        return col;
    }

    protected boolean isCustomerName(String col) {
        col = col.trim();
        col = col.toUpperCase();
        if (col.indexOf("  ") > -1)//double space
        {
            col = col.replaceAll("  ", " ");//replace   double space with single space
        }
        for (int i = 0; i < CUSTORMER_NAME.length; i++) {
            if (col.startsWith(CUSTORMER_NAME[i])) {
                return true;
            }
        }

        return false;
    }

    protected boolean isCustomerNumber(String col) {
        col = col.trim();
        col = col.toUpperCase();
        if (col.indexOf("  ") > -1)//double space
        {
            col = col.replaceAll("  ", " ");//replace   double space with single space        
        }
        for (int i = 0; i < CUSTORMER_NUMBER.length; i++) {
            if (col.startsWith(CUSTORMER_NUMBER[i])) {
                return true;
            }
        }

        return false;
    }

    protected boolean isStatementPerioid(String col) {
        col = col.trim();
        col = col.toUpperCase();
        if (col.indexOf("  ") > -1)//double space
        {
            col = col.replaceAll("  ", " ");//replace   double space with single space
        }
        String[] col_split = col.split(" ");
        boolean has_date = false;
        //acceptable date format is e.g 01-FEB-15
        for (int i = 0; i < col_split.length; i++) {
            if (this.isDateStr(col_split[i])) {
                has_date = true;
                break;
            }

        }

        return (col.contains("STATEMENT") || col.contains("PERIOD")) && has_date;
    }

    protected abstract boolean isValid();

    protected int columnCountIncludeEmptyInBetween() {
        if (max_cell_count > -1) {
            return max_cell_count;
        }

        for (int statement_col_index : this.transaction_col_indexes) {
            int cell_count = statement_col_index + 1;
            if (max_cell_count < cell_count) {
                max_cell_count = cell_count;
            }
        }
        return max_cell_count;
    }

    protected int columnCountIngoreEmpty() {
        return this.user_cols.size();
    }

    public String predefinedColumnName(int i) {
        return this.predefined_cols.get(i);
    }

    public String userColumnName(int i) {
        return this.user_cols.get(i);
    }

    public String[] userColumnHeaders() {
        return this.user_cols.toArray(new String[0]);
    }

    public String[] predefinedColumnHeaders() {
        return this.predefined_cols.toArray(new String[0]);
    }

    public int getIndexOfTrancode() {
        for (int i = 0; i < user_cols.size(); i++) {
            if (this.isTrancode(user_cols.get(i))) {
                return i;
            }
        }

        return -1;
    }

    public int getIndexOfTranDate() {
        for (int i = 0; i < user_cols.size(); i++) {
            if (this.isTrandate(user_cols.get(i))) {
                return i;
            }
        }
        return -1;
    }

    public int getIndexOfDetails() {
        for (int i = 0; i < user_cols.size(); i++) {
            if (this.isRemarks(user_cols.get(i))) {
                return i;
            }
        }

        return -1;
    }

    public int getIndexOfDebit() {
        for (int i = 0; i < user_cols.size(); i++) {
            if (this.isDebit(user_cols.get(i))) {
                return i;
            }
        }

        return -1;
    }

    public int getIndexOfCredit() {
        for (int i = 0; i < user_cols.size(); i++) {
            if (this.isCredit(user_cols.get(i))) {
                return i;
            }
        }

        return -1;
    }

    public int getIndexOfBalance() {
        for (int i = 0; i < user_cols.size(); i++) {
            if (this.isBalance(user_cols.get(i))) {
                return i;
            }
        }

        return -1;
    }

    /**
     * examples of acceptable date format is<br>
     * 02-FEB-12<br>
     * 03-APR-15<br><br>
     * note the date format start with day of month followed by the month and
     * then end with year
     *
     * @param expected_date the parameter being tested if it match the
     * acceptable date format
     * @return
     */
    private boolean isDateStr(String expected_date) {
        if (expected_date.length() == 9) {
            String[] date_split = expected_date.split("/");
            if (date_split.length != 3) {
                date_split = expected_date.split("-");
            }

            if (date_split.length == 3) {
                if (date_split[0].length() == 2 && date_split[1].length() == 3 && date_split[2].length() == 2) {
                    try {
                        Integer.parseInt(date_split[0]);//check if it is number
                        Integer.parseInt(date_split[2]);//check if it is number
                        if (isAbbrMonth(date_split[1])) {//check if it is abbr month
                            return true;//all check is ok.
                        }
                    } catch (Exception ex) {
                    }
                }
            }

        }

        return false;
    }

    private boolean isAbbrMonth(String str) {
        str = str.toLowerCase();//this is to allow any case
        if (str.equals("jan")) {
            return true;
        } else if (str.equals("feb")) {
            return true;
        } else if (str.equals("mar")) {
            return true;
        } else if (str.equals("apr")) {
            return true;
        } else if (str.equals("may")) {
            return true;
        } else if (str.equals("jun")) {
            return true;
        } else if (str.equals("jul")) {
            return true;
        } else if (str.equals("aug")) {
            return true;
        } else if (str.equals("sep")) {
            return true;
        } else if (str.equals("oct")) {
            return true;
        } else if (str.equals("nov")) {
            return true;
        } else if (str.equals("dec")) {
            return true;
        }

        return false;
    }

    private Date toRequiredDate(String date) throws TransactionRecordException {
        date = date.replaceAll(" ", "");//remove all spaces

        String[] split = date.split("-");//try dash seperator -

        if (split.length != 3) {
            split = date.split("/");//try slash seperator -
        }
        if (split.length != 3) {
            split = date.split(":");//try colon seperator        
        }
        if (split.length != 3) {
            throw new TransactionRecordException("Invalid date format");
        }

        int day = 0;
        int month = 0;
        int year = 0;

        try {

            day = Integer.parseInt(split[0]);
            if (day < 1 || day > 31) {
                throw new TransactionRecordException("Invalid date format");
            }

            month = Util.getNonZeroBaseMonth(split[1]);
            month = month - 1;// monhth value is zero base
            if (month == -1) {
                throw new TransactionRecordException("Invalid date format");
            }

            year = Integer.parseInt(split[2]);
            if (year < 1000) {
                year = 2000 + year;
            }

            calendar.clear();
            calendar.set(year, month, day);
            return calendar.getTime();

        } catch (Exception ex) {
            throw new TransactionRecordException("Invalid date format");
        }

    }

    private void checkOrder() throws TransactionRecordException {

        int debit_index = this.getPredefinedStackIndex(DEBIT);
        int credit_index = this.getPredefinedStackIndex(CREDIT);
        int balance_index = this.getPredefinedStackIndex(CRNT_BALANCE);

        /*if(balance_index>-1)
         if(balance_index != this.predefined_cols.size()-1){
         throw new TransactionRecordException("Not allowed: column '"+
         this.user_cols.get(balance_index)+"' is expected to"
         + " come last." );
         }
         */
        if (debit_index > -1) {
            if (credit_index > -1) {
                if (credit_index < debit_index) {
                    throw new TransactionRecordException("Not allowed: column '" + this.user_cols.get(debit_index) + "' is expected to"
                            + " come before column '" + this.user_cols.get(credit_index) + "'");
                }
            }
        }

        if (balance_index > -1)//NEW UPDATE
        {
            if (credit_index > -1) {
                if (credit_index > balance_index) {
                    throw new TransactionRecordException("Not allowed: column '" + this.user_cols.get(credit_index) + "' is expected to"
                            + " come before column '" + this.user_cols.get(balance_index) + "'");
                }
            }
        }

        if (balance_index > -1)//NEW UPDATE
        {
            if (debit_index > -1) {
                if (debit_index > balance_index) {
                    throw new TransactionRecordException("Not allowed: column '" + this.user_cols.get(debit_index) + "' is expected to"
                            + " come before column '" + this.user_cols.get(balance_index) + "'");
                }
            }
        }

        /*if(debit_index>-1)
         if(credit_index>-1)
         if(balance_index>-1)
         if(user_cols.size()>3)
         if(debit_index != user_cols.size() - 3)
         {
         int index =  user_cols.size() - 3;
         throw new TransactionRecordException("Not allowed: column '"+this.user_cols.get(debit_index)+"' is expected to"
         + " come after column '"+this.user_cols.get(index)+"'");
         }
         */
    }

}

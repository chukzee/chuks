/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package excel;

import exception.BankStatementException;
import exception.TransactionRecordException;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import static util.Util.isFound;

/**
 *
 * @author chuks
 */
public class BankStatement extends TransactionRecords {

    private Date last_tran_date;
    private Date first_tran_date;
    
    public BankStatement() {
        super();
        super.SetCanHaveORIGINATION(true);
        super.SetCanHaveTRA_SEQ1(true);
        super.SetCanHaveTRA_SEQ2(true);
        super.SetCanHaveVALUE_DATE(true);
    }

    public void autoCorrectBalanceComputation(boolean auto_correct_balance) {
        this.auto_correct_balance = auto_correct_balance;
    }

    @Override
    public double getBalanceBroughtForward() {

        if (this.hasBalanceBFwdRow()) {
            return balance_bf;
        } else {
            balance_bf = first_balance - first_credit + first_debit; //this is opposite of cash book            
        }

        return balance_bf;
    }

    public String getStatementPeriodFromDate(String format) throws TransactionRecordException {
        return new SimpleDateFormat(format).format(FromDate);
    }

    public String getStatementPeriodToDate(String format) throws TransactionRecordException {
        return new SimpleDateFormat(format).format(ToDate);
    }

    @Override
    protected void scanSheet(Sheet sheet) throws TransactionRecordException {

        Row row;
        Cell cell;
        //int row_index = -1;

        int rowStart = sheet.getFirstRowNum();
        int rowEnd = sheet.getLastRowNum();

        trancodes = new String[rowEnd + 1];

        boolean found_header_row = false;

        for (int row_index = rowStart; row_index < rowEnd + 1; row_index++) {
            
            checkProgresChange( row_index,  0,  rowEnd * 3);
            
            Row r = sheet.getRow(row_index);
            
            if(r==null)//COME BACK
                continue;//COME BACK
            
            int lastColumn = r.getLastCellNum();

            if (!found_header_row) {
                for (int cell_index = 0; cell_index < lastColumn + 1; cell_index++) {
                    cell = r.getCell(cell_index, Row.RETURN_NULL_AND_BLANK);
                    if (cell == null) {
                        continue;
                    }

                    String cell_value = strCellValue(cell);

                    if (cell_value == null) {
                        continue;
                    }

                    if (cell_value.isEmpty()) {
                        continue;
                    }

                    if (cell_index == 0) {
                        setCustormerName(cell_value, row_index);
                        setCustormerNumber(cell_value, row_index);
                        setStatementPeriod(cell_value, row_index);
                    }

                    if (!customer_name.isEmpty()
                            && !customer_number.isEmpty()
                            && !statement_period.isEmpty()) {
                        //at this point the customer name , number andt statement period has been discovered
                        boolean is_added = addHeaderColumn(cell_value, cell_index);
                        if (is_added) {
                            data_row_start_index = row_index + 1;
                            found_header_row = true;
                        }
                    }
                }
            }
        }

        for (int row_index = rowStart; row_index < rowEnd + 1; row_index++) {
            
            checkProgresChange(row_index, (int) (rowEnd * 0.5),  rowEnd * 3);
            
            Row r = sheet.getRow(row_index);
            
            if(r==null)//COME BACK
                continue;//COME BACK
            
            int lastColumn = r.getLastCellNum();

            for (int c_index = 0; c_index < columnCountIncludeEmptyInBetween(); c_index++) {
                cell = r.getCell(c_index, Row.RETURN_NULL_AND_BLANK);
                if (cell == null) {
                    continue;
                }

                String cell_value = strCellValue(cell);

                if (cell_value != null) {
                    if (!cell_value.isEmpty()) {
                        this.last_entry_row_index = row_index;
                        break;
                    }
                }
            }

        }

    }

    @Override
    protected String checkCellVaulue(Cell cell, int row_index, int cell_index, boolean is_normal_record) throws BankStatementException, TransactionRecordException {

        String cell_value = "";

        if (cell != null) {
            switch (cell.getCellType()) {
                case Cell.CELL_TYPE_NUMERIC:
                    cell_value = cell.getNumericCellValue() + "";
                    break;
                case Cell.CELL_TYPE_STRING:
                    cell_value = cell.getStringCellValue();
                    break;
                case Cell.CELL_TYPE_BLANK:;
                    break;//do not return just break- important!!!     
                case Cell.CELL_TYPE_ERROR:
                    throw new BankStatementException("Invalid bank statement - ERROR cell not supported.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
                case Cell.CELL_TYPE_BOOLEAN:
                    throw new BankStatementException("Invalid bank statement - BOOLEAN cell not supported.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
                case Cell.CELL_TYPE_FORMULA:
                    throw new BankStatementException("Invalid bank statement - FORMULA cell not supported.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
                default:
                    return null;//leave    
            }
        } else {
            //just continue
        }


        
        if (cell_index == getCellIndex(ORIGINATION) && canHaveORIGINATION) {//ORIGINATION          
            return cell_value;
        }

        if (cell_index == getCellIndex(SN)) {//SN     
            return cell_value;
        }

        if (cell_index == getCellIndex(TYPE_OF_TRANSACTION)) {//TYPE_OF_TRANSACTION                
            return cell_value;
        }

        if (cell_index == getCellIndex(TRANDATE)) {//TRANDATE      
            Date date = null;

            if (!is_normal_record && cell == null) {
                return "";//important! yes return empty rather than null to signify the field was found at least
            }
            try {
                date = cell.getDateCellValue();
            } catch (java.lang.IllegalStateException ex) {
                throw new BankStatementException("Invalid bank statement format: Expected date value on '" + TRANDATE + "' column.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
            }

            if (!is_normal_record && date == null) {
                return "";//important! yes return empty rather than null to signify the field was found at least
            }
            String str_date = strCellDate(date, row_index, cell_index);

            if (first_tran_date == null) {
                first_tran_date = new Date(date.getTime());
            }

            if (last_tran_date == null) {
                last_tran_date = new Date(date.getTime());
            }

            if (date.before(first_tran_date)) {
                first_tran_date = new Date(date.getTime());
            }

            if (date.after(last_tran_date)) {
                last_tran_date = new Date(date.getTime());
            }

            if (first_tran_date.before(this.FromDate)) {
                if (!isExactlySameDay(first_tran_date, FromDate))//ie same day month and year
                {
                    throw new BankStatementException("Invalid bank statement format: Transaction date out of range - comes before statement period.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
                }

            }

            if (last_tran_date.after(this.ToDate)) {
                if (!isExactlySameDay(last_tran_date, ToDate))//ie same day, month and year
                {
                    throw new BankStatementException("Invalid bank statement format: Transaction date out of range - comes after statement period.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
                }
            }

            return str_date;
        }

        if (cell_index == getCellIndex(TRANCODE)) {//TRANCODE 

            if (cell_value.isEmpty() && is_normal_record) {
                throw new BankStatementException("Invalid bank statement: TRANCODE is empty.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
            }

            if (cell_value.indexOf("'") > -1 && is_normal_record) {
                throw new BankStatementException("Invalid bank statement: TRANCODE contains an illegal character - Trancode cannot contain single quote (') character.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
            }

            if (cell_value.indexOf("\"") > -1 && is_normal_record) {
                throw new BankStatementException("Invalid bank statement: TRANCODE contains an illegal character - Trancode cannot contain double quote (\") character.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
            }

            if (cell_value.indexOf(",") > -1 && is_normal_record) {
                throw new BankStatementException("Invalid bank statement: TRANCODE contains an illegal character - Trancode cannot contain the character comma (,).\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
            }

            if (isFound(trancodes, cell_value) && is_normal_record) {
                throw new BankStatementException("Invalid bank statement: TRANCODE repeated - Trancode is a unique identifier of a transaction and should not be repeated.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
            }

            if (is_normal_record) {
                trancode_index++;
                trancodes[trancode_index] = cell_value;
            }

            return cell_value;
        }

        if (cell_index == getCellIndex(REMARKS)) {//REMARKS
            if (is_normal_record) {
                if (!isValidRemarks(cell_value)) {
                    throw new BankStatementException("Invalid description of transaction!\n'" + this.userColumnName(this.getPredefinedStackIndex(REMARKS)) + "' does not describe a transaction.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
                }
            }
            return cell_value;
        }

        if (cell_index == getCellIndex(TRA_SEQ1) && canHaveTRA_SEQ1) {//TRA_SEQ1                            
            return cell_value;
        }

        if (cell_index == getCellIndex(TRA_SEQ2) && canHaveTRA_SEQ2) {//TRA_SEQ2                            
            return cell_value;
        }

        if (cell_index == getCellIndex(VALUE_DATE) && canHaveVALUE_DATE) {//VALUE DATE        
            Date date = null;

            if (!is_normal_record && cell == null) {
                return "";//important! yes return empty rather than null to signify the field was found at least            
            }
            try {
                date = cell.getDateCellValue();
            } catch (java.lang.IllegalStateException ex) {
                throw new BankStatementException("Invalid bank statement format: Expected date value on '" + VALUE_DATE + "' column.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
            }

            if (!is_normal_record && date == null) {
                return "";//important! yes return empty rather than null to signify the field was found at least
            }
            return strCellDate(date, row_index, cell_index);
        }

        if (cell_index == getCellIndex(DEBIT)) {//DEBIT            
            String str_debit = checkNumeric(cell_value, DEBIT, row_index, cell_index);
            this.current_debit = Double.valueOf(str_debit);
            return str_debit;
        }

        if (cell_index == getCellIndex(CREDIT)) {//CREDIT
            String str_credit = checkNumeric(cell_value, CREDIT, row_index, cell_index);
            this.current_credit = Double.valueOf(str_credit);
            if (is_normal_record) {
                if (this.current_debit == 0 && this.current_credit == 0) {
                    throw new BankStatementException("Both debit and credit cannot be zero on same transaction record.\n\nPlease check row ( " + (row_index + 1) + " )"
                            + "\nHint: Make sure the debit comes before credit in the record.");
                }
            }
            return str_credit;
        }

        if (cell_index == getCellIndex(CRNT_BALANCE)) {//BALANCE 
            String bal = checkNumeric(cell_value, CRNT_BALANCE, row_index, cell_index);
            float bk_bal = (float) Double.parseDouble(bal);
            if (is_normal_record) {
                float correct_balance = (float) computeBalance();
                final_bal =  correct_balance;
                if (this.auto_correct_balance) {
                    return String.valueOf(correct_balance);
                } else if (bk_bal != correct_balance) {
                    throw new BankStatementException("Wrong balance computation detected. Expected '" + correct_balance + "' instead of '" + bk_bal + "'.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
                } else {
                    final_bal =  bk_bal;
                    return bal;
                }
            } else {
                return bal;
            }
        }

        return null;
    }

    protected String extractCustomerName(String value) throws BankStatementException {
        String str = value.substring(CUSTOMER_NAME.length());
        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            if (ch != ' ' && ch != '-') {
                return str.substring(i);
            }
        }

        throw new BankStatementException("Invalid bank statement. the customer name not set.");
    }

    protected String extractCustomerNumber(String value) throws BankStatementException {
        String str = value.substring(CUSTOMER_NUMBER.length());
        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            if (ch != ' ' && ch != '-') {
                return str.substring(i);
            }
        }

        throw new BankStatementException("Invalid bank statement. the customer number not set.");
    }

    @Override
    protected boolean isValid() {

        if (this.customer_name.isEmpty()) {
            this.ReasonInvalid = "Could not locate customer name";
            return false;
        }

        if (this.customer_number.isEmpty()) {
            this.ReasonInvalid = "Could not locate customer number";
            return false;
        }

        if (this.statement_period.isEmpty()) {
            this.ReasonInvalid = "Could not locate statement period";
            return false;
        }

        for (int i = 0; i < this.ImportantColumns.length; i++) {
            if (!this.predefined_cols.contains(ImportantColumns[i])) {
                this.ReasonInvalid = "Bank statement must have a column named " + ImportantColumns[i];
                return false;
            }
        }

        return true;
    }

    @Override
    protected double computeBalance() throws BankStatementException {

        if (this.current_debit == 0 && this.current_credit == 0) {
            /**
             * If this exception is thrown contact Chuks Alimele.
             *
             * READ THE LINE COMMENTS BELOW IN THIS METHOD.
             */
            throw new BankStatementException("debit and credit cannot be zero on same transaction."
                    + "\nHint: Make sure the balance comes last in the record.");
        }

        if (bal == 0 && !isBFCumputed) {
            bal = this.getBalanceBroughtForward();
            isBFCumputed = true;
        }

        bal += current_credit - current_debit; // opposite of cash book
        
        
        //REAND THIS LINE COMMENT.
        //initialize to prevent future modification of the order of CREDIT , DEBIT and BALANCE columns.
        //The exception will be throw above if the order is changed. By order, the BALANCE comes last.
        //So if this order is altered current_debit or current_crebit will be zero and the exception
        //above will be thrown.
        current_debit = 0;//initialized to make the exception thrown if the order is changed.
        current_debit = 0;//initialized to make the exception thrown if the order is changed.

        bal = Double.parseDouble(this.decimalFormat.format(bal));
        
        return bal;
    }

    private boolean isValidRemarks(String cell_value) {

        for (int i = 0; i < cell_value.length(); i++) {
            char c = cell_value.charAt(i);
            if (Character.isLetterOrDigit(c)) {
                return true;
            }
        }

        return false;
    }

    private boolean isExactlySameDay(Date date1, Date date2) {
        return date1.getDay() == date2.getDay()
                && date1.getMonth() == date2.getMonth()
                && date1.getYear() == date2.getYear();
    }

}

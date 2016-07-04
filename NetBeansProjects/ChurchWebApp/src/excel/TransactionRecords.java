/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package excel;

import exception.TransactionRecordException;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import util.Util;

/**
 *
 * @author chuks
 */
public abstract class TransactionRecords extends InfoHeaders {

    //change line below to private later
    //StringBuffer is used as a very fast way of appending string
    //public StringBuffer transactionData= new StringBuffer();//this stores the transaction date ,remarks, credit, debit, and current balance
    private String[][] tranData = new String[0][0];
    private int start_row = -1;
    private int stmt_row_index = -1;
    private int last_row_index = -1;
    private boolean trans_data_finished = false;

    private StringBuffer Trancode_IN_Param = new StringBuffer();
    protected String[] trancodes = new String[0];
    protected int trancode_index = -1;
    protected double _debit;
    protected double _credit;
    protected int data_row_start_index = -1;
    protected int last_entry_row_index = -1;
    private boolean hasBalanceBrougtForwardRow;
    private String bal_bf_remarks = "";
    protected double balance_bf;
    protected double first_debit;
    protected double first_credit;
    protected double first_balance;
    protected double current_debit;
    protected double current_credit;
    protected double bal;
    protected boolean auto_correct_balance;
    protected DecimalFormat decimalFormat = new DecimalFormat("#.00");
    protected ImportListener listener;
    protected int progressLen;
    protected double final_bal;
    protected boolean isBFCumputed;
    
    public String getCustomerName() {
        return customer_name;
    }

    public String getCustomerNumber() {
        return customer_number;
    }

    public abstract double getBalanceBroughtForward();//the computation can be different for cash book and bank statement

    public double getFinalBalance(){
        return this.final_bal;
    }
    
    public String getBalanceBFwdRemark() {
        return this.bal_bf_remarks;
    }

    public boolean hasBalanceBFwdRow() {
        return this.hasBalanceBrougtForwardRow;
    }

    public String[][] getTransactionData() {
        return this.tranData;
    }

    public String toCommaSeperated(String[] n) {
        String str = "";
        for (int i = 0; i < n.length; i++) {
            str += n[i] + (i < n.length - 1 ? "," : "");
        }
        return str;
    }

    public String toCommaSeperated(Integer[] n) {
        String str = "";
        for (int i = 0; i < n.length; i++) {
            str += n[i] + (i < n.length - 1 ? "," : "");
        }
        return str;
    }

    public StringBuffer getTracodeINParam() {
        if (Trancode_IN_Param.length() == 0) {
            for (int i = 0; i < trancodes.length; i++) {
                if (trancodes[i] == null) {
                    break;
                }

                if (i == 0) {
                    Trancode_IN_Param.append("'").append(trancodes[i]).append("'");
                } else {
                    Trancode_IN_Param.append(",'").append(trancodes[i]).append("'");
                }
            }
        }

        if (Trancode_IN_Param.length() == 0) {
            Trancode_IN_Param.append("''");
        }

        return this.Trancode_IN_Param;

    }

    public void processRecords(String bank_statement_file_name) throws FileNotFoundException, IOException, TransactionRecordException {

        String file_extension = Util.getFileExtension(bank_statement_file_name);
        FileInputStream bank_statement = new FileInputStream(bank_statement_file_name);
        // Iterate through each rows from first sheet
        Iterator<Row> rowIterator = null;

        if (file_extension.equalsIgnoreCase("xls")) {
            // Get the workbook instance for XLS file
            HSSFWorkbook workbook = new HSSFWorkbook(bank_statement);

            // Get first sheet from the workbook
            HSSFSheet sheet = workbook.getSheetAt(0);
            //rowIterator = sheet.iterator();
            checkFormat(sheet);
        } else if (file_extension.equalsIgnoreCase("xlsx")) {

            XSSFWorkbook wb = new XSSFWorkbook(bank_statement);
            // Get first sheet from the workbook
            XSSFSheet sheet = wb.getSheetAt(0);
            //rowIterator = sheet.iterator();
            checkFormat(sheet);

        } else if (file_extension.equalsIgnoreCase("csv")) {
            //TODO:
        } else {
            throw new TransactionRecordException("Not supported MS Excel file.");
        }

    }

    public void processRecords(byte[] bank_statement, String file_extension) throws IOException, TransactionRecordException {
        ByteArrayInputStream bin = new ByteArrayInputStream(bank_statement);
        processRecords(bin, file_extension);
    }

    public void processRecords(InputStream bank_statement, String file_extension) throws IOException, TransactionRecordException {

        if (file_extension.equalsIgnoreCase("xls")) {
            // Get the workbook instance for XLS file
            HSSFWorkbook workbook = new HSSFWorkbook(bank_statement);
            // Get first sheet from the workbook
            HSSFSheet sheet = workbook.getSheetAt(0);
            checkFormat(sheet);
        } else if (file_extension.equalsIgnoreCase("xlsx")) {

            XSSFWorkbook wb = new XSSFWorkbook(bank_statement);
            // Get first sheet from the workbook
            XSSFSheet sheet = wb.getSheetAt(0);
            checkFormat(sheet);
        } else if (file_extension.equalsIgnoreCase("csv")) {
            //TODO:            
        } else {
            throw new TransactionRecordException("Not supported excel file.");
        }

    }

    protected String strCellValue(Cell cell) throws TransactionRecordException {
        switch (cell.getCellType()) {
            case Cell.CELL_TYPE_NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case Cell.CELL_TYPE_STRING:
                return cell.getStringCellValue();
            case Cell.CELL_TYPE_BLANK:;
                return "";//do not return just break- important!!!            
            case Cell.CELL_TYPE_ERROR:
                throw new TransactionRecordException("ERROR cell not supported.\n\nPlease check cell ( " + (cell.getRowIndex() + 1) + " , " + String.valueOf((char) (cell.getColumnIndex() + 65)) + " )");
            case Cell.CELL_TYPE_BOOLEAN:
                throw new TransactionRecordException("BOOLEAN cell not supported.\n\nPlease check cell ( " + (cell.getRowIndex() + 1) + " , " + String.valueOf((char) (cell.getColumnIndex() + 65)) + " )");
            case Cell.CELL_TYPE_FORMULA:
                throw new TransactionRecordException("FORMULA cell not supported.\n\nPlease check cell ( " + (cell.getRowIndex() + 1) + " , " + String.valueOf((char) (cell.getColumnIndex() + 65)) + " )");
            default:
                return "";//leave    
            }
    }

    protected abstract void scanSheet(Sheet sheet) throws TransactionRecordException;

    private void checkFormat(Sheet sheet) throws TransactionRecordException {

        scanSheet(sheet);

        if (!isValid()) {
            throw new TransactionRecordException(reasonInvalid());
        }

        Row row;
        Cell cell;
        //int row_index = -1;

        int field_len = columnCountIncludeEmptyInBetween();

        checkBalanceBroughtForward(sheet, field_len);

        int record_len = last_entry_row_index - data_row_start_index + 1;
        int actual_len = columnCountIngoreEmpty();
        tranData = new String[record_len][actual_len];
        int rowStart = sheet.getFirstRowNum();
        int rowEnd = sheet.getLastRowNum();

        trancodes = new String[record_len];

        int record_index = -1;
        int c_index = -1;
        for (int row_index = this.data_row_start_index; row_index < this.last_entry_row_index + 1; row_index++) {
           
            checkProgresChange(row_index, (int) (rowEnd * 2),  rowEnd * 3);
            
            record_index++;
            c_index = -1;
            Row r = sheet.getRow(row_index);

            if (r == null)//COME BACK
            {
                continue;//COME BACK
            }
            boolean found_entry = false;

            for (int cell_index = 0; cell_index < field_len; cell_index++) {

                cell = r.getCell(cell_index, Row.RETURN_NULL_AND_BLANK);

                String validated_value = checkCellVaulue(cell, row_index, cell_index, true);
                if (validated_value != null) {
                    c_index++;
                    found_entry = true;
                    tranData[record_index][c_index] = validated_value;
                } else {
                    //System.out.println("skipped");
                }
            }

            if (!found_entry) {
                throw new TransactionRecordException("Not allowed! no entry found.\n\nPlease check row ( " + (row_index + 1) + " )");
            }
        }
        
        checkProgresChange(100, 0,  100);//complete
    }

    protected void checkProgresChange(int num, double from_len, double to_len) {
        if(listener==null)
            return;
        
        double len = to_len - from_len;
        
        if (len == 0) {
            len = 1;
        }
        int plen = (int) ((num / len) * 100.0);
        if (plen > progressLen) {
            progressLen = plen;
            this.listener.onImportProgressChange(progressLen);
        }
    }

    public void setImportListener(ImportListener listener){
        this.listener = listener;
    }
    
    protected abstract String checkCellVaulue(Cell cell, int row_index, int cell_index, boolean is_normal_record) throws TransactionRecordException;

    protected abstract double computeBalance() throws TransactionRecordException;

    protected String strCellDate(Date date, int row_index, int cell_index) throws TransactionRecordException {
        if (date == null) {
            throw new TransactionRecordException("Invalid date format - unsupported date format. Value was null.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
        }
        SimpleDateFormat date_time_format = new SimpleDateFormat(Util.getDateFormat());
        return date_time_format.format(date);
    }

    protected String checkNumeric(String cell_value, String column, int row_index, int cell_index) throws TransactionRecordException {
        if (cell_value.isEmpty()) {
            return "0";
        }
        try {
            Double.valueOf(cell_value);
        } catch (Exception ex) {
            for (int i = 0; i < cell_value.length(); i++) {
                if (cell_value.charAt(i) != ' ')//if not space character
                {
                    throw new TransactionRecordException(column + " is not numeric.\n\nPlease check cell ( " + (row_index + 1) + " , " + String.valueOf((char) (cell_index + 65)) + " )");
                }
            }

            cell_value = "";
        }

        return cell_value;
    }

    protected void checkBalanceBroughtForward(Sheet sheet, int field_len) throws TransactionRecordException {

        int c_index = -1;
        Row r = sheet.getRow(data_row_start_index);
        boolean found_entry = false;
        String[] balfwdRow = new String[field_len];

        for (int cell_index = 0; cell_index < field_len; cell_index++) {

            Cell cell = r.getCell(cell_index, Row.RETURN_NULL_AND_BLANK);

            String validated_value = checkCellVaulue(cell, data_row_start_index, cell_index, false);
            if (validated_value != null) {
                c_index++;
                balfwdRow[c_index] = validated_value;
                found_entry = true;
            } else {
                //System.out.println("skipped cell " + cell_index);
            }
        }

        if (!found_entry) {
            throw new TransactionRecordException("Not allowed! no entry found.\n\nPlease check row ( " + (data_row_start_index + 1) + " )");
        }

        if (isBalanceBroughtForwardRow(balfwdRow)) {
            hasBalanceBrougtForwardRow = true;
            bal_bf_remarks = balfwdRow[getPredefinedStackIndex(REMARKS)];
            try {
                balance_bf = (float) Double.parseDouble(balfwdRow[getPredefinedStackIndex(CRNT_BALANCE)]);
            } catch (Exception ex) {
                throw new TransactionRecordException(userColumnName(getPredefinedStackIndex(CRNT_BALANCE)) + " not numeric.\n\nPlease check row ( " + (data_row_start_index + 1) + " )");
            }
            data_row_start_index++;//increase to the next row
        } else {

            try {
                first_debit = Double.valueOf(balfwdRow[getPredefinedStackIndex(DEBIT)]);
            } catch (Exception ex) {
                throw new TransactionRecordException(userColumnName(getPredefinedStackIndex(DEBIT)) + " not numeric.\n\nPlease check row ( " + (data_row_start_index + 1) + " )");
            }

            try {
                first_credit = Double.valueOf(balfwdRow[getPredefinedStackIndex(CREDIT)]);
            } catch (Exception ex) {
                throw new TransactionRecordException(userColumnName(getPredefinedStackIndex(CREDIT)) + " not numeric.\n\nPlease check row ( " + (data_row_start_index + 1) + " )");
            }

            try {
                first_balance = Double.valueOf(balfwdRow[getPredefinedStackIndex(CRNT_BALANCE)]);
            } catch (Exception ex) {
                throw new TransactionRecordException(userColumnName(getPredefinedStackIndex(CRNT_BALANCE)) + " not numeric.\n\nPlease check row ( " + (data_row_start_index + 1) + " )");
            }

            if (first_debit > 0 && first_credit > 0) {
                throw new TransactionRecordException("Both '" + userColumnName(getPredefinedStackIndex(DEBIT)) + "' and '" + userColumnName(getPredefinedStackIndex(CREDIT)) + "' can not be greater than zero on same transaction.\n\nPlease check row ( " + (data_row_start_index + 1) + " )");
            }

        }

    }

    protected boolean isBalanceBroughtForwardRow(String[] balfwdRow) throws TransactionRecordException {

        //at this point the first row is complete
        double credit = Double.valueOf(balfwdRow[getPredefinedStackIndex(CREDIT)]);
        double debit = Double.valueOf(balfwdRow[getPredefinedStackIndex(DEBIT)]);
        String remarks = balfwdRow[getPredefinedStackIndex(REMARKS)];
        double balance = Double.valueOf(balfwdRow[getPredefinedStackIndex(CRNT_BALANCE)]);
        String trancode = balfwdRow[getPredefinedStackIndex(TRANCODE)];
        String trandate = balfwdRow[getPredefinedStackIndex(TRANDATE)];

        String user_remark_col = userColumnName(getPredefinedStackIndex(REMARKS));
        String user_trancode_col = userColumnName(getPredefinedStackIndex(TRANCODE));
        String user_trandate_col = userColumnName(getPredefinedStackIndex(TRANDATE));

        if (credit == 0 && debit == 0) {
            if (balance > 0) {
                //here it is likely the first row is balance bf.
                remarks = normalizeCol(remarks);
                if (!remarks.equals("BALANCE BROUGHT FORWARD")
                        && !remarks.equals("BALANCE BF")
                        && !remarks.equals("BALANCE B/F")
                        && !remarks.equals("BALANCE B\\F")
                        && !remarks.equals("BALANCE B/FORWARD")
                        && !remarks.equals("BALANCE B/FWD")
                        && !remarks.equals("BALANCE B\\FORWARD")
                        && !remarks.equals("BALANCE B\\FWD")
                        && !remarks.equals("BALANCE BFWD")
                        && !remarks.equals("BALANCE BROUGHT DOWN")
                        && !remarks.equals("BALANCE BD")
                        && !remarks.equals("BALANCE B/D")
                        && !remarks.equals("BALANCE BD")
                        && !remarks.equals("BALANCE B\\D")
                        && !remarks.equals("BAL BROUGHT FORWARD")
                        && !remarks.equals("BAL BF")
                        && !remarks.equals("BAL B/F")
                        && !remarks.equals("BAL B\\F")
                        && !remarks.equals("BAL B/FORWARD")
                        && !remarks.equals("BAL B/FORWARD")
                        && !remarks.equals("BAL B\\FORWARD")
                        && !remarks.equals("BAL B\\FWD")
                        && !remarks.equals("BAL BFWD")
                        && !remarks.equals("BAL B/FWD")
                        && !remarks.equals("BAL FWD")
                        && !remarks.equals("BAL BROUGHT DOWN")
                        && !remarks.equals("BAL BD")
                        && !remarks.equals("BAL B/D")
                        && !remarks.equals("BAL BD")
                        && !remarks.equals("BAL B\\D")
                        && !remarks.equals("BROUGHT FORWARD")
                        && !remarks.equals("BF")
                        && !remarks.equals("B/F")
                        && !remarks.equals("B\\F")
                        && !remarks.equals("B/FORWARD")
                        && !remarks.equals("B/FORWARD")
                        && !remarks.equals("B\\FORWARD")
                        && !remarks.equals("B\\FWD")
                        && !remarks.equals("BFWD")
                        && !remarks.equals("B/FWD")
                        && !remarks.equals("FWD")
                        && !remarks.equals("BROUGHT DOWN")
                        && !remarks.equals("BD")
                        && !remarks.equals("B/D")
                        && !remarks.equals("BD")
                        && !remarks.equals("B\\D")) {

                    throw new TransactionRecordException("Confusing transaction record - "
                            + "first record appears to be balance brought forward "
                            + "but \"" + user_remark_col + "\" column does not indicate so.\n\nPlease check cell ( " + (data_row_start_index + 1) + " , " + String.valueOf((char) (getCellIndex(REMARKS) + 65)) + " )");
                }

                if (!trancode.isEmpty()) {
                    throw new TransactionRecordException("Confusing transaction record - "
                            + "first record appears to be balance brought forward "
                            + "but \"" + user_trancode_col + "\" column is not empty.\n\nPlease check cell ( " + (data_row_start_index + 1) + " , " + String.valueOf((char) (getCellIndex(TRANCODE) + 65)) + " )");
                }

                if (!trandate.isEmpty()) {
                    throw new TransactionRecordException("Confusing transaction record - "
                            + "first record appears to be balance brought forward "
                            + "but \"" + user_trandate_col + "\" column is not empty.\n\nPlease check cell ( " + (data_row_start_index + 1) + " , " + String.valueOf((char) (getCellIndex(TRANDATE) + 65)) + " )");
                }

                return true;
            }
        }

        return false;
    }
}

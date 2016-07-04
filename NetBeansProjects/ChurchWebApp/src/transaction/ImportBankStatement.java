/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package transaction;

import chuks.server.HttpFileObject;
import chuks.server.HttpServerException;
import chuks.server.JDBCSettings;
import chuks.server.Request;
import chuks.server.ServerObject;
import chuks.server.WebApplication;
import chuks.server.api.json.JSONObject;
import chuks.server.http.sql.SQLResultSetHandler;
import excel.BankStatement;
import exception.TransactionRecordException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.util.Calendar;
import java.util.logging.Level;
import java.util.logging.Logger;
import response.ResponseUtil;
import util.Util;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ImportBankStatement implements WebApplication {

    private JDBCSettings ds_settings;

    @Override
    public WebApplication initialize(ServerObject so) throws Exception {
        return new ImportBankStatement();
    }

    @Override
    public void callOnce(ServerObject so) {
        ds_settings = new JDBCSettings("jdbc:mysql://localhost:3306/churchapp_redeem", "churchapp", "churchapppass", null);
    }

    @Override
    public boolean startSession() {
        return false;
    }

    @Override
    public void onRequest(Request r, ServerObject so) {
        String username = r.postField("import-bank-statement-username");
        String bank = r.postField("import-bank-statement-bank");
        if (username == null || username.isEmpty()) {
            ResponseUtil.sendErrorJSON(so, "No username!");
            return;
        }
        if (bank == null || bank.isEmpty()) {
            ResponseUtil.sendErrorJSON(so, "No bank provided!");
            return;
        }

        String str_auto_compute_bal = r.postField("import-bank-statement-auto-compute-balance");
        if (!str_auto_compute_bal.equalsIgnoreCase("true")
                && !str_auto_compute_bal.equalsIgnoreCase("false")) {
            ResponseUtil.sendErrorJSON(so, "Invalid request- auto compute balance must be boolean!");
            return;
        }

        boolean auto_compute_bal = Boolean.parseBoolean(str_auto_compute_bal);

        HttpFileObject file = r.postFile("import-bank-statement-file");
        BankStatement bankStatement = new BankStatement();
        bankStatement.autoCorrectBalanceComputation(auto_compute_bal);
        try {
            bankStatement.processRecords(file.getContentInputStream(), file.getFileExtension());
            storeBankStatment(so, username, bank, bankStatement);
            //TODO Send success json
        } catch (TransactionRecordException ex) {
            ResponseUtil.sendErrorJSON(so, ex.getMessage());
        } catch (ParseException | IOException ex) {
            ResponseUtil.sendErrorJSON(so, "Please try again later!");
        }
    }

    @Override
    public void onFinish(ServerObject so) {

    }

    @Override
    public void onError(ServerObject so, HttpServerException ex) {

    }

    private void storeBankStatment(ServerObject so, String username, String bank, BankStatement bankStatement) throws TransactionRecordException, ParseException {
        try {
            //NOTE: import will automatically overwrite existing bank statement of same
            //statement period, and account details
            String begin_date = bankStatement.getStatementPeriodFromDate("yyyy-MM-dd");
            String end_date = bankStatement.getStatementPeriodFromDate("yyyy-MM-dd");
            if (!validateStatementPeriod(so, begin_date, end_date)) {
                return;
            }

            int month = Util.getIntMonth(begin_date) + 1; // add 1 to convert to mysql month which is not zero base unlike java.
            int year = Util.getYear(begin_date);

            double bf = bankStatement.getBalanceBroughtForward();
            String bf_remarks = bankStatement.getBalanceBFwdRemark();
            String cols = Util.toCommaSeperated(bankStatement.userColumnHeaders());
            String account_name = bankStatement.getCustomerName();
            String account_no = bankStatement.getCustomerNumber();

            so.sqlTransactionBegin();

            //First, attempt to delete existing bank statement to avoid duplicate.
            //A duplicate is one imported by same user that has same
            //statement period and bank details (bank name, account name 
            //and account number)
            so.sqlUpudate(ds_settings, "DELETE FROM bankstatement_info"
                    + " WHERE "
                    + " MONTH=?"
                    + " AND YEAR=?"
                    + " AND YEAR=?"
                    + " AND BANK_NAME=?"
                    + " AND ACCOUNT_NAME=?"
                    + " AND ACCOUNT_NO=?"
                    + " AND ENTRY_USER_ID=?",
                    String.valueOf(month), String.valueOf(year),
                    bank, account_name, account_no, username);

            so.sqlInsert(ds_settings, "INSERT INTO"
                    + " bank_statement_info "
                    + " ( BANK_NAME, ACCOUNT_NO,"
                    + " ACCOUNT_NAME, BAL_BF, BAL_BF_REMARKS,"
                    + " SOURCE_COLUMNS, MONTH, YEAR,"
                    + " ENTRY_USER_ID, ENTRY_DATETIME ) "
                    + " VALUES(?,?,?,?,?,?,?,?,?,NOW())",
                    new SQLResultSetHandler() {
                        @Override
                        public Object handle(ResultSet rs) throws SQLException {
                            return null;
                        }
                    }, bank, account_no, account_name, String.valueOf(bf),
                    bf_remarks, cols, String.valueOf(month),
                    String.valueOf(year), username);

            //get the last insert id
            String last_insert_id = (String) so.sqlQuery(ds_settings, "SELECT LAST_INSERT_ID()",
                    new SQLResultSetHandler() {
                        @Override
                        public Object handle(ResultSet rs) throws SQLException {
                            return rs.getInt(1);
                        }
                    }, (String) null);

            String data[][] = bankStatement.getTransactionData();

            for (String[] row : data) {
                so.sqlInsert(ds_settings, "INSERT INTO"
                        + " bank_statement_records "
                        + " ( TRANDATE, TRANCODE,"
                        + " REMARKS, DEBIT, CREDIT, BALANCE,"
                        + " RECORD_SN ) "
                        + " VALUES(?,?,?,?,?,?,?)",
                        new SQLResultSetHandler() {
                            @Override
                            public Object handle(ResultSet rs) throws SQLException {
                                return null;
                            }
                        }, row[0], row[1], row[2], row[3], row[4],row[5], last_insert_id);
            }
            so.sqlCommit();

        } catch (SQLException ex) {

            try {
                //Logger.getLogger(ImportBankStatement.class.getName()).log(Level.SEVERE, null, ex);
                so.sqlRollback();
            } catch (SQLException ex1) {
                //Logger.getLogger(ImportBankStatement.class.getName()).log(Level.SEVERE, null, ex1);
            }
            ResponseUtil.sendErrorJSON(so, "Please try again later!");
        }
    }

    private boolean validateStatementPeriod(ServerObject so, String begin_date, String end_date) {
        //ResponseUtil.sendErrorJSON(so, "Not allowed! Statement period must be a period of one month.");
        //
        String[] b_parts = begin_date.split("-");
        if (Integer.parseInt(b_parts[2]) != 1) {
            ResponseUtil.sendErrorJSON(so, "Not allowed! Statement period must start from begin of a month to the end of same month.");
            return false;
        }

        String[] e_parts = end_date.split("-");
        if (Integer.parseInt(e_parts[1]) != Integer.parseInt(b_parts[1])) {
            ResponseUtil.sendErrorJSON(so, "Not allowed! Statement period must be of same month.");
            return false;
        }

        if (Integer.parseInt(e_parts[0]) != Integer.parseInt(b_parts[0])) {
            ResponseUtil.sendErrorJSON(so, "Not allowed! Statement period must be of same year.");
            return false;
        }

        int range = Integer.parseInt(e_parts[2]) - Integer.parseInt(b_parts[2]);

        int feb = 28;
        int year = Integer.parseInt(e_parts[0]);
        if (year % 4 == 0) {
            feb = 29;//leap year
        }

        int month = Integer.parseInt(e_parts[1]);
        switch (month) {
            case 1://Jan
                return range == 31;
            case 2://Feb
                return range == feb;
            case 3://Mar
                return range == 31;
            case 4://Apr
                return range == 30;
            case 5://May
                return range == 31;
            case 6://Jun
                return range == 30;
            case 7://Jul
                return range == 31;
            case 8://Aug
                return range == 31;
            case 9://Sep
                return range == 30;
            case 10://Oct
                return range == 31;
            case 11://Nov
                return range == 30;
            case 12://Dec
                return range == 31;
        }

        return false;
    }

}

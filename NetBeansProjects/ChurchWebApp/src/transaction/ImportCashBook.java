/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package transaction;

import chuks.server.HttpFileObject;
import chuks.server.HttpServerException;
import chuks.server.Request;
import chuks.server.ServerObject;
import chuks.server.WebApplication;
import excel.BankStatement;
import excel.CashBook;
import exception.TransactionRecordException;
import java.io.IOException;
import response.ResponseUtil;
import util.Util;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ImportCashBook implements WebApplication {

    @Override
    public WebApplication initialize(ServerObject so) throws Exception {
        return new ImportCashBook();
    }

    @Override
    public void callOnce(ServerObject so) {

    }

    @Override
    public boolean startSession() {
        return false;
    }

    @Override
    public void onRequest(Request r, ServerObject so) {
        String username = r.postField("import-cash-book-username");
        if (username == null || username.isEmpty()) {
            ResponseUtil.sendErrorJSON(so, "No username!");
            return;
        }
        String bank = r.postField("import-cash-book-bank");
        String account_name = r.postField("import-cash-book-account-name");
        String account_no = r.postField("import-cash-book-account-no");

        HttpFileObject file = r.postFile("import-cash-boo-file");
        CashBook cashBook = new CashBook();
        try {
            cashBook.processRecords(file.getContentInputStream(), file.getFileExtension());
            String[] result = storeCashBook(so, username, cashBook);
            //TODO Send success json
        } catch (TransactionRecordException ex) {
            ResponseUtil.sendErrorJSON(so, ex.getMessage());
        } catch (IOException ex) {
            ResponseUtil.sendErrorJSON(so, "Please try again later!");
        }

    }

    @Override
    public void onFinish(ServerObject so) {

    }

    @Override
    public void onError(ServerObject so, HttpServerException ex) {

    }

    private String[] storeCashBook(ServerObject so, String username, CashBook cashBook) {

        //REMIND!!! indicate in the database table that it is imported by specifying IMPORT !
        //REMIND!!! also specify the identifier of the import - use hash
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

}

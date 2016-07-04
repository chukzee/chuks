/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

/**
 *
 * @author chuks
 */
public interface TracerConstants {
    
    //READ!!! THE TWO LINES BELOW ARE VERY IMPORTANT - READ THE ASSOCIATED COMMENTS
    //char CELL_DELIMITER = 5;//DO NOT CHANGE THIS VALUE - IT IS BEING USED BY EXTERNAL APPLICATION e.g WinnerPack.jar and statement_trace table of the winnersdb database   
    //char ROW_DELIMITER =  6;//DO NOT CHANGE THIS VALUE - IT IS BEING USED BY EXTERNAL APPLICATION e.g WinnerPack.jar and statement_trace table of the winnersdb database   
    
    char CELL_DELIMITER = '|';//FOR TESTING
    char ROW_DELIMITER =  '\n';//FOR TESTING   
    
    int CODE_BASE_STATEMENT = 1;
    int DEFUALT_STATEMENT = 2;    

    int CODE_BASE_CASH_BOOK = 3;
    int DEFUALT_CASH_BOOK = 4; 
    
    String Could_not_proccess_bank_statement_from = "Could not proccess bank statement from ";
    String Mail_exception = "Mail exception";
    
    String CUSTOMER_NAME = "CUSTOMER NAME";
    String CUSTOMER_NUMBER = "CUSTOMER NUMBER";
    String STATEMENT_FOR_PERIOD_BETWEEN = "STATEMENT FOR PERIOD BETWEEN";
    String ORIGINATION = "ORIGINATION";
    String TRANDATE = "TRANDATE";
    String TRANCODE = "TRANCODE";
    String REMARKS = "REMARKS";
    String TRA_SEQ1 = "TRA_SEQ1";   
    String TRA_SEQ2 = "TRA_SEQ2";   
    String VALUE_DATE = "VALUE DATE";   
    String DEBIT = "DEBIT";   
    String CREDIT = "CREDIT"; 
    String CRNT_BALANCE = "CRNT BALANCE"; 
    
    String SN = "S/N";
    String NO = "NO";
    String DATE = "DATE";
    String REFER = "REFER";
    String DETAIL = "DETAIL";
    String TYPE_OF_TRANSACTION = "TYPE OF TRANSACTION";   
    String BALANCE = "BALANCE";     
    
}

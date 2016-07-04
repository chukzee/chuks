/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package exception;

/**
 *
 * @author chuks
 */
public class BankStatementException extends TransactionRecordException{
    
    public BankStatementException(String str){
        super(str);
    }   
}

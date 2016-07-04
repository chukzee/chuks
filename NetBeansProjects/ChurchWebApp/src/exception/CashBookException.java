/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package exception;

/**
 *
 * @author chuks
 */
public class CashBookException extends TransactionRecordException{
    
    public CashBookException(String str){
        super(str);
    }   
}

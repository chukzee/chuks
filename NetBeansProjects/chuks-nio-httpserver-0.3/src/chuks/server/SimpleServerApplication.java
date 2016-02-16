/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

/**
 *
 * @author USER
 * @param <T>
 */
public interface SimpleServerApplication <T>{
    
    /**This is the first method called upon any request.It is 
     * the begining of the life cycle of this class<br/>
     * This method is called as an efficient means of getting
     * a new instance of the class rather than using reflection 
     * which is very expensive.<br/> the method is expected
     * to return the correct object of the class type otherwise
     * the method will throw an exception.<br/>
     * the correct object is one that is a new instance
     * and of the class that implemented this interface.
     * 
     * @param so
     * @return 
     * @throws java.lang.Exception 
     */
    T initialize(ServerObject so) throws Exception;

    boolean startSession();

    void onRequest(Request r, ServerObject so);
    
    /**This is the last method called signifying the end of the life cycle of the class
     * 
     * @param so
     * @param nameVaulue 
     */
    void onFinish(ServerObject so);
    
    /**This method is called when there is an error in executing this class
     * 
     * @param so
     * @param nameVaulue 
     */
    void onError(ServerObject so, SimpleHttpServerException ex);
}

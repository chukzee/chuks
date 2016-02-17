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
    
    /**This method only called once through out the life time of the web app.
     * Once called, it will never be called again upon any request.
     * This method is provide for application that only needs to initialize
     * a process only once.
     * <p>For example {@code ServerObject.createCacheRegion()} is
     * a good candidate for calling in this method since once the cache region 
     * of the specified name is created is will be highly unnecessary to call
     * it again for the entire life of the app thus saving your application from
     * unnecessary object creation.
     * 
     * @param so 
     */        
    void callOnce(ServerObject so);

    boolean startSession();

    void onRequest(Request r, ServerObject so);
    
    /**This is the last method called signifying the end of the life cycle of the class
     * 
     * @param so 
     */
    void onFinish(ServerObject so);
    
    /**This method is called when there is an error in executing this class
     * 
     * @param so 
     * @param ex 
     */
    void onError(ServerObject so, SimpleHttpServerException ex);
}

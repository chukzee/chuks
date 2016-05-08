/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

/**
 *
 * @author USER
 */
public interface WebApplication{
    
    /**This is the first method called upon any request.It is 
     * the beginning of the life cycle of this class<br/>
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
    WebApplication initialize(ServerObject so) throws Exception;
    
    /**This method is only called once through out the life time of the web app.
     * Once called, it will never be called again upon any request.
     * This method is provide for application that only needs to initialize
     * a process only once.
     * <p>For example {@code ServerObject.createCacheRegion()} is
     * a good candidate for calling in this method since once the cache region 
     * of the specified name is created it will be highly unnecessary to call
     * it again for the entire life of the app thus saving your application from
     * unnecessary objects creation.
     * 
     * @param so 
     */        
    void callOnce(ServerObject so);

    /**Use this method to start a session.
     * 
     * @return 
     */
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
    void onError(ServerObject so, HttpServerException ex);
}

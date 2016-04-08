/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.view;

import chuks.server.Request;
import chuks.server.ServerObject;
import chuks.server.SimpleHttpServerException;
import chuks.server.WebApplication;

/**
 *
 * @author USER
 */
public class UpdateView implements WebApplication{

    @Override
    public WebApplication initialize(ServerObject so) throws Exception {
        return new UpdateView();
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
        
    }

    @Override
    public void onFinish(ServerObject so) {
    }

    @Override
    public void onError(ServerObject so, SimpleHttpServerException ex) {
    }
    
}

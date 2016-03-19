/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

/**
 *
 * @author USER
 */
public abstract class Spectator extends UserInfo{
     
    Session current_session;
    Session last_session;
    public void joinSession(Session session){
        session.addSpectator(this);
        this.current_session = session;
    }
  
    public void leaveSession(Session session){
        session.removeSpectator(this);
        last_session = session;
        current_session = null;
    }    
    
    public Session getSpectatorCurrentSession(){
        return current_session;
    }
}

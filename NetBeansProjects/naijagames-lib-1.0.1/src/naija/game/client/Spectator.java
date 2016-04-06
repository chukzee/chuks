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
public abstract class Spectator extends User{
     
    GameSession current_session;
    GameSession last_session;
    public void joinSession(GameSession session){
        session.addSpectator(this);
        this.current_session = session;
    }
  
    public void leaveSession(GameSession session){
        session.removeSpectator(this);
        last_session = session;
        current_session = null;
    }    
    
    public GameSession getSpectatorCurrentSession(){
        return current_session;
    }
}

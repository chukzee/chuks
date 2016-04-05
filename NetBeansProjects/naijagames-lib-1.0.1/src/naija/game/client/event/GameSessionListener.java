/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;


/**
 *
 * @author USER
 */
public interface GameSessionListener {
    
    void onStartGameSession(GameSessionEvent event);
    void onEndGameSession(GameSessionEvent event);
    void onResumeGameSession(GameSessionEvent event);
    void onSpectatorJoinSession(GameSessionEvent event);
    void onSpectatorLeaveSession(GameSessionEvent event);
}

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

    
    /**
     * Fires when a game starts 
     * @param event 
     */
    void onSessionGameStarts(GameSessionEvent event);

    /**
     * Fires when a game ends 
     * @param event 
     */
    void onSessionGameEnds(GameSessionEvent event);

    /**
     * Fires when a previously pause game resumes
     * @param event 
     */
    void onSessionGameResume(GameSessionEvent event);

    /**
     * Fires when a game event occurs e.g player moves, penalty e.t.c
     * @param event 
     */
    void onSessionGameUpdate(GameSessionEvent event);

    /**
     * Fires when a spectator joins a game session to watch game
     * @param event 
     */
    void onSessionSpecatorJoin(GameSessionEvent event);

    /**
     * Fires when a spectator leaves a game session 
     * @param event 
     */
    void onSessionSpectatorLeave(GameSessionEvent event);
}

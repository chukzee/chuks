/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Date;

/**
 *
 * @author USER
 */
public interface Session {
    
    int getSessionID();
    Date getSessionStartTime();
    Date getSessionEndTime();
    void addSpectator(Spectator spectator);
    void removeSpectator(Spectator spectator);
    Spectator[] getSpectators();
    Player[] getPlayers();
    int playersCount();
    int spectatorsCount();
    Score getScore();
    String TimeControl();
}

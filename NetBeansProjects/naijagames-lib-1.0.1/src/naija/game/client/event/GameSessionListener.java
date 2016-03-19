/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

import naija.game.client.ChatMessage;
import naija.game.client.CommentMessage;
import naija.game.client.Session;
import naija.game.client.Spectator;

/**
 *
 * @author USER
 */
public interface GameSessionListener {
    
    void onGameStart(Session session);
    void onGameEnd(Session session);
    void onGameResume(Session session);
    void onSpectatorJoinSession(Spectator spectator);
    void onSpectatorLeaveSession(Spectator spectator);
}

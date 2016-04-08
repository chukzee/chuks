/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Observer;

/**
 *
 * @author USER
 */
public class GameSessionImpl implements GameSession {

    protected List<Spectator> spectators = Collections.synchronizedList(new LinkedList<Spectator>());
    protected String session_id;
    protected Date session_start_time;
    protected Date session_end_time;
    protected String game_name;
    protected Score score;
    protected Player[] players;
    protected String time_control;
    protected String game_position;
    protected int game_variant;

    @Override
    public void addSpectator(Spectator spectator) {
        spectators.add(spectator);
        //fire spectator added goes below

    }

    @Override
    public void removeSpectator(Spectator spectator) {
        spectators.remove(spectator);
        //fire spectator remove goes below

    }

    @Override
    public Spectator[] getSpectators() {
        return this.spectators.toArray(new Spectator[spectators.size()]);
    }

    @Override
    public String getSessionID() {
        return this.session_id;
    }

    @Override
    public int spectatorsCount() {
        return this.spectators.size();
    }

    @Override
    public Date getSessionStartTime() {
        return session_start_time;
    }

    @Override
    public Date getSessionEndTime() {
        return session_end_time;
    }

    @Override
    public Score getScore() {
        return score;
    }

    @Override
    public int playersCount() {
        return players.length;
    }

    @Override
    public Player[] getPlayers() {
        return players;
    }

    @Override
    public Player getPlayer(int player_index) {
        return players[player_index];
    }

    @Override
    public String TimeControl() {
        return time_control;
    }

    @Override
    public String getGameName() {
        return game_name;
    }

    @Override
    public String getGamePosition() {
        return game_position;
    }

    @Override
    public int getGameVariant() {
        return game_variant;
    }

    @Override
    public boolean isLocalSession() {
        return false;
    }
    
}

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

    List<Spectator> spectators = Collections.synchronizedList(new LinkedList<Spectator>());
    private String session_id;
    private Date session_start_time;
    private Date session_end_time;
    private GameName game_name;
    private Score score;
    private Player[] players;
    private String time_control;
    private String game_position;
    private int game_variant;

    private GameSessionImpl() {

    }

    public GameSessionImpl(String session_id, Date session_start_time,
            Date session_end_time, GameName game_name,
            Score score, Player[] players,
            String time_control, String game_position, int game_variant) {
        
        this.session_id = session_id;
        this.session_start_time = session_start_time;
        this.session_end_time = session_end_time;
        this.game_name = game_name;
        this.score = score;
        this.players = players;
        this.time_control = time_control;
        this.game_position = game_position;
        this.game_variant = game_variant;
    }

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
    public GameName getGameName() {
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

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 *
 * @author USER
 */
public class GameSession implements Session {

    List<Spectator> spectators = Collections.synchronizedList(new ArrayList<Spectator>());
    private int room_id;
    private Date session_start_time;
    private Date session_end_time;
    private Game game;

    private GameSession() {

    }

    public GameSession(Game game, int session_id, Date session_start_time, Date session_end_time) {
        this.game = game;
        this.room_id = session_id;
        this.session_start_time = session_start_time;
        this.session_end_time = session_end_time;
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
    public int getSessionID() {
        return this.room_id;
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
        return game.getScore();
    }

    @Override
    public int playersCount() {
        return game.getPlayers().length;
    }

    @Override
    public Player[] getPlayers() {
        return game.getPlayers();
    }

    @Override
    public String TimeControl() {
        return game.getTimeControl();
    }

}

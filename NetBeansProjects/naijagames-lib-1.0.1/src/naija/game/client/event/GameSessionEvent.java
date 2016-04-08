/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

import naija.game.client.Player;
import naija.game.client.Score;

/**
 *
 * @author USER
 */
public class GameSessionEvent {

    protected String session_id;
    protected String gameName;
    protected Player[] players;
    protected Player winner;
    protected Player player_who_moved;
    protected Score score;
    protected int specatorsCount;
    protected int playersCount;
    protected String[] newSpecatorsJoin;
    protected String[] specatorsLeaves;
    protected long gameStartTime;
    protected long gameEndTime;
    protected boolean isGameEnd;
    protected String moveNotation;
    protected String currentGamePosition;

    public String getSessionID() {
        return session_id;
    }

    public String getGameName() {
        return gameName;
    }

    public Player[] getPlayers() {
        return players;
    }

    public Score getScore() {
        return score;
    }

    public int getSpecatorsCount() {
        return specatorsCount;
    }

    public int getPlayersCount() {
        return playersCount;
    }

    public String[] getNewSpecatorsJoin() {
        return newSpecatorsJoin;
    }

    public String[] getSpecatorsLeave() {
        return specatorsLeaves;
    }

    public long getGameStartTime() {
        return gameStartTime;
    }

    public long getGameEndTime() {
        return gameEndTime;
    }

    public boolean isGameEnd() {
        return isGameEnd;
    }
    
    public String currentGamePosition(){
        return currentGamePosition;
    }
    
    public String geMoveNotation(){
        return moveNotation;
    }

    public Player getPlayerWhoMoved() {
        return player_who_moved;
    }
    
}

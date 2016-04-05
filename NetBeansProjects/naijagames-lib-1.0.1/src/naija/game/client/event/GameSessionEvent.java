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

    private int session_id;
    private String gameName;
    private Player[] players;
    private Player winner;
    private Score score;
    private int specatorsCount;
    private int playersCount;
    private String[] newSpecatorsJoin;
    private String[] specatorsJoinLeaves;
    private long gameStartTime;
    private long gameEndTime;
    private boolean isGameEnd;

    public GameSessionEvent(int session_id, String gameName, Player[] players,
            Player winner, Score score, int specatorsCount, int playersCount,
            String[] newSpecatorsJoin, String[] specatorsJoinLeaves,
            long gameStartTime, long gameEndTime, boolean isGameEnd) {
        
        this.session_id = session_id;
        this.gameName = gameName;
        this.players = players;
        this.winner = winner;
        this.score = score;
        this.specatorsCount = specatorsCount;
        this.playersCount = playersCount;
        this.newSpecatorsJoin = newSpecatorsJoin;
        this.specatorsJoinLeaves = specatorsJoinLeaves;
        this.gameStartTime = gameStartTime;
        this.gameEndTime = gameEndTime;
        this.isGameEnd = isGameEnd;
    }

    public int getSessionID() {
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

    public String[] getSpecatorsJoinLeaves() {
        return specatorsJoinLeaves;
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
}

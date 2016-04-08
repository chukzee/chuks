/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.info;

import chuks.server.Distributed;
import java.io.Serializable;
import naija.game.Move;

/**
 *
 * @author USER
 */
public class GameInfo  implements Distributed{
    private String gameId;
    private String whitePlayer;//for board game like chess and draft
    private String blackPlayer;//for board game like chess and draft
    private String[] players;//for games such as scrabble, ludo
    private String score;
    private long timeBegin;
    private long timeEnd;
    private String winner;
    private String game_name;

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getWhitePlayer() {
        return whitePlayer;
    }

    /**for board games like chess and draft
     * 
     * @param whitePlayer
     * @param blackPlayer 
     */
    public void setPlayers(String whitePlayer, String blackPlayer) {
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
    }

    /**for games such as scrabble, ludo
     * 
     * @param players
     */
    public void setPlayers(String... players) {
        this.players = players;
    }
    
    public void setWhitePlayer(String whitePlayer) {
        this.whitePlayer = whitePlayer;
    }

    public String getBlackPlayer() {
        return blackPlayer;
    }

    public void setBlackPlayer(String blackPlayer) {
        this.blackPlayer = blackPlayer;
    }

    public String[] getPlayers() {
        return players;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public long getTimeBegin() {
        return timeBegin;
    }

    public void setTimeBegin(long timeBegin) {
        this.timeBegin = timeBegin;
    }

    public long getTimeEnd() {
        return timeEnd;
    }

    public void setTimeEnd(long timeEnd) {
        this.timeEnd = timeEnd;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public void setGameName(String game_name) {
        this.game_name = game_name;
    }
    
    public String getGameName() {
        return game_name;
    }

    @Override
    public void distributedCall(Object obj) {
        if(obj instanceof Move){
            //update thd game info score using this move object
            Move move = (Move) obj;
            
        }
    }
 
}

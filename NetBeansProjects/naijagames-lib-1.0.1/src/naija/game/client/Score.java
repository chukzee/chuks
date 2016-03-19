/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

/**
 *
 * @author USER
 */
public class Score {
    private float whiteScore;
    private float blackScore;

    public Score(float whiteScore, float blackScore) {
        this.whiteScore = whiteScore;
        this.blackScore = blackScore;
    }

    public float getWhiteScore() {
        return whiteScore;
    }

    public void setWhiteScore(float whiteScore) {
        this.whiteScore = whiteScore;
    }

    public float getBlackScore() {
        return blackScore;
    }

    public void setBlackScore(float blackScore) {
        this.blackScore = blackScore;
    }
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.activity;

import naija.game.IGameComment;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class GameComment extends Comment implements IGameComment{
    private String gameId;

    @Override
    public void setGameID(String gameId) {
        this.gameId = gameId;
    }

    @Override
    public String getGameID() {
        return gameId;
    }
    
    
}

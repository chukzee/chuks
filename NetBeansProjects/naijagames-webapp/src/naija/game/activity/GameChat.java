/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.activity;

import naija.game.IGameChat;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class GameChat extends Chat implements IGameChat{
    private String game_id;

    @Override
    public void setGameID(String game_id) {
        this.game_id = game_id;
    }

    @Override
    public String getGameID() {
        return game_id;
    }

}

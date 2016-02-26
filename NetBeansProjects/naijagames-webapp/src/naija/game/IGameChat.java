/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface IGameChat extends IChat {

    void setGameID(String game_id);

    String getGameID();
}

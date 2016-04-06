/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;


/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface Player{
    
    public User getInfo();
    public boolean isHuman();
    public boolean isRobot();
    public boolean isRemotePlayer();
    public boolean isLocalPlayer();

    public boolean sameAs(User user);
}

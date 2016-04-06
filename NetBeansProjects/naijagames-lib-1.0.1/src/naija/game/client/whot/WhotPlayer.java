/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.whot;


import naija.game.client.AbstractCardPlayer;
import naija.game.client.CardName;
import naija.game.client.Robot;
import naija.game.client.Player;
import naija.game.client.LocalUser;
import naija.game.client.RemoteUser;
import naija.game.client.User;
import naija.game.client.Side;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class WhotPlayer extends AbstractCardPlayer<WhotMove> {

    private LocalUser local_user;
    private RemoteUser remote_user;
    private Robot robot;
    private int side;
    boolean is_game_over;
    private WhotMove move_to_send;

    public WhotPlayer(LocalUser local_user) {
        super(local_user);
    }

    public WhotPlayer(RemoteUser remote_user) {
        super(remote_user);
    }

    public WhotPlayer(Robot robot) {
        super(robot);
    }

    @Override
    public void robotMove(WhotMove move) {

    }

    @Override
    public void remoteMove(WhotMove move) {

    }

    @Override
    public void localMove(CardName name) {

    }

    private boolean checkGameOver(WhotMove move, int next_turn) {

        return false;
    }

    private void setOpponentMove(WhotMove move) {
        this.move_to_send = move;
    }

}

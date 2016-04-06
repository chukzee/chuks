/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.solitaire;

import naija.game.client.AbstractCardPlayer;
import naija.game.client.AbstractPlayer;
import naija.game.client.CardName;
import naija.game.client.PieceName;
import naija.game.client.chess.*;
import naija.game.client.Robot;
import naija.game.client.Player;
import naija.game.client.LocalUser;
import naija.game.client.RemoteUser;
import naija.game.client.User;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class SolitairePlayer extends AbstractCardPlayer<SolitaireMove> {

    private LocalUser local_user;
    private RemoteUser remote_user;
    private Robot robot;
    private int side;
    boolean is_game_over;
    private SolitaireMove move_to_send;

    public SolitairePlayer(LocalUser local_user) {
        super(local_user);
    }

    public SolitairePlayer(RemoteUser remote_user) {
        super(remote_user);
    }

    public SolitairePlayer(Robot robot) {
        super(robot);
    }

    @Override
    public void robotMove(SolitaireMove move) {

    }

    @Override
    public void remoteMove(SolitaireMove move) {

    }

    @Override
    public void localMove(CardName name) {

    }

    private boolean checkGameOver(SolitaireMove move, int next_turn) {

        return false;
    }

    private void setOpponentMove(SolitaireMove move) {
        this.move_to_send = move;
    }

}

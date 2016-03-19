/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.scrabble;

import naija.game.client.Robot;
import naija.game.client.Player;
import naija.game.client.LocalUser;
import naija.game.client.RemoteUser;
import naija.game.client.UserInfo;
import naija.game.client.Side;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ScrabblePlayer implements Player {

    private LocalUser local_user;
    private RemoteUser remote_user;
    private Robot robot;
    private int side;
    boolean is_game_over;
    private Move move_to_send;

    private ScrabblePlayer() {
    }

    ScrabblePlayer(LocalUser user) {
        this.local_user = user;
    }

    ScrabblePlayer(RemoteUser user) {
        this.remote_user = user;
    }

    ScrabblePlayer(Robot robot) {
        this.robot = robot;
    }

    @Override
    public UserInfo getInfo() {
        if (local_user != null) {
            return local_user.getInfo();
        }

        if (remote_user != null) {
            return remote_user.getInfo();
        }

        return null;
    }

    public boolean isHuman() {
        return robot == null;
    }

    public boolean isRobot() {
        return robot != null;
    }

    void robotMove(Move move) {

    }

    public void remoteMove(Move move) {

    }

    public void localMove(int from_square, int to_square) {

    }

    private boolean checkGameOver(BoardAnalyzer analyzer, Move move, int next_turn) {

        return false;
    }

    @Override
    public boolean isRemotePlayer() {
        return remote_user != null;
    }

    @Override
    public boolean isLocalPlayer() {
        return local_user != null;
    }

    private void setOpponentMove(Move move) {
        this.move_to_send = move;
    }

}

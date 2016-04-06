/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.scrabble;

import naija.game.client.AbstractBoardPlayer;
import naija.game.client.Robot;
import naija.game.client.Player;
import naija.game.client.LocalUser;
import naija.game.client.PieceName;
import naija.game.client.RemoteUser;
import naija.game.client.User;
import naija.game.client.Side;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ScrabblePlayer extends AbstractBoardPlayer<ScrabbleMove> {

    private LocalUser local_user;
    private RemoteUser remote_user;
    private Robot robot;
    private int side;
    boolean is_game_over;
    private ScrabbleMove move_to_send;

    public ScrabblePlayer(LocalUser local_user) {
        super(local_user);
    }

    public ScrabblePlayer(RemoteUser remote_user) {
        super(remote_user);
    }

    public ScrabblePlayer(Robot robot) {
        super(robot);
    }

    @Override
    public void robotMove(ScrabbleMove move) {

    }

    @Override
    public void remoteMove(ScrabbleMove move) {

    }

    @Override
    public void localMove(PieceName name, int from_square, int to_square) {

    }

    private boolean checkGameOver(BoardAnalyzer analyzer, ScrabbleMove move, int next_turn) {

        return false;
    }

    private void setOpponentMove(ScrabbleMove move) {
        this.move_to_send = move;
    }

}

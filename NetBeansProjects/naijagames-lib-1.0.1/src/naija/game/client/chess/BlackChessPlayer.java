/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess;

import naija.game.client.LocalUser;
import naija.game.client.Player;
import naija.game.client.RemoteUser;
import naija.game.client.Robot;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class BlackChessPlayer extends ChessPlayer {

    public BlackChessPlayer(LocalUser user) {
        super(user, false);
    }

    public BlackChessPlayer(RemoteUser user) {
        super(user, false);
    }

    public BlackChessPlayer(Robot robot) {
        super(robot, false);
    }

}

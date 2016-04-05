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
public class WhiteChessPlayer extends ChessPlayer {

    public WhiteChessPlayer(LocalUser user) {
        super(user, true);
    }

    public WhiteChessPlayer(RemoteUser user) {
        super(user, true);
    }

    public WhiteChessPlayer(Robot robot) {
        super(robot, true);
    }

}

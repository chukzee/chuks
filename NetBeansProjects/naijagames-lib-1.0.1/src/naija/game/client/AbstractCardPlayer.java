/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import naija.game.client.chess.board.BoardAnalyzer;
import naija.game.client.chess.ChessMove;


/**
 *
 * @author USER
 */
abstract public class AbstractCardPlayer <T extends CardMove> extends AbstractPlayer {

    public AbstractCardPlayer(LocalUser local_user) {
        super(local_user);
    }

    public AbstractCardPlayer(RemoteUser remote_user) {
        super(remote_user);
    }

    public AbstractCardPlayer(Robot robot) {
        super(robot);
    }

    public abstract  void  robotMove(T move);

    public abstract void remoteMove(T move);

    public abstract void localMove(CardName name);
}

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
abstract public class AbstractBoardPlayer <T extends BoardMove> extends AbstractPlayer {

    public AbstractBoardPlayer(LocalUser local_user) {
        super(local_user);
    }

    public AbstractBoardPlayer(RemoteUser remote_user) {
        super(remote_user);
    }

    public AbstractBoardPlayer(Robot robot) {
        super(robot);
    }

    protected abstract  void  robotMove(T move);

    protected abstract void remoteMove(T move);

    protected abstract void localMove(PieceName name, int from_square, int to_square);

}

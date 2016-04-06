/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import naija.game.client.chess.board.Board;

/**
 *
 * @author USER
 */
public interface RobotEngine<T extends GameBase> {

    public void nextReply(T gameBase);

    public boolean isGameOver();
    
}

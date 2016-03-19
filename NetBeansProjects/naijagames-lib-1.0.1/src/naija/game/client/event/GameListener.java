/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

import naija.game.client.GamePosition;
import naija.game.client.Player;

/**
 *
 * @author USER
 */
public interface GameListener <T extends GamePosition, V extends GameEvent>{

    
    /**Fires when a game begins or resumes
     * 
     * @param game_position 
     */
    public void initializeGamePosition(T game_position, Player... players);

    /**
     * Fires when a robot (computer) makes valid move
     *
     * @param event
     */
    public void onRobotMove(V event);

    /**
     * Fires when a remote player makes valid move
     *
     * @param event
     */
    public void onRemotePlayerMove(V event);

    /**
     * Fires when a local player makes valid move
     *
     * @param event
     */
    public void onLocalPlayerMove(V event);

    /**
     * Fires immediately after a valid move by either a local player, remote
     * player or robot. This method fires just after either onRobotMove,
     * onRemotePlayerMove or onLocalPlayerMove method is fired
     *
     *
     * @param event
     */
    public void onNextTurn(V event);

    /**
     * Fires when the game is over
     *
     * @param event
     */
    public void onGameOver(V event);

    /**
     * Fires when a move is invalid
     *
     * @param event
     */
    public void onInvalidMove(V event);

    /**
     * Fires when an error occurs
     *
     * @param event
     */
    public void onError(V event);

    /**
     * Fires when a player makes a move not at his turn
     *
     * @param event
     */
    public void onInvalidTurn(V event);
    
}

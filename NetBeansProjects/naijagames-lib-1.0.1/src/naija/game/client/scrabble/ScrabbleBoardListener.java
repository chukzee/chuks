/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.scrabble;

import naija.game.client.Player;
import naija.game.client.event.GameListener;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ScrabbleBoardListener   extends GameListener<ScrabbleBoardPosition, ScrabbleBoardEvent>{
    
    /**Fires when a game begins or resumes
     * 
     * @param board_position 
     */
    @Override
    public void initializeGamePosition(ScrabbleBoardPosition board_position, Player... players);

    /**
     * Fires when a robot (computer) makes valid move
     *
     * @param event
     */
    @Override
    public void onRobotMove(ScrabbleBoardEvent event);

    /**
     * Fires when a remote player makes valid move
     *
     * @param event
     */
    @Override
    public void onRemotePlayerMove(ScrabbleBoardEvent event);

    /**
     * Fires when a local player makes valid move
     *
     * @param event
     */
    @Override
    public void onLocalPlayerMove(ScrabbleBoardEvent event);

    /**
     * Fires immediately after a valid move by either a local player, remote
     * player or robot. This method fires just after either onRobotMove,
     * onRemotePlayerMove or onLocalPlayerMove method is fired
     *
     *
     * @param event
     */
    @Override
    public void onNextTurn(ScrabbleBoardEvent event);

    /**
     * Fires when the game is over
     *
     * @param event
     */
    @Override
    public void onGameOver(ScrabbleBoardEvent event);

    /**
     * Fires when a move is invalid
     *
     * @param event
     */
    @Override
    public void onInvalidMove(ScrabbleBoardEvent event);

    /**
     * Fires when an error occurs
     *
     * @param event
     */
    @Override
    public void onError(ScrabbleBoardEvent event);

    /**
     * Fires when a player makes a move not at his turn
     *
     * @param event
     */
    @Override
    public void onInvalidTurn(ScrabbleBoardEvent event);
 
}

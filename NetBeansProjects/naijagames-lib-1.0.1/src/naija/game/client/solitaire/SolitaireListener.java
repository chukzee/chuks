/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.solitaire;

import naija.game.client.GamePosition;
import naija.game.client.Player;
import naija.game.client.event.GameEvent;
import naija.game.client.event.GameListener;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface SolitaireListener extends GameListener<SolitaireGamePosition, SolitaireEvent>{
    
    /**Fires when a game begins or resumes
     * 
     * @param game_position 
     */
    @Override
    public void initializeGamePosition(SolitaireGamePosition game_position, Player... players);

    /**
     * Fires when a robot (computer) makes valid move
     *
     * @param event
     */
    @Override
    public void onRobotMove(SolitaireEvent event);

    /**
     * Fires when a remote player makes valid move
     *
     * @param event
     */
    @Override
    public void onRemotePlayerMove(SolitaireEvent event);

    /**
     * Fires when a local player makes valid move
     *
     * @param event
     */
    @Override
    public void onLocalPlayerMove(SolitaireEvent event);

    /**
     * Fires immediately after a valid move by either a local player, remote
     * player or robot. This method fires just after either onRobotMove,
     * onRemotePlayerMove or onLocalPlayerMove method is fired
     *
     *
     * @param event
     */
    @Override
    public void onNextTurn(SolitaireEvent event);

    /**
     * Fires when the game is over
     *
     * @param event
     */
    @Override
    public void onGameOver(SolitaireEvent event);

    /**
     * Fires when a move is invalid
     *
     * @param event
     */
    @Override
    public void onInvalidMove(SolitaireEvent event);

    /**
     * Fires when an error occurs
     *
     * @param event
     */
    @Override
    public void onError(SolitaireEvent event);

    /**
     * Fires when a player makes a move not at his turn
     *
     * @param event
     */
    @Override
    public void onInvalidTurn(SolitaireEvent event);
 
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.chess;

import naija.game.client.event.GameListener;
import naija.game.client.Player;
import naija.game.client.chess.board.ChessBoardPosition;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ChessBoardListener extends GameListener <ChessBoardPosition, ChessBoardEvent>{

     /**Fires when a game begins or resumes
     * 
     * @param board_position 
     */
    @Override
    public void initializeGamePosition(ChessBoardPosition board_position, Player... players);

    /**
     * Fires when a robot (computer) makes valid move
     *
     * @param event
     */
    @Override
    public void onRobotMove(ChessBoardEvent event);

    /**
     * Fires when a remote player makes valid move
     *
     * @param event
     */
    @Override
    public void onRemotePlayerMove(ChessBoardEvent event);

    /**
     * Fires when a local player makes valid move
     *
     * @param event
     */
    @Override
    public void onLocalPlayerMove(ChessBoardEvent event);

    /**
     * Fires immediately after a valid move by either a local player, remote
     * player or robot. This method fires just after either onRobotMove,
     * onRemotePlayerMove or onLocalPlayerMove method is fired
     *
     *
     * @param event
     */
    @Override
    public void onNextTurn(ChessBoardEvent event);

    /**
     * Fires when the game is over
     *
     * @param event
     */
    @Override
    public void onGameOver(ChessBoardEvent event);

    /**
     * Fires when a move is invalid
     *
     * @param event
     */
    @Override
    public void onInvalidMove(ChessBoardEvent event);

    /**
     * Fires when an error occurs
     *
     * @param event
     */
    @Override
    public void onError(ChessBoardEvent event);

    /**
     * Fires when a player makes a move not at his turn
     *
     * @param event
     */
    @Override
    public void onInvalidTurn(ChessBoardEvent event);

    /**
     * Fires when a local player begins a short castle move
     * by moving king two squares toward the king side
     *
     * @param event
     */
    public void onShortCastleBeginByKing(ChessBoardEvent event);

    /**
     * Fires when a local player completes a short castle move
     * by moving rook just after the king square
     *
     * @param event
     */    
    public void onShortCastleEndByRook(ChessBoardEvent event);

    /**
     * Fires when a local player begins a long castle move
     * by moving king two squares toward the queen side
     *
     * @param event
     */
    public void onLongCastleBeginByKing(ChessBoardEvent event);

    /**
     * Fires when a local player completes a long castle move
     * by moving rook just after the king square
     *
     * @param event
     */        
    public void onLongCastleEndByRook(ChessBoardEvent event);
    
}

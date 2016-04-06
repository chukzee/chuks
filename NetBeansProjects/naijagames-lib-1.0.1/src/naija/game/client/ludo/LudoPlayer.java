/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.ludo;

import naija.game.client.AbstractBoardPlayer;
import naija.game.client.PieceName;
import naija.game.client.Robot;
import naija.game.client.LocalUser;
import naija.game.client.RemoteUser;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class LudoPlayer extends AbstractBoardPlayer<LudoMove> {

    private LocalUser local_user;
    private RemoteUser remote_user;
    private Robot robot;
    private int side;
    boolean is_game_over;
    private LudoMove move_to_send;

    public LudoPlayer(LocalUser local_user) {
        super(local_user);
    }

    public LudoPlayer(RemoteUser remote_user) {
        super(remote_user);
    }

    public LudoPlayer(Robot robot) {
        super(robot);
    }
    
    @Override
    public void robotMove(LudoMove move) {

    }

    @Override
    public void remoteMove(LudoMove move) {
        
    }

    @Override
    public void localMove(PieceName name, int from_square, int to_square) {

    }

    private boolean checkGameOver(LudoBoardAnalyzer analyzer, LudoMove move, int next_turn) {

        return false;
    }


    private void setOpponentMove(LudoMove move) {
        this.move_to_send = move;
    }

}

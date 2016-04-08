/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.draft;

import naija.game.client.PieceName;
import naija.game.client.AbstractBoardPlayer;
import naija.game.client.BoardMove;
import naija.game.client.chess.*;
import naija.game.client.Robot;
import naija.game.client.Player;
import naija.game.client.LocalUser;
import naija.game.client.RemoteUser;
import naija.game.client.User;
import naija.game.client.Side;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class DraftPlayer extends AbstractBoardPlayer<DraftMove> {

    private boolean is_white;
    private int side;
    boolean is_game_over;
    private DraftMove move_to_send;
    
    public DraftPlayer(LocalUser user, boolean is_white) {
        super(user);
        this.is_white = is_white;
        side = is_white ? Side.white : Side.black;
        
    }

    public DraftPlayer(RemoteUser user, boolean is_white) {
        super(user);
        this.is_white = is_white;
        side = is_white ? Side.white : Side.black;
        
    }

    public DraftPlayer(Robot robot, boolean is_white) {
        super(robot);
        this.is_white = is_white;
        
    }

    public boolean isWhite() {
        return this.is_white;
    }

    @Override
    public void robotMove(DraftMove move) {

    }

    @Override
    public void remoteMove(DraftMove move) {

    }

    @Override
    public void localMove(PieceName name, int from_square, int to_square) {

    }

    private boolean checkGameOver(DraftBoardAnalyzer analyzer, DraftMove move, int next_turn) {

        return false;
    }

}

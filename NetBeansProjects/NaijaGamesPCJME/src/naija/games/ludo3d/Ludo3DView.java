/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.ludo3d;

import com.jme3.app.SimpleApplication;
import com.jme3.renderer.Camera;
import naija.game.client.BoardEvent;
import naija.game.client.BoardPosition;
import naija.game.client.Player;
import naija.game.client.ludo.LudoBoardEvent;
import naija.game.client.ludo.LudoBoardListener;
import naija.games.View3D;

/**
 *
 * @author USER
 */
public class Ludo3DView  extends View3D implements LudoBoardListener {

    private Ludo3DView() {
        super(null, null);
    }

    @Override
    protected void createView(SimpleApplication app) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    protected float getGameViewBoundSize() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void initializeBoardPosition(BoardPosition board_position, Player... players) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRobotMove(BoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRemotePlayerMove(BoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onLocalPlayerMove(BoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onNextTurn(BoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onGameOver(BoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidMove(BoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onError(BoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidTurn(BoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.draft3d;

import com.jme3.app.SimpleApplication;
import com.jme3.renderer.Camera;
import com.jme3.scene.Node;
import naija.game.client.event.GameEvent;
import naija.game.client.GamePosition;
import naija.game.client.Player;
import naija.game.client.draft.DraftBoardEvent;
import naija.game.client.draft.DraftBoardListener;
import naija.game.client.draft.DraftBoardPosition;
import naija.games.View3D;


/**
 *
 * @author USER
 */
public class Draft3DView extends View3D implements DraftBoardListener {

    private Draft3DView() {
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

    public void initializeGamePosition(DraftBoardPosition board_position, Player... players) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRobotMove(DraftBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRemotePlayerMove(DraftBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onLocalPlayerMove(DraftBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onNextTurn(DraftBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onGameOver(DraftBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidMove(DraftBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onError(DraftBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidTurn(DraftBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}

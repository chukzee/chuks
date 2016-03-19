/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.solitaire3d;

import com.jme3.app.SimpleApplication;
import com.jme3.renderer.Camera;
import naija.game.client.event.GameEvent;
import naija.game.client.GamePosition;
import naija.game.client.Player;
import naija.game.client.solitaire.SolitaireEvent;
import naija.game.client.solitaire.SolitaireGamePosition;
import naija.game.client.solitaire.SolitaireListener;
import naija.games.View3D;

/**
 *
 * @author USER
 */
public class Solitaire3DView   extends View3D implements SolitaireListener {

    private Solitaire3DView(){
        super(null,null);
    }
    
    @Override
    protected void createView(SimpleApplication app) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    protected float getGameViewBoundSize() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void initializeGamePosition(SolitaireGamePosition game_position, Player... players) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRobotMove(SolitaireEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRemotePlayerMove(SolitaireEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onLocalPlayerMove(SolitaireEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onNextTurn(SolitaireEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onGameOver(SolitaireEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidMove(SolitaireEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onError(SolitaireEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidTurn(SolitaireEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}

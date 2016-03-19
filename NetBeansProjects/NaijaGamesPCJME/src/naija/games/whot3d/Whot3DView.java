/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.whot3d;

import com.jme3.app.SimpleApplication;
import com.jme3.renderer.Camera;
import naija.game.client.event.GameEvent;
import naija.game.client.GamePosition;
import naija.game.client.Player;
import naija.game.client.whot.WhotEvent;
import naija.game.client.whot.WhotGamePosition;
import naija.game.client.whot.WhotListener;
import naija.games.View3D;

/**
 *
 * @author USER
 */
public class Whot3DView extends View3D implements WhotListener{

    
    private Whot3DView(){
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

    public void initializeGamePosition(WhotGamePosition game_position, Player... players) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRobotMove(WhotEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRemotePlayerMove(WhotEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onLocalPlayerMove(WhotEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onNextTurn(WhotEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onGameOver(WhotEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidMove(WhotEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onError(WhotEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidTurn(WhotEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    
}

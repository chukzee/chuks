/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.scrabble3d;

import com.jme3.app.SimpleApplication;
import naija.game.client.Player;
import naija.game.client.scrabble.ScrabbleBoardEvent;
import naija.game.client.scrabble.ScrabbleBoardListener;
import naija.game.client.scrabble.ScrabbleBoardPosition;
import naija.games.Game3DView;
import naija.games.View3D;

/**
 *
 * @author USER
 */
public class Scrabble3DView   extends View3D implements Game3DView, ScrabbleBoardListener {

    private Scrabble3DView() {
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

    public void initializeGamePosition(ScrabbleBoardPosition board_position, Player... players) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRobotMove(ScrabbleBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onRemotePlayerMove(ScrabbleBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onLocalPlayerMove(ScrabbleBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onNextTurn(ScrabbleBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onGameOver(ScrabbleBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidMove(ScrabbleBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onError(ScrabbleBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void onInvalidTurn(ScrabbleBoardEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.scrabble3d;

import naija.game.client.AbstractGameClientFactory;
import naija.game.client.Game;
import naija.game.client.GameName;
import naija.game.client.GameSession;
import naija.game.client.IConnection;
import naija.game.client.Player;
import naija.game.client.Score;
import naija.game.client.event.GameSessionEvent;
import naija.game.client.scrabble.ScrabbleGameClientFactory;
import naija.games.AbstractGameMain;
import naija.games.Game3DView;

/**
 *
 * @author USER
 */
public class ScrabbleMain extends AbstractGameMain {

    public static void main(String args[]) {
        ScrabbleMain scrabbleMain = new ScrabbleMain();

    }

    @Override
    public AbstractGameClientFactory getGameClientFactory(IConnection conn) {
        return new ScrabbleGameClientFactory(conn);
    }

    @Override
    public Game buildGame(GameSession gameSession, Game3DView gameView) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public Game3DView buildGameView(GameSession gameSession) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public GameName getGameName() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public Player geDefaultLocalPlayer() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public Player getDefaultRobotPlayer() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String getDefaultTimeControl() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public Score getDefaultScore() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String getDefaultGamePosition() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public int getDefaultGameVariant() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void updateGamePosition(GameSessionEvent event) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}

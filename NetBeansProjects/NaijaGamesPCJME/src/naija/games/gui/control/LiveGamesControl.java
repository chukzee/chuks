/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.control;

import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.screen.Screen;
import naija.game.client.event.GameSessionEvent;
import naija.game.client.event.GameSessionListener;

/**
 *
 * @author USER
 */
public class LiveGamesControl implements GameSessionListener{
    private static LiveGamesControl liveGamesControl;
    final private static Object lock = new Object();
    private Nifty nifty;
    private Screen screen;
    private Element parent;

    private LiveGamesControl(){
        
    }
    
    public static LiveGamesControl getInstance(Nifty nifty, Screen screen, Element parent) {
        
        synchronized (lock) {
            liveGamesControl.nifty = nifty;
            liveGamesControl.screen = screen;
            liveGamesControl.parent = parent;

            if (liveGamesControl == null) {
                liveGamesControl = new LiveGamesControl();
            }
        }
        return liveGamesControl;
    }

    @Override
    public void onSessionGameStarts(GameSessionEvent event) {
    }

    @Override
    public void onSessionGameEnds(GameSessionEvent event) {
    }

    @Override
    public void onSessionGameResume(GameSessionEvent event) {
    }

    @Override
    public void onSessionGameUpdate(GameSessionEvent event) {
    }

    @Override
    public void onSessionSpectatorJoin(GameSessionEvent event) {
    }

    @Override
    public void onSessionSpectatorLeave(GameSessionEvent event) {
    }    
}

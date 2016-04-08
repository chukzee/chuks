/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.control;

import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.screen.Screen;
import naija.game.client.event.TournamentEvent;
import naija.game.client.event.TournamentListener;

/**
 *
 * @author USER
 */
public class TournamentsControl implements TournamentListener{
    private static TournamentsControl tournamentsControl;
    final private static Object lock = new Object();
    private Nifty nifty;
    private Screen screen;
    private Element parent;

    
    private TournamentsControl(){
        
    }

    public static TournamentsControl getInstance(Nifty nifty, Screen screen, Element parent){
        
        synchronized (lock) {
            tournamentsControl.nifty = nifty;
            tournamentsControl.screen = screen;
            tournamentsControl.parent = parent;

            if (tournamentsControl == null) {
                tournamentsControl = new TournamentsControl();
            }
        }
        return tournamentsControl;
    }
    
    public void onTournamentCreated(TournamentEvent event) {
    }

    public void onTournamentBegins(TournamentEvent event) {
    }

    public void onTournamentEnds(TournamentEvent event) {
    }

    public void onTournamentFirstGameStarts(TournamentEvent event) {
    }

    public void onTournamentFirstGameEnds(TournamentEvent event) {
    }

    public void onTournamentNextRound(TournamentEvent event) {
        
    }

    public void onTournamentFinalBegins(TournamentEvent event) {
    }

    public void onTournamentFinalEnds(TournamentEvent event) {
    }
    
}

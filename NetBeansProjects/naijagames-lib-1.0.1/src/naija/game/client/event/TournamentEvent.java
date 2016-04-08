/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

/**
 *
 * @author USER
 */
public class TournamentEvent {
    
   protected boolean tournamentCreated;
   protected boolean tournamentBegins;
   protected boolean tournamentEnds;
   protected boolean tournamentNextRound;
   protected boolean tournamentFirstGameStarts;
   protected boolean tournamentFirstGameEnds;
   protected boolean tournamentFinalBegins;
   protected boolean tournamentFinalEnds;

    public TournamentEvent() {
    }

    public boolean isTournamentCreated() {
        return tournamentCreated;
    }

    protected TournamentEvent setTournamentCreated(boolean tournamentCreated) {
        this.tournamentCreated = tournamentCreated;
        return this;
    }

    public boolean isTournamentBegins() {
        return tournamentBegins;
    }

    protected TournamentEvent setTournamentBegins(boolean tournamentBegins) {
        this.tournamentBegins = tournamentBegins;
        return this;
    }

    public boolean isTournamentEnds() {
        return tournamentEnds;
    }

    protected TournamentEvent setTournamentEnds(boolean tournamentEnds) {
        this.tournamentEnds = tournamentEnds;
        return this;
    }

    public boolean isTournamentNextRound() {
        return tournamentNextRound;
    }

    protected TournamentEvent setTournamentNextRound(boolean tournamentNextRound) {
        this.tournamentNextRound = tournamentNextRound;
        return this;
    }

    public boolean isTournamentFirstGameStarts() {
        return tournamentFirstGameStarts;
    }

    protected TournamentEvent setTournamentFirstGameStarts(boolean tournamentFirstGameStarts) {
        this.tournamentFirstGameStarts = tournamentFirstGameStarts;
        return this;
    }

    public boolean isTournamentFirstGameEnds() {
        return tournamentFirstGameEnds;
    }

    protected TournamentEvent setTournamentFirstGameEnds(boolean tournamentFirstGameEnds) {
        this.tournamentFirstGameEnds = tournamentFirstGameEnds;
        return this;
    }

    public boolean isTournamentFinalBegins() {
        return tournamentFinalBegins;
    }

    protected TournamentEvent setTournamentFinalBegins(boolean tournamentFinalBegins) {
        this.tournamentFinalBegins = tournamentFinalBegins;
        return this;
    }

    public boolean isTournamentFinalEnds() {
        return tournamentFinalEnds;
    }

    protected TournamentEvent setTournamentFinalEnds(boolean tournamentFinalEnds) {
        this.tournamentFinalEnds = tournamentFinalEnds;
        return this;
    }
   
}

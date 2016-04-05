/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

/**
 *
 * @author USER
 */
public interface TournamentListener {

    /**
     * Fires when a new tournament is successfully created.
     *
     * @param event
     */
    void onTournamentCreated(TournamentEvent event);

    /**
     * Fires when the tournament start. ie before the first match is played.
     *
     * @param event
     */
    void onTournamentBegins(TournamentEvent event);

    /**
     * Fires when the tournament ends. ie after the final match and presentation
     * ceremony is over
     *
     * @param event
     */
    void onTournamentEnds(TournamentEvent event);

    /**
     * Fires when a game in the tournament starts
     *
     * @param event
     */
    void onTournamentGameStart(TournamentEvent event);

    /**
     * Fires when a game in the tournament ends
     *
     * @param event
     */
    void onTournamentGameEnd(TournamentEvent event);

    /**
     * Fires when the next round of a tournament begin. The next round second,
     * third, fourth,... quarter-final, semi-final
     *
     * @param event
     */
    void onTournamentNextRound(TournamentEvent event);

    /**
     *Fires when the final match of the tournament starts.
     * @param event
     */
    void onTournamentFinalBegins(TournamentEvent event);

    /**
     *Fires when the final match of the tournament ends.
     * @param event
     */
    void onTournamentFinalEnds(TournamentEvent event);
}

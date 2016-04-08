/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.next;

/**
 * The {@link naija.game.next.UserPair} is used for pairing up players for the
 * next game. It provides methods that help in synchronizing the pairing
 * process.
 *
 * @author USER
 */
public class UserPair {

    private String username = "";
    private boolean isPlayingGame;
    private String Game;
    private long time_engaged;
    /**
     * Control the time for engagement for next game
     */
    static private final long EXPIRY_MINUTE = 3;//minutes
    /**
     * Set the egagement time control in milliseconds
     */
    private final long MAX_ENGAGE_EXPIRY = EXPIRY_MINUTE * 60 * 1000; //minute  - expires after the give minutes
    private final Object lock = new Object();
    private boolean engaged_for_next_game;
    private String engaged_mate_username;
    private String game;

    /**
     * Use this method to engage a user for the next game. If succesfully
     * engaged it returns true otherwise false. This method helps in
     * synchronizing the egaging of two players for a game.
     *
     * @param engager
     * @param game
     * @return
     */
    boolean engageUserForNextGame(UserPair engager, String game) {
        if (this.engaged_mate_username != null && this.engaged_mate_username.equals(engager.getUsername())) {
            return false;
        }
        if (username.equals(engager.username)) {
            return false;//abnormal case - cannot engage to yourself
        }
        synchronized (lock) {

            if (isPlayingGame) {
                return false;
            }
            long elapse = System.currentTimeMillis() - time_engaged;
            if (elapse > MAX_ENGAGE_EXPIRY) {
                //here the egagement for next game has expired.
                engaged_for_next_game = false;//set to false - force the exipry!
            }
            if (engaged_for_next_game) {
                return false;
            }

            engaged_for_next_game = true;
            //pair up the two user to be egaged for next game
            this.engaged_mate_username = engager.username;
            engager.engaged_mate_username = username;
            time_engaged = System.currentTimeMillis();
            this.game = game;
        }
        return true;
    }

    public String getUsername() {
        return username;
    }

    public String getEngagedMateUsername() {
        return engaged_mate_username;
    }

    /**
     * Set that the user is playing game. If successfully set it return true
     * otherwise false. This method help synchronizes the pairing up of two
     * players for a game after an initial successful engagement.
     *
     * NOTE: this method should be called
     *
     * @param isPlayingGame
     * @return
     */
    public boolean SetAndGetPlayingGame(UserPair other_user, String game) {
        synchronized (lock) {
            //check if any of the  users is playing game
            if (isPlayingGame || other_user.isPlayingGame) {
                return false; //user is already playing game
            }
            //check if the user was initially engaged
            if (!other_user.username.equals(engaged_mate_username)) {
                return false;//oops!!! this other_user was either not engaged to this user or the egagement was expired by another user (ie another user caused the expiry to be effected).
            }

            this.isPlayingGame = true;
            this.game = game;
            return isPlayingGame;
        }
    }

    public String getGame() {
        return Game;
    }

    public long getTimeEngaged() {
        return time_engaged;
    }
}

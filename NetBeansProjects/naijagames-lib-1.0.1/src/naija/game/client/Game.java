/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface Game {

    String getSessionID();

    boolean isRobotVsRobot();

    boolean isHumanVsRobot();

    public Player[] getPlayers();

    public Player getPlayer(int player_index);

    public String getInitialBoardPosition();

    public Score getScore();

    public String getTimeControl();

    public int getAlgorithm();

    /**
     * This method gets the last known move number of the game. The benefit of
     * the method is that it can help to check for missing moves by comparing
     * the move number returned by this method with some other.
     *
     * @return last move number
     */
    public int getNextExpectedMoveNumber();
    
    public void destroy();
}

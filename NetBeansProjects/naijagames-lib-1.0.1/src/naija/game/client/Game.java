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

    boolean isRobotVsRobot();

    boolean isHumanVsRobot();

    public Player[] getPlayers();

    public String getInitialBoardPosition();

    public Score getScore();

    public String getTimeControl();

    public int getAlgorithm();
    
}

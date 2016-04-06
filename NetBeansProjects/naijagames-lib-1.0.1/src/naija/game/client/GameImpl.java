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
public abstract class GameImpl implements Game, Runnable {

    protected GamePosition game_position;
    protected Score score;
    protected String time_control;
    protected int algorithm;
    protected int game_variant;
    protected GameBase gameBase;
    protected RobotEngine robotEngineA;
    protected RobotEngine robotEngineB;
    protected boolean isRobotVsRobot;
    protected boolean isHumanVsRobot;
    private Thread engineThread;
    protected boolean isStop;
    protected boolean isReady;
    private boolean isRobotWait;
    final private Object lock = new Object();
    protected String session_id;
    private int expected_move_number;

    @Override
    public boolean isRobotVsRobot() {
        return isRobotVsRobot;
    }

    @Override
    public boolean isHumanVsRobot() {
        return isHumanVsRobot;
    }

    @Override
    public abstract Player[] getPlayers();

    @Override
    public abstract Player getPlayer(int player_index);
    
    @Override
    public String getInitialBoardPosition() {
        return game_position.toString();
    }

    @Override
    public Score getScore() {
        return score;
    }

    @Override
    public String getTimeControl() {        
        return time_control;
    }

    @Override
    public int getAlgorithm() {
        return algorithm;
    }

    protected void startEngine() {
        if (engineThread != null) {
            return;//already started
        }
        engineThread = new Thread(this);
        engineThread.start();
    }

    public void setRobotEngineWait(boolean isRobotWait) {
        synchronized (lock) {
            this.isRobotWait = isRobotWait;
        }
    }

    @Override
    public void run() {

        while (!isReady) {
            //wait till the Game object is fully created
        }

        while (!isStop) {
            synchronized (lock) {
                if (isRobotWait) {
                    continue;
                }
                if (!runEngineReply()) {
                    break;
                }
            }

        }
    }

    protected boolean runEngineReply() {
        if (robotEngineA != null) {
            robotEngineA.nextReply(gameBase);
            if (robotEngineA.isGameOver()) {
                return false;
            }
        }

        if (robotEngineB != null) {
            robotEngineB.nextReply(gameBase);
            if (robotEngineB.isGameOver()) {
                return false;
            }
        }

        return true;
    }

    @Override
    public String getSessionID() {
        return session_id;
    }

    protected void setNextExpectedMoveNumber(int expected_move_number){
        this.expected_move_number = expected_move_number;
    }
    
    @Override
    public int getNextExpectedMoveNumber() {
        return expected_move_number;
    }

    @Override
    public void destroy() {
        isReady = true;
        isStop = true;
    }
    
}

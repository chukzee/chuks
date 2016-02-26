/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.info;

import java.io.Serializable;

/**
 *
 * @author USER
 */
public class MatchSchedule  implements Serializable{
   
    private long kickOffTime;
    private GameInfo gameInfo;

    private MatchSchedule(){
    }
    
    public MatchSchedule(long kickOffTime, GameInfo gameInfo){
        this.gameInfo = gameInfo;
        this.kickOffTime = kickOffTime;
    }

    public long getKickOffTime() {
        return kickOffTime;
    }

    public GameInfo getGameInfo() {
        return gameInfo;
    }

}

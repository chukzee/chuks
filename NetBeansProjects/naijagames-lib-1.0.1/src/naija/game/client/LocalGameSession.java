/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Date;

/**
 *
 * @author USER
 */
public class LocalGameSession extends GameSessionImpl{

    public LocalGameSession(String game_name, Player local_player, Player robot_player,String time_control, Score score, String game_position, int game_variant) {
        this.game_name = game_name;
        players = new Player[]{local_player, robot_player};
        this.time_control = time_control;
        this.score = score;
        this.game_position = game_position;
        this.game_variant = game_variant;
    }

    @Override
    public boolean isLocalSession() {
        return true; 
    }
    
    
    
}

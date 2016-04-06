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

    public LocalGameSession(GameName game_name, Player local_player, Player robot_player,String time_control, Score score, String game_position, int game_variant) {
        super(null, new Date(), null, game_name, score, new Player[]{local_player, robot_player}, time_control, game_position, game_variant);
    }

    @Override
    public boolean isLocalSession() {
        return true; 
    }
    
    
    
}

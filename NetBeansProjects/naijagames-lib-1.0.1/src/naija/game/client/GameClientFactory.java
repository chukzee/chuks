/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

/**
 *
 * @author USER
 */
public class GameClientFactory {
    
    public static GameClient createGameClient(AbstractGameClientFactory factory){
        return factory.createGameClient();
    }
}

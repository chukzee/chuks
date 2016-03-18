/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games;

import com.jme3.export.Savable;
import jme3tools.savegame.SaveGame;

/**
 *
 * @author USER
 */
public class GameSave {
 
    
    static void saveGame(String gamePath, String dataName,Savable data){
        SaveGame.saveGame(gamePath, dataName, data);
    }
    
    
    static void loadGame(String gamePath, String dataName){
        SaveGame.loadGame(gamePath, dataName);
    }    
}

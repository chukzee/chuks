/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class CacheKeyUtil {
    
    
    public static  String gameMoveCacheKey(String gameName, String game_id) {
        return gameName +"_move_"+ game_id;
    }
    
    public static  String gameInfoCacheKey(String gameName, String game_id) {
        return gameName +"_info_"+ game_id;
    }


}

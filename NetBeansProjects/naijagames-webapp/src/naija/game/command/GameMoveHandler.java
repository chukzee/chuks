/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.command;

import chuks.server.ServerObject;
import chuks.server.cache.IEntryAttributes;
import chuks.server.cache.config.EntryAttributes;
import java.io.IOException;
import java.sql.PreparedStatement;
import java.util.logging.Level;
import java.util.logging.Logger;
import naija.game.CacheKeyUtil;
import naija.game.Move;
import naija.game.info.GameInfo;
import org.json.JSONObject;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
abstract public class GameMoveHandler {

    final protected void getMove(ServerObject so, String game_name, String game_id, float move_number) {

        //check cache
        String mvkey = CacheKeyUtil.gameMoveCacheKey(game_name, game_id);
        Move move = (Move) so.getCache(mvkey);
        if (move == null) {
            //check database
            move = (Move) getMoveDB(game_id, move_number);
        }
        
        if(move==null){
            return; //sorry move is not found
        }
        JSONObject move_json = new JSONObject(); 
        move_json.put("game_id", game_id);
        move_json.put("game_name", move.getGameName());
        move_json.put("move_notation", move.getMoveNotation());
        move_json.put("move_number", move.getMoveNumber());
        move_json.put("game_over", move.isGameOver());
        so.echo(move_json);
    }

    final protected void storeMove(ServerObject so, String game_id, String player_username, String opponent_username, Move move) {
        try {
            //quickly notify the opponent of this player move
            notifyOpponentMove(opponent_username);

            //add the move to cache
            EntryAttributes e = new EntryAttributes();
            e.setDistributed(true);
            String mvkey = CacheKeyUtil.gameMoveCacheKey(move.getGameName(), game_id);
            so.putRgnCache(mvkey, move, e);

            //update the game info score of this game
            String gInfokey = CacheKeyUtil.gameInfoCacheKey(move.getGameName(), game_id);
            so.dcou(gInfokey, move);

            //creat prepared statement to store the move
            PreparedStatement prd_stmt = storeMoveDBSQL(game_id, player_username, opponent_username, move);

            //asynchronously execute the sql statement
            asyncExecuteSql(prd_stmt);
        } catch (IOException ex) {
            Logger.getLogger(GameMoveHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    abstract protected PreparedStatement storeMoveDBSQL(String game_id, String player_username, String opponent_username, Move move);

    abstract protected PreparedStatement getMoveDB(String game_id, float move_number);

    private void notifyOpponentMove(String opponent_username) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    private void asyncExecuteSql(PreparedStatement prd_stmt) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }

    private void executeSql(PreparedStatement prd_stmt) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
    }
    
}

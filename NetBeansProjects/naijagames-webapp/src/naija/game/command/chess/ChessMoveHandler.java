/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.command.chess;

import chuks.server.Request;
import chuks.server.ServerObject;
import chuks.server.SimpleHttpServerException;
import chuks.server.WebApplication;
import chuks.server.http.impl.Value;
import java.sql.PreparedStatement;
import naija.game.Constants;
import naija.game.Move;
import naija.game.command.GameMoveHandler;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ChessMoveHandler extends GameMoveHandler implements WebApplication {

    @Override
    public WebApplication initialize(ServerObject so) throws Exception {
        return new ChessMoveHandler();
    }

    @Override
    public void callOnce(ServerObject so) {
    }

    @Override
    public boolean startSession() {
        return false;
    }

    @Override
    public void onRequest(Request r, ServerObject so) {
        Value cmd = r.postURL("command");
        if (cmd != null) {
            if ("get_chess_move".equals(cmd.get())) {

                int move_number = Integer.valueOf(r.postURL("move_number").get().toString());
                String game_id = r.postURL("game_id").get().toString();
                
                getMove(so,Constants.chess.name(), game_id, move_number);

            } else if ("store_chess_move".equals(cmd.get())) {

                String game_id = r.postURL("game_id").get().toString();
                int move_number = Integer.parseInt(r.postURL("move_number").get().toString());
                String move_notation = r.postURL("move_notation").get().toString();
                boolean is_game_over = Boolean.parseBoolean(r.postURL("is_game_over").get().toString());
                String player_username = r.postURL("player_username").get().toString();
                String opponent_username = r.postURL("opponent_username").get().toString();
                Move move = new ChessMove(move_notation, move_number, is_game_over);
                
                storeMove(so, game_id, player_username, opponent_username, move);
            }
        }

    }

    @Override
    public void onFinish(ServerObject so) {

    }

    @Override
    public void onError(ServerObject so, SimpleHttpServerException ex) {

    }

    @Override
    protected PreparedStatement storeMoveDBSQL(String game_id, String player_username, String opponent_username, Move move) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

    @Override
    protected PreparedStatement getMoveDB(String game_id, float move_number) {
        System.err.println("REMIND: Auto generated method body is not yet implemented");
        return null;
    }

}

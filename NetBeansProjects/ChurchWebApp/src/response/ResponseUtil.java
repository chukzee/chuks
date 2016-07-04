/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package response;

import chuks.server.ServerObject;
import chuks.server.api.json.JSONObject;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ResponseUtil {

    private static final String status = "status";
    private static final String ms = "msg";
    private static final String data = "data";

    public static void sendSuccesJSON(ServerObject so, String msg, String data) {
        if (msg == null || msg.isEmpty()) {
            msg = "Operation was successful";
        }
        so.echo(new JSONObject()
                .put(status, "success")
                .put(msg, msg)
                .put(data, data));
    }

    public static void sendErrorJSON(ServerObject so, String msg) {
        if (msg == null) {
            msg = "";
        }
        so.echo(new JSONObject()
                .put(status, "error")
                .put(msg, msg)
                .put(data, ""));
    }

    public static void sendIgnoreJSON(ServerObject so, String msg) {
        if (msg == null || msg.isEmpty()) {
            msg = "Operation was ignored";
        }
        so.echo(new JSONObject()
                .put(status, "ignore")
                .put(msg, msg)
                .put(data, ""));
    }

    public static void sendSessionNotAvaliableJSON(ServerObject so, String msg) {
        if (msg == null || msg.isEmpty()) {
            msg = "Your session is no longer available!";
        }
        so.echo(new JSONObject()
                .put(status, "session_not_available")
                .put(msg, msg)
                .put(data, ""));
    }

    public static void sendUnauthorizedOperationJSON(ServerObject so, String msg) {
        if (msg == null || msg.isEmpty()) {
            msg = "Unauthorized operation!";
        }
        so.echo(new JSONObject()
                .put(status, "unauthorized_operation")
                .put(msg, msg)
                .put(data, ""));
    }
}

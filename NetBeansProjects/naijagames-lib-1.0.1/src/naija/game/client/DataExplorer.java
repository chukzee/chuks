/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Date;
import naija.game.client.chess.ChessPlayer;
import naija.game.client.draft.DraftPlayer;
import naija.game.client.event.ChatEvent;
import naija.game.client.event.CommentEvent;
import naija.game.client.event.GameClientEvent;
import naija.game.client.event.GameSessionEvent;
import naija.game.client.event.TournamentEvent;
import naija.game.client.ludo.LudoPlayer;
import naija.game.client.scrabble.ScrabblePlayer;
import naija.game.client.solitaire.SolitairePlayer;
import naija.game.client.whot.WhotPlayer;
import twitter4j.JSONArray;
import twitter4j.JSONException;
import twitter4j.JSONObject;

/**
 *
 * @author USER
 */
class DataExplorer {

    AbstractGameClient gameClient;

    DataExplorer(AbstractGameClient gameClient) {
        this.gameClient = gameClient;
    }

    User setUserInfoFromJSON(User user, JSONObject json) throws JSONException {

        if (json.has("username")) {
            user.setUsername(json.getString("username"));
        }else{
            throw new IllegalStateException("user must have a username");
        }
        
        if (json.has("first_name")) {
            user.setFirstNmae(json.getString("first_name"));
        }else{
            throw new IllegalStateException("user must have first name");
        }
        
        
        if (json.has("sex")) {
            user.setSex(json.getString("sex"));
        }else{
            throw new IllegalStateException("user must have sex");
        }

        

        if (json.has("address")) {
            user.setAddress(json.getString("address"));
        }

        if (json.has("age")) {
            user.setAge(json.getString("age"));
        }

        if (json.has("email")) {
            user.setEmailAddress(json.getString("email"));
        }

        if (json.has("last_name")) {
            user.setLastNmae(json.getString("last_name"));
        }

        if (json.has("middle_name")) {
            user.setMiddleNmae(json.getString("middle_name"));
        }

        if (json.has("nationality")) {
            user.setNationality(json.getString("nationality"));
        }

        if (json.has("password")) {
            user.setPassword(json.getString("password"));
        }

        return user;
    }

    LocalUser handleLocalUserInfo(JSONObject json) throws JSONException {

        LocalUser localUser = new LocalUser();
        localUser = (LocalUser) setUserInfoFromJSON(localUser, json);

        gameClient.evt_dispatcher.fireGameClientUserInfo(new GameClientEvent(gameClient.conn.isConnected(), gameClient.conn.getHost(), gameClient.conn.getPort(), localUser, null));

        return localUser;
    }

    void handleServerAlertMessage(JSONObject json) throws JSONException {
        ServerAlertMessage sMgs = new ServerAlertMessage(json.getString("message_id"),
                json.getString("message"),
                new Date(),
                json.getString("subject_icon_url"),
                json.getInt("message_icon_type"));

        gameClient.evt_dispatcher.fireGameClientServerAlert(new GameClientEvent(gameClient.conn.isConnected(), gameClient.conn.getHost(), gameClient.conn.getPort(), gameClient.localUser, sMgs));
    }

    Player createGamePlayer(String game_name, JSONObject json_details) throws JSONException {

        //create the appropriate user object by checking if it is the local user

        String username = json_details.getString("username");
        User user = null;
        if (gameClient.localUser != null
                && gameClient.localUser.getUsername().equals(username)) {
            user = new LocalUser();
        } else {
            user = new RemoteUser();
        }

        user = setUserInfoFromJSON(user, json_details);

        //now get the player type value
        //If the game is chess or draft the value is true of false which represent white or black
        Object player_type_value = json_details.get("player_type_value");//NOTE: The server must sent this irrespective of the game.

        switch (game_name) {
            case "chess": {
                if (user instanceof RemoteUser) {
                    return new ChessPlayer((RemoteUser) user, (boolean) player_type_value);
                } else {
                    return new ChessPlayer((LocalUser) user, (boolean) player_type_value);
                }
            }
            case "draft": {
                if (user instanceof RemoteUser) {
                    return new DraftPlayer((RemoteUser) user, (boolean) player_type_value);
                } else {
                    return new DraftPlayer((LocalUser) user, (boolean) player_type_value);
                }
            }
            case "ludo": {
                if (user instanceof RemoteUser) {
                    return new LudoPlayer((RemoteUser) user);
                } else {
                    return new LudoPlayer((LocalUser) user);
                }
            }
            case "scrabble": {
                if (user instanceof RemoteUser) {
                    return new ScrabblePlayer((RemoteUser) user);
                } else {
                    return new ScrabblePlayer((LocalUser) user);
                }
            }
            case "solitaire": {
                if (user instanceof RemoteUser) {
                    return new SolitairePlayer((RemoteUser) user);
                } else {
                    return new SolitairePlayer((LocalUser) user);
                }
            }
            case "whot": {
                if (user instanceof RemoteUser) {
                    return new WhotPlayer((RemoteUser) user);
                } else {
                    return new WhotPlayer((LocalUser) user);
                }
            }

        }

        return null;
    }

    Player[] createSessionPlayers(String game_name, JSONArray players_json_arr) throws JSONException {

        Player[] players = new Player[players_json_arr.length()];
        JSONObject[] arr_json_obj = new JSONObject[players.length];

        for (int i = 0; i < arr_json_obj.length; i++) {
            arr_json_obj[i] = players_json_arr.getJSONObject(i);

            //create appropriate player base of the game name
            players[i] = createGamePlayer(game_name, arr_json_obj[i]);
        }
        return null;
    }

    void handleSessionGameStart(final JSONObject json) throws JSONException {


        final String _game_name = json.getString("game_name");
        JSONArray json_arr = json.getJSONArray("players");
        final Player[] _players = createSessionPlayers(_game_name, json_arr);

        final Player _winner = null;//no winner yet
        final Player _player_who_moved = null;
        final Score _score = null;

        final String game_session_id = json.getString("game_session_id");

        //check if we've already added this game session to the game client
        GameSession gameSession = gameClient.getGameSession(game_session_id);
        if (gameSession == null
                || gameSession.isLocalSession()//come back for local session with same id collision - hint local session should have id with prefix (local) and remote session with id with prefix (remote)
                ) {
            //create an add it to the game client

            gameSession = new GameSessionImpl() {
                {
                    session_id = game_session_id;
                    game_name = _game_name;
                    session_start_time = new Date(json.getLong("game_start_time"));
                    session_end_time = new Date(json.getLong("game_end_time"));
                    score = _score;
                    players = _players;
                    time_control = json.getString("time_control");
                    game_position = json.getString("game_position");
                    game_variant = json.getInt("game_variant");
                }
            };

            gameClient.addSession(gameSession);//add the game session to the game client
        }


        //    public GameSessionEvent(String session_id, String gameName, Player[] players, Player winner, Player player_who_moved, Score score, int specatorsCount, int playersCount, String[] newSpecatorsJoin, String[] specatorsLeaves, long gameStartTime, long gameEndTime, boolean isGameEnd, String moveNotation, String currentGamePosition) {


        GameSessionEvent event = new GameSessionEvent() {//extend GameSessionEvent
            {
                session_id = json.getString("game_session_id");
                gameName = json.getString("game_name");
                player_who_moved = _player_who_moved;
                winner = _winner;
                score = _score;
                players = _players;
                specatorsCount = json.getInt("spectators_count");
                playersCount = _players.length;
                gameStartTime = json.getLong("game_start_time");
                gameEndTime = json.getLong("game_end_time");
                currentGamePosition = json.getString("game_position");
            }
        };

        gameClient.evt_dispatcher.fireStartGameSession(event);

    }

    void handleSessionGameEnds(final JSONObject json) throws JSONException {
        String game_name = json.getString("game_name");
        JSONArray json_arr = json.getJSONArray("players");
        final Player[] _players = createSessionPlayers(game_name, json_arr);

        final Player _winner = createGamePlayer(game_name, json.getJSONObject("winner"));
        final Player _player_who_moved = createGamePlayer(game_name, json.getJSONObject("player_who_moved"));
        final Score _score = null;
        //    public GameSessionEvent(String session_id, String gameName, Player[] players, Player winner, Player player_who_moved, Score score, int specatorsCount, int playersCount, String[] newSpecatorsJoin, String[] specatorsLeaves, long gameStartTime, long gameEndTime, boolean isGameEnd, String moveNotation, String currentGamePosition) {

        String game_session_id = json.getString("game_session_id");

        GameSessionEvent event = new GameSessionEvent() {//extend GameSessionEvent
            {
                session_id = json.getString("game_session_id");
                gameName = json.getString("game_name");
                player_who_moved = _player_who_moved;
                winner = _winner;
                score = _score;
                players = _players;
                specatorsCount = json.getInt("spectators_count");
                playersCount = _players.length;
                gameStartTime = json.getLong("game_start_time");
                gameEndTime = json.getLong("game_end_time");
                isGameEnd = json.getBoolean("is_game_over");
                moveNotation = json.getString("move_notation");
                currentGamePosition = json.getString("game_position");
            }
        };

        gameClient.evt_dispatcher.fireEndGameSession(event);

        //finally remove the game session
        GameSession gameSession = gameClient.getGameSession(game_session_id);
        if (gameSession != null) {
            gameClient.removeSession(gameSession);
        }
    }

    void handleSessionGameResumes(final JSONObject json) throws JSONException {
        String game_name = json.getString("game_name");
        JSONArray json_arr = json.getJSONArray("players");
        final Player[] _players = createSessionPlayers(game_name, json_arr);

        Player winner = null;
        final Player _player_who_moved = null;
        final Score _score = null;

        GameSessionEvent event = new GameSessionEvent() {//extend GameSessionEvent
            {
                session_id = json.getString("game_session_id");
                gameName = json.getString("game_name");
                player_who_moved = _player_who_moved;
                score = _score;
                players = _players;
                specatorsCount = json.getInt("spectators_count");
                playersCount = _players.length;
                gameStartTime = json.getLong("game_start_time");
                gameEndTime = json.getLong("game_end_time");
                isGameEnd = json.getBoolean("is_game_over");
                moveNotation = json.getString("move_notation");
                currentGamePosition = json.getString("game_position");
            }
        };
        gameClient.evt_dispatcher.fireResumeGameSession(event);
    }

    void handleSessionGameUpdate(final JSONObject json) throws JSONException {
        String game_name = json.getString("game_name");
        JSONArray json_arr = json.getJSONArray("players");
        final Player[] _players = createSessionPlayers(game_name, json_arr);

        Player winner = createGamePlayer(game_name, json.getJSONObject("winner"));
        final Player _player_who_moved = createGamePlayer(game_name, json.getJSONObject("player_who_moved"));

        final Score _score = null;

        GameSessionEvent event = new GameSessionEvent() {//extend GameSessionEvent
            {
                session_id = json.getString("game_session_id");
                gameName = json.getString("game_name");
                player_who_moved = _player_who_moved;
                score = _score;
                players = _players;
                specatorsCount = json.getInt("spectators_count");
                playersCount = _players.length;
                gameStartTime = json.getLong("game_start_time");
                gameEndTime = json.getLong("game_end_time");
                isGameEnd = json.getBoolean("is_game_over");
                moveNotation = json.getString("move_notation");
                currentGamePosition = json.getString("game_position");
            }
        };
        gameClient.evt_dispatcher.fireUpdateGameSession(event);
    }

    void handleSessionSpectatorsJoion(final JSONObject json) throws JSONException {
        final Player[] _players = null;
        Player winner = null;
        Player play_who_moved = null;
        Score score = null;
        //    public GameSessionEvent(String session_id, String gameName, Player[] players, Player winner, Player player_who_moved, Score score, int specatorsCount, int playersCount, String[] newSpecatorsJoin, String[] specatorsLeaves, long gameStartTime, long gameEndTime, boolean isGameEnd, String moveNotation, String currentGamePosition) {

        JSONArray sj = json.getJSONArray("spectators_join");
        final String[] spectators_join = new String[sj.length()];
        for (int i = 0; i < spectators_join.length; i++) {
            spectators_join[i] = sj.getString(i);
        }


        GameSessionEvent event = new GameSessionEvent() {//extend GameSessionEvent
            {
                session_id = json.getString("game_session_id");
                gameName = json.getString("game_name");
                players = _players;
                specatorsCount = json.getInt("spectators_count");
                playersCount = _players.length;
                newSpecatorsJoin = spectators_join;
                gameStartTime = json.getLong("game_start_time");
                gameEndTime = json.getLong("game_end_time");
            }
        };
        gameClient.evt_dispatcher.fireSpectatorJoinSession(event);
    }

    void handleSessionSpectatorsLeave(final JSONObject json) throws JSONException {
        final Player[] _players = null;
        Player winner = null;
        Player play_who_moved = null;
        Score score = null;
        //    public GameSessionEvent(String session_id, String gameName, Player[] players, Player winner, Player player_who_moved, Score score, int specatorsCount, int playersCount, String[] newSpecatorsJoin, String[] specatorsLeaves, long gameStartTime, long gameEndTime, boolean isGameEnd, String moveNotation, String currentGamePosition) {
        JSONArray sj = json.getJSONArray("spectators_leave");
        final String[] spectators_leave = new String[sj.length()];
        for (int i = 0; i < spectators_leave.length; i++) {
            spectators_leave[i] = sj.getString(i);
        }

        GameSessionEvent event = new GameSessionEvent() {//extend GameSessionEvent
            {
                session_id = json.getString("game_session_id");
                gameName = json.getString("game_name");
                players = _players;
                specatorsCount = json.getInt("spectators_count");
                playersCount = _players.length;
                specatorsLeaves = spectators_leave;
                gameStartTime = json.getLong("game_start_time");
                gameEndTime = json.getLong("game_end_time");
            }
        };

        gameClient.evt_dispatcher.fireSpectatorLeaveSession(event);
    }

    void handleTournameCreated(JSONObject json) {
        TournamentEvent event = new TournamentEvent() {//extend the TournamentEvent
            {
                tournamentCreated = true;
            }
        };

        gameClient.evt_dispatcher.fireTournamentCreated(event);
    }

    void handleTournamentBegins(JSONObject json) {

        TournamentEvent event = new TournamentEvent() {//extend the TournamentEvent
            {
                tournamentBegins = true;
            }
        };

        gameClient.evt_dispatcher.fireTournamentBegins(event);
    }

    void handleTournamentEnds(JSONObject json) {

        TournamentEvent event = new TournamentEvent() {//extend the TournamentEvent
            {
                tournamentEnds = true;
            }
        };

        gameClient.evt_dispatcher.fireTournamentEnds(event);
    }

    void handleTournamentFirstGameStarts(JSONObject json) {
        TournamentEvent event = new TournamentEvent() {//extend the TournamentEvent
            {
                tournamentFirstGameStarts = true;
            }
        };
        gameClient.evt_dispatcher.fireTournamentFirstGameStarts(event);
    }

    void handleTournamentFirstGameEnds(JSONObject json) {
        TournamentEvent event = new TournamentEvent() {//extend the TournamentEvent
            {
                tournamentFirstGameEnds = true;
            }
        };
        gameClient.evt_dispatcher.fireTournamentFirstGameEnds(event);
    }

    void handleTournamentFinalBegins(JSONObject json) {

        TournamentEvent event = new TournamentEvent() {//extend the TournamentEvent
            {
                tournamentFinalBegins = true;
            }
        };

        gameClient.evt_dispatcher.fireTournamentFinalBegins(event);
    }

    void handleTournamentFinalEnds(JSONObject json) {

        TournamentEvent event = new TournamentEvent() {//extend the TournamentEvent
            {
                tournamentFinalEnds = true;
            }
        };

        gameClient.evt_dispatcher.fireTournamentFinalEnds(event);
    }

    void handleTournamentNextRound(JSONObject json) {

        TournamentEvent event = new TournamentEvent() {//extend the TournamentEvent
            {
                tournamentNextRound = true;
            }
        };

        gameClient.evt_dispatcher.fireTournamentNextRound(event);
    }

    void handleChat(JSONObject json) throws JSONException {

        JSONObject json_from_user = json.getJSONObject("from_user");
        User from_user = new User();
        from_user = setUserInfoFromJSON(from_user, json_from_user);

        String message_id = json.getString("message_id");
        String message_body = json.getString("message_body");
        String from_user_photo_url = json.getString("from_user_photo_url");
        long message_time = json.getLong("message_time");

        final ChatMessage chatMsg = new ChatMessage(from_user, gameClient.localUser, message_id, message_body, new Date(message_time), from_user_photo_url);
        ChatEvent event = new ChatEvent() {//extend the ChatEvent
            {
                chatMessage = chatMsg;
            }
        };

        gameClient.evt_dispatcher.fireChatMessage(event);

    }

    void handleChatHistory(JSONArray jsonarr) throws JSONException {

        //populate the chat view using the for loop

        JSONObject[] json_objs = new JSONObject[jsonarr.length()];

        for (int i = 0; i < jsonarr.length(); i++) {

            json_objs[i] = jsonarr.getJSONObject(i);
            JSONObject json_from_user = json_objs[i].getJSONObject("from_user");
            User from_user = new User();
            from_user = setUserInfoFromJSON(from_user, json_from_user);

            String message_id = json_objs[i].getString("message_id");
            String message_body = json_objs[i].getString("message_body");
            String from_user_photo_url = json_objs[i].getString("from_user_photo_url");
            long message_time = json_objs[i].getLong("message_time");

            final ChatMessage chatMsg = new ChatMessage(from_user, gameClient.localUser, message_id, message_body, new Date(message_time), from_user_photo_url);
            ChatEvent event = new ChatEvent() {//extend the ChatEvent
                {
                    chatHistory = true;
                    chatMessage = chatMsg;
                }
            };

            gameClient.evt_dispatcher.fireChatHistory(event);

        }
    }

    void handleChatBegins(JSONObject json) throws JSONException {

        JSONObject json_from_user = json.getJSONObject("from_user");
        User from_user = new User();
        from_user = setUserInfoFromJSON(from_user, json_from_user);

        String message_id = json.getString("message_id");
        String message_body = json.getString("message_body");
        String from_user_photo_url = json.getString("from_user_photo_url");
        long message_time = json.getLong("message_time");

        final ChatMessage chatMsg = new ChatMessage(from_user, gameClient.localUser, message_id, message_body, new Date(message_time), from_user_photo_url);
        ChatEvent event = new ChatEvent() {//extend the ChatEvent
            {
                chatBegins = true;//chat begins with a message
                chatMessage = chatMsg;
            }
        };
        gameClient.evt_dispatcher.fireChatBegins(event);
    }

    void handleChatEnds(JSONObject json) {

        ChatEvent event = new ChatEvent() {//extend the ChatEvent
            {
                chatBegins = true;//chat end with no message - e.g the user close chat window
                chatMessage = null;
            }
        };
        gameClient.evt_dispatcher.fireChatEnds(event);
    }

    CommentMessage createCommentMessage(JSONObject json) throws JSONException {

        JSONObject json_from_user = json.getJSONObject("from_user");
        User from_user = new User();
        from_user = setUserInfoFromJSON(from_user, json_from_user);

        String message_id = json.getString("message_id");
        String message_body = json.getString("message_body");
        String from_user_photo_url = json.getString("from_user_photo_url");
        long message_time = json.getLong("message_time");
        int replies_count = json.getInt("replies_count");
        int likes = json.getInt("likes");
        int dislikes = json.getInt("dislikes");
        return new CommentMessage(from_user, message_id, message_body, new Date(message_time), from_user_photo_url, null, replies_count, likes, dislikes);
    }

    void handleCommentMessage(JSONObject json) throws JSONException {
        final CommentMessage commentMsg = createCommentMessage(json);

        CommentEvent event = new CommentEvent() {//extend the CommentEvent
            {
                commentMessage = commentMsg;
            }
        };

        gameClient.evt_dispatcher.fireCommentMessage(event);

    }

    void handleCommentHistory(JSONArray jsonarr) throws JSONException {

        //populate the comment view using the for loop

        JSONObject[] json_objs = new JSONObject[jsonarr.length()];

        for (int i = 0; i < jsonarr.length(); i++) {

            json_objs[i] = jsonarr.getJSONObject(i);
            JSONObject json_from_user = json_objs[i].getJSONObject("from_user");
            User from_user = new User();
            from_user = setUserInfoFromJSON(from_user, json_from_user);

            String message_id = json_objs[i].getString("message_id");
            String message_body = json_objs[i].getString("message_body");
            String from_user_photo_url = json_objs[i].getString("from_user_photo_url");
            long message_time = json_objs[i].getLong("message_time");
            int replies_count = json_objs[i].getInt("replies_count");
            int likes = json_objs[i].getInt("likes");
            int dislikes = json_objs[i].getInt("dislikes");

            JSONArray jsonReply_arr = json_objs[i].getJSONArray("replies");
            CommentMessage[] replies = new CommentMessage[jsonReply_arr.length()];

            for (int k = 0; k < jsonReply_arr.length(); k++) {
                replies[k] = createCommentMessage(jsonReply_arr.getJSONObject(k));
            }

            final CommentMessage commentMsg = new CommentMessage(from_user, message_id, message_body, new Date(message_time), from_user_photo_url, replies, replies_count, likes, dislikes);
            CommentEvent event = new CommentEvent() {//extend the CommentEvent
                {
                    commentHistory = true;
                    commentMessage = commentMsg;
                }
            };

            gameClient.evt_dispatcher.fireCommentHistory(event);

        }
    }

    void handleCommentReply(JSONObject json) throws JSONException {

        JSONObject json_from_user = json.getJSONObject("from_user");
        User from_user = new User();
        from_user = setUserInfoFromJSON(from_user, json_from_user);

        String message_id = json.getString("message_id");// message id of the reply
        String message_id_replied = json.getString("message_id_replied");//id of the message that is replied
        String message_body = json.getString("message_body");
        String from_user_photo_url = json.getString("from_user_photo_url");
        long message_time = json.getLong("message_time");
        int replies_count = json.getInt("replies_count");
        int likes = json.getInt("likes");
        int dislikes = json.getInt("dislikes");

        final CommentMessage commentMsg = new CommentMessage(from_user, message_id, message_id_replied, message_body, new Date(message_time), from_user_photo_url, null, replies_count, likes, dislikes);
        CommentEvent event = new CommentEvent() {//extend the CommentEvent
            {
                commentReply = true;
                commentMessage = commentMsg;
            }
        };

        gameClient.evt_dispatcher.fireCommentMessage(event);
    }

    void handleCommentEdited(JSONObject json) throws JSONException {

        JSONObject json_from_user = json.getJSONObject("from_user");
        User from_user = new User();
        from_user = setUserInfoFromJSON(from_user, json_from_user);

        String message_id = json.getString("message_id");
        String message_body = json.getString("message_body");
        String from_user_photo_url = json.getString("from_user_photo_url");
        long message_time = json.getLong("message_time");
        int replies_count = json.getInt("replies_count");
        int likes = json.getInt("likes");
        int dislikes = json.getInt("dislikes");

        final CommentMessage commentMsg = new CommentMessage(from_user, message_id, message_body, new Date(message_time), from_user_photo_url, null, replies_count, likes, dislikes);
        CommentEvent event = new CommentEvent() {//extend the CommentEvent
            {
                commentEdited = true;
                commentMessage = commentMsg;
            }
        };

        gameClient.evt_dispatcher.fireCommentEdited(event);
    }

    void handleCommentLikes(JSONObject json) throws JSONException {
        final int likes = json.getInt("likes");
        final String message_id_liked = json.getString("message_id_liked");
        final Boolean is_liked_reply = json.getBoolean("is_liked_reply");

        CommentEvent event = new CommentEvent() {//extend the CommentEvent
            {
                this.commentLikes = likes;
                this.commentLikedMessageID = message_id_liked;
                this.isLikedReply = is_liked_reply;
            }
        };

        gameClient.evt_dispatcher.fireCommentLiked(event);
    }

    void handleCommentDislikes(JSONObject json) throws JSONException {
        final int dislikes = json.getInt("Dislikes");
        final String message_id_disliked = json.getString("message_id_disliked");
        final Boolean is_disliked_reply = json.getBoolean("is_liked_reply");

        CommentEvent event = new CommentEvent() {//extend the CommentEvent
            {
                this.commentDislikes = dislikes;
                this.commentDislikedMessageID = message_id_disliked;
                this.isDislikedReply = is_disliked_reply;
            }
        };

        gameClient.evt_dispatcher.fireCommentDisliked(event);
    }

    void handleFriends(JSONArray jsonArray) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendOnline(JSONObject json) throws JSONException {
        final int dislikes = json.getInt("Dislikes");
        final String message_id_disliked = json.getString("message_id_disliked");
        final Boolean is_disliked_reply = json.getBoolean("is_liked_reply");
    }

    void handleFriendOffline(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendAdded(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendRemoved(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendIdle(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendNotify(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendPlayGame(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendPlayRequest(JSONObject jsonObject) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendPlayRequestAccepted(JSONObject jsonObject) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendPlayRequestRejected(JSONObject jsonObject) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendPlayRequestSent(JSONObject jsonObject) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
    
    void handleFriendRequestAccepted(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendRequestRejected(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    void handleFriendRequestSent(JSONObject json) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}

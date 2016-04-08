/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import naija.game.client.event.ChatListener;
import naija.game.client.event.CommentListener;
import naija.game.client.event.FriendListener;
import naija.game.client.event.FriendRequestListener;
import naija.game.client.event.GameClientEvent;
import naija.game.client.event.GameClientListener;
import naija.game.client.event.GameSessionListener;
import naija.game.client.event.TournamentListener;
import twitter4j.JSONException;
import twitter4j.JSONObject;

/**
 *
 * @author USER
 */
public abstract class AbstractGameClient implements GameClient {

    InBoundHandler inBoundHandler = new InBoundHandler();
    OutBoundHandler outBoundHandler = new OutBoundHandler();
    ScheduledExecutorService exec;
    protected IConnection conn;
    private int nThreads = 2;
    int PERIODIC_VIEW_UPDATE_INTERVAL = 60; //seconds
    long next_update_time;
    List<RequestPacket> requestPackList = Collections.synchronizedList(new LinkedList<RequestPacket>());
    List<GameSession> gameSessionList = Collections.synchronizedList(new LinkedList<GameSession>());
    List<SocialNetwork> socialNetworkList = Collections.synchronizedList(new LinkedList<SocialNetwork>());
    GameClienEventDispatcher evt_dispatcher = new GameClienEventDispatcher();
    LocalUser localUser;
    private DataExplorer dataExplr;

    public AbstractGameClient(IConnection conn) {
        this.conn = conn;
        dataExplr = new DataExplorer(this);
    }

    @Override
    final public void start() {
        if (exec == null) {
            exec = Executors.newScheduledThreadPool(nThreads);
            exec.scheduleWithFixedDelay(inBoundHandler, 0, 500, TimeUnit.MILLISECONDS);
            exec.scheduleWithFixedDelay(outBoundHandler, 0, 500, TimeUnit.MILLISECONDS);
            initailizeView();
            setNextViewUpateTime();
        }
    }

    @Override
    final public void stop() {
        exec.shutdown();
        try {
            exec.awaitTermination(2, TimeUnit.SECONDS);
        } catch (InterruptedException ex) {
            Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            exec = null;
        }
    }

    void setNextViewUpateTime() {
        next_update_time = System.currentTimeMillis() + PERIODIC_VIEW_UPDATE_INTERVAL * 1000L;
    }

    protected void initailizeView() {
        String name = "InitializeView";
        if (hasReqestByName(name)) {
            return;
        }
        RequestPacket requestPacket = new RequestPacket("naija.game.view.InitializeView");
        requestPacket.addCommand("game", getGameName().name());
        requestPacket.setName(name);
        requestPackList.add(requestPacket);
    }

    protected void updateView() {
        if (System.currentTimeMillis() < next_update_time) {
            return;
        }
        setNextViewUpateTime();

        String name = "UpdateView";
        if (hasReqestByName(name)) {
            return;
        }

        RequestPacket requestPacket = new RequestPacket("naija.game.view.UpdateView");
        requestPacket.addCommand("game", getGameName().name());
        requestPacket.setName(name);
        requestPackList.add(requestPacket);
    }

    private boolean hasReqestByName(String accessibleName) {
        for (int i = 0; i < requestPackList.size(); i++) {
            if (accessibleName.equals(requestPackList.get(i).getName())) {
                return true;
            }
        }
        return false;
    }

    public abstract GameName getGameName();

    @Override
    public boolean addSocailNetwork(SocialNetwork socail_network) {
        return socialNetworkList.add(socail_network);
    }

    @Override
    public boolean removeSocailNetwork(SocialNetwork socail_network) {
        return socialNetworkList.remove(socail_network);
    }

    @Override
    public boolean addSession(GameSession session) {
        return gameSessionList.add(session);
    }

    @Override
    public boolean removeSession(GameSession session) {
        return gameSessionList.remove(session);
    }

    @Override
    public boolean addGameSessionListener(GameSessionListener listener) {
        return evt_dispatcher.eventListenersList.add(listener);
    }

    @Override
    public boolean removeGameSessionListener(GameSessionListener listener) {
        return evt_dispatcher.eventListenersList.remove(listener);
    }

    @Override
    public boolean addGameClientListener(GameClientListener listener) {
        return evt_dispatcher.eventListenersList.add(listener);
    }

    @Override
    public boolean removeGameClientListener(GameClientListener listener) {
        return evt_dispatcher.eventListenersList.remove(listener);
    }

    @Override
    public boolean addChatListener(ChatListener listener) {
        return evt_dispatcher.eventListenersList.add(listener);
    }

    @Override
    public boolean removeChatListener(ChatListener listener) {
        return evt_dispatcher.eventListenersList.remove(listener);
    }

    @Override
    public boolean addCommentListener(CommentListener listener) {
        return evt_dispatcher.eventListenersList.add(listener);
    }

    @Override
    public boolean removeCommentListener(CommentListener listener) {
        return evt_dispatcher.eventListenersList.remove(listener);
    }

    @Override
    public boolean addFriendListener(FriendListener listener) {
        return evt_dispatcher.eventListenersList.add(listener);
    }

    @Override
    public boolean removeFriendListener(FriendListener listener) {
        return evt_dispatcher.eventListenersList.remove(listener);
    }

    @Override
    public boolean addFriendRequestListener(FriendRequestListener listener) {
        return evt_dispatcher.eventListenersList.add(listener);
    }

    @Override
    public boolean removeFriendRequestListener(FriendRequestListener listener) {
        return evt_dispatcher.eventListenersList.remove(listener);
    }

    @Override
    public boolean addTournamentListener(TournamentListener listener) {
        return evt_dispatcher.eventListenersList.add(listener);
    }

    @Override
    public boolean removeTournamentListener(TournamentListener listener) {
        return evt_dispatcher.eventListenersList.remove(listener);
    }

    @Override
    public int sessionCount() {
        return evt_dispatcher.eventListenersList.size();
    }

    GameSession getGameSession(String game_session_id) {
        for (int i = 0; i < this.gameSessionList.size(); i++) {
            GameSession game_session = gameSessionList.get(i);
            if (game_session != null
                    && game_session.getSessionID() != null
                    && game_session.getSessionID().equals(game_session_id)) {
                return game_session;
            }
        }
        return null;
    }

    class InBoundHandler implements Runnable {

        boolean isConnected;
        boolean wasConnected;

        @Override
        public void run() {

            if (checkConnection()) {
                return;
            }
            JSONObject json = conn.receiveResponse();
            //handle session

            handleReceivedGameClient(json);
            handleReceivedGameSessions(json);
            handleReceivedTournament(json);
            handleReceivedChatMessage(json);
            handleReceivedComment(json);
            handleReceivedFriends(json);
            handleReceivedFriendRequests(json);
            
            handleSocailNetwork();

        }

        private void handleReceivedGameClient(JSONObject json) {
            if (json.has("local_user_info")) {
                try {
                    localUser = dataExplr.handleLocalUserInfo(json.getJSONObject("local_user_info"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("server_alert_message")) {
                try {
                    dataExplr.handleServerAlertMessage(json.getJSONObject("server_alert_message"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        private void handleReceivedGameSessions(JSONObject json) {
            if (json.has("session_game_start")) {
                try {
                    dataExplr.handleSessionGameStart(json.getJSONObject("session_game_start"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("session_game_ends")) {
                try {
                    dataExplr.handleSessionGameEnds(json.getJSONObject("session_game_ends"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("session_game_resumes")) {
                try {
                    dataExplr.handleSessionGameResumes(json.getJSONObject("session_game_resumes"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("session_game_update")) {
                try {
                    dataExplr.handleSessionGameUpdate(json.getJSONObject("session_game_update"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("session_spectators_join")) {
                try {
                    dataExplr.handleSessionSpectatorsJoion(json.getJSONObject("session_spectators_join"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("session_spectators_leave")) {
                try {
                    dataExplr.handleSessionSpectatorsLeave(json.getJSONObject("session_spectators_leave"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        private void handleReceivedTournament(JSONObject json) {

            if (json.has("tournament_created")) {
                try {
                    dataExplr.handleTournameCreated(json.getJSONObject("tournament_created"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("tournament_begins")) {
                try {
                    dataExplr.handleTournamentBegins(json.getJSONObject("tournament_begins"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("tournament_ends")) {
                try {
                    dataExplr.handleTournamentEnds(json.getJSONObject("tournament_ends"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("tournament_first_game_starts")) {
                try {
                    dataExplr.handleTournamentFirstGameStarts(json.getJSONObject("tournament_game_starts"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("tournament_first_game_ends")) {
                try {
                    dataExplr.handleTournamentFirstGameEnds(json.getJSONObject("tournament_game_ends"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("tournament_final_begins")) {
                try {
                    dataExplr.handleTournamentFinalBegins(json.getJSONObject("tournament_final_begins"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("tournament_final_ends")) {
                try {
                    dataExplr.handleTournamentFinalEnds(json.getJSONObject("tournament_final_ends"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            if (json.has("tournament_next_round")) {
                try {
                    dataExplr.handleTournamentNextRound(json.getJSONObject("tournament_next_round"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        private void handleReceivedChatMessage(JSONObject json) {

            if (json.has("chat_message")) {
                try {
                    dataExplr.handleChat(json.getJSONObject("chat_message"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("chat_history")) {
                try {
                    dataExplr.handleChatHistory(json.getJSONArray("chat_history"));//json array in this case
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("chat_begins")) {
                try {
                    dataExplr.handleChatBegins(json.getJSONObject("chat_begins"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("chat_ends")) {
                try {
                    dataExplr.handleChatEnds(json.getJSONObject("chat_ends"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

        }

        private void handleReceivedComment(JSONObject json) {
            if (json.has("comment_message")) {
                try {
                    dataExplr.handleCommentMessage(json.getJSONObject("comment_message"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("comment_history")) {
                try {
                    dataExplr.handleCommentHistory(json.getJSONArray("comment_history"));//json array
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("comment_reply")) {
                try {
                    dataExplr.handleCommentReply(json.getJSONObject("comment_reply"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("comment_edited")) {
                try {
                    dataExplr.handleCommentEdited(json.getJSONObject("comment_edited"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("comment_likes")) {
                try {
                    dataExplr.handleCommentLikes(json.getJSONObject("comment_likes"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("comment_dislikes")) {
                try {
                    dataExplr.handleCommentDislikes(json.getJSONObject("comment_dislikes"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

        }

        private void handleReceivedFriends(JSONObject json) {
            
            if (json.has("friends")) {
                try {
                    dataExplr.handleFriends(json.getJSONArray("friends"));//json array
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_play_request")) {
                try {
                    dataExplr.handleFriendPlayRequest(json.getJSONObject("friend_play_request"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_play_request_accepted")) {
                try {
                    dataExplr.handleFriendPlayRequestAccepted(json.getJSONObject("friend_play_request_accepted"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_play_request_rejected")) {
                try {
                    dataExplr.handleFriendPlayRequestRejected(json.getJSONObject("friend_play_request_rejected"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_play_request_sent")) {
                try {
                    dataExplr.handleFriendPlayRequestSent(json.getJSONObject("friend_play_request_sent"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_online")) {
                try {
                    dataExplr.handleFriendOnline(json.getJSONObject("friend_online"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_offline")) {
                try {
                    dataExplr.handleFriendOffline(json.getJSONObject("friend_offline"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_added")) {
                try {
                    dataExplr.handleFriendAdded(json.getJSONObject("friend_added"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_removed")) {
                try {
                    dataExplr.handleFriendRemoved(json.getJSONObject("friend_removed"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_idle")) {
                try {
                    dataExplr.handleFriendIdle(json.getJSONObject("friend_idle"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_notify")) {
                try {
                    dataExplr.handleFriendNotify(json.getJSONObject("friend_notify"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_play_game")) {
                try {
                    dataExplr.handleFriendPlayGame(json.getJSONObject("friend_play_game"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        private void handleReceivedFriendRequests(JSONObject json) {

            if (json.has("friend_request_accepted")) {
                try {
                    dataExplr.handleFriendRequestAccepted(json.getJSONObject("friend_request_accepted"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_request_rejected")) {
                try {
                    dataExplr.handleFriendRequestRejected(json.getJSONObject("friend_request_rejected"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

            if (json.has("friend_request_sent")) {
                try {
                    dataExplr.handleFriendRequestSent(json.getJSONObject("friend_request_sent"));
                } catch (JSONException ex) {
                    Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }

        private void handleSocailNetwork() {
        }

        private boolean checkConnection() {
            if (!conn.isConnected()) {
                isConnected = false;
                if (wasConnected) {
                    evt_dispatcher.fireGameClientDisconnected(new GameClientEvent(isConnected, conn.getHost(), conn.getPort(), localUser, null));
                    wasConnected = false;
                }

                return isConnected;
            }

            isConnected = true;
            if (!wasConnected) {
                evt_dispatcher.fireGameClientConnected(new GameClientEvent(isConnected, conn.getHost(), conn.getPort(), localUser, null));
                wasConnected = false;
            }
            wasConnected = true;
            return isConnected;
        }
    }

    class OutBoundHandler implements Runnable {

        @Override
        public void run() {
            updateView();
            RequestPacket requestPack;
            while (requestPackList.size() > 0) {//try to exhaust the list
                requestPack = requestPackList.remove(requestPackList.size() - 1);
                conn.sendRequest(requestPack);
            }
        }
    }
}

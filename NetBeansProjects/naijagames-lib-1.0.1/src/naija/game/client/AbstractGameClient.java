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
import naija.game.client.event.ChatEvent;
import naija.game.client.event.ChatListener;
import naija.game.client.event.CommentEvent;
import naija.game.client.event.CommentListener;
import naija.game.client.event.FriendEvent;
import naija.game.client.event.FriendListener;
import naija.game.client.event.FriendRequestEvent;
import naija.game.client.event.FriendRequestListener;
import naija.game.client.event.GameSessionEvent;
import naija.game.client.event.GameSessionListener;
import naija.game.client.event.TournamentEvent;
import naija.game.client.event.TournamentListener;
import twitter4j.JSONObject;

/**
 *
 * @author USER
 */
public abstract class AbstractGameClient implements GameClient {

    List<GameSession> sessionList = Collections.synchronizedList(new LinkedList<GameSession>());
    List<GameSessionListener> gameSessionListenerList = Collections.synchronizedList(new LinkedList<GameSessionListener>());
    List<ChatListener> chatListenerList = Collections.synchronizedList(new LinkedList<ChatListener>());
    List<CommentListener> commentListenerList = Collections.synchronizedList(new LinkedList<CommentListener>());
    List<FriendListener> friendListenerList = Collections.synchronizedList(new LinkedList<FriendListener>());
    List<FriendRequestListener> friendRequestListenerList = Collections.synchronizedList(new LinkedList<FriendRequestListener>());
    List<TournamentListener> tournamentListenerList = Collections.synchronizedList(new LinkedList<TournamentListener>());
    List<SocialNetwork> socalNetworkList = Collections.synchronizedList(new LinkedList<SocialNetwork>());
    List<RequestPacket> requestPackList = Collections.synchronizedList(new LinkedList<RequestPacket>());
    InBoundHandler inBoundHandler = new InBoundHandler();
    OutBoundHandler outBoundHandler = new OutBoundHandler();
    ScheduledExecutorService exec;
    protected IConnection conn;
    private int nThreads = 2;
    int PERIODIC_VIEW_UPDATE_INTERVAL = 60; //seconds
    long next_update_time;

    public AbstractGameClient(IConnection conn) {
        this.conn = conn;
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
        this.requestPackList.add(requestPacket);
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
        this.requestPackList.add(requestPacket);
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
        return socalNetworkList.add(socail_network);
    }

    @Override
    public boolean removeSocailNetwork(SocialNetwork socail_network) {
        return socalNetworkList.remove(socail_network);
    }

    @Override
    public boolean addSession(GameSession session) {
        return sessionList.add(session);
    }

    @Override
    public boolean removeSession(GameSession session) {
        return sessionList.remove(session);
    }

    @Override
    public boolean addGameSessionListener(GameSessionListener listener) {
        return gameSessionListenerList.add(listener);
    }

    @Override
    public boolean removeGameSessionListener(GameSessionListener listener) {
        return gameSessionListenerList.remove(listener);
    }

    @Override
    public boolean addChatListener(ChatListener listener) {
        return chatListenerList.add(listener);
    }

    @Override
    public boolean removeChatListener(ChatListener listener) {
        return chatListenerList.remove(listener);
    }

    @Override
    public boolean addCommentListener(CommentListener listener) {
        return commentListenerList.add(listener);
    }

    @Override
    public boolean removeCommentListener(CommentListener listener) {
        return commentListenerList.remove(listener);
    }

    @Override
    public boolean addFriendListener(FriendListener listener) {
        return friendListenerList.add(listener);
    }

    @Override
    public boolean removeFriendListener(FriendListener listener) {
        return friendListenerList.remove(listener);
    }

    @Override
    public boolean addFriendRequestListener(FriendRequestListener listener) {
        return friendRequestListenerList.add(listener);
    }

    @Override
    public boolean removeFriendRequestListener(FriendRequestListener listener) {
        return friendRequestListenerList.remove(listener);
    }

    @Override
    public boolean addTournamentListener(TournamentListener listener) {
        return tournamentListenerList.add(listener);
    }

    @Override
    public boolean removeTournamentListener(TournamentListener listener) {
        return tournamentListenerList.remove(listener);
    }

    @Override
    public int sessionCount() {
        return sessionList.size();
    }

    void fireChatMessage(ChatEvent e) {
        for (int i = 0; i < chatListenerList.size(); i++) {
            try {
                chatListenerList.get(i).onChatMesage(e);
            } catch (Exception ex) {
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireChatEnds(ChatEvent e) {
        for (int i = 0; i < chatListenerList.size(); i++) {
            try {
                chatListenerList.get(i).onChatEnds(e);
            } catch (Exception ex) {
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireChatBegins(ChatEvent e) {
        for (int i = 0; i < chatListenerList.size(); i++) {
            try {
                chatListenerList.get(i).onChatBegins(e);
            } catch (Exception ex) {
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireChatSent(ChatEvent e) {
        for (int i = 0; i < chatListenerList.size(); i++) {
            try {
                chatListenerList.get(i).onChatSent(e);
            } catch (Exception ex) {
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireChatHistory(ChatEvent e) {
        for (int i = 0; i < chatListenerList.size(); i++) {
            try {
                chatListenerList.get(i).onChatHistory(e);
            } catch (Exception ex) {
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireStartGameSession(GameSessionEvent event) {
        for (int i = 0; i < gameSessionListenerList.size(); i++) {
            try {
                gameSessionListenerList.get(i).onStartGameSession(event);
            } catch (Exception ex) {
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireEndGameSession(GameSessionEvent event) {
        for (int i = 0; i < gameSessionListenerList.size(); i++) {
            try {
                gameSessionListenerList.get(i).onEndGameSession(event);
            } catch (Exception ex) {
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireResumeGameSession(GameSessionEvent event) {
        for (int i = 0; i < gameSessionListenerList.size(); i++) {
            try {
                gameSessionListenerList.get(i).onResumeGameSession(event);
            } catch (Exception ex) {
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireSpectatorJoinSession(GameSessionEvent event) {
        for (int i = 0; i < gameSessionListenerList.size(); i++) {
            try {
                gameSessionListenerList.get(i).onSpectatorJoinSession(event);
            } catch (Exception ex) {
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);                
            }
        }
    }

    void fireSpectatorLeaveSession(GameSessionEvent event) {
        for (int i = 0; i < gameSessionListenerList.size(); i++) {
            try {
                gameSessionListenerList.get(i).onSpectatorLeaveSession(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireCommentMessage(CommentEvent event) {
        for (int i = 0; i < commentListenerList.size(); i++) {
            try {
                commentListenerList.get(i).onCommentMesage(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireCommentReply(CommentEvent event) {
        for (int i = 0; i < commentListenerList.size(); i++) {
            try {
                commentListenerList.get(i).onCommentReply(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireCommentSent(CommentEvent event) {
        for (int i = 0; i < commentListenerList.size(); i++) {
            try {
                commentListenerList.get(i).onCommentSent(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireCommentHistory(CommentEvent event) {
        for (int i = 0; i < commentListenerList.size(); i++) {
            try {
                commentListenerList.get(i).onCommentHistory(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireCommentLiked(CommentEvent event) {
        for (int i = 0; i < commentListenerList.size(); i++) {
            try {
                commentListenerList.get(i).onCommentLiked(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireCommentDisliked(CommentEvent event) {
        for (int i = 0; i < commentListenerList.size(); i++) {
            try {
                commentListenerList.get(i).onCommentDisliked(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireFriendAdded(FriendEvent event) {
        for (int i = 0; i < friendListenerList.size(); i++) {
            try {
                friendListenerList.get(i).onFriendAdded(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireFriendRemoved(FriendEvent event) {
        for (int i = 0; i < friendListenerList.size(); i++) {
            try {
                friendListenerList.get(i).onFriendRemove(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireFriendIdle(FriendEvent event) {
        for (int i = 0; i < friendListenerList.size(); i++) {
            try {
                friendListenerList.get(i).onFriendIdle(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireFriendOnline(FriendEvent event) {
        for (int i = 0; i < friendListenerList.size(); i++) {
            try {
                friendListenerList.get(i).onFriendOnline(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireFriendOffline(FriendEvent event) {
        for (int i = 0; i < friendListenerList.size(); i++) {
            try {
                friendListenerList.get(i).onFriendOffline(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    
    void fireFriendPlayGame(FriendEvent event) {
        for (int i = 0; i < friendListenerList.size(); i++) {
            try {
                friendListenerList.get(i).onFriendPlayGame(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireFriendRequestAccepted(FriendRequestEvent event) {
        for (int i = 0; i < friendRequestListenerList.size(); i++) {
            try {
                friendRequestListenerList.get(i).onFriendRequestAccepted(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireFriendRequestRejected(FriendRequestEvent event) {
        for (int i = 0; i < friendRequestListenerList.size(); i++) {
            try {
                friendRequestListenerList.get(i).onFriendRequestRejected(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireFriendRequestSent(FriendRequestEvent event) {
        for (int i = 0; i < friendRequestListenerList.size(); i++) {
            try {
                friendRequestListenerList.get(i).onFriendRequestSent(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireTournamentBegins(TournamentEvent event) {
        for (int i = 0; i < tournamentListenerList.size(); i++) {
            try {
                tournamentListenerList.get(i).onTournamentBegins(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireTournamentEnds(TournamentEvent event) {
        for (int i = 0; i < tournamentListenerList.size(); i++) {
            try {
                tournamentListenerList.get(i).onTournamentEnds(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireTournamentCreated(TournamentEvent event) {
        for (int i = 0; i < tournamentListenerList.size(); i++) {
            try {
                tournamentListenerList.get(i).onTournamentCreated(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireTournamentFinalBegins(TournamentEvent event) {
        for (int i = 0; i < tournamentListenerList.size(); i++) {
            try {
                tournamentListenerList.get(i).onTournamentFinalBegins(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireTournamentFinalEnds(TournamentEvent event) {
        for (int i = 0; i < tournamentListenerList.size(); i++) {
            try {
                tournamentListenerList.get(i).onTournamentFinalEnds(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireTournamentNextRound(TournamentEvent event) {
        for (int i = 0; i < tournamentListenerList.size(); i++) {
            try {
                tournamentListenerList.get(i).onTournamentNextRound(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireTournamentGameStart(TournamentEvent event) {
        for (int i = 0; i < tournamentListenerList.size(); i++) {
            try {
                tournamentListenerList.get(i).onTournamentGameStart(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireTournamentGameEnd(TournamentEvent event) {
        for (int i = 0; i < tournamentListenerList.size(); i++) {
            try {
                tournamentListenerList.get(i).onTournamentGameEnd(event);
            } catch (Exception ex) {    
                Logger.getLogger(AbstractGameClient.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    class InBoundHandler implements Runnable {

        @Override
        public void run() {

            JSONObject json = receiveResponse();
            //handle session
            handleGameSessions(json);
            handleGame(json);
            handleChat(json);
            handleComment(json);
            handleSocailNetwork();

        }

        private void handleGameSessions(JSONObject json) {
        }

        private void handleGame(JSONObject json) {
        }

        private void handleChat(JSONObject json) {
        }

        private void handleComment(JSONObject json) {
        }

        private void handleSocailNetwork() {
        }

        private JSONObject receiveResponse() {
            return conn.receiveResponse();
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

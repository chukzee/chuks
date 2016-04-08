/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
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
import naija.game.client.event.GameClientEvent;
import naija.game.client.event.GameClientListener;
import naija.game.client.event.GameSessionEvent;
import naija.game.client.event.GameSessionListener;
import naija.game.client.event.TournamentEvent;
import naija.game.client.event.TournamentListener;

/**
 *
 * @author USER
 */
class GameClienEventDispatcher {

    List eventListenersList = Collections.synchronizedList(new LinkedList());

    void fireChatMessage(ChatEvent event) {
        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof ChatListener) {
                    ((ChatListener) obj).onChatMesage(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireChatEnds(ChatEvent event) {
        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof ChatListener) {
                    ((ChatListener) obj).onChatEnds(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireChatBegins(ChatEvent event) {
        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof ChatListener) {
                    ((ChatListener) obj).onChatBegins(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireChatSent(ChatEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof ChatListener) {
                    ((ChatListener) obj).onChatSent(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireChatHistory(ChatEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof ChatListener) {
                    ((ChatListener) obj).onChatHistory(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireStartGameSession(GameSessionEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameSessionListener) {
                    ((GameSessionListener) obj).onSessionGameStarts(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireEndGameSession(GameSessionEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameSessionListener) {
                    ((GameSessionListener) obj).onSessionGameEnds(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireResumeGameSession(GameSessionEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameSessionListener) {
                    ((GameSessionListener) obj).onSessionGameResume(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireUpdateGameSession(GameSessionEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameSessionListener) {
                    ((GameSessionListener) obj).onSessionGameUpdate(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    void fireSpectatorJoinSession(GameSessionEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameSessionListener) {
                    ((GameSessionListener) obj).onSessionSpectatorJoin(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireSpectatorLeaveSession(GameSessionEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameSessionListener) {
                    ((GameSessionListener) obj).onSessionSpectatorLeave(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireCommentMessage(CommentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof CommentListener) {
                    ((CommentListener) obj).onCommentMesage(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireCommentEdited(CommentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof CommentListener) {
                    ((CommentListener) obj).onCommentEdited(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireCommentReply(CommentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof CommentListener) {
                    ((CommentListener) obj).onCommentReply(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireCommentSent(CommentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof CommentListener) {
                    ((CommentListener) obj).onCommentSent(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireCommentHistory(CommentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof CommentListener) {
                    ((CommentListener) obj).onCommentHistory(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireCommentLiked(CommentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof CommentListener) {
                    ((CommentListener) obj).onCommentLiked(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireCommentDisliked(CommentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof CommentListener) {
                    ((CommentListener) obj).onCommentDisliked(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriends(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriends(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendAdded(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendAdded(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendRemoved(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendRemove(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendIdle(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendIdle(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendOnline(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendOnline(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendOffline(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendOffline(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendPlayGame(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendPlayGame(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendPlayRequest(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendPlayRequest(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendPlayRequestAccepted(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendPlayRequestAccepted(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendPlayRequestRejected(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendPlayRequestRejected(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendPlayRequestSent(FriendEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendListener) {
                    ((FriendListener) obj).onFriendPlayRequestSent(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendRequestAccepted(FriendRequestEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendRequestListener) {
                    ((FriendRequestListener) obj).onFriendRequestAccepted(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendRequestRejected(FriendRequestEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendRequestListener) {
                    ((FriendRequestListener) obj).onFriendRequestRejected(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireFriendRequestSent(FriendRequestEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof FriendRequestListener) {
                    ((FriendRequestListener) obj).onFriendRequestSent(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireTournamentBegins(TournamentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof TournamentListener) {
                    ((TournamentListener) obj).onTournamentBegins(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireTournamentEnds(TournamentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof TournamentListener) {
                    ((TournamentListener) obj).onTournamentEnds(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireTournamentCreated(TournamentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof TournamentListener) {
                    ((TournamentListener) obj).onTournamentCreated(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    void fireTournamentFinalBegins(TournamentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof TournamentListener) {
                    ((TournamentListener) obj).onTournamentFinalBegins(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    void fireTournamentFinalEnds(TournamentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof TournamentListener) {
                    ((TournamentListener) obj).onTournamentFinalEnds(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    void fireTournamentNextRound(TournamentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof TournamentListener) {
                    ((TournamentListener) obj).onTournamentNextRound(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    void fireTournamentFirstGameStarts(TournamentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof TournamentListener) {
                    ((TournamentListener) obj).onTournamentFirstGameStarts(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    void fireTournamentFirstGameEnds(TournamentEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof TournamentListener) {
                    ((TournamentListener) obj).onTournamentFirstGameEnds(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    void fireGameClientConnected(GameClientEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameClientListener) {
                    ((GameClientListener) obj).onClientConnected(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    void fireGameClientDisconnected(GameClientEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameClientListener) {
                    ((GameClientListener) obj).onClientDisconnected(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    void fireGameClientServerAlert(GameClientEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameClientListener) {
                    ((GameClientListener) obj).onClientServerAlert(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    void fireGameClientUserInfo(GameClientEvent event) {

        for (int i = 0; i < eventListenersList.size(); i++) {
            try {
                Object obj = eventListenersList.get(i);
                if (obj instanceof GameClientListener) {
                    ((GameClientListener) obj).onClientUserInfo(event);
                }
            } catch (Exception ex) {
                Logger.getLogger(GameClienEventDispatcher.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }
}

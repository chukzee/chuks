/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import naija.game.client.event.ChatListener;
import naija.game.client.event.CommentListener;
import naija.game.client.event.FriendListener;
import naija.game.client.event.FriendRequestListener;
import naija.game.client.event.GameListener;
import naija.game.client.event.GameSessionListener;
import naija.game.client.event.TournamentListener;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface GameClient {

    void start();

    void stop();

    boolean addSession(GameSession session);

    boolean removeSession(GameSession session);

    boolean addGameSessionListener(GameSessionListener listener);

    boolean removeGameSessionListener(GameSessionListener listener);

    boolean addChatListener(ChatListener listener);

    boolean removeChatListener(ChatListener listener);

    boolean addCommentListener(CommentListener listener);

    boolean removeCommentListener(CommentListener listener);

    boolean addFriendListener(FriendListener listener);

    boolean removeFriendListener(FriendListener listener);

    boolean addFriendRequestListener(FriendRequestListener listener);

    boolean removeFriendRequestListener(FriendRequestListener listener);

    boolean addTournamentListener(TournamentListener listener);

    boolean removeTournamentListener(TournamentListener listener);

    boolean addSocailNetwork(SocialNetwork socail_network);

    boolean removeSocailNetwork(SocialNetwork socail_network);

    int sessionCount();
}

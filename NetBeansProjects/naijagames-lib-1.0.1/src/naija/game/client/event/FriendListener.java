/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

import naija.game.client.User;

/**
 *
 * @author USER
 */
public interface FriendListener {

    /**
     * Fires when a user friends are retrived from the server.
     *
     * @param event
     */
    void onFriends(FriendEvent event);

    /**
     * Fires when a user friend is online
     *
     * @param event
     */
    void onFriendOnline(FriendEvent event);

    /**
     * Fires when a user friend is offline
     *
     * @param event
     */
    void onFriendOffline(FriendEvent event);

    /**
     * Fires when the server detects that a user friend is idle. This can help a
     * user know who to send a play request to.
     *
     * @param event
     */
    void onFriendIdle(FriendEvent event);

    /**
     * Fires when a user friend commences a game
     *
     * @param event
     */
    void onFriendPlayGame(FriendEvent event);

    /**
     * Fires when friend is added to a user usually after friend request
     * acceptance.
     *
     * @param event
     */
    void onFriendAdded(FriendEvent event);

    /**
     * Fires when a friend is deleted from a user.
     *
     * @param event
     */
    void onFriendRemove(FriendEvent event);

    /**
     * Fires when a friend sends a notification message to a user.
     *
     * @param event
     */
    void onFriendNotify(FriendEvent event);

    /**
     * Fires when a user receives a play request from a friend.
     *
     * @param event
     */
    void onFriendPlayRequest(FriendEvent event);

    /**
     * Fires when a play request is succesfully sent to a friend.
     *
     * @param event
     */
    void onFriendPlayRequestSent(FriendEvent event);

    /**
     * Fires when a play request is accepted by a friend.
     *
     * @param event
     */
    void onFriendPlayRequestAccepted(FriendEvent event);

    /**
     * Fires when a play request is rejected by a friend.
     *
     * @param event
     */
    void onFriendPlayRequestRejected(FriendEvent event);
}

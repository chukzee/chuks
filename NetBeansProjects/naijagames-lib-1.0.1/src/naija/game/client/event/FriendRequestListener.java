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
public interface FriendRequestListener {
    
    void onFriendRequestAccepted(FriendRequestEvent event);
    void onFriendRequestRejected(FriendRequestEvent event);
    void onFriendRequestSent(FriendRequestEvent event);
}

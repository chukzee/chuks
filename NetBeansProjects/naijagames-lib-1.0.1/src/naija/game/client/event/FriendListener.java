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
    
    void onFriendOnline(FriendEvent event);
    void onFriendOffline(FriendEvent event);
    void onFriendIdle(FriendEvent event);
    void onFriendPlayGame(FriendEvent event);
    void onFriendAdded(FriendEvent event);
    void onFriendRemove(FriendEvent event);
    void onFriendNotify(FriendEvent event);
}

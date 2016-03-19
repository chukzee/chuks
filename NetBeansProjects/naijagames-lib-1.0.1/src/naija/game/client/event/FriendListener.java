/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

import naija.game.client.UserInfo;

/**
 *
 * @author USER
 */
public interface FriendListener {
    
    void onFriend(UserInfo user);
    void onFriendRequest(UserInfo user);
}

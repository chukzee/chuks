/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

import naija.game.client.Message;
import naija.game.client.User;

/**
 *
 * @author USER
 */
public class FriendEvent {
    
    protected Message friendNotify;
    protected User friend;
    protected boolean friendAdded;
    protected boolean friendRemoved;
    protected boolean friendOnline;
    protected boolean friendOffline;
    protected boolean friendPlayGame;
    protected boolean friendIdle;

    public Message getFriendNotify() {
        return friendNotify;
    }

    public User getFriend() {
        return friend;
    }

    public boolean isFriendAdded() {
        return friendAdded;
    }

    public boolean isFriendRemoved() {
        return friendRemoved;
    }

    public boolean isFriendOnline() {
        return friendOnline;
    }

    public boolean isFriendOffline() {
        return friendOffline;
    }

    public boolean isFriendPlayGame() {
        return friendPlayGame;
    }

    public boolean isFriendIdle() {
        return friendIdle;
    }
    
    
}

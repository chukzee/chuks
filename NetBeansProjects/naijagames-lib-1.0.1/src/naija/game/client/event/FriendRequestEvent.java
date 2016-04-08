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
public class FriendRequestEvent {
    protected boolean friendReqestAccepted;
    protected boolean friendRequestRejected;
    protected boolean friendRequestSent;
    protected User requestedUser;
    protected User requestor;

    public boolean isFriendReqestAccepted() {
        return friendReqestAccepted;
    }

    public boolean isFriendRequestRejected() {
        return friendRequestRejected;
    }

    public boolean isFriendRequestSent() {
        return friendRequestSent;
    }

    public User getRequestedUser() {
        return requestedUser;
    }

    public User getRequestor() {
        return requestor;
    }
    
}

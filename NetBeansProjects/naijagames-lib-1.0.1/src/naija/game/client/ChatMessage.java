/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Date;

/**
 *
 * @author USER
 */
public class ChatMessage extends AbstractMessage {

    User from_user;
    User to_user;

    public ChatMessage(User from_user, User to_user, String message_id, String message, Date message_time, String subject_icon_url) {
        super(message_id, message, message_time, subject_icon_url);
        this.from_user = from_user;
        this.to_user = to_user;
    }

    

    /**
     * Sets the user who sent the message
     *
     * @param user
     */
    public User getFromUser() {
        return from_user;
    }

    /**
     * Sets the user to whom the message was sent. if null is returned then it
     * can be interpreted as a broadcast message such as comment message.
     *
     * @param user
     */
    public User getToUser() {
        return to_user;
    }
}

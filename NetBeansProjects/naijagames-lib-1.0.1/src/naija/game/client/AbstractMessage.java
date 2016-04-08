/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Date;

/**
 *
 * @author USER
 */
public abstract class AbstractMessage implements Message{

    protected String message_id;
    protected String message;
    protected Date message_time;
    protected String subject_icon_url;

    public AbstractMessage(String message_id, String message, Date message_time, String subject_icon_url) {
        this.message_id = message_id;
        this.message = message;
        this.message_time = message_time;
        this.subject_icon_url = subject_icon_url;
    }

    @Override
    public String getMessageID() {
        return message_id;
    }

    
    
    @Override
    public String getMessage() {
        return message;
    }

    
    @Override
    public String getSubjectIconUrl() {
        return subject_icon_url;
    }

    @Override
    public Date getMessageTime() {
        return message_time;
    }
}

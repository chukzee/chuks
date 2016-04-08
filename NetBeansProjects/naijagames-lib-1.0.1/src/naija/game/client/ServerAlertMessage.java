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
public class ServerAlertMessage extends AbstractMessage{
    private final int message_icon_type;

    public ServerAlertMessage(String message_id, String message, Date message_time, String subject_icon_url, int message_icon_type) {
        super(message_id, message, message_time, subject_icon_url);
        this.message_icon_type = message_icon_type;
    }

       
    /**
     *Gets the type of icon for this mssage.
     * <p>
     * examples of message types:<br/><br/>
     * 
     *
     *Message.INFO - Information message<br/>
     *Message.SUCCESS - Success message<br/>
     *Message.WARNING - Waring message<br/>
     *Message.ERROR - Error message<br/>
     * 
     * <p/>
     * @return 
     */
    public int getMessageIconType(){
        return message_icon_type;
    }
}

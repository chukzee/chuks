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
public interface Message {

    int INFO = 0x00000001;
    int SUCCESS = 0x00000002;
    int WARNING = 0x00000004;
    int ERROR = 0x00000008;

    /**
     * Get the id that uniquely identifies the message.
     *
     * @return
     */
    String getMessageID();

    /**
     * Carries the message body - the main message
     *
     * @return
     */
    String getMessage();

    /**
     * Gets the subject icon url. The message subject is typically be the sender
     * (another user). Typical implementations may return a user photo url
     *
     * @return
     */
    String getSubjectIconUrl();

    /**
     * Gets the time the message was received by the
     * {@link naija.game.client.GameClient}
     *
     * @return
     */
    Date getMessageTime();
}

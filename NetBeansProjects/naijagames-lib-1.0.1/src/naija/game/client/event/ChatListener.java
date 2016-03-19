/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

import naija.game.client.ChatMessage;

/**
 *
 * @author USER
 */
public interface ChatListener {
    void onChat(ChatMessage chat_message);
}

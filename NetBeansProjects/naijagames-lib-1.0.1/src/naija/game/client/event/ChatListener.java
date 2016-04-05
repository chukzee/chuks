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
    
    /**
     * Fires when a chat message arrives from the server.
     * @param event 
     */
    void onChatMesage(ChatEvent event);
    
    /**
     * Fires when a chat message sent to the server.
     * @param event 
     */
    void onChatSent(ChatEvent event);
    
    /**
     * Fires when a collection of chat messages is received from the server.
     * Useful for populating a chat view.
     * @param event 
     */
    void onChatHistory(ChatEvent event);
    
     /**
     * Fires when a chat begins between two users.
     * @param event 
     */
    void onChatBegins(ChatEvent event);
    
     /**
     * Fires when a user discontinues an ongoing chat session.
     * @param event 
     */
    void onChatEnds(ChatEvent event);
}

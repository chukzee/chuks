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
public class ChatEvent {
    
    protected ChatMessage chatMessage;
    protected boolean chatHistory;
    protected boolean chatBegins;
    protected boolean chatEnds;
    protected boolean chatSent;

    public ChatMessage getChatMessage() {
        return chatMessage;
    }

    public boolean isChatHistory() {
        return chatHistory;
    }

    public boolean isChatBegins() {
        return chatBegins;
    }

    public boolean isChatEnds() {
        return chatEnds;
    }

    public boolean isChatSent() {
        return chatSent;
    }

    
    
}

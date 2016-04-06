/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Properties;

/**
 * The {@link naija.game.client.LocalUser} class represents the user of the app
 * with or without connection to the server. It the user is not connected to the
 * server client code should use the compter name to represent the username.
 * However, when the user is connected to the server the username should be that
 * retrieved from the server.
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class LocalUser extends User {

    /**
     * Use this constructor if the user is not connected to the server.
     * The computer name will be used as the username
     */
    public LocalUser() {
        setUsername(System.getProperty("user.name"));
    }

    public LocalUser(String username) {
        setUsername(username);
    }

    public User getInfo() {
        return this;
    }

    /**
     * Send message to all users in the same game room
     *
     * @param message
     */
    public void broadcastMessage(ChatMessage message) {
    }

    /**
     * Send message to a particular user
     *
     * @param user
     * @param message
     */
    public void sendMessageTo(User user, ChatMessage message) {
    }

    public static void main(String... ar) {
        Properties p = System.getProperties();
        System.out.println(System.getProperty("user.variant"));
    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

/**
 *
 * @author USER
 */
public interface GameClientListener {

    /**
     * Fires where the {@link naija.game.client.GameClient} detects connection
     * loss.
     *
     * @param event
     */
    void onClientDisconnected(GameClientEvent event);

    /**
     * Fires where the {@link naija.game.client.GameClient} establishes
     * connection.
     *
     * @param event
     */
    void onClientConnected(GameClientEvent event);

    /**
     * Fires when the information of the local app user is available either from
     * the server or via local cache.
     *
     * @param event
     */
    void onClientUserInfo(GameClientEvent event);

    /**
     * Fires when special alert message is recieved from the server.
     *
     * @param event
     */
    void onClientServerAlert(GameClientEvent event);
}

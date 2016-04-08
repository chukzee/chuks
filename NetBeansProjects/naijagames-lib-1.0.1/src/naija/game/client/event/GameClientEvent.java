/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

import naija.game.client.LocalUser;
import naija.game.client.ServerAlertMessage;

/**
 *
 * @author USER
 */
public class GameClientEvent {
    private final boolean connected;
    private final String host;
    private final int port;
    private LocalUser localUser;
    private ServerAlertMessage serverAlertMsg;

    public GameClientEvent(boolean connected, String host, int port, LocalUser localUser, ServerAlertMessage serverAlertMsg) {
        this.connected = connected;
        this.host = host;
        this.port = port;
        this.localUser = localUser;
        this.serverAlertMsg = serverAlertMsg;
    }
    

    public String getHost(){
        return host;
    }
    
    public int getPort(){
        return port;
    }
    
    public boolean isConnectd(){
        return connected;
    }
    
    public LocalUser getClientUserInfo() {
        return localUser;
    }

    public ServerAlertMessage geServerAlertMessage() {
        return serverAlertMsg;
    }
    
}

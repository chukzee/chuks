/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.control;

import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.screen.Screen;
import naija.game.client.event.FriendEvent;
import naija.game.client.event.FriendListener;
import naija.game.client.event.FriendRequestEvent;
import naija.game.client.event.FriendRequestListener;

/**
 *
 * @author USER
 */
public class FriendRequestControl  implements FriendRequestListener{
    private static FriendRequestControl friendRequestControl;
    final private static Object lock = new Object();
    private Nifty nifty;
    private Screen screen;
    private Element parent;

    private FriendRequestControl(){
        
    }
    
    static public FriendRequestControl getInstance(Nifty nifty, Screen screen, Element parent){
        
        synchronized (lock) {
            friendRequestControl.nifty = nifty;
            friendRequestControl.screen = screen;
            friendRequestControl.parent = parent;

            if (friendRequestControl == null) {
                friendRequestControl = new FriendRequestControl();
            }
        }
        return friendRequestControl;
    }
    
    public void onFriendRequestAccepted(FriendRequestEvent event) {
    }

    public void onFriendRequestRejected(FriendRequestEvent event) {
    }

    public void onFriendRequestSent(FriendRequestEvent event) {
    }
    
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.control;

import com.jme3.font.BitmapFont;
import com.jme3.niftygui.RenderFontJme;
import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.builder.ControlBuilder;
import de.lessvoid.nifty.controls.Parameters;
import de.lessvoid.nifty.controls.TextField;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.elements.render.ImageRenderer;
import de.lessvoid.nifty.elements.render.TextRenderer;
import de.lessvoid.nifty.input.NiftyInputEvent;
import de.lessvoid.nifty.layout.align.HorizontalAlign;
import de.lessvoid.nifty.screen.Screen;
import de.lessvoid.nifty.spi.render.RenderFont;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import naija.game.client.event.FriendEvent;
import naija.game.client.event.FriendListener;
import naija.games.gui.builder.FriendListItemDefinitionBuilder;
import naija.games.gui.builder.FriendsHeaderDefinitionBuilder;

/**
 *
 * @author USER
 */
public class FriendsControl implements FriendListener{

    static private FriendsControl friendsControl;
    static final private Object lock = new Object();
    static Nifty nifty;
    static Screen screen;
    static Element parent;
    int maxFriendListHeight;
    int friedRowHeight;
    Element friendsHeader;
    Map<String, Element> friendMap = new HashMap();
    private final String friends_title_pnl = "friends_title_pnl";
    String friend_list_item = "friend_list_item";
    String friends_header = "friends_header";
    
    private FriendsControl() {
        new FriendListItemDefinitionBuilder(friend_list_item, parent)
                .registerControlDefintion(nifty);

        new FriendsHeaderDefinitionBuilder(friends_header)
                .registerControlDefintion(nifty);


        friendsHeader = new ControlBuilder(friends_title_pnl, friends_header)
                .build(nifty, screen, parent);

        maxFriendListHeight = parent.getHeight() - parent.findElementById(friends_title_pnl).getHeight();
    }

    static public FriendsControl getInstance(Nifty nifty, Screen screen, Element parent) {

        synchronized (lock) {
            FriendsControl.nifty = nifty;
            FriendsControl.screen = screen;
            FriendsControl.parent = parent;

            if (friendsControl == null) {
                friendsControl = new FriendsControl();
            }
        }

        return friendsControl;
    }

    public void setNumbersOnline(int numbers_online, int total_friends){
        Element element = this.friendsHeader.findElementById("no_of_friends");
        TextRenderer rederer = element.getRenderer(TextRenderer.class);
                
        //rederer.setFont();
        
        rederer.setTextHAlign(HorizontalAlign.left);
        rederer.setText(numbers_online+" of "+total_friends+" online");
    }
    
    public void setActivity(String username, String activity){
        Element friend_element = friendMap.get(username);
        if(friend_element==null)
            return;
        Element element = friend_element.findElementById(username+"_activity_id");
        TextRenderer rederer = element.getRenderer(TextRenderer.class);
        
        rederer.setTextHAlign(HorizontalAlign.right);
        rederer.setText(activity);
    }

    public void setOnlineStatus(String username, boolean is_online){
        Element friend_element = friendMap.get(username);   
        if(friend_element==null)
            return;
        Element element = friend_element.findElementById(username+"_online_indicator_id");
        ImageRenderer rederer = element.getRenderer(ImageRenderer.class);
        
        //NOT FULLY INPLEMENTED
        System.err.println("setOnlineStatus - NOT FULLY INPLEMENTED");
        rederer.setImage(null);//come back

    }
        
    public void addFriend(final String username, final String full_name, final String photo_filename, final boolean is_online, final String activity) {
        synchronized (lock) {
            Element element = new ControlBuilder(username, friend_list_item){
                {
                    parameter("username", username);
                    parameter("full_name", full_name);
                    parameter("activity", activity);
                    
                    parameter("activity_id", username+"_activity_id");//for dynamic access
                    parameter("online_indicator_id", username+"_online_indicator_id");//for dynamic access
                    
                    parameter("online_indicator_image_filename", photo_filename);
                    parameter("photo_filename",
                                is_online?
                                "naija/games/images/BVN_54.png"//COME BACK
                                :"naija/games/images/BVN_54.png");//COME BACK
                    //"naija/games/images/BVN_54.png"
                }
            }
                    .build(nifty, screen, parent);

            
            this.friendMap.put(username, element);
            
            if (friedRowHeight == 0) {
                friedRowHeight = parent.findElementById(username).getHeight();
            }

            System.out.println(friedRowHeight);            
            System.out.println(maxFriendListHeight);
        }
    }

    public void removeFriend(String username) {

        //TODO: to be fully implemented

        this.friendMap.remove(username);
    }

    public void clearFriends() {

        //TODO: to be fully implemented

        this.friendMap.clear();
    }

    public void onFriendOnline(FriendEvent event) {
    }

    public void onFriendOffline(FriendEvent event) {
    }

    public void onFriendIdle(FriendEvent event) {
    }

    public void onFriendPlayGame(FriendEvent event) {
    }

    public void onFriendAdded(FriendEvent event) {
    }

    public void onFriendRemove(FriendEvent event) {
    }

    public void onFriendNotify(FriendEvent event) {
    }

}

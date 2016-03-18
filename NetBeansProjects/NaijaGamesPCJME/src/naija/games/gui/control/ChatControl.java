/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.control;

import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.builder.ControlBuilder;
import de.lessvoid.nifty.controls.dynamic.PanelCreator;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.layout.manager.LayoutManager;
import de.lessvoid.nifty.layout.manager.VerticalLayout;
import de.lessvoid.nifty.screen.Screen;
import de.lessvoid.nifty.tools.SizeValue;
import java.util.Date;
import naija.games.gui.builder.ChatmatePanelDefinitionBuilder;
import naija.games.gui.builder.ChatterPanelDefinitionBuilder;

/**
 *
 * @author USER
 */
public class ChatControl {

    static private ChatControl chatControl;
    static final private Object lock = new Object();
    static Nifty nifty;
    static Screen screen;
    static Element parent;
    String chatter_pnl = "chatter_pnl";
    String chatmate_pnl = "chatmate_pnl";
    private final Element mainChatPanel;
    private Element inputPanel;
    private final ScrollPanelControl ScrollPanelControl;

    private ChatControl() {


        PanelCreator createPanel = new PanelCreator();
        mainChatPanel = createPanel.create(nifty, screen, parent);
        mainChatPanel.setLayoutManager(new VerticalLayout());


        createPanel = new PanelCreator();
        createPanel.setHeight("100%");
        createPanel.setChildLayout("overlay");
        createPanel.setBackgroundColor("#f00f");//testing purpose
        Element chatViewPanel = createPanel.create(nifty, screen, mainChatPanel);
        ScrollPanelControl = new ScrollPanelControl(nifty, screen, chatViewPanel);




        new ChatmatePanelDefinitionBuilder(chatmate_pnl)
                .registerControlDefintion(nifty);

        new ChatterPanelDefinitionBuilder(chatter_pnl)
                .registerControlDefintion(nifty);
    }

    static public ChatControl getInstance(Nifty nifty, Screen screen, Element parent) {
        synchronized (lock) {
            ChatControl.nifty = nifty;
            ChatControl.screen = screen;
            ChatControl.parent = parent;

            if (chatControl == null) {
                chatControl = new ChatControl();
            }
        }
        return chatControl;
    }

    public void addLocalMessage(String message_id, final String msg, final String full_name, final Date date, final String photo_filename) {
        ControlBuilder chatterBuilder = new ControlBuilder(message_id, chatter_pnl) {
                                  {
                                      parameter("full_name", full_name);
                                      parameter("chat_message", msg);
                                      parameter("message_time", date == null ? "" : date.toString());
                                      parameter("photo_filename", photo_filename);
                                  }
                              };
        
        this.ScrollPanelControl.addElement(chatterBuilder, nifty, screen);
    }

    public void addRemoteMessage(String message_id, final String msg, final String full_name, final Date date, final String photo_filename) {
        
        ControlBuilder chatmateBuilder = new ControlBuilder(message_id, chatmate_pnl) {
                                  {
                                      parameter("full_name", full_name);
                                      parameter("chat_message", msg);
                                      parameter("message_time", date == null ? "" : date.toString());
                                      parameter("photo_filename", photo_filename);
                                  }
                              };
        
        this.ScrollPanelControl.addElement(chatmateBuilder, nifty, screen);

    }
}

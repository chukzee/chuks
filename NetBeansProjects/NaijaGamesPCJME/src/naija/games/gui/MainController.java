/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui;

import com.jme3.app.Application;
import com.jme3.app.state.AbstractAppState;
import com.jme3.app.state.AppStateManager;
import de.lessvoid.nifty.EndNotify;
import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.builder.ControlBuilder;
import de.lessvoid.nifty.builder.ControlDefinitionBuilder;
import de.lessvoid.nifty.builder.EffectBuilder;
import de.lessvoid.nifty.builder.ImageBuilder;
import de.lessvoid.nifty.builder.PanelBuilder;
import de.lessvoid.nifty.builder.TextBuilder;
import de.lessvoid.nifty.controls.Label;
import de.lessvoid.nifty.controls.NiftyControl;
import de.lessvoid.nifty.controls.button.builder.ButtonBuilder;
import de.lessvoid.nifty.controls.label.LabelControl;
import de.lessvoid.nifty.controls.label.builder.LabelBuilder;
import de.lessvoid.nifty.controls.listbox.ListBoxControl;
import de.lessvoid.nifty.controls.scrollpanel.builder.ScrollPanelBuilder;
import de.lessvoid.nifty.controls.textfield.builder.TextFieldBuilder;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.layout.manager.HorizontalLayout;
import de.lessvoid.nifty.layout.manager.VerticalLayout;
import de.lessvoid.nifty.screen.DefaultScreenController;
import de.lessvoid.nifty.screen.Screen;
import de.lessvoid.nifty.screen.ScreenController;
import de.lessvoid.nifty.tools.Color;
import de.lessvoid.nifty.tools.SizeValue;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import naija.games.gui.builder.ChatterPanelDefinitionBuilder;
import naija.games.gui.builder.FriendListItemDefinitionBuilder;
import naija.games.gui.control.FriendsControl;
import naija.games.gui.builder.FriendsHeaderDefinitionBuilder;
import naija.games.gui.builder.LeftPanelBuilder;
import naija.games.gui.builder.RightPanelBuilder;
import naija.games.gui.control.ChatControl;
import naija.games.gui.control.CommentControl;
import naija.games.gui.control.ScrollPanelControl;

public class MainController extends AbstractAppState implements ScreenController {

    private Application app;
    private AppStateManager stateManager;
    private Nifty nifty;
    private Screen screen;
    private Element toolbarPanel;
    private Element friendsPanel;
    private Element liveGamesPanel;
    private Element makeFriendsPanel;
    private Element friendRequestPanel;
    private Element tournamentPanel;
    private Element chatAreaPanel;
    private Element chatInputPanel;
    private Element commentsAreaPanel;
    private Element commentsInputPanel;
    private Element gameStatisticsPanel;
    private Element currentShowingLeftPanel;
    private Element currentShowingRightPanel;
    public Element main_layer;
    public EffectBuilder moveOutLeftEffect;
    public EffectBuilder moveInLeftEffect;
    public EffectBuilder moveOutRightEffect;
    public EffectBuilder moveInRightEffect;
    public EffectBuilder fadeInEffect;
    public EffectBuilder fadeOutEffect;
    private Element btnSendComment;
    private Element txtComment;
    private Element txtChatMessage;
    private Element btnSendChatMessage;

    public MainController() {
    }

    public void bind(Nifty nifty, Screen screen) {
        this.nifty = nifty;
        this.screen = screen;
    }

    public void onStartScreen() {
    }

    public void onEndScreen() {
    }

    @Override
    public void initialize(AppStateManager stateManager, Application app) {
        this.app = app;
        this.stateManager = stateManager;
        main_layer = screen.findElementByName("main_layer");

        createEffects();

        createToolbarPanel(true);

        //LHS panels
        this.friendsPanel = createLeftPanel("friends_panel", true);
        this.friendRequestPanel = createLeftPanel("friend_request_panel", false);
        this.liveGamesPanel = createLeftPanel("live_games_panel", false);
        this.makeFriendsPanel = createLeftPanel("make_friends_panel", false);
        this.tournamentPanel = createLeftPanel("tournaments_panel", false);

        //RHS panels                
        this.gameStatisticsPanel = createRightPanel("game_stats_panel", false);
        this.chatAreaPanel = createChatAreaPanel("chat_area_panel", true);
        this.chatInputPanel = createChatInputPanel("chat_input_panel", true);
        this.commentsAreaPanel = createCommentsAreaPanel("comments_area_panel", false);
        this.commentsInputPanel = createCommentsInputPanel("comments_input_panel", false);

        testFriendsPanelContents();//TESTING
        testChatMessageContents();//TESTING
        //testCommentsMessageContents();//TESTING

        /*
         new Thread(new Runnable() {
         public void run() {
         try {
         Thread.sleep(15000);
         } catch (InterruptedException ex) {
         Logger.getLogger(MainController.class.getName()).log(Level.SEVERE, null, ex);
         }

         final Element e = screen.findElementByName("friends_panel");
         hideLeftPanel(e);

         try {
         Thread.sleep(5000);
         } catch (InterruptedException ex) {
         Logger.getLogger(MainController.class.getName()).log(Level.SEVERE, null, ex);
         }

         showLeftPanel(e);
         }
         }).start();
         */

    }

    private void createEffects() {
        moveOutLeftEffect = new EffectBuilder("move");
        moveOutLeftEffect.effectParameter("mode", "out");
        moveOutLeftEffect.effectParameter("direction", "left");
        moveOutLeftEffect.effectParameter("length", "500");

        moveInLeftEffect = new EffectBuilder("move");
        moveInLeftEffect.effectParameter("mode", "in");
        moveInLeftEffect.effectParameter("direction", "left");
        moveInLeftEffect.effectParameter("length", "500");


        moveOutRightEffect = new EffectBuilder("move");
        moveOutRightEffect.effectParameter("mode", "out");
        moveOutRightEffect.effectParameter("direction", "right");
        moveOutRightEffect.effectParameter("length", "500");

        moveInRightEffect = new EffectBuilder("move");
        moveInRightEffect.effectParameter("mode", "in");
        moveInRightEffect.effectParameter("direction", "right");
        moveInRightEffect.effectParameter("length", "500");

        fadeInEffect = new EffectBuilder("fade");
        fadeInEffect.effectParameter("start", "#0");
        fadeInEffect.effectParameter("end", "#f");
        fadeInEffect.effectParameter("length", "500");

        fadeOutEffect = new EffectBuilder("fade");
        fadeOutEffect.effectParameter("start", "#f");
        fadeOutEffect.effectParameter("end", "#0");
        fadeOutEffect.effectParameter("length", "500");


    }

    private void createToolbarPanel(boolean show) {

        toolbarPanel = new PanelBuilder() {
            {
                //style("nifty-panel");
                id("toolbar_panel");
                width("100%");
                height("40px");
                backgroundColor("#fff4");

                valignTop();
            }
        }.build(nifty, screen, main_layer);

        if (!show) {
            toolbarPanel.markForRemoval();
        }
    }

    Element createLeftPanel(String id, boolean show) {

        Element element = new LeftPanelBuilder(id, this)
                .build(nifty, screen, main_layer);

        if (!show) {
            element.markForRemoval();
        } else {
            this.currentShowingLeftPanel = element;
        }

        return element;
    }

    Element createRightPanel(String id, boolean show) {

        Element element = new RightPanelBuilder(id, this)
                .build(nifty, screen, main_layer);


        if (!show) {
            element.markForRemoval();
        } else {
            this.currentShowingRightPanel = element;
        }

        return element;
    }

    Element createChatAreaPanel(String id, boolean show) {

        Element element = new RightPanelBuilder(id, this)
                .build(nifty, screen, main_layer);

        int input_height = 100;
        element.setConstraintHeight(SizeValue.px(element.getHeight() - input_height));


        if (!show) {
            element.markForRemoval();
        } else {
            this.currentShowingRightPanel = element;
        }

        return element;
    }

    Element createChatInputPanel(String id, boolean show) {

        Element element = new RightPanelBuilder(id, this)
                .build(nifty, screen, main_layer);

        element.setConstraintHeight(SizeValue.px(100));

        int y = this.chatAreaPanel.getY() + this.chatAreaPanel.getHeight();

        element.setConstraintY(SizeValue.px(y));

        txtChatMessage = new LabelBuilder("label") {
            {
                label("Chat");
                marginBottom("2px");
                alignLeft();
            }
        }
                .build(nifty, screen, element);

        Element tx = new TextFieldBuilder("textfield") {
            {
                marginBottom("2px");
            }
        }
                .build(nifty, screen, element);


        btnSendChatMessage = new ButtonBuilder("button") {
            {
                interactOnClick("sendChatMessage()");//great!!! - nifty will call this method using java reflection
                label("Send");
                width("100%");
                alignRight();
            }
        }
                .build(nifty, screen, element);

        if (!show) {
            element.markForRemoval();
        } else {
            this.currentShowingRightPanel = element;
        }

        return element;
    }

    Element createCommentsAreaPanel(String id, boolean show) {

        Element element = new RightPanelBuilder(id, this)
                .build(nifty, screen, main_layer);

        int input_height = 100;
        element.setConstraintHeight(SizeValue.px(element.getHeight() - input_height));

        if (!show) {
            element.markForRemoval();
        } else {
            this.currentShowingRightPanel = element;
        }

        return element;
    }

    Element createCommentsInputPanel(String id, boolean show) {

        Element element = new RightPanelBuilder(id, this)
                .build(nifty, screen, main_layer);

        element.setConstraintHeight(SizeValue.px(100));
        int y = this.commentsAreaPanel.getY() + this.commentsAreaPanel.getHeight();

        element.setConstraintY(SizeValue.px(y));

        Element lb = new LabelBuilder("label") {
            {
                label("Make your comment");
                marginBottom("2px");
                alignLeft();
            }
        }
                .build(nifty, screen, element);

        txtComment = new TextFieldBuilder("textfield") {
            {
                marginBottom("2px");
            }
        }
                .build(nifty, screen, element);


        btnSendComment = new ButtonBuilder("button") {
            {
                interactOnClick("sendComment()");//great!!! - nifty will call this method using java reflection
                label("Send my opinion");
                width("100%");
                alignRight();

            }
        }
                .build(nifty, screen, element);



        if (!show) {
            element.markForRemoval();
        } else {
            this.currentShowingRightPanel = element;
        }

        return element;
    }

    void testFriendsPanelContents() {


        FriendsControl friendsControl = FriendsControl.getInstance(nifty, screen, friendsPanel);

        friendsControl.setNumbersOnline(3, 53);

        friendsControl.addFriend("chuks1", "chuks alimele", "naija/games/images/BVN_54.png", true, "playing");
        friendsControl.addFriend("chuks2", "amos akpo", "naija/games/images/BVN_54.png", false, "idle");
        friendsControl.addFriend("chuks3", "jame ani", "naija/games/images/BVN_54.png", true, "playing");
        friendsControl.addFriend("chuks4", "godwin eroro", "naija/games/images/BVN_54.png", true, "playing");
        friendsControl.addFriend("chuks5", "frank owan", "naija/games/images/BVN_54.png", false, "playing");
        friendsControl.addFriend("chuks6", "goni faran", "naija/games/images/BVN_54.png", false, "idle");
        //friendsControl.addFriend("chuks7", "chuks alimele", "naija/games/images/BVN_54.png", false);


    }

    void testChatMessageContents() {

        final ChatControl chatControl = ChatControl.getInstance(nifty, screen, chatAreaPanel);

        chatControl.addLocalMessage("msg1", "this is message from mark vivan", "mark vivan", new Date(), "naija/games/images/BVN_54.png");

        chatControl.addRemoteMessage("msg2", "this is message from idona iluma", "idona iluma", new Date(), "naija/games/images/BVN_54.png");

        chatControl.addRemoteMessage("msg3", "this is message from fred wano", "fred wano", new Date(), "naija/games/images/BVN_54.png");

        chatControl.addLocalMessage("msg4", "this is message from chuk owan", "chuk owan", new Date(), "naija/games/images/BVN_54.png");

        chatControl.addRemoteMessage("msg5", "this is message from peter emani", "peter emani", new Date(), "naija/games/images/BVN_54.png");

        new Thread(new Runnable() {
            public void run() {
                try {
                    Thread.sleep(20000);
                    System.out.println("adding new chat message");
                
                    chatControl.addLocalMessage("msg6", "this is message from ororo ino", "ororo ino", new Date(), "naija/games/images/BVN_54.png");
                
                    Thread.sleep(5000);
                    System.out.println("adding new chat message");

                    chatControl.addLocalMessage("msg7", "this is message from ororo7 ino", "ororo7 ino", new Date(), "naija/games/images/BVN_54.png");
                
                    Thread.sleep(5000);
                    System.out.println("adding new chat message");

                    chatControl.addLocalMessage("msg8", "this is message from ororo8 ino", "ororo8 ino", new Date(), "naija/games/images/BVN_54.png");
                
                } catch (InterruptedException ex) {
                    Logger.getLogger(MainController.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }).start();


    }

    void testCommentsMessageContents() {

        CommentControl commentControl = CommentControl.getInstance(nifty, screen, commentsAreaPanel);

        commentControl.addComment("comment_id1", "this is comment", "jame okoro", new Date(), "naija/games/images/BVN_54.png");

        commentControl.addReply("comment_id1", "reply_id1", "this is reply", "mike inoma", new Date(), "naija/games/images/BVN_54.png");

        commentControl.setNumberOfReplies("comment_id1", 5);

        commentControl.setCommentLikes("comment_id1", 42);
        commentControl.setCommentDislikes("comment_id1", 3);

        commentControl.setReplyLikes("comment_id1", 57);
        commentControl.setReplyDislikes("comment_id1", 23);


    }

    void showLeftPanel(Element e) {
        if (e.getX() != 0) {
            throw new IllegalStateException("Left panel x location must be zero."
                    + "\nHint : must sure it is left panel you are accessing ");
        }

        if (this.currentShowingLeftPanel != null) {
            currentShowingLeftPanel.hide(new EndNotify() {
                public void perform() {
                    currentShowingLeftPanel.markForRemoval();
                }
            });
        }

        this.main_layer.addChild(e);
        e.show();
        currentShowingLeftPanel = e;
    }

    void hideLeftPanel(final Element e) {
        if (e.getX() != 0) {
            throw new IllegalStateException("Left panel x location must be zero."
                    + "\nHint : must sure it is left panel you are accessing ");
        }

        e.hide(new EndNotify() {
            public void perform() {
                e.markForRemoval();
                if (e.equals(currentShowingLeftPanel)) {
                    currentShowingLeftPanel = null;
                }
            }
        });

    }

    void showRightPanel(Element e) {
        if (e.getX() <= 0) {
            throw new IllegalStateException("Right panel x location must be greater than zero."
                    + "\nHint : must sure it is right panel you are accessing ");
        }

        if (this.currentShowingRightPanel != null) {
            currentShowingRightPanel.hide(new EndNotify() {
                public void perform() {
                    currentShowingRightPanel.markForRemoval();
                }
            });
        }

        this.main_layer.addChild(e);
        e.show();
        currentShowingRightPanel = e;
    }

    void hideRightPanel(final Element e) {
        if (e.getX() <= 0) {
            throw new IllegalStateException("Right panel x location must be greater than zero."
                    + "\nHint : must sure it is right panel you are accessing ");
        }

        e.hide(new EndNotify() {
            public void perform() {
                e.markForRemoval();
                if (e.equals(currentShowingRightPanel)) {
                    currentShowingRightPanel = null;
                }
            }
        });

    }

    public void sendComment() {
        System.out.println("sendComment() clicked! woohoo!");
    }

    public void sendChatMessage() {
        System.out.println("sendChatMessage() clicked! woohoo!");
    }
}
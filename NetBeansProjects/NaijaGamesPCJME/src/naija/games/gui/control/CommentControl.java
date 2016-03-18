/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.control;

import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.builder.ControlBuilder;
import de.lessvoid.nifty.controls.dynamic.PanelCreator;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.elements.render.TextRenderer;
import de.lessvoid.nifty.layout.align.HorizontalAlign;
import de.lessvoid.nifty.layout.manager.LayoutManager;
import de.lessvoid.nifty.layout.manager.VerticalLayout;
import de.lessvoid.nifty.screen.Screen;
import de.lessvoid.nifty.tools.SizeValue;
import java.util.Date;
import naija.games.gui.builder.ChatmatePanelDefinitionBuilder;
import naija.games.gui.builder.ChatterPanelDefinitionBuilder;
import naija.games.gui.builder.CommentMainDefinitionBuilder;
import naija.games.gui.builder.CommentReplyDefinitionBuilder;

/**
 *
 * @author USER
 */
public class CommentControl {

    static private CommentControl chatControl;
    static final private Object lock = new Object();
    static Nifty nifty;
    static Screen screen;
    static Element parent;
    String comment_main_pnl = "comment_main_pnl";
    String comment_reply_pnl = "comment_reply_pnl";
    private final Element mainCommentPanel;
    private  final ScrollPanelControl ScrollPanelControl;

    private CommentControl() {


        PanelCreator createPanel = new PanelCreator();
        mainCommentPanel = createPanel.create(nifty, screen, parent);
        mainCommentPanel.setLayoutManager(new VerticalLayout());
        
        
        createPanel = new PanelCreator();
        createPanel.setHeight("100%");
        createPanel.setChildLayout("overlay");
        createPanel.setBackgroundColor("#f00f");//testing purpose
        Element commentViewPanel = createPanel.create(nifty, screen, mainCommentPanel);
        ScrollPanelControl = new ScrollPanelControl(nifty, screen, commentViewPanel);



             
        new CommentMainDefinitionBuilder(comment_main_pnl)
                .registerControlDefintion(nifty);

        new CommentReplyDefinitionBuilder(comment_reply_pnl)
                .registerControlDefintion(nifty);
    }

    static public CommentControl getInstance(Nifty nifty, Screen screen, Element parent) {
        synchronized (lock) {
            CommentControl.nifty = nifty;
            CommentControl.screen = screen;
            CommentControl.parent = parent;

            if (chatControl == null) {
                chatControl = new CommentControl();
            }
        }
        return chatControl;
    }

    public void setNumberOfReplies(String comment_id, int num_replies){
        if(num_replies<=0)
            return;
        Element element = ScrollPanelControl.findElementById(comment_id+"_view_reply_id");
        if(element==null)
            return;
        TextRenderer rederer = element.getRenderer(TextRenderer.class);        
        rederer.setText("View "+num_replies+(num_replies>1?" replies":" reply"));        
    }

    public void setCommentLikes(String comment_id, int num_likes){

        Element element = ScrollPanelControl.findElementById(comment_id+"_likes_id");
        if(element==null)
            return;
        TextRenderer rederer = element.getRenderer(TextRenderer.class);
        rederer.setTextHAlign(HorizontalAlign.right);
        rederer.setText(num_likes+"");             
    }

    public void setCommentDislikes(String comment_id, int num_dislikes){

        Element element = ScrollPanelControl.findElementById(comment_id+"_dislikes_id");
        if(element==null)
            return;
        TextRenderer rederer = element.getRenderer(TextRenderer.class);        
        rederer.setTextHAlign(HorizontalAlign.right);
        rederer.setText(num_dislikes+"");          
    }

    public void setReplyLikes(String reply_id, int num_likes){

        Element element = ScrollPanelControl.findElementById(reply_id+"_likes_id");
        if(element==null)
            return;
        TextRenderer rederer = element.getRenderer(TextRenderer.class);        
        rederer.setTextHAlign(HorizontalAlign.right);
        rederer.setText(num_likes+"");           
    }

    public void setReplyDislikes(String reply_id, int num_dislikes){

        Element element = ScrollPanelControl.findElementById(reply_id+"_dislikes_id");
        if(element==null)
            return;
        TextRenderer rederer = element.getRenderer(TextRenderer.class);        
        rederer.setTextHAlign(HorizontalAlign.right);
        rederer.setText(num_dislikes+"");           
    }
                
    public void addComment(final String comment_id, final String msg, final String full_name, final Date date, final String photo_filename) {
        ControlBuilder commentBuider = new ControlBuilder(comment_id, comment_main_pnl){
                           {
                               //REMIND: CARE MUST BE TAKEN THAT IN NO TIME SHOULD THE comment_id 
                               //A reply_id BE THE SAME. ALL IDS MUST BE PERFECTLY UNIQUE IRRESPECTIVE
                               //WHETHER comment_id OR reply_id WHATEVER!!! - ALWAYS REMEMBER ABEG O!!!
                                   parameter("comment_id", comment_id);
                                   parameter("likes_id", comment_id+"_likes_id");
                                   parameter("dislikes_id", comment_id+"_dislikes_id");
                                   parameter("view_reply_id", comment_id+"_view_reply_id");
                                   parameter("replies_container_id", comment_id+"_replies_container_id");
                                   parameter("comment", msg);
                                   parameter("full_name", full_name);
                                   parameter("comment_time", date==null?"":date.toString());
                                   parameter("photo_filename", photo_filename);
                               
                           }
                       };
        
        ScrollPanelControl.addElement(commentBuider, nifty, screen);
    }

    public void addReply(final String comment_id, final String reply_id, final String msg, final String full_name, final Date date, final String photo_filename) {
        
        Element coment_panel = ScrollPanelControl.findElementById(comment_id);
        
        Element reply_container = coment_panel.findElementById(comment_id+"_replies_container_id");
        
        Element replyPanel = new ControlBuilder(reply_id, comment_reply_pnl){
            {
                //REMIND: CARE MUST BE TAKEN THAT IN NO TIME SHOULD THE comment_id 
                //A reply_id BE THE SAME. ALL IDS MUST BE PERFECTLY UNIQUE IRRESPECTIVE
                //WHETHER comment_id OR reply_id WHATEVER!!! - ALWAYS REMEMBER ABEG O!!!
                    parameter("reply_id", reply_id);
                    parameter("likes_id", reply_id+"_likes_id");
                    parameter("dislikes_id", reply_id+"_dislikes_id");              
                    parameter("reply", msg);
                    parameter("full_name", full_name);
                    parameter("reply_time", date==null?"":date.toString());
                    parameter("photo_filename", photo_filename);
            }
        }
                .build(nifty, screen, reply_container);
        
    }
}

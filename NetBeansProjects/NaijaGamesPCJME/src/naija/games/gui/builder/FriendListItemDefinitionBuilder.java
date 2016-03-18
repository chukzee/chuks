/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.builder;

import de.lessvoid.nifty.builder.ControlDefinitionBuilder;
import de.lessvoid.nifty.builder.ImageBuilder;
import de.lessvoid.nifty.builder.PanelBuilder;
import de.lessvoid.nifty.builder.TextBuilder;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.tools.Color;

/**
 *
 * @author USER
 */
public class FriendListItemDefinitionBuilder extends ControlDefinitionBuilder{
 
    public FriendListItemDefinitionBuilder(String name, final Element parent){
            
            super(name);
            System.out.println("parent width = "+parent.getWidth());
            System.out.println("parent constraint width = "+parent.getConstraintWidth());
            final int person_photo_size = 35;
            final int online_indicator_size = 7;
            final int panel_width = parent.getWidth()-40;            
            final int friend_detail_width = panel_width - person_photo_size - online_indicator_size;
            
            controller("naija.games.gui.control.FriendListItemController");
            interactOnClick("friendClicked()");
            //inputMapping("de.lessvoid.nifty.input.mapping.MenuInputMapping");
            //style("nifty-panel");
            
            panel(new PanelBuilder("friend_panel") {
                {
                    //style("#panel");
                    focusable(true);
                    childLayoutHorizontal();
                    padding("5px");
                    //marginBottom("2px");
                    backgroundColor(new Color("#fff3"));
                    width((parent.getWidth()-40)+"px");        
                    height("50px");
                    image(new ImageBuilder("#online_indicator") {
                        {
                            id("$online_indicator_id");
                            style("nifty-image");
                            marginRight("8px");
                            width(online_indicator_size+"px");
                            height(get("width"));
                            filename("$online_indicator_image_filename");
                        }
                    });

                    image(new ImageBuilder("#friend_image") {
                        {
                            style("nifty-image");
                            width(person_photo_size+"px");
                            height(get("width"));
                            filename("$photo_filename");
                        }
                    });

                    panel(new PanelBuilder("#friend_detail"){
                        {
                            marginLeft("5px");
                            childLayoutVertical();
                            width(friend_detail_width - 10+"px");
                            backgroundColor(new  Color("#000e"));
                            height("52px");//create beautiful overlap
                            System.out.println("width = "+get("width"));
                            //REMIND : IF FULL NAME IS TOO LONG THEN USE FIRST NAME AND THE INITIALS e.g Onyeka A.
                            //REMIND : ALSO IF THE FIRST NAME IS TOO LONG THEN USE THE FIRST 8 CHARACTER FOLLOWED BY '...' e.g thisverylongname BECOMES thisveryl...
                            text(new TextBuilder("#friend_full_name"){
                                {
                                    text("$full_name");//must contain a text - I do not know why.
                                    childClip(true);
                                    x("0px");
                                    alignLeft();
                                    marginLeft("5px");
                                    //childLayoutAbsolute();
                                    //width("100%");
                                    style("nifty-label");
                                }
                            });
                            
                                               
                            text(new TextBuilder("#activity"){
                                {
                                    id("$activity_id");
                                    childClip(true);
                                    text("$activity");//must contain a text - I do not know why.
                                    //childLayoutAbsolute();
                                    alignCenter();
                                    //width("100%");
                                    marginLeft("5px");
                                    style("nifty-label");
                                }
                            });
                            
                        }
                    });
                }
            });
        

    }
}

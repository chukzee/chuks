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
public class ChatterPanelDefinitionBuilder extends ControlDefinitionBuilder {

    public ChatterPanelDefinitionBuilder(String name ) {
        super(name);


        /*
          _______________________________
         |      | full name______________|
         |image |     message body       |
         |______|________________________|
         |______________time_____________|
         
         */

        //chatter
        
        
        //controller("de.lessvoid.nifty.controls.button.ButtonControl");
        //inputMapping("de.lessvoid.nifty.input.mapping.MenuInputMapping");
        //style("nifty-panel");
        panel(new PanelBuilder("chatter_panel") {
            {
                childLayoutHorizontal();
                margin("2px");
                width(300+"px");
                //backgroundColor("#3ff");
                
                image(new ImageBuilder("#chat_image") {//chatter image
                    {
                        style("nifty-image");
                        width("40px");
                        height(get("width"));
                        filename("$photo_filename");
                    }
                });
                
                panel(new PanelBuilder() {//for aligning the chat area
                    {

                        childLayoutVertical();
                        //width("100%");
                        backgroundColor("#a75");

                        panel(new PanelBuilder() {//comprises of full name , message and time
                            {
                                childLayoutVertical();
                                width("100%");
                                backgroundColor("#33f");

                                text(new TextBuilder("#full_name") {//fullname
                                    {
                                        backgroundColor(Color.BLACK);
                                        marginLeft("5px");
                                        text("$full_name");
                                        style("nifty-label");
                                        alignLeft();
                                    }
                                });

                                text(new TextBuilder("#message_body") {//the message
                                    {
                                        text("$chat_message");
                                        style("nifty-label");

                                        wrap(true);//does not work properly so the workaround 
                                        //is to ignore the wrap method
                                        //and format the text with new line character 
                                        //when the text get too long
                                        
                                        //GOOD NEWS !!! wrap(true) works in newer version of nifty - i.e version 1.4.1

                                    }
                                });


                                text(new TextBuilder("#message_time") {//time
                                    {
                                        
                                        backgroundColor(Color.BLACK);
                                        marginRight("2px");
                                        text("$message_time");
                                        style("nifty-label");
                                        alignRight();//not working! - i don't know why 
                                        //the workaround could be
                                        //to add trailing space
                                    }
                                });
                            }
                        });

                    }
                });

            }
        });

    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.builder;

import de.lessvoid.nifty.builder.ControlDefinitionBuilder;
import de.lessvoid.nifty.builder.ImageBuilder;
import de.lessvoid.nifty.builder.PanelBuilder;
import de.lessvoid.nifty.builder.TextBuilder;
import de.lessvoid.nifty.controls.label.builder.LabelBuilder;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.tools.Color;

/**
 *
 * @author USER
 */
public class CommentReplyDefinitionBuilder extends ControlDefinitionBuilder {

    public CommentReplyDefinitionBuilder(String name) {
        super(name);


        /*
         _________________________________________________
         |      |full name________________time ago________|
         |photo |    message body                         |
         |      |_________________________________________|
         |______|___reply link___3__like/dislike images___|
         */


        //controller("de.lessvoid.nifty.controls.button.ButtonControl");
        //inputMapping("de.lessvoid.nifty.input.mapping.MenuInputMapping");
        //style("nifty-panel");
        panel(new PanelBuilder("comment_reply_panel") {
            {
                childLayoutHorizontal();
                id("$reply_id");

                image(new ImageBuilder("#comment_reply_image") {//replier image
                    {
                        style("nifty-image");
                        width("20px");
                        height(get("width"));
                        filename("$photo_filename");
                    }
                });

                panel(new PanelBuilder() {
                    {

                        childLayoutVertical();
                        width("100%");
                        backgroundColor("#f75");

                        text(new TextBuilder("#comment_time_ago") {//time
                            {

                                backgroundColor(Color.BLACK);
                                marginRight("5px");
                                text("$reply_time");
                                style("nifty-label");
                                alignRight();//not working! - i don't know why 
                                //the workaround could be
                                //to add trailing space
                            }
                        });

                        text(new TextBuilder("#full_name") {//fullname
                            {
                                marginLeft("5px");
                                text("$full_name");
                                style("nifty-label");
                                alignLeft();
                            }
                        });

                        text(new TextBuilder("#comment_body") {//the message
                            {
                                text("$reply");
                                wrap(true);
                                style("nifty-label");
                                alignLeft();

                            }
                        });

                        panel(new PanelBuilder() {
                            {
                                childLayoutHorizontal();
                                width("100%");
                                text(new TextBuilder("#reply_link") {//reply link
                                    {
                                        marginLeft("5px");
                                        text("Reply");
                                        style("nifty-label");
                                        alignLeft();
                                    }
                                });

                                text(new TextBuilder("#number_of_likes") {//number of likes
                                    {
                                        id("$likes_id");
                                        marginLeft("2px");
                                        width("30px");
                                        text("$number_of_likes");
                                        style("nifty-label");
                                    }
                                });

                                image(new ImageBuilder("#like_image") {//like image
                                    {
                                        style("nifty-image");
                                        marginLeft("2px");
                                        width("12px");
                                        height(get("width"));
                                        filename("naija/games/images/BVN_54.png");
                                    }
                                });

                                text(new TextBuilder("#number_of_dislikes") {//number of dislikes
                                    {
                                        id("$dislikes_id");
                                        marginLeft("2px");
                                        width("30px");
                                        text("$number_of_dislikes");
                                        style("nifty-label");
                                    }
                                });

                                image(new ImageBuilder("#dislike_image") {//dislike image
                                    {
                                        marginLeft("2px");
                                        style("nifty-image");
                                        width("12px");
                                        height(get("width"));
                                        filename("naija/games/images/BVN_54.png");
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

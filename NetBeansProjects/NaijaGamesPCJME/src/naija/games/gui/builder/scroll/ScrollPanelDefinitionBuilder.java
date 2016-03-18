/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.builder.scroll;

import de.lessvoid.nifty.builder.ControlDefinitionBuilder;
import de.lessvoid.nifty.builder.ImageBuilder;
import de.lessvoid.nifty.builder.PanelBuilder;
import de.lessvoid.nifty.elements.Element;

/**
 *
 * @author USER
 */
public class ScrollPanelDefinitionBuilder extends ControlDefinitionBuilder {

    public ScrollPanelDefinitionBuilder(String name, Element parent, int abituary_size_minus) {
        super(name);

        final int scrollbar_size = 10;

        final int parent_width = parent.getWidth() - abituary_size_minus;
        final int parent_height = parent.getHeight() - abituary_size_minus;

        final int content_width = parent_width - scrollbar_size;
        final int content_height = parent_height - scrollbar_size;

        System.out.println("content_width " + content_width);

        controller("naija.games.gui.control.ScrollPanelController");
        //inputMapping("de.lessvoid.nifty.input.mapping.MenuInputMapping");
        //style("nifty-panel");
        panel(new PanelBuilder("scroll_panel") {
            {
                childLayoutVertical();
                width(parent_width + "px");
                height(parent_height + "px");
                backgroundColor("#333");//testing purpose
                panel(new PanelBuilder() {
                    {
                        childLayoutHorizontal();
                        childClip(true);//clip the content
                        width(parent_width + "px");
                        height(content_height + "px");
                        panel(new PanelBuilder("content_container_holder") {
                            {
                                childLayoutAbsolute();//set absolute to enable the movement of the content_container_handle
                                width(content_width + "px");
                                height(content_height + "px");
                                backgroundColor("#335");
                                panel(new PanelBuilder("content_container_handle") {//the handle for moving the base panel (ie the content container) 
                                    {
                                        x("0px");
                                        y("0px");
                                        childLayoutVertical();//important !!! must be vertical layout - overlay does not give desired behaviour!
                                        width(content_width + "px");
                                        height(content_height + "px");
                                        backgroundColor("#000");//testing purpose

                                        panel(new PanelBuilder("content_container") {
                                            {
                                                id("content_container");
                                                childLayoutVertical();
                                                backgroundColor("#fff");//testing purpose

                                                //to be populated dynamically by the content
                                            }
                                        });
                                    }
                                });
                            }
                        });

                        panel(new PanelBuilder("vertical_scrollbar") {
                            {
                                childLayoutVertical();
                                width(scrollbar_size + "px");
                                height(content_height + "px");

                                panel(new PanelBuilder("up_arrow_control") {
                                    {
                                        interactOnClick("onClickUpArrow()");
                                        childLayoutCenter();
                                        width(scrollbar_size + "px");
                                        height(scrollbar_size + "px");
                                        //backgroung up arrow image
                                        backgroundImage("naija/games/images/BVN_54.png");
                                        //filename("naija/games/images/BVN_54.png");
                                    }
                                });

                                panel(new PanelBuilder("vertical_track") {
                                    {
                                        childLayoutAbsolute();
                                        width(scrollbar_size + "px");
                                        height((content_height - 2 * scrollbar_size) + "px");
                                        backgroundColor("#555");//testing purpose

                                        panel(new PanelBuilder("vertical_up_track") {
                                            {
                                                x("0px");
                                                y("0px");
                                                width(scrollbar_size + "px");
                                                height("0px");
                                                backgroundColor("#00f");//testing purpose
                                                interactOnClick("onClickVerticalUpTrack()");
                                            }
                                        });

                                        panel(new PanelBuilder("vertical_down_track") {
                                            {
                                                x("0px");
                                                y("100%");
                                                width(scrollbar_size + "px");
                                                height("0px");
                                                backgroundColor("#f00");//testing purpose
                                                interactOnClick("onClickVerticalDownTrack()");
                                            }
                                        });

                                        panel(new PanelBuilder("vertical_slide_bar") {
                                            {
                                                x("0px");
                                                y("0px");
                                                interactOnClickMouseMove("onDragVerticalSlideBar()");
                                                interactOnRelease("onReleaseVerticalSlideBar()");
                                                childLayoutCenter();
                                                width(scrollbar_size + "px");
                                                height((content_height - 2 * scrollbar_size) + "px");
                                                backgroundColor("#888");//testing purpose

                                            }
                                        });
                                    }
                                });

                                panel(new PanelBuilder("down_arrow_control") {
                                    {
                                        interactOnClick("onClickDownArrow()");
                                        childLayoutCenter();
                                        width(scrollbar_size + "px");
                                        height(scrollbar_size + "px");
                                        //backgroung down arrow image
                                        backgroundImage("naija/games/images/BVN_54.png");
                                        //filename("naija/games/images/BVN_54.png");
                                    }
                                });

                            }
                        });

                    }
                });

                panel(new PanelBuilder("horizontal_scrollbar") {
                    {
                        childLayoutHorizontal();
                        panel(new PanelBuilder("left_arrow_control") {
                            {
                                interactOnClick("onClickLeftArrow()");
                                childLayoutCenter();
                                width(scrollbar_size + "px");
                                height(scrollbar_size + "px");
                                //backgroung left arrow image
                                backgroundImage("naija/games/images/BVN_54.png");
                                //filename("naija/games/images/BVN_54.png");
                            }
                        });

                        panel(new PanelBuilder("horizontal_track") {
                            {
                                childLayoutAbsolute();
                                width((content_width - 2 * scrollbar_size) + "px");
                                height(scrollbar_size + "px");
                                backgroundColor("#555");//testing purpose

                                panel(new PanelBuilder("horizontal_left_track") {
                                    {
                                        x("0px");
                                        y("0px");
                                        width("0px");
                                        height(scrollbar_size + "px");
                                        backgroundColor("#00f");//testing purpose
                                        interactOnClick("onClickHorizontalLeftTrack()");
                                    }
                                });

                                panel(new PanelBuilder("horizontal_right_track") {
                                    {
                                        x("100%");
                                        y("0px");
                                        width("0px");
                                        height(scrollbar_size + "px");
                                        backgroundColor("#f00");//testing purpose
                                        interactOnClick("onClickHorizontalRightTrack()");
                                    }
                                });

                                panel(new PanelBuilder("horizotal_slide_bar") {
                                    {
                                        x("0px");
                                        y("0px");
                                        interactOnClickMouseMove("onDragHorizontalSlideBar()");
                                        interactOnRelease("onReleaseHorizontalSlideBar()");
                                        childLayoutCenter();
                                        width((content_width - 2 * scrollbar_size) + "px");
                                        height(scrollbar_size + "px");
                                        backgroundColor("#888");//testing purpose
                                    }
                                });
                            }
                        });

                        panel(new PanelBuilder("right_arrow_control") {
                            {
                                interactOnClick("onClickRightArrow()");
                                childLayoutCenter();
                                width(scrollbar_size + "px");
                                height(scrollbar_size + "px");
                                //backgroung right arrow image
                                backgroundImage("naija/games/images/BVN_54.png");
                                //filename("naija/games/images/BVN_54.png");
                            }
                        });

                    }
                });
            }
        });
    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.builder;

import de.lessvoid.nifty.builder.ControlDefinitionBuilder;
import de.lessvoid.nifty.builder.ImageBuilder;
import de.lessvoid.nifty.builder.PanelBuilder;
import de.lessvoid.nifty.builder.TextBuilder;
import de.lessvoid.nifty.tools.Color;

/**
 *
 * @author USER
 */
public class FriendsHeaderDefinitionBuilder extends ControlDefinitionBuilder {

    public FriendsHeaderDefinitionBuilder(String name) {
        super(name);

        //controller("de.lessvoid.nifty.controls.button.ButtonControl");
        //inputMapping("de.lessvoid.nifty.input.mapping.MenuInputMapping");
        //style("nifty-panel");
        panel(new PanelBuilder() {
            {
                //style("#panel");
                focusable(true);
                childLayoutVertical();
                //padding("5px");

                text(new TextBuilder("#no_of_friends") {
                    {
                        id("no_of_friends");
                        style("nifty-label");
                        width("100%");
                    }
                });

                panel(new PanelBuilder() {
                    {
                        childLayoutHorizontal();
                        padding("5px");
                        focusable(true);

                        text(new TextBuilder("#previous_friends") {
                            {
                                marginRight("10px");
                                style("nifty-label");
                                padding("5px");
                                text("<<");
                            }
                        });

                        text(new TextBuilder("#next_friends") {
                            {
                                marginLeft("10px");
                                style("nifty-label");
                                padding("5px");
                                text(">>");
                            }
                        });

                    }
                });

                //draw a seperator
                panel(new PanelBuilder() {
                    {
                        backgroundColor(new Color("#0008"));
                        marginBottom("10px");
                        width("100%");
                        height("1px");
                    }
                });

            }
        });
    }
}

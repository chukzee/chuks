/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.builder;

import de.lessvoid.nifty.builder.PanelBuilder;
import naija.games.gui.MainController;

/**
 *
 * @author USER
 */
public class RightPanelBuilder extends PanelBuilder{
     
    public RightPanelBuilder(String id, MainController mmc){
        int width_percent = 25;
        int layer_width = mmc.main_layer.getWidth();
        int panel_width = (int) (width_percent /100.0*layer_width);
        int x_loc = layer_width - panel_width;
        style("nifty-panel");
        x(x_loc+"px");
        y("80px");
        id(id);
        width(panel_width+"px");
        height("80%");
        //backgroundColor("#0335");
        alignRight();
        onHideEffect(mmc.moveOutRightEffect);
        onShowEffect(mmc.moveInRightEffect);
        childLayout(ChildLayoutType.Vertical);
        childClip(true);

    }   
}

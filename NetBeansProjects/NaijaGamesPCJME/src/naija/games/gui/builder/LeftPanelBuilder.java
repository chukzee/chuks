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
public class LeftPanelBuilder extends PanelBuilder{
    
    public LeftPanelBuilder(String id, MainController mmc){
        style("nifty-panel");
        x("0px");
        y("80px");
        id(id);
        width("25%");
        height("80%");
        //backgrondColor("#0f08");
        alignLeft();
        onHideEffect(mmc.moveOutLeftEffect);
        onShowEffect(mmc.moveInLeftEffect);
        childLayout(ChildLayoutType.Vertical);
        
        //childClip(true);
    }
}

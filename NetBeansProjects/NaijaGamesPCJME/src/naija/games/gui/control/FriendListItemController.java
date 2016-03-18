/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.games.gui.control;

import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.controls.Parameters;
import de.lessvoid.nifty.elements.Element;
import de.lessvoid.nifty.input.NiftyInputEvent;
import de.lessvoid.nifty.screen.Screen;

/**
 *
 * @author USER
 */
public class FriendListItemController implements de.lessvoid.nifty.controls.Controller{
    private Element element;
    private Parameters parameters;
    
    public boolean friendClicked(){
        
        System.out.println("friendClicked() id = "+this.element.getId());
        
        System.out.println("paramenter username = "+parameters.get("username"));
        System.out.println("paramenter full_name = "+parameters.get("full_name"));
        
        return true;//prevent further propagation of the event
    }

    public void bind(Nifty nifty, Screen screen, Element elmnt, Parameters prmtrs) {
        this.element = elmnt;
        this.parameters = prmtrs;
    }

    public void init(Parameters prmtrs) {
    }

    public void onStartScreen() {
    }

    public void onFocus(boolean bln) {
    }

    public boolean inputEvent(NiftyInputEvent nie) {
        return true;
    }
    
}

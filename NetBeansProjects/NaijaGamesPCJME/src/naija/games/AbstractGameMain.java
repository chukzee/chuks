package naija.games;

import naija.games.gui.MainController;
import com.jme3.app.SimpleApplication;
import com.jme3.input.controls.ActionListener;
import com.jme3.material.Material;
import com.jme3.math.ColorRGBA;
import com.jme3.math.Vector3f;
import com.jme3.niftygui.NiftyJmeDisplay;
import com.jme3.renderer.RenderManager;
import com.jme3.scene.Geometry;
import com.jme3.scene.Spatial;
import com.jme3.scene.shape.Box;
import com.jme3.system.AppSettings;
import de.lessvoid.nifty.Nifty;
import de.lessvoid.nifty.screen.ScreenController;
import java.awt.Canvas;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import javax.swing.JOptionPane;
import org.lwjgl.opengl.Display;

/**
 * test
 *
 * @author normenhansen
 */
public abstract class AbstractGameMain extends SimpleApplication{
    private static double device_width;
    private static double device_height;
    private static int window_width;
    private static int window_height;
    private static int window_x_loc;
    private static int window_y_loc;
    private MainController mainController;
    
    public AbstractGameMain (){
        AppSettings settings = new AppSettings(true);
        settings.setRenderer(AppSettings.LWJGL_OPENGL1);

        double w_scale = 0.9;
        double h_scale = 0.85;
        configWindowBounds(w_scale, h_scale);
        settings.setWidth(window_width);
        settings.setHeight(window_height);
        Display.setLocation(window_x_loc, window_y_loc);
        //Display.setResizable(true);//I WILL NOT USE RESIZABLE

        
        setShowSettings(false);//don't show show dialog
        
        setDisplayStatView(false);//don't display statistics on scene
        setDisplayFps(false);//don't display frame per sec on scene
               
        setSettings(settings);

        start();
        
    }
    
    private static void configWindowBounds(double w_scale, double h_scale) {

        GraphicsEnvironment ge = GraphicsEnvironment.
                getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        Rectangle bounds = gd.getDefaultConfiguration().getBounds();

        device_width =  bounds.getWidth();
        device_height =  bounds.getHeight();
        window_width =  (int) (w_scale * device_width);
        window_height =  (int) (h_scale * device_height);
        window_x_loc = (int)(device_width - window_width)/2;
        window_y_loc = 20;//good position
    }

    @Override
    public void simpleInitApp() {

        mainController = new MainController();
        stateManager.attach(mainController);

        NiftyJmeDisplay niftyDisplay = new NiftyJmeDisplay(assetManager, inputManager, audioRenderer, guiViewPort);

        Nifty nifty = niftyDisplay.getNifty();

        guiViewPort.addProcessor(niftyDisplay);
        nifty.fromXml("Interface/MainLayout.xml", "start", mainController);

        //nifty.setDebugOptionPanelColors(true);

        viewPort.setBackgroundColor(ColorRGBA.LightGray);

        flyCam.setDragToRotate(true);
        
        showGameView();
        
    }

    public abstract void showGameView();

}

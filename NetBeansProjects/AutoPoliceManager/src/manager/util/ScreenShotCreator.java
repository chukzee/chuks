/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.util;

import java.awt.AWTException;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Label;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import manager.ui.extend.RoundedPanel;
import org.jdesktop.swingx.JXPanel;
import org.jdesktop.swingx.border.DropShadowBorder;

/**
 *
 * @author USER
 */
public final class ScreenShotCreator {
    
    public static void takeScreenShot(String save_to_location){
        try {
            Dimension screenSize  = Toolkit.getDefaultToolkit().getScreenSize();
            Rectangle screenRectangle = new Rectangle(screenSize);
            Robot robot = new Robot();
            BufferedImage image = robot.createScreenCapture(screenRectangle);
            ImageIO.write(image, "png", new File(save_to_location));
        } catch (AWTException ex) {
            Logger.getLogger(ScreenShotCreator.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(ScreenShotCreator.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public static void takeScreenShot(JComponent frame, String save_to_location){
        try {            
            Rectangle frmRec = frame.getBounds();
            int w = frmRec.width;
            int h = frmRec.height;
            
            /*if(frmRec.width<100 || frmRec.height <100){
                w = 600;
                h = 400;
            }*/
            
            BufferedImage image = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
            frame.paint(image.getGraphics());
            ImageIO.write(image, "png", new File(save_to_location));
        } catch (IOException ex) {
            Logger.getLogger(ScreenShotCreator.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
        
    public static void main(String agrs[]){
        //takeScreenShot("C:/test/test_screen_shot.png");
        final JFrame frm = new JFrame("Test screen shot");
        frm.setLayout(null);
        frm.setBounds(200, 100, 400, 400);
        RoundedPanel panel = new RoundedPanel();
        panel.setDropShadowSize(5);
  
        
        panel.setBounds(50, 50, 250, 250);
        final JLabel l =new JLabel("The Screen shot test");
        l.setBounds(50, 50, 180, 50);
        
        panel.add(l);
        frm.add(panel);
        frm.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frm.setVisible(true);
        frm.addWindowListener(new WindowListener() {

            @Override
            public void windowOpened(WindowEvent e) {
                System.out.println("Window is open");
                takeScreenShot(l, "C:/test/test_screen_shot.png");
                
                System.out.println("Capture done.");
            }

            @Override
            public void windowClosing(WindowEvent e) {
            }

            @Override
            public void windowClosed(WindowEvent e) {
            }

            @Override
            public void windowIconified(WindowEvent e) {
            }

            @Override
            public void windowDeiconified(WindowEvent e) {
            }

            @Override
            public void windowActivated(WindowEvent e) {
            }

            @Override
            public void windowDeactivated(WindowEvent e) {
            }
        });
    }
}

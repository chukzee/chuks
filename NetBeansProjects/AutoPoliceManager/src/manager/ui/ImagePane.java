/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.ui;

import test.*;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import javax.swing.JPanel;

/**
 *
 * @author ogaga
 */
public class ImagePane extends JPanel {

    private Image img;
    private int img_width;
    private int img_height;

    private ImagePane() {

    }

    public ImagePane(BufferedImage img, int width, int height) {

        this.img = img.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        this.img_width = width;
        this.img_height = height;
        //this.repaint();
    }

    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        if (img != null) {
            
            g.drawImage(img, 10, 5, img_width, img_height, null);
        }
    }
}

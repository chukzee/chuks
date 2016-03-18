/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.awt.Graphics;
import java.awt.image.BufferedImage;
import javax.swing.JPanel;

/**
 *
 * @author ogaga
 */
public class ImagePane extends JPanel {

    private BufferedImage img;
    private int img_width;
    private int img_height;

    private ImagePane() {

    }

    ImagePane(BufferedImage img, int width, int height) {

        this.img = img;
        this.img_width = width;
        this.img_height = height;
        //this.repaint();
    }

    protected void paintComponent(final Graphics g) {
        super.paintComponent(g);
               
        g.drawImage(img, 0, 0, img_width, img_height, null);


    }
}

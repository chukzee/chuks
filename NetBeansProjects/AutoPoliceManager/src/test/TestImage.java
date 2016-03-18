/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;
import javax.imageio.ImageIO;

/**
 *
 * @author USER
 */
public class TestImage {
    
    public static void main(String[] args) throws IOException{
        String url = "http://localhost/traysa/images/kidnaper_/zone 1/Division A/7.gif";
        url = url.replaceAll(" ", "%20");
        System.out.println(url);
        BufferedImage img = ImageIO.read(new URL(url));
        System.out.println(img);
        Object[] objs= new Object[3];
        objs[0]="e";
        objs[0]=2;
        
    }

}

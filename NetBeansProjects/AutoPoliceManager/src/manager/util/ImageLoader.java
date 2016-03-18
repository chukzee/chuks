/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.util;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.SwingUtilities;
import org.jdesktop.swingx.JXImageView;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ImageLoader {

    private final int MAX_SIZE = 100;
    private Map<String, BufferedImage> LRUImageMap = new LinkedHashMap(MAX_SIZE, 0.75f, true) {

                                                        @Override
                                                        protected boolean removeEldestEntry(Map.Entry eldest) {
                                                            return this.size() > MAX_SIZE;
                                                        }

                                                    };

    List<ImageLoadListener> listerners = Collections.synchronizedList(new ArrayList());
    
    int MAX_THREAD = 4;
    ExecutorService exec;

    public void addImageLoadListener(ImageLoadListener listener){
        if(this.listerners.contains(listener))
            return;
       this.listerners.add(listener);
    }

    public void removeImageLoadListener(ImageLoadListener listener){
       this.listerners.remove(listener);
    }
        
    public void loadImage(final String url, final JXImageView imageView) {
        
        imageView.setImage((Image)null);//first clear the current image 
        
        if (exec == null) {
            exec = Executors.newFixedThreadPool(4);
        }
        
        if(LRUImageMap.containsKey(url)){
            loadByListeners( url, LRUImageMap.get(url), imageView);
            return;
        }
        
        exec.submit(new Runnable() {

            @Override
            public void run() {
                try {
                    final BufferedImage img = ImageIO.read(new URL(url));
                    LRUImageMap.put(url, img);
                    SwingUtilities.invokeLater(new Runnable() {

                        @Override
                        public void run() {
                            loadByListeners( url, img, imageView);
                       }
                        
                    });
                } catch (IOException ex) {
                    Logger.getLogger(ImageLoader.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        
    }

    private void loadByListeners( String url, BufferedImage img, JXImageView imageView){
        for(int i=0; i<listerners.size(); i++){//Do not use enhanced for loop . Leave as it is please.
            listerners.get(i).imageLoaded(url, img, imageView);//notify the listeners
        }         
    }
    
    public BufferedImage getImage(String url) {
        return this.LRUImageMap.get(url);
    }
}

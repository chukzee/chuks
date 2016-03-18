/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.util;

import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.JTable;
import javax.swing.SwingUtilities;

/**
 *
 * @author ogaga
 */
public class TableImageDisplayer {

    ExecutorService exec;

    public TableImageDisplayer() {
        exec = Executors.newFixedThreadPool(4);
    }

    public void displayOnCell(JTable table, String url, int row, int col) {
        exec.submit(new LoadHandler(table, url, row, col));
    }

    class LoadHandler implements Runnable {

        int row, col;
        private String url;
        private JTable table;
        private Map<String, BufferedImage> map = Collections.synchronizedMap(new HashMap<String, BufferedImage>());

        LoadHandler(JTable table, String url, int row, int col) {
            this.row = row;
            this.col = col;
            this.url = url;
            this.table = table;
            if (!map.containsKey(url)) {
                map.put(url, null);
            }

            BufferedImage img;
            if ((img = map.get(url)) != null) {
                
                table.getModel().setValueAt(img, row, col);
            }
        }

        @Override 
        public void run() {
                
            try {
                
                if(url.isEmpty())
                    return;
                
                BufferedImage img = ImageIO.read(new URL(url));
                table.getModel().setValueAt(img, row, col);
                   
                
            } catch (IOException ex) {
                Logger.getLogger(TableImageDisplayer.class.getName()).log(Level.SEVERE, null, ex);
            } catch (Exception ex) {
                Logger.getLogger(TableImageDisplayer.class.getName()).log(Level.SEVERE, null, ex);
            }   
        }       
                
    }           

}

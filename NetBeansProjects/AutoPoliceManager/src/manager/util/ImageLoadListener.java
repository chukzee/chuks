/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.util;

import java.awt.Image;
import org.jdesktop.swingx.JXImageView;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface ImageLoadListener {
    
    public void imageLoaded(String url, Image img, JXImageView imageView);
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import manager.util.TableImageDisplayer;
import java.awt.Component;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.net.URL;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JTable;
import javax.swing.table.TableCellRenderer;

/**
 *
 * @author ogaga
 */
public class KidnapReportTable extends JTable {

    private TableImageDisplayer imageDisplayer;
    private BufferedImage defaultPersonImage;

    public KidnapReportTable(){
        
    }
    
    void setDefaultPersonImage(BufferedImage defaultPersonImage) {
        this.defaultPersonImage = defaultPersonImage;
    }

    void setImageDisplayer(TableImageDisplayer imageDisplayer) {
        this.imageDisplayer = imageDisplayer;
    }

    public TableCellRenderer getCellRenderer(int row, int column) {
        if (column == 0) {
            Object obj = this.getValueAt(row, column);
            if (obj instanceof String) {
                if (imageDisplayer == null) {
                    imageDisplayer = new TableImageDisplayer();
                }
                System.out.println("here");
                imageDisplayer.displayOnCell(this, (String) obj, row, column);
                return new ImageRenderer(null);
            } else {
                return new ImageRenderer(defaultPersonImage);
            }

        }else if(column ==1){
            return new InfoRenderer();
        }

        return super.getCellRenderer(row, column);
    }

    class ImageRenderer extends JButton implements TableCellRenderer {

        BufferedImage defaultImage;

        ImageRenderer(BufferedImage default_image) {
            defaultImage = default_image;
        }

        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
            if (value instanceof BufferedImage) {
                return new ImagePane((BufferedImage) value, 50, 50);
            } else if (defaultImage != null) {
                return new ImagePane(defaultImage, 50, 50);
            }

            return new JLabel();
        }

    }
    
    
    class InfoRenderer extends JButton implements TableCellRenderer {


        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {

            return new InfoPane("Jame Akoni","Male","34", "WANTED");
        }

    }
}

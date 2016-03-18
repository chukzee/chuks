/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.ui;

import manager.util.TableImageDisplayer;
import java.awt.Color;
import test.*;
import java.awt.Component;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.net.URL;
import java.util.Enumeration;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JTable;
import javax.swing.event.TableColumnModelEvent;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableColumn;
import javax.swing.table.TableColumnModel;
import org.json.JSONObject;

/**
 *
 * @author ogaga
 */
public class VehicleTheftReportTable extends JTable {

    private TableImageDisplayer imageDisplayer;
    private BufferedImage defaultPersonImage;
    private BufferedImage defaultVehicleImage;
    private int prefered_image_column_width = 70;

    public VehicleTheftReportTable() {

    }

    public int getSelectedReportSerialNo() {
        int selected_row = this.getSelectedRow();
        int selected_col = this.getSelectedColumn();
        if (selected_row == -1 || selected_col == -1) {
            return - 1;
        }
        String json = (String) this.getModel().getValueAt(selected_row, selected_col);
        return new JSONObject(json).getInt("report_serial_no");
    }

    public String getSelectedPlateNo() {
        int selected_row = this.getSelectedRow();
        int selected_col = this.getSelectedColumn();
        if (selected_row == -1 || selected_col == -1) {
            return "";
        }
        String json = (String) this.getModel().getValueAt(selected_row, selected_col);
        return new JSONObject(json).getString("plate_no");
    }

    void setDefaultPersonImage(BufferedImage defaultPersonImage) {
        this.defaultPersonImage = defaultPersonImage;
    }

    void setDefaultVehicleImage(BufferedImage defaultVehicleImage) {
        this.defaultVehicleImage = defaultVehicleImage;
    }

    void setImageDisplayer(TableImageDisplayer imageDisplayer) {
        this.imageDisplayer = imageDisplayer;
    }

    @Override
    public void columnAdded(TableColumnModelEvent e) {
        super.columnAdded(e);
        TableColumnModel tmodel = (TableColumnModel) e.getSource();
    
        int index = -1;

        if ((index = e.getToIndex()) == 0) {
            TableColumn column = tmodel.getColumn(index);
            column.setMinWidth(prefered_image_column_width);
            column.setMaxWidth(prefered_image_column_width);
        } else if ((index = e.getToIndex()) == 1) {//last column
            TableColumn column = tmodel.getColumn(index);
            column.setMinWidth(this.getWidth() - 2 * prefered_image_column_width);
        } else if ((index = e.getToIndex()) == 2) {//last column
            TableColumn column = tmodel.getColumn(index);
            column.setMinWidth(prefered_image_column_width);
            column.setMaxWidth(prefered_image_column_width);//unique behaviour
        }

    }

    public TableCellRenderer getCellRenderer(int row, int column) {

        if (column == 0 || column == 2) {
            Object obj = this.getValueAt(row, column);
            if (obj instanceof String) {
                if (imageDisplayer == null) {
                    imageDisplayer = new TableImageDisplayer();
                }

                imageDisplayer.displayOnCell(this, (String) obj, row, column);
                return new ImageRenderer(null);
            } else {
                return new ImageRenderer(defaultPersonImage);
            }

        } else if (column == 1) {
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

            JSONObject json = new JSONObject((String) value);
            return new InfoPane(InfoPane.VEHICLE_THEFT_INFO,
                    json.getString("plate_no"),
                    json.getString("owner_full_name"),
                    json.getString("time_ago"),
                    null,isSelected);
        }

    }
}

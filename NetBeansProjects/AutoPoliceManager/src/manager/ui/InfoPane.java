/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.ui;

import com.sun.glass.ui.Cursor;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import javax.swing.JPanel;

/**
 *
 * @author ogaga
 */
public class InfoPane extends JPanel {

    String captive_fullname = "", captive_sex = "", captive_age = "", status = "";
    private String owner_full_name = "";
    private String plate_no = "";
    private String time_ago = "";

    public static final int VEHICLE_THEFT_INFO = 1;
    public static final int CAPTIVE_INFO = 2;
    public static final int KIDNAPER_INFO = 3;
    public static final int WANTED_PERSON_INFO = 4;
    private String captive_time_ago = "";
    private String kidnaper_fullname = "";
    private String kidnaper_sex = "";
    private String kidnaper_age = "";
    private String kidnaper_status = "";
    private int type;
    private boolean is_selected;
    private String wanted_fullname = "";
    private String wanted_sex = "";
    private String wanted_age = "";
    private String wanted_phone_no = "";
    private String wanted_reason = "";
    private String date_declared_wanted = "";

    private InfoPane() {

    }

    InfoPane(int type, String argu1, String argu2, String argu3, String argu4, boolean is_selected) {
        this.is_selected = is_selected;
       
        this.setCursor(java.awt.Cursor.getPredefinedCursor(Cursor.CURSOR_POINTING_HAND));
        
        switch (type) {
            case VEHICLE_THEFT_INFO: {
                this.type = VEHICLE_THEFT_INFO;
                this.plate_no = argu1;
                this.owner_full_name = argu2;
                this.time_ago = argu3;
            }
            break;
            case CAPTIVE_INFO: {
                this.type = CAPTIVE_INFO;
                this.captive_fullname = argu1;
                this.captive_sex = argu2;
                this.captive_age = argu3;
                this.captive_time_ago = argu4;
            }
            break;
            case KIDNAPER_INFO: {
                this.type = KIDNAPER_INFO;
                this.kidnaper_fullname = argu1;
                this.kidnaper_sex = argu2;
                this.kidnaper_age = argu3;
                this.kidnaper_status = argu4;
            }
            break;
        }

    }

    InfoPane(int type, String argu1, String argu2, String argu3, String argu4, String argu5, String argu6, boolean is_selected) {
        this.is_selected = is_selected;
       
        this.setCursor(java.awt.Cursor.getPredefinedCursor(Cursor.CURSOR_POINTING_HAND));
        
        switch (type) {
            case WANTED_PERSON_INFO: 
                this.type = WANTED_PERSON_INFO;
                this.wanted_fullname = argu1;
                this.wanted_sex = argu2;
                this.wanted_age = argu3;
                this.wanted_phone_no = argu4;            
                this.date_declared_wanted = argu5;            
                this.wanted_reason = argu6;            
            break;
        }

    }

    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        Graphics2D g2 = (Graphics2D) g;
        
               
        if(is_selected){
           
             g.setColor(Color.gray);
            // g2.fill3DRect(0, 0, this.getWidth(), this.getHeight(), is_selected);
             g2.fillRect(0, 0, this.getWidth(), this.getHeight());
             
             g.setColor(Color.white);
        }
        
        switch (type) {
            case VEHICLE_THEFT_INFO: {
                forVehicleTheft(g);
            }
            break;
            case CAPTIVE_INFO: {
                forCaptive(g);
            }
            break;
            case KIDNAPER_INFO: {
                forKidnapper(g);
            }
            break;
            case WANTED_PERSON_INFO: {
                forWantedPerson(g);
            }
            break;
        }

    }

    private void forCaptive(Graphics g) {

        g.setFont(Font.decode(Font.SERIF));
        g.setFont(g.getFont().deriveFont(Font.BOLD, 14f));

        g.drawString(captive_fullname, 5, 12);

        g.setFont(g.getFont().deriveFont(Font.PLAIN, 12f));
        g.drawString(captive_sex, 5, 32);
        g.drawString(captive_age, 5, 52);

        g.setFont(g.getFont().deriveFont(Font.PLAIN, 16f));
        g.drawString(captive_time_ago, 110, 52);
    }

    private void forKidnapper(Graphics g) {

        g.setFont(Font.decode(Font.SERIF));
        g.setFont(g.getFont().deriveFont(Font.BOLD, 14f));

        g.drawString(kidnaper_fullname, 5, 12);

        g.setFont(g.getFont().deriveFont(Font.PLAIN, 12f));
        g.drawString(kidnaper_sex, 5, 32);
        g.drawString(kidnaper_age, 5, 52);

        g.setFont(g.getFont().deriveFont(Font.PLAIN, 16f));
        g.drawString(kidnaper_status, 110, 52);
    }

    private void forVehicleTheft(Graphics g) {

        g.setFont(Font.decode(Font.SERIF));

        g.setFont(g.getFont().deriveFont(Font.PLAIN, 16f));
        g.drawString(time_ago, 110, 12);

        g.setFont(g.getFont().deriveFont(Font.BOLD, 14f));
        g.drawString(plate_no, 5, 32);

        g.setFont(g.getFont().deriveFont(Font.PLAIN, 12f));
        g.drawString(owner_full_name, 5, 52);

    }

    private void forWantedPerson(Graphics g) {
        g.setFont(Font.decode(Font.SERIF));
        g.setFont(g.getFont().deriveFont(Font.BOLD, 14f));

        g.drawString(wanted_fullname, 5, 12);

        g.setFont(g.getFont().deriveFont(Font.PLAIN, 12f));
        g.drawString(wanted_sex, 5, 32);
        g.drawString(wanted_age, 5, 52);
        g.drawString(wanted_phone_no, 5, 72);
        g.drawString(date_declared_wanted, 5, 92);
        g.drawString(wanted_reason, 5, 112);


    }
}

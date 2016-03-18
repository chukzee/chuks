/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;

/**
 *
 * @author ogaga
 */
public class InfoPane extends JPanel {

    String fullname, sex, age, status;

    private InfoPane() {

    }

    InfoPane(String fullname, String sex, String age, String status) {
this.fullname= fullname;
this.sex = sex;
this.age= age;
this.status = status;
    }

    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        g.setFont(Font.decode(Font.SERIF));
        g.setFont(g.getFont().deriveFont(Font.BOLD, 14f));

        g.drawString(fullname, 5, 12);

        g.setFont(g.getFont().deriveFont(Font.PLAIN, 12f));
        g.drawString(sex, 5, 32);
        g.drawString(age, 5, 52);

        g.setFont(g.getFont().deriveFont(Font.PLAIN, 16f));
        g.drawString(status, 110, 52);
    }
}

package test;


import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.*;

import org.pushingpixels.trident.Timeline;
import org.pushingpixels.trident.swing.*;

public class ButtonFg extends JFrame {

    public ButtonFg() {
        JButton button = new JButton("sample");
        button.setForeground(Color.blue);
        button.setSize(100,30);
        this.setLayout(new FlowLayout());
        this.add(button);
        SwingToolkitHandler s = new SwingToolkitHandler();
        final SwingRepaintTimeline rolloverTimeline = new SwingRepaintTimeline(button);
        Dimension d1=new Dimension(50,30);
        Dimension d2=new Dimension(200,30);
        rolloverTimeline.addPropertyToInterpolate("preferredsize", d1,
                d2);
        rolloverTimeline.setDuration(2500);
        button.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                rolloverTimeline.play();
            }

            @Override
            public void mouseExited(MouseEvent e) {
                rolloverTimeline.playReverse();
            }
        });

        this.setSize(400, 200);
        this.setLocationRelativeTo(null);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new ButtonFg().setVisible(true);
            }
        });
    }
}

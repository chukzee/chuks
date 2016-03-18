/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import static javafx.concurrent.Worker.State.FAILED;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JProgressBar;
import javax.swing.SwingUtilities;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class PoliceMonitorView implements Runnable{

    private WebView browser;
    private WebEngine webEngine;
    private JFXPanel jfxpnlMapPanel;
    private JProgressBar progressBarMap;
    private JDialog jdialog;
    private String page_url="google.com";//come back
    
    PoliceMonitorView(PoliceMonitorDialog jdialog, JFXPanel jfxpnlMapPanel, JProgressBar progressBarMap) {
        this.jdialog = jdialog;
        this.jfxpnlMapPanel = jfxpnlMapPanel;
        this.progressBarMap = progressBarMap;
    }

    @Override
    public void run() {

        // Set up the embedded browser:
        browser = new WebView();
        webEngine = browser.getEngine();
        jfxpnlMapPanel.setScene(new Scene(browser));

        webEngine.load(page_url);
        //webEngine.loadContent(getPageContent());

        webEngine.getLoadWorker().workDoneProperty().addListener(new ChangeListener<Number>() {
            @Override
            public void changed(ObservableValue<? extends Number> observableValue, Number oldValue, final Number newValue) {
                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {
                        progressBarMap.setValue(newValue.intValue());
                    }
                });
            }
        });

        webEngine.getLoadWorker()
                .exceptionProperty()
                .addListener(new ChangeListener<Throwable>() {

                    public void changed(ObservableValue<? extends Throwable> o, Throwable old, final Throwable value) {
                        if (webEngine.getLoadWorker().getState() == FAILED) {
                            SwingUtilities.invokeLater(new Runnable() {
                                @Override
                                public void run() {
                                    JOptionPane.showMessageDialog(
                                            jdialog,
                                            (value != null)
                                                    ? webEngine.getLocation() + "\n" + value.getMessage()
                                                    : webEngine.getLocation() + "\nUnexpected error.",
                                            "Loading error...",
                                            JOptionPane.ERROR_MESSAGE);
                                }
                            });
                        }
                    }
                });

    }

    
}

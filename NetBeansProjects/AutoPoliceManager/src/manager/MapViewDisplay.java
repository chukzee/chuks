/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager;

import javafx.application.Platform;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import static javafx.concurrent.Worker.State.FAILED;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JProgressBar;
import javax.swing.SwingUtilities;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class MapViewDisplay implements Runnable {

    private WebView browser;
    private WebEngine webEngine;
    private JFXPanel jfxpnlMapPanel;
    private JProgressBar progressBarMap;
    private JDialog jdialog;

    public MapViewDisplay(JDialog jdialog, JFXPanel jfxpnlMapPanel, JProgressBar progressBarMap) {
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

        //webEngine.load(google_map_url);
        webEngine.loadContent(getMapPageContent());

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

    void setMapLocation(final String latitude, final String longitude) {
        Platform.runLater(new Runnable() {
            @Override
            public void run() {
                webEngine.executeScript("setMapLocation(" + latitude + "," + longitude + ")");
            }
        });
    }

    void setMapType(final String map_view_type) {
        Platform.runLater(new Runnable() {
            @Override
            public void run() {
                webEngine.executeScript("setMapType('" + map_view_type + "')");
            }
        });
    }

    void zoomMap(final int zoom){
        Platform.runLater(new Runnable() {
            @Override
            public void run() {
                webEngine.executeScript("zoomMap(" + zoom + ")");
            }
        });        
    }
    
    private String getMapPageContent() {
        return "<!DOCTYPE html>"
                + "<html>"
                + "  <head>"
                + "    <meta name='viewport' content='initial-scale=1.0, user-scalable=no' />"
                + "    <style type='text/css'>"
                + "      html { height: 100% }"
                + "      body { height: 100%; margin: 0; padding: 0 }"
                + "      #map-canvas { height: 100% }"
                + "    </style>"
                + "    <script type='text/javascript'"
                + "      src='https://maps.googleapis.com/maps/api/js?key=" + ServerManager.GOOGLE_MAP_KEY + "&sensor=false'>"
                + "    </script>"
                + ""
                + "  </head>"
                + "  <body>"
                + "   <div id='map-canvas'/>"
                + "  </body>"
                + ""
                + "    <script type='text/javascript'>"
                + "      var map;   "
                + "    var prev_latitude;"
                + "    var prev_longitude;"
                + "       var lat = 48.209331;"
                + "     var lng = 16.381302;"
                + "	displayMap('Hybrid',18, lat, lng);"
                + "        "
                + "      prev_latitude = lat;"
                + "      prev_longitude = lng;"
                + "      "
                + "      function displayMap (map_view_type, zoom_value, latitude, longitude) {"
                + "        "
                + "	var map_type;"
                + "	"
                + "	if(map_view_type == 'Hybrid'){"
                + "	   map_type = google.maps.MapTypeId.HYBRID;"
                + "	}else if(map_view_type == 'Satellite'){"
                + "	   map_type = google.maps.MapTypeId.SATELLITE;"
                + "	}else if(map_view_type == 'Terrain'){"
                + "	   map_type = google.maps.MapTypeId.TERRAIN ;"
                + "	}else{"
                + "	   map_type = google.maps.MapTypeId.ROADMAP;"
                + "	}"
                + "	"
                + "	var mapOptions = {"
                + "          center: new google.maps.LatLng(latitude, longitude),"
                + "          zoom: zoom_value,"
                + "	  mapTypeId: map_type"
                + "        };"
                + ""
                + "        map = new google.maps.Map(document.getElementById('map-canvas'),"
                + "            mapOptions);"
                + "      }"
                + ""
                + " function setMapType(map_view_type){"
                + "          "
                + "     if(map==undefined)"
                + "        return; "
                + "	var map_type;"
                + "	"
                + "	if(map_view_type == 'Hybrid'){"
                + "	   map_type = google.maps.MapTypeId.HYBRID;"
                + "	}else if(map_view_type == 'Satellite'){"
                + "	   map_type = google.maps.MapTypeId.SATELLITE;"
                + "	}else if(map_view_type == 'Terrain'){"
                + "	   map_type = google.maps.MapTypeId.TERRAIN ;"
                + "	}else{"
                + "	   map_type = google.maps.MapTypeId.ROADMAP;"
                + "	}"
                + " "
                + "     map.setMapTypeId(map_type);"
                + "}"
                + ""
                + " function zoomMap(zoom){"
                + "    "
                + "    if(map==undefined)"
                + "     return;"
                + "    map.setZoom(zoom);"
                + "}"
                + ""
                + ""
                + " function setMapLocation(latitude,longitude){"
                + "    if(map==undefined)"
                + "        return;"
                + "     "
                + "     if(prev_latitude == latitude && prev_longitude==longitude)"
                + "         return;"
                + "      "
                + "    map.panTo(new google.maps.LatLng(latitude,longitude));"
                + " }"
                + ""
                + "</script>"
                + ""
                + "</html>";
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager;

import com.sun.javafx.application.PlatformImpl;
import java.awt.Dimension;
import java.awt.Rectangle;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import javafx.application.Platform;
import manager.util.TrackInfo;

/**
 *
 * @author user
 */
public class TrackVehicleDialog extends javax.swing.JDialog implements WindowListener{
    private MapViewDisplay vehicleTrackMapDisplay;
    private final ScheduledExecutorService execTrack;

    /**
     * Creates new form TrackVehicleDialog
     */
    public TrackVehicleDialog(java.awt.Frame parent, boolean modal) {
        super(parent, modal);
        initComponents();
        progressBarVehicleMap.setStringPainted(true);

        createScene();
        
        execTrack = Executors.newSingleThreadScheduledExecutor();
        
        execTrack.scheduleWithFixedDelay(new Runnable() {

            @Override
            public void run() {
                trackVehicleDeviceLocation();
            }
        }, 0, ServerManager.LOCATION_CHECK_INTERVAL, TimeUnit.SECONDS);

        this.addWindowListener(this);

    }

    /**
     * createScene
     *
     * Note: Key is that Scene needs to be created and run on "FX user thread"
     * NOT on the AWT-EventQueue Thread
     *
     */
    private void createScene() {
        vehicleTrackMapDisplay = new MapViewDisplay(this, jfxpnlVehicleMapPanel, progressBarVehicleMap);

        PlatformImpl.startup(vehicleTrackMapDisplay);
        Platform.setImplicitExit(false);
    }

    private void updateVehicleMapDisplay(TrackInfo info) {

        //update the map Lat Lng
        final String latitude = info.getLatitude();
        final String longitude = info.getLongitude();

        if (latitude.isEmpty() || longitude.isEmpty()) {
            return;
        }

        this.vehicleTrackMapDisplay.setMapLocation(latitude, longitude);
    }

    private void trackVehicleDeviceLocation() {
        Statement dv_stmt = null;
        ResultSet rs = null;
        Connection track_db_connection = null;
        String vehicle_imei = "";

        try {

            Object obj_vehicle_imei = this.lstVehicleTrackList.getSelectedValue();
            if (obj_vehicle_imei == null) {
                return;
            }

            track_db_connection = ServerManager.getTrackerConnection();

            if (track_db_connection == null) {
                return;
            }

            vehicle_imei = obj_vehicle_imei.toString();

            dv_stmt = track_db_connection.createStatement();
            rs = dv_stmt.executeQuery("SELECT * FROM comeback_for_the_table name"//come back for the table name
                    + " WHERE VEHICLE_IMEI ='" + vehicle_imei + "'");

            TrackInfo loc_info = ServerManager.vehicle_location.get((String) vehicle_imei);
            String str_loc_time = "";
            if (rs.next()) {
                Timestamp loc_time = rs.getTimestamp("LOCATION_TIME");
                str_loc_time = new Date(loc_time.getTime()).toLocaleString();

                loc_info.setLogitude(rs.getString("LONGITUDE"));
                loc_info.setLatitude(rs.getString("LATITUDE"));
                loc_info.setSpeed(rs.getString("SPEED"));
                loc_info.setBearing(rs.getString("BEARING"));
                loc_info.setAltitude(rs.getString("ALTITUDE"));
                loc_info.setLocationTime(loc_time);
                loc_info.setLocationAddress(rs.getString("LOCATION_ADDRESS"));

                //display the infomation in the Track Info Tab
                this.lblLongitudeVehicleTrackInfo.setText(loc_info.getLongitude());
                this.lblLatitudeVehicleTrackInfo.setText(loc_info.getLatitude());
                this.lblSpeedVehicleTrackInfo.setText(loc_info.getSpeed() + " m/s");//come back for unit
                this.lblBearingVehicleTrackInfo.setText(loc_info.getBearing());
                this.lblAltitudeVehicleTrackInfo.setText(loc_info.getAltitude() + " m");//come back for unit
                this.lblLocationTimeVehicleTrackInfo.setText(str_loc_time);
                this.txaLocationAddressVehicleTrackInfo.setText(loc_info.getLocationAddress());

            } else {
                //clear the infomation in the Track Info Tab
                this.lblLongitudeVehicleTrackInfo.setText("");
                this.lblLatitudeVehicleTrackInfo.setText("");
                this.lblSpeedVehicleTrackInfo.setText("");
                this.lblBearingVehicleTrackInfo.setText("");
                this.lblAltitudeVehicleTrackInfo.setText("");
                this.lblLocationTimeVehicleTrackInfo.setText("");
                this.txaLocationAddressVehicleTrackInfo.setText("");

            }

            rs.close();

            if (!ServerManager.last_vehicle_imei_tracked.equals(vehicle_imei)) {

                //get the basic bio data
                /*rs = dv_stmt.executeQuery("SELECT FIRST_NAME, LAST_NAME, SEX,"
                 + " DATE_OF_BIRTH, CONTACT_ADDRESS"
                 + " FROM phone_user"
                 + " WHERE PHONE_NO ='" + vehicle_imei + "'");

                 if (rs.next()) {
                 Statement yr_stmt = track_db_connection.createStatement();
                 ResultSet yr_rs = yr_stmt.executeQuery("SELECT year(now()) as year, month(now())  as month, day(now())  as day");
                 yr_rs.next();
                 int current_year = yr_rs.getInt("year");
                 int current_month = yr_rs.getInt("month");
                 int current_day = yr_rs.getInt("day");

                 yr_rs.close();
                 yr_stmt.close();

                 loc_info.setFirstName(rs.getString("FIRST_NAME"));
                 loc_info.setLastName(rs.getString("LAST_NAME"));
                 loc_info.setSex(rs.getString("SEX"));
                 loc_info.setAge(getAge(rs.getString("DATE_OF_BIRTH"), current_year, current_month, current_day));
                 loc_info.setContactAddress(rs.getString("CONTACT_ADDRESS"));

                 //display track infor bio data
                 this.lblFirstNameMobileTrackInfo.setText(loc_info.getFirstName());
                 this.lblLastNameMobileTrackInfo.setText(loc_info.getLastName());
                 this.lblSexMobileTrackInfo.setText(loc_info.getSex());
                 this.lblAgeMobileTrackInfo.setText(loc_info.getAge());
                 this.lblContactAddressMobileTrackInfo.setText(loc_info.getContactAddress());

                 //display the information in the header
                 this.lblMobileTrackHeaderFullName.setText(loc_info.getFirstName() + " " + loc_info.getLastName());
                 this.lblMobileTrackHeaderLocationTime.setText(str_loc_time);
                 this.lblMobileTrackHeaderPhoneNo.setText((String) vehicle_imei);
                 this.lblMobileTrackHeaderLocationAddress.setText(loc_info.getLocationAddress());

                 } else {
                 //clear track infor bio data
                 this.lblFirstNameMobileTrackInfo.setText("");
                 this.lblLastNameMobileTrackInfo.setText("");
                 this.lblSexMobileTrackInfo.setText("");
                 this.lblAgeMobileTrackInfo.setText("");
                 this.lblContactAddressMobileTrackInfo.setText("");

                 //clear the information in the header
                 this.lblMobileTrackHeaderFullName.setText("");
                 this.lblMobileTrackHeaderLocationTime.setText("");
                 this.lblMobileTrackHeaderPhoneNo.setText("");
                 this.lblMobileTrackHeaderLocationAddress.setText("");

                 }


                 rs.close();
                
                 */
            }

            updateVehicleMapDisplay(loc_info);

        } catch (NullPointerException ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                if (dv_stmt != null) {
                    dv_stmt.close();
                }
            } catch (Exception ex) {
            }

            try {
                if (rs != null) {
                    rs.close();
                }
            } catch (Exception ex) {
            }

            try {
                if (track_db_connection != null) {
                    track_db_connection.close();
                }
            } catch (Exception ex) {
            }
        }

        ServerManager.last_vehicle_imei_tracked = vehicle_imei;

    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jSplitPane2 = new javax.swing.JSplitPane();
        jPanel3 = new javax.swing.JPanel();
        jLabel166 = new javax.swing.JLabel();
        jScrollPane17 = new javax.swing.JScrollPane();
        lstVehicleTrackList = new javax.swing.JList();
        txtVehicleIMEITrack = new javax.swing.JTextField();
        cmdAddVehicleTrack = new javax.swing.JButton();
        cmdRemoveVehicleTrack = new javax.swing.JButton();
        jPanel5 = new javax.swing.JPanel();
        jTabbedPane5 = new javax.swing.JTabbedPane();
        jPanel13 = new javax.swing.JPanel();
        jLabel174 = new javax.swing.JLabel();
        jLabel175 = new javax.swing.JLabel();
        jLabel176 = new javax.swing.JLabel();
        jLabel177 = new javax.swing.JLabel();
        jLabel178 = new javax.swing.JLabel();
        jLabel179 = new javax.swing.JLabel();
        jLabel180 = new javax.swing.JLabel();
        jLabel181 = new javax.swing.JLabel();
        lblFirstNameVehicleTrackInfo = new javax.swing.JLabel();
        lblLastNameVehicleTrackInfo = new javax.swing.JLabel();
        lblSexVehicleTrackInfo = new javax.swing.JLabel();
        lblAgeVehicleTrackInfo = new javax.swing.JLabel();
        lblContactAddressVehicleTrackInfo = new javax.swing.JLabel();
        jSeparator23 = new javax.swing.JSeparator();
        lblLongitudeVehicleTrackInfo = new javax.swing.JLabel();
        lblLatitudeVehicleTrackInfo = new javax.swing.JLabel();
        jScrollPane18 = new javax.swing.JScrollPane();
        txaLocationAddressVehicleTrackInfo = new javax.swing.JTextArea();
        jLabel182 = new javax.swing.JLabel();
        lblLocationTimeVehicleTrackInfo = new javax.swing.JLabel();
        lblBearingVehicleTrackInfo = new javax.swing.JLabel();
        lblSpeedVehicleTrackInfo = new javax.swing.JLabel();
        jLabel183 = new javax.swing.JLabel();
        jLabel184 = new javax.swing.JLabel();
        jLabel185 = new javax.swing.JLabel();
        lblAltitudeVehicleTrackInfo = new javax.swing.JLabel();
        jPanel14 = new javax.swing.JPanel();
        jSeparator24 = new javax.swing.JSeparator();
        cboVehicleMapViewType = new javax.swing.JComboBox();
        jLabel186 = new javax.swing.JLabel();
        jfxpnlVehicleMapPanel = new javafx.embed.swing.JFXPanel();
        spnVehicleZoom = new javax.swing.JSpinner();
        jLabel187 = new javax.swing.JLabel();
        progressBarVehicleMap = new javax.swing.JProgressBar();
        lblVehicleTrackHeaderPhoneNo = new javax.swing.JLabel();
        lblVehicleTrackHeaderFullName = new javax.swing.JLabel();
        lblVehicleTrackHeaderLocationAddress = new javax.swing.JLabel();
        lblTrackVehicleHeaderLocationTime = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        setTitle("Vehicle Tracking");
        setBounds(this.getCenteredBounds(0.9, 0.9));
        setPreferredSize(this.getFormDimension(0.9, 0.9));
        getContentPane().setLayout(new javax.swing.BoxLayout(getContentPane(), javax.swing.BoxLayout.LINE_AXIS));

        jLabel166.setText("Vehicle IMEI");

        lstVehicleTrackList.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "IMEI Track List", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.BELOW_TOP, new java.awt.Font("Aharoni", 1, 18), new java.awt.Color(153, 153, 153))); // NOI18N
        lstVehicleTrackList.setSelectionMode(javax.swing.ListSelectionModel.SINGLE_SELECTION);
        lstVehicleTrackList.setFixedCellHeight(35);
        lstVehicleTrackList.addListSelectionListener(new javax.swing.event.ListSelectionListener() {
            public void valueChanged(javax.swing.event.ListSelectionEvent evt) {
                lstVehicleTrackListValueChanged(evt);
            }
        });
        jScrollPane17.setViewportView(lstVehicleTrackList);

        cmdAddVehicleTrack.setText("Add");
        cmdAddVehicleTrack.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdAddVehicleTrackActionPerformed(evt);
            }
        });

        cmdRemoveVehicleTrack.setText("Remove");
        cmdRemoveVehicleTrack.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdRemoveVehicleTrackActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane17, javax.swing.GroupLayout.PREFERRED_SIZE, 0, Short.MAX_VALUE)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addContainerGap()
                        .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel3Layout.createSequentialGroup()
                                .addComponent(jLabel166)
                                .addGap(0, 0, Short.MAX_VALUE))
                            .addGroup(jPanel3Layout.createSequentialGroup()
                                .addComponent(txtVehicleIMEITrack, javax.swing.GroupLayout.PREFERRED_SIZE, 139, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addComponent(cmdAddVehicleTrack))))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                        .addGap(0, 0, Short.MAX_VALUE)
                        .addComponent(cmdRemoveVehicleTrack)))
                .addContainerGap())
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(47, 47, 47)
                .addComponent(jLabel166)
                .addGap(1, 1, 1)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtVehicleIMEITrack, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cmdAddVehicleTrack))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane17, javax.swing.GroupLayout.PREFERRED_SIZE, 368, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(cmdRemoveVehicleTrack)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jSplitPane2.setLeftComponent(jPanel3);

        jTabbedPane5.setFont(new java.awt.Font("Tahoma", 0, 18)); // NOI18N

        jLabel174.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel174.setText("First name");

        jLabel175.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel175.setText("Last name");

        jLabel176.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel176.setText("Sex");

        jLabel177.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel177.setText("Age");

        jLabel178.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel178.setText("Longitude");

        jLabel179.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel179.setText("Latitude");

        jLabel180.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel180.setText("Location address");

        jLabel181.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel181.setText("Contact address");

        txaLocationAddressVehicleTrackInfo.setEditable(false);
        txaLocationAddressVehicleTrackInfo.setColumns(20);
        txaLocationAddressVehicleTrackInfo.setRows(5);
        jScrollPane18.setViewportView(txaLocationAddressVehicleTrackInfo);

        jLabel182.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel182.setText("Time");

        jLabel183.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel183.setText("Speed");

        jLabel184.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel184.setText("Bearing");

        jLabel185.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel185.setText("Altitude");

        javax.swing.GroupLayout jPanel13Layout = new javax.swing.GroupLayout(jPanel13);
        jPanel13.setLayout(jPanel13Layout);
        jPanel13Layout.setHorizontalGroup(
            jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel13Layout.createSequentialGroup()
                .addGap(19, 19, 19)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel174)
                    .addComponent(jLabel175)
                    .addComponent(jLabel176)
                    .addComponent(jLabel177)
                    .addComponent(jLabel181))
                .addGap(18, 18, Short.MAX_VALUE)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(lblContactAddressVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(lblAgeVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(lblFirstNameVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, 200, Short.MAX_VALUE)
                    .addComponent(lblLastNameVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(lblSexVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(395, 395, 395))
            .addGroup(jPanel13Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jSeparator23)
                .addContainerGap())
            .addGroup(jPanel13Layout.createSequentialGroup()
                .addGap(79, 79, 79)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel13Layout.createSequentialGroup()
                        .addComponent(jLabel180)
                        .addGap(18, 18, 18)
                        .addComponent(jScrollPane18, javax.swing.GroupLayout.DEFAULT_SIZE, 521, Short.MAX_VALUE))
                    .addGroup(jPanel13Layout.createSequentialGroup()
                        .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel178)
                            .addComponent(jLabel179)
                            .addComponent(jLabel182)
                            .addComponent(jLabel185)
                            .addComponent(jLabel183)
                            .addComponent(jLabel184))
                        .addGap(37, 37, 37)
                        .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                .addComponent(lblSpeedVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addComponent(lblBearingVehicleTrackInfo, javax.swing.GroupLayout.PREFERRED_SIZE, 134, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                .addComponent(lblLongitudeVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                .addComponent(lblLatitudeVehicleTrackInfo, javax.swing.GroupLayout.PREFERRED_SIZE, 134, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(lblLocationTimeVehicleTrackInfo, javax.swing.GroupLayout.PREFERRED_SIZE, 196, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(lblAltitudeVehicleTrackInfo, javax.swing.GroupLayout.PREFERRED_SIZE, 138, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );
        jPanel13Layout.setVerticalGroup(
            jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel13Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel174)
                    .addComponent(lblFirstNameVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel175)
                    .addComponent(lblLastNameVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel176)
                    .addComponent(lblSexVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel177)
                    .addComponent(lblAgeVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel181)
                    .addComponent(lblContactAddressVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(28, 28, 28)
                .addComponent(jSeparator23, javax.swing.GroupLayout.PREFERRED_SIZE, 12, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel178)
                    .addComponent(lblLongitudeVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel179)
                    .addComponent(lblLatitudeVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel183)
                    .addComponent(lblSpeedVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel184)
                    .addComponent(lblBearingVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(13, 13, 13)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel185)
                    .addComponent(lblAltitudeVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(18, 18, 18)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel182)
                    .addComponent(lblLocationTimeVehicleTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(18, 18, 18)
                .addGroup(jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel180)
                    .addComponent(jScrollPane18, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(32, 32, 32))
        );

        jTabbedPane5.addTab("Vehicle Track Info", jPanel13);

        cboVehicleMapViewType.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "Normal", "Satellite", "Hybrid", "Terrain" }));
        cboVehicleMapViewType.setSelectedItem("Hybrid");
        cboVehicleMapViewType.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cboVehicleMapViewTypeActionPerformed(evt);
            }
        });

        jLabel186.setText("View type");

        spnVehicleZoom.setModel(new javax.swing.SpinnerNumberModel(10, 4, 30, 2));
        spnVehicleZoom.addChangeListener(new javax.swing.event.ChangeListener() {
            public void stateChanged(javax.swing.event.ChangeEvent evt) {
                spnVehicleZoomStateChanged(evt);
            }
        });

        jLabel187.setText("Zoom");

        javax.swing.GroupLayout jPanel14Layout = new javax.swing.GroupLayout(jPanel14);
        jPanel14.setLayout(jPanel14Layout);
        jPanel14Layout.setHorizontalGroup(
            jPanel14Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jSeparator24)
            .addGroup(jPanel14Layout.createSequentialGroup()
                .addGroup(jPanel14Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel14Layout.createSequentialGroup()
                        .addGap(10, 10, 10)
                        .addGroup(jPanel14Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jfxpnlVehicleMapPanel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addGroup(jPanel14Layout.createSequentialGroup()
                                .addComponent(jLabel186)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(cboVehicleMapViewType, javax.swing.GroupLayout.PREFERRED_SIZE, 94, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 461, Short.MAX_VALUE)
                                .addComponent(jLabel187)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(spnVehicleZoom, javax.swing.GroupLayout.PREFERRED_SIZE, 76, javax.swing.GroupLayout.PREFERRED_SIZE))))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel14Layout.createSequentialGroup()
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(progressBarVehicleMap, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap())
        );
        jPanel14Layout.setVerticalGroup(
            jPanel14Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel14Layout.createSequentialGroup()
                .addGap(10, 10, 10)
                .addGroup(jPanel14Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(spnVehicleZoom, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel14Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(cboVehicleMapViewType, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jLabel187)
                        .addComponent(jLabel186)))
                .addGap(7, 7, 7)
                .addComponent(jSeparator24, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jfxpnlVehicleMapPanel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(progressBarVehicleMap, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(55, 55, 55))
        );

        jTabbedPane5.addTab("Map View", jPanel14);

        lblVehicleTrackHeaderPhoneNo.setFont(new java.awt.Font("Tahoma", 1, 14)); // NOI18N
        lblVehicleTrackHeaderPhoneNo.setHorizontalAlignment(javax.swing.SwingConstants.TRAILING);
        lblVehicleTrackHeaderPhoneNo.setText("Phone number");

        lblVehicleTrackHeaderFullName.setFont(new java.awt.Font("Tahoma", 1, 14)); // NOI18N
        lblVehicleTrackHeaderFullName.setText("Full name");

        lblVehicleTrackHeaderLocationAddress.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        lblVehicleTrackHeaderLocationAddress.setHorizontalAlignment(javax.swing.SwingConstants.TRAILING);
        lblVehicleTrackHeaderLocationAddress.setText("Location Address goes here");

        lblTrackVehicleHeaderLocationTime.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        lblTrackVehicleHeaderLocationTime.setText(new Date().toString());

        javax.swing.GroupLayout jPanel5Layout = new javax.swing.GroupLayout(jPanel5);
        jPanel5.setLayout(jPanel5Layout);
        jPanel5Layout.setHorizontalGroup(
            jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel5Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel5Layout.createSequentialGroup()
                        .addComponent(lblVehicleTrackHeaderFullName, javax.swing.GroupLayout.PREFERRED_SIZE, 121, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(lblVehicleTrackHeaderPhoneNo, javax.swing.GroupLayout.PREFERRED_SIZE, 180, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel5Layout.createSequentialGroup()
                        .addComponent(lblTrackVehicleHeaderLocationTime, javax.swing.GroupLayout.PREFERRED_SIZE, 241, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(lblVehicleTrackHeaderLocationAddress, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                .addContainerGap())
            .addComponent(jTabbedPane5, javax.swing.GroupLayout.Alignment.TRAILING)
        );
        jPanel5Layout.setVerticalGroup(
            jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel5Layout.createSequentialGroup()
                .addGap(16, 16, 16)
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(lblVehicleTrackHeaderPhoneNo, javax.swing.GroupLayout.DEFAULT_SIZE, 24, Short.MAX_VALUE)
                    .addComponent(lblVehicleTrackHeaderFullName))
                .addGap(2, 2, 2)
                .addGroup(jPanel5Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(lblVehicleTrackHeaderLocationAddress)
                    .addComponent(lblTrackVehicleHeaderLocationTime))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jTabbedPane5)
                .addContainerGap())
        );

        jSplitPane2.setRightComponent(jPanel5);

        getContentPane().add(jSplitPane2);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void lstVehicleTrackListValueChanged(javax.swing.event.ListSelectionEvent evt) {//GEN-FIRST:event_lstVehicleTrackListValueChanged
        // TODO add your handling code here:
        
    }//GEN-LAST:event_lstVehicleTrackListValueChanged

    private void cmdAddVehicleTrackActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdAddVehicleTrackActionPerformed
        ServerManager.addToTrackList(txtVehicleIMEITrack, lstVehicleTrackList, ServerManager.vehicleIMEITrackList, ServerManager.vehicle_location);
    }//GEN-LAST:event_cmdAddVehicleTrackActionPerformed

    private void cmdRemoveVehicleTrackActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdRemoveVehicleTrackActionPerformed
        ServerManager.removeTrack(lstVehicleTrackList, ServerManager.vehicleIMEITrackList, ServerManager.vehicle_location);
    }//GEN-LAST:event_cmdRemoveVehicleTrackActionPerformed

    private void cboVehicleMapViewTypeActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cboVehicleMapViewTypeActionPerformed
        final String map_view_type = cboVehicleMapViewType.getSelectedItem().toString();

        vehicleTrackMapDisplay.setMapType(map_view_type);
    }//GEN-LAST:event_cboVehicleMapViewTypeActionPerformed

    private void spnVehicleZoomStateChanged(javax.swing.event.ChangeEvent evt) {//GEN-FIRST:event_spnVehicleZoomStateChanged

        final int zoom = Integer.parseInt(spnVehicleZoom.getValue().toString());

       vehicleTrackMapDisplay.zoomMap(zoom);
    }//GEN-LAST:event_spnVehicleZoomStateChanged

    
    Rectangle getCenteredBounds(double percent_screen_width, double percent_screen_height) {
        int task_bar_height = 37;
        int screen_width = (int) this.getGraphicsConfiguration().getBounds().getWidth();
        int screen_height = (int) this.getGraphicsConfiguration().getBounds().getHeight();
        int w = (int) (percent_screen_width * screen_width);
        int h = (int) (percent_screen_height * screen_height);

        int x = (int) ((screen_width - w) / 2);
        int y = (int) ((screen_height - h) / 2);

        if (h + y > screen_height - task_bar_height) {
            y = 0;
            h = screen_height - task_bar_height;
        }
        return new Rectangle(x, y, w, h);
    }

    private Dimension getFormDimension(double percent_screen_width, double percent_screen_height) {

        int screen_width = (int) this.getGraphicsConfiguration().getBounds().getWidth();
        int screen_height = (int) this.getGraphicsConfiguration().getBounds().getHeight();
        int w = (int) (percent_screen_width * screen_width);
        int h = (int) (percent_screen_height * screen_height);

        return new Dimension(w, h);
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(TrackVehicleDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(TrackVehicleDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(TrackVehicleDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(TrackVehicleDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the dialog */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                TrackVehicleDialog dialog = new TrackVehicleDialog(new javax.swing.JFrame(), true);
                dialog.addWindowListener(new java.awt.event.WindowAdapter() {
                    @Override
                    public void windowClosing(java.awt.event.WindowEvent e) {
                        System.exit(0);
                    }
                });
                dialog.setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JComboBox cboVehicleMapViewType;
    private javax.swing.JButton cmdAddVehicleTrack;
    private javax.swing.JButton cmdRemoveVehicleTrack;
    private javax.swing.JLabel jLabel166;
    private javax.swing.JLabel jLabel174;
    private javax.swing.JLabel jLabel175;
    private javax.swing.JLabel jLabel176;
    private javax.swing.JLabel jLabel177;
    private javax.swing.JLabel jLabel178;
    private javax.swing.JLabel jLabel179;
    private javax.swing.JLabel jLabel180;
    private javax.swing.JLabel jLabel181;
    private javax.swing.JLabel jLabel182;
    private javax.swing.JLabel jLabel183;
    private javax.swing.JLabel jLabel184;
    private javax.swing.JLabel jLabel185;
    private javax.swing.JLabel jLabel186;
    private javax.swing.JLabel jLabel187;
    private javax.swing.JPanel jPanel13;
    private javax.swing.JPanel jPanel14;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel5;
    private javax.swing.JScrollPane jScrollPane17;
    private javax.swing.JScrollPane jScrollPane18;
    private javax.swing.JSeparator jSeparator23;
    private javax.swing.JSeparator jSeparator24;
    private javax.swing.JSplitPane jSplitPane2;
    private javax.swing.JTabbedPane jTabbedPane5;
    private javafx.embed.swing.JFXPanel jfxpnlVehicleMapPanel;
    private javax.swing.JLabel lblAgeVehicleTrackInfo;
    private javax.swing.JLabel lblAltitudeVehicleTrackInfo;
    private javax.swing.JLabel lblBearingVehicleTrackInfo;
    private javax.swing.JLabel lblContactAddressVehicleTrackInfo;
    private javax.swing.JLabel lblFirstNameVehicleTrackInfo;
    private javax.swing.JLabel lblLastNameVehicleTrackInfo;
    private javax.swing.JLabel lblLatitudeVehicleTrackInfo;
    private javax.swing.JLabel lblLocationTimeVehicleTrackInfo;
    private javax.swing.JLabel lblLongitudeVehicleTrackInfo;
    private javax.swing.JLabel lblSexVehicleTrackInfo;
    private javax.swing.JLabel lblSpeedVehicleTrackInfo;
    private javax.swing.JLabel lblTrackVehicleHeaderLocationTime;
    private javax.swing.JLabel lblVehicleTrackHeaderFullName;
    private javax.swing.JLabel lblVehicleTrackHeaderLocationAddress;
    private javax.swing.JLabel lblVehicleTrackHeaderPhoneNo;
    public javax.swing.JList lstVehicleTrackList;
    private javax.swing.JProgressBar progressBarVehicleMap;
    private javax.swing.JSpinner spnVehicleZoom;
    private javax.swing.JTextArea txaLocationAddressVehicleTrackInfo;
    private javax.swing.JTextField txtVehicleIMEITrack;
    // End of variables declaration//GEN-END:variables

    @Override
    public void windowOpened(WindowEvent e) {
    }

    @Override
    public void windowClosing(WindowEvent e) {
        execTrack.shutdownNow();
    }

    @Override
    public void windowClosed(WindowEvent e) {
        execTrack.shutdownNow();
    }

    @Override
    public void windowIconified(WindowEvent e) {
    }

    @Override
    public void windowDeiconified(WindowEvent e) {
    }

    @Override
    public void windowActivated(WindowEvent e) {
    }

    @Override
    public void windowDeactivated(WindowEvent e) {
    }

}

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
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;
import javafx.application.Platform;
import manager.util.SQLColumn;
import manager.util.TrackInfo;

/**
 *
 * @author user
 */
public class TrackMobileDialog extends javax.swing.JDialog implements WindowListener{
    private MapViewDisplay phoneTrackMapDisplay;
    private final ScheduledExecutorService execTrack;

    /**
     * Creates new form TrackMobileDialog
     */
    public TrackMobileDialog(java.awt.Frame parent, boolean modal) {
        super(parent, modal);
        initComponents();
        progressBarMobileMap.setStringPainted(true);

        createScene();
        
        execTrack = Executors.newSingleThreadScheduledExecutor();

        
        execTrack.scheduleWithFixedDelay(new Runnable() {

            @Override
            public void run() {
                trackMobileDeviceLocation();                
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
        phoneTrackMapDisplay = new MapViewDisplay(this, jfxpnlMobileMapPanel, progressBarMobileMap);

        PlatformImpl.startup(phoneTrackMapDisplay);
        Platform.setImplicitExit(false);
    }

    private void updateMobileMapDisplay(TrackInfo info) {

        //update the map Lat Lng
        final String latitude = info.getLatitude();
        final String longitude = info.getLongitude();

        if (latitude.isEmpty() || longitude.isEmpty()) {
            return;
        }

        this.phoneTrackMapDisplay.setMapLocation(latitude, longitude);
    }

    private void trackMobileDeviceLocation() {

        Statement dv_stmt = null;
        ResultSet rs = null;
        Connection track_db_connection = null;
        String phone_no = "";

        try {

            Object obj_phone_no = this.lstMobileTrackList.getSelectedValue();
            if (obj_phone_no == null) {
                return;
            }

            track_db_connection = ServerManager.getTrackerConnection();

            if (track_db_connection == null) {
                return;
            }

            phone_no = obj_phone_no.toString();

            dv_stmt = track_db_connection.createStatement();
            rs = dv_stmt.executeQuery("SELECT * FROM location"
                    + " WHERE PHONE_NO ='" + phone_no + "'");

            final TrackInfo loc_info = ServerManager.phone_location.get((String) phone_no);
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
                this.lblLongitudeTrackInfo.setText(loc_info.getLongitude());
                this.lblLatitudeTrackInfo.setText(loc_info.getLatitude());
                this.lblSpeedTrackInfo.setText(loc_info.getSpeed() + " m/s");//come back for unit
                this.lblBearingTrackInfo.setText(loc_info.getBearing());
                this.lblAltitudeTrackInfo.setText(loc_info.getAltitude() + " m");//come back for unit
                this.lblLocationTimeTrackInfo.setText(str_loc_time);
                this.txaLocationAddressTrackInfo.setText(loc_info.getLocationAddress());

            } else {
                //clear the infomation in the Track Info Tab
                this.lblLongitudeTrackInfo.setText("");
                this.lblLatitudeTrackInfo.setText("");
                this.lblSpeedTrackInfo.setText("");
                this.lblBearingTrackInfo.setText("");
                this.lblAltitudeTrackInfo.setText("");
                this.lblLocationTimeTrackInfo.setText("");
                this.txaLocationAddressTrackInfo.setText("");

            }

            rs.close();

            if (!ServerManager.last_phone_no_tracked.equals(phone_no)) {

                //get the basic bio data
                rs = dv_stmt.executeQuery("SELECT FIRST_NAME, LAST_NAME, SEX,"
                        + " DATE_OF_BIRTH, CONTACT_ADDRESS"
                        + " FROM phone_user"
                        + " WHERE PHONE_NO ='" + phone_no + "'");

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
                    loc_info.setAge(ServerManager.getAge(rs.getString("DATE_OF_BIRTH"), current_year, current_month, current_day));
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
                    this.lblMobileTrackHeaderPhoneNo.setText((String) phone_no);
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

                //get the phone number track settings
                rs = dv_stmt.executeQuery("SELECT PHONE_NO, LOCATION_PRIORITY, LOCATION_UPDATE_INTERVAL,"
                        + " LOCATION_UPDATE_DURATION FROM track_settings"
                        + " WHERE PHONE_NO ='" + phone_no + "'");

                if (rs.next()) {
                    loc_info.setLocationPriority(rs.getString("LOCATION_PRIORITY"));
                    loc_info.setLocationUpdateInterval(rs.getInt("LOCATION_UPDATE_INTERVAL"));
                    loc_info.setLocationUpdateDuration(rs.getInt("LOCATION_UPDATE_DURATION") / (60 * 60));//to get it in hours
                    //display the track configuration

                    SwingUtilities.invokeLater(new Runnable() {
                        public void run() {
                            cboLocationPriority.getModel().setSelectedItem(loc_info.getLocationPriority());
                            spnLocationUpdateInterval.setValue(loc_info.getLocationUpdateInterval());
                            spnLocationUpdateDuration.setValue(loc_info.getLocationUpdateDuration());
                        }
                    });
                } else {
                    //clear the track configuration
                    SwingUtilities.invokeLater(new Runnable() {
                        public void run() {
                            cboLocationPriority.getModel().setSelectedItem(null);
                            spnLocationUpdateInterval.setValue(3600);
                            spnLocationUpdateDuration.setValue(-1);
                        }
                    });
                }

                rs.close();
            }

            updateMobileMapDisplay(loc_info);

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

        ServerManager.last_phone_no_tracked = phone_no;

    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jSplitPane1 = new javax.swing.JSplitPane();
        jPanel1 = new javax.swing.JPanel();
        jLabel35 = new javax.swing.JLabel();
        jScrollPane3 = new javax.swing.JScrollPane();
        lstMobileTrackList = new javax.swing.JList();
        txtPhoneNoTrack = new javax.swing.JTextField();
        cmdAddTrack = new javax.swing.JButton();
        cmdRemoveTrack = new javax.swing.JButton();
        jPanel2 = new javax.swing.JPanel();
        jTabbedPane3 = new javax.swing.JTabbedPane();
        jPanel4 = new javax.swing.JPanel();
        jLabel38 = new javax.swing.JLabel();
        cboLocationPriority = new javax.swing.JComboBox();
        jLabel39 = new javax.swing.JLabel();
        jLabel40 = new javax.swing.JLabel();
        jLabel41 = new javax.swing.JLabel();
        cmdApplyTrackConfig = new javax.swing.JButton();
        spnLocationUpdateInterval = new javax.swing.JSpinner();
        spnLocationUpdateDuration = new javax.swing.JSpinner();
        jLabel71 = new javax.swing.JLabel();
        jPanel7 = new javax.swing.JPanel();
        jLabel43 = new javax.swing.JLabel();
        jLabel44 = new javax.swing.JLabel();
        jLabel45 = new javax.swing.JLabel();
        jLabel46 = new javax.swing.JLabel();
        jLabel47 = new javax.swing.JLabel();
        jLabel48 = new javax.swing.JLabel();
        jLabel49 = new javax.swing.JLabel();
        jLabel50 = new javax.swing.JLabel();
        lblFirstNameMobileTrackInfo = new javax.swing.JLabel();
        lblLastNameMobileTrackInfo = new javax.swing.JLabel();
        lblSexMobileTrackInfo = new javax.swing.JLabel();
        lblAgeMobileTrackInfo = new javax.swing.JLabel();
        lblContactAddressMobileTrackInfo = new javax.swing.JLabel();
        jSeparator4 = new javax.swing.JSeparator();
        lblLongitudeTrackInfo = new javax.swing.JLabel();
        lblLatitudeTrackInfo = new javax.swing.JLabel();
        jScrollPane4 = new javax.swing.JScrollPane();
        txaLocationAddressTrackInfo = new javax.swing.JTextArea();
        jLabel42 = new javax.swing.JLabel();
        lblLocationTimeTrackInfo = new javax.swing.JLabel();
        lblBearingTrackInfo = new javax.swing.JLabel();
        lblSpeedTrackInfo = new javax.swing.JLabel();
        jLabel77 = new javax.swing.JLabel();
        jLabel78 = new javax.swing.JLabel();
        jLabel79 = new javax.swing.JLabel();
        lblAltitudeTrackInfo = new javax.swing.JLabel();
        jPanel8 = new javax.swing.JPanel();
        jSeparator2 = new javax.swing.JSeparator();
        cboMobileMapViewType = new javax.swing.JComboBox();
        jLabel51 = new javax.swing.JLabel();
        jfxpnlMobileMapPanel = new javafx.embed.swing.JFXPanel();
        spnMobileZoom = new javax.swing.JSpinner();
        jLabel36 = new javax.swing.JLabel();
        progressBarMobileMap = new javax.swing.JProgressBar();
        lblMobileTrackHeaderPhoneNo = new javax.swing.JLabel();
        lblMobileTrackHeaderFullName = new javax.swing.JLabel();
        lblMobileTrackHeaderLocationAddress = new javax.swing.JLabel();
        lblMobileTrackHeaderLocationTime = new javax.swing.JLabel();
        jLabel37 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.DISPOSE_ON_CLOSE);
        setTitle("Mobile Tracking");
        setBounds(this.getCenteredBounds(0.9, 0.9));
        setPreferredSize(this.getFormDimension(0.9, 0.9));
        getContentPane().setLayout(new javax.swing.BoxLayout(getContentPane(), javax.swing.BoxLayout.LINE_AXIS));

        jSplitPane1.setPreferredSize(new java.awt.Dimension(960, 539));

        jPanel1.setMaximumSize(new java.awt.Dimension(0, 0));
        jPanel1.setPreferredSize(new java.awt.Dimension(216, 537));

        jLabel35.setText("Phone no.");

        lstMobileTrackList.setBorder(javax.swing.BorderFactory.createTitledBorder(null, "Phone No. Track List", javax.swing.border.TitledBorder.DEFAULT_JUSTIFICATION, javax.swing.border.TitledBorder.BELOW_TOP, new java.awt.Font("Aharoni", 1, 18), new java.awt.Color(153, 153, 153))); // NOI18N
        lstMobileTrackList.setSelectionMode(javax.swing.ListSelectionModel.SINGLE_SELECTION);
        lstMobileTrackList.setFixedCellHeight(35);
        lstMobileTrackList.addListSelectionListener(new javax.swing.event.ListSelectionListener() {
            public void valueChanged(javax.swing.event.ListSelectionEvent evt) {
                lstMobileTrackListValueChanged(evt);
            }
        });
        jScrollPane3.setViewportView(lstMobileTrackList);

        cmdAddTrack.setText("Add");
        cmdAddTrack.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdAddTrackActionPerformed(evt);
            }
        });

        cmdRemoveTrack.setText("Remove");
        cmdRemoveTrack.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdRemoveTrackActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 240, javax.swing.GroupLayout.PREFERRED_SIZE)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(10, 10, 10)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel35, javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(txtPhoneNoTrack, javax.swing.GroupLayout.PREFERRED_SIZE, 139, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(6, 6, 6)
                        .addComponent(cmdAddTrack))))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(cmdRemoveTrack)
                .addContainerGap())
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addGap(47, 47, 47)
                .addComponent(jLabel35)
                .addGap(1, 1, 1)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(1, 1, 1)
                        .addComponent(txtPhoneNoTrack, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(cmdAddTrack))
                .addGap(18, 18, 18)
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 360, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(cmdRemoveTrack)
                .addContainerGap())
        );

        jSplitPane1.setLeftComponent(jPanel1);

        jTabbedPane3.setFont(new java.awt.Font("Tahoma", 0, 18)); // NOI18N

        jLabel38.setText("Location priority");

        cboLocationPriority.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "Balanced power accuracy", "High power accuracy", "Low power accuracy", "Zero power accuracy" }));
        cboLocationPriority.setSelectedIndex(-1);

        jLabel39.setText("seconds");

        jLabel40.setText("Update interval");

        jLabel41.setText("Update duration");

        cmdApplyTrackConfig.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        cmdApplyTrackConfig.setText("Apply");
        cmdApplyTrackConfig.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdApplyTrackConfigActionPerformed(evt);
            }
        });

        spnLocationUpdateInterval.setModel(new javax.swing.SpinnerNumberModel(Integer.valueOf(3600), Integer.valueOf(5), null, Integer.valueOf(1)));

        spnLocationUpdateDuration.setModel(new javax.swing.SpinnerNumberModel(-1, -1, 72, 1));

        jLabel71.setText("hours");

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addGap(25, 25, 25)
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel4Layout.createSequentialGroup()
                        .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel38)
                            .addComponent(jLabel40, javax.swing.GroupLayout.Alignment.TRAILING))
                        .addGap(18, 18, 18)
                        .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(cboLocationPriority, javax.swing.GroupLayout.PREFERRED_SIZE, 182, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel4Layout.createSequentialGroup()
                                .addComponent(spnLocationUpdateInterval, javax.swing.GroupLayout.PREFERRED_SIZE, 82, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel71)
                                    .addComponent(jLabel39)))))
                    .addGroup(jPanel4Layout.createSequentialGroup()
                        .addComponent(jLabel41)
                        .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel4Layout.createSequentialGroup()
                                .addGap(18, 18, 18)
                                .addComponent(cmdApplyTrackConfig, javax.swing.GroupLayout.PREFERRED_SIZE, 97, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel4Layout.createSequentialGroup()
                                .addGap(18, 18, 18)
                                .addComponent(spnLocationUpdateDuration, javax.swing.GroupLayout.PREFERRED_SIZE, 81, javax.swing.GroupLayout.PREFERRED_SIZE)))))
                .addGap(298, 298, 298))
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addGap(28, 28, 28)
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(cboLocationPriority, javax.swing.GroupLayout.PREFERRED_SIZE, 25, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel38))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(spnLocationUpdateInterval, javax.swing.GroupLayout.PREFERRED_SIZE, 27, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel39)
                    .addComponent(jLabel40))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel41)
                    .addComponent(spnLocationUpdateDuration, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel71))
                .addGap(38, 38, 38)
                .addComponent(cmdApplyTrackConfig, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );

        jTabbedPane3.addTab("Config Tracking", jPanel4);

        jLabel43.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel43.setText("First name");

        jLabel44.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel44.setText("Last name");

        jLabel45.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel45.setText("Sex");

        jLabel46.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel46.setText("Age");

        jLabel47.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel47.setText("Longitude");

        jLabel48.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel48.setText("Latitude");

        jLabel49.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel49.setText("Location address");

        jLabel50.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel50.setText("Contact address");

        txaLocationAddressTrackInfo.setEditable(false);
        txaLocationAddressTrackInfo.setColumns(20);
        txaLocationAddressTrackInfo.setRows(5);
        jScrollPane4.setViewportView(txaLocationAddressTrackInfo);

        jLabel42.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel42.setText("Time");

        jLabel77.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel77.setText("Speed");

        jLabel78.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel78.setText("Bearing");

        jLabel79.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel79.setText("Altitude");

        javax.swing.GroupLayout jPanel7Layout = new javax.swing.GroupLayout(jPanel7);
        jPanel7.setLayout(jPanel7Layout);
        jPanel7Layout.setHorizontalGroup(
            jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel7Layout.createSequentialGroup()
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel7Layout.createSequentialGroup()
                        .addGap(19, 19, 19)
                        .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel43)
                            .addComponent(jLabel44)
                            .addComponent(jLabel45)
                            .addComponent(jLabel46)
                            .addComponent(jLabel50))
                        .addGap(18, 18, Short.MAX_VALUE)
                        .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(lblContactAddressMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(lblAgeMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(lblFirstNameMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, 200, Short.MAX_VALUE)
                            .addComponent(lblLastNameMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addComponent(lblSexMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                    .addGroup(jPanel7Layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jSeparator4))
                    .addGroup(jPanel7Layout.createSequentialGroup()
                        .addGap(79, 79, 79)
                        .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel7Layout.createSequentialGroup()
                                .addComponent(jLabel49)
                                .addGap(18, 18, 18)
                                .addComponent(jScrollPane4, javax.swing.GroupLayout.DEFAULT_SIZE, 497, Short.MAX_VALUE))
                            .addGroup(jPanel7Layout.createSequentialGroup()
                                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel47)
                                    .addComponent(jLabel48)
                                    .addComponent(jLabel42)
                                    .addComponent(jLabel79)
                                    .addComponent(jLabel77)
                                    .addComponent(jLabel78))
                                .addGap(37, 37, 37)
                                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                        .addComponent(lblSpeedTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                        .addComponent(lblBearingTrackInfo, javax.swing.GroupLayout.PREFERRED_SIZE, 134, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                        .addComponent(lblLongitudeTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                        .addComponent(lblLatitudeTrackInfo, javax.swing.GroupLayout.PREFERRED_SIZE, 134, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addComponent(lblLocationTimeTrackInfo, javax.swing.GroupLayout.PREFERRED_SIZE, 196, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(lblAltitudeTrackInfo, javax.swing.GroupLayout.PREFERRED_SIZE, 138, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGap(0, 0, Short.MAX_VALUE)))))
                .addContainerGap())
        );
        jPanel7Layout.setVerticalGroup(
            jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel7Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel43)
                    .addComponent(lblFirstNameMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel44)
                    .addComponent(lblLastNameMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel45)
                    .addComponent(lblSexMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel46)
                    .addComponent(lblAgeMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel50)
                    .addComponent(lblContactAddressMobileTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(18, 18, 18)
                .addComponent(jSeparator4, javax.swing.GroupLayout.PREFERRED_SIZE, 12, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel47)
                    .addComponent(lblLongitudeTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel48)
                    .addComponent(lblLatitudeTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel77)
                    .addComponent(lblSpeedTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel78)
                    .addComponent(lblBearingTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(13, 13, 13)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel79)
                    .addComponent(lblAltitudeTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(18, 18, 18)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel42)
                    .addComponent(lblLocationTimeTrackInfo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(18, 18, 18)
                .addGroup(jPanel7Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel49)
                    .addComponent(jScrollPane4, javax.swing.GroupLayout.PREFERRED_SIZE, 53, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(32, 32, 32))
        );

        jTabbedPane3.addTab("Mobile Track Info", jPanel7);

        cboMobileMapViewType.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "Normal", "Satellite", "Hybrid", "Terrain" }));
        cboMobileMapViewType.setSelectedItem("Hybrid");
        cboMobileMapViewType.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cboMobileMapViewTypeActionPerformed(evt);
            }
        });

        jLabel51.setText("View type");

        spnMobileZoom.setModel(new javax.swing.SpinnerNumberModel(10, 4, 30, 2));
        spnMobileZoom.addChangeListener(new javax.swing.event.ChangeListener() {
            public void stateChanged(javax.swing.event.ChangeEvent evt) {
                spnMobileZoomStateChanged(evt);
            }
        });

        jLabel36.setText("Zoom");

        javax.swing.GroupLayout jPanel8Layout = new javax.swing.GroupLayout(jPanel8);
        jPanel8.setLayout(jPanel8Layout);
        jPanel8Layout.setHorizontalGroup(
            jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jSeparator2)
            .addGroup(jPanel8Layout.createSequentialGroup()
                .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel8Layout.createSequentialGroup()
                        .addGap(10, 10, 10)
                        .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jfxpnlMobileMapPanel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                            .addGroup(jPanel8Layout.createSequentialGroup()
                                .addComponent(jLabel51)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(cboMobileMapViewType, javax.swing.GroupLayout.PREFERRED_SIZE, 94, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 437, Short.MAX_VALUE)
                                .addComponent(jLabel36)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(spnMobileZoom, javax.swing.GroupLayout.PREFERRED_SIZE, 76, javax.swing.GroupLayout.PREFERRED_SIZE))))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel8Layout.createSequentialGroup()
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(progressBarMobileMap, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap())
        );
        jPanel8Layout.setVerticalGroup(
            jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel8Layout.createSequentialGroup()
                .addGap(10, 10, 10)
                .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(spnMobileZoom, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.PREFERRED_SIZE, 29, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(cboMobileMapViewType, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jLabel36)
                        .addComponent(jLabel51)))
                .addGap(7, 7, 7)
                .addComponent(jSeparator2, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jfxpnlMobileMapPanel, javax.swing.GroupLayout.DEFAULT_SIZE, 298, Short.MAX_VALUE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(progressBarMobileMap, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(55, 55, 55))
        );

        jTabbedPane3.addTab("Map View", jPanel8);

        lblMobileTrackHeaderPhoneNo.setFont(new java.awt.Font("Tahoma", 1, 14)); // NOI18N
        lblMobileTrackHeaderPhoneNo.setHorizontalAlignment(javax.swing.SwingConstants.TRAILING);
        lblMobileTrackHeaderPhoneNo.setText("Phone number");

        lblMobileTrackHeaderFullName.setFont(new java.awt.Font("Tahoma", 1, 14)); // NOI18N
        lblMobileTrackHeaderFullName.setText("Full name");

        lblMobileTrackHeaderLocationAddress.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        lblMobileTrackHeaderLocationAddress.setHorizontalAlignment(javax.swing.SwingConstants.TRAILING);
        lblMobileTrackHeaderLocationAddress.setText("Location Address goes here");

        lblMobileTrackHeaderLocationTime.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        lblMobileTrackHeaderLocationTime.setText(new Date().toString());

        jLabel37.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel37.setForeground(new java.awt.Color(255, 51, 51));
        jLabel37.setText("DETECTED MUTIPLE USERS - 1 >> 5");

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addComponent(lblMobileTrackHeaderFullName, javax.swing.GroupLayout.PREFERRED_SIZE, 121, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(49, 49, 49)
                        .addComponent(jLabel37, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGap(18, 18, 18)
                        .addComponent(lblMobileTrackHeaderPhoneNo, javax.swing.GroupLayout.PREFERRED_SIZE, 180, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addComponent(lblMobileTrackHeaderLocationTime, javax.swing.GroupLayout.PREFERRED_SIZE, 241, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(lblMobileTrackHeaderLocationAddress, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                .addContainerGap())
            .addComponent(jTabbedPane3)
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                        .addComponent(lblMobileTrackHeaderPhoneNo, javax.swing.GroupLayout.DEFAULT_SIZE, 24, Short.MAX_VALUE)
                        .addComponent(lblMobileTrackHeaderFullName))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addComponent(jLabel37, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(7, 7, 7)))
                .addGap(2, 2, 2)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(lblMobileTrackHeaderLocationAddress)
                    .addComponent(lblMobileTrackHeaderLocationTime))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jTabbedPane3)
                .addContainerGap())
        );

        jSplitPane1.setRightComponent(jPanel2);

        getContentPane().add(jSplitPane1);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void lstMobileTrackListValueChanged(javax.swing.event.ListSelectionEvent evt) {//GEN-FIRST:event_lstMobileTrackListValueChanged

        //REMIND THIS METHOD IS CALLED TWICE. THIS CAND OVERLOAD THE SERVER
        //SO ENSURE THE VALUE REMAINS THE SAME FOR ONE SECOND BEFORE THE MESSAGE IS
        //SENT TO THE SERVER.
        Object phone_no = this.lstMobileTrackList.getSelectedValue();
        if (phone_no == null) {
            return;
        }

        if (ServerManager.prev_phone_no_selected.equals(phone_no)) {
            return;
        }

        //this.lblMobileTrackHeaderPhoneNo.setText(phone_no.toString());
        ServerManager.prev_phone_no_selected = phone_no.toString();

        System.out.println(this.lstMobileTrackList.getSelectedValue());

    }//GEN-LAST:event_lstMobileTrackListValueChanged

    private void cmdAddTrackActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdAddTrackActionPerformed
        ServerManager.addToTrackList(txtPhoneNoTrack, lstMobileTrackList, ServerManager.phoneNoTrackList, ServerManager.phone_location);
    }//GEN-LAST:event_cmdAddTrackActionPerformed

    private void cmdRemoveTrackActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdRemoveTrackActionPerformed
        ServerManager.removeTrack(lstMobileTrackList, ServerManager.phoneNoTrackList, ServerManager.phone_location);
    }//GEN-LAST:event_cmdRemoveTrackActionPerformed

    private void cmdApplyTrackConfigActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdApplyTrackConfigActionPerformed

        DBResource dBResource = null;
        DBResource dBResource1 = null;
        try {
            if (cboLocationPriority.getSelectedIndex() < 0) {
                JOptionPane.showMessageDialog(this, "You have not selected location priority.", "Invalid", JOptionPane.ERROR_MESSAGE);
                return;
            }

            Object phone_no = this.lstMobileTrackList.getSelectedValue();
            if (phone_no == null) {
                JOptionPane.showMessageDialog(this, "No phone number selected!", "Invalid", JOptionPane.ERROR_MESSAGE);
                return;
            }

            String location_priority = this.cboLocationPriority.getSelectedItem().toString();
            String location_update_interval = this.spnLocationUpdateInterval.getValue().toString();
            String location_update_duration_in_hours = this.spnLocationUpdateDuration.getValue().toString();
            int location_update_duration_in_sec = Integer.parseInt(location_update_duration_in_hours) * 60 * 60;
            int duration = location_update_duration_in_sec * 1000; // in milli second

            dBResource = ServerManager.sendQueryTrackDevice("", new String[]{"Now()"}, "");

            dBResource.rs.next();
            Timestamp now = dBResource.rs.getTimestamp(1);
            Timestamp expiry = new Timestamp(now.getTime() + duration);

            dBResource.rs.close();

            SQLColumn[] sql_columns = {new SQLColumn("LOCATION_PRIORITY", location_priority), new SQLColumn("LOCATION_UPDATE_INTERVAL ", location_update_interval), new SQLColumn("LOCATION_UPDATE_DURATION ", location_update_duration_in_sec), new SQLColumn("LOCATION_UPDATE_EXPIRY_TIME  ", expiry)};

            dBResource1 = ServerManager.updateStatementTrackDevice("track_settings", sql_columns, "WHERE PHONE_NO='" + phone_no.toString() + "'", true);

            if (dBResource1.result == 0) {
                SQLColumn[] sql_columns1 = {new SQLColumn("PHONE_NO", phone_no), new SQLColumn("LOCATION_PRIORITY", location_priority), new SQLColumn("LOCATION_UPDATE_INTERVAL ", location_update_interval), new SQLColumn("LOCATION_UPDATE_DURATION ", location_update_duration_in_sec), new SQLColumn("LOCATION_UPDATE_EXPIRY_TIME  ", expiry)};

                ServerManager.insertStatementTrackDevice("track_settings", sql_columns1, true);

            }

            JOptionPane.showMessageDialog(this, "Tracking configuration successful.", "Success", JOptionPane.ERROR_MESSAGE);

        } catch (SQLException ex) {
            ex.printStackTrace();
        } finally {
            if (dBResource != null) {
                dBResource.close();
            }
            if (dBResource1 != null) {
                dBResource1.close();
            }
        }

    }//GEN-LAST:event_cmdApplyTrackConfigActionPerformed

    private void cboMobileMapViewTypeActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cboMobileMapViewTypeActionPerformed
        final String map_view_type = cboMobileMapViewType.getSelectedItem().toString();

        phoneTrackMapDisplay.setMapType(map_view_type);
    }//GEN-LAST:event_cboMobileMapViewTypeActionPerformed

    private void spnMobileZoomStateChanged(javax.swing.event.ChangeEvent evt) {//GEN-FIRST:event_spnMobileZoomStateChanged

        final int zoom = Integer.parseInt(spnMobileZoom.getValue().toString());

        phoneTrackMapDisplay.zoomMap(zoom);
    }//GEN-LAST:event_spnMobileZoomStateChanged
    
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
            java.util.logging.Logger.getLogger(TrackMobileDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(TrackMobileDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(TrackMobileDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(TrackMobileDialog.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the dialog */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                TrackMobileDialog dialog = new TrackMobileDialog(new javax.swing.JFrame(), true);
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
    private javax.swing.JComboBox cboLocationPriority;
    private javax.swing.JComboBox cboMobileMapViewType;
    private javax.swing.JButton cmdAddTrack;
    private javax.swing.JButton cmdApplyTrackConfig;
    private javax.swing.JButton cmdRemoveTrack;
    private javax.swing.JLabel jLabel35;
    private javax.swing.JLabel jLabel36;
    private javax.swing.JLabel jLabel37;
    private javax.swing.JLabel jLabel38;
    private javax.swing.JLabel jLabel39;
    private javax.swing.JLabel jLabel40;
    private javax.swing.JLabel jLabel41;
    private javax.swing.JLabel jLabel42;
    private javax.swing.JLabel jLabel43;
    private javax.swing.JLabel jLabel44;
    private javax.swing.JLabel jLabel45;
    private javax.swing.JLabel jLabel46;
    private javax.swing.JLabel jLabel47;
    private javax.swing.JLabel jLabel48;
    private javax.swing.JLabel jLabel49;
    private javax.swing.JLabel jLabel50;
    private javax.swing.JLabel jLabel51;
    private javax.swing.JLabel jLabel71;
    private javax.swing.JLabel jLabel77;
    private javax.swing.JLabel jLabel78;
    private javax.swing.JLabel jLabel79;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanel7;
    private javax.swing.JPanel jPanel8;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JScrollPane jScrollPane4;
    private javax.swing.JSeparator jSeparator2;
    private javax.swing.JSeparator jSeparator4;
    private javax.swing.JSplitPane jSplitPane1;
    private javax.swing.JTabbedPane jTabbedPane3;
    private javafx.embed.swing.JFXPanel jfxpnlMobileMapPanel;
    private javax.swing.JLabel lblAgeMobileTrackInfo;
    private javax.swing.JLabel lblAltitudeTrackInfo;
    private javax.swing.JLabel lblBearingTrackInfo;
    private javax.swing.JLabel lblContactAddressMobileTrackInfo;
    private javax.swing.JLabel lblFirstNameMobileTrackInfo;
    private javax.swing.JLabel lblLastNameMobileTrackInfo;
    private javax.swing.JLabel lblLatitudeTrackInfo;
    private javax.swing.JLabel lblLocationTimeTrackInfo;
    private javax.swing.JLabel lblLongitudeTrackInfo;
    private javax.swing.JLabel lblMobileTrackHeaderFullName;
    private javax.swing.JLabel lblMobileTrackHeaderLocationAddress;
    private javax.swing.JLabel lblMobileTrackHeaderLocationTime;
    private javax.swing.JLabel lblMobileTrackHeaderPhoneNo;
    private javax.swing.JLabel lblSexMobileTrackInfo;
    private javax.swing.JLabel lblSpeedTrackInfo;
    public javax.swing.JList lstMobileTrackList;
    private javax.swing.JProgressBar progressBarMobileMap;
    private javax.swing.JSpinner spnLocationUpdateDuration;
    private javax.swing.JSpinner spnLocationUpdateInterval;
    private javax.swing.JSpinner spnMobileZoom;
    private javax.swing.JTextArea txaLocationAddressTrackInfo;
    private javax.swing.JTextField txtPhoneNoTrack;
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

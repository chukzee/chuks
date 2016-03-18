/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager;

import manager.util.DataTable;
import manager.util.SQLColumn;
import manager.util.TrackInfo;
import manager.ui.model.VehicleTheftTableModel;
import manager.ui.model.MngVehicleTheftReportModel;
import manager.ui.model.KidnapTableModel;
import manager.ui.model.MngKidnapReportModel;
import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import mock.BVN;
import java.awt.Color;
import java.awt.Component;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.*;
import java.awt.Dimension;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketException;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NameNotFoundException;
import javax.naming.NamingException;
import javax.sql.DataSource;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.text.JTextComponent;
import manager.attribute.*;
import manager.ui.model.MngKidnaperModel;
import manager.ui.model.WantedPersonTableModel;
import manager.util.ImageLoadListener;
import manager.util.ImageLoader;
import manager.util.ScreenShotCreator;
import mock.FRSC;
import mock.NationalIdentity;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.jdesktop.swingx.JXDatePicker;
import org.jdesktop.swingx.JXImageView;
import org.json.JSONArray;
import org.json.JSONObject;
import test.TestFTP;

/**
 *
 * @author WILL-PARRY PC
 */
public class ServerManager extends javax.swing.JFrame implements WindowListener, ImageLoadListener {

    static String zone;
    static String division;

    //private WebView browser;
    //private JFXPanel jfxPanel;  
    private JButton swingButton;
    //private WebEngine webEngine;
    final static String GOOGLE_MAP_KEY = "AIzaSyBcER0avQYPgFO7nQb4S5NaottFB3CyMs8";
    private String google_map_url = "file:///c:/test_map/test.html";
    //private String google_map_url =  "www.google.com";
    static Vector phoneNoTrackList = new Vector();
    static Vector vehicleIMEITrackList = new Vector();
    static String prev_phone_no_selected = "";
    static VehicleTheftTableModel vehicleTheftTableModel = new VehicleTheftTableModel();
    static KidnapTableModel kidnapTableModel = new KidnapTableModel();

    static MngVehicleTheftReportModel mngVehicleTheftReportModel = new MngVehicleTheftReportModel();
    static MngKidnapReportModel mngCaptiveModel = new MngKidnapReportModel();
    static MngKidnaperModel mngKidnaperModel = new MngKidnaperModel();

    static WantedPersonTableModel wantedPersonTableModel = new WantedPersonTableModel();

    static DataSource autopolice_ds;
    static DataSource division_ds;
    static DataSource track_ds;

    static final Object dv_lock = new Object();
    static final Object ap_lock = new Object();
    static final Object tr_lock = new Object();

    /*String jndi_bind_name = "division_bind_name";
     String host = "";
     String db_name = "";
     int db_port = 3306;
     String db_username = "";
     String db_password = "";
     */
    static String jndi_ap_bind_name = "dt_a_division_bind_name";
    static String autopoliice_host = "";
    static String autopoliice_db_name = "autopolicedb";
    static int autopoliice_db_port = 3306;
    static String autopoliice_db_username = "autopolice";
    static String autopoliice_db_password = "autopolicepass";

    static String track_bind_name = "dt_track_bind_name";
    static String track_host = "";
    static int track_db_port = 3306;
    static String track_db_name = "trackdevicedb";
    static String track_db_username = "trackdevice";
    static String track_db_password = "trackdevicepass";

    static final String DEFUALT_TIME_STAMP = "1600-01-01 00:00:00.0";
    Timestamp last_known_report_time = Timestamp.valueOf(DEFUALT_TIME_STAMP);
    Timestamp new_known_report_time = Timestamp.valueOf(DEFUALT_TIME_STAMP);
    static final int UPDATE_CHECK_INTERVAL = 5;//in seconds
    static final int LOCATION_CHECK_INTERVAL = 5;//in seconds
    private final String vtr_tmp = "vtr.tmp";
    private final String kdp_tmp = "kdp.tmp";
    private final String trk_m_tmp = "trk_m_.tmp";
    private final String trk_v_tmp = "trk_v_.tmp";
    private final String lkrt_tmp = "lkrt.tmp";

    static String IncidenceState = "Delta State";//TODO: to be set automatically
    static String IncidenceLGA = "Warri South";//TODO: to be set automatically

    static Map<String, TrackInfo> phone_location = Collections.synchronizedMap(new HashMap<String, TrackInfo>());
    static Map<String, TrackInfo> vehicle_location = Collections.synchronizedMap(new HashMap<String, TrackInfo>());
    //static Map<String, DataSource> statesDataSource = Collections.synchronizedMap(new HashMap<String, DataSource>());
    static String last_phone_no_tracked = "";
    static String last_vehicle_imei_tracked = "";
    static DataTable tbPrefetchVehicleReport;
    static DataTable tbKidnapReport;
    static int SelectedKidnapReportSerialNo = -1;
    static int LastSelectedKidnapReportSerialNo = -1;
    static String SelectedVehiclPLateNo = "";
    static String LastSelectedVehiclPLatNo = "";

    //ftp settings
    static String ftp_username = "chuks";
    static String ftp_password = "chukspass";
    static String ftp_host = "localhost";
    static int ftp_port = 21;

    static String staff_base_dir;
    static String vehicle_base_dir;
    static String vehicle_owner_base_dir;
    static String captive_base_dir;
    static String criminal_base_dir;
    static boolean isAutoDetectProxy;//come back for real implementation later
    static String RemoteServerHost;
    static String zone_bind_name;
    static String zone_db_host;
    static int zone_db_port;
    static String zone_db_name;
    static String zone_db_username;
    static String zone_db_password;
    static boolean isZoneDataSourceChange;
    private String currentCardNewReport;
    private String previousCardNewReport;
    static String vehicle_plate_no_new_report;
    static String ReportFailReason;
    private String BROADCAST_SENT = "BROADCAST SENT";
    private String NOT_TREATED = "NOT TREATED";
    private String STOLEN = "STOLEN";
    private String MISSING = "MISSING";
    static MapViewDisplay phoneTrackMapDisplay;
    static MapViewDisplay vehicleTrackMapDisplay;
    static HashMap<Integer, Person> crime_person;
    public static ImageLoader imageLoader = new ImageLoader();
    final Object lock = new Object();
    static int PreviousCaseOfPerson;
    static Map<String, ArrayList> mapStatesAndLGAs = new HashMap<>();
    static String remote_base_dir;
    private Object[] cached_vehicle_imei = new Object[0];
    private Object[] cached_phone_nos = new Object[0];
    private Map<Integer, VehicleTheftAttribute> vehicleTheftMap = new HashMap();
    private Map<Integer, KidnapAttribute> kidnapMap = new HashMap();
    private JSONObject json_vehicle_theft;
    private JSONObject json_kidnap;
    private JSONObject json_murder;
    private JSONObject json_burgulary;
    private JSONObject json_general;
    //public static final String http_host = "localhost";//COME BACK
    public static final String http_host = "45.79.137.25";//COME BACK
    public static final int http_port = 88;//COME BACK

    /**
     * Creates new form ServerManager
     */
    public ServerManager() throws IOException {

        System.err.println("REMIND : please set IncidenceState automatically later !!! see class field definition.");
        System.err.println("REMIND : please set IncidenceLGA automatically later !!! see class field definition.");

        initComponents();
        setScrollBarsSize();

        imageLoader.addImageLoadListener(this);

    }

    void loadCachedReports() {
        FileInputStream fin = null;
        ObjectInputStream si = null;

        try {

            //first load the last know report time
            String file_name = makeTempFilePath() + File.separator + lkrt_tmp;
            fin = new FileInputStream(file_name);
            si = new ObjectInputStream(fin);
            this.last_known_report_time = (Timestamp) si.readObject();
            fin.close();
            si.close();

            //load vehicle theft report
            file_name = makeTempFilePath() + File.separator + vtr_tmp;
            fin = new FileInputStream(file_name);
            si = new ObjectInputStream(fin);
            vehicleTheftTableModel = (VehicleTheftTableModel) si.readObject();
            this.tblVehicleTheft.setModel(vehicleTheftTableModel);
            fin.close();
            si.close();

            //load kidnap report
            file_name = makeTempFilePath() + File.separator + kdp_tmp;
            fin = new FileInputStream(file_name);
            si = new ObjectInputStream(fin);
            kidnapTableModel = (KidnapTableModel) si.readObject();
            this.tblKidnappings.setModel(kidnapTableModel);
            fin.close();
            si.close();
            //MORE CACHED REPORT LOADING GOES HERE 

        } catch (IOException | ClassNotFoundException ex) {
            //revert to the default time
            last_known_report_time = Timestamp.valueOf(DEFUALT_TIME_STAMP);
            System.err.println(ex.getMessage());
        } finally {
            try {
                if (fin != null) {
                    fin.close();
                }
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
            }
            
            try {
                if (si != null) {
                    si.close();
                }
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
            }
        }   
            
    }
        
    void loadCachedMobileTrackListData() {
        
        FileInputStream fi = null;
        ObjectInputStream si = null;
        
        try {
            String file_name = makeTempFilePath() + File.separator + trk_m_tmp;
            fi = new FileInputStream(file_name);
            si = new ObjectInputStream(fi);
            phone_location = (Map) si.readObject();
            Set phone_nos = phone_location.keySet();
            cached_phone_nos = phone_nos.toArray();
            //this.lstMobileTrackList.setListData(cached_phone_nos);//cancelled
            phoneNoTrackList.addAll(Arrays.asList(cached_phone_nos));

            fi.close();
            si.close();

        } catch (IOException | ClassNotFoundException ex) {
            System.err.println(ex.getMessage());
        } finally {
            try {
                if (fi != null) {
                    fi.close();
                }
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
            }

            try {
                if (si != null) {
                    si.close();
                }
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
            }
        }
    }

    void loadCachedVehicleTrackListData() {

        FileInputStream fi = null;
        ObjectInputStream si = null;

        try {
            String file_name = makeTempFilePath() + File.separator + trk_v_tmp;
            fi = new FileInputStream(file_name);
            si = new ObjectInputStream(fi);
            vehicle_location = (Map) si.readObject();
            Set nos = vehicle_location.keySet();
            cached_vehicle_imei = nos.toArray();
            //this.lstVehicleTrackList.setListData(cached_vehicle_imei);cancelled
            vehicleIMEITrackList.addAll(Arrays.asList(cached_vehicle_imei));

            fi.close();
            si.close();

        } catch (IOException | ClassNotFoundException ex) {
            System.err.println(ex.getMessage());
        } finally {
            try {
                if (fi != null) {
                    fi.close();
                }
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
            }

            try {
                if (si != null) {
                    si.close();
                }
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
            }
        }
    }

    void cacheReports() {
        
        FileOutputStream fo = null;
        ObjectOutputStream so = null;
        try {

            //first cache last known report time
            String file_name = makeTempFilePath() + File.separator + lkrt_tmp;
            fo = new FileOutputStream(file_name);
            so = new ObjectOutputStream(fo);
            so.writeObject(this.last_known_report_time);
            so.flush();
            so.close();

            //cache vehicle theft report
            file_name = makeTempFilePath() + File.separator + vtr_tmp;
            fo = new FileOutputStream(file_name);
            so = new ObjectOutputStream(fo);
            so.writeObject(vehicleTheftTableModel);
            so.flush();
            so.close();

            //cache kidnap report
            file_name = makeTempFilePath() + File.separator + kdp_tmp;
            fo = new FileOutputStream(file_name);
            so = new ObjectOutputStream(fo);
            so.writeObject(kidnapTableModel);
            so.flush();
            so.close();

            //MORE CACHE REPORT GOES HERE 
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            try {
                //if any error occurs then initialize the cached last know report time
                //so that the default is used in the next startup
                String file_name = makeTempFilePath() + File.separator + lkrt_tmp;
                fo = new FileOutputStream(file_name);
                so = new ObjectOutputStream(fo);
                so.writeObject(Timestamp.valueOf(DEFUALT_TIME_STAMP));
            } catch (IOException ex1) {
                System.err.println(ex.getMessage());
            }
        } finally {
            try {
                if (fo != null) {
                    fo.close();
                }
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
            }

            try {
                if (so != null) {
                    so.close();
                }
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
            }
        }
    }

    void cacheMobileTrackListData() {
        try {
            String file_name = makeTempFilePath() + File.separator + trk_m_tmp;
            FileOutputStream fo = new FileOutputStream(file_name);
            try (ObjectOutputStream so = new ObjectOutputStream(fo)) {
                so.writeObject(phone_location);
                so.flush();
            }
        } catch (IOException ex) {
            System.err.println(ex.getMessage());
        }
    }

    void cacheVehicleTrackListData() {
        try {
            String file_name = makeTempFilePath() + File.separator + trk_v_tmp;
            FileOutputStream fo = new FileOutputStream(file_name);
            try (ObjectOutputStream so = new ObjectOutputStream(fo)) {
                so.writeObject(vehicle_location);
                so.flush();
            }
        } catch (IOException ex) {
            System.err.println(ex.getMessage());
        }
    }

    private String makeTempFilePath() {

        String default_path = System.getProperty("java.io.tmpdir");

        String path = default_path + File.separator + ".AutoPoliceManager";
        File file = new File(path);
        if (!file.isDirectory()) {
            if (!file.mkdir()) {
                if (!file.isDirectory()) {//test again
                    path = default_path;
                }
            }
        }

        return path;
    }

    private void setScrollBarsSize() {
        Dimension hz_dimen = new Dimension(0, 10);
        Dimension vt_dimen = new Dimension(10, 0);

        this.jScrollPane1.getHorizontalScrollBar().setPreferredSize(hz_dimen);
        this.jScrollPane1.getVerticalScrollBar().setPreferredSize(vt_dimen);

        this.scrollPaneVehicleTheft.getHorizontalScrollBar().setPreferredSize(hz_dimen);
        this.scrollPaneVehicleTheft.getVerticalScrollBar().setPreferredSize(vt_dimen);

        this.jScrollPane5.getHorizontalScrollBar().setPreferredSize(hz_dimen);
        this.jScrollPane5.getVerticalScrollBar().setPreferredSize(vt_dimen);

        this.jScrollPane6.getHorizontalScrollBar().setPreferredSize(hz_dimen);
        this.jScrollPane6.getVerticalScrollBar().setPreferredSize(vt_dimen);

        this.jScrollPane7.getHorizontalScrollBar().setPreferredSize(hz_dimen);
        this.jScrollPane7.getVerticalScrollBar().setPreferredSize(vt_dimen);

        this.jScrollPane8.getHorizontalScrollBar().setPreferredSize(hz_dimen);
        this.jScrollPane8.getVerticalScrollBar().setPreferredSize(vt_dimen);

        this.jScrollPane9.getHorizontalScrollBar().setPreferredSize(hz_dimen);
        this.jScrollPane9.getVerticalScrollBar().setPreferredSize(vt_dimen);

        this.jScrollPane10.getHorizontalScrollBar().setPreferredSize(hz_dimen);
        this.jScrollPane10.getVerticalScrollBar().setPreferredSize(vt_dimen);

    }

    @Override
    public void windowOpened(WindowEvent e) {
        //get cached state
        loadCachedReports();
        loadCachedMobileTrackListData();
        loadCachedVehicleTrackListData();

        //start executors
        ScheduledExecutorService exec = Executors.newSingleThreadScheduledExecutor();
        exec.scheduleWithFixedDelay(new Runnable() {

            @Override
            public void run() {
                checkNewReport();
                //checkNewReport_1();
            }
        }, 0, UPDATE_CHECK_INTERVAL, TimeUnit.SECONDS);

        final ScheduledExecutorService execStatesAndLGAs = Executors.newSingleThreadScheduledExecutor();

        execStatesAndLGAs.scheduleWithFixedDelay(new Runnable() {

            @Override
            public void run() {
                statesAndLGAs();
                //statesAndLGAs_1();
                if(mapStatesAndLGAs!=null && mapStatesAndLGAs.size()>0)
                execStatesAndLGAs.shutdownNow();
            }
        }, 0, 20, TimeUnit.SECONDS);

    }

    @Override
    public void windowClosing(WindowEvent e) {
        //cache state
        cacheReports();
        cacheMobileTrackListData();
        cacheVehicleTrackListData();
    }

    @Override
    public void windowClosed(WindowEvent e) {
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

    private void statesAndLGAs_1(){
        if (mapStatesAndLGAs.size() > 0) {
            return;//avoid repetition
        }
        
        JSONObject json = sendGet(http_host, http_port, "dist/report/IncidenceReport",
                                "states_and_lgas");
        
        if(json==null)
            return;
        
        
        JSONArray states_list = json.names();
        int len = states_list.length();
        for(int i=0; i<len; i++){
            String state = states_list.getString(i);
            JSONArray lgas_list = json.getJSONArray(state);
            ArrayList lgas = new ArrayList();
            for(int k=0; k<lgas_list.length(); k++){
                lgas.add(lgas_list.getString(k));
            }
            
            mapStatesAndLGAs.put(state, lgas);
            
            if(SettingsDialog.cboState!=null)
            SettingsDialog.cboState.addItem(state);
            
        }
        //mapStatesAndLGAs.put(prev_state, lgas);
        
        
    }
    
    private void statesAndLGAs() {

        if (mapStatesAndLGAs.size() > 0) {
            return;//avoid repetition
        }
        Connection auto_police_db_connection = null;

        Statement stmt = null;
        ResultSet rs = null;

        try {
            auto_police_db_connection = this.getAutoPoliceConnection();

            if (auto_police_db_connection == null) {
                return;
            }

            stmt = auto_police_db_connection.createStatement();

            rs = stmt.executeQuery(" SELECT * FROM  states_and_lgas ORDER BY STATE");

            String prev_state = "";
            String LGA = "";
            ArrayList<String> lgas = new ArrayList<>();
            while (rs.next()) {

                String state = rs.getString("STATE");

                if (!state.equals(prev_state) && !prev_state.isEmpty()) {
                    this.mapStatesAndLGAs.put(prev_state, lgas);
                    lgas = new ArrayList<>();
                }

                LGA = rs.getString("LGA");
                lgas.add(LGA);
                prev_state = state;
            }

            if (!prev_state.isEmpty()) {
                this.mapStatesAndLGAs.put(prev_state, lgas);
            }

            Object[] obj_states = mapStatesAndLGAs.keySet().toArray();
            Arrays.sort(obj_states);
            for (Object obj_state : obj_states) {

                if (SettingsDialog.cboState != null) {
                    SettingsDialog.cboState.addItem(obj_state);
                }
            }

        } catch (SQLException ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
        } finally {

            try {
                if (rs != null) {
                    rs.close();
                }
            } catch (SQLException ex) {
                Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
            }

            try {
                if (stmt != null) {
                    stmt.close();
                }
            } catch (SQLException ex) {
                Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }

    static public String getAge(String dob, int current_year, int current_month, int current_day) throws ParseException {

        String[] split_dob = dob.split("-");
        if (split_dob.length < 3) {
            split_dob = dob.split("/");
        }

        int year = Integer.parseInt(split_dob[0]);
        int month = Integer.parseInt(split_dob[1]);
        int day = Integer.parseInt(split_dob[2]);

        int age = current_year - year;
        //int current_month = calendar.get(Calendar.MONTH) + 1;//converting to non-zero base month
        //int current_day = calendar.get(Calendar.DAY_OF_MONTH);

        if (current_month < month) {
            age = age - 1;
        } else if (current_month == month && current_day < day) {
            age = age - 1;
        }

        return String.valueOf(age);
    }

    public static JSONObject sendGet(String host, int port, String path, String... params) {
        try {
            String p = "";
            for (int i = 0; i < params.length; i++) {
                if(i==0)
                    p="?";
                p += i < params.length - 1 ? params[i] + "&" : params[i];
            }
            
            String encodedParams = URLEncoder.encode(p, "UTF-8");
            if(!path.startsWith("/"))
                path = "/"+path;
            if(!host.startsWith("http://"))
                host = "http://"+host;
            
            URL url = new URL(host+":"+port+path+encodedParams);

            // Open a HTTP  connection to  the URL
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setDoInput(true); // Allow Inputs
            conn.setDoOutput(true); // Allow Outputs
            conn.setUseCaches(false); // Don't use a Cached Copy
            conn.setRequestMethod("GET");
            
            //DataOutputStream dos = new DataOutputStream(conn.getOutputStream());
            //dos.write(b);
            int serverResponseCode = conn.getResponseCode();

            if (serverResponseCode != 200) {
                return null;
            }

            DataInputStream din = new DataInputStream(conn.getInputStream());
            byte[] b = new byte[conn.getContentLength()];
            din.readFully(b);

            return new JSONObject(new String(b));

        } catch (IOException ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    private void checkNewReport_1() {
        JSONObject json = sendGet(http_host, http_port, "dist/report/IncidenceReport",
                                "check_report",
                                "last_known_report_time=1600-01-01 00:00:00.0",
                                "IncidenceState=Delta State",
                                "IncidenceLGA=effurun");
        System.out.println(json);
        if(json==null)
            return;
        
        if(json.has("report_time_checked")){
            this.last_known_report_time = Timestamp.valueOf(json.getString("report_time_checked"));
        }
        
        if(json.has("vehicle_theft_report")){
            json_vehicle_theft = json.getJSONObject("vehicle_theft_report");
        }
        
        if(json.has("kidnap_report")){
            json_kidnap = json.getJSONObject("kidnap_report");
        }
        
        if(json.has("murder_report")){
            json_murder = json.getJSONObject("murder_report");
        }
        
        if(json.has("burgulary_report")){
            json_burgulary = json.getJSONObject("burgulary_report");
        }
        
        if(json.has("general_report")){
            json_general = json.getJSONObject("general_report");
        }
        
    }

    private void checkNewReport() {
        Statement dv_stmt = null;
        ResultSet rs = null;
        Connection division_db_connection = null;
        try {
            division_db_connection = getDivisionConnection(IncidenceState);

            if (division_db_connection == null) {
                return;
            }

            dv_stmt = division_db_connection.createStatement();
            rs = dv_stmt.executeQuery("SELECT LAST_REPORT_TIME FROM report_time_check");

            if (rs.next()) {
                Timestamp last_report_time = rs.getTimestamp("LAST_REPORT_TIME");
                if (last_report_time.after(last_known_report_time)) {
                    checkVehicleTheftReport(division_db_connection);
                    burgularyReport(division_db_connection);
                    murderReport(division_db_connection);
                    kidnapReport(division_db_connection);
                    //more report check go below

                    //finally
                    if (this.last_known_report_time.before(new_known_report_time)) {
                        this.last_known_report_time.setTime(new_known_report_time.getTime());
                    }
                }

            }

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
                if (division_db_connection != null) {
                    division_db_connection.close();
                }
            } catch (Exception ex) {
            }

        }

    }

    private void checkVehicleTheftReport(Connection division_db_connection) {
        Statement dv_stmt = null;
        ResultSet rs = null;
        Connection auto_police_db_connection = null;

        try {
            dv_stmt = division_db_connection.createStatement();
            rs = dv_stmt.executeQuery("SELECT * FROM vehicle_theft_report "
                    + " WHERE REPORT_TIME > '" + last_known_report_time + "'"
                    + " AND INCIDENCE_STATE='" + IncidenceState + "'"
                    + " AND INCIDENCE_LGA='" + IncidenceLGA + "'"
                    + " LIMIT 0, 2000");

            ArrayList<Object[]> list = new ArrayList<>();
            String plate_no_list = "'";
            String seperator = "','";
            int plate_no_index = -1;
            int owner_full_name_index = -1;
            int vehicle_model_index = -1;
            int vehicle_name_index = -1;
            VehicleTheftAttribute vta = null;

            while (rs.next()) {
                vta = new VehicleTheftAttribute();

                String serial_no = rs.getString("SN");
                String reporter = rs.getString("REPORTER_FULL_NAME");
                String incidence_location = rs.getString("INCIDENCE_LOCATION");
                String report_details = rs.getString("REPORT_DETAILS");
                String reporter_phone_nos = rs.getString("REPORTER_PHONE_NOS");
                String plate_no = rs.getString("PLATE_NO");
                String detected_reporter_location = rs.getString("DETECTED_REPORTER_LOCATION");
                String action_taken = rs.getString("ACTION_TAKEN");
                String image_url = rs.getString("INCIDENCE_IMAGE_URL");
                String video_url = rs.getString("INCIDENCE_VIDEO_URL");
                Timestamp report_time = rs.getTimestamp("REPORT_TIME");

                vta.setSerialNo(Integer.parseInt(serial_no));
                vta.setReporter(reporter);
                vta.setIncidenceLocation(incidence_location);
                vta.setReportDetails(report_details);
                vta.setReporterPhoneNos(reporter_phone_nos);
                vta.setPlateNo(plate_no);
                vta.setDetectedReporterLocation(detected_reporter_location);
                vta.setActionTaken(action_taken);
                vta.setImageUrl(image_url);
                vta.setVideoUrl(video_url);
                vta.setReportTime(report_time);

                vehicleTheftMap.put(vta.getSerialNo(), vta);

                if (report_time.after(last_known_report_time)) {
                    if (new_known_report_time.before(report_time)) {
                        new_known_report_time = report_time;
                    }
                }

                plate_no_list += plate_no + seperator;

                Object[] report_row = {serial_no,
                    action_taken,
                    report_time,
                    reporter,
                    report_details
                };

                list.add(report_row);

            }

            if (list.size() < 1) {
                return;//no report
            }
            if (plate_no_list.endsWith(seperator)) {
                plate_no_list = plate_no_list.substring(0, plate_no_list.length() - 2);//remove the last 2 character
            }
            if (plate_no_list.length() < 2) {
                plate_no_list = "''";//empty IN Parameter
            }
            //set vehicle owner info
            auto_police_db_connection = this.getAutoPoliceConnection();
            Statement auto_police_stmt = auto_police_db_connection.createStatement();

            ResultSet ap_rs = auto_police_stmt.executeQuery("SELECT FIRST_NAME, MIDDLE_NAME,"
                    + " LAST_NAME,ORGANIZATION,"
                    + " VEHICLE_NAME, VEHICLE_MODEL,"
                    + " PLATE_NO FROM vehicle_owners "
                    + " WHERE PLATE_NO IN (" + plate_no_list + ")");

            if (ap_rs.next()) {
                String plate_no = ap_rs.getString("PLATE_NO");
                for (int i = 0; i < list.size(); i++) {
                    Object[] d_report_row = list.get(i);
                    if (d_report_row[plate_no_index].equals(plate_no)) {
                        String organization = ap_rs.getString("ORGANIZATION");
                        if (organization.isEmpty()) {
                            d_report_row[owner_full_name_index] = ap_rs.getString("FIRST_NAME") + " "
                                    + (ap_rs.getString("MIDDLE_NAME").isEmpty()
                                            ? "" : ap_rs.getString("MIDDLE_NAME") + " ")
                                    + ap_rs.getString("LAST_NAME");
                        } else {
                            d_report_row[owner_full_name_index] = organization;
                        }

                        d_report_row[vehicle_name_index] = ap_rs.getString("VEHICLE_NAME");
                        d_report_row[vehicle_model_index] = ap_rs.getString("VEHICLE_MODEL");

                        VehicleTheftAttribute vtap = getVehicleTheftAttributeByPlateNo(plate_no);

                        vtap.setVehicleOwner(d_report_row[owner_full_name_index].toString());
                        vtap.setVehicleName(d_report_row[vehicle_name_index].toString());
                        vtap.setVehicleModel(d_report_row[vehicle_model_index].toString());
                    }
                }
            }

            vehicleTheftTableModel.addTopRangeRowData(list);

        } catch (SQLException ex) {
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
                if (auto_police_db_connection != null) {
                    auto_police_db_connection.close();
                }
            } catch (Exception ex) {
            }
        }
    }

    private void burgularyReport(Connection division_db_connection) {
        Statement dv_stmt = null;
        ResultSet rs = null;

        try {
            dv_stmt = division_db_connection.createStatement();
            rs = dv_stmt.executeQuery("SELECT * FROM burgulary_report "
                    + " WHERE REPORT_TIME > '" + last_known_report_time + "'"
                    + " AND INCIDENCE_STATE='" + IncidenceState + "'"
                    + " AND INCIDENCE_LGA='" + IncidenceLGA + "'"
                    + " LIMIT 0, 2000");

            while (rs.next()) {

                String serial_no = rs.getString("SN");
                String reporter_full_name = rs.getString("REPORTER_FULL_NAME");
                String incidence_location = rs.getString("INCIDENCE_LOCATION");
                String report = rs.getString("REPORT_DETAILS");
                String reporter_phone_nos = rs.getString("REPORTER_PHONE_NOS");
                String detected_reporter_location = rs.getString("DETECTED_REPORTER_LOCATION");
                String action_taken = rs.getString("ACTION_TAKEN");
                String image_url = rs.getString("INCIDENCE_IMAGE_URL");
                String video_url = rs.getString("INCIDENCE_VIDEO_URL");
                Timestamp report_time = rs.getTimestamp("REPORT_TIME");

                if (report_time.after(last_known_report_time)) {
                    if (new_known_report_time.before(report_time)) {
                        new_known_report_time = report_time;
                    }
                }

            }
        } catch (SQLException ex) {
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

        }
    }

    private void murderReport(Connection division_db_connection) {
        Statement dv_stmt = null;
        ResultSet rs = null;

        try {
            dv_stmt = division_db_connection.createStatement();
            rs = dv_stmt.executeQuery("SELECT * FROM murder_report "
                    + " WHERE REPORT_TIME > '" + last_known_report_time + "'"
                    + " AND INCIDENCE_STATE='" + IncidenceState + "'"
                    + " AND INCIDENCE_LGA='" + IncidenceLGA + "'"
                    + " LIMIT 0, 2000");

            while (rs.next()) {

                String serial_no = rs.getString("SN");
                String reporter_full_name = rs.getString("REPORTER_FULL_NAME");
                String incidence_location = rs.getString("INCIDENCE_LOCATION");
                String report = rs.getString("REPORT_DETAILS");
                String reporter_phone_nos = rs.getString("REPORTER_PHONE_NOS");
                String detected_reporter_location = rs.getString("DETECTED_REPORTER_LOCATION");
                String action_taken = rs.getString("ACTION_TAKEN");
                String image_url = rs.getString("INCIDENCE_IMAGE_URL");
                String video_url = rs.getString("INCIDENCE_VIDEO_URL");
                Timestamp report_time = rs.getTimestamp("REPORT_TIME");

                if (report_time.after(last_known_report_time)) {
                    if (new_known_report_time.before(report_time)) {
                        new_known_report_time = report_time;
                    }
                }

            }

        } catch (SQLException ex) {
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

        }
    }

    private void kidnapReport(Connection division_db_connection) {
        Statement dv_stmt = null;
        ResultSet rs = null;

        try {
            dv_stmt = division_db_connection.createStatement();
            rs = dv_stmt.executeQuery("SELECT * FROM  kidnap_report "
                    + " WHERE REPORT_TIME > '" + last_known_report_time + "'"
                    + " AND INCIDENCE_STATE='" + IncidenceState + "'"
                    + " AND INCIDENCE_LGA='" + IncidenceLGA + "'"
                    + " LIMIT 0, 2000");

            KidnapAttribute kda = new KidnapAttribute();
            while (rs.next()) {

                String serial_no = rs.getString("SN");
                String reporter = rs.getString("REPORTER_FULL_NAME");
                String captive = rs.getString("CAPTIVE");
                String incidence_location = rs.getString("INCIDENCE_LOCATION");
                String report_details = rs.getString("REPORT_DETAILS");
                String reporter_phone_nos = rs.getString("REPORTER_PHONE_NOS");
                String detected_reporter_location = rs.getString("DETECTED_REPORTER_LOCATION");
                String action_taken = rs.getString("ACTION_TAKEN");
                String image_url = rs.getString("INCIDENCE_IMAGE_URL");
                String video_url = rs.getString("INCIDENCE_VIDEO_URL");
                Timestamp report_time = rs.getTimestamp("REPORT_TIME");

                kda.setSerialNo(Integer.parseInt(serial_no));
                kda.setReporter(reporter);
                kda.setCaptive(captive);
                kda.setIncidenceLocation(incidence_location);
                kda.setReportDetails(report_details);
                kda.setReporterPhoneNos(reporter_phone_nos);
                kda.setDetectedReporterLocation(detected_reporter_location);
                kda.setActionTaken(action_taken);
                kda.setImageUrl(image_url);
                kda.setVideoUrl(video_url);
                kda.setReportTime(report_time);

                kidnapMap.put(kda.getSerialNo(), kda);

                if (report_time.after(last_known_report_time)) {
                    if (new_known_report_time.before(report_time)) {
                        new_known_report_time = report_time;
                    }
                }

                Object[] report_row = {serial_no,
                    action_taken,
                    report_time,
                    reporter,
                    report_details};

                kidnapTableModel.addTopRowData(report_row);
            }
        } catch (SQLException ex) {
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

        }
    }

    private VehicleTheftAttribute getVehicleTheftAttributeByPlateNo(String plate_no) {

        Collection e = vehicleTheftMap.values();
        Iterator i = e.iterator();
        while (i.hasNext()) {
            VehicleTheftAttribute vta = (VehicleTheftAttribute) i.next();
            if (vta.getPlateNo() != null && vta.getPlateNo().equals(plate_no)) {
                return vta;
            }
        }

        return null;
    }

    /**
     * bind_name - just enter the binding name e.g mydb - the implementation as
     * been taken care of in the method. <br>
     * host - used only if context is not already created however you must set
     * it<br>
     * port - used only if context is not already created however you must set
     * it<br>
     * dbname - used only if context is not already created however you must set
     * it<br>
     * username - for security reason username is not stored in the context. It
     * is passed dynamically as parameter<br>
     * password - for security reason password is not stored in the context. It
     * is passed dynamically as parameter<br>
     *
     * @param bind_name
     * @param host
     * @param port
     * @param dbname
     * @param username
     * @param password
     * @return
     */
    static private DataSource initJNDIDatasource(String bind_name,//e.g mydb
            String host,//used only if context is not already created
            int port,//used only if context is not already created
            String dbname,//used only if context is not already created
            String username,
            String password) {

        File[] roots = File.listRoots();

        Hashtable env = new Hashtable();
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.fscontext.RefFSContextFactory");
        env.put(Context.PROVIDER_URL, "file:" + "/jdbc/");
        Context ctx = null;
        DataSource ds = null;
        try {

            ctx = new InitialContext(env);
            ds = (DataSource) ctx.lookup(bind_name);

        } catch (NameNotFoundException ex) {
            File f = new File(roots[0] + "jdbc" + "/");

            if (!f.isDirectory()) {
                boolean result = f.mkdir();

                System.out.println(result);

                try {
                    ctx = new InitialContext(env);
                    System.err.println("created path: " + roots[0] + "jdbc" + "/");
                } catch (NamingException ex1) {
                    Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex1);
                }
            }
            MysqlDataSource mysql_ds = new MysqlDataSource();
            mysql_ds.setServerName(host);
            mysql_ds.setPort(port);//default is 3306
            mysql_ds.setDatabaseName(dbname);
            mysql_ds.setUser(username);
            mysql_ds.setPassword(password);
            ds = mysql_ds;

            try {
                ctx.rebind(bind_name, ds);
                System.err.println("created bind for " + bind_name);
            } catch (NamingException ex1) {
                Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex1);
            }
        } catch (NamingException ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (ctx != null) {
                try {
                    ctx.close();
                } catch (NamingException ex) {
                }
            }
        }

        return ds;
    }

    static public Connection getDivisionConnection(String state) throws SQLException, Exception {

        synchronized (dv_lock) {//ok good. lock object is final
            if (isZoneDataSourceChange) {
                division_ds = initJNDIDatasource(zone_bind_name, zone_db_host, zone_db_port, zone_db_name, zone_db_username, zone_db_password);
                isZoneDataSourceChange = false;
                return division_ds.getConnection();
            }

            if (division_ds == null) {
                return null;
            }

            return division_ds.getConnection();
        }
    }

    static public Connection getTrackerConnection() throws SQLException {
        synchronized (tr_lock) {//ok good. lock object is final

            if (track_host.isEmpty()) {
                return null;
            }

            if (track_ds == null) {
                track_ds = initJNDIDatasource(track_bind_name, track_host, track_db_port, track_db_name, track_db_username, track_db_password);
                return track_ds.getConnection();
            }

            return track_ds.getConnection();
        }
    }

    static public Connection getAutoPoliceConnection() throws SQLException {

        synchronized (ap_lock) {//ok good. lock object is final

            if (autopoliice_host.isEmpty()) {
                return null;
            }

            if (autopolice_ds == null || autopoliice_host.isEmpty()) {
                autopolice_ds = initJNDIDatasource(jndi_ap_bind_name, autopoliice_host, autopoliice_db_port, autopoliice_db_name, autopoliice_db_username, autopoliice_db_password);
                return autopolice_ds.getConnection();
            }

            return autopolice_ds.getConnection();
        }
    }

    @Override
    public void imageLoaded(String url, Image img, JXImageView imageView) {
        System.out.println("width " + imageView.getWidth());
        System.out.println("height " + imageView.getHeight());
        Image sacled_img = img.getScaledInstance(imageView.getWidth(), imageView.getHeight(), Image.SCALE_SMOOTH);

        imageView.setImage(sacled_img);

    }

    static DBResource sendQueryDivision(String table_name, String[] sql_columns, String condition) throws SQLException, Exception {

        Connection division_db_connection = getDivisionConnection(IncidenceState);

        DBResource dBResource = new DBResource();
        dBResource.conn = division_db_connection;
        dBResource.stmt = division_db_connection.createStatement();

        String str_colums = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_colums += sql_columns[i] + (i < sql_columns.length - 1 ? " , " : "");
        }

        String srt_stmt = "SELECT " + str_colums + (table_name.isEmpty() ? "" : " FROM " + table_name) + " " + condition;

        dBResource.rs = dBResource.stmt.executeQuery(srt_stmt);
        return dBResource;
    }

    static DBResource updateStatementDivision(String table_name, SQLColumn[] sql_columns, String condition, boolean is_auto_commit) throws SQLException, Exception {

        Connection division_db_connection = getDivisionConnection(IncidenceState);
        division_db_connection.setAutoCommit(is_auto_commit);
        DBResource dBResource = new DBResource();
        dBResource.conn = division_db_connection;
        dBResource.stmt = division_db_connection.createStatement();

        String str_set = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_set += sql_columns[i].getName() + " = '" + sql_columns[i].getValue() + (i < sql_columns.length - 1 ? "' , " : "'");
        }

        String srt_stmt = "UPDATE " + table_name + " SET " + str_set + " " + condition;

        dBResource.result = dBResource.stmt.executeUpdate(srt_stmt);
        return dBResource;
    }

    static DBResource insertStatementDivision(String table_name, SQLColumn[] sql_columns, boolean is_auto_commit) throws SQLException, Exception {

        Connection division_db_connection = getDivisionConnection(IncidenceState);
        division_db_connection.setAutoCommit(is_auto_commit);
        DBResource dBResource = new DBResource();
        dBResource.conn = division_db_connection;
        dBResource.stmt = division_db_connection.createStatement();

        String str_colums = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_colums += sql_columns[i].getName() + (i < sql_columns.length - 1 ? " , " : "");
        }

        String str_values = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_values += sql_columns[i].getValue() + (i < sql_columns.length - 1 ? "' , '" : "'");
        }

        String srt_stmt = "INSERT INTO " + table_name + "( " + str_colums + ") VALUES (" + str_values + " )";

        dBResource.result = dBResource.stmt.executeUpdate(srt_stmt);
        return dBResource;
    }

    static DBResource sendQueryAutoPolice(String table_name, String[] sql_columns, String condition) throws SQLException {

        Connection auto_police_db_connection = getAutoPoliceConnection();

        DBResource dBResource = new DBResource();
        dBResource.conn = auto_police_db_connection;
        dBResource.stmt = auto_police_db_connection.createStatement();

        String str_colums = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_colums += sql_columns[i] + (i < sql_columns.length - 1 ? " , " : "");
        }

        String srt_stmt = "SELECT " + str_colums + (table_name.isEmpty() ? "" : " FROM " + table_name) + " " + condition;

        dBResource.rs = dBResource.stmt.executeQuery(srt_stmt);
        return dBResource;
    }

    static DBResource sendQueryTrackDevice(String table_name, String[] sql_columns, String condition) throws SQLException {

        Connection track_db_connection = getTrackerConnection();

        DBResource dBResource = new DBResource();
        dBResource.conn = track_db_connection;
        dBResource.stmt = track_db_connection.createStatement();

        String str_colums = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_colums += sql_columns[i] + (i < sql_columns.length - 1 ? " , " : "");
        }

        String srt_stmt = "SELECT " + str_colums + (table_name.isEmpty() ? "" : " FROM " + table_name) + " " + condition;

        dBResource.rs = dBResource.stmt.executeQuery(srt_stmt);
        return dBResource;
    }

    static DBResource updateStatementAutoPolice(String table_name, SQLColumn[] sql_columns, String condition, boolean is_auto_commit) throws SQLException {

        Connection auto_police_db_connection = getAutoPoliceConnection();
        auto_police_db_connection.setAutoCommit(is_auto_commit);

        DBResource dBResource = new DBResource();
        dBResource.conn = auto_police_db_connection;
        dBResource.stmt = auto_police_db_connection.createStatement();

        String str_set = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_set += sql_columns[i].getName() + " = '" + sql_columns[i].getValue() + (i < sql_columns.length - 1 ? "' , " : "'");
        }

        String srt_stmt = "UPDATE " + table_name + " SET " + str_set + " " + condition;

        dBResource.result = dBResource.stmt.executeUpdate(srt_stmt);
        return dBResource;
    }

    static DBResource updateStatementTrackDevice(String table_name, SQLColumn[] sql_columns, String condition, boolean is_auto_commit) throws SQLException {

        Connection track_db_connection = getTrackerConnection();
        track_db_connection.setAutoCommit(is_auto_commit);
        DBResource dBResource = new DBResource();
        dBResource.conn = track_db_connection;
        dBResource.stmt = track_db_connection.createStatement();

        String str_set = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_set += sql_columns[i].getName() + " = '" + sql_columns[i].getValue() + (i < sql_columns.length - 1 ? "' , " : "'");
        }

        String srt_stmt = "UPDATE " + table_name + " SET " + str_set + " " + condition;

        dBResource.result = dBResource.stmt.executeUpdate(srt_stmt);
        return dBResource;
    }

    static DBResource insertStatementAutoPolice(String table_name, SQLColumn[] sql_columns, boolean is_auto_commit) throws SQLException {

        if (sql_columns.length < 1) {
            return null;
        }

        Connection auto_pol_db_connection = getAutoPoliceConnection();
        auto_pol_db_connection.setAutoCommit(is_auto_commit);

        DBResource dBResource = new DBResource();
        dBResource.conn = auto_pol_db_connection;
        dBResource.stmt = auto_pol_db_connection.createStatement();

        String str_colums = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_colums += sql_columns[i].getName() + (i < sql_columns.length - 1 ? " , " : "");
        }

        String str_values = "'";
        for (int i = 0; i < sql_columns.length; i++) {
            str_values += sql_columns[i].getValue() + (i < sql_columns.length - 1 ? "' , '" : "'");
        }

        String srt_stmt = "INSERT INTO " + table_name + "( " + str_colums + ") VALUES (" + str_values + " )";

        dBResource.result = dBResource.stmt.executeUpdate(srt_stmt);
        return dBResource;
    }

    static DBResource insertStatementTrackDevice(String table_name, SQLColumn[] sql_columns, boolean is_auto_commit) throws SQLException {

        DBResource dBResource = new DBResource();

        if (sql_columns.length < 1) {
            return dBResource;
        }

        Connection track_db_connection = getTrackerConnection();
        track_db_connection.setAutoCommit(is_auto_commit);
        dBResource.conn = track_db_connection;
        dBResource.stmt = track_db_connection.createStatement();

        String str_colums = "";
        for (int i = 0; i < sql_columns.length; i++) {
            str_colums += sql_columns[i].getName() + (i < sql_columns.length - 1 ? " , " : "");
        }

        String str_values = "'";
        for (int i = 0; i < sql_columns.length; i++) {
            str_values += sql_columns[i].getValue() + (i < sql_columns.length - 1 ? "' , '" : "'");
        }

        String srt_stmt = "INSERT INTO " + table_name + "( " + str_colums + ") VALUES (" + str_values + " )";

        dBResource.result = dBResource.stmt.executeUpdate(srt_stmt);
        return dBResource;
    }

    static Date getDefaultDate() {
        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse("1600-01-01");
        } catch (ParseException ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        dropShadowBorder = new org.jdesktop.swingx.border.DropShadowBorder();
        pnlHeader = new javax.swing.JPanel();
        jToolBar1 = new javax.swing.JToolBar();
        tlgHome = new javax.swing.JToggleButton();
        jSeparator21 = new javax.swing.JToolBar.Separator();
        tolTrakMobileDevice = new javax.swing.JButton();
        jSeparator3 = new javax.swing.JToolBar.Separator();
        tolTrackVehicle = new javax.swing.JButton();
        jXSearchField1 = new org.jdesktop.swingx.JXSearchField();
        pnlBody = new javax.swing.JPanel();
        pnlHome = new javax.swing.JPanel();
        pnlHomeHeader = new javax.swing.JPanel();
        lblPoliceMontor = new javax.swing.JLabel();
        pnlDashboard = new javax.swing.JPanel();
        pnlHomeVehicleReport = new manager.ui.extend.RoundedPanel();
        lblDashboardSIMCardId = new javax.swing.JLabel();
        roundedPanel2 = new manager.ui.extend.RoundedPanel();
        lblDashboardVerifyBVN = new javax.swing.JLabel();
        roundedPanel3 = new manager.ui.extend.RoundedPanel();
        lblDashboardVehicleTracking = new javax.swing.JLabel();
        roundedPanel4 = new manager.ui.extend.RoundedPanel();
        lblDashboardMobileTracking = new javax.swing.JLabel();
        roundedPanel5 = new manager.ui.extend.RoundedPanel();
        lblDashboardVehicleReg = new javax.swing.JLabel();
        roundedPanel6 = new manager.ui.extend.RoundedPanel();
        lblDashboardCrimeControl = new javax.swing.JLabel();
        roundedPanel7 = new manager.ui.extend.RoundedPanel();
        lblDashboardCrimeDiary = new javax.swing.JLabel();
        roundedPanel8 = new manager.ui.extend.RoundedPanel();
        lblDashboardWantedPersons = new javax.swing.JLabel();
        roundedPanel9 = new manager.ui.extend.RoundedPanel();
        lblDashboardVehicleStatus = new javax.swing.JLabel();
        pnlRegisterStaff = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        txtPoliceID = new javax.swing.JTextField();
        jLabel4 = new javax.swing.JLabel();
        txtPoliceFirstName = new javax.swing.JTextField();
        jLabel5 = new javax.swing.JLabel();
        txtPoliceMiddleName = new javax.swing.JTextField();
        jLabel6 = new javax.swing.JLabel();
        txtPoliceLastName = new javax.swing.JTextField();
        jLabel7 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        txtPolicePhoneNos = new javax.swing.JTextField();
        jLabel9 = new javax.swing.JLabel();
        txtPoliceMaritalStatus = new javax.swing.JTextField();
        jLabel10 = new javax.swing.JLabel();
        jLabel11 = new javax.swing.JLabel();
        txtPoliceRank = new javax.swing.JTextField();
        jLabel12 = new javax.swing.JLabel();
        jLabel14 = new javax.swing.JLabel();
        txtPoliceLGAOfDeployment = new javax.swing.JTextField();
        jLabel15 = new javax.swing.JLabel();
        txtPoliceStateOfDeployment = new javax.swing.JTextField();
        txtPoliceStation = new javax.swing.JTextField();
        cmdRegisterStaff = new javax.swing.JButton();
        cmdEditStaff = new javax.swing.JButton();
        imgStaffPhoto = new org.jdesktop.swingx.JXImageView();
        txtStaffPhotoFilename = new javax.swing.JTextField();
        cmdBrowseStaffPhoto = new javax.swing.JButton();
        cboPoliceSex = new javax.swing.JComboBox();
        pnlRegisterOwners = new javax.swing.JPanel();
        txtPlateNo = new javax.swing.JTextField();
        jLabel13 = new javax.swing.JLabel();
        jLabel16 = new javax.swing.JLabel();
        txtOwnerFirstName = new javax.swing.JTextField();
        txtEngineNo = new javax.swing.JTextField();
        jLabel17 = new javax.swing.JLabel();
        jLabel18 = new javax.swing.JLabel();
        txtVehicleName = new javax.swing.JTextField();
        txtOwnerMiddleName = new javax.swing.JTextField();
        jLabel19 = new javax.swing.JLabel();
        jLabel20 = new javax.swing.JLabel();
        txtOwnerLastName = new javax.swing.JTextField();
        txtOwnerOrganization = new javax.swing.JTextField();
        jLabel21 = new javax.swing.JLabel();
        jLabel22 = new javax.swing.JLabel();
        txtOwnerAddress = new javax.swing.JTextField();
        jLabel23 = new javax.swing.JLabel();
        jLabel24 = new javax.swing.JLabel();
        jLabel25 = new javax.swing.JLabel();
        txtOwnerPhoneNos = new javax.swing.JTextField();
        txtOwnerFingerPrintID = new javax.swing.JTextField();
        txtVIN = new javax.swing.JTextField();
        jLabel26 = new javax.swing.JLabel();
        jLabel27 = new javax.swing.JLabel();
        txtVehicleModel = new javax.swing.JTextField();
        jLabel28 = new javax.swing.JLabel();
        cmdRegisterVehicleOwner = new javax.swing.JButton();
        cmdEditVehicleOwner = new javax.swing.JButton();
        imgVehicleOwnerPhoto = new org.jdesktop.swingx.JXImageView();
        jLabel30 = new javax.swing.JLabel();
        txtOwnerPhotoFilename = new javax.swing.JTextField();
        cmdBrowseOwnerPhoto = new javax.swing.JButton();
        txtVehiclePhotoFilename = new javax.swing.JTextField();
        imgVehiclePhoto = new org.jdesktop.swingx.JXImageView();
        jLabel29 = new javax.swing.JLabel();
        cmdBrowseVehiclePhoto = new javax.swing.JButton();
        dpDateOwned = new org.jdesktop.swingx.JXDatePicker();
        jLabel34 = new javax.swing.JLabel();
        jLabel74 = new javax.swing.JLabel();
        jLabel75 = new javax.swing.JLabel();
        jLabel76 = new javax.swing.JLabel();
        jXDatePicker1 = new org.jdesktop.swingx.JXDatePicker();
        txtVehicleTrackingDeviceNumber = new javax.swing.JTextField();
        jLabel103 = new javax.swing.JLabel();
        jLabel129 = new javax.swing.JLabel();
        cboOwnerSex = new javax.swing.JComboBox();
        cboStateOfOrigin = new javax.swing.JComboBox();
        cboGAOfOrigin = new javax.swing.JComboBox();
        splitPaneVehicleReport = new javax.swing.JSplitPane();
        scrollPaneVehicleTheft = new javax.swing.JScrollPane();
        tblVehicleTheft = new javax.swing.JTable();
        jPanel9 = new javax.swing.JPanel();
        cmdVehicleTheftBroadcast = new javax.swing.JButton();
        jLabel52 = new javax.swing.JLabel();
        lblVehicleTheftReporter = new javax.swing.JLabel();
        jLabel54 = new javax.swing.JLabel();
        lblVehicleTheftReporterPhoneNo = new javax.swing.JLabel();
        jLabel56 = new javax.swing.JLabel();
        lblVehicleTheftIncidenceTime = new javax.swing.JLabel();
        jLabel58 = new javax.swing.JLabel();
        jScrollPane5 = new javax.swing.JScrollPane();
        txaVehicleTheftReportDetails = new javax.swing.JTextArea();
        jLabel59 = new javax.swing.JLabel();
        jScrollPane6 = new javax.swing.JScrollPane();
        txaVehicleTheftDetectedReporterLocation = new javax.swing.JTextArea();
        jLabel60 = new javax.swing.JLabel();
        lblVehicleTheftOwnerFullName = new javax.swing.JLabel();
        jLabel62 = new javax.swing.JLabel();
        jScrollPane7 = new javax.swing.JScrollPane();
        txaVehicleTheftIncidenceLocation = new javax.swing.JTextArea();
        jLabel63 = new javax.swing.JLabel();
        jLabel64 = new javax.swing.JLabel();
        lblVehicleTheftVehicleName = new javax.swing.JLabel();
        lblVehicleTheftVehicleModel = new javax.swing.JLabel();
        lblVehicleTheftPlateNo = new javax.swing.JLabel();
        jLabel69 = new javax.swing.JLabel();
        cmdVehicleTheftIgnore = new javax.swing.JButton();
        cmdVehicleTheftUploadedMedia = new javax.swing.JButton();
        splitPaneKidnapReport = new javax.swing.JSplitPane();
        jScrollPane1 = new javax.swing.JScrollPane();
        tblKidnappings = new javax.swing.JTable();
        jPanel10 = new javax.swing.JPanel();
        jScrollPane8 = new javax.swing.JScrollPane();
        txaKidnapReportDetails = new javax.swing.JTextArea();
        jLabel61 = new javax.swing.JLabel();
        jScrollPane9 = new javax.swing.JScrollPane();
        txaKidnapIncidenceLocation = new javax.swing.JTextArea();
        jLabel66 = new javax.swing.JLabel();
        jLabel67 = new javax.swing.JLabel();
        lblKidnapCaptive = new javax.swing.JLabel();
        jLabel57 = new javax.swing.JLabel();
        jLabel55 = new javax.swing.JLabel();
        lblKidnapReporter = new javax.swing.JLabel();
        jLabel53 = new javax.swing.JLabel();
        lblKidnapIncidenceTime = new javax.swing.JLabel();
        cmdKidnapBroadcast = new javax.swing.JButton();
        jScrollPane10 = new javax.swing.JScrollPane();
        txaKidnapDetectedReporterLocation = new javax.swing.JTextArea();
        lblKidnapReporterPhoneNo = new javax.swing.JLabel();
        jLabel70 = new javax.swing.JLabel();
        cmdKidnapIgnore = new javax.swing.JButton();
        cmdAttachCaptivePhoto = new javax.swing.JToggleButton();
        jLabel139 = new javax.swing.JLabel();
        cmdKidnapUploadedMedia = new javax.swing.JButton();
        pnlStatusBar = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jSeparator17 = new javax.swing.JSeparator();
        jLabel2 = new javax.swing.JLabel();
        mnuMainMenu = new javax.swing.JMenuBar();
        jMenu1 = new javax.swing.JMenu();
        mnuNewReport = new javax.swing.JMenuItem();
        jSeparator18 = new javax.swing.JPopupMenu.Separator();
        jMenuItem3 = new javax.swing.JMenuItem();
        jSeparator15 = new javax.swing.JPopupMenu.Separator();
        jMenuItem2 = new javax.swing.JMenuItem();
        mnuPoliceMonitor = new javax.swing.JMenu();
        jMenuItem10 = new javax.swing.JMenuItem();
        jSeparator12 = new javax.swing.JPopupMenu.Separator();
        jMenuItem7 = new javax.swing.JMenuItem();
        jSeparator20 = new javax.swing.JPopupMenu.Separator();
        jMenuItem12 = new javax.swing.JMenuItem();
        jSeparator13 = new javax.swing.JPopupMenu.Separator();
        jMenu10 = new javax.swing.JMenu();
        mnuBVN = new javax.swing.JMenuItem();
        jSeparator2 = new javax.swing.JPopupMenu.Separator();
        mnuFRSC = new javax.swing.JMenuItem();
        jSeparator16 = new javax.swing.JPopupMenu.Separator();
        mnuNationalIDCard = new javax.swing.JMenuItem();
        jSeparator19 = new javax.swing.JPopupMenu.Separator();
        mnuSimCardReg = new javax.swing.JMenuItem();
        jSeparator1 = new javax.swing.JPopupMenu.Separator();
        jMenu8 = new javax.swing.JMenu();
        jMenuItem17 = new javax.swing.JMenuItem();
        jSeparator14 = new javax.swing.JPopupMenu.Separator();
        jMenuItem18 = new javax.swing.JMenuItem();
        jSeparator4 = new javax.swing.JPopupMenu.Separator();
        jMenu4 = new javax.swing.JMenu();
        jSeparator5 = new javax.swing.JPopupMenu.Separator();
        jMenuItem9 = new javax.swing.JMenuItem();
        jSeparator6 = new javax.swing.JPopupMenu.Separator();
        jMenu6 = new javax.swing.JMenu();
        jMenuItem8 = new javax.swing.JMenuItem();
        jSeparator9 = new javax.swing.JPopupMenu.Separator();
        jMenuItem13 = new javax.swing.JMenuItem();
        jSeparator7 = new javax.swing.JPopupMenu.Separator();
        jMenu7 = new javax.swing.JMenu();
        mnuMngVehicleTheftReport = new javax.swing.JMenuItem();
        jSeparator8 = new javax.swing.JPopupMenu.Separator();
        mnuMngKidnapingReport = new javax.swing.JMenuItem();
        jMenu9 = new javax.swing.JMenu();
        mnuCrimeControl = new javax.swing.JMenuItem();
        mnuCrimeDiary = new javax.swing.JMenuItem();
        mnuWantedPersons = new javax.swing.JMenuItem();
        jMenu2 = new javax.swing.JMenu();
        jMenuItem6 = new javax.swing.JMenuItem();
        jSeparator11 = new javax.swing.JPopupMenu.Separator();
        jMenuItem1 = new javax.swing.JMenuItem();
        jMenu5 = new javax.swing.JMenu();
        jMenuItem4 = new javax.swing.JMenuItem();
        jSeparator10 = new javax.swing.JPopupMenu.Separator();
        jMenuItem5 = new javax.swing.JMenuItem();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("Auto Police Manager");
        setBounds(this.getCenteredBounds(0.9, 0.9));
        setMinimumSize(new java.awt.Dimension(1, 1));
        addComponentListener(new java.awt.event.ComponentAdapter() {
            public void componentResized(java.awt.event.ComponentEvent evt) {
                formComponentResized(evt);
            }
        });
        getContentPane().setLayout(new javax.swing.BoxLayout(getContentPane(), javax.swing.BoxLayout.PAGE_AXIS));

        pnlHeader.setPreferredSize(new java.awt.Dimension(1200, 25));
        pnlHeader.setLayout(new javax.swing.BoxLayout(pnlHeader, javax.swing.BoxLayout.LINE_AXIS));

        jToolBar1.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.RAISED));
        jToolBar1.setFloatable(false);
        jToolBar1.setRollover(true);
        jToolBar1.setFont(new java.awt.Font("Segoe UI", 0, 10)); // NOI18N
        jToolBar1.setPreferredSize(new java.awt.Dimension(1000, 40));

        tlgHome.setText("Home");
        tlgHome.setFocusable(false);
        tlgHome.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        tlgHome.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        tlgHome.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                tlgHomeActionPerformed(evt);
            }
        });
        jToolBar1.add(tlgHome);
        jToolBar1.add(jSeparator21);

        tolTrakMobileDevice.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        tolTrakMobileDevice.setText("Track mobile device");
        tolTrakMobileDevice.setFocusable(false);
        tolTrakMobileDevice.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                tolTrakMobileDeviceActionPerformed(evt);
            }
        });
        jToolBar1.add(tolTrakMobileDevice);
        jToolBar1.add(jSeparator3);

        tolTrackVehicle.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        tolTrackVehicle.setText("Track vehicle");
        tolTrackVehicle.setFocusable(false);
        tolTrackVehicle.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                tolTrackVehicleActionPerformed(evt);
            }
        });
        jToolBar1.add(tolTrackVehicle);

        pnlHeader.add(jToolBar1);

        jXSearchField1.setNextFocusableComponent(this);
        jXSearchField1.setPreferredSize(new java.awt.Dimension(200, 25));
        jXSearchField1.setPromptFontStyle(new java.lang.Integer(3));
        jXSearchField1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jXSearchField1ActionPerformed(evt);
            }
        });
        pnlHeader.add(jXSearchField1);

        getContentPane().add(pnlHeader);

        pnlBody.setLayout(new java.awt.CardLayout());

        pnlHome.setLayout(new javax.swing.BoxLayout(pnlHome, javax.swing.BoxLayout.PAGE_AXIS));

        pnlHomeHeader.setBackground(new java.awt.Color(88, 134, 93));
        pnlHomeHeader.setPreferredSize(new java.awt.Dimension(949, 100));

        lblPoliceMontor.setFont(new java.awt.Font("Tahoma", 1, 14)); // NOI18N
        lblPoliceMontor.setForeground(new java.awt.Color(137, 231, 152));
        lblPoliceMontor.setText("Polices Monitor");
        lblPoliceMontor.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblPoliceMontorMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblPoliceMontorMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblPoliceMontorMouseExited(evt);
            }
        });

        javax.swing.GroupLayout pnlHomeHeaderLayout = new javax.swing.GroupLayout(pnlHomeHeader);
        pnlHomeHeader.setLayout(pnlHomeHeaderLayout);
        pnlHomeHeaderLayout.setHorizontalGroup(
            pnlHomeHeaderLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlHomeHeaderLayout.createSequentialGroup()
                .addContainerGap(775, Short.MAX_VALUE)
                .addComponent(lblPoliceMontor, javax.swing.GroupLayout.PREFERRED_SIZE, 183, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        pnlHomeHeaderLayout.setVerticalGroup(
            pnlHomeHeaderLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlHomeHeaderLayout.createSequentialGroup()
                .addContainerGap(64, Short.MAX_VALUE)
                .addComponent(lblPoliceMontor)
                .addContainerGap())
        );

        pnlHome.add(pnlHomeHeader);

        pnlDashboard.setBackground(new java.awt.Color(104, 150, 104));
        pnlDashboard.setBorder(javax.swing.BorderFactory.createEmptyBorder(10, 40, 10, 40));
        pnlDashboard.setLayout(new java.awt.GridLayout(3, 3, -5, -5));

        pnlHomeVehicleReport.setBackground(new java.awt.Color(255, 255, 255));
        pnlHomeVehicleReport.setDropShadowSize(2);
        pnlHomeVehicleReport.setLayout(new java.awt.GridLayout(1, 1, 10, 10));

        lblDashboardSIMCardId.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        lblDashboardSIMCardId.setForeground(new java.awt.Color(98, 183, 112));
        lblDashboardSIMCardId.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDashboardSIMCardId.setText("SIM Card Registration");
        lblDashboardSIMCardId.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        lblDashboardSIMCardId.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        lblDashboardSIMCardId.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblDashboardSIMCardIdMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseExited(evt);
            }
        });
        pnlHomeVehicleReport.add(lblDashboardSIMCardId);

        pnlDashboard.add(pnlHomeVehicleReport);

        roundedPanel2.setBackground(new java.awt.Color(255, 255, 255));
        roundedPanel2.setDropShadowSize(2);
        roundedPanel2.setLayout(new java.awt.GridLayout(1, 1, 10, 10));

        lblDashboardVerifyBVN.setBackground(new java.awt.Color(255, 255, 255));
        lblDashboardVerifyBVN.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        lblDashboardVerifyBVN.setForeground(new java.awt.Color(156, 216, 165));
        lblDashboardVerifyBVN.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDashboardVerifyBVN.setText("Verify BVN");
        lblDashboardVerifyBVN.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        lblDashboardVerifyBVN.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        lblDashboardVerifyBVN.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblDashboardVerifyBVNMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseExited(evt);
            }
        });
        roundedPanel2.add(lblDashboardVerifyBVN);

        pnlDashboard.add(roundedPanel2);

        roundedPanel3.setBackground(new java.awt.Color(255, 255, 255));
        roundedPanel3.setDropShadowSize(2);
        roundedPanel3.setLayout(new java.awt.GridLayout(1, 1, 10, 10));

        lblDashboardVehicleTracking.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        lblDashboardVehicleTracking.setForeground(new java.awt.Color(98, 183, 112));
        lblDashboardVehicleTracking.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDashboardVehicleTracking.setText("Vehicle Tracking");
        lblDashboardVehicleTracking.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        lblDashboardVehicleTracking.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        lblDashboardVehicleTracking.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleTrackingMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseExited(evt);
            }
        });
        roundedPanel3.add(lblDashboardVehicleTracking);

        pnlDashboard.add(roundedPanel3);

        roundedPanel4.setBackground(new java.awt.Color(255, 255, 255));
        roundedPanel4.setDropShadowSize(2);
        roundedPanel4.setLayout(new java.awt.GridLayout(1, 1, 10, 10));

        lblDashboardMobileTracking.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        lblDashboardMobileTracking.setForeground(new java.awt.Color(98, 183, 112));
        lblDashboardMobileTracking.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDashboardMobileTracking.setText("Mobile Tracking");
        lblDashboardMobileTracking.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        lblDashboardMobileTracking.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        lblDashboardMobileTracking.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblDashboardMobileTrackingMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseExited(evt);
            }
        });
        roundedPanel4.add(lblDashboardMobileTracking);

        pnlDashboard.add(roundedPanel4);

        roundedPanel5.setBackground(new java.awt.Color(255, 255, 255));
        roundedPanel5.setDropShadowSize(2);
        roundedPanel5.setLayout(new java.awt.GridLayout(1, 1, 10, 10));

        lblDashboardVehicleReg.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        lblDashboardVehicleReg.setForeground(new java.awt.Color(98, 183, 112));
        lblDashboardVehicleReg.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDashboardVehicleReg.setText("Vehicle Registration");
        lblDashboardVehicleReg.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        lblDashboardVehicleReg.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        lblDashboardVehicleReg.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleRegMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseExited(evt);
            }
        });
        roundedPanel5.add(lblDashboardVehicleReg);

        pnlDashboard.add(roundedPanel5);

        roundedPanel6.setBackground(new java.awt.Color(255, 255, 255));
        roundedPanel6.setDropShadowSize(2);
        roundedPanel6.setLayout(new java.awt.GridLayout(1, 1, 10, 10));

        lblDashboardCrimeControl.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        lblDashboardCrimeControl.setForeground(new java.awt.Color(98, 183, 112));
        lblDashboardCrimeControl.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDashboardCrimeControl.setText("Crime Control");
        lblDashboardCrimeControl.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        lblDashboardCrimeControl.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        lblDashboardCrimeControl.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseExited(evt);
            }
        });
        roundedPanel6.add(lblDashboardCrimeControl);

        pnlDashboard.add(roundedPanel6);

        roundedPanel7.setBackground(new java.awt.Color(255, 255, 255));
        roundedPanel7.setDropShadowSize(2);
        roundedPanel7.setLayout(new java.awt.GridLayout(1, 1, 10, 10));

        lblDashboardCrimeDiary.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        lblDashboardCrimeDiary.setForeground(new java.awt.Color(98, 183, 112));
        lblDashboardCrimeDiary.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDashboardCrimeDiary.setText("Crime Diary");
        lblDashboardCrimeDiary.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        lblDashboardCrimeDiary.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        lblDashboardCrimeDiary.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeDiaryMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseExited(evt);
            }
        });
        roundedPanel7.add(lblDashboardCrimeDiary);

        pnlDashboard.add(roundedPanel7);

        roundedPanel8.setBackground(new java.awt.Color(255, 255, 255));
        roundedPanel8.setBorder(javax.swing.BorderFactory.createEmptyBorder(50, 50, 50, 50));
        roundedPanel8.setDropShadowSize(2);
        roundedPanel8.setLayout(new java.awt.GridLayout(1, 1, 10, 10));

        lblDashboardWantedPersons.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        lblDashboardWantedPersons.setForeground(new java.awt.Color(98, 183, 112));
        lblDashboardWantedPersons.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDashboardWantedPersons.setText("Wanted Persons");
        lblDashboardWantedPersons.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        lblDashboardWantedPersons.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        lblDashboardWantedPersons.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblDashboardWantedPersonsMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseExited(evt);
            }
        });
        roundedPanel8.add(lblDashboardWantedPersons);

        pnlDashboard.add(roundedPanel8);

        roundedPanel9.setBackground(new java.awt.Color(255, 255, 255));
        roundedPanel9.setDropShadowSize(2);
        roundedPanel9.setLayout(new java.awt.GridLayout(1, 1, 10, 10));

        lblDashboardVehicleStatus.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        lblDashboardVehicleStatus.setForeground(new java.awt.Color(98, 183, 112));
        lblDashboardVehicleStatus.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        lblDashboardVehicleStatus.setText("Vehicle Status");
        lblDashboardVehicleStatus.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        lblDashboardVehicleStatus.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        lblDashboardVehicleStatus.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                lblDashboardVehicleStatusMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                lblDashboardCrimeControlMouseExited(evt);
            }
        });
        roundedPanel9.add(lblDashboardVehicleStatus);

        pnlDashboard.add(roundedPanel9);

        pnlHome.add(pnlDashboard);

        pnlBody.add(pnlHome, "cardHome");

        pnlRegisterStaff.setBackground(new java.awt.Color(255, 255, 255));

        jLabel3.setText("ID");

        jLabel4.setText("First name");

        jLabel5.setText("Middle name");

        jLabel6.setText("Last name");

        jLabel7.setText("Sex");

        jLabel8.setText("Phone nos.");

        jLabel9.setText("Marital status");

        jLabel10.setFont(new java.awt.Font("Tahoma", 2, 10)); // NOI18N
        jLabel10.setText("for more than one seperate by comma");

        jLabel11.setText("Rank");

        jLabel12.setText("Station");

        jLabel14.setText("LGA of deployment");

        txtPoliceLGAOfDeployment.setEditable(false);

        jLabel15.setText("State of deployment");

        txtPoliceStateOfDeployment.setEditable(false);

        txtPoliceStation.setEditable(false);

        cmdRegisterStaff.setText("Register Staff");
        cmdRegisterStaff.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdRegisterStaffActionPerformed(evt);
            }
        });

        cmdEditStaff.setText("Edit");

        imgStaffPhoto.setDragEnabled(true);

        javax.swing.GroupLayout imgStaffPhotoLayout = new javax.swing.GroupLayout(imgStaffPhoto);
        imgStaffPhoto.setLayout(imgStaffPhotoLayout);
        imgStaffPhotoLayout.setHorizontalGroup(
            imgStaffPhotoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 194, Short.MAX_VALUE)
        );
        imgStaffPhotoLayout.setVerticalGroup(
            imgStaffPhotoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 134, Short.MAX_VALUE)
        );

        cmdBrowseStaffPhoto.setText("...");

        cboPoliceSex.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "Male", "Female" }));
        cboPoliceSex.setSelectedIndex(-1);

        javax.swing.GroupLayout pnlRegisterStaffLayout = new javax.swing.GroupLayout(pnlRegisterStaff);
        pnlRegisterStaff.setLayout(pnlRegisterStaffLayout);
        pnlRegisterStaffLayout.setHorizontalGroup(
            pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                .addGap(24, 24, 24)
                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jLabel7)
                    .addComponent(jLabel6)
                    .addComponent(jLabel4)
                    .addComponent(jLabel3)
                    .addComponent(jLabel9)
                    .addComponent(jLabel5)
                    .addComponent(jLabel11)
                    .addComponent(jLabel12)
                    .addComponent(jLabel8))
                .addGap(28, 28, 28)
                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                    .addComponent(txtPoliceMaritalStatus)
                    .addComponent(txtPoliceID, javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(txtPoliceFirstName, javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(txtPoliceMiddleName, javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(txtPoliceLastName, javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(txtPolicePhoneNos)
                    .addComponent(txtPoliceRank)
                    .addComponent(txtPoliceStation, javax.swing.GroupLayout.DEFAULT_SIZE, 149, Short.MAX_VALUE)
                    .addComponent(cboPoliceSex, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.PREFERRED_SIZE, 81, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jLabel10))
                    .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                        .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                                .addGap(61, 61, 61)
                                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel15)
                                    .addComponent(jLabel14, javax.swing.GroupLayout.Alignment.TRAILING))
                                .addGap(18, 18, 18)
                                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(txtPoliceLGAOfDeployment)
                                    .addComponent(txtPoliceStateOfDeployment, javax.swing.GroupLayout.PREFERRED_SIZE, 156, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                                .addGap(119, 119, 119)
                                .addComponent(cmdRegisterStaff)))
                        .addGap(69, 69, 69)
                        .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addComponent(cmdEditStaff)
                            .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                                    .addComponent(txtStaffPhotoFilename, javax.swing.GroupLayout.PREFERRED_SIZE, 154, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                    .addComponent(cmdBrowseStaffPhoto, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addComponent(imgStaffPhoto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))))
                .addContainerGap(106, Short.MAX_VALUE))
        );
        pnlRegisterStaffLayout.setVerticalGroup(
            pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                        .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                                .addGap(26, 26, 26)
                                .addComponent(jLabel3))
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlRegisterStaffLayout.createSequentialGroup()
                                .addContainerGap()
                                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                        .addComponent(jLabel15)
                                        .addComponent(txtPoliceStateOfDeployment, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                                    .addComponent(txtPoliceID, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                        .addGap(18, 18, 18)
                        .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                .addComponent(jLabel14)
                                .addComponent(txtPoliceLGAOfDeployment, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                .addComponent(jLabel4)
                                .addComponent(txtPoliceFirstName, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(18, 18, 18)
                        .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel5)
                            .addComponent(txtPoliceMiddleName, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(18, 18, 18)
                        .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel6)
                            .addComponent(txtPoliceLastName, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(18, 18, 18)
                        .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel7)
                            .addComponent(cboPoliceSex, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addGroup(pnlRegisterStaffLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(imgStaffPhoto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(6, 6, 6)
                        .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(txtStaffPhotoFilename, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(cmdBrowseStaffPhoto))))
                .addGap(18, 18, 18)
                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                        .addComponent(txtPolicePhoneNos, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addComponent(jLabel10, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel8, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(18, 18, 18)
                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtPoliceMaritalStatus, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel9))
                .addGap(18, 18, 18)
                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel11)
                    .addComponent(txtPoliceRank, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addGroup(pnlRegisterStaffLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel12)
                    .addComponent(txtPoliceStation, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cmdRegisterStaff)
                    .addComponent(cmdEditStaff))
                .addContainerGap(296, Short.MAX_VALUE))
        );

        pnlBody.add(pnlRegisterStaff, "cardRegisterStaff");

        pnlRegisterOwners.setBackground(new java.awt.Color(255, 255, 255));

        jLabel13.setText("Plate no.");

        jLabel16.setText("First name");

        jLabel17.setText("Engine no.");

        jLabel18.setText("Vehicle name");

        jLabel19.setText("Middle name");

        jLabel20.setText("Last name");

        jLabel21.setText("Organization");

        jLabel22.setText("Address");

        jLabel23.setFont(new java.awt.Font("Tahoma", 2, 10)); // NOI18N
        jLabel23.setText("if it has tracking device");
        jLabel23.setVerticalAlignment(javax.swing.SwingConstants.TOP);

        jLabel24.setText("Phone nos.");

        jLabel25.setText("Finger Print ID");

        txtOwnerPhoneNos.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                txtOwnerPhoneNosActionPerformed(evt);
            }
        });

        jLabel26.setText("VIN");

        jLabel27.setText("Vehicle model");

        jLabel28.setText("Date owned");

        cmdRegisterVehicleOwner.setText("Register Vehicle Owner");
        cmdRegisterVehicleOwner.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdRegisterVehicleOwnerActionPerformed(evt);
            }
        });

        cmdEditVehicleOwner.setText("Edit");

        imgVehicleOwnerPhoto.setDragEnabled(true);

        jLabel30.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel30.setText("Owner");
        jLabel30.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);

        javax.swing.GroupLayout imgVehicleOwnerPhotoLayout = new javax.swing.GroupLayout(imgVehicleOwnerPhoto);
        imgVehicleOwnerPhoto.setLayout(imgVehicleOwnerPhotoLayout);
        imgVehicleOwnerPhotoLayout.setHorizontalGroup(
            imgVehicleOwnerPhotoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, imgVehicleOwnerPhotoLayout.createSequentialGroup()
                .addGap(0, 160, Short.MAX_VALUE)
                .addComponent(jLabel30, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE))
        );
        imgVehicleOwnerPhotoLayout.setVerticalGroup(
            imgVehicleOwnerPhotoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(imgVehicleOwnerPhotoLayout.createSequentialGroup()
                .addComponent(jLabel30, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 113, Short.MAX_VALUE))
        );

        cmdBrowseOwnerPhoto.setText("...");

        imgVehiclePhoto.setDragEnabled(true);

        jLabel29.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel29.setText("Vehicle");
        jLabel29.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);

        javax.swing.GroupLayout imgVehiclePhotoLayout = new javax.swing.GroupLayout(imgVehiclePhoto);
        imgVehiclePhoto.setLayout(imgVehiclePhotoLayout);
        imgVehiclePhotoLayout.setHorizontalGroup(
            imgVehiclePhotoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, imgVehiclePhotoLayout.createSequentialGroup()
                .addGap(0, 158, Short.MAX_VALUE)
                .addComponent(jLabel29, javax.swing.GroupLayout.PREFERRED_SIZE, 42, javax.swing.GroupLayout.PREFERRED_SIZE))
        );
        imgVehiclePhotoLayout.setVerticalGroup(
            imgVehiclePhotoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(imgVehiclePhotoLayout.createSequentialGroup()
                .addComponent(jLabel29, javax.swing.GroupLayout.PREFERRED_SIZE, 22, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 113, Short.MAX_VALUE))
        );

        cmdBrowseVehiclePhoto.setText("...");

        dpDateOwned.setFormats(new SimpleDateFormat("yyyy-MM-dd"));

        jLabel34.setText("Sex");

        jLabel74.setText("Date of biirth");

        jLabel75.setText("State of origin");

        jLabel76.setText("LGA of origin");

        jXDatePicker1.setFormats(new SimpleDateFormat("yyyy-MM-dd"));

        jLabel103.setText("Vechicle IMEI");

        jLabel129.setFont(new java.awt.Font("Tahoma", 2, 10)); // NOI18N
        jLabel129.setText("for more than one seperate by comma");
        jLabel129.setVerticalAlignment(javax.swing.SwingConstants.BOTTOM);

        cboOwnerSex.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "Male", "Female" }));
        cboOwnerSex.setSelectedIndex(-1);
        cboOwnerSex.setToolTipText("");

        javax.swing.GroupLayout pnlRegisterOwnersLayout = new javax.swing.GroupLayout(pnlRegisterOwners);
        pnlRegisterOwners.setLayout(pnlRegisterOwnersLayout);
        pnlRegisterOwnersLayout.setHorizontalGroup(
            pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                .addGap(25, 25, 25)
                .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel13, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel16, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel19, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel20, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(25, 25, 25)
                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(txtPlateNo, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(txtOwnerFirstName, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(txtOwnerMiddleName, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(txtOwnerLastName, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(90, 90, 90)
                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel25, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel26, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel17, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel18, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(10, 10, 10)
                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(txtOwnerFingerPrintID, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(txtVIN, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(txtEngineNo, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(txtVehicleName, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(110, 110, 110)
                        .addComponent(imgVehicleOwnerPhoto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel74, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel34, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel24, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel22, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel75, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addComponent(jLabel76, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jLabel21, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(25, 25, 25)
                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                                .addComponent(txtOwnerOrganization, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(90, 90, 90)
                                .addComponent(jLabel27, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(10, 10, 10)
                                .addComponent(txtVehicleModel, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(110, 110, 110)
                                .addComponent(txtOwnerPhotoFilename, javax.swing.GroupLayout.PREFERRED_SIZE, 154, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(6, 6, 6)
                                .addComponent(cmdBrowseOwnerPhoto, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                                .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                    .addComponent(cboGAOfOrigin, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(txtOwnerPhoneNos, javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(txtOwnerAddress, javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(cboOwnerSex, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.PREFERRED_SIZE, 78, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(cboStateOfOrigin, 0, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(jXDatePicker1, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, 130, Short.MAX_VALUE))
                                .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                                        .addGap(2, 2, 2)
                                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel129)
                                            .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                                                .addGap(88, 88, 88)
                                                .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                                    .addComponent(jLabel103, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE)
                                                    .addComponent(jLabel28, javax.swing.GroupLayout.PREFERRED_SIZE, 100, javax.swing.GroupLayout.PREFERRED_SIZE))))
                                        .addGap(10, 10, 10)
                                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(txtVehicleTrackingDeviceNumber, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(dpDateOwned, javax.swing.GroupLayout.PREFERRED_SIZE, 130, javax.swing.GroupLayout.PREFERRED_SIZE))
                                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel23, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                                                .addGap(110, 110, 110)
                                                .addComponent(imgVehiclePhoto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlRegisterOwnersLayout.createSequentialGroup()
                                        .addGap(70, 70, 70)
                                        .addComponent(cmdRegisterVehicleOwner)
                                        .addGap(87, 87, 87)
                                        .addComponent(cmdEditVehicleOwner)
                                        .addGap(89, 89, 89)
                                        .addComponent(txtVehiclePhotoFilename, javax.swing.GroupLayout.PREFERRED_SIZE, 154, javax.swing.GroupLayout.PREFERRED_SIZE)
                                        .addGap(6, 6, 6)
                                        .addComponent(cmdBrowseVehiclePhoto, javax.swing.GroupLayout.PREFERRED_SIZE, 34, javax.swing.GroupLayout.PREFERRED_SIZE))))))))
        );
        pnlRegisterOwnersLayout.setVerticalGroup(
            pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                .addGap(25, 25, 25)
                .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addComponent(jLabel13)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel16)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel19)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel20))
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addComponent(txtPlateNo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(15, 15, 15)
                        .addComponent(txtOwnerFirstName, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(15, 15, 15)
                        .addComponent(txtOwnerMiddleName, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(15, 15, 15)
                        .addComponent(txtOwnerLastName, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addComponent(jLabel25)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel26)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel17)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel18))
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addComponent(txtOwnerFingerPrintID, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(15, 15, 15)
                        .addComponent(txtVIN, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(15, 15, 15)
                        .addComponent(txtEngineNo, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(15, 15, 15)
                        .addComponent(txtVehicleName, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addGap(5, 5, 5)
                        .addComponent(imgVehicleOwnerPhoto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel21)
                    .addComponent(txtOwnerOrganization, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel27)
                    .addComponent(txtVehicleModel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addGap(5, 5, 5)
                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(txtOwnerPhotoFilename, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(cmdBrowseOwnerPhoto))))
                .addGap(7, 7, 7)
                .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addComponent(jLabel74)
                        .addGap(21, 21, 21)
                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel34, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(cboOwnerSex, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(15, 15, 15)
                        .addComponent(jLabel24)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel22)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel75))
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addComponent(jXDatePicker1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(48, 48, 48)
                        .addComponent(txtOwnerPhoneNos, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(15, 15, 15)
                        .addComponent(txtOwnerAddress, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(15, 15, 15)
                        .addComponent(cboStateOfOrigin, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addComponent(jLabel103)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel28)
                        .addGap(21, 21, 21)
                        .addComponent(jLabel129, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addComponent(txtVehicleTrackingDeviceNumber, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(15, 15, 15)
                        .addComponent(dpDateOwned, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addComponent(jLabel23, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(0, 0, 0)
                        .addComponent(imgVehiclePhoto, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(10, 10, 10)
                .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(cmdRegisterVehicleOwner)
                    .addComponent(cmdEditVehicleOwner)
                    .addComponent(txtVehiclePhotoFilename, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cmdBrowseVehiclePhoto)
                    .addGroup(pnlRegisterOwnersLayout.createSequentialGroup()
                        .addGap(5, 5, 5)
                        .addGroup(pnlRegisterOwnersLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel76)
                            .addComponent(cboGAOfOrigin, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)))))
        );

        pnlBody.add(pnlRegisterOwners, "cardRegisterOwners");

        splitPaneVehicleReport.setBackground(new java.awt.Color(255, 255, 255));
        splitPaneVehicleReport.setDividerLocation(650);
        splitPaneVehicleReport.setDividerSize(3);

        scrollPaneVehicleTheft.setBackground(new java.awt.Color(255, 255, 255));

        tblVehicleTheft.setModel(vehicleTheftTableModel);
        tblVehicleTheft.setRowHeight(40);
        tblVehicleTheft.setSelectionModel(setVehicleTheftTableSelectionModel());
        scrollPaneVehicleTheft.setViewportView(tblVehicleTheft);

        splitPaneVehicleReport.setLeftComponent(scrollPaneVehicleTheft);

        jPanel9.setBackground(new java.awt.Color(255, 255, 255));

        cmdVehicleTheftBroadcast.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        cmdVehicleTheftBroadcast.setText("Broadcast");
        cmdVehicleTheftBroadcast.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdVehicleTheftBroadcastActionPerformed(evt);
            }
        });

        jLabel52.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel52.setText("Incidence time");

        jLabel54.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel54.setText("Reporter");

        jLabel56.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel56.setText("Report phone no.");

        jLabel58.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel58.setText("Detected reporter location");

        txaVehicleTheftReportDetails.setEditable(false);
        txaVehicleTheftReportDetails.setColumns(20);
        txaVehicleTheftReportDetails.setRows(5);
        jScrollPane5.setViewportView(txaVehicleTheftReportDetails);

        jLabel59.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel59.setText("Report details");

        txaVehicleTheftDetectedReporterLocation.setEditable(false);
        txaVehicleTheftDetectedReporterLocation.setColumns(20);
        txaVehicleTheftDetectedReporterLocation.setRows(5);
        txaVehicleTheftDetectedReporterLocation.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                txaVehicleTheftDetectedReporterLocationMouseClicked(evt);
            }
        });
        jScrollPane6.setViewportView(txaVehicleTheftDetectedReporterLocation);

        jLabel60.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel60.setText("Incidence location");

        jLabel62.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel62.setText("Owner full name");

        txaVehicleTheftIncidenceLocation.setEditable(false);
        txaVehicleTheftIncidenceLocation.setColumns(20);
        txaVehicleTheftIncidenceLocation.setRows(5);
        jScrollPane7.setViewportView(txaVehicleTheftIncidenceLocation);

        jLabel63.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel63.setText("Vehicle name");

        jLabel64.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel64.setText("Vehicle model");

        jLabel69.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel69.setText("Plate no.");

        cmdVehicleTheftIgnore.setText("Ignore");
        cmdVehicleTheftIgnore.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdVehicleTheftIgnoreActionPerformed(evt);
            }
        });

        cmdVehicleTheftUploadedMedia.setText("Uploaded image/video");

        javax.swing.GroupLayout jPanel9Layout = new javax.swing.GroupLayout(jPanel9);
        jPanel9.setLayout(jPanel9Layout);
        jPanel9Layout.setHorizontalGroup(
            jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel9Layout.createSequentialGroup()
                .addGap(10, 10, 10)
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel9Layout.createSequentialGroup()
                        .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel9Layout.createSequentialGroup()
                                .addComponent(jLabel52)
                                .addGap(41, 41, 41)
                                .addComponent(lblVehicleTheftIncidenceTime))
                            .addGroup(jPanel9Layout.createSequentialGroup()
                                .addComponent(jLabel54)
                                .addGap(75, 75, 75)
                                .addComponent(lblVehicleTheftReporter, javax.swing.GroupLayout.PREFERRED_SIZE, 180, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel9Layout.createSequentialGroup()
                                .addComponent(jLabel56)
                                .addGap(20, 20, 20)
                                .addComponent(lblVehicleTheftReporterPhoneNo))
                            .addGroup(jPanel9Layout.createSequentialGroup()
                                .addComponent(jLabel62)
                                .addGap(30, 30, 30)
                                .addComponent(lblVehicleTheftOwnerFullName))
                            .addGroup(jPanel9Layout.createSequentialGroup()
                                .addComponent(jLabel63)
                                .addGap(51, 51, 51)
                                .addComponent(lblVehicleTheftVehicleName))
                            .addGroup(jPanel9Layout.createSequentialGroup()
                                .addComponent(jLabel64)
                                .addGap(47, 47, 47)
                                .addComponent(lblVehicleTheftVehicleModel))
                            .addComponent(jLabel60)
                            .addComponent(jScrollPane7, javax.swing.GroupLayout.PREFERRED_SIZE, 270, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel59)
                            .addComponent(jScrollPane5, javax.swing.GroupLayout.PREFERRED_SIZE, 270, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel9Layout.createSequentialGroup()
                                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel69)
                                    .addComponent(jLabel58))
                                .addGap(149, 149, 149)
                                .addComponent(lblVehicleTheftPlateNo)))
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                    .addGroup(jPanel9Layout.createSequentialGroup()
                        .addComponent(cmdVehicleTheftBroadcast, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(cmdVehicleTheftIgnore)
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
            .addGroup(jPanel9Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane6, javax.swing.GroupLayout.PREFERRED_SIZE, 270, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cmdVehicleTheftUploadedMedia))
                .addGap(0, 0, Short.MAX_VALUE))
        );
        jPanel9Layout.setVerticalGroup(
            jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel9Layout.createSequentialGroup()
                .addGap(10, 10, 10)
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(cmdVehicleTheftBroadcast, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(cmdVehicleTheftIgnore))
                .addGap(10, 10, 10)
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel52)
                    .addComponent(lblVehicleTheftIncidenceTime))
                .addGap(5, 5, 5)
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel54)
                    .addComponent(lblVehicleTheftReporter))
                .addGap(5, 5, 5)
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel56)
                    .addComponent(lblVehicleTheftReporterPhoneNo))
                .addGap(5, 5, 5)
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel62)
                    .addComponent(lblVehicleTheftOwnerFullName))
                .addGap(5, 5, 5)
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel63)
                    .addComponent(lblVehicleTheftVehicleName))
                .addGap(5, 5, 5)
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel64)
                    .addComponent(lblVehicleTheftVehicleModel))
                .addGap(5, 5, 5)
                .addGroup(jPanel9Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel69)
                    .addComponent(lblVehicleTheftPlateNo))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(cmdVehicleTheftUploadedMedia)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel58)
                .addGap(9, 9, 9)
                .addComponent(jScrollPane6, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel60)
                .addGap(5, 5, 5)
                .addComponent(jScrollPane7, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(11, 11, 11)
                .addComponent(jLabel59)
                .addGap(5, 5, 5)
                .addComponent(jScrollPane5, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(217, Short.MAX_VALUE))
        );

        splitPaneVehicleReport.setRightComponent(jPanel9);

        pnlBody.add(splitPaneVehicleReport, "cardVehicleReport");

        splitPaneKidnapReport.setBackground(new java.awt.Color(255, 255, 255));
        splitPaneKidnapReport.setDividerLocation(650);
        splitPaneKidnapReport.setDividerSize(3);
        splitPaneKidnapReport.setAutoscrolls(true);

        jScrollPane1.setBackground(new java.awt.Color(255, 255, 255));

        tblKidnappings.setModel(kidnapTableModel);
        tblKidnappings.setRowHeight(40);
        tblKidnappings.setSelectionModel(setKidapTableSelectionModel());
        jScrollPane1.setViewportView(tblKidnappings);

        splitPaneKidnapReport.setLeftComponent(jScrollPane1);

        jPanel10.setBackground(new java.awt.Color(255, 255, 255));

        txaKidnapReportDetails.setColumns(20);
        txaKidnapReportDetails.setRows(5);
        jScrollPane8.setViewportView(txaKidnapReportDetails);

        jLabel61.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel61.setText("Report details");

        txaKidnapIncidenceLocation.setColumns(20);
        txaKidnapIncidenceLocation.setRows(5);
        jScrollPane9.setViewportView(txaKidnapIncidenceLocation);

        jLabel66.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel66.setText("Incidence location");

        jLabel67.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel67.setText("Detected reporter location");

        lblKidnapCaptive.setName(""); // NOI18N

        jLabel57.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel57.setText("Captive");

        jLabel55.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel55.setText("Reporter");

        lblKidnapReporter.setName(""); // NOI18N

        jLabel53.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel53.setText("Incidence time");

        lblKidnapIncidenceTime.setName(""); // NOI18N

        cmdKidnapBroadcast.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        cmdKidnapBroadcast.setText("Broadcast");
        cmdKidnapBroadcast.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdKidnapBroadcastActionPerformed(evt);
            }
        });

        txaKidnapDetectedReporterLocation.setColumns(20);
        txaKidnapDetectedReporterLocation.setRows(5);
        jScrollPane10.setViewportView(txaKidnapDetectedReporterLocation);

        lblKidnapReporterPhoneNo.setName(""); // NOI18N

        jLabel70.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        jLabel70.setText("Reporter phone no.");

        cmdKidnapIgnore.setText("Ignore");

        cmdAttachCaptivePhoto.setText("Attach");
        cmdAttachCaptivePhoto.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cmdAttachCaptivePhotoActionPerformed(evt);
            }
        });

        cmdKidnapUploadedMedia.setText("Uploaded image/video");

        javax.swing.GroupLayout jPanel10Layout = new javax.swing.GroupLayout(jPanel10);
        jPanel10.setLayout(jPanel10Layout);
        jPanel10Layout.setHorizontalGroup(
            jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel10Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel10Layout.createSequentialGroup()
                        .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel66)
                            .addComponent(jScrollPane9, javax.swing.GroupLayout.PREFERRED_SIZE, 270, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jLabel61)
                            .addComponent(jScrollPane8, javax.swing.GroupLayout.PREFERRED_SIZE, 270, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(jScrollPane10, javax.swing.GroupLayout.PREFERRED_SIZE, 270, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel10Layout.createSequentialGroup()
                                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                                    .addComponent(jLabel139, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(jLabel67, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                                .addGap(18, 18, 18)
                                .addComponent(cmdAttachCaptivePhoto, javax.swing.GroupLayout.PREFERRED_SIZE, 81, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel10Layout.createSequentialGroup()
                                .addComponent(cmdKidnapBroadcast, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(18, 77, Short.MAX_VALUE)
                                .addComponent(cmdKidnapIgnore)))
                        .addContainerGap(22, Short.MAX_VALUE))
                    .addGroup(jPanel10Layout.createSequentialGroup()
                        .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel10Layout.createSequentialGroup()
                                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(jLabel53)
                                    .addComponent(jLabel57)
                                    .addComponent(jLabel55))
                                .addGap(43, 43, 43)
                                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                                    .addComponent(lblKidnapReporter, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(lblKidnapIncidenceTime, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                    .addComponent(lblKidnapCaptive, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                            .addGroup(jPanel10Layout.createSequentialGroup()
                                .addComponent(jLabel70)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(lblKidnapReporterPhoneNo, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                        .addGap(20, 20, 20))
                    .addGroup(jPanel10Layout.createSequentialGroup()
                        .addComponent(cmdKidnapUploadedMedia)
                        .addGap(0, 0, Short.MAX_VALUE))))
        );
        jPanel10Layout.setVerticalGroup(
            jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel10Layout.createSequentialGroup()
                .addGap(13, 13, 13)
                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(cmdKidnapIgnore)
                    .addComponent(cmdKidnapBroadcast, javax.swing.GroupLayout.PREFERRED_SIZE, 32, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18)
                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel53)
                    .addComponent(lblKidnapIncidenceTime, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(5, 5, 5)
                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel55)
                    .addComponent(lblKidnapReporter, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(5, 5, 5)
                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel57)
                    .addComponent(lblKidnapCaptive, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel70)
                    .addComponent(lblKidnapReporterPhoneNo, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addGroup(jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(cmdAttachCaptivePhoto)
                    .addComponent(jLabel139, javax.swing.GroupLayout.PREFERRED_SIZE, 20, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 84, Short.MAX_VALUE)
                .addComponent(cmdKidnapUploadedMedia)
                .addGap(18, 18, 18)
                .addComponent(jLabel67)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane10, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel66)
                .addGap(5, 5, 5)
                .addComponent(jScrollPane9, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(11, 11, 11)
                .addComponent(jLabel61)
                .addGap(5, 5, 5)
                .addComponent(jScrollPane8, javax.swing.GroupLayout.PREFERRED_SIZE, 39, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(116, Short.MAX_VALUE))
        );

        splitPaneKidnapReport.setRightComponent(jPanel10);

        pnlBody.add(splitPaneKidnapReport, "cardKidnapReport");

        getContentPane().add(pnlBody);

        jLabel1.setText("Not connected");

        jSeparator17.setOrientation(javax.swing.SwingConstants.VERTICAL);

        jLabel2.setText("message goes here");

        javax.swing.GroupLayout pnlStatusBarLayout = new javax.swing.GroupLayout(pnlStatusBar);
        pnlStatusBar.setLayout(pnlStatusBarLayout);
        pnlStatusBarLayout.setHorizontalGroup(
            pnlStatusBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(pnlStatusBarLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jSeparator17, javax.swing.GroupLayout.PREFERRED_SIZE, 6, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(jLabel2)
                .addContainerGap(775, Short.MAX_VALUE))
        );
        pnlStatusBarLayout.setVerticalGroup(
            pnlStatusBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, pnlStatusBarLayout.createSequentialGroup()
                .addGap(0, 0, Short.MAX_VALUE)
                .addGroup(pnlStatusBarLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jSeparator17)
                    .addComponent(jLabel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
        );

        getContentPane().add(pnlStatusBar);

        jMenu1.setText("File");

        mnuNewReport.setText("New Report");
        mnuNewReport.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuNewReportActionPerformed(evt);
            }
        });
        jMenu1.add(mnuNewReport);
        jMenu1.add(jSeparator18);

        jMenuItem3.setText("Open");
        jMenu1.add(jMenuItem3);
        jMenu1.add(jSeparator15);

        jMenuItem2.setText("Exit");
        jMenu1.add(jMenuItem2);

        mnuMainMenu.add(jMenu1);

        mnuPoliceMonitor.setText("View");

        jMenuItem10.setIcon(new javax.swing.ImageIcon(getClass().getResource("/images/people_18.png"))); // NOI18N
        jMenuItem10.setText("Register Staff");
        jMenuItem10.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem10ActionPerformed(evt);
            }
        });
        mnuPoliceMonitor.add(jMenuItem10);
        mnuPoliceMonitor.add(jSeparator12);

        jMenuItem7.setText("Police Monitor");
        jMenuItem7.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem7ActionPerformed(evt);
            }
        });
        mnuPoliceMonitor.add(jMenuItem7);
        mnuPoliceMonitor.add(jSeparator20);

        jMenuItem12.setText("Register Vehicle Owners");
        jMenuItem12.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem12ActionPerformed(evt);
            }
        });
        mnuPoliceMonitor.add(jMenuItem12);
        mnuPoliceMonitor.add(jSeparator13);

        jMenu10.setText("Identity");

        mnuBVN.setText("BVN");
        mnuBVN.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuBVNActionPerformed(evt);
            }
        });
        jMenu10.add(mnuBVN);
        jMenu10.add(jSeparator2);

        mnuFRSC.setText("FRSC");
        mnuFRSC.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuFRSCActionPerformed(evt);
            }
        });
        jMenu10.add(mnuFRSC);
        jMenu10.add(jSeparator16);

        mnuNationalIDCard.setText("Nation ID Card");
        mnuNationalIDCard.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuNationalIDCardActionPerformed(evt);
            }
        });
        jMenu10.add(mnuNationalIDCard);
        jMenu10.add(jSeparator19);

        mnuSimCardReg.setText("Sim Card Registration");
        mnuSimCardReg.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuSimCardRegActionPerformed(evt);
            }
        });
        jMenu10.add(mnuSimCardReg);

        mnuPoliceMonitor.add(jMenu10);
        mnuPoliceMonitor.add(jSeparator1);

        jMenu8.setText("Incidence Reports");

        jMenuItem17.setText("Vehicle Theft");
        jMenuItem17.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem17ActionPerformed(evt);
            }
        });
        jMenu8.add(jMenuItem17);
        jMenu8.add(jSeparator14);

        jMenuItem18.setText("Kidnapings");
        jMenuItem18.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem18ActionPerformed(evt);
            }
        });
        jMenu8.add(jMenuItem18);

        mnuPoliceMonitor.add(jMenu8);
        mnuPoliceMonitor.add(jSeparator4);

        mnuMainMenu.add(mnuPoliceMonitor);

        jMenu4.setText("Actions");
        jMenu4.add(jSeparator5);

        jMenuItem9.setText("Register");
        jMenu4.add(jMenuItem9);
        jMenu4.add(jSeparator6);

        jMenu6.setText("Track");

        jMenuItem8.setText("Mobile device");
        jMenuItem8.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem8ActionPerformed(evt);
            }
        });
        jMenu6.add(jMenuItem8);
        jMenu6.add(jSeparator9);

        jMenuItem13.setText("Vehicle");
        jMenuItem13.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem13ActionPerformed(evt);
            }
        });
        jMenu6.add(jMenuItem13);

        jMenu4.add(jMenu6);
        jMenu4.add(jSeparator7);

        jMenu7.setText("Manage Report");

        mnuMngVehicleTheftReport.setText("Vehicle Theft");
        mnuMngVehicleTheftReport.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuMngVehicleTheftReportActionPerformed(evt);
            }
        });
        jMenu7.add(mnuMngVehicleTheftReport);
        jMenu7.add(jSeparator8);

        mnuMngKidnapingReport.setText("Kidnapings");
        mnuMngKidnapingReport.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuMngKidnapingReportActionPerformed(evt);
            }
        });
        jMenu7.add(mnuMngKidnapingReport);

        jMenu4.add(jMenu7);

        mnuMainMenu.add(jMenu4);

        jMenu9.setText("Crime");

        mnuCrimeControl.setText("Crime Control");
        mnuCrimeControl.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuCrimeControlActionPerformed(evt);
            }
        });
        jMenu9.add(mnuCrimeControl);

        mnuCrimeDiary.setText("Crime Diary");
        mnuCrimeDiary.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuCrimeDiaryActionPerformed(evt);
            }
        });
        jMenu9.add(mnuCrimeDiary);

        mnuWantedPersons.setText("Wanted Persons");
        mnuWantedPersons.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                mnuWantedPersonsActionPerformed(evt);
            }
        });
        jMenu9.add(mnuWantedPersons);

        mnuMainMenu.add(jMenu9);

        jMenu2.setText("Settings");

        jMenuItem6.setText("Setup Configuration");
        jMenuItem6.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem6ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem6);
        jMenu2.add(jSeparator11);

        jMenuItem1.setText("Options");
        jMenuItem1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem1ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem1);

        mnuMainMenu.add(jMenu2);

        jMenu5.setText("Help");

        jMenuItem4.setText("Content");
        jMenu5.add(jMenuItem4);
        jMenu5.add(jSeparator10);

        jMenuItem5.setText("About");
        jMenu5.add(jMenuItem5);

        mnuMainMenu.add(jMenu5);

        setJMenuBar(mnuMainMenu);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jMenuItem1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem1ActionPerformed
        // TODO add your handling code here:         
    }//GEN-LAST:event_jMenuItem1ActionPerformed

    private void jXSearchField1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jXSearchField1ActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jXSearchField1ActionPerformed

    private void cmdRegisterStaffActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdRegisterStaffActionPerformed

        if (cboPoliceSex.getSelectedItem() == null) {
            JOptionPane.showMessageDialog(this, "Sex is empty", "Invalid", JOptionPane.ERROR_MESSAGE);
            return;
        }

        JTextField[] except_fields = {this.txtPoliceMiddleName, this.txtStaffPhotoFilename};
        if (!validateEmptyInput(this.pnlRegisterStaff, except_fields)) {
            JOptionPane.showMessageDialog(this, "Field is empty", "Invalid", JOptionPane.ERROR_MESSAGE);
            return;
        }

        //Photos will be sent first
        String staff_img_file_name = imgStaffPhoto.getImageString();

        //get unique number for staff photo
        long unique_number = getUniqueNumber();
        if (unique_number == -1) {
            int option = JOptionPane.showConfirmDialog(this, "Initialize photo send failed!\nCheck your connection.\nTry again?", "Unsent Staff Photo", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
            if (option == JOptionPane.NO_OPTION) {
                return;
            }
            cmdRegisterStaffActionPerformed(evt);
        }

        //send staff photo
        String remote_staff_photo_filename = sendPhotoToServerByFTP(staff_img_file_name, unique_number);
        if (remote_staff_photo_filename == null || remote_staff_photo_filename.isEmpty()) {
            int option = JOptionPane.showConfirmDialog(this, "Could not send staff photo!\nCheck your connection.\nTry again?", "Unsent Staff Photo", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
            if (option == JOptionPane.NO_OPTION) {
                return;
            }
            cmdRegisterStaffActionPerformed(evt);
        }

        SQLColumn[] sql_columns = {new SQLColumn("ID", this.txtPoliceID.getText()),
            new SQLColumn("FIRST_NAME", this.txtPoliceFirstName.getText()),
            new SQLColumn("MIDDLE_NAME", this.txtPoliceMiddleName.getText()),
            new SQLColumn("LAST_NAME", this.txtPoliceLastName.getText()),
            new SQLColumn("SEX", this.cboPoliceSex.getSelectedItem()),
            new SQLColumn("PHONE_NO", this.txtPolicePhoneNos.getText()),
            new SQLColumn("STATION_CATEGORY", this.txtPoliceStation.getText()),
            new SQLColumn("LGA_OF_DEPLOYMENT", this.txtPoliceLGAOfDeployment.getText()),
            new SQLColumn("STATE_OF_DEPLOYMENT", this.txtPoliceStateOfDeployment.getText()),
            new SQLColumn("RANK", this.txtPoliceRank.getText()),
            new SQLColumn("MARITAL_STATUS", this.txtPoliceMaritalStatus.getText()),
            new SQLColumn("PHOTO_FILE_NAME", remote_staff_photo_filename)};

        DBResource dBResource = null;

        try {

            dBResource = insertStatementAutoPolice("police_profile", sql_columns, true);
            JOptionPane.showMessageDialog(this,
                    this.txtPoliceFirstName.getText() + " "
                    + (this.txtPoliceMiddleName.getText().isEmpty()
                            ? "" : this.txtPoliceMiddleName.getText() + " ")
                    + this.txtPoliceLastName.getText() + " has been successfully registered.",
                    "Successful", JOptionPane.OK_OPTION);

        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Failed to register "
                    + this.txtPoliceFirstName.getText() + " "
                    + (this.txtPoliceMiddleName.getText().isEmpty()
                            ? "" : this.txtPoliceMiddleName.getText() + " ")
                    + this.txtPoliceLastName.getText() + ".",
                    "Failed", JOptionPane.OK_OPTION);
            ex.printStackTrace();
        } finally {
            if (dBResource == null) {
                dBResource.close();
            }
        }

    }//GEN-LAST:event_cmdRegisterStaffActionPerformed

    private void cmdRegisterVehicleOwnerActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdRegisterVehicleOwnerActionPerformed

        // TODO add your handling code here:
        JComponent[] except_fields = {this.txtOwnerMiddleName, this.txtOwnerPhotoFilename, this.txtVehiclePhotoFilename};
        if (!validateEmptyInput(this.pnlRegisterOwners, except_fields)) {
            JOptionPane.showMessageDialog(this, "Field is empty", "Invalid", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (this.dpDateOwned.getDate() == null) {
            JOptionPane.showMessageDialog(this, "Enter date owned", "Invalid", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (cboOwnerSex.getSelectedItem() == null) {
            JOptionPane.showMessageDialog(this, "Select sex", "Invalid", JOptionPane.ERROR_MESSAGE);
            return;
        }

        //Photos will be sent first
        String vehicle_owner_img_file_name = imgVehicleOwnerPhoto.getImageString();
        String vehicle_img_file_name = imgVehiclePhoto.getImageString();

        //get unique number for owner photo
        long unique_number = getUniqueNumber();
        if (unique_number == -1) {
            int option = JOptionPane.showConfirmDialog(this, "Initialize photo send failed!\nCheck your connection.\nTry again?", "Unsent Owner Photo", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
            if (option == JOptionPane.NO_OPTION) {
                return;
            }
            cmdRegisterVehicleOwnerActionPerformed(evt);
        }

        //send owner photo
        String remote_vehicle_owner_photo_filename = sendPhotoToServerByFTP(vehicle_owner_img_file_name, unique_number);
        if (remote_vehicle_owner_photo_filename == null || remote_vehicle_owner_photo_filename.isEmpty()) {
            int option = JOptionPane.showConfirmDialog(this, "Could not send vehicle owner's photo!\nCheck your connection.\nTry again?", "Unsent Owner Photo", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
            if (option == JOptionPane.NO_OPTION) {
                return;
            }
            cmdRegisterVehicleOwnerActionPerformed(evt);
        }

        //get unique number for vehicle photo
        unique_number = getUniqueNumber();
        if (unique_number == -1) {
            int option = JOptionPane.showConfirmDialog(this, "Initialize photo send failed!\nCheck your connection.\nTry again?", "Unsent Vehicle Photo", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
            if (option == JOptionPane.NO_OPTION) {
                return;
            }
            cmdRegisterVehicleOwnerActionPerformed(evt);
        }

        //send vehicle photo
        String remote_vehicle_photo_filename = sendPhotoToServerByFTP(vehicle_img_file_name, unique_number);
        if (remote_vehicle_photo_filename == null || remote_vehicle_photo_filename.isEmpty()) {
            int option = JOptionPane.showConfirmDialog(this, "Could not send vehicle photo!\nCheck your connection.\nTry again?", "Unsent Vehicle Photo", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
            if (option == JOptionPane.NO_OPTION) {
                return;
            }
            cmdRegisterVehicleOwnerActionPerformed(evt);
        }

        SQLColumn[] sql_columns = {new SQLColumn("FIRST_NAME", this.txtOwnerFirstName.getText()),
            new SQLColumn("MIDDLE_NAME", this.txtOwnerMiddleName.getText()),
            new SQLColumn("LAST_NAME", this.txtOwnerLastName.getText()),
            new SQLColumn("ORGANIZATION", this.txtOwnerOrganization.getText()),
            new SQLColumn("SEX", cboOwnerSex.getSelectedItem()),
            new SQLColumn("ADDRESS", this.txtOwnerAddress.getText()),
            new SQLColumn("OWNER_PHONE_NO", this.txtOwnerPhoneNos.getText()),
            new SQLColumn("FINGER_PRINT_ID", this.txtOwnerFingerPrintID.getText()),
            new SQLColumn("VIN", this.txtVIN.getText()),
            new SQLColumn("PLATE_NO", this.txtPlateNo.getText()),
            new SQLColumn("ENGINE_NO", this.txtEngineNo.getText()),
            new SQLColumn("VEHICLE_NAME", this.txtVehicleName.getText()),
            new SQLColumn("VEHICLE_MODEL", this.txtVehicleModel.getText()),
            new SQLColumn("VEHICLE_IMEI", this.txtVehicleTrackingDeviceNumber.getText()),
            new SQLColumn("DATE_OWNED", new java.sql.Date(this.dpDateOwned.getDate().getTime())),
            new SQLColumn("OWNER_PHOTO_FILE_NAME", remote_vehicle_owner_photo_filename),
            new SQLColumn("VEHICLE_PHOTO_FILE_NAME", remote_vehicle_photo_filename)
        };

        //OWNER_PHOTO_FILE_NAME
        //VEHICLE_PHOTO_FILE_NAME
        DBResource dBResource = null;
        try {
            dBResource = insertStatementAutoPolice("vehicle_owners", sql_columns, true);

            JOptionPane.showMessageDialog(this,
                    this.txtOwnerFirstName.getText() + " "
                    + (this.txtOwnerMiddleName.getText().isEmpty()
                            ? "" : this.txtOwnerMiddleName.getText() + " ")
                    + this.txtOwnerLastName.getText() + " has been successfully registered.",
                    "Successful", JOptionPane.OK_OPTION);

        } catch (Exception ex) {

            JOptionPane.showMessageDialog(this, "Failed to resgister "
                    + this.txtOwnerFirstName.getText() + " "
                    + (this.txtOwnerMiddleName.getText().isEmpty()
                            ? "" : this.txtOwnerMiddleName.getText() + " ")
                    + this.txtOwnerLastName.getText() + ".",
                    "Failed", JOptionPane.OK_OPTION);
            ex.printStackTrace();
        } finally {
            if (dBResource != null) {
                dBResource.close();
            }
        }

    }//GEN-LAST:event_cmdRegisterVehicleOwnerActionPerformed

    private void jMenuItem6ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem6ActionPerformed

        SettingsDialog dlgSettings = new SettingsDialog(this, true);

        Object[] obj_states = mapStatesAndLGAs.keySet().toArray();
        Arrays.sort(obj_states);
        for (Object obj_state : obj_states) {
            dlgSettings.cboState.addItem(obj_state);
        }

        dlgSettings.setLocationRelativeTo(this);
        dlgSettings.setVisible(true);
    }//GEN-LAST:event_jMenuItem6ActionPerformed

    private void jMenuItem8ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem8ActionPerformed

        //this.dlgTrackMobile.setVisible(true);
        TrackMobileDialog dlgTrackMobile = new TrackMobileDialog(this, true);

        dlgTrackMobile.lstMobileTrackList.setListData(cached_phone_nos);

        dlgTrackMobile.setLocationRelativeTo(this);
        dlgTrackMobile.setVisible(true);
    }//GEN-LAST:event_jMenuItem8ActionPerformed

    static void addToTrackList(JTextField txtTrackId, JList lstTrackList, Vector idTrackList, Map location_mapping) {

        String phone_no = txtTrackId.getText();
        if (phone_no.isEmpty()) {
            return;
        }

        if (!idTrackList.contains(phone_no)) {
            idTrackList.add(0, phone_no);
            lstTrackList.setListData(idTrackList);
        }

        txtTrackId.setText("");
        if (!location_mapping.containsKey(phone_no)) {
            location_mapping.put(phone_no, new TrackInfo());
        }

        lstTrackList.setSelectedValue(phone_no, true);
    }

    static void removeTrack(JList lstTrackList, Vector idTrackList, Map location_mapping) {

        Object selected_phone_no = lstTrackList.getSelectedValue();

        if (selected_phone_no == null) {
            return;
        }

        idTrackList.remove(selected_phone_no);
        lstTrackList.setListData(idTrackList);

        location_mapping.remove((String) selected_phone_no);
    }

    private void cmdVehicleTheftBroadcastActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdVehicleTheftBroadcastActionPerformed

        DBResource dBResource = null;
        DBResource dBResource1 = null;
        DBResource dBResource2 = null;
        DBResource dBResource3 = null;
        
        try {
            int selected_row_index = this.tblVehicleTheft.getSelectedRow();
            if (selected_row_index == -1) {
                JOptionPane.showMessageDialog(this, "No report selected!",
                        "Nothing selected", JOptionPane.ERROR_MESSAGE);
                return;
            }

            String action_taken = vehicleTheftTableModel.getActionTaken(selected_row_index);
            
            
            if (!action_taken.equalsIgnoreCase(NOT_TREATED)) {

                JOptionPane.showMessageDialog(this, "This report is already treated!",
                        "Already treated", JOptionPane.INFORMATION_MESSAGE);

                return;
            }

            String plate_no = this.lblVehicleTheftPlateNo.getText();

            String owner_serial_no = "";
            String owner_first_name = "";
            String owner_last_name = "";
            String VIN = "";
            String owner_photo_filename = "";
            String vehicle_photo_filename = "";
            String organization = "";
            String vehicle_status = "";

            String[] columns = {"SN",
                "FIRST_NAME",
                "LAST_NAME",
                "ORGANIZATION",
                "VIN",
                "STATUS",
                "OWNER_PHOTO_FILE_NAME",
                "VEHICLE_PHOTO_FILE_NAME"};

            dBResource = sendQueryAutoPolice("vehicle_owners", columns, " WHERE PLATE_NO='" + plate_no + "'");

            if (dBResource.rs.next()) {
                owner_serial_no = dBResource.rs.getString("SN");
                owner_first_name = dBResource.rs.getString("FIRST_NAME");
                owner_last_name = dBResource.rs.getString("LAST_NAME");
                organization = dBResource.rs.getString("ORGANIZATION");
                VIN = dBResource.rs.getString("VIN");
                owner_photo_filename = dBResource.rs.getString("OWNER_PHOTO_FILE_NAME");
                vehicle_photo_filename = dBResource.rs.getString("VEHICLE_PHOTO_FILE_NAME");
                vehicle_status = dBResource.rs.getString("STATUS");
            }

            if (owner_serial_no.isEmpty()) {
                owner_serial_no = "-1";
            }

            if (vehicle_status.equalsIgnoreCase(STOLEN)) {

                JOptionPane.showMessageDialog(this, "This vehicle has already been reported and broadcasted as stolen!",
                        "Already reported", JOptionPane.INFORMATION_MESSAGE);

                return;
            }
            

            int serrial_no = vehicleTheftTableModel.getSerialNo(selected_row_index);
            VehicleTheftAttribute vta = vehicleTheftMap.get(serrial_no);
            
            Date report_time = vehicleTheftTableModel.getReportTime(selected_row_index);

            SQLColumn[] sql_columns = {new SQLColumn("INCIDENCE_TIME", report_time),
                new SQLColumn("OWNER_SERIAL_NO", owner_serial_no),
                new SQLColumn("FIRST_NAME", owner_first_name),
                new SQLColumn("LAST_NAME", owner_last_name),
                new SQLColumn("ORGANIZATION", organization),
                new SQLColumn("PLATE_NO", plate_no),
                new SQLColumn("VIN", VIN),
                new SQLColumn("OWNER_PHOTO_FILE_NAME", owner_photo_filename),
                new SQLColumn("VEHICLE_PHOTO_FILE_NAME", vehicle_photo_filename),
                new SQLColumn("INCIDENCE_STREET", this.txaVehicleTheftIncidenceLocation.getText()),
                new SQLColumn("INCIDENCE_STATE", IncidenceState),
                new SQLColumn("INCIDENCE_LGA", IncidenceLGA),
                new SQLColumn("INCIDENCE_IMAGE_URL", vta.getImageUrl()),
                new SQLColumn("INCIDENCE_VIDEO_URL", vta.getVideoUrl()),
                new SQLColumn("REMARKS", this.txaVehicleTheftReportDetails.getText())};

            dBResource1 = insertStatementAutoPolice("vehicle_theft_report", sql_columns, false);

            SQLColumn[] sql_columns1 = {new SQLColumn("STATUS", STOLEN)};

            dBResource2 = updateStatementAutoPolice("vehicle_owners", sql_columns1,
                    " WHERE SN = '" + owner_serial_no + "'", false);

            //mark record has sent
            int selected_serial_no = vehicleTheftTableModel.getSerialNo(selected_row_index);
            SQLColumn[] sql_columns2 = {new SQLColumn("ACTION_TAKEN", BROADCAST_SENT)};

            dBResource3 = updateStatementDivision("vehicle_theft_report", sql_columns2,
                    " WHERE SN =" + selected_serial_no, false);

            //REMIND : come back for better distribution transaction usng XA 
            dBResource1.conn.commit();
            dBResource2.conn.commit();
            dBResource3.conn.commit();

            //all o.k so update the local table to reflect the change
            if (dBResource3.result > 0) {
                vehicleTheftTableModel.setActionTaken(selected_row_index, BROADCAST_SENT);
            }

            JOptionPane.showMessageDialog(this, "Broadcast sent successfully.",
                    "Successful", JOptionPane.INFORMATION_MESSAGE);

        } catch (SQLException ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(this, "Could not send broadcast. An error occurred",
                    "Failed", JOptionPane.INFORMATION_MESSAGE);
            try {
                dBResource1.conn.rollback();
            } catch (Exception ex1) {
            }
            try {
                dBResource2.conn.rollback();
            } catch (Exception ex1) {
            }
            try {
                dBResource3.conn.rollback();
            } catch (Exception ex1) {
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Could not send broadcast. Check connection.",
                    "Failed", JOptionPane.INFORMATION_MESSAGE);
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
            try {
                dBResource1.conn.rollback();
            } catch (Exception ex1) {
            }
            try {
                dBResource2.conn.rollback();
            } catch (Exception ex1) {
            }
            try {
                dBResource3.conn.rollback();
            } catch (Exception ex1) {
            }
        } finally {
            if (dBResource != null) {
                dBResource.close();
            }
            if (dBResource1 != null) {
                dBResource1.close();
            }
            if (dBResource2 != null) {
                dBResource2.close();
            }
            if (dBResource3 != null) {
                dBResource3.close();
            }
        }

    }//GEN-LAST:event_cmdVehicleTheftBroadcastActionPerformed

    private void cmdKidnapBroadcastActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdKidnapBroadcastActionPerformed

        DBResource dBResource = null;
        DBResource dBResource1 = null;
        DBResource dBResource2 = null;

        try {
            int selected_row_index = this.tblKidnappings.getSelectedRow();

            if (selected_row_index == -1) {
                JOptionPane.showMessageDialog(this, "No report selected!",
                        "Nothing selected", JOptionPane.ERROR_MESSAGE);
                return;
            }

            String action_taken = kidnapTableModel.getActionTaken(selected_row_index);

            if (!action_taken.equalsIgnoreCase(NOT_TREATED)) {

                JOptionPane.showMessageDialog(this, "This report is already treated!",
                        "Already treated", JOptionPane.INFORMATION_MESSAGE);

                return;
            }

            int serial_no = kidnapTableModel.getSerialNo(selected_row_index);

            Date report_time = kidnapTableModel.getReportTime(selected_row_index);

            KidnapAttribute kda = kidnapMap.get(serial_no);
            
            SQLColumn[] sql_columns = {new SQLColumn("TIME_KIDNAPPED", report_time),
                new SQLColumn("CAPTIVE_FULL_NAME", kda.getCaptive()),
                new SQLColumn("CAPTIVE_PHOTO_FILE_NAME", kda.getImageUrl()),//come back
                new SQLColumn("INCIDENCE_STREET", kda.getIncidenceLocation()),
                new SQLColumn("INCIDENCE_STATE", IncidenceState),
                new SQLColumn("INCIDENCE_LGA", IncidenceLGA),
                new SQLColumn("INCIDENCE_IMAGE_URL", kda.getImageUrl()),
                new SQLColumn("INCIDENCE_VIDEO_URL", kda.getVideoUrl()),
                new SQLColumn("STATUS", MISSING),
                new SQLColumn("REMARKS", kda.getReportDetails())};

            dBResource1 = insertStatementAutoPolice("kidnap_report", sql_columns, false);

            //mark record has sent
            int selected_serial_no = kidnapTableModel.getSerialNo(selected_row_index);
            SQLColumn[] sql_columns2 = {new SQLColumn("ACTION_TAKEN", BROADCAST_SENT)};

            dBResource2 = updateStatementDivision("kidnap_report", sql_columns2,
                    " WHERE SN =" + selected_serial_no, false);

            //REMIND : come back for better distribution transaction usng XA 
            dBResource1.conn.commit();
            dBResource2.conn.commit();

            //all o.k so update the local table to reflect the change
            if (dBResource2.result > 0) {
                kidnapTableModel.setActionTaken(selected_row_index, BROADCAST_SENT);
            }

            JOptionPane.showMessageDialog(this, "Broadcast sent successfully.",
                    "Successful", JOptionPane.INFORMATION_MESSAGE);

        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Could not send broadcast. An error occurred.",
                    "Failed", JOptionPane.INFORMATION_MESSAGE);
            try {
                dBResource1.conn.rollback();
            } catch (Exception ex1) {
            }
            try {
                dBResource2.conn.rollback();
            } catch (Exception ex1) {
            }

        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Could not send broadcast. Check connection.",
                    "Failed", JOptionPane.INFORMATION_MESSAGE);
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
            try {
                dBResource1.conn.rollback();
            } catch (Exception ex1) {
            };
            try {
                dBResource2.conn.rollback();
            } catch (Exception ex1) {
            }

        } finally {
            if (dBResource != null) {
                dBResource.close();
            }
            if (dBResource1 != null) {
                dBResource1.close();
            }

            if (dBResource2 != null) {
                dBResource2.close();
            }
        }

    }//GEN-LAST:event_cmdKidnapBroadcastActionPerformed

    private void tolTrakMobileDeviceActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_tolTrakMobileDeviceActionPerformed
        //this.dlgTrackMobile.setVisible(true);

        TrackMobileDialog dlgTrackMobile = new TrackMobileDialog(this, true);

        dlgTrackMobile.lstMobileTrackList.setListData(cached_phone_nos);

        dlgTrackMobile.setLocationRelativeTo(this);
        dlgTrackMobile.setVisible(true);

    }//GEN-LAST:event_tolTrakMobileDeviceActionPerformed

    private void cmdVehicleTheftIgnoreActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdVehicleTheftIgnoreActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_cmdVehicleTheftIgnoreActionPerformed

    private void txtOwnerPhoneNosActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_txtOwnerPhoneNosActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_txtOwnerPhoneNosActionPerformed

    static long getUniqueNumber() {

        Connection division_db_connection = null;
        Statement stmt = null;
        Statement lock_stmt = null;
        ResultSet rs = null;
        long unique_num = -1;

        try {

            division_db_connection = getDivisionConnection(IncidenceState);

            if (division_db_connection == null) {
                return unique_num;
            }

            lock_stmt = division_db_connection.createStatement();
            lock_stmt.execute("LOCK TABLE unique_number WRITE");

            stmt = division_db_connection.createStatement();
            rs = stmt.executeQuery("SELECT UNIQUE_NUMBER FROM unique_number");
            long num = -1;
            long next_num = -1;
            if (rs.next()) {
                num = rs.getLong("UNIQUE_NUMBER");
            } else {
                num = 1;//start from 1.
                stmt.executeUpdate("INSERT INTO unique_number (UNIQUE_NUMBER) VALUES (" + num + ")");
            }

            next_num = num + 1;

            stmt.executeUpdate("UPDATE unique_number SET UNIQUE_NUMBER=" + next_num);

            lock_stmt.execute("UNLOCK TABLES");
            unique_num = num;
        } catch (SQLException ex) {
        } catch (Exception ex) {
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
            } catch (Exception ex) {
            }
            
            try {
                if (lock_stmt != null) {
                    lock_stmt.close();
                }
            } catch (Exception ex) {
            }
            try {
                if (stmt != null) {
                    stmt.close();
                }
            } catch (Exception ex) {
            }
            try {
                if (division_db_connection != null) {
                    division_db_connection.close();
                }
            } catch (Exception ex) {
            }
        }

        return unique_num;
    }

    static String sendPhotoToServerByFTP(String filename, long unique_number) {

        //remove file protocol if any
        String file_proc = "file:/";
        if (filename.startsWith(file_proc)) {
            filename = filename.substring(file_proc.length());
        }

        filename = filename.replaceAll("%20", " ");//replace %20 wil space
        //filename = filename.replaceAll("+", " ");//replace + wil space

        //send the photo to the server
        String ext = getFileExtension(filename);

        String remote_url_str = null; // initailze to null - important
        FTPClient ftpClient = new FTPClient();
        FileInputStream fin = null;

        try {
            ftpClient.connect(ftp_host, ftp_port);

            if (!ftpClient.login(ftp_username, ftp_password)) {
                throw new SocketException("login to ftp failed - invalid username or password!");
            }

            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            File file = new File(filename);
            fin = new FileInputStream(file);

            String remote_path = criminal_base_dir + "/" + zone + "/" + division + "/";
            boolean result = ftpClient.makeDirectory(remote_path);

            if (!result) {
                throw new SocketException("Could not create remote directory");
            }

            result = ftpClient.changeWorkingDirectory(remote_path);

            if (!result) {
                throw new SocketException("Could not change to working directory");
            }

            String rmt_filename = unique_number + "." + ext;
            remote_url_str = ("http://" + ftp_host
                    + remote_base_dir
                    + "/" + remote_path + rmt_filename)
                    .replaceAll(" ", "%20");//replace space character with %20

            result = ftpClient.storeFile(rmt_filename, fin);

            if (!result) {
                throw new SocketException("File transfer failed");
            }

            System.out.println("File transfered successfully");

        } catch (IOException ex) {
            Logger.getLogger(TestFTP.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                if (fin != null) {
                    fin.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(TestFTP.class.getName()).log(Level.SEVERE, null, ex);
            }
            try {
                ftpClient.logout();
            } catch (IOException ex) {
                Logger.getLogger(TestFTP.class.getName()).log(Level.SEVERE, null, ex);
            }
            try {
                ftpClient.disconnect();
            } catch (IOException ex) {
                Logger.getLogger(TestFTP.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return remote_url_str;
    }

    static public String getFileExtension(String filename) {
        int index = filename.lastIndexOf(".");
        if (index < 0) {
            return "";
        }
        return filename.substring(index + 1);
    }

    private boolean sendKidnaperData(SQLColumn[] columns) {
        boolean success = false;
        try {
            this.insertStatementAutoPolice("kidnappers", columns, true);
            success = true;
        } catch (SQLException ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
        }

        return success;
    }

    private void mnuMngVehicleTheftReportActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuMngVehicleTheftReportActionPerformed

        ManageVehicleTheftDialog dlgManageVehicleTheft = new ManageVehicleTheftDialog(this, true);

        dlgManageVehicleTheft.setLocationRelativeTo(this);
        dlgManageVehicleTheft.setVisible(true);

    }//GEN-LAST:event_mnuMngVehicleTheftReportActionPerformed

    private void mnuMngKidnapingReportActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuMngKidnapingReportActionPerformed

        ManageKidnapingsDialog dlgManageKidnapings = new ManageKidnapingsDialog(this, true);

        dlgManageKidnapings.setLocationRelativeTo(this);
        dlgManageKidnapings.setVisible(true);
    }//GEN-LAST:event_mnuMngKidnapingReportActionPerformed

    private void formComponentResized(java.awt.event.ComponentEvent evt) {//GEN-FIRST:event_formComponentResized

        splitPaneVehicleReport.setDividerLocation(0.7);
        splitPaneKidnapReport.setDividerLocation(0.7);
    }//GEN-LAST:event_formComponentResized


    private void txaVehicleTheftDetectedReporterLocationMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_txaVehicleTheftDetectedReporterLocationMouseClicked

    }//GEN-LAST:event_txaVehicleTheftDetectedReporterLocationMouseClicked

    private void mnuNewReportActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuNewReportActionPerformed

        NewReportDialog dlgNewReport = new NewReportDialog(this, true);

        dlgNewReport.setLocationRelativeTo(this);
        dlgNewReport.setVisible(true);
    }//GEN-LAST:event_mnuNewReportActionPerformed

    private void cmdAttachCaptivePhotoActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cmdAttachCaptivePhotoActionPerformed
        JFileChooser f = new JFileChooser();
        f.showOpenDialog(this);

        File selected_file = f.getSelectedFile();

        try {
            if (selected_file != null) {

            }
        } catch (Exception ex) {
            Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
        }
    }//GEN-LAST:event_cmdAttachCaptivePhotoActionPerformed

    private void jMenuItem12ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem12ActionPerformed
        java.awt.CardLayout card_layout = (java.awt.CardLayout) pnlBody.getLayout();
        card_layout.show(pnlBody, "cardRegisterOwners");
    }//GEN-LAST:event_jMenuItem12ActionPerformed

    private void jMenuItem10ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem10ActionPerformed
        java.awt.CardLayout card_layout = (java.awt.CardLayout) pnlBody.getLayout();
        card_layout.show(pnlBody, "cardRegisterStaff");

    }//GEN-LAST:event_jMenuItem10ActionPerformed

    private void jMenuItem17ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem17ActionPerformed
        java.awt.CardLayout card_layout = (java.awt.CardLayout) pnlBody.getLayout();
        card_layout.show(pnlBody, "cardVehicleReport");
        ScreenShotCreator.takeScreenShot(scrollPaneVehicleTheft, "C:/test/test_screen_shot.png");
    }//GEN-LAST:event_jMenuItem17ActionPerformed

    private void jMenuItem18ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem18ActionPerformed
        java.awt.CardLayout card_layout = (java.awt.CardLayout) pnlBody.getLayout();
        card_layout.show(pnlBody, "cardKidnapReport");
    }//GEN-LAST:event_jMenuItem18ActionPerformed

    private void tlgHomeActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_tlgHomeActionPerformed
        java.awt.CardLayout card_layout = (java.awt.CardLayout) pnlBody.getLayout();
        card_layout.show(pnlBody, "cardHome");
    }//GEN-LAST:event_tlgHomeActionPerformed

    private void lblDashboardVehicleStatusMouseEntered(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardVehicleStatusMouseEntered
        // TODO add your handling code here:
        JLabel label = (JLabel) evt.getSource();
        label.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        evt.getComponent().setForeground(new Color(156,216,165));
    }//GEN-LAST:event_lblDashboardVehicleStatusMouseEntered

    private void lblDashboardVehicleRegMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardVehicleRegMouseClicked
        java.awt.CardLayout card_layout = (java.awt.CardLayout) pnlBody.getLayout();
        card_layout.show(pnlBody, "cardRegisterOwners");
    }//GEN-LAST:event_lblDashboardVehicleRegMouseClicked

    private void lblDashboardSIMCardIdMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardSIMCardIdMouseClicked

        FindPersonDialog dlgFindPerson = new FindPersonDialog(this, true);

        dlgFindPerson.cboFindPersonUsing.setSelectedIndex(0);

        dlgFindPerson.setVisible(true);
        dlgFindPerson.setLocationRelativeTo(this);
    }//GEN-LAST:event_lblDashboardSIMCardIdMouseClicked

    private void lblDashboardVerifyBVNMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardVerifyBVNMouseClicked

        /*FindPersonDialog dlgFindPerson = new FindPersonDialog(this, true);

        dlgFindPerson.cboFindPersonUsing.setSelectedIndex(0);

        dlgFindPerson.setVisible(true);
        */
        
        BVN bvn = new BVN(this, true);
        bvn.setLocationRelativeTo(this);
        bvn.setVisible(true);
        
    }//GEN-LAST:event_lblDashboardVerifyBVNMouseClicked

    private void lblDashboardVehicleTrackingMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardVehicleTrackingMouseClicked
        //this.dlgTrackVehicle.setVisible(true);
        TrackVehicleDialog dlgTrackVehicle = new TrackVehicleDialog(this, true);

        dlgTrackVehicle.lstVehicleTrackList.setListData(cached_vehicle_imei);
        dlgTrackVehicle.setLocationRelativeTo(this);
        dlgTrackVehicle.setVisible(true);
    }//GEN-LAST:event_lblDashboardVehicleTrackingMouseClicked

    private void lblDashboardMobileTrackingMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardMobileTrackingMouseClicked
        //this.dlgTrackMobile.setVisible(true);

        TrackMobileDialog dlgTrackMobile = new TrackMobileDialog(this, true);

        dlgTrackMobile.lstMobileTrackList.setListData(cached_phone_nos);

        dlgTrackMobile.setVisible(true);

    }//GEN-LAST:event_lblDashboardMobileTrackingMouseClicked

    private void lblDashboardCrimeControlMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardCrimeControlMouseClicked

        CrimeControlDialog dlgCrimeControl = new CrimeControlDialog(this, true);

        dlgCrimeControl.pnlPreviousCaseInfo.setPreferredSize(new Dimension(dlgCrimeControl.pnlPreviousCaseInfo.getWidth(), 0));
        dlgCrimeControl.setLocationRelativeTo(this);
        dlgCrimeControl.setVisible(true);
    }//GEN-LAST:event_lblDashboardCrimeControlMouseClicked

    private void lblDashboardCrimeDiaryMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardCrimeDiaryMouseClicked

        CrimeDiaryDialog dlgCrimeDiary = new CrimeDiaryDialog(this, true);

        /*NO NEED - DONE IN CrimeDiaryDialog CLASS
         Object[] obj_states = mapStatesAndLGAs.keySet().toArray();
         Arrays.sort(obj_states);
         for (Object obj_state : obj_states) {
         dlgCrimeDiary.cboCrimeDiaryState.addItem(obj_state);
         }*/
        dlgCrimeDiary.setLocationRelativeTo(this);
        dlgCrimeDiary.setVisible(true);

    }//GEN-LAST:event_lblDashboardCrimeDiaryMouseClicked

    private void lblDashboardWantedPersonsMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardWantedPersonsMouseClicked
        //this.dlgWantedPersons.setVisible(true);
        WantedPersonDialog wantedPersonDialog = new WantedPersonDialog(this, true);

        /*NO NEED - DONE IN WantedPersonDialog CLASS
         Object[] obj_states = mapStatesAndLGAs.keySet().toArray();
         Arrays.sort(obj_states);
         for (Object obj_state : obj_states) {
         wantedPersonDialog.cboWantedPersonState.addItem(obj_state);
         }*/
        wantedPersonDialog.setLocationRelativeTo(this);
        wantedPersonDialog.setVisible(true);

    }//GEN-LAST:event_lblDashboardWantedPersonsMouseClicked

    private void lblDashboardVehicleStatusMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardVehicleStatusMouseClicked
        //dlgVehicleStatus.setVisible(true);

        VehicleStatusDialog vehicleStatusDialog = new VehicleStatusDialog(this, true);

        //some code goes here
        vehicleStatusDialog.setLocationRelativeTo(this);
        vehicleStatusDialog.setVisible(true);

    }//GEN-LAST:event_lblDashboardVehicleStatusMouseClicked

    private void tolTrackVehicleActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_tolTrackVehicleActionPerformed
        //this.dlgTrackVehicle.setVisible(true);
        TrackVehicleDialog dlgTrackVehicle = new TrackVehicleDialog(this, true);

        dlgTrackVehicle.lstVehicleTrackList.setListData(cached_vehicle_imei);
        dlgTrackVehicle.setLocationRelativeTo(this);
        dlgTrackVehicle.setVisible(true);
    }//GEN-LAST:event_tolTrackVehicleActionPerformed

    private void jMenuItem13ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem13ActionPerformed
        //this.dlgTrackVehicle.setVisible(true);
        TrackVehicleDialog dlgTrackVehicle = new TrackVehicleDialog(this, true);

        dlgTrackVehicle.lstVehicleTrackList.setListData(cached_vehicle_imei);
        dlgTrackVehicle.setLocationRelativeTo(this);
        dlgTrackVehicle.setVisible(true);
    }//GEN-LAST:event_jMenuItem13ActionPerformed

    private void mnuCrimeControlActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuCrimeControlActionPerformed

        CrimeControlDialog dlgCrimeControl = new CrimeControlDialog(this, true);

        dlgCrimeControl.pnlPreviousCaseInfo.setPreferredSize(new Dimension(dlgCrimeControl.pnlPreviousCaseInfo.getWidth(), 0));
        dlgCrimeControl.setLocationRelativeTo(this);
        dlgCrimeControl.setVisible(true);

    }//GEN-LAST:event_mnuCrimeControlActionPerformed

    private void mnuWantedPersonsActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuWantedPersonsActionPerformed
        //this.dlgWantedPersons.setVisible(true);
        WantedPersonDialog wantedPersonDialog = new WantedPersonDialog(this, true);

        /*NO NEED - DONE IN WantedPersonDialog CLASS
         Object[] obj_states = mapStatesAndLGAs.keySet().toArray();
         Arrays.sort(obj_states);
         for (Object obj_state : obj_states) {
         wantedPersonDialog.cboWantedPersonState.addItem(obj_state);
         }*/
        wantedPersonDialog.setLocationRelativeTo(this);
        wantedPersonDialog.setVisible(true);

    }//GEN-LAST:event_mnuWantedPersonsActionPerformed

    private void mnuCrimeDiaryActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuCrimeDiaryActionPerformed

        CrimeDiaryDialog dlgCrimeDiary = new CrimeDiaryDialog(this, true);

        /*NO NEED - DONE IN CrimeDiaryDialog CLASS
        Object[] obj_states = mapStatesAndLGAs.keySet().toArray();
        Arrays.sort(obj_states);
        for (Object obj_state : obj_states) {
            dlgCrimeDiary.cboCrimeDiaryState.addItem(obj_state);
        }*/
        dlgCrimeDiary.setLocationRelativeTo(this);
        dlgCrimeDiary.setVisible(true);
    }//GEN-LAST:event_mnuCrimeDiaryActionPerformed

    private void mnuBVNActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuBVNActionPerformed
        BVN bvn = new BVN(this, true);
        bvn.setLocationRelativeTo(this);
        bvn.setVisible(true);
    }//GEN-LAST:event_mnuBVNActionPerformed

    private void mnuFRSCActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuFRSCActionPerformed
        FRSC f= new FRSC(this, true);
        f.setLocationRelativeTo(this);
        f.setVisible(true);
    }//GEN-LAST:event_mnuFRSCActionPerformed

    private void mnuNationalIDCardActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuNationalIDCardActionPerformed
        NationalIdentity n = new NationalIdentity(this, true);
        n.setLocationRelativeTo(this);
        n.setVisible(true);
    }//GEN-LAST:event_mnuNationalIDCardActionPerformed

    private void mnuSimCardRegActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_mnuSimCardRegActionPerformed
        
        FindPersonDialog dlgFindPerson = new FindPersonDialog(this, true);

        dlgFindPerson.cboFindPersonUsing.setSelectedIndex(0);
        dlgFindPerson.setLocationRelativeTo(this);
        dlgFindPerson.setVisible(true);
    }//GEN-LAST:event_mnuSimCardRegActionPerformed

    private void lblDashboardCrimeControlMouseExited(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblDashboardCrimeControlMouseExited
        evt.getComponent().setForeground(new Color(98,183,112));
    }//GEN-LAST:event_lblDashboardCrimeControlMouseExited

    private void jMenuItem7ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem7ActionPerformed
        showPoliceMonitorOnWeb();
    }//GEN-LAST:event_jMenuItem7ActionPerformed

    private void lblPoliceMontorMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblPoliceMontorMouseClicked
        showPoliceMonitorOnWeb();
    }//GEN-LAST:event_lblPoliceMontorMouseClicked

    private void lblPoliceMontorMouseEntered(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblPoliceMontorMouseEntered
        evt.getComponent().setForeground(new Color(188,237,212));
    }//GEN-LAST:event_lblPoliceMontorMouseEntered

    private void lblPoliceMontorMouseExited(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_lblPoliceMontorMouseExited
        evt.getComponent().setForeground(new Color(137,231,152));
    }//GEN-LAST:event_lblPoliceMontorMouseExited

    private void showPoliceMonitorOnWeb(){
        PoliceMonitorDialog ppd = new PoliceMonitorDialog(this, true);
        ppd.setLocationRelativeTo(ppd);
        ppd.setVisible(true);
    }
    
    static boolean validateEmptyInput(JDialog container, JComponent[] except_input_fields) {
        return validateEmptyInput(container.getContentPane(), except_input_fields);
    }

    static boolean validateEmptyInput(JPanel container, JComponent[] except_input_fields) {
        return validateEmptyInput((java.awt.Container) container, except_input_fields);
    }

    static boolean validateEmptyInput(java.awt.Container container, JComponent[] except_input) {
        boolean is_valid = true;
        outer:
        for (int i = 0; i < container.getComponentCount(); i++) {
            Component comp = container.getComponent(i);

            if (except_input != null) {
                for (int k = 0; k < except_input.length; k++) {
                    if (except_input[k].equals(comp)) {
                        continue outer;
                    }
                }
            }

            if (comp instanceof JTextField
                    || comp instanceof JFormattedTextField
                    || comp instanceof JScrollPane// which contains the JTextArea
                    || comp instanceof JXDatePicker) {

                JTextComponent field = null;

                if (comp instanceof JXDatePicker) {
                    field = ((JXDatePicker) comp).getEditor();
                } else if (comp instanceof JScrollPane) {// which contains the JTextArea
                    //find the JTextArea
                    JScrollPane s = (JScrollPane) comp;
                    for (int k = 0; k < s.getComponentCount(); k++) {
                        if (s.getComponent(k) instanceof javax.swing.JViewport) {
                            javax.swing.JViewport vp = (javax.swing.JViewport) s.getComponent(k);
                            if (vp.getComponentCount() < 1) {
                                break;
                            }
                            Component c = vp.getComponent(0);
                            if (c instanceof JTextArea) {
                                field = (JTextComponent) c;
                                break;
                            }
                        }
                    }

                } else {
                    field = (JTextComponent) comp;
                }

                if (field != null && field.getText().isEmpty()) {
                    field.setBackground(Color.YELLOW);
                    is_valid = false;
                }
            }

            if (comp instanceof JComboBox) {
                JComboBox cb = (JComboBox) comp;
                if (cb.getSelectedIndex() < 0) {
                    cb.setBackground(Color.YELLOW);
                    return false;
                }
            }

        }

        return is_valid;
    }

    ListSelectionModel setVehicleTheftTableSelectionModel() {
        ListSelectionModel listSelectionModel = this.tblVehicleTheft.getSelectionModel();
        listSelectionModel.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        listSelectionModel.addListSelectionListener(new ListSelectionListener() {

            @Override
            public void valueChanged(ListSelectionEvent e) {

                handleVehicleTheftRowSelection();
            }
        });

        return listSelectionModel;
    }

    void handleVehicleTheftRowSelection() {

        int selected_row_index = this.tblVehicleTheft.getSelectedRow();
        if (selected_row_index == -1) {
            //alert no report selected
            return;
        }

        int serialNo = vehicleTheftTableModel.getSerialNo(selected_row_index);
        VehicleTheftAttribute vta = vehicleTheftMap.get(serialNo);
        if (vta == null) {
            return;
        }
        this.lblVehicleTheftIncidenceTime.setText(vta.getReportTime().toLocaleString());
        this.lblVehicleTheftReporter.setText(vehicleTheftTableModel.getReporter(selected_row_index));
        this.lblVehicleTheftReporterPhoneNo.setText(vta.getReporterPhoneNos());
        this.txaVehicleTheftDetectedReporterLocation.setText(vta.getDetectedReporterLocation());
        this.txaVehicleTheftReportDetails.setText(vta.getReportDetails());
        this.lblVehicleTheftOwnerFullName.setText(vta.getVehicleOwner());
        this.txaVehicleTheftIncidenceLocation.setText(vta.getIncidenceLocation());
        this.lblVehicleTheftVehicleName.setText(vta.getVehicleName());
        this.lblVehicleTheftVehicleModel.setText(vta.getVehicleModel());
        this.lblVehicleTheftPlateNo.setText(vta.getPlateNo());

    }

    ListSelectionModel setKidapTableSelectionModel() {
        ListSelectionModel listSelectionModel = this.tblKidnappings.getSelectionModel();
        listSelectionModel.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        listSelectionModel.addListSelectionListener(new ListSelectionListener() {

            @Override
            public void valueChanged(ListSelectionEvent e) {
                handleKidapRowSelection();
            }
        });

        return listSelectionModel;
    }

    void handleKidapRowSelection() {

        int selected_row_index = this.tblKidnappings.getSelectedRow();
        if (selected_row_index == -1) {
            //alert no report selected
            return;
        }

        int serialNo = kidnapTableModel.getSerialNo(selected_row_index);
        KidnapAttribute kda = kidnapMap.get(serialNo);
        if (kda == null) {
            return;
        }
        this.lblKidnapIncidenceTime.setText(kda.getReportTime().toLocaleString());
        this.lblKidnapReporter.setText(kda.getReporter());
        this.lblKidnapCaptive.setText(kda.getCaptive());
        this.lblKidnapReporterPhoneNo.setText(kda.getReporterPhoneNos());
        this.txaKidnapDetectedReporterLocation.setText(kda.getDetectedReporterLocation());
        this.txaKidnapReportDetails.setText(kda.getReportDetails());
        this.txaKidnapIncidenceLocation.setText(kda.getIncidenceLocation());

    }

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

    private Rectangle getFormBounds() {
        System.out.println(this.getGraphicsConfiguration().getBounds().getWidth());
        int w = (int) (this.getGraphicsConfiguration().getBounds().getWidth());
        int h = (int) (this.getGraphicsConfiguration().getBounds().getHeight());
        System.out.println(w);

        return new Rectangle(0, 0, w, h);
    }

    private Dimension getFormDimension(double percent_screen_width, double percent_screen_height) {

        int screen_width = (int) this.getGraphicsConfiguration().getBounds().getWidth();
        int screen_height = (int) this.getGraphicsConfiguration().getBounds().getHeight();
        int w = (int) (percent_screen_width * screen_width);
        int h = (int) (percent_screen_height * screen_height);

        return new Dimension(w, h);
    }

    private Dimension getFormDimension() {
        System.out.println(this.getGraphicsConfiguration().getBounds().getWidth());
        int w = (int) (this.getGraphicsConfiguration().getBounds().getWidth());
        int h = (int) (this.getGraphicsConfiguration().getBounds().getHeight());

        return new Dimension(w, h);
    }

    private static void setLookAndFeel() {

        try {
            javax.swing.UIManager.setLookAndFeel("com.seaglasslookandfeel.SeaGlassLookAndFeel");

        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }

    }

    static void setWindowsLookAndFeel() {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                //Nimbus
                if ("Windows".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {

        //prevent firewall and antivirus related issues regarding permission. This is a known issue as of Java 7
        //These issue cause unnecessary connection failure or read/write failure
        //and in most case does not even reveal the cause is permission related.
        //To avoid this simply do this : System.setProperty("java.net.preferIPv4Stack", "true");
        System.setProperty("java.net.preferIPv4Stack", "true");

        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
         //UIManager.put("nimbusBase", new Color(...));
         //UIManager.put("nimbusBlueGrey", new Color(...));
         //UIManager.put("control", new Color(...));
         
         //UIManager.put("nimbusBase", Color.gray);
         //UIManager.put("nimbusBlueGrey", Color.gray);
         //UIManager.put("control", Color.lightGray);

         //org.pushingpixels.substance.api.skin.BusinessBlackSteelSkin
         for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
         //Nimbus , Windows
         if ("Windows".equals(info.getName())) {
         javax.swing.UIManager.setLookAndFeel(info.getClassName());
         break;
         }
         }

            
         } catch (ClassNotFoundException ex) {
         java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
         } catch (InstantiationException ex) {
         java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
         } catch (IllegalAccessException ex) {
         java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
         } catch (javax.swing.UnsupportedLookAndFeelException ex) {
         java.util.logging.Logger.getLogger(ServerManager.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
         }
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                try {

                    //setLookAndFeel();
                    //setWindowsLookAndFeel();
                    ServerManager serverManager = new ServerManager();
                    serverManager.addWindowListener(serverManager);
                    serverManager.setLocationRelativeTo(null);
                    serverManager.setVisible(true);

                } catch (IOException ex) {
                    Logger.getLogger(ServerManager.class.getName()).log(Level.SEVERE, null, ex);
                }

            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JComboBox cboGAOfOrigin;
    private javax.swing.JComboBox cboOwnerSex;
    private javax.swing.JComboBox cboPoliceSex;
    private javax.swing.JComboBox cboStateOfOrigin;
    private javax.swing.JToggleButton cmdAttachCaptivePhoto;
    private javax.swing.JButton cmdBrowseOwnerPhoto;
    private javax.swing.JButton cmdBrowseStaffPhoto;
    private javax.swing.JButton cmdBrowseVehiclePhoto;
    private javax.swing.JButton cmdEditStaff;
    private javax.swing.JButton cmdEditVehicleOwner;
    private javax.swing.JButton cmdKidnapBroadcast;
    private javax.swing.JButton cmdKidnapIgnore;
    private javax.swing.JButton cmdKidnapUploadedMedia;
    private javax.swing.JButton cmdRegisterStaff;
    private javax.swing.JButton cmdRegisterVehicleOwner;
    private javax.swing.JButton cmdVehicleTheftBroadcast;
    private javax.swing.JButton cmdVehicleTheftIgnore;
    private javax.swing.JButton cmdVehicleTheftUploadedMedia;
    private org.jdesktop.swingx.JXDatePicker dpDateOwned;
    private org.jdesktop.swingx.border.DropShadowBorder dropShadowBorder;
    private org.jdesktop.swingx.JXImageView imgStaffPhoto;
    private org.jdesktop.swingx.JXImageView imgVehicleOwnerPhoto;
    private org.jdesktop.swingx.JXImageView imgVehiclePhoto;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel103;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel129;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel139;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel15;
    private javax.swing.JLabel jLabel16;
    private javax.swing.JLabel jLabel17;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel19;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel20;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel23;
    private javax.swing.JLabel jLabel24;
    private javax.swing.JLabel jLabel25;
    private javax.swing.JLabel jLabel26;
    private javax.swing.JLabel jLabel27;
    private javax.swing.JLabel jLabel28;
    private javax.swing.JLabel jLabel29;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel30;
    private javax.swing.JLabel jLabel34;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel52;
    private javax.swing.JLabel jLabel53;
    private javax.swing.JLabel jLabel54;
    private javax.swing.JLabel jLabel55;
    private javax.swing.JLabel jLabel56;
    private javax.swing.JLabel jLabel57;
    private javax.swing.JLabel jLabel58;
    private javax.swing.JLabel jLabel59;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel60;
    private javax.swing.JLabel jLabel61;
    private javax.swing.JLabel jLabel62;
    private javax.swing.JLabel jLabel63;
    private javax.swing.JLabel jLabel64;
    private javax.swing.JLabel jLabel66;
    private javax.swing.JLabel jLabel67;
    private javax.swing.JLabel jLabel69;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel70;
    private javax.swing.JLabel jLabel74;
    private javax.swing.JLabel jLabel75;
    private javax.swing.JLabel jLabel76;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JMenu jMenu1;
    private javax.swing.JMenu jMenu10;
    private javax.swing.JMenu jMenu2;
    private javax.swing.JMenu jMenu4;
    private javax.swing.JMenu jMenu5;
    private javax.swing.JMenu jMenu6;
    private javax.swing.JMenu jMenu7;
    private javax.swing.JMenu jMenu8;
    private javax.swing.JMenu jMenu9;
    private javax.swing.JMenuItem jMenuItem1;
    private javax.swing.JMenuItem jMenuItem10;
    private javax.swing.JMenuItem jMenuItem12;
    private javax.swing.JMenuItem jMenuItem13;
    private javax.swing.JMenuItem jMenuItem17;
    private javax.swing.JMenuItem jMenuItem18;
    private javax.swing.JMenuItem jMenuItem2;
    private javax.swing.JMenuItem jMenuItem3;
    private javax.swing.JMenuItem jMenuItem4;
    private javax.swing.JMenuItem jMenuItem5;
    private javax.swing.JMenuItem jMenuItem6;
    private javax.swing.JMenuItem jMenuItem7;
    private javax.swing.JMenuItem jMenuItem8;
    private javax.swing.JMenuItem jMenuItem9;
    private javax.swing.JPanel jPanel10;
    private javax.swing.JPanel jPanel9;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane10;
    private javax.swing.JScrollPane jScrollPane5;
    private javax.swing.JScrollPane jScrollPane6;
    private javax.swing.JScrollPane jScrollPane7;
    private javax.swing.JScrollPane jScrollPane8;
    private javax.swing.JScrollPane jScrollPane9;
    private javax.swing.JPopupMenu.Separator jSeparator1;
    private javax.swing.JPopupMenu.Separator jSeparator10;
    private javax.swing.JPopupMenu.Separator jSeparator11;
    private javax.swing.JPopupMenu.Separator jSeparator12;
    private javax.swing.JPopupMenu.Separator jSeparator13;
    private javax.swing.JPopupMenu.Separator jSeparator14;
    private javax.swing.JPopupMenu.Separator jSeparator15;
    private javax.swing.JPopupMenu.Separator jSeparator16;
    private javax.swing.JSeparator jSeparator17;
    private javax.swing.JPopupMenu.Separator jSeparator18;
    private javax.swing.JPopupMenu.Separator jSeparator19;
    private javax.swing.JPopupMenu.Separator jSeparator2;
    private javax.swing.JPopupMenu.Separator jSeparator20;
    private javax.swing.JToolBar.Separator jSeparator21;
    private javax.swing.JToolBar.Separator jSeparator3;
    private javax.swing.JPopupMenu.Separator jSeparator4;
    private javax.swing.JPopupMenu.Separator jSeparator5;
    private javax.swing.JPopupMenu.Separator jSeparator6;
    private javax.swing.JPopupMenu.Separator jSeparator7;
    private javax.swing.JPopupMenu.Separator jSeparator8;
    private javax.swing.JPopupMenu.Separator jSeparator9;
    private javax.swing.JToolBar jToolBar1;
    private org.jdesktop.swingx.JXDatePicker jXDatePicker1;
    private org.jdesktop.swingx.JXSearchField jXSearchField1;
    private javax.swing.JLabel lblDashboardCrimeControl;
    private javax.swing.JLabel lblDashboardCrimeDiary;
    private javax.swing.JLabel lblDashboardMobileTracking;
    private javax.swing.JLabel lblDashboardSIMCardId;
    private javax.swing.JLabel lblDashboardVehicleReg;
    private javax.swing.JLabel lblDashboardVehicleStatus;
    private javax.swing.JLabel lblDashboardVehicleTracking;
    private javax.swing.JLabel lblDashboardVerifyBVN;
    private javax.swing.JLabel lblDashboardWantedPersons;
    private javax.swing.JLabel lblKidnapCaptive;
    private javax.swing.JLabel lblKidnapIncidenceTime;
    private javax.swing.JLabel lblKidnapReporter;
    private javax.swing.JLabel lblKidnapReporterPhoneNo;
    private javax.swing.JLabel lblPoliceMontor;
    private javax.swing.JLabel lblVehicleTheftIncidenceTime;
    private javax.swing.JLabel lblVehicleTheftOwnerFullName;
    private javax.swing.JLabel lblVehicleTheftPlateNo;
    private javax.swing.JLabel lblVehicleTheftReporter;
    private javax.swing.JLabel lblVehicleTheftReporterPhoneNo;
    private javax.swing.JLabel lblVehicleTheftVehicleModel;
    private javax.swing.JLabel lblVehicleTheftVehicleName;
    private javax.swing.JMenuItem mnuBVN;
    private javax.swing.JMenuItem mnuCrimeControl;
    private javax.swing.JMenuItem mnuCrimeDiary;
    private javax.swing.JMenuItem mnuFRSC;
    private javax.swing.JMenuBar mnuMainMenu;
    private javax.swing.JMenuItem mnuMngKidnapingReport;
    private javax.swing.JMenuItem mnuMngVehicleTheftReport;
    private javax.swing.JMenuItem mnuNationalIDCard;
    private javax.swing.JMenuItem mnuNewReport;
    private javax.swing.JMenu mnuPoliceMonitor;
    private javax.swing.JMenuItem mnuSimCardReg;
    private javax.swing.JMenuItem mnuWantedPersons;
    private javax.swing.JPanel pnlBody;
    private javax.swing.JPanel pnlDashboard;
    private javax.swing.JPanel pnlHeader;
    private javax.swing.JPanel pnlHome;
    private javax.swing.JPanel pnlHomeHeader;
    private manager.ui.extend.RoundedPanel pnlHomeVehicleReport;
    private javax.swing.JPanel pnlRegisterOwners;
    private javax.swing.JPanel pnlRegisterStaff;
    private javax.swing.JPanel pnlStatusBar;
    private manager.ui.extend.RoundedPanel roundedPanel2;
    private manager.ui.extend.RoundedPanel roundedPanel3;
    private manager.ui.extend.RoundedPanel roundedPanel4;
    private manager.ui.extend.RoundedPanel roundedPanel5;
    private manager.ui.extend.RoundedPanel roundedPanel6;
    private manager.ui.extend.RoundedPanel roundedPanel7;
    private manager.ui.extend.RoundedPanel roundedPanel8;
    private manager.ui.extend.RoundedPanel roundedPanel9;
    private javax.swing.JScrollPane scrollPaneVehicleTheft;
    private javax.swing.JSplitPane splitPaneKidnapReport;
    private javax.swing.JSplitPane splitPaneVehicleReport;
    private javax.swing.JTable tblKidnappings;
    private javax.swing.JTable tblVehicleTheft;
    private javax.swing.JToggleButton tlgHome;
    private javax.swing.JButton tolTrackVehicle;
    private javax.swing.JButton tolTrakMobileDevice;
    private javax.swing.JTextArea txaKidnapDetectedReporterLocation;
    private javax.swing.JTextArea txaKidnapIncidenceLocation;
    private javax.swing.JTextArea txaKidnapReportDetails;
    private javax.swing.JTextArea txaVehicleTheftDetectedReporterLocation;
    private javax.swing.JTextArea txaVehicleTheftIncidenceLocation;
    private javax.swing.JTextArea txaVehicleTheftReportDetails;
    private javax.swing.JTextField txtEngineNo;
    private javax.swing.JTextField txtOwnerAddress;
    private javax.swing.JTextField txtOwnerFingerPrintID;
    private javax.swing.JTextField txtOwnerFirstName;
    private javax.swing.JTextField txtOwnerLastName;
    private javax.swing.JTextField txtOwnerMiddleName;
    private javax.swing.JTextField txtOwnerOrganization;
    private javax.swing.JTextField txtOwnerPhoneNos;
    private javax.swing.JTextField txtOwnerPhotoFilename;
    private javax.swing.JTextField txtPlateNo;
    private javax.swing.JTextField txtPoliceFirstName;
    private javax.swing.JTextField txtPoliceID;
    private javax.swing.JTextField txtPoliceLGAOfDeployment;
    private javax.swing.JTextField txtPoliceLastName;
    private javax.swing.JTextField txtPoliceMaritalStatus;
    private javax.swing.JTextField txtPoliceMiddleName;
    private javax.swing.JTextField txtPolicePhoneNos;
    private javax.swing.JTextField txtPoliceRank;
    private javax.swing.JTextField txtPoliceStateOfDeployment;
    private javax.swing.JTextField txtPoliceStation;
    private javax.swing.JTextField txtStaffPhotoFilename;
    private javax.swing.JTextField txtVIN;
    private javax.swing.JTextField txtVehicleModel;
    private javax.swing.JTextField txtVehicleName;
    private javax.swing.JTextField txtVehiclePhotoFilename;
    private javax.swing.JTextField txtVehicleTrackingDeviceNumber;
    // End of variables declaration//GEN-END:variables

}

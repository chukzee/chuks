/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package report;

import chuks.server.JDBCSettings;
import chuks.server.Request;
import chuks.server.ServerObject;
import chuks.server.SimpleHttpServerException;
import chuks.server.WebApplication;
import chuks.server.http.impl.Value;
import chuks.server.http.sql.SQLResultSetHandler;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import org.json.JSONObject;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class IncidenceReport implements chuks.server.WebApplication {

    static public JDBCSettings ap_ds_settings;
    static Map<String, JDBCSettings> statesDSSettings = Collections.synchronizedMap(new HashMap<String, JDBCSettings>());
    static Map statesAndLGAs = Collections.synchronizedMap(new HashMap());//DO NOT PARAMETERIZE THIS Map TO ALL JSON USE IT
    private final ReportJSON reportJSON = new ReportJSON();

    private void configZonalDataSource(ServerObject so) throws FileNotFoundException, IOException {

        //FileInputStream input = null;
        Properties prop = new Properties();
        String filename = "ng_zone_ds.properties";
        try (FileInputStream input = new FileInputStream(filename)) {
            prop.load(input);
        }

        Enumeration<?> e = prop.propertyNames();
        HashMap<String, String[]> zn_map = new HashMap();
        while (e.hasMoreElements()) {
            String zone = (String) e.nextElement();
            String data_source_settings = prop.getProperty(zone);
            zn_map.put(zone, data_source_settings.split(","));
        }
        prop = new Properties();

        filename = "ng_state_zone.properties";
        try (FileInputStream input = new FileInputStream(filename)) {
            prop.load(input);
        }

        e = prop.propertyNames();
        while (e.hasMoreElements()) {
            String state = (String) e.nextElement();

            String zone = prop.getProperty(state);

            if (!zn_map.containsKey(zone)) {
                continue;
            }
            String[] ds_settings = zn_map.get(zone);

            String jndi_bind_name = ds_settings[0];
            String db_host = ds_settings[1];
            int db_port = Integer.parseInt(ds_settings[2]);
            String db_name = ds_settings[3];
            String db_username = ds_settings[4];
            String db_password = ds_settings[5];

            /*DataSource ds = initJNDIDatasource(jndi_bind_name,
             db_host,
             db_port,
             db_name,
             db_username,
             db_password);*/
            //String connectURI = "jdbc:mysql://" + db_host + ":" + db_port + "/" + db_name;
            //DataSource ds = setUpDataSource(connectURI, db_username, db_password);

            JDBCSettings ds_zon_settings = new JDBCSettings("jdbc:mysql://localhost:3306/" + db_name, db_username, db_password, null);
            state = state.replaceAll("_", " ");
            statesDSSettings.put(state, ds_zon_settings);
        }

    }

    private void populateStatesAndLGAs(ServerObject so) throws SimpleHttpServerException, SQLException {


        so.sqlQuery(ap_ds_settings,
                "SELECT STATE, LGA FROM states_and_lgas ORDER BY STATE",
                new SQLResultSetHandler() {
            @Override
            public Object handle(ResultSet rs) throws SQLException {

                String prev_state = "";
                List lga_list = new ArrayList();
                while (rs.next()) {
                    String state = rs.getString("STATE");

                    if (!prev_state.equalsIgnoreCase(state)) {
                        lga_list = new ArrayList();
                    }

                    String lga = rs.getString("LGA");
                    lga_list.add(lga);
                    statesAndLGAs.put(state, lga_list);//the last state

                    prev_state = state;
                }

                System.out.println(statesAndLGAs);

                return null;
            }
        });

    }

    static public JDBCSettings getDBSettings(String state) {
        return statesDSSettings.get(state);
    }

    @Override
    public WebApplication initialize(ServerObject so) throws Exception {
        return new IncidenceReport();
    }

    @Override
    public void callOnce(ServerObject so) {

        System.out.println("test_call_once");
        try {
            ap_ds_settings = new JDBCSettings("jdbc:mysql://localhost:3306/autopolicedb", "autopolice", "autopolicepass", null);
            populateStatesAndLGAs(so);
            configZonalDataSource(so);
            
            //so.createCacheRegion("region_name", prop);
        } catch (SimpleHttpServerException | SQLException |IOException ex) {
           so.outputErrorToWeb(ex);
        }
        
    }

    @Override
    public boolean startSession() {
        return false;
    }

    @Override
    public void onRequest(Request r, ServerObject so) {

        Value check = r.get("check_report");
        if (check != null) {
            
            String last_report_time = r.get("last_known_report_time").get().toString();
            String incidence_state = r.get("IncidenceState").get().toString();
            String incidence_LGA = r.get("IncidenceLGA").get().toString();

            JSONObject json_report = new JSONObject();
            Timestamp prev_report_timestamp = Timestamp.valueOf(last_report_time.toString());

            Timestamp current_checked_time = reportJSON.lastReportTime(so, prev_report_timestamp, incidence_state);

            json_report.put("report_time_checked", current_checked_time);//set the last report time

            if (current_checked_time
                    .after(prev_report_timestamp)) {

                //attach the reports to send
                JSONObject v_json = reportJSON.getVechicleTheftReport(so, last_report_time,
                        incidence_state,
                        incidence_LGA);

                json_report.put("vehicle_theft_report", v_json);

                JSONObject k_json = reportJSON.getKidnapReport(so, last_report_time,
                        incidence_state,
                        incidence_LGA);

                json_report.put("kidnap_report", k_json);

                JSONObject b_json = reportJSON.getBurgularyReport(so, last_report_time,
                        incidence_state,
                        incidence_LGA);

                json_report.put("burgulary_report", b_json);

                JSONObject m_json = reportJSON.getMurderReport(so, last_report_time,
                        incidence_state,
                        incidence_LGA);

                json_report.put("murder_report", m_json);

                JSONObject g_json = reportJSON.getGeneralReport(so, last_report_time,
                        incidence_state,
                        incidence_LGA);

                json_report.put("general_report", g_json);

            }

            //send the report
            so.echo(json_report.toString());

        }


        Value states_and_lgas = r.get("states_and_lgas");

        if (states_and_lgas != null) {
            JSONObject json = new JSONObject(statesAndLGAs);
            so.echo(json.toString());
        }

    }

    @Override
    public void onFinish(ServerObject so) {
    }

    @Override
    public void onError(ServerObject so, SimpleHttpServerException ex) {
    }
}

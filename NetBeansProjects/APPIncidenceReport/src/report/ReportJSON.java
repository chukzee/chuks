/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package report;

import chuks.server.JDBCSettings;
import chuks.server.ServerObject;
import chuks.server.http.sql.SQLResultSetHandler;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sql.DataSource;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class ReportJSON {

    public JSONObject getVechicleTheftReport(ServerObject so, String last_known_report_time, String IncidenceState, String IncidenceLGA) {

        SQLResultSetHandler<JSONObject> handler_1 = new SQLResultSetHandler<JSONObject>() {
            public JSONObject handle(ResultSet rs) throws SQLException {

                JSONObject json = new JSONObject();

                while (rs.next()) {
                    json.append("serial_no", rs.getString("SN"));
                    json.append("reporter", rs.getString("REPORTER_FULL_NAME"));
                    json.append("incidence_location", rs.getString("INCIDENCE_LOCATION"));
                    json.append("report_details", rs.getString("REPORT_DETAILS"));
                    json.append("report_phone_nos", rs.getString("REPORTER_PHONE_NOS"));
                    json.append("plate_no", rs.getString("PLATE_NO"));
                    json.append("detected_reporter_location", rs.getString("DETECTED_REPORTER_LOCATION"));
                    json.append("action_taken", rs.getString("ACTION_TAKEN"));
                    json.append("image_url", rs.getString("INCIDENCE_IMAGE_URL"));
                    json.append("video_url", rs.getString("INCIDENCE_VIDEO_URL"));
                    json.append("report_time", rs.getTimestamp("REPORT_TIME").getTime());
                }


                return json;
            }
        };


        JSONObject json = null;
        try {

            JDBCSettings ds = IncidenceReport.getDBSettings((String) IncidenceState);

            // Execute the query and get the results back from the handler
            json = (JSONObject) so.sqlQuery(ds, "SELECT * FROM vehicle_theft_report "
                    + " WHERE REPORT_TIME >?"
                    + " AND INCIDENCE_STATE=?"
                    + " AND INCIDENCE_LGA=?"
                    + " LIMIT 0, 2000", handler_1, last_known_report_time,
                    IncidenceState,
                    IncidenceLGA);
            
            if (!json.has("plate_no")) {
                return null;
            }

            JSONArray ja = json.getJSONArray("plate_no");
            int size = ja.length();

            if (size < 1) {
                return null;
            }

            String plate_no_list = "";
            for (int i = 0; i < size; i++) {
                plate_no_list += i < size - 1 ? "'" + ja.getString(i) + "'," : "'" + ja.getString(i) + "'";
            }

            if (plate_no_list.length() == 0) {
                plate_no_list = "''";//empty IN Parameter
            }

            VHandler<JSONObject> handler_2 = new VHandler(json);


            json = (JSONObject) so.sqlQuery(IncidenceReport.ap_ds_settings,
                    "SELECT FIRST_NAME, MIDDLE_NAME,"
                    + " LAST_NAME,ORGANIZATION,"
                    + " VEHICLE_NAME, VEHICLE_MODEL,"
                    + " PLATE_NO FROM vehicle_owners "
                    + " WHERE PLATE_NO IN (" + plate_no_list + ")", handler_2);

        } catch (SQLException ex) {
            Logger.getLogger(ReportJSON.class.getName()).log(Level.SEVERE, null, ex);
        }

        return json;
    }

    JSONObject getKidnapReport(ServerObject so, String last_known_report_time, String IncidenceState, String IncidenceLGA) {

        SQLResultSetHandler<JSONObject> handler_1 = new SQLResultSetHandler<JSONObject>() {
            public JSONObject handle(ResultSet rs) throws SQLException {

                JSONObject json = new JSONObject();

                while (rs.next()) {
                    json.append("serial_no", rs.getString("SN"));
                    json.append("reporter", rs.getString("REPORTER_FULL_NAME"));
                    json.append("captive", rs.getString("CAPTIVE"));
                    json.append("incidence_location", rs.getString("INCIDENCE_LOCATION"));
                    json.append("report_details", rs.getString("REPORT_DETAILS"));
                    json.append("report_phone_nos", rs.getString("REPORTER_PHONE_NOS"));
                    json.append("detected_reporter_location", rs.getString("DETECTED_REPORTER_LOCATION"));
                    json.append("action_taken", rs.getString("ACTION_TAKEN"));
                    json.append("image_url", rs.getString("INCIDENCE_IMAGE_URL"));
                    json.append("video_url", rs.getString("INCIDENCE_VIDEO_URL"));
                    json.append("report_time", rs.getTimestamp("REPORT_TIME").getTime());


                }

                return json;
            }
        };


        JSONObject json = null;
        try {

            JDBCSettings ds = IncidenceReport.getDBSettings((String) IncidenceState);

            // Execute the query and get the results back from the handler
            json = (JSONObject) so.sqlQuery(ds, "SELECT * FROM kidnap_report "
                    + " WHERE REPORT_TIME >?"
                    + " AND INCIDENCE_STATE=?"
                    + " AND INCIDENCE_LGA=?"
                    + " LIMIT 0, 2000", handler_1, last_known_report_time,
                    IncidenceState,
                    IncidenceLGA);



        } catch (SQLException ex) {
            Logger.getLogger(ReportJSON.class.getName()).log(Level.SEVERE, null, ex);
        }

        return json;
    }

    JSONObject getBurgularyReport(ServerObject so, String last_known_report_time, String IncidenceState, String IncidenceLGA) {


        SQLResultSetHandler<JSONObject> handler_1 = new SQLResultSetHandler<JSONObject>() {
            @Override
            public JSONObject handle(ResultSet rs) throws SQLException {

                JSONObject json = new JSONObject();

                while (rs.next()) {
                    json.append("serial_no", rs.getString("SN"));
                    json.append("reporter", rs.getString("REPORTER_FULL_NAME"));
                    json.append("incidence_location", rs.getString("INCIDENCE_LOCATION"));
                    json.append("report_details", rs.getString("REPORT_DETAILS"));
                    json.append("report_phone_nos", rs.getString("REPORTER_PHONE_NOS"));
                    json.append("detected_reporter_location", rs.getString("DETECTED_REPORTER_LOCATION"));
                    json.append("action_taken", rs.getString("ACTION_TAKEN"));
                    json.append("image_url", rs.getString("INCIDENCE_IMAGE_URL"));
                    json.append("video_url", rs.getString("INCIDENCE_VIDEO_URL"));
                    json.append("report_time", rs.getTimestamp("REPORT_TIME").getTime());


                }

                return json;
            }
        };


        JSONObject json = null;

        JDBCSettings ds = IncidenceReport.getDBSettings((String) IncidenceState);

        try {

            json = (JSONObject) so.sqlQuery(ds, "SELECT * FROM burgulary_report "
                    + " WHERE REPORT_TIME >?"
                    + " AND INCIDENCE_STATE=?"
                    + " AND INCIDENCE_LGA=?"
                    + " LIMIT 0, 2000",
                    handler_1,
                    last_known_report_time,
                    IncidenceState,
                    IncidenceLGA);

        } catch (SQLException ex) {
            Logger.getLogger(ReportJSON.class.getName()).log(Level.SEVERE, null, ex);
        }


        return json;
    }

    JSONObject getMurderReport(ServerObject so, String last_known_report_time, String IncidenceState, String IncidenceLGA) {


        SQLResultSetHandler<JSONObject> handler_1 = new SQLResultSetHandler<JSONObject>() {
            public JSONObject handle(ResultSet rs) throws SQLException {

                JSONObject json = new JSONObject();

                while (rs.next()) {
                    json.append("serial_no", rs.getString("SN"));
                    json.append("reporter", rs.getString("REPORTER_FULL_NAME"));
                    json.append("incidence_location", rs.getString("INCIDENCE_LOCATION"));
                    json.append("report_details", rs.getString("REPORT_DETAILS"));
                    json.append("report_phone_nos", rs.getString("REPORTER_PHONE_NOS"));
                    json.append("detected_reporter_location", rs.getString("DETECTED_REPORTER_LOCATION"));
                    json.append("action_taken", rs.getString("ACTION_TAKEN"));
                    json.append("image_url", rs.getString("INCIDENCE_IMAGE_URL"));
                    json.append("video_url", rs.getString("INCIDENCE_VIDEO_URL"));
                    json.append("report_time", rs.getTimestamp("REPORT_TIME").getTime());


                }

                return json;
            }
        };


        JSONObject json = null;
        try {

            JDBCSettings ds = IncidenceReport.getDBSettings((String) IncidenceState);
            // Execute the query and get the results back from the handler
            json = (JSONObject) so.sqlQuery(ds, "SELECT * FROM murder_report "
                    + " WHERE REPORT_TIME >?"
                    + " AND INCIDENCE_STATE=?"
                    + " AND INCIDENCE_LGA=?"
                    + " LIMIT 0, 2000", handler_1, last_known_report_time,
                    IncidenceState,
                    IncidenceLGA);



        } catch (SQLException ex) {
            Logger.getLogger(ReportJSON.class.getName()).log(Level.SEVERE, null, ex);
        }

        return json;
    }

    JSONObject getGeneralReport(ServerObject so, String last_known_report_time, String IncidenceState, String IncidenceLGA) {


        SQLResultSetHandler<JSONObject> handler_1 = new SQLResultSetHandler<JSONObject>() {
            public JSONObject handle(ResultSet rs) throws SQLException {

                JSONObject json = new JSONObject();

                while (rs.next()) {
                    json.append("serial_no", rs.getString("SN"));
                    json.append("reporter", rs.getString("REPORTER_FULL_NAME"));
                    json.append("incidence_location", rs.getString("INCIDENCE_LOCATION"));
                    json.append("report_details", rs.getString("REPORT_DETAILS"));
                    json.append("report_phone_nos", rs.getString("REPORTER_PHONE_NOS"));
                    json.append("detected_reporter_location", rs.getString("DETECTED_REPORTER_LOCATION"));
                    json.append("action_taken", rs.getString("ACTION_TAKEN"));
                    json.append("image_url", rs.getString("INCIDENCE_IMAGE_URL"));
                    json.append("video_url", rs.getString("INCIDENCE_VIDEO_URL"));
                    json.append("report_time", rs.getTimestamp("REPORT_TIME").getTime());


                }

                return json;
            }
        };


        JSONObject json = null;
        try {

            JDBCSettings ds = IncidenceReport.getDBSettings((String) IncidenceState);
            // Execute the query and get the results back from the handler
            json = (JSONObject) so.sqlQuery(ds, "SELECT * FROM general_report "
                    + " WHERE REPORT_TIME >?"
                    + " AND INCIDENCE_STATE=?"
                    + " AND INCIDENCE_LGA=?"
                    + " LIMIT 0, 2000", handler_1, last_known_report_time,
                    IncidenceState,
                    IncidenceLGA);



        } catch (SQLException ex) {
            Logger.getLogger(ReportJSON.class.getName()).log(Level.SEVERE, null, ex);
        }

        return json;
    }

    Timestamp lastReportTime(ServerObject so, Timestamp last_known_report_time, Object IncidenceState) {

        Timestamp report_time;
        try {
            report_time = (Timestamp) so.sqlQuery(IncidenceReport.getDBSettings((String) IncidenceState),
                    "SELECT LAST_REPORT_TIME FROM report_time_check",
                    new SQLResultSetHandler<Timestamp>() {
                @Override
                public Timestamp handle(ResultSet rs) throws SQLException {
                    if (rs.next()) {
                        return rs.getTimestamp("LAST_REPORT_TIME");
                    }
                    return null;
                }
            });

            if (report_time != null) {
                return report_time;
            }

        } catch (SQLException ex) {
            Logger.getLogger(ReportJSON.class.getName()).log(Level.SEVERE, null, ex);
        }

        return last_known_report_time;
    }

    class VHandler<T> implements SQLResultSetHandler {

        private final JSONObject json;

        public VHandler(JSONObject json) {
            this.json = json;
        }

        @Override
        public JSONObject handle(ResultSet rs) throws SQLException {

            JSONArray plate_ja = json.getJSONArray("plate_no");
            int size = plate_ja.length();
            JSONArray owner_full_name_ja = new JSONArray();
            JSONArray vehical_model_ja = new JSONArray();
            JSONArray vehical_name_ja = new JSONArray();

            owner_full_name_ja.put(size - 1, (Object) null);//initialize - important! to ensure the same size
            vehical_model_ja.put(size - 1, (Object) null);//initialize - important! to ensure the same size
            vehical_name_ja.put(size - 1, (Object) null);//initialize - important! to ensure the same size


            while (rs.next()) {

                String plate_no = rs.getString("PLATE_NO");

                for (int i = 0; i < size; i++) {
                    if (plate_ja.getString(i).equals(plate_no)) {
                        vehical_name_ja.put(i, rs.getString("VEHICLE_NAME"));
                        vehical_model_ja.put(i, rs.getString("VEHICLE_MODEL"));

                        String owner_full_name;
                        String organization = rs.getString("ORGANIZATION");
                        if (organization.isEmpty()) {
                            owner_full_name = rs.getString("FIRST_NAME") + " "
                                    + (rs.getString("MIDDLE_NAME").isEmpty()
                                    ? "" : rs.getString("MIDDLE_NAME") + " ")
                                    + rs.getString("LAST_NAME");
                        } else {
                            owner_full_name = organization;
                        }

                        owner_full_name_ja.put(i, owner_full_name);

                    }
                }
            }

            json.put("vehical_name", vehical_name_ja);
            json.put("vehical_model", vehical_model_ja);
            json.put("owner_full_name", owner_full_name_ja);

            return json;
        }
    }

    public static void main(String args[]) {
        JSONObject json = new JSONObject();
        json.append("a", "a1");
        json.append("b", "b1");
        json.append("c", "c1");

        json.append("a", "a2");
        json.append("b", "b2");
        json.append("c", "c2");

        json.append("a", "a3");
        json.append("b", "b3");
        json.append("c", "c3");

        System.out.println(json);
        System.out.println(json.getJSONArray("a").get(0));
        System.out.println(json.getJSONArray("a").get(1));
        System.out.println(json.getJSONArray("a").get(2));

        JSONArray plate_ja = new JSONArray();
        plate_ja.put(2, "chuks");
        JSONObject j = new JSONObject();
        j.put("name", plate_ja);
        System.out.println(j);


    }
}

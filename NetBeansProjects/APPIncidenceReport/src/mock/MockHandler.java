/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mock;

import chuks.server.ServerObject;
import chuks.server.http.impl.Value;
import chuks.server.http.sql.SQLResultSetHandler;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONObject;
import test.TestInterface;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class MockHandler {
    
    static JSONObject getBVNList(ServerObject so, String bank_name, String first_name, String middle_name, String last_name) {
        try {
            String sql = "SELECT BANK_VERIFICATION_NUMBER FROM mock_bvn"
                    + " WHERE "
                    + "BANK_NAME =?"
                    + (!first_name.isEmpty() ? (" AND FIRST_NAME=?") : "")
                    + (!middle_name.isEmpty() ? (" AND MIDDLE_NAME=?") : "")
                    + (!last_name.isEmpty() ? (" AND LAST_NAME=?") : "");

            //add the parameters in the correct order
            ArrayList<String> list = new ArrayList();
            list.add(bank_name);
            if (!first_name.isEmpty()) {
                list.add(first_name);
            }
            if (!middle_name.isEmpty()) {
                list.add(middle_name);
            }
            if (!last_name.isEmpty()) {
                list.add(last_name);
            }

            String[] params = new String[list.size()];
            list.toArray(params);

            return (JSONObject) so.sqlQuery(MockDetails.ds_settings,
                    sql,
                    new SQLResultSetHandler<JSONObject>() {

                        @Override
                        public JSONObject handle(ResultSet rs) throws SQLException {
                            JSONObject json = new JSONObject();
                            while (rs.next()) {
                                json.append("bvn_found_list", rs.getString("BANK_VERIFICATION_NUMBER"));
                            }
                            return json;
                        }
                    },
                    //the parameters
                    params);

        } catch (SQLException ex) {
            Logger.getLogger(MockHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    static JSONObject getBVNDetails(ServerObject so, String bvn) {
        try {
            String sql = "SELECT * FROM mock_bvn"
                    + " WHERE "
                    + "BANK_VERIFICATION_NUMBER=?";

            return (JSONObject) so.sqlQuery(MockDetails.ds_settings,
                    sql,
                    new SQLResultSetHandler<JSONObject>() {

                        @Override
                        public JSONObject handle(ResultSet rs) throws SQLException {
                            JSONObject json = new JSONObject();
                            while (rs.next()) {
                                json.put("first_name", rs.getString("FIRST_NAME"));
                                json.put("last_name", rs.getString("LAST_NAME"));
                                json.put("middle_name", rs.getString("MIDDLE_NAME"));
                                json.put("bank_name", rs.getString("BANK_NAME"));
                                json.put("account_no", rs.getString("ACCOUNT_NUMBER"));
                                json.put("sex", rs.getString("SEX"));
                                json.put("address", rs.getString("ADDRESS"));
                                json.put("state_of_origin", rs.getString("STATE_OF_ORIGIN"));
                                json.put("lga_of_origin", rs.getString("LGA_OF_ORIGIN"));
                                json.put("occupation", rs.getString("OCCUPATION"));
                                json.put("religion", rs.getString("RELIGION"));
                                json.put("phone_no", rs.getString("PHONE_NUMBER"));
                                json.put("photo_url", rs.getString("PHOTO_URL"));//Base64 MAY BE USED - COME BACK LATER
                            }
                            return json;
                        }
                    },
                    //the parameters
                    bvn);

        } catch (SQLException ex) {
            Logger.getLogger(MockHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    static JSONObject getFRSCList(ServerObject so, String license_no, String first_name, String middle_name, String last_name) {
        try {
            String sql = "SELECT LICENSE_NUMBER FROM mock_frsc"
                    + " WHERE "
                    + "LICENSE_NUMBER =?"
                    + (!first_name.isEmpty() ? (" AND FIRST_NAME=?") : "")
                    + (!middle_name.isEmpty() ? (" AND MIDDLE_NAME=?") : "")
                    + (!last_name.isEmpty() ? (" AND LAST_NAME=?") : "");

            //add the parameters in the correct order
            ArrayList<String> list = new ArrayList();
            list.add(license_no);
            if (!first_name.isEmpty()) {
                list.add(first_name);
            }
            if (!middle_name.isEmpty()) {
                list.add(middle_name);
            }
            if (!last_name.isEmpty()) {
                list.add(last_name);
            }

            String[] params = new String[list.size()];
            list.toArray(params);

            return (JSONObject) so.sqlQuery(MockDetails.ds_settings,
                    sql,
                    new SQLResultSetHandler<JSONObject>() {

                        @Override
                        public JSONObject handle(ResultSet rs) throws SQLException {
                            JSONObject json = new JSONObject();
                            while (rs.next()) {
                                json.append("license_no_found_list", rs.getString("LICENSE_NUMBER"));
                            }
                            return json;
                        }
                    },
                    //the parameters
                    params);

        } catch (SQLException ex) {
            Logger.getLogger(MockHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    static JSONObject getFRSCDetails(ServerObject so, String bvn) {
        try {
            String sql = "SELECT * FROM mock_frsc"
                    + " WHERE "
                    + "LICENSE_NUMBER=?";

            return (JSONObject) so.sqlQuery(MockDetails.ds_settings,
                    sql,
                    new SQLResultSetHandler<JSONObject>() {

                        @Override
                        public JSONObject handle(ResultSet rs) throws SQLException {
                            JSONObject json = new JSONObject();
                            while (rs.next()) {
                                json.put("first_name", rs.getString("FIRST_NAME"));
                                json.put("last_name", rs.getString("LAST_NAME"));
                                json.put("middle_name", rs.getString("MIDDLE_NAME"));
                                json.put("plate_no", rs.getString("PLATE_NUMBER"));
                                json.put("license_no", rs.getString("LICENSE_NUMBER"));
                                json.put("sex", rs.getString("SEX"));
                                json.put("address", rs.getString("ADDRESS"));
                                json.put("state_of_origin", rs.getString("STATE_OF_ORIGIN"));
                                json.put("lga_of_origin", rs.getString("LGA_OF_ORIGIN"));
                                json.put("occupation", rs.getString("OCCUPATION"));
                                json.put("religion", rs.getString("RELIGION"));
                                json.put("phone_no", rs.getString("PHONE_NUMBER"));
                                json.put("photo_url", rs.getString("PHOTO_URL"));//Base64 MAY BE USED - COME BACK LATER
                            }
                            return json;
                        }
                    },
                    //the parameters
                    bvn);

        } catch (SQLException ex) {
            Logger.getLogger(MockHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    static JSONObject getNationalIDCardList(ServerObject so, String bank_name, String first_name, String middle_name, String last_name) {
        try {
            String sql = "SELECT NATIONAL_IDENTITY_NUMBER FROM mock_national_id"
                    + " WHERE "
                    + "BANK_NAME =?"
                    + (!first_name.isEmpty() ? (" AND FIRST_NAME=?") : "")
                    + (!middle_name.isEmpty() ? (" AND MIDDLE_NAME=?") : "")
                    + (!last_name.isEmpty() ? (" AND LAST_NAME=?") : "");

            //add the parameters in the correct order
            ArrayList<String> list = new ArrayList();
            list.add(bank_name);
            if (!first_name.isEmpty()) {
                list.add(first_name);
            }
            if (!middle_name.isEmpty()) {
                list.add(middle_name);
            }
            if (!last_name.isEmpty()) {
                list.add(last_name);
            }

            String[] params = new String[list.size()];
            list.toArray(params);

            return (JSONObject) so.sqlQuery(MockDetails.ds_settings,
                    sql,
                    new SQLResultSetHandler<JSONObject>() {

                        @Override
                        public JSONObject handle(ResultSet rs) throws SQLException {
                            JSONObject json = new JSONObject();
                            while (rs.next()) {
                                json.append("national_no_found_list", rs.getString("NATIONAL_IDENTITY_NUMBER"));
                            }
                            return json;
                        }
                    },
                    //the parameters
                    params);

        } catch (SQLException ex) {
            Logger.getLogger(MockHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    static JSONObject getNationalIDCardDetails(ServerObject so, String bvn) {
        try {
            String sql = "SELECT * FROM mock_national_id"
                    + " WHERE "
                    + "NATIONAL_IDENTITY_NUMBER=?";

            return (JSONObject) so.sqlQuery(MockDetails.ds_settings,
                    sql,
                    new SQLResultSetHandler<JSONObject>() {

                        @Override
                        public JSONObject handle(ResultSet rs) throws SQLException {
                            JSONObject json = new JSONObject();
                            while (rs.next()) {
                                json.put("first_name", rs.getString("FIRST_NAME"));
                                json.put("last_name", rs.getString("LAST_NAME"));
                                json.put("middle_name", rs.getString("MIDDLE_NAME"));
                                json.put("national_id_no", rs.getString("NATIONAL_IDENTITY_NUMBER"));
                                json.put("sex", rs.getString("SEX"));
                                json.put("address", rs.getString("ADDRESS"));
                                json.put("state_of_origin", rs.getString("STATE_OF_ORIGIN"));
                                json.put("lga_of_origin", rs.getString("LGA_OF_ORIGIN"));
                                json.put("occupation", rs.getString("OCCUPATION"));
                                json.put("religion", rs.getString("RELIGION"));
                                json.put("phone_no", rs.getString("PHONE_NUMBER"));
                                json.put("photo_url", rs.getString("PHOTO_URL"));//Base64 MAY BE USED - COME BACK LATER
                            }
                            return json;
                        }
                    },
                    //the parameters
                    bvn);

        } catch (SQLException ex) {
            Logger.getLogger(MockHandler.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

}

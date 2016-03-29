/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mock;

import chuks.server.JDBCSettings;
import chuks.server.Request;
import chuks.server.ServerObject;
import chuks.server.SimpleHttpServerException;
import chuks.server.WebApplication;
import chuks.server.http.impl.Value;
import org.json.JSONObject;
import test.TestInterface;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class MockDetails implements WebApplication {

    public static JDBCSettings ds_settings;
    public MockHandler h;//testing
    
    @Override
    public WebApplication initialize(ServerObject so) throws Exception {

        return new MockDetails();
    }

    @Override
    public boolean startSession() {
        return false;
    }

    @Override
    public void callOnce(ServerObject so) {
        ds_settings = new JDBCSettings("jdbc:mysql://localhost:3306/autopolicedb", "autopolice", "autopolicepass", null);
        //so.createCacheRegion("region_name", prop);
    }

    @Override
    public void onRequest(Request r, ServerObject so) {
        
        Object OgaMadam =new Object();//testing
        Object OgaMad = OgaMadam;//testing
        System.out.println(TestInterface.i);//testing
        TestInterface test;//testing
        int n = TestInterface.i;//testing
    
        Value search = r.get("search");
        if (search != null) {
            if ("bvn_list".equals(search.get())) {
                String bank_name = r.get("bank_name").get().toString();
                String first_name = r.get("first_name").get().toString();
                String last_name = r.get("last_name").get().toString();
                String middle_name = r.get("middle_name").get().toString();
                JSONObject json = MockHandler.getBVNList(so, bank_name, first_name, last_name, middle_name);
                so.echo(json);
                return;
            }

            if ("bvn_detials".equals(search.get())) {
                String bvn = r.get("bvn").get().toString();
                JSONObject json = MockHandler.getBVNDetails(so, bvn);
                so.echo(json);
                return;
            }

            if ("license_no_list".equals(search.get())) {
                String license_no = r.get("license_no").get().toString();
                String first_name = r.get("first_name").get().toString();
                String last_name = r.get("last_name").get().toString();
                String middle_name = r.get("middle_name").get().toString();
                JSONObject json = MockHandler.getFRSCList(so, license_no, first_name, last_name, middle_name);
                so.echo(json);
                return;
            }

            if ("license_detials".equals(search.get())) {
                String license_no = r.get("license_no").get().toString();
                JSONObject json = MockHandler.getFRSCDetails(so, license_no);
                so.echo(json);
                return;
            }

            if ("national_id_no_list".equals(search.get())) {
                String national_id_no = r.get("national_id_no").get().toString();
                String first_name = r.get("first_name").get().toString();
                String last_name = r.get("last_name").get().toString();
                String middle_name = r.get("middle_name").get().toString();
                JSONObject json = MockHandler.getNationalIDCardList(so, national_id_no, first_name, last_name, middle_name);
                so.echo(json);
                return;
            }

            if ("national_id_detials".equals(search.get())) {
                String national_id_no = r.get("national_id_no").get().toString();
                JSONObject json = MockHandler.getNationalIDCardDetails(so, national_id_no);
                so.echo(json);
                return;
            }
        }
    }

    @Override
    public void onFinish(ServerObject so) {
    }

    @Override
    public void onError(ServerObject so, SimpleHttpServerException ex) {

    }

    public static void main(String... args) {
        JSONObject json = new JSONObject();
        json.put("name", "chuks");
        StringBuilder s = new StringBuilder();
        s.append(json);
        System.out.println(s);

    }
}

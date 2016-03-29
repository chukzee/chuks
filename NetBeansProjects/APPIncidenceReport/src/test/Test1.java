/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;
import report.IncidenceReport;
import report.ReportJSON;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Test1 {
 
    public static void main(String args[]) throws Exception{
        
       /* IncidenceReport i = new IncidenceReport();
        i.initialize(null);
        ReportJSON reportJSON = new ReportJSON();
        JSONObject json = reportJSON.getVechicleTheftReport(
                                                            "0",
                                                            "Delta State",
                                                            "effurun");
        System.out.println(json);
        */
        Timestamp last_report_timestamp = Timestamp.valueOf("2010-01-12 08:32:01.0");
        JSONObject j = new JSONObject().put("time", last_report_timestamp);
        System.out.println(j);
        JSONArray a = new JSONArray();
        a.put("a");
        a.put("u");
        JSONObject o = new JSONObject();
        o.put("a", a);
        o.append("b", 1);
        o.append("b", 2);
        
        System.out.println(a);
        System.out.println(o);
        
        System.out.println(o.names().get(0));
        JSONArray js = o.getJSONArray(o.names().getString(1));
        System.out.println(js);
        
        Map map = new HashMap();
        List l1 = new ArrayList();
        l1.add("a1");
        l1.add("a2");
        l1.add("a3");
        map.put("a", l1);
        List l2 = new ArrayList();
                
        l2.add("b1");
        l2.add("b2");
        l2.add("b3");
        map.put("b", l2);
        
        List l3 = new ArrayList();
        
        l3.add("c1");
        l3.add("c2");
        l3.add("c3");
        map.put("c", l3);
        
        
        JSONObject jm = new JSONObject(map);
        JSONArray jmap = jm.getJSONArray(jm.names().getString(1));
        System.out.println(jmap);
        
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.io.Serializable;
import org.json.JSONObject;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Test implements Serializable{
    String n="chuks";
    public static void main(String[] args) {
        JSONObject json = new JSONObject(new Test());
        System.out.println(json);
    }
    
}

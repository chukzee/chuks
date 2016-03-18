/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package test;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.Properties;

/**
 *
 * @author WILL-PARRY PC
 */
public class TestProperties {
    
    public static void main(String args[]){
        
	Properties prop = new Properties();
	InputStream input = null;
 
	try {
 
		String filename = "c:/test/ng_state_zone.properties";
		input = new FileInputStream(filename);
		if (input == null) {
                    System.out.println("Sorry, unable to find " + filename);
                    return;
		}
 
		prop.load(input);
 
		Enumeration<?> e = prop.propertyNames();
		while (e.hasMoreElements()) {
			String key = (String) e.nextElement();
			String value = prop.getProperty(key);
			System.out.println("Key : " + key + ", Value : " + value);
		}
 
	} catch (IOException ex) {
		ex.printStackTrace();
	} finally {
		if (input != null) {
			try {
				input.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
 
    }
}

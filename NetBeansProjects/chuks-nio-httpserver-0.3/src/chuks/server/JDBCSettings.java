/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package chuks.server;

import chuks.server.http.impl.NameValue;
import java.util.Arrays;
import java.util.Objects;
import java.util.Properties;

/**
 *
 * @author Chuks Alimele
 */
public class JDBCSettings {
      /**This class will not use setter methods but getters only
     * 
     */
    private String username;
    private String password;
    private String Url;
    private NameValue[] additionSettings;

    private JDBCSettings(){}
    
    public JDBCSettings(String Url, String username, String password, NameValue[] additionSettings){ 
        this.Url = Url;
        this.username = username;
        this.password = password;
        this.additionSettings =additionSettings;
    }
 
    @Override
    public boolean equals(Object obj) {
        if(!(obj instanceof JDBCSettings))
            return false;
        JDBCSettings jd = (JDBCSettings) obj;
        if(!Url.equals(jd.Url)
                ||!username.equals(jd.username)
                ||!password.equals(jd.password)){
            return false;
        }
        if(additionSettings==null && jd.additionSettings==null)
            return true;
        
        if(additionSettings!=null && jd.additionSettings==null)
            return false;
        if(additionSettings==null && jd.additionSettings!=null)
            return false;
        
        if(additionSettings.length != jd.additionSettings.length)
            return false;
        
        for(int i=0; i<additionSettings.length; i++){
            if(!additionSettings.toString().equals(jd.additionSettings.toString()))
                return false;
        }
        
        return true; 
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 41 * hash + Objects.hashCode(this.username);
        hash = 41 * hash + Objects.hashCode(this.password);
        hash = 41 * hash + Objects.hashCode(this.Url);
        hash = 41 * hash + Arrays.deepHashCode(this.additionSettings);
        return hash;
    }
    
    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getUrl() {
        return Url;
    }

    public NameValue[] getAdditionSettings() {
        return additionSettings;
    }
      
    
}

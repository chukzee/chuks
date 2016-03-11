/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.chuks.report.processor.util;

/**
 *
 * @author Chuks Alimele
 */
public class JDBCSettings {

    /**
     * This class will not use setter methods but getters only
     *
     */
    private String username;
    private String password;
    private String Url;
    private NameValue[] additionSettings;

    private JDBCSettings() {
    }

    public JDBCSettings(JDBCSettings jdbcSettings) {
        this.Url = jdbcSettings.Url;
        this.username = jdbcSettings.username;
        this.password = jdbcSettings.password;
        if (jdbcSettings.additionSettings != null) {
            this.additionSettings = new NameValue[jdbcSettings.additionSettings.length];
            for(int i=0; i<additionSettings.length; i++){
                additionSettings[i].name = jdbcSettings.additionSettings[i].name;
                additionSettings[i].value = jdbcSettings.additionSettings[i].value;
            }
        }
    }

    public JDBCSettings(String Url, String username, String password, NameValue[] additionSettings) {
        this.Url = Url;
        this.username = username;
        this.password = password;
        this.additionSettings = additionSettings;
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof JDBCSettings)) {
            return false;
        }
        JDBCSettings jd = (JDBCSettings) obj;
        if (!Url.equals(jd.Url)
                || !username.equals(jd.username)
                || !password.equals(jd.password)) {
            return false;
        }
        if (additionSettings == null && jd.additionSettings == null) {
            return true;
        }

        if (additionSettings != null && jd.additionSettings == null) {
            return false;
        }
        if (additionSettings == null && jd.additionSettings != null) {
            return false;
        }

        if (additionSettings.length != jd.additionSettings.length) {
            return false;
        }

        for (int i = 0; i < additionSettings.length; i++) {
            if (!additionSettings.toString().equals(jd.additionSettings.toString())) {
                return false;
            }
        }

        return true;
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

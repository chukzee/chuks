/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package manager.util;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

/**
 *
 * @author ADMIN
 */
public class TrackInfo implements Serializable{
    private String longitude = "";
    private String latitude = "";
    private String location_address = "";
    private Timestamp location_time = null;
    private String str_location_time = "";
    private String first_name ="";
    private String last_name ="";
    private String sex ="";
    private String age ="";
    private String contact_address ="";
    private String location_priority ="";
    private int location_update_interval;
    private int location_update_duration = - 1;
    private String speed;
    private String bearing;
    private String altitude;

    public TrackInfo(){

    }

    public void setLogitude(String longitude){
        this.longitude =  longitude;            
    }

    public void setLatitude(String latitude){
        this.latitude =  latitude;            
    }

    public void setLocationTime(Timestamp location_time){
        this.location_time =  location_time;            
    }

    public void setLocationAddress(String location_address){
        this.location_address =  location_address;            
    }

    public void setFirstName(String first_name){
        this.first_name =  first_name;            
    }

    public void setLastName(String last_name){
        this.last_name =  last_name;            
    }

    public void setSex(String sex){
        this.sex =  sex;            
    }

    public void setAge(String age){
        this.age =  age;            
    }

    public void setContactAddress(String contact_address){
        this.contact_address =  contact_address;
    }

    public String getFirstName(){
        return this.first_name;
    }

    public String getLastName(){
        return this.last_name;
    }

    public String getSex(){
        return this.sex;
    }

    public String getAge(){
        return this.age;
    }

    public String getContactAddress(){
        return this.contact_address;
    }

    public String getLongitude(){
        return this.longitude;
    }

    public String getLatitude(){
        return this.latitude;
    }

    public Date getLocationTime(){
        return this.location_time;
    }

    public String getStrLocationTime(){
        if(this.location_time==null)
            return "";
        return this.location_time.toString();
    }
        
    public String getLocationAddress(){
        return this.location_address;
    }

    public void setLocationPriority(String location_priority) {
        this.location_priority = location_priority;
    }

    public void setLocationUpdateInterval(int location_update_interval) {
        this.location_update_interval = location_update_interval;
    }

    public void setLocationUpdateDuration(int location_update_duration) {
        this.location_update_duration = location_update_duration;
    }

    public void setSpeed(String speed) {
        this.speed = speed;
    }

    public void setBearing(String bearing) {
        this.bearing = bearing;
    }

    public void setAltitude(String altitude) {
        this.altitude = altitude;
    }

    public String getLocationPriority() {
        return this.location_priority;
    }

    public int getLocationUpdateInterval() {
        return this.location_update_interval;
    }

    public int getLocationUpdateDuration() {
        return this.location_update_duration;
    }

    public String getSpeed() {
        return this.speed;
    }

    public String getBearing() {
        return this.bearing;
    }

    public String getAltitude() {
        return this.altitude;
    }
   
}

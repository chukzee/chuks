/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

/**
 *
 * @author USER
 */
public interface ParticipantInfo {
    public void setUsername(String username);
    public void setPassword(String password);
    public void setFirstNmae(String first_name);
    public void setMiddleNmae(String middle_name);    
    public void setLastNmae(String last_name);    
    public void setAge(String age);    
    public void setSex(String sex);    
    public void setNationality(String nationality);    
    public void setAddress(String address);    
    public void setPhoneNo(String phone_no);    
    public void setEmailAddress(String email_address);    
    
    public String getUsername();
    public String getPassword();
    public String getFirstNmae();
    public String getMiddleNmae();    
    public String getLastNmae();    
    public String getAge();    
    public String getSex();    
    public String getNationality();    
    public String getAddress();    
    public String getPhoneNo();    
    public String getEmailAddress();    
}

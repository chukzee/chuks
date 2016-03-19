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
public class UserInfo  implements ParticipantInfo{
    private String username="";
    private String password="";
    private String first_name="";
    private String middle_name="";
    private String last_name="";
    private String age="";
    private String sex="";
    private String nationality="";
    private String address="";
    private String phone_no="";
    private String email_address;
    
    
    public void setUsername(String username){
        this.username = username;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public void setFirstNmae(String first_name){
        this.first_name = first_name;
    }
    
    public void setMiddleNmae(String middle_name) {
        this.middle_name = middle_name;
    }
        
    public void setLastNmae(String last_name){
        this.last_name = last_name;
    }  
    
    public void setAge(String age){
        this.age = age;
    }    
    
    public void setSex(String sex){
        this.sex = sex;
    } 
    
    public void setNationality(String nationality){
        this.nationality = nationality;
    } 
    
    public void setAddress(String address){
        this.address = address;
    }   
    
    public void setPhoneNo(String phone_no){
        this.phone_no = phone_no;  
    }   
    
    public void setEmailAddress(String email_address){
        this.email_address = email_address;
    } 
    
    public String getUsername(){
        return username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public String getFirstNmae(){
        return first_name;
    }
    
    public String getMiddleNmae() {
        return middle_name;
    }
        
    public String getLastNmae(){
        return last_name;
    }  
    
    public String getAge(){
        return age;
    }    
    
    public String getSex(){
        return sex;
    } 
    
    public String getNationality(){
        return nationality;
    }   
    
    public String getAddress(){
        return address;
    }   
    
    public String getPhoneNo(){
        return phone_no;
    }   
    
    public String getEmailAddress(){
        return email_address;
    }     
            
}

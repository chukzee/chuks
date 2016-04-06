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
public class User  implements IUser{
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
    
    
    @Override
    public void setUsername(String username){
        if(username==null)
            throw new IllegalArgumentException("username cannot be null");
        
        this.username = username;
    }
    
    @Override
    public void setPassword(String password) {
        this.password = password;
    }
    
    @Override
    public void setFirstNmae(String first_name){
        this.first_name = first_name;
    }
    
    @Override
    public void setMiddleNmae(String middle_name) {
        this.middle_name = middle_name;
    }
        
    @Override
    public void setLastNmae(String last_name){
        this.last_name = last_name;
    }  
    
    @Override
    public void setAge(String age){
        this.age = age;
    }    
    
    @Override
    public void setSex(String sex){
        this.sex = sex;
    } 
    
    @Override
    public void setNationality(String nationality){
        this.nationality = nationality;
    } 
    
    @Override
    public void setAddress(String address){
        this.address = address;
    }   
    
    @Override
    public void setPhoneNo(String phone_no){
        this.phone_no = phone_no;  
    }   
    
    @Override
    public void setEmailAddress(String email_address){
        this.email_address = email_address;
    } 
    
    @Override
    public String getUsername(){
        return username;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getFirstNmae(){
        return first_name;
    }
    
    @Override
    public String getMiddleNmae() {
        return middle_name;
    }
        
    @Override
    public String getLastNmae(){
        return last_name;
    }  
    
    @Override
    public String getAge(){
        return age;
    }    
    
    @Override
    public String getSex(){
        return sex;
    } 
    
    @Override
    public String getNationality(){
        return nationality;
    }   
    
    @Override
    public String getAddress(){
        return address;
    }   
    
    @Override
    public String getPhoneNo(){
        return phone_no;
    }   
    
    @Override
    public String getEmailAddress(){
        return email_address;
    }     
            
}

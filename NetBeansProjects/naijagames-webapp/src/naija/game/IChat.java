/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface IChat {
    
    void setChatSerialNo(long sn);
   
    long getChatSerialNo();

    void setMessage(String msg);
    
    String getMessage();
    
    void setUsername(String username);
    
    String getUsername();
    
    void setFirstName(String first_name);
    
    String getFirstName();
    
    void setLastName(String first_name);
    
    String getLastName();
    
}

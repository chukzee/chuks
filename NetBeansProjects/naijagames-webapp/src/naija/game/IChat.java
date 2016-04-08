/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game;

import java.io.Serializable;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface IChat extends Serializable {

    void setChatSerialNo(long sn);

    long getChatSerialNo();
    
    void setUsername(String username);

    String getUsername();

    void setFirstName(String first_name);

    String getFirstName();

    void setLastName(String last_name);

    String getLastName();

    void setImageUrl(String img_url);
    
    String getImageUrl();

    void setChatmate(String chatmate_username);

    String getChatmate();

    void setMessage(String msg);

    String getMessage();

    void setMessageTime(String formattedTime);

    String getMessageTime();

}

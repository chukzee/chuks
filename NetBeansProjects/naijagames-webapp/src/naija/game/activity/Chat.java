/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.activity;

import naija.game.IChat;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Chat implements IChat{
    private long chat_sn;
    private String msg;
    private String username;
    private String first_name;
    private String last_name;
    private String formattedTime;
    private String img_url;
    private String chatmate_username;

    @Override
    public void setChatSerialNo(long sn) {
        chat_sn = sn;
    }

    @Override
    public long getChatSerialNo() {
        return chat_sn;
    }

    @Override
    public void setMessage(String msg) {
this.msg = msg;    }

    @Override
    public String getMessage() {
        return msg;
    }

    @Override
    public void setUsername(String username) {
this.username = username;    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public void setFirstName(String first_name) {
this.first_name = first_name;    }

    @Override
    public String getFirstName() {
        return first_name;
    }

    @Override
    public void setLastName(String last_name) {
        this.last_name = last_name;
    }

    @Override
    public String getLastName() {
        return last_name;
    }

    @Override
    public void setMessageTime(String formattedTime) {
        this.formattedTime = formattedTime;
    }

    @Override
    public String getMessageTime() {
        return formattedTime;
    }

    @Override
    public void setImageUrl(String img_url) {
        this.img_url = img_url;
    }

    @Override
    public String getImageUrl() {
        return img_url;
    }

    @Override
    public void setChatmate(String chatmate_username) {
        this.chatmate_username = chatmate_username;
    }

    @Override
    public String getChatmate() {
        return chatmate_username;
    }
    
}

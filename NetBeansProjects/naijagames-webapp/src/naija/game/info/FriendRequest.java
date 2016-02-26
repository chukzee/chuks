/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.info;

import java.io.Serializable;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class FriendRequest  implements Serializable{
    private String username;
    private long time_of_request;
    
    private FriendRequest(){
    }

    public FriendRequest(String username, long time_of_request) {
        this.username = username;
        this.time_of_request = time_of_request;
    }

    public String getUsername() {
        return username;
    }

    public long getTimeOfRequest() {
        return time_of_request;
    }
    
}

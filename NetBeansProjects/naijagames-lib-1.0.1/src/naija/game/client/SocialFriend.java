/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class SocialFriend extends User{
    private String social_net_user_id;
    
    public void setUserId(String social_net_user_id){
        this.social_net_user_id = social_net_user_id;
    }

    public String getUserId(){
        return this.social_net_user_id;
    }
            
    
}

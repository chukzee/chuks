/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.List;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface SocialNetwork {
    int FACEBOOK=1;
    int TWITTER=2;
    
    /**get a list of user friends.
     * 
     * 
     * @param social_net_user_id
     * @param skip number of friends to skip in the query
     * @param len number of friends queried 
     * @return 
     */
    List<SocialFriend> getFriends(int social_net_user_id, int skip, int len);
   
    /**send message to a friend using the user_id and the friend's user_id
     * in the social network
     * 
     * @param from_user_id
     * @param to_friend_user_id
     * @param msg 
     */
    void sendMessage(int from_user_id, int to_friend_user_id, String msg);
}

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
public class AbstractSocialNetwork implements SocialNetwork{

    @Override
    public List<SocialFriend> getFriends(int social_net_user_id, int skip, int len) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void sendMessage(int from_user_id, int to_friend_user_id, String msg) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }


}

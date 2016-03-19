/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TwitterSocialNetwork extends AbstractSocialNetwork {

    Twitter tt;
    public TwitterSocialNetwork(String token, String token_secret, long user_id) {
        
        AccessToken access_token = new AccessToken( token, token_secret, user_id);
        tt = new TwitterFactory().getInstance(access_token);        
    }
    
    public TwitterSocialNetwork(String token, String token_secret) {
        
        AccessToken access_token = new AccessToken(token,  token_secret);
        tt = new TwitterFactory().getInstance(access_token);    
        
    }

    
}

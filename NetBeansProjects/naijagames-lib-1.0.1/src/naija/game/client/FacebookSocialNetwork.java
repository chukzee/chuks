/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import facebook4j.*;
import facebook4j.auth.AccessToken;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class FacebookSocialNetwork extends AbstractSocialNetwork {
    Facebook fb;
    public FacebookSocialNetwork(String token, long expires) {
        //TODO: check if the access token has expired and throw exception if it has
        AccessToken access_token = new AccessToken( token,  expires);
        fb = new FacebookFactory().getInstance(access_token);        
    }
    
    public FacebookSocialNetwork(String access_token_response) {
        //TODO: check if the access token has expired and throw exception if it has
        AccessToken access_token = new AccessToken(access_token_response);
        fb = new FacebookFactory().getInstance(access_token);    
        
    }

}

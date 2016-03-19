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
public interface GameClient {
    
    void start();    
    
    void stop();
    
    boolean addSession(Session session);
    
    boolean addSocailNetwork(SocialNetwork socail_network);

    boolean removeSocailNetwork(SocialNetwork socail_network);
    
    boolean removeSession(Session session);
    
    int sessionCount();
}

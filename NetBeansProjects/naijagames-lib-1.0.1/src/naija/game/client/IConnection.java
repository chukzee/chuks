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
public interface IConnection {
 
    boolean connect(String host_name, int port);
    void disconnect();
}

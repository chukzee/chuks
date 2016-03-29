/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.io.IOException;
import twitter4j.JSONObject;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface IConnection{
   
   void connect();

    void disconnect();

    JSONObject sendRequest(RequestPacket requestPacket);

    public String getHost();

    public int getPort();
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.draft;

import naija.game.client.IConnection;
import naija.game.client.AbstractGameClient;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class DraftGameClient extends AbstractGameClient {
    IConnection conn;
    
    DraftGameClient (IConnection conn){
        this.conn = conn;
    }
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.solitaire;

import naija.game.client.whot.*;
import naija.game.client.scrabble.*;
import naija.game.client.draft.*;
import naija.game.client.IConnection;
import naija.game.client.AbstractGameClient;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class SolitaireGameClient extends AbstractGameClient {
    IConnection conn;
    
    SolitaireGameClient (IConnection conn){
        this.conn = conn;
    }
    
}
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.solitaire;

import naija.game.client.IConnection;
import naija.game.client.AbstractGameClient;
import naija.game.client.GameName;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
class SolitaireGameClient extends AbstractGameClient {
    
    SolitaireGameClient (IConnection conn){
        super(conn);
    }
    
    @Override
    public GameName getGameName() {
        return GameName.solitaire;
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.ludo;

import naija.game.client.draft.*;
import naija.game.client.chess.*;
import naija.game.client.AbstractGameClientFactory;
import naija.game.client.AbstractGameClient;
import naija.game.client.IConnection;

/**
 *
 * @author USER
 */
public class LudoGameClientFactory implements AbstractGameClientFactory{
    private final IConnection conn;

    public LudoGameClientFactory(IConnection conn){
        this.conn = conn;
    }
    
    @Override
    public AbstractGameClient createGameClient() {
        return new LudoGameClient(conn);
    }

}

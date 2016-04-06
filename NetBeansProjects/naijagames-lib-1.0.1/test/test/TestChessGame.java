/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import naija.game.client.FacebookSocialNetwork;
import naija.game.client.TwitterSocialNetwork;
import java.util.Date;
import naija.game.client.BluetoothConnection;
import naija.game.client.Game;
import naija.game.client.AbstractGameClient;
import naija.game.client.GameClient;
import naija.game.client.ClientFactory;
import naija.game.client.GameName;
import naija.game.client.GameSessionImpl;
import naija.game.client.chess.Chess;
import naija.game.client.chess.ChessBoardListener;
import naija.game.client.chess.ChessGameClientFactory;
import naija.game.client.chess.ChessSpectator;
import naija.game.client.IConnection;
import naija.game.client.LocalUser;
import naija.game.client.RemoteUser;
import naija.game.client.Score;
import naija.game.client.GameSession;
import naija.game.client.Spectator;
import naija.game.client.WebConnection;
import naija.game.client.chess.board.ChessBoardPosition;
/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class TestChessGame {
    

    public static void main(String[] args){
            
            //internet connection
            WebConnection webCon = new WebConnection("localhost", 88);//using internet connection   
            webCon.useProxy(true);
            webCon.proxyHost("127.0.0.1");
            webCon.proxyPort(8080);
            ChessGameClientFactory  cfac= new ChessGameClientFactory(webCon);//factory for implementing chess game clients
            GameClient gclient = ClientFactory.createGameClient(cfac);            
            //add social networks
            String token= "y4j2GE3E33GS4s3k";//acces token value
            long exipry = 284028402944924L;//access token expiry time
            gclient.addSocailNetwork(new FacebookSocialNetwork(token, exipry));
            
            token= "y4j2GE3E33GS4s3k";//acces token value
            String secret = "the access token secret";//access token secret
            long userDd = 48577778939L;//the authenitcating user id
            gclient.addSocailNetwork(new TwitterSocialNetwork(token, secret, userDd));
            gclient.start();//start the game client - client connects and starts internal processing
            
            //bluetooth connection
            BluetoothConnection blCon = new BluetoothConnection("the bluetooth localhost", 000000);//using bluetooth connection  
            ChessGameClientFactory  cfac1= new ChessGameClientFactory(blCon);//factory for implementing chess game clients
            GameClient gclient1 = ClientFactory.createGameClient(cfac1);
            gclient1.start();//start the game client - client connects and starts internal processing
            
            //to add session for each chess game - for example we will add two sessions below
            
            //first create the session
            int session_id1 =1;//unique session id
            Date session_start_time1 = null;
            Date session_end_time1 = null;
            GameSession session1 = null; // see GameSessionImpl(...) construction

            Game game2 = null;//see example of how to build the chess game in the case of game1 above
            int session_id2 =2;//unique session id
            Date session_start_time2 = null;
            Date session_end_time2 = null;
            GameSession session2 = null; // see GameSessionImpl(...) construction
            
            //next build the game with the session id pass to is.
            ChessBoardListener listener = null;
            Game game1 = new Chess.ChessBuilder(session1.getSessionID(), listener)
                                .boardPosition(new ChessBoardPosition())
                                .blackPlayer(new LocalUser())
                                .whitePlayer(new RemoteUser())                  
                                .score(new Score(0f,1f))
                                .timeControl(null)
                                .build();//building the chess game
            
            
            //adding the sessions to the game client
            gclient.addSession(session1);
            gclient.addSession(session2);          
            
            //to add spectators to a session
            Spectator spectator1 = new ChessSpectator();
            Spectator spectator2 = new ChessSpectator();
            Spectator spectator3 = new ChessSpectator();
            session1.addSpectator(spectator1);
            session1.addSpectator(spectator2);
            session1.addSpectator(spectator3);
            
            //to remove a session
            gclient.removeSession(session2);
            
    }
    
}

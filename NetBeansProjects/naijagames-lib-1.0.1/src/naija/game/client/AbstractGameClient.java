/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


/**
 *
 * @author USER
 */
public abstract class AbstractGameClient implements GameClient{
    
    List<Session> sessionList = Collections.synchronizedList(new ArrayList<Session>());
    List<SocialNetwork> socalNetworkList = Collections.synchronizedList(new ArrayList<SocialNetwork>());
    GameClientHandler handler = new GameClientHandler();
    Thread clientThread;
    private boolean isRunning;
    
    @Override
    public void start(){
        if(clientThread==null){
            clientThread = new Thread(handler);
            clientThread.start();
            isRunning = true;
        }
    }
    
    @Override
    public void stop(){
        isRunning = false;
    }
    
    @Override
    public boolean addSocailNetwork(SocialNetwork socail_network) {
        return socalNetworkList.add(socail_network);
    }
    
    @Override
    public boolean removeSocailNetwork(SocialNetwork socail_network) {
        return socalNetworkList.remove(socail_network);
    }
             
    @Override
    public boolean addSession(Session session){
        return sessionList.add(session);
    }
    
    @Override
    public boolean removeSession(Session session){
        return sessionList.remove(session);
    }
    
    @Override
    public int sessionCount(){
        return sessionList.size();
    }
    
    class GameClientHandler implements Runnable{

        @Override
        public void run() {
            
            while(isRunning){
                //do the various task here
                
                
                //handle session
                handleSessiions();
                handleSocailNetwork();
            }
            
        }

        private void handleSessiions() {
            
        }

        private void handleSocailNetwork() {

        }
        
    }
    
}

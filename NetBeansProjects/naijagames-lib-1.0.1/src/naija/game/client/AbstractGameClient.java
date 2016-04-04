/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.io.DataInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import twitter4j.JSONException;
import twitter4j.JSONObject;

/**
 *
 * @author USER
 */
public abstract class AbstractGameClient implements GameClient {

    List<Session> sessionList = Collections.synchronizedList(new LinkedList<Session>());
    List<SocialNetwork> socalNetworkList = Collections.synchronizedList(new LinkedList<SocialNetwork>());
    List<RequestPacket> requestPackList = Collections.synchronizedList(new LinkedList<RequestPacket>());
    GameClientHandler handler = new GameClientHandler();
    Thread clientThread;
    protected boolean isRunning;
    protected IConnection conn;

    public AbstractGameClient(IConnection conn) {
        this.conn = conn;
    }

    @Override
    final public void start() {
        if (clientThread == null) {
            clientThread = new Thread(handler);
            clientThread.start();
            isRunning = true;
        }
    }

    @Override
    final public void stop() {
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
    public boolean addSession(Session session) {
        return sessionList.add(session);
    }

    @Override
    public boolean removeSession(Session session) {
        return sessionList.remove(session);
    }

    @Override
    public int sessionCount() {
        return sessionList.size();
    }

    class GameClientHandler implements Runnable {

        @Override
        public void run() {



            while (isRunning) {
                //do the various task here
                sendRequest();
                receiveResponse();

                //handle session
                handleSessiions();
                handleSocailNetwork();
            }

        }

        private void handleSessiions() {
        }

        private void handleSocailNetwork() {
        }

        private boolean sendRequest() {
            RequestPacket requestPack = requestPackList.remove(requestPackList.size() - 1);
            return conn.sendRequest(requestPack);
        }

        private JSONObject receiveResponse() {
            return conn.receiveResponse();
        }
    }
}

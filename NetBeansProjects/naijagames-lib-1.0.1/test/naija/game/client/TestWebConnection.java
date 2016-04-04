/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import org.apache.http.util.ByteArrayBuffer;

/**
 *
 * @author USER
 */
public class TestWebConnection {

    public static void main(String[] args) throws InterruptedException {
        WebConnection webCon = new WebConnection("localhost", 80);//using internet connection   
        webCon.DEFAULT_REMOTE_PATH = "dist/test/TestWebGame";
        //webCon.useProxy(true);
        webCon.proxyHost("127.0.0.1");
        webCon.proxyPort(8080);
        ByteArrayBuffer b;
        for(int i=0; i<1; i++){
            RequestPacket rp = new RequestPacket("dist/test/TestWebGame");
            rp.addCommand("game_test_name", "game_test_value");
            webCon.sendRequest(rp);
        }
        
        Thread.sleep(1000000);
    }
}

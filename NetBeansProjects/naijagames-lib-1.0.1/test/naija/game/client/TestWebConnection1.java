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
public class TestWebConnection1 {

    public static void main(String[] args) throws InterruptedException {
        WebConnection webCon1 = new WebConnection("localhost", 80);//using internet connection   
        webCon1.DEFAULT_REMOTE_PATH = "dist/test/TestWebGame";
        //webCon.useProxy(true);
        webCon1.proxyHost("127.0.0.1");
        webCon1.proxyPort(8080);
        ByteArrayBuffer b;
        int num = 10;
        for (int i = 0; i < num; i++) {
            RequestPacket rp = new RequestPacket("dist/test/TestWebGame");
            rp.addCommand("game_test_name", "game_test_value");
            webCon1.sendRequest(rp);
        }

        Thread.sleep(300000);
    }
}

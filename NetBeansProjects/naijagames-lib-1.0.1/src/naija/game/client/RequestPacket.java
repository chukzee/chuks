/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author USER
 */
public class RequestPacket {

    List<NameValue>  nameValuelist = new LinkedList();
    private String remotePath = "";

    public RequestPacket(String remotePath) {
        this.remotePath = remotePath;
    }

    public void addCommand(String name, String value) {
        nameValuelist.add(new NameValue(name, value));
    }

    public List<NameValue>  getCommandList() {
        return nameValuelist;
    }

    public String getPath(){
        return remotePath;
    }

    
}

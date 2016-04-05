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

    private List<NameValue>  nameValuelist = new LinkedList();
    private String remotePath = "";
    private String name;

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

    /**
     * Get the accesible name of this request packet
     * @return 
     */
    public String getName(){
        return name;
    }

    /**
     * Set the accesible name of this request packet.
     * @return 
     */
    public void setName(String name){
        this.name = name;
    }
        
}

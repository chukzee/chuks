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

    private List<NameValue> nameValuelist = new LinkedList();
    private String remotePath = "";
    private String name;
    private String host;
    private int port = -1;

    /**
     * Use this constructor to specify the host and port to send the packet
     *
     * @param remote_host the remote port
     * @param remote_port the remote port
     * @param remotePath the remote path name
     */
    public RequestPacket(String remote_host, int remote_port, String remotePath) {
        this.host = remote_host;
        this.port = remote_port;
        this.remotePath = remotePath;
    }

    /**
     *
     * Use this constructor to specify the remote address to send the packet.
     * The http default port will be used if not specified in the address.
     *
     * @param remoteAddr the remote address - uses default http port if not specify in the address
     * @param remotePath the remote path name
     */
    public RequestPacket(String remoteAddr, String remotePath) {
        String[] addr_split = remoteAddr.split(":");
        host = addr_split[0].trim();
        if(addr_split.length>1){
            port = Integer.parseInt(addr_split[1].trim());
        }else{
            port = 80;//default
        }
        this.remotePath = remotePath;
    }

    /**
     * Use this constructor when the host and port to send the packet to should
     * be determined by the {@link naija.game.client.GameClient}.
     *
     * @param remotePath the remote path name
     */
    public RequestPacket(String remotePath) {
        this.remotePath = remotePath;
    }

    public void addCommand(String name, String value) {
        nameValuelist.add(new NameValue(name, value));
    }

    public List<NameValue> getCommandList() {
        return nameValuelist;
    }

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }

    public String getPath() {
        return remotePath;
    }

    /**
     * Get the accesible name of this request packet
     *
     * @return
     */
    public String getName() {
        return name;
    }

    /**
     * Set the accesible name of this request packet.
     *
     * @return
     */
    public void setName(String name) {
        this.name = name;
    }
}

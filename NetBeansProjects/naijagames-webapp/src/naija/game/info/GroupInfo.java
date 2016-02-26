/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.info;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author USER
 */
public class GroupInfo  implements Serializable{
    private String groupName;
    private Set<String> groupMembersUsernames = new HashSet();

    private GroupInfo(){}
    
    public GroupInfo(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupName() {
        return groupName;
    }

    public Set getGroupMembers() {
        return groupMembersUsernames;
    }

    public void setGroupMembers(Set groupMembersUsernames) {
        this.groupMembersUsernames = groupMembersUsernames;
    }

    public void addMember(String username){
        groupMembersUsernames.add(username);
    }

    public void removeMember(String username){
        groupMembersUsernames.remove(username);
    }
        
}

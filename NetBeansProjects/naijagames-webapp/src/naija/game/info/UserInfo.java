/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.info;

import java.io.Serializable;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author USER
 */
public class UserInfo  implements Serializable{

    private String username;
    private String first_name;
    private String last_name;
    //storing the password in char array is safer and even faster than in byte array when converting back and forth to string.
    private char[] password;//required to speedy authentication where database may not need to be contacted if this UserInfo object is already in memory cache
    private String sex;
    private String age;
    private String phone_no;
    private String address;
    private String[] friends_username;
    private final Set<FriendRequest> friend_requests = Collections.synchronizedSet(new HashSet());    

    public void addFriendRequest(String friend_username, long time_of_request){
        friend_requests.add(new FriendRequest(friend_username, time_of_request));
    }

    public void removeFriendRequest(String friend_username){
        Object[] fr_obj = friend_requests.toArray();
        for (Object obj : fr_obj) {
            FriendRequest fr = (FriendRequest) obj;
            if (fr.getUsername().equals(friend_username)) {
                 friend_requests.remove(fr);
            }
        }
    }
        
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(char[] password) {
        this.password = password;
    }

    public String getFirstName() {
        return first_name;
    }

    public String getLastName() {
        return last_name;
    }

    public void setFirstName(String first_name) {
        this.first_name = first_name;
    }

    public void setLastName(String last_name) {
        this.last_name = last_name;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public void setPhoneNo(String phone_no) {
        this.phone_no = phone_no;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setFriendsUsername(String[] friends_username) {
        this.friends_username = friends_username;
    }

    public String getUsername() {
        return this.username;
    }

    public char[] getPassword() {
        return this.password;
    }

    public String getSex() {
        return this.sex;
    }

    public String getAge() {
        return this.age;
    }

    public String getPhoneNo() {
        return this.phone_no;
    }

    public String getAddress() {
        return this.address;
    }

    public String[] getFriendsUsername() {
        return this.friends_username;
    }

    /**
     *
     * @return
     */
    public Set<FriendRequest> getFriendRequests() {
        return this.friend_requests;
    }

}

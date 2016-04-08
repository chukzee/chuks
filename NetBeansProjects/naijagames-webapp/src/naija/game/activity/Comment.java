/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.activity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import naija.game.IComment;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public class Comment implements IComment {

    private long comment_sn;
    private String msg;
    private String username;
    private String first_name;
    private String last_name;
    private String img_url;
    private int likes;
    private int dislikes;
    private String formatedTime;
    private List<IComment> replys = Collections.synchronizedList(new ArrayList());
    
    @Override
    public void setCommentSerialNo(long sn) {
        comment_sn = sn;
    }
    
    @Override
    public long getCommentSerialNo() {
        return comment_sn;
    }

    @Override
    public void setMessage(String msg) {
        this.msg = msg;
    }

    @Override
    public String getMessage() {
        return msg;
    }

    @Override
    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public void setFirstName(String first_name) {
        this.first_name = first_name;
    }

    @Override
    public String getFirstName() {
        return first_name;
    }

    @Override
    public void setLastName(String last_name) {
        this.last_name = last_name;
    }

    @Override
    public String getLastName() {
        return last_name;
    }

    @Override
    public void setUserImageUrl(String img_url) {
        this.img_url = img_url;
    }

    @Override
    public String getUserImageUrl() {
        return img_url;
    }

    @Override
    public int getLikes() {
        return this.likes;
    }

    @Override
    public int getDislikes() {
        return dislikes;
    }

    @Override
    public int incrementLikes() {
        return ++likes;
    }

    @Override
    public int incrementDislikes() {
        return ++dislikes;
    }

    @Override
    public int decrementLikes() {
        return --likes;
    }

    @Override
    public int decrementDislikes() {
        return --dislikes;
    }

    @Override
    public void setCommentTime(String formatedTime) {
        this.formatedTime = formatedTime;
    }

    @Override
    public String getCommentTime() {
        return formatedTime;
    }

    @Override
    public void addReply(IComment comment) {
        replys.add(comment);
    }

    @Override
    public List<IComment> getReplys() {
        return replys;
    }

}

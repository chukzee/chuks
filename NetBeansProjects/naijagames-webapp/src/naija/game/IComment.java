/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game;

/**
 *
 * @author Chuks Alimele<chuksalimele at yahoo.com>
 */
public interface IComment {

    void setCommentSerialNo(long sn);

    long getCommentSerialNo();

    void setReplySerialNo(long sn);

    long getReplySerialNo();
    
    boolean isReply();
    
    void setMessage(String msg);

    String getMessage();

    void setUsername(String username);

    String getUsername();

    void setFirstName(String first_name);

    String getFirstName();

    void setLastName(String last_name);

    String getLastName();

    void setUserImageUrl(String img_url);

    String getUserImageUrl();

    int getLikes();

    int getDislikes();

    int incrementLikes();

    int incrementDislikes();

    int decrementLikes();

    int decrementDislikes();
    
    void setCommentTime(String formatedTime);
    
    String getCommentTime();
    
}

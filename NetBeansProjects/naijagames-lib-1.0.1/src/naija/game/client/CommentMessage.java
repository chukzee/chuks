/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client;

import java.util.Date;

/**
 *
 * @author USER
 */
public class CommentMessage extends ChatMessage {

    private int likes;
    private int dislikes;
    private CommentMessage[] replies;
    private final int replies_count;
    private String message_id_replied; // id of the message replied

    public CommentMessage(User from_user, String message_id, String message, Date message_time, String subject_icon_url, CommentMessage[] replies, int replies_count, int likes, int dislikes) {
        super(from_user, null, message_id, message, message_time, subject_icon_url);
        this.likes = likes;
        this.dislikes = dislikes;
        this.replies = replies;
        this.replies_count = replies_count;
    }

    public CommentMessage(User from_user, String message_id, String message_id_replied, String message, Date message_time, String subject_icon_url, CommentMessage[] replies, int replies_count, int likes, int dislikes) {
        super(from_user, null, message_id, message, message_time, subject_icon_url);
        this.likes = likes;
        this.dislikes = dislikes;
        this.replies = replies;
        this.replies_count = replies_count;
        this.message_id_replied = message_id_replied;
    }
    
    /**
     * Gets the number of likes for this comment
     *
     * @return
     */
    public int getLikes() {
        return likes;
    }

    /**
     * Gets the number of dislikes for this comment
     *
     * @return
     */
    public int getDisLikes() {
        return dislikes;
    }

    /**
     * Gets the number of likes for this comment
     *
     * @return
     */
    public CommentMessage[] getReplies() {
        return replies;
    }

    /**
     * Gets the the id of the message that is replied.
     * @return 
     */
    public String getMessageIDReplied(){
        return message_id_replied;
    }
    
    /**
     * Gets the total number of replies for this comment as recorded in the
     * server. NOTE: The total number of the replies is not necessary the number
     * replies retrived from the server since they may arrive in batches.
     *
     * @return
     */
    public int countReplies() {
        return replies_count;
    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

import naija.game.client.CommentMessage;

/**
 *
 * @author USER
 */
public class CommentEvent {
        
    protected CommentMessage commentMessage;
    protected boolean commentReply;
    protected boolean commentHistory;
    protected boolean commentEdited;
    protected boolean commentBegins;
    protected boolean commentEnds;
    protected boolean commentSent;
    protected int commentLikes;
    protected int commentDislikes;
    protected String commentDislikedMessageID;
    protected String commentLikedMessageID;
    protected boolean isLikedReply;
    protected boolean isDislikedReply;
    
    public CommentMessage getCommentMessage() {
        return commentMessage;
    }

    public boolean isCommentReply() {
        return commentReply;
    }

    public boolean isCommentHistory() {
        return commentHistory;
    }

    public boolean isCommentEdited() {
        return commentEdited;
    }

    public boolean isCommentBegins() {
        return commentBegins;
    }

    public boolean isCommentEnds() {
        return commentEnds;
    }

    public boolean isCommentSent() {
        return commentSent;
    }

    public int getCommentLikes() {
        return commentLikes;
    }

    public int getCommentDislikes() {
        return commentDislikes;
    }

    public String getCommentDislikedMessageID() {
        return commentDislikedMessageID;
    }

    public String getCommentLikedMessageID() {
        return commentLikedMessageID;
    }

    public boolean isLikedReply() {
        return isLikedReply;
    }

    public boolean isDislikedReply() {
        return isDislikedReply;
    }


}

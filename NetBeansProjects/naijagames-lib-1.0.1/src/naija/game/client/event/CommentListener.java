/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package naija.game.client.event;

/**
 *
 * @author USER
 */
public interface CommentListener {

    /**
     * Fires when a comment message arrives from the server.
     *
     * @param event
     */
    void onCommentMesage(CommentEvent event);

    /**
     * Fires when a comment reply arrives from the server.
     *
     * NOTE: Comment replies are not treated as comment messages for the purpose
     * of creating a distinction.
     *
     * @param event
     */
    void onCommentReply(CommentEvent event);

    /**
     * Fires when a comment message is sent to the server.
     *
     * @param event
     */
    void onCommentSent(CommentEvent event);

    /**
     * Fires when a comment message is edited. Comments are usually edited by
     * users who detect grammatical or spelling errors.
     *
     * @param event
     */
    void onCommentEdited(CommentEvent event);

    /**
     * Fires when a collection of comment messages is received from the server.
     * Useful for populating a comment view.
     *
     * @param event
     */
    void onCommentHistory(CommentEvent event);
    
    /**
     * Fires when a comment is liked.
     *
     * @param event
     */
    void onCommentLiked(CommentEvent event);
    
    /**
     * Fires when a comment is disliked.
     *
     * @param event
     */
    void onCommentDisliked(CommentEvent event);
}

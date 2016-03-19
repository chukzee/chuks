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
public interface CommentListener {
      
    void onComment(CommentMessage comment);
}

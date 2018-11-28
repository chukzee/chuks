
/* global Main */

Ns.msg.GameComment = {

    extend: 'Ns.msg.AbstractComment',
    match: null,
    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        var obj = {
            comment: 'game/Comment'
                    //more may go below
        };

        Main.rcall.live(obj);

        Main.eventio.on('comment', this.onComment);

    },
    
    /**
     * Override this method - called by super class
     * @param {type} match
     * @returns {undefined}
     */
    initContent:function(match){
        this.match = match;
    },
    
    getViewID: function(){
        return 'TODO';
    },
    
    getViewBodyID: function(){
        return 'TODO';        
    },

    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetComments: function(){    
        Main.ro.getGameComments(this.match.game_id);
    }, 
      
    /**
     * Send the comment message
     * Must override this method and return the promise of the rcall<br>
     * <br>
     * example: <br>
     *     rcallSendMessage: function(content){<br>
     *            return Main.ro.sendGameComment(user_id, contact_user_id, content, content_type); // return the promise of the rcall<br>
     *      }<br>
     * <br>
     * @returns {undefined}
     */
    rcallSendMessage: function(content){
        var user_id = Ns.view.UserProfile.appUser.user_id;
        var msg_replied_id; // TODO
        return Main.ro.sendGameComment(user_id, this.match.game_id, content, 'text', msg_replied_id);
    },        
    onComment: function(obj){
        this.add(obj.data);
    }

};



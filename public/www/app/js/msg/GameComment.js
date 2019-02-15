
/* global Main, Ns */

Ns.msg.GameComment = {

    extend: 'Ns.msg.AbstractComment',
    match: null,
    view_id: null,
    view_body_id: null,
    view_header_id: null,
    search_button_id: null,
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

        Main.eventio.on('comment', this.onComment.bind(this));

    },

    getCode:function(){
        return 'game_comment' + Ns.Util.DELIMITER + this.match.game_id;
    },
  
    getMsgCode: function(msg){
        return msg._code;
    },

    setMsgCode: function(msg){    
        msg._code = this.getCode();
    },
        
    getSaveKeyPrefix: function () {
        return 'save_msg_game_comment';
    },
    
    /**
     * Override this method - called by super class
     * @param {type} match
     * @returns {undefined}
     */
    initContent:function(match, id_obj){
        this.match = match;
        this.view_id = id_obj.view_id;
        this.view_body_id = id_obj.view_body_id;
        this.view_header_id = id_obj.view_header_id;
        this.search_button_id = id_obj.search_button_id;
    },
    
    getViewID: function(){
        return this.view_id;
    },

    getViewHeaderID: function(){
        return this.view_header_id;
    },
        
    getViewBodyID: function(){
        return this.view_body_id;        
    },

    getSearchButtonID: function(){
        return this.search_button_id;        
    },
    
    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetMessages: function(bindFn){    
        var user_id = Ns.view.UserProfile.appUser.user_id;
       return Main.ro.comment.getGameComments(user_id, this.match.game_id, bindFn);
    }, 
      
    /**
     * Send the comment message
     * Must override this method and return the promise of the rcall<br>
     * <br>
     * example: <br>
     *     rcallSendMessage: function(content){<br>
     *            return Main.ro.comment.sendGameComment(user_id, contact_user_id, content, content_type); // return the promise of the rcall<br>
     *      }<br>
     * <br>
     * @returns {undefined}
     */
    rcallSendMessage: function(content, msg_replied_id, bindFn){
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.comment.sendGameComment(user_id, this.match.game_id, content, 'text', msg_replied_id, bindFn);
    },        
    
    onComment: function(evtObj){
        this.add(evtObj.data);
    }

};



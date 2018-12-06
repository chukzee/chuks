
/* global Main */

Ns.msg.GroupChat = {

    extend: 'Ns.msg.AbstractChat',
    group: null,
    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        var obj = {
            chat: 'game/Chat',
            //more may go below
        };

        Main.rcall.live(obj);

        Main.eventio.on('group_chat', this.onChat);

    },

    
    /**
     * Override this method - called by super class
     * @param {type} group
     * @returns {undefined}
     */
    initContent:function(group){
        this.group = group;
    },
    getViewID: function(){
        return 'group-chat-view';
    },
    
    getViewBodyID: function(){
        return 'group-chat-view-body';        
    },
    
    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetMessages: function(){    
        Main.ro.getGroupChats(this.group.name);
    }, 
        /**
     * Send the chat message
     * Must override this method and return the promise of the rcall<br>
     * <br>
     * example: <br>
     *     rcallSendMessage: function(content){<br>
     *            return Main.ro.sendContactChat(user_id, contact_user_id, content, content_type); // return the promise of the rcall<br>
     *      }<br>
     * <br>
     * @returns {undefined}
     */
    rcallSendMessage: function(content){
        
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.sendGroupChat(user_id, this.group.name, content, 'text');
    },
    onChat: function(obj){
        this.add(obj.data);
    },

  

};



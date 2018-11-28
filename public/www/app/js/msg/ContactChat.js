
Ns.msg.ContactChat = {

    extend: 'Ns.msg.AbstractChat',
    
    contact: null,
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

        Main.eventio.on('contact_chat', this.onChat);

    },
    /**
     * Override this method - called by super class
     * @param {type} contact
     * @returns {undefined}
     */
    initContent:function(contact){
        this.contact = contact;
    },
    getViewID: function(){
        return 'contact-chat-view';
    },
    
    getViewBodyID: function(){
        return 'contact-chat-view-body';        
    },
    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetChats: function(){    
        var user_id = Ns.view.UserProfile.appUser.user_id;
        Main.ro.getContactChats(user_id, this.contact.user_id);
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
        
        return Main.ro.sendContactChat(user_id, this.contact.user_id, content, 'text');
    },
    onChat: function(obj){
        this.add(obj.data);
    },

  

};



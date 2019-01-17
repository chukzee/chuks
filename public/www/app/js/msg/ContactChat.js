
/* global Main, Ns */

Ns.msg.ContactChat = {

    extend: 'Ns.msg.AbstractPeerToPeerChat',

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

        Main.eventio.on('contact_chat', this.onChat.bind(this));
        Main.eventio.on('chat_msg_status', this.onChatMsgStatus.bind(this));

    },
    
    getName:function(){
        return 'Ns.msg.ContactChat';
    },
    
    getCode:function(){
        if(Main.util.isString(this.contact)){
            return this.contact;
        }
        return this.contact.user_id;  
    },

    getExtraCode:function(){
        return;
    },
    
    getMsgCode: function(msg){
        return msg.contact_user_id;
    },
    
    getSaveKeyPrefix() {
        return 'save_msg_contact_chat';
    },

    /**
     * Override this method - called by super class
     * @param {type} contact
     * @returns {undefined}
     */
    initContent: function (contact) {
        this.contact = contact;

        document.getElementById('contact-chat-view-photo').src = contact.photo_url;
        document.getElementById('contact-chat-view-full-name').innerHTML = contact.full_name;
    },
    getViewID: function () {
        return 'contact-chat-view';
    },

    getViewHeaderID: function () {
        return "contact-chat-view-header";
    },

    getViewBodyID: function () {
        return 'contact-chat-view-body';
    },

    getSearchButtonID: function () {
        return 'contact-chat-view-search';
    },

    getMenuButtonID: function () {
        return 'contact-chat-view-menu';
    },

    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetMessages: function () {
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.chat.getContactChats(user_id, this.contact.user_id);
    },
    /**
     * Send the chat message
     * Must override this method and return the promise of the rcall<br>
     * <br>
     * example: <br>
     *     rcallSendMessage: function(content){<br>
     *            return Main.ro.chat.sendContactChat(user_id, contact_user_id, content, content_type); // return the promise of the rcall<br>
     *      }<br>
     * <br>
     * @returns {undefined}
     */
    rcallSendMessage: function (content, bindFn) {
        var user_id = Ns.view.UserProfile.appUser.user_id;

        return Main.ro.chat.sendContactChat(user_id, this.contact.user_id, content, 'text', bindFn);
    },

};



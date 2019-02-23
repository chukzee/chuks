
/* global Main, Ns */

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

        Main.eventio.on('group_chat', this.onChat.bind(this));

    },

    getCode: function () {
        /*if(Main.util.isString(this.group)){
         return this.group;
         }
         return this.group.group_name;*/
        var grp_name;
        if (Main.util.isString(this.group)) {
            grp_name = this.group;
        } else {
            grp_name = this.group.group_name;
        }
        return 'group' + Ns.Util.DELIMITER + grp_name;
    },

    getMsgCode: function (msg) {
        return msg._code;
    },

    setMsgCode: function (msg) {
        msg._code = this.getCode();
    },

    getSaveKeyPrefix: function () {
        return 'save_msg_group_chat';
    },

    /**
     * Override this method - called by super class
     * @param {type} group
     * @returns {undefined}
     */
    initContent: function (group) {
        this.group = group;
        document.getElementById('group-chat-view-photo').src = group.small_photo_url;
        document.getElementById('group-chat-view-name').innerHTML = group.name;
        document.getElementById('group-chat-view-status').innerHTML = group.status_message;
    },
    getViewID: function () {
        return 'group-chat-view';
    },

    getViewHeaderID: function () {
        return "group-chat-view-header";
    },

    getViewBodyID: function () {
        return 'group-chat-view-body';
    },

    getSearchButtonID: function () {
        return 'group-chat-view-search';
    },

    getMenuButtonID: function () {
        return 'group-chat-view-menu';
    },

    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetMessages: function (bindFn) {
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.chat.getGroupChats(user_id, this.group.name, bindFn);
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
    rcallSendMessage: function (content, msg_replied_id, bindFn) {

        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.chat.sendGroupChat(user_id, this.group.name, content, 'text', msg_replied_id, bindFn);
    },
          
    onChat: function (evtObj) {
        this.add(evtObj.data);
    },

};



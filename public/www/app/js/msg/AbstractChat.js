

/* global Ns, Main */

Ns.msg.AbstractChat = {

    extend: 'Ns.msg.AbstractMessage',
 
    /**
     * must override this method and return the promise of the rcall<br>
     * @param {type} chats
     * @returns {undefined}
     */
    rcallDeleteMessages: function(chats){    
        var msg_ids = [];
        for(var i=0; i<chats.length; i++){
            msg_ids.push(chats[i].msg_id);
        }
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.chat.deleteFor(user_id, msg_ids);
    },
    
    getMsgType: function () {
        return 'chat';
    },

    getMsgSelectionClassName: function () {
        return 'game9ja-chat-selected';
    },

    getMsgSentClassName: function () {
        return 'game9ja-chat-sent';
    },

    getMsgReceivedClassName: function () {
        return 'game9ja-chat-received';
    },

    getNotSentIndicatorClassName: function () {
        return 'game9ja-not-sent';
    },

    getSentIndicatorClassName: function () {
        return 'game9ja-sent';
    },

    getDeliveredIndicatorClassName: function () {
        return 'game9ja-delivered';
    },

    getSeenIndicatorClassName: function () {
        return 'game9ja-seen';
    },

    getMsgBodySelector: function () {
        return 'div[data-chat="body"]';
    },

    getMsgInputSelector: function () {
        return 'textarea[data-chat="input-msg"]';
    },

    getMsgSendBottonSelector: function () {
        return 'i[data-chat="send"]';
    },

    getMsgEmojisBottonSelector: function () {
        return 'div[data-chat="emoji"]';
    },

    getMsgRepliedFullNameSelector: function () {
        return 'span[data-chat="replied-full-name"]';
    },

    getMsgRepliedMessageSelector: function () {
        return 'div[data-chat="replied-message"]';
    },

    getMsgEmojiListSelector: function () {
        return 'div[data-chat="emoji-list"]';
    },

    getMsgEmojiTabOneSelector: function () {
        return 'span[data-chat="emoji-tab-1"]';
    },

    getMsgEmojiTabTwoSelector: function () {
        return 'span[data-chat="emoji-tab-2"]';
    },

    getMsgEmojiTabThreeSelector: function () {
        return 'span[data-chat="emoji-tab-3"]';
    },

    getMsgStatusIndicatorSelector: function () {
        return 'span[data-chat-sent="indicator"]';
    },
    
    getMsgSentTimeSelector: function () {
        return 'div[data-chat-sent="time"]';
    },    

    getMsgReceivedTimeSelector: function () {
        return 'div[data-chat-received="time"]';
    },    
    
    getMainTpl: function () {
        return 'chat-tpl.html';
    },

    getMsgReceivedTpl: function () {
        return 'chat-received-tpl.html';
    },

    getMsgSentTpl: function () {
        return 'chat-sent-tpl.html';
    },
    getResponseMsgs: function (response) {
        return response.chats;
    },
    getResponseRepliedMsgs: function (response) {
        return response.replied_chats;
    },
    /**
     * @param {type} tpl_var
     * @param {type} data
     * @returns {undefined}
     */
    onPrepareSentMsgTpl: function (tpl_var, data) {
    },

    /**
     * @param {type} el_item_added
     * @param {type} data
     * @returns {undefined}
     */
    onFinishPrepareSentMsgTpl: function (el_item_added, data) {
    },

    /**
     * @param {type} tpl_var
     * @param {type} data
     * @returns {undefined}
     */
    onPrepareReceivedMsgTpl: function (tpl_var, data) {
    },

    /**
     * @param {type} el_item_added
     * @param {type} data
     * @returns {undefined}
     */
    onFinishPrepareReceivedMsgTpl: function (el_item_added, data) {
    },

};



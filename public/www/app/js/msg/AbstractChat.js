

/* global Ns, Main */

Ns.msg.AbstractChat = {

    extend: 'Ns.msg.AbstractMessage',

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

    getMsgStatusIndicatorSelector: function () {
        return 'span[data-chat-sent="indicator"]';
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
    /**
     * @param {type} tpl_var
     * @param {type} data
     * @returns {undefined}
     */
    onPrepareSentMsgTpl: function (tpl_var, data) {
    },

    /**
     * @param {type} html
     * @param {type} data
     * @returns {undefined}
     */
    onFinishPrepareSentMsgTpl: function (html, data) {
    },

    /**
     * @param {type} tpl_var
     * @param {type} data
     * @returns {undefined}
     */
    onPrepareReceivedMsgTpl: function (tpl_var, data) {
    },

    /**
     * @param {type} html
     * @param {type} data
     * @returns {undefined}
     */
    onFinishPrepareReceivedMsgTpl: function (html, data) {
    },

};



/* global Ns, Main */

Ns.msg.AbstractComment = {

    extend: 'Ns.msg.AbstractMessage',

    getMsgType: function () {
        return 'comment';
    },

    getMsgSelectionClassName: function () {
        return 'game9ja-comment-selected';
    },

    getMsgSentClassName: function () {
        return 'game9ja-comment-item';//same as received
    },

    getMsgReceivedClassName: function () {
        return 'game9ja-comment-item';//same as sent
    },

    getNotSentIndicatorClassName: function () {
        return 'comment-not-sent';
    },

    getSentIndicatorClassName: function () {
        return 'comment-sent';
    },

    getDeliveredIndicatorClassName: function () {
        return '';
    },

    getSeenIndicatorClassName: function () {
        return '';
    },

    getMsgBodySelector: function () {
        return 'div[data-comment="body"]';
    },

    getMsgInputSelector: function () {
        return 'textarea[data-comment="input-msg"]';
    },

    getMsgSendBottonSelector: function () {
        return 'i[data-comment="send"]';
    },

    getMsgEmojisBottonSelector: function () {
        return 'div[data-comment="emoji"]';
    },

    getMsgStatusIndicatorSelector: function () {
        return 'span[data-comment-sent="indicator"]';
    },
    
    getMainTpl: function(){
      return 'commnet-tpl.html';  
    },

    getMsgReceivedTpl: function () {
        return 'comment-item-tpl.html';//same as sent tpl
    },

    getMsgSentTpl: function () {
        return 'comment-item-tpl.html';//same as received tpl
    },

    getResponseMsgs: function (response) {
        return response.comments;
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

    createCommentListeners: function (html) {

        var btn_reply = $(html).find(me.getMsgSendBottonSelector())[0];
        var btn_like = $(html).find(me.getMsgInputSelector())[0];
        var btn_dislike = $(html).find(me.getMsgEmojisBottonSelector())[0];
        //var sent_indicator = $(html).find('')[0];

        
        Main.click(btn_reply, {}, this.replyComment);
        Main.click(btn_like, {}, this.likeComment);
        Main.click(btn_dislike, {}, this.dislikeComment);
    }

};
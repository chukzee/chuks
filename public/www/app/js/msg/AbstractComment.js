/* global Ns, Main */

Ns.msg.AbstractComment = {

    extend: 'Ns.msg.AbstractMessage',

    /**
     * must override this method and return the promise of the rcall<br>
     * @param {type} comments
     * @returns {undefined}
     */
    rcallDeleteMessages: function (comments) {
        var msg_ids = [];
        for (var i = 0; i < comments.length; i++) {
            msg_ids.push(comments[i].msg_id);
        }
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.comment.deleteFor(user_id, msg_ids);
    },
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

    getMsgRepliedFullNameSelector: function () {
        return 'span[data-comment="replied-full-name"]';
    },

    getMsgRepliedMessageSelector: function () {
        return 'div[data-comment="replied-message"]';
    },

    getMsgEmojiListSelector: function () {
        return 'div[data-comment="emoji-list"]';
    },

    getMsgEmojiTabOneSelector: function () {
        return 'span[data-comment="emoji-tab-1"]';
    },

    getMsgEmojiTabTwoSelector: function () {
        return 'span[data-comment="emoji-tab-2"]';
    },

    getMsgEmojiTabThreeSelector: function () {
        return 'span[data-comment="emoji-tab-3"]';
    },

    getMsgStatusIndicatorSelector: function () {
        return 'span[data-comment-sent="indicator"]';
    },

    getMsgSentTimeSelector: function () {
        return 'div[data-comment-item="time"]';
    },

    getMsgReceivedTimeSelector: function () {
        return 'div[data-comment-item="time"]';
    },

    getMainTpl: function () {
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
    getResponseRepliedMsgs: function (response) {
        return response.replied_comments;
    },
    /**
     * @param {type} tpl_var
     * @param {type} data
     * @returns {undefined}
     */
    onPrepareSentMsgTpl: function (tpl_var, data) {

        if (tpl_var === 'likes') {
            return data.likes_count;
        }

        if (tpl_var === 'dislikes') {
            return data.dislikes_count;
        }

    },

    /**
     * @param {type} el_item_added
     * @param {type} data
     * @returns {undefined}
     */
    onFinishPrepareSentMsgTpl: function (el_item_added, data) {
        this.createCommentListeners(el_item_added, data);
    },

    /**
     * @param {type} tpl_var
     * @param {type} data
     * @returns {undefined}
     */
    onPrepareReceivedMsgTpl: function (tpl_var, data) {

        if (tpl_var === 'likes') {
            return data.likes_count;
        }

        if (tpl_var === 'dislikes') {
            return data.dislikes_count;
        }

    },

    /**
     * @param {type} el_item_added
     * @param {type} data
     * @returns {undefined}
     */
    onFinishPrepareReceivedMsgTpl: function (el_item_added, data) {
        this.createCommentListeners(el_item_added, data);
    },

    createCommentListeners: function (el_item_added, data) {

        var btn_like = $(el_item_added).find('span[data-comment-item="like"]')[0];
        var btn_dislike = $(el_item_added).find('span[data-comment-item="dislike"]')[0];

        Main.click(btn_like, data, this._likeMessage.bind(this));
        Main.click(btn_dislike, data, this._dislikeMessage.bind(this));

        var user_id = Ns.view.UserProfile.appUser.user_id;
        var btn_reply = $(el_item_added).find('span[data-comment-item="reply"]')[0];
        var recieved_message = user_id !== data.user_id;
        if (recieved_message) {//since it is not the user sent message so he reply
            Main.click(btn_reply, data, this._showReplyInput.bind(this));
        } else {
            //use cannot reply his own message so hide the reply button
            btn_reply.style.opacity = 0;
        }

    },

    _likeMessage: function (evt, data) {
        var me = this;
        var user_id = Ns.view.UserProfile.appUser.user_id;
        Main.ro.comment.like(user_id, data.msg_id)
                .get(function (comment) {
                    var replace_el = me.getMsgElement.call(me, comment);
                    me.add.call(me, comment, replace_el);
                })
                .error(function (err, err_code, connect_err) {
                    if (connect_err) {
                        Main.toast.show(err);
                    }
                    console.log(err);
                });
    },

    _dislikeMessage: function (evt, data) {
        var me = this;
        var user_id = Ns.view.UserProfile.appUser.user_id;
        Main.ro.comment.dislike(user_id, data.msg_id)
                .get(function (comment) {
                    var replace_el = me.getMsgElement.call(me, comment);
                    me.add.call(me, comment, replace_el);
                })
                .error(function (err, err_code, connect_err) {
                    if (connect_err) {
                        Main.toast.show(err);
                    }
                    console.log(err);
                });
    },

    _showReplyInput: function (evt, data) {
        this.showReply(evt, data);
    },


};
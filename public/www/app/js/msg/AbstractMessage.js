

/* global Ns, Main */

Ns.msg.AbstractMessage = {
    view: null,
    view_body: null,
    header_id: null,
    msgList: [],
    selectionMode: false,
    DOM_EXTRA_FIELD_PREFIX: '-dom-extra-field',

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgType: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgSelectionClassName: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgSentClassName: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgReceivedClassName: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getNotSentIndicatorClassName: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getSentIndicatorClassName: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getDeliveredIndicatorClassName: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getSeenIndicatorClassName: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgBodySelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgInputSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgSendBottonSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgEmojisBottonSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgStatusIndicatorSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgReceivedTpl: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgSentTpl: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getResponseMsgs: function () {
    },
    _validate: function () {
        if (!this.view_body) {
            throw Error('Invalid setup - ' + this.getMsgType() + ' view body cannot be null. ensure to set view body id.');
        }

        if (!this.view) {
            throw Error('Invalid setup - ' + this.getMsgType() + ' view cannot be null. ensure to set view id.');
        }


        return true;

    },
    content: function (data) {

        var me = this;
        this.initContent(data);
        this.selectionMode = false;

        this.view = document.getElementById(this.getViewID());
        if (!this.view) {
            throw Error('unknown id for ' + this.getMsgType() + ' view - ' + this.getViewID());
        }

        this.view_body = document.getElementById(this.getViewBodyID());
        if (!this.view_body) {
            throw Error('unknown id for ' + this.getMsgType() + ' view body - ' + this.getViewBodyID());
        }

        this.set(this.msgList);

        Main.longpress(this.view_body, this, this._onLongpressToSelect);

        Main.click(this.view_body, this, this._onClickToSelect);

        //TODO: show loading indicator

        Main.rcall.live(function () {

            me.rcallGetMessages(data)
                    .get(function (res) {
                        me.set(me.getResponseMsgs(res));
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });


    },

    _onLongpressToSelect: function (evt, _this) {
        var me = _this;
        if (me.selectionMode) {
            return;
        }
        var target = evt.target;

        if (target.className !== me.getMsgReceivedClassName() &&
                target.className !== me.getMsgSentClassName()) {
            return;
        }


        //show selection header
        Main.card.to({
            container: me.header_id,
            url: 'selection-header.html',
            fade: false,
            data: null,
            onShow: function () {
                me.selectionMode = true;
                if (!$(target).hasClass(me.getMsgSelectionClassName())) {
                    $(target).addClass(me.getMsgSelectionClassName());
                    me._incrementSelectionCount.call(me);
                }
                var back_btn = $('#' + this.header_id).find('i[data-selection-header="back"]')[0];
                var share_btn = $('#' + this.header_id).find('i[data-selection-header="share"]')[0];
                var copy_btn = $('#' + this.header_id).find('i[data-selection-header="copy"]')[0];
                var delete_btn = $('#' + this.header_id).find('i[data-selection-header="delete"]')[0];

                Main.click(back_btn, me, me._closeSelection);

                Main.click(share_btn, me, me.shareSelectedContent);
                Main.click(copy_btn, me, me.copySelectedContent);
                Main.click(delete_btn, me, me.deleteSelectedContent);

            },
            onHide: me._cancelSelectionMode.bind(me)
        });

    },

    _onClickToSelect: function (evt, _this) {
        var target = evt.target;
        var me = _this;

        if (target.className !== me.getMsgReceivedClassName() &&
                target.className !== me.getMsgSentClassName()) {
            return;
        }

        if (me.selectionMode) {
            if (!$(target).hasClass(me.getMsgSelectionClassName())) {
                $(target).addClass(me.getMsgSelectionClassName());
                me._incrementSelectionCount.call(me);
            } else {//deselect
                $(target).removeClass(me.getMsgSelectionClassName());
                var count = me._decrementSelectionCount.call(me);
                count -= 0;//implicity convert to numeric
                if (count === 0) {
                    me._closeSelection(evt, me);
                }
            }
        }

    },

    _decrementSelectionCount: function () {
        var el = $('#' + this.header_id).find('i[data-selection-header="count"]')[0];
        if (!el.innerHTML) {
            el.innerHTML = 0;
        }
        var count = el.innerHTML - 0;//implicitly convert to numeric
        count += 1;
        el.innerHTML = count;

        return count;
    },

    _incrementSelectionCount: function () {
        var el = $('#' + this.header_id).find('i[data-selection-header="count"]')[0];
        if (!el.innerHTML) {
            el.innerHTML = 0;
        }
        var count = el.innerHTML - 0;//implicitly convert to numeric
        count -= 1;
        el.innerHTML = count;

        return count;
    },

    _closeSelection: function (evt, _this) {
        var me = _this;
        Main.card.back(me.header_id);
    },

    shareSelectedContent: function () {
        alert('TODO - shareSelectedContent');
    },

    copySelectedContent: function () {
        alert('TODO - copySelectedContent');
    },

    deleteSelectedContent: function () {
        alert('TODO - deleteSelectedContent');
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    onPrepareSentMsgTpl: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    onFinishPrepareSentMsgTpl: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    onPrepareReceivedMsgTpl: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    onFinishPrepareReceivedMsgTpl: function () {
    },

    _cancelSelectionMode: function () {
        var me = this;
        me.selectionMode = true;

        var msg_body = $(me.view_body).find(me.getMsgBodySelector())[0];
        var children = msg_body.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            $(child).removeClass(me.getMsgSelectionClassName());
        }

    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMainTpl: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getViewID: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getViewBodyID: function () {
    },
    /**
     * Subclass must override this method and return the promise of the rcall<br>
     * <br>
     * example: <br>
     *     rcallGetMessages: function(msg){<br>
     *            return Main.ro.getContactChats(); // return the promise of the rcall<br>
     *      }<br>
     * <br>
     * @returns {undefined}
     */
    rcallGetMessages: function () {
    },

    /**
     * replace the existing msg messages with new ones
     * 
     * @param {type} msgs
     * @returns {undefined}
     */
    set: function (msgs) {
        if (!this._validate()) {
            return;
        }

        this.msgList = msgs;

        var me = this;

        Main.tpl.template({
            tplUrl: me.getMainTpl(),
            onReplace: function (tpl_var, data) {},
            afterReplace: function (html, data) {
                $(me.view_body).html(html);
                //clear msg
                var msg_body = $(me.view_body).find(me.getMsgBodySelector())[0];
                $(msg_body).html(''); // come back to test for correctness

                me._addContent(msgs);

                var btn_send = $(me.view_body).find(me.getMsgSendBottonSelector())[0];
                var txt_input = $(me.view_body).find(me.getMsgInputSelector())[0];
                var emoji = $(me.view_body).find(me.getMsgEmojisBottonSelector())[0];

                $(btn_send).on('click', {txt_input: txt_input}, me._sendMessage);

                $(emoji).on('click', me._showEmojis);

            }
        });

    },
    /**
     * Add one or an array of messages
     * 
     * @param {type} msg
     * @returns {undefined}
     */
    add: function (msg) {
        if (!this._validate()) {
            return;
        }

        if (!Main.util.isArray(msg)) {
            msg = [msg];
        }
        for (var i = 0; i < msg.length; i++) {
            this.msgList.push(msg[i]);
        }
        var me = this;
        Main.tpl.template({
            tplUrl: me.getMainTpl(),
            onReplace: function (tpl_var, data) {},
            afterReplace: function (html, data) {
                me._addContent(msg);
            }
        });

    },

    _addContent: function (msgs) {
        var me = this;

        if (msgs.length > 0 && msgs[0].user) {//if the message came with the user info
            me._handleMsgs(msgs);
            return;
        }
        //At this point try to get the user info of each message
        var user_ids = [];
        for (var i = 0; i < msgs.length; i++) {
            var u_id = msgs[i].user_id;
            if (user_ids.indexOf(u_id) < 0) {
                user_ids.push(u_id);
            }
        }
        Ns.view.UserProfile.getUsersInfo(user_ids, function (users) {
            me._handleMsgs(msgs, users);
        });


    },

    _handleMsgs: function (msgs, users) {

        for (var i = 0; i < msgs.length; i++) {
            var c = msgs[i];
            var msg_user_id = c.user_id;
            if (users) {
                for (var k = 0; k < users.length; k++) {
                    if (users[k].user_id === msg_user_id) {
                        msgs[i].user = users[k]; //set the user object on the msg object
                        break;
                    }
                }
            }
            var is_sent_msg = msg_user_id === Ns.view.UserProfile.appUser.user_id;
            if (is_sent_msg) {
                this._addSent.call(this, c);
            } else {
                this._addReceived.call(this, c);
            }

        }
    },

    _sendMessage: function (argu) {
        var txt_input = argu.data.txt_input;
        var content = txt_input.innerHTML; //textarea
        var me = this;
        var user = Ns.view.UserProfile.appUser;
        var msgObj = {
            user_id: user.user_id,
            user: user,
            content: content,
            sending_msg_id: Main.util.serilaNo()
        };

        Main.rcall.live(function () {
            me.rcallSendMessage(content)
                    .before(function () {
                        me._addSending.call(me, msgObj);
                    })
                    .get(function (data) {
                        me._removeSending.call(me, msgObj);
                        data.content = content; // reset the cotent removed in the server to reduce payload
                        me.add.call(me, data);
                    })
                    .error(function (err) {
                        me._markSendingFailed.call(me, msgObj);
                    });
        });

    },

    /**
     * Subclass must override this method and return the promise of the rcall<br>
     * <br>
     * example: <br>
     *     rcallSendMessage: function(content){<br>
     *            return Main.ro.sendContactChat(user_id, contact_user_id, content, content_type); // return the promise of the rcall<br>
     *      }<br>
     * <br>
     * @returns {undefined}
     */
    rcallSendMessage: function () {
    },

    _addReceived: function (msg, users) {
        var me = this;

        Main.tpl.template({
            tplUrl: me.getMsgReceivedTpl(),
            data: msg,
            onReplace: function (tpl_var, data) {

                var replace = me.onPrepareReceivedMsgTpl(tpl_var, data);
                if (typeof replace !== 'undefined') {
                    return replace;
                }

                if (tpl_var === 'time') {
                    return Ns.Util.formatTime(data[tpl_var]);
                }
                if (tpl_var === 'full_name') {
                    //if the user info object is available then just return the
                    //full name from it, otherwise return the user_id on th data object
                    //which is always available
                    return data.user ? data.user.full_name : data.user_id;
                }
                
                if (tpl_var === 'content') {
                    return data.content ? data.content : data.msg;
                }
            },
            afterReplace: function (html, data) {
                me.onFinishPrepareReceivedMsgTpl(html, data);
                me._addMsgItem(html, data);
            }
        });

    },

    _addSent: function (msg) {
        var me = this;
        Main.tpl.template({
            tplUrl: me.getMsgSentTpl(),
            data: msg,
            onReplace: function (tpl_var, data) {

                var replace = me.onPrepareSentMsgTpl(tpl_var, data);
                if (typeof replace !== 'undefined') {
                    return replace;
                }

                if (tpl_var === 'time') {
                    return Ns.Util.formatTime(data[tpl_var]);
                }

                if (tpl_var === 'content') {
                    return data.content ? data.content : data.msg;
                }

            },
            afterReplace: function (html, data) {

                var msg_body = $(me.view_body).find(me.getMsgBodySelector())[0];
                $(msg_body).append(html);

                var children = msg_body.children;
                var last_child = children[children.length - 1];

                var indicator = $(last_child).find(me.getMsgStatusIndicatorSelector())[0];

                if (data.status === 'seen') {
                    indicator.className = me.getSeenIndicatorClassName();
                } else if (data.status === 'delivered') {
                    indicator.className = me.getDeliveredIndicatorClassName();
                } else if (data.status === 'sent') {
                    indicator.className = me.getSentIndicatorClassName();
                } else {//not sent
                    indicator.className = me.getNotSentIndicatorClassName();
                }

                if (data.sending_msg_id) {
                    me.onFinishPrepareSentMsgTpl(html, data);
                }

                me._addMsgItem(html, data);
            }
        });

    },

    _addSending: function (msgObj) {
        this._addSent(msgObj);
    },

    _removeSending: function (msgObj) {
        var msg_body = $(this.view_body).find(this.getMsgBodySelector())[0];
        var children = msg_body.children;
        for (var i = children.length - 1; i > -1; i--) {
            var child = children[i];
            var el_id = this.view_body.id;
            var dom_extra_field = this.domExtraFieldPrefix(el_id);
            if (child[dom_extra_field].sending_msg_id === msgObj.sending_msg_id) {//come back
                $(child).remove();
                break;
            }
        }
    },

    _markSendingFailed: function () {

    },

    domExtraFieldPrefix: function (id) {
        return id + this.DOM_EXTRA_FIELD_PREFIX;
    },

    _addMsgItem: function (html, data) {

        var el_id = this.view_body.id;
        var dom_extra_field = this.domExtraFieldPrefix(el_id);

        //now add the item
        var el = document.getElementById(el_id);
        if (!el) {
            return;
        }
        $(el).append(html);
        var children = el.children;
        var last_child = children[children.length - 1];
        last_child[dom_extra_field] = data;
        return last_child;
    },

    _deseleteAll: function () {
        var msg_body = $(this.view_body).find(this.getMsgBodySelector())[0];

        var children = msg_body.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            $(child).removeClass(this.getMsgSelectionClassName());
        }
    },

    /**
     * Remove one msg message at the specified index
     * 
     * @param {type} index
     * @returns {undefined}
     */
    remove: function (index) {
        if (!this._validate()) {
            return;
        }


    },
    /**
     * Find the search string on the msg view and scroll to the
     * first search result
     * 
     * @param {type} search_str
     * @returns {undefined}
     */
    find: function (search_str) {
        if (!this._validate()) {
            return;
        }



    },

    /**
     * Scroll to the next search result in the current search operation
     * 
     * @returns {undefined}
     */
    findNext: function () {
        if (!this._validate()) {
            return;
        }


    },

    /**
     * Scroll to the previous search result in the current search operation
     * 
     * @returns {undefined}
     */
    findPrevious: function () {
        if (!this._validate()) {
            return;
        }

    },

    /**
     * Show a collections of emojis
     * 
     * @returns {undefined}
     */
    _showEmojis: function () {
        if (!this._validate()) {
            return;
        }
        alert('TODO: _showEmojis');


    }




};



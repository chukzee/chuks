

/* global Ns, Main, localforage */

Ns.msg.AbstractMessage = {
    refStateIndex: 0,
    view: null,
    view_body: null,
    msgList: [],
    _unsentMsgList: [],
    repliedMsgList: [],
    selectionMode: false,
    _isViewReady: false,
    DOM_EXTRA_FIELD_PREFIX: '-dom-extra-field',
    DOM_EXTRA_FIELD_REPLY_MSG: 'reply-msg-dom-extra-field',
    MSG_SAVE_KEY: '_MSG_SAVE_KEY',
    REPLIED_MSG_SAVE_KEY: '_REPLIED_MSG_SAVE_KEY',
    UNSENT_MSG_SAVE_KEY: '_UNSENT_MSG_SAVE_KEY',
    EMOJI_TAB_BORDER_BOTTOM: '#222 solid 1px',
    retryWaitDuartion: 1,
    retrySendTimerID: null,
    _waitingNextTick: false,
    _prepared_items: [],
    _new_added_count: 0,
    _new_set_count: 0,
    _new_sending_count: 0,
    _redisplay_timer_id: null,
    _name: null,
    _code: null,
    _extra_code: null,

    getMsgList: function () {
        return this.msgList;
    },
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
    getMsgScrollContainerSelector: function () {
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
    getMsgRepliedFullNameSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgRepliedMessageSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgEmojiListSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgEmojiTabOneSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgEmojiTabTwoSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgEmojiTabThreeSelector: function () {
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
    getMsgSentTimeSelector: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgReceivedTimeSelector: function () {
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
     * 
     * A reliable tracking code in the message object
     * 
     * @returns {undefined}
     */
    getCode: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMsgCode: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    setMsgCode: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getResponseMsgs: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getResponseRepliedMsgs: function () {
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
    
    content: function (data, argu1) {

        this.refStateIndex++;

        var me = this;
        this.initContent(data, argu1);
        this.selectionMode = false;
        this._isViewReady = false;
        var last_code = this._code;
        this._code = this.getCode();

        var isSameView = last_code === this._code;

        this.view = document.getElementById(this.getViewID());
        if (!this.view) {
            throw Error('unknown id for ' + this.getMsgType() + ' view - ' + this.getViewID());
        }

        this.view_body = document.getElementById(this.getViewBodyID());
        if (!this.view_body) {
            throw Error('unknown id for ' + this.getMsgType() + ' view body - ' + this.getViewBodyID());
        }


        var msg_body = $(this.view_body).find(this.getMsgBodySelector())[0];
        if (msg_body) {
            msg_body.innerHTML = ''; //clear the previous messages
        }

        initMsgList.call(me);

        var oldRefState = me.refStateIndex;

        function initMsgList() {

            if (!isSameView || (isSameView && me.msgList.length === 0)) {
                me._localGetMessages(function (value) {

                    if (oldRefState !== me.refStateIndex) {
                        value = [];
                    }

                    if (!value) {
                        value = [];
                    }
                    me.msgList = value;
                    initRepliedMsgList.call(me);
                }.bind(me));
            } else {
                initRepliedMsgList.call(me);
            }
        }

        function initRepliedMsgList() {

            if (!isSameView || (isSameView && me.repliedMsgList.length === 0)) {
                this._localGetRepliedMessages(function (value) {

                    if (oldRefState !== me.refStateIndex) {
                        value = [];
                    }

                    if (!value) {
                        value = [];
                    }
                    me.repliedMsgList = value;
                    initUnSentMessages.call(me);
                }.bind(me));
            } else {
                initUnSentMessages.call(me);
            }
        }

        function initUnSentMessages() {
            if (me.refStateIndex === 1) {//the first time this view is loaded
                me._localGetUnsentMessages(function (value) {

                    if (oldRefState !== me.refStateIndex) {
                        value = [];
                    }

                    if (!value) {
                        value = [];
                    }
                    me._unsentMsgList = value;
                    setMessages.call(me);
                }.bind(me));
            } else {
                setMessages.call(me);
            }
        }

        this._redisplayMsgTimeOnNextDay();

        var bndOnMessageAdded = onMessageAdded.bind(data);

        function setMessages() {
            if (me.msgList.length > 0) {

                Main.event.on(Ns.Const.EVT_MESSAGE_ADDED, bndOnMessageAdded);
                me.set(me.msgList);
            } else {
                me._remoteGetMessages.call(me, data);
            }
        }

        var search_btn = document.getElementById(this.getSearchButtonID());
        var menu_btn = document.getElementById(this.getMenuButtonID());

        if (search_btn) {
            Main.click(search_btn, this, this._onClickSearch);
        }

        if (menu_btn) {
            Main.click(menu_btn, this, this._onClickMenu);
        }

        Main.longpress(this.view_body, this, this._onLongpressToSelect);

        Main.click(this.view_body, this, this._onClickToSelect);

        function onMessageAdded(msg) {
            var view_data = this;
            var last = me.msgList[me.msgList.length - 1];
            if (msg.msg_id !== last.msg_id) {
                return;
            }

            //at this point the last message is added
            Main.event.off(Ns.Const.EVT_MESSAGE_ADDED, bndOnMessageAdded);//stop the event

            me._remoteGetMessages.call(me, view_data);

        }

    },
    onHide: function () {
        alert('Hahaha!!!');
      var msg_body = $(this.view_body).find(this.getMsgBodySelector())[0];
        if (msg_body) {
            msg_body.innerHTML = ''; //clear the previous messages
        }  
    },

    _redisplayMsgTimeOnNextDay: function () {

        var date = new Date();
        var current_time = new Date().getTime();
        var day_of_month = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var next_day_of_month = day_of_month + 1;
        var next_day_time = new Date(year, month, next_day_of_month).getTime();
        var diff = next_day_time - current_time;

        var me = this;

        //cancel old timer
        if (this._redisplay_timer_id) {
            window.clearTimeout(this._redisplay_timer_id);
        }

        this._redisplay_timer_id = window.setTimeout(doRedisplay, diff);

        function doRedisplay() {

            var el_id = me.view_body.id;
            var dom_extra_field = me.domExtraFieldPrefix(el_id);

            var elms = me.view_body.querySelectorAll('.' + me.getMsgSentClassName());
            for (var i = 0; i < elms.length; i++) {
                var elm = elms[i];
                var data = elm[dom_extra_field];
                var e = elm.querySelector(me.getMsgSentTimeSelector());
                e.innerHTML = Ns.Util.formatTime(data.time);
            }

            var elms = me.view_body.querySelectorAll('.' + me.getMsgReceivedClassName());
            for (var i = 0; i < elms.length; i++) {
                var elm = elms[i];
                var data = elm[dom_extra_field];
                var e = elm.querySelector(me.getMsgReceivedTimeSelector());
                e.innerHTML = Ns.Util.formatTime(data.time);
            }

            console.log('_redisplayMsgTimeOnNextDay doRedisplay');
        }
    },

    _remoteGetMessages: function (data) {

        var me = this;
        var _prev_code = me.getCode();

        var bindFn = function () {
            return {_code: _prev_code};
        };

        //TODO: show loading indicator

        me.rcallGetMessages(bindFn)
                .after(function () {
                    me._retryUnsentMessage.call(me);
                })
                .get(function (res) {

                    var bind = this;
                    if (bind._code !== me.getCode()) {//the view has changed
                        return;
                    }
                    var msgs = me.getResponseMsgs(res);

                    var replied_msgs = me.getResponseRepliedMsgs(res);
                    me.repliedMsgList = replied_msgs;
                    me._localSaveRepliedMessages();


                    me.set(msgs);

                    //send 'seen' status
                    var user_id = Ns.view.UserProfile.appUser.user_id;
                    var msg_ids = [];
                    for (var i = 0; i < msgs.length; i++) {
                        var msg = msgs[i];
                        if (msg.user_id !== user_id) {
                            if (msg.status !== 'seen') {
                                msg_ids.push(msg.msg_id);
                            }
                        }
                    }
                    if (msg_ids.length > 0) {
                        me.sendSeenStatus(msg_ids, msg.user_id, user_id);
                    }
                })
                .error(function (err) {
                    console.log(err);
                });

    },

    _localSaveMessages: function () {
        localforage.setItem(this.getSaveKeyPrefix()
                + Ns.Util.DELIMITER
                + this.getCode()
                + Ns.Util.DELIMITER
                + this.MSG_SAVE_KEY, this.msgList, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
    },

    _localSaveRepliedMessages: function () {
        localforage.setItem(this.getSaveKeyPrefix()
                + Ns.Util.DELIMITER
                + this.getCode()
                + Ns.Util.DELIMITER
                + this.REPLIED_MSG_SAVE_KEY, this.repliedMsgList, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
    },

    _localSaveUnsentMessages: function () {
        localforage.setItem(this.getSaveKeyPrefix()
                + Ns.Util.DELIMITER
                + this.getCode()
                + Ns.Util.DELIMITER
                + this.UNSENT_MSG_SAVE_KEY, this._unsentMsgList, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
    },

    _localGetMessages: function (callback) {
        return this._localGet(this.MSG_SAVE_KEY, callback);
    },

    _localGetRepliedMessages: function (callback) {
        return this._localGet(this.REPLIED_MSG_SAVE_KEY, callback);
    },

    _localGetUnsentMessages: function (callback) {
        return this._localGet(this.UNSENT_MSG_SAVE_KEY, callback);
    },

    _localGet: function (key, callback) {

        localforage.getItem(this.getSaveKeyPrefix()
                + Ns.Util.DELIMITER
                + this.getCode()
                + Ns.Util.DELIMITER
                + key, function (err, msgs) {
                    if (err) {
                        console.log(err);
                    }
                    if (!msgs) {
                        return callback([]);
                    }
                    callback(msgs);
                });

    },

    _itemTargetEl: function (target) {

        var parent = target;
        var space = ' ';
        while (parent && parent !== document.body) {
            //check if classes it contains
            if (parent.className.split(space).indexOf(this.getMsgReceivedClassName()) > -1 ||
                    parent.className.split(space).indexOf(this.getMsgSentClassName()) > -1) {
                return parent;
            }
            parent = parent.parentNode;
        }

    },

    _onClickSearch: function (evt, _this) {
        var me = _this;
        //show search header
        Main.card.to({
            container: me.getViewHeaderID(),
            url: 'search-header.html',
            fade: true,
            data: null,
            onShow: function () {

                var back_btn = $('#' + me.getViewHeaderID()).find('i[data-search-header="back"]')[0];
                var txt_input = $('#' + me.getViewHeaderID()).find('input[data-search-header="input"]')[0];
                var delete_btn = $('#' + me.getViewHeaderID()).find('i[data-search-header="delete"]')[0];

                Main.click(back_btn, me, me._closeSearch);
                Main.dom.addListener(txt_input, 'keyup', me, me._filterLocalMessages);
                Main.click(delete_btn, me, function (evt, _this) {
                    txt_input.value = '';
                    evt.target = txt_input;
                    me._filterLocalMessages.call(this, null, _this);
                });

            },
            onHide: me._cancelSearchMode.bind(me)
        });

    },

    _onClickMenu: function (evt, _this) {

        alert('TODO - _onClickMenu');

    },

    _cancelSearchMode: function () {
        this.set(this.msgList);
    },

    _closeSearch: function (evt, _this) {
        var me = _this;
        Main.card.back(me.getViewHeaderID());
    },

    _filterLocalMessages: function (evt, _this) {
        var me = _this;
        var txt_input;
        if (evt) {
            txt_input = evt.target;
        } else {
            txt_input = $('#' + me.getViewHeaderID()).find('input[data-search-header="input"]')[0];
        }
        var value = txt_input.value;
        if (value === '') {
            me.set(me.msgList, false);
            return;
        }
        var msg_arr = [];
        for (var i = 0; i < me.msgList.length; i++) {
            var msgObj = me.msgList[i];
            var content = msgObj.content ? msgObj.content : msgObj.msg;
            if (!content) {
                continue;
            }

            var result = content.match(value);
            if (!result) {
                continue;
            }
            var r = RegExp(value, 'g');
            var replacement = content.replace(r, '<span style="background: #00BFFF;">' + value + '</span>');
            var copy = {};
            for (var n in msgObj) {
                copy[n] = msgObj[n];
            }
            copy._rawContent = copy.content; //the non-html formated content as it was
            copy.content = replacement;

            msg_arr.push(copy);
        }

        me.set(msg_arr, false);

    },

    _onLongpressToSelect: function (evt, _this) {
        var me = _this;
        if (me.selectionMode) {
            return;
        }

        var target = me._itemTargetEl.call(me, evt.target);

        if (!target) {
            return;
        }

        //show selection header
        Main.card.to({
            container: me.getViewHeaderID(),
            url: 'selection-header.html',
            fade: true,
            data: null,
            onShow: function () {
                me.selectionMode = true;
                if (!$(target).hasClass(me.getMsgSelectionClassName())) {
                    $(target).addClass(me.getMsgSelectionClassName());
                    me._incrementSelectionCount.call(me);
                }
                var back_btn = $('#' + me.getViewHeaderID()).find('i[data-selection-header="back"]')[0];
                var reply_btn = $('#' + me.getViewHeaderID()).find('i[data-selection-header="reply"]')[0];
                var share_btn = $('#' + me.getViewHeaderID()).find('i[data-selection-header="share"]')[0];
                var copy_btn = $('#' + me.getViewHeaderID()).find('i[data-selection-header="copy"]')[0];
                var delete_btn = $('#' + me.getViewHeaderID()).find('i[data-selection-header="delete"]')[0];

                Main.click(back_btn, me, me._closeSelection);

                Main.click(reply_btn, me, me.replySelectedContent);
                Main.click(share_btn, me, me.shareSelectedContent);
                Main.click(copy_btn, me, me.copySelectedContent);
                Main.click(delete_btn, me, me.deleteSelectedContent);

            },
            onHide: me._cancelSelectionMode.bind(me)
        });

    },

    _onClickToSelect: function (evt, _this) {
        var me = _this;

        var target = me._itemTargetEl.call(me, evt.target);

        if (!target) {
            return;
        }

        if (me.selectionMode) {
            var count;
            if (!$(target).hasClass(me.getMsgSelectionClassName())) {
                $(target).addClass(me.getMsgSelectionClassName());
                count = me._incrementSelectionCount.call(me);
            } else {//deselect
                $(target).removeClass(me.getMsgSelectionClassName());
                count = me._decrementSelectionCount.call(me);
                count -= 0;//implicity convert to numeric
                if (count === 0) {
                    me._closeSelection(evt, me);
                }
            }

            var reply_btn = $('#' + me.getViewHeaderID()).find('i[data-selection-header="reply"]')[0];

            if (count === 1) {
                $(reply_btn).show();
            } else {
                $(reply_btn).hide();
            }
        }

    },

    _decrementSelectionCount: function () {
        var el = $('#' + this.getViewHeaderID()).find('span[data-selection-header="count"]')[0];
        if (!el.innerHTML) {
            el.innerHTML = 0;
        }
        var count = el.innerHTML - 0;//implicitly convert to numeric
        count -= 1;
        el.innerHTML = count;

        return count;
    },

    _incrementSelectionCount: function () {
        var el = $('#' + this.getViewHeaderID()).find('span[data-selection-header="count"]')[0];
        if (!el.innerHTML) {
            el.innerHTML = 0;
        }
        var count = el.innerHTML - 0;//implicitly convert to numeric
        count += 1;
        el.innerHTML = count;

        return count;
    },

    _closeSelection: function (evt, _this) {
        var me = _this;
        Main.card.back(me.getViewHeaderID());
    },

    _formatSelection: function (evt, _this) {
        var me = _this;
        var selected_children = me._getSelectedItems.call(me);
        var count = selected_children.length;
        if (count === 0) {
            Main.toast.show('Nothing selected!');
            return;
        }

        var text = '';
        var el_id = me.view_body.id;
        var dom_extra_field = me.domExtraFieldPrefix(el_id);
        var msgs = [];
        for (var i = 0; i < count; i++) {
            var child = selected_children[i];
            var msg = child[dom_extra_field];
            msgs.push(msg);
            var content = '';
            
            if (count > 1) {
                var full_name = msg.user ? msg.user.full_name : msg.user.user_id;
                content = '[' + Ns.Util.formatTime(msg.time, true) + ' ' + full_name + ']\n'
                        + (msg._rawContent ? msg._rawContent: ( msg.content ? msg.content : msg.msg))
                        + (i === count - 1 ? '' : '\n');
            } else {
                content = msg._rawContent ? msg._rawContent: ( msg.content ? msg.content : msg.msg);
            }
            
            text += content + (i === count - 1 ? '' : '\n');
        }
        
        return {count: count, text: text, msgs: msgs};
    },
        
    shareSelectedContent: function (evt, _this) {
        var s = _this._formatSelection(evt, _this);
        if (s.count === 0) {
            return;
        }
        
        alert('TODO - shareSelectedContent');
    },

    replySelectedContent: function (evt, _this) {
        var s = _this._formatSelection(evt, _this);
        if (s.count === 0) {
            return;
        }
        
        
        _this.showReply(evt, s.msgs[0]);
        _this._closeSelection(evt, _this);
    },
        
    copySelectedContent: function (evt, _this) {
        var s = _this._formatSelection(evt, _this);
        if (s.count === 0) {
            return;
        }
        if (Main.clipboard.copy(s.text)) {
            Main.toast.show(s.count + (s.count > 1 ? ' messages' : ' message') + ' copied');
        } else {
            Main.toast.show('Failed to copy!');
        }
    },

    deleteSelectedContent: function (evt, _this) {
        var me = _this;
        var selected_children = me._getSelectedItems.call(me);
        if (selected_children.length === 0) {
            Main.toast.show('Nothing selected!');
            return;
        }
        var msgs = [];

        var el_id = me.view_body.id;
        var dom_extra_field = me.domExtraFieldPrefix(el_id);
        for (var i = 0; i < selected_children.length; i++) {
            var child = selected_children[i];
            msgs[i] = child[dom_extra_field];
        }

        Main.confirm(function (text) {
            if (text === 'NO') {
                return;
            }
            me._deleteMessages.call(me, msgs);
            me._closeSelection(evt, me);
        }
        , 'Are you sure you want to delete?'
                , selected_children.length + ' Selected');
    },

    _deleteMessages: function (msgs) {
        var me = this;
        var unsent = [];
        var regular = [];
        for (var i = 0; i < msgs.length; i++) {
            if (msgs[i].sending_msg_id) {
                unsent.push(msgs[i]);
            } else {
                regular.push(msgs[i]);
            }
        }

        if (unsent.length > 0) {
            me._removeMessages(unsent);
        }

        if (regular.length > 0) {
            Main.rcall.live(function () {
                me.rcallDeleteMessages(regular)
                        .get(function (data) {
                            //remove the messages from the dom
                            me._removeMessages(regular);
                        })
                        .error(function (err) {
                            Main.toast.show(err);
                        });
            });
        }



    },

    _getSelectedItems: function () {
        var me = this;

        var msg_body = $(me.view_body).find(me.getMsgBodySelector())[0];
        var children = msg_body.children;
        var selected_children = [];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.className.split(' ').indexOf(me.getMsgSelectionClassName()) > -1) {
                selected_children.push(child);
            }
        }

        return selected_children;
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
        me.selectionMode = false;

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
    getSaveKeyPrefix: function () {
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
    getViewHeaderID: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getViewBodyID: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getSearchButtonID: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    getMenuButtonID: function () {
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
     * Overridden by subclass
     * @returns {undefined}
     */
    sendSeenStatus: function () {
    },

    /**
     * Overridden by subclass
     * @returns {undefined}
     */
    sendDeliveryStatus: function () {
    },

    /**
     * replace the existing msg messages with new ones
     * 
     * @param {type} msgs
     * @param {type} is_replace_list
     * @returns {undefined}
     */
    set: function (msgs, is_replace_list) {
        if (!this._validate()) {
            return;
        }

        for (var i = 0; i < msgs.length; i++) {
            this.setMsgCode(msgs[i]);
        }

        if (is_replace_list !== false) {
            this.msgList = msgs;
            this._localSaveMessages();
        }

        if (!this.isShowing()) {
            return;
        }

        this._new_set_count = msgs.length;

        if (this._isViewReady) {
            var msg_body = $(this.view_body).find(this.getMsgBodySelector())[0];
            msg_body.innerHTML = ''; //clear the previous messages
            this._addContent(msgs);
            return;
        }

        var me = this;

        Main.tpl.template({
            tplUrl: me.getMainTpl(),
            onReplace: function (tpl_var, data) {},
            afterReplace: function (el, data) {
                $(me.view_body).html(el);

                me._addContent(msgs);

                me._isViewReady = true;

                var btn_send = $(me.view_body).find(me.getMsgSendBottonSelector())[0];
                var txt_input = $(me.view_body).find(me.getMsgInputSelector())[0];
                var emoji = $(me.view_body).find(me.getMsgEmojisBottonSelector())[0];

                var close_emoji = $(me.view_body).find('i[data-close-btn="emoji"]')[0];
                var close_reply = $(me.view_body).find('i[data-close-btn="reply"]')[0];

                var pop_emoji = $(me.view_body).find('div[data-pop="emoji"]')[0];
                var pop_reply = $(me.view_body).find('div[data-pop="reply"]')[0];

                var emoji_tab1_el = $(me.view_body).find(me.getMsgEmojiTabOneSelector())[0];
                var emoji_tab2_el = $(me.view_body).find(me.getMsgEmojiTabTwoSelector())[0];
                var emoji_tab3_el = $(me.view_body).find(me.getMsgEmojiTabThreeSelector())[0];

                var emoji_list_el = $(me.view_body).find(me.getMsgEmojiListSelector())[0];

                var eobj = {
                    pop_emoji: pop_emoji,
                    emoji_list_el: emoji_list_el,
                    emoji_tab1_el: emoji_tab1_el,
                    emoji_tab2_el: emoji_tab2_el,
                    emoji_tab3_el: emoji_tab3_el
                }

                Main.click(btn_send, {txt_input: txt_input}, me.sendMessage.bind(me));

                Main.click(emoji, eobj, me.showEmojis.bind(me));

                Main.click(emoji_tab1_el, eobj, me._onEmojiTabOneClick.bind(me));

                Main.click(emoji_tab2_el, eobj, me._onEmojiTabTwoClick.bind(me));

                Main.click(emoji_tab3_el, eobj, me._onEmojiTabThreeClick.bind(me));

                Main.click(emoji_list_el, me._onEmojiListClick.bind(me));

                Main.click(close_emoji, pop_emoji, me.closeEmojis.bind(me));

                Main.click(close_reply, pop_reply, me.closeReply.bind(me));


            }
        });

    },
    /**
     * Add one or an array of messages
     * 
     * @param {type} replace_element
     * @param {type} msgs
     * @returns {undefined}
     */
    add: function (msgs, replace_element) {

        var is_showing = this.isShowing();

        if (!Main.util.isArray(msgs)) {
            var user_id = Ns.view.UserProfile.appUser.user_id;
            if (msgs.user_id !== user_id) {//send delivered or seen status
                if (msgs.status === 'sent') {
                    if (is_showing) {
                        this.sendSeenStatus(msgs.msg_id, msgs.user_id, user_id);
                    } else {
                        this.sendDeliveryStatus(msgs.msg_id, msgs.user_id, user_id);
                    }
                }
            }

            msgs = [msgs];//convert to array
        }



        for (var i = 0; i < msgs.length; i++) {
            this.setMsgCode(msgs[i]);

            var msg_replied_id = msgs[i].msg_replied_id;
            if (msg_replied_id) {//store the replied message if not already stored
                var rpl_msg = this.repliedMsgList.find(function (m) {
                    return msg_replied_id === m.msg_id;
                });

                if (!rpl_msg) {
                    rpl_msg = this.msgList.find(function (m) {
                        return msg_replied_id === m.msg_id;
                    });
                    if (rpl_msg) {
                        this.repliedMsgList.push(rpl_msg);
                        this._localSaveRepliedMessages();
                    }
                }
            }
        }

        //avoid duplicate addition

        for (var i = 0; i < msgs.length; i++) {
            for (var k = 0; k < this.msgList.length; k++) {
                if (this.msgList[k].msg_id === msgs[i].msg_id) {
                    console.warn('duplicate recieved message detected and discarded', msgs[i]);
                    msgs.splice(i, 1);//remove
                    if (msgs.length === 0) {
                        return;//leave the entire method
                    }
                    i--;
                    break;
                }
            }
        }

        if (!Main.util.isArray(replace_element)) {
            replace_element = [replace_element];
        }

        if (replace_element && replace_element.length !== msgs.length) {
            throw Error('invalid method use - if the elements to be replaced are provided it must match the number of msg ');
            return;
        }

        for (var i = 0; i < msgs.length; i++) {
            this.msgList.push(msgs[i]);
        }

        this._localSaveMessages();

        if (!is_showing) {
            return;
        }

        if (replace_element) {
            this._addContent(msgs, replace_element);
            return;
        }

        this._new_added_count = msgs.length;

        var me = this;
        Main.tpl.template({
            tplUrl: me.getMainTpl(),
            onReplace: function (tpl_var, data) {},
            afterReplace: function (el, data) {
                me._addContent(msgs, replace_element);
            }
        });

    },

    isShowing: function () {
        return $(this.view).is(':visible');
    },

    _addContent: function (msgs, replace_elements) {
        var me = this;

        if (msgs.length > 0 && msgs[0].user) {//if the message came with the user info
            me._handleMsgs(msgs, replace_elements);
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

        for (var i = 0; i < me.repliedMsgList.length; i++) {
            var u_id = me.repliedMsgList[i].user_id;
            if (user_ids.indexOf(u_id) < 0) {
                user_ids.push(u_id);
            }
        }

        Ns.view.UserProfile.getUsersInfo(user_ids, function (users) {
            me._handleMsgs(msgs, replace_elements, users);
        });


    },

    _handleMsgs: function (msgs, replace_elements, users) {

        var me = this;
        var replied_msgs = {};
        for (var i = 0; i < me.repliedMsgList.length; i++) {
            var rpl_msg = me.repliedMsgList[i];
            if (users) {
                for (var k = 0; k < users.length; k++) {
                    if (users[k].user_id === rpl_msg.user_id) {
                        rpl_msg.user = users[k]; //set the user object on the msg object
                        break;
                    }
                }
            }
            replied_msgs[rpl_msg.msg_id] = rpl_msg;
        }

        for (var index = 0; index < msgs.length; index++) {

            var c = msgs[index];

            var r;
            if (replace_elements) {
                r = replace_elements[index];
            }

            var msg_user_id = c.user_id;
            if (users) {
                for (var k = 0; k < users.length; k++) {
                    if (users[k].user_id === msg_user_id) {
                        msgs[index].user = users[k]; //set the user object on the msg object
                        break;
                    }
                }
            }
            var is_sent_msg = msg_user_id === Ns.view.UserProfile.appUser.user_id;
            if (is_sent_msg) {
                me._addSent.call(me, c, r, replied_msgs);
            } else {
                me._addReceived.call(me, c, r, replied_msgs);
            }
        }
    },

    sendMessage: function (evt, data) {

        var me = this;
        var msgObj;

        if (evt) {
            var txt_input = data.txt_input;
            var pop_reply = $(me.view_body).find('div[data-pop="reply"]')[0];

            var msg_replied_id;
            if ($(pop_reply).is(':visible')) {
                var rpl_msg = pop_reply[this.DOM_EXTRA_FIELD_REPLY_MSG];
                msg_replied_id = rpl_msg.msg_id;
                this.closeReply(evt, pop_reply);
            }

            var pop_emoji = $(me.view_body).find('div[data-pop="emoji"]')[0];

            if ($(pop_emoji).is(':visible')) {
                this.closeEmojis(evt, pop_emoji);
            }

            content = txt_input.value; //textarea
            if (content === '') {
                return; //do nothing
            }
            txt_input.value = '';//clear the textarea
            var user = Ns.view.UserProfile.appUser;
            msgObj = {
                user_id: user.user_id,
                msg_replied_id: msg_replied_id,
                user: user,
                content: content,
                sending_msg_id: Main.util.serilaNo()
            };

            me._unsentMsgList.push(msgObj);
            me._addSending.call(me, msgObj);

            me._localSaveUnsentMessages.call(me);
        } else {//new
            msgObj = data;
            me._addSending.call(me, msgObj);
        }

        me._doSendMsg.call(me, msgObj);//new

    },

    _doSendMsg: function (msgObj) {
        var me = this;

        var promise;

        promise = me.rcallSendMessage(msgObj.content, msgObj.msg_replied_id, bindFn);

        promise.retry(retryFn)//force to retry is it is connection problem
                .get(getFn)
                .error(errFn);

        //This is a technique we developed to bind data to rcall. Since the
        //promise methods are called asychronously the msgObj for each request will
        //be the last reference (usual issue in asynchronous calls in for loop).
        //This we cause unexcepted results. So using this improvised bind function
        //solves our problem by returning to us the exact reference we need.
        function bindFn() {//important! 
            return msgObj; //return to us the exact reference we need even if the rcall is in a for loop
        }

        function retryFn(sec_remain) {
            console.log('retry in ' + sec_remain + ' seconds');
        }

        function getFn(data) {
            var mObj = this;// the result of the bind function 'bindFn' returned to us
            if (!me.checkAccess(mObj)) {//the view has changed
                return;//so leave
            }

            var index = me._unsentMsgList.indexOf(mObj);
            if (index > -1) {
                me._unsentMsgList.splice(index, 1);//remove from unsent messages
            }
            me._localSaveUnsentMessages.call(me);
            var remove_el = me._getPendingMsgElement.call(me, mObj);
            me.add.call(me, data, remove_el);

        }

        function errFn(err, err_code, connect_err) {

            var mObj = this;// the result of the bind function 'bindFn' returned to us
            if (!me.checkAccess(mObj)) {//the view has changed
                return;//so leave
            }
        }
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

    _addReceived: function (msg, replace_element, replied_msgs) {
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
                    return data[tpl_var] ? Ns.Util.formatTime(data[tpl_var]) : '';
                }

                if (tpl_var === 'full_name') {
                    //if the user info object is available then just return the
                    //full name from it, otherwise return the user_id on th data object
                    //which is always available
                    return data.user ? data.user.full_name : data.user_id;
                }

                if (data.msg_replied_id && replied_msgs) {
                    var rplMsg = replied_msgs[data.msg_replied_id];
                    if (tpl_var === 'replied_full_name') {
                        if (!rplMsg) {
                            return '';
                        }
                        return rplMsg.user ? rplMsg.user.full_name : rplMsg.user_id;
                    }

                    if (tpl_var === 'replied_content') {
                        if (!rplMsg) {
                            return '';
                        }
                        return rplMsg.content ? rplMsg.content : rplMsg.msg;
                    }

                }

                if (tpl_var === 'content') {
                    return data.content ? data.content : data.msg;
                }

            },
            afterReplace: function (el, data) {

                me._handlePreparedItem(el, data, replace_element);

            }
        });

    },

    _addSent: function (msg, replace_element, replied_msgs) {
        var me = this;
        Main.tpl.template({
            tplUrl: me.getMsgSentTpl(),
            data: msg,
            onReplace: function (tpl_var, data) {

                var replace = me.onPrepareSentMsgTpl(tpl_var, data);
                if (typeof replace !== 'undefined') {
                    return replace;
                }

                if (tpl_var === 'full_name') {
                    //if the user info object is available then just return the
                    //full name from it, otherwise return the user_id on th data object
                    //which is always available
                    return data.user ? data.user.full_name : data.user_id;
                }

                if (data.msg_replied_id && replied_msgs) {
                    var rplMsg = replied_msgs[data.msg_replied_id];
                    if (tpl_var === 'replied_full_name') {
                        if (!rplMsg) {
                            return '';
                        }
                        return rplMsg.user ? rplMsg.user.full_name : rplMsg.user_id;
                    }

                    if (tpl_var === 'replied_content') {
                        if (!rplMsg) {
                            return '';
                        }
                        return rplMsg.content ? rplMsg.content : rplMsg.msg;
                    }

                }

                if (tpl_var === 'time') {
                    return data[tpl_var] ? Ns.Util.formatTime(data[tpl_var]) : '';
                }

                if (tpl_var === 'content') {
                    return data.content ? data.content : data.msg;
                }

                if (tpl_var === 'indicator_class') {

                    if (data.status === 'seen') {
                        return me.getSeenIndicatorClassName();
                    } else if (data.status === 'delivered') {
                        return me.getDeliveredIndicatorClassName();
                    } else if (data.status === 'sent') {
                        return me.getSentIndicatorClassName();
                    } else {//not sent
                        return me.getNotSentIndicatorClassName();
                    }
                }

            },
            afterReplace: function (el, data) {

                me._handlePreparedItem(el, data, replace_element);

            }
        });

    },

    _handlePreparedItem: function (el, data, replace_element) {

        if (!data.msg_replied_id) {//hide the reply element
            var reply_el = el.querySelector('div[data-reply]');
            $(reply_el).hide();
        }

        var obj = {
            el: el,
            data: data,
            replace_element: replace_element
        };

        for (var i = 0; i < this.msgList.length; i++) {
            if (this.msgList[i].msg_id === data.msg_id) {
                this._prepared_items.push(obj);
                break;
            }
        }

        for (var i = 0; i < this._unsentMsgList.length; i++) {
            if (this._unsentMsgList[i].sending_msg_id === data.sending_msg_id) {
                this._prepared_items.push(obj);
                break;
            }
        }

        if (this._prepared_items.length < this._new_set_count + this._new_added_count + this._new_sending_count) {
            return;
        }

        //at this point the items are ready to be added

        var arr = this._prepared_items.sort(function (a, b) {
            return a.data.time - b.data.time;
        });

        for (var i = 0; i < arr.length; i++) {
            var o = arr[i];
            var el_item_added = this._addItemToDom(o.el, o.data, o.replace_element);
            if (!el_item_added) {
                continue;
            }
            var user_id = Ns.view.UserProfile.appUser.user_id;
            if (!data.sending_msg_id) {
                var recieved_message = user_id !== data.user_id;
                if (recieved_message) {
                    this.onFinishPrepareReceivedMsgTpl(el_item_added, o.data);
                } else {
                    this.onFinishPrepareSentMsgTpl(el_item_added, o.data);
                }
            }
        }

        //initial the relevant variables
        this._new_set_count = 0;
        this._new_added_count = 0;
        this._new_sending_count = 0;
        this._prepared_items = [];



    },

    _addSending: function (msgObj) {
        this.setMsgCode(msgObj);
        this._new_sending_count++;
        this._addSent(msgObj);
    },

    _removeMessages: function (msgs) {

        if (!Main.util.isArray(msgs)) {
            msgs = [msgs];
        }

        //remove from the msg list
        for (var i = 0; i < msgs.length; i++) {
            for (var k = 0; k < this.msgList.length; k++) {
                var m = this.msgList[k];
                if (m.msg_id === msgs[i].msg_id) {
                    this.msgList.splice(k, 1);
                    break;
                }
            }
        }

        //remove from the unsent msg list
        for (var i = 0; i < msgs.length; i++) {
            for (var k = 0; k < this._unsentMsgList.length; k++) {
                var m = this._unsentMsgList[k];
                if (m.sending_msg_id === msgs[i].sending_msg_id) {
                    this._unsentMsgList.splice(k, 1);
                    break;
                }
            }
        }

        var msg_body = $(this.view_body).find(this.getMsgBodySelector())[0];
        if (!msg_body) {//is possible! in the case of asynchronous retry sending when the view is already closed.
            return;
        }

        for (var k = 0; k < msg_body.children.length; k++) {
            var m = msg_body.children[k];
            var el_id = this.view_body.id;
            var dom_extra_field = this.domExtraFieldPrefix(el_id);
            for (var i = 0; i < msgs.length; i++) {
                if ((msgs[i].msg_id && m[dom_extra_field].msg_id === msgs[i].msg_id) ||
                        (msgs[i].sending_msg_id && m[dom_extra_field].sending_msg_id === msgs[i].sending_msg_id)) {
                    msg_body.removeChild(m);
                    k--;
                    break;
                }
            }
        }

    },

    _getPendingMsgElement: function (msgObj) {
        var msg_body = $(this.view_body).find(this.getMsgBodySelector())[0];
        if (!msg_body) {//is possible! in the case of asynchronous retry sending when the view is already closed.
            return;
        }
        var children = msg_body.children;
        for (var index = children.length - 1; index > -1; index--) {
            var child = children[index];
            var el_id = this.view_body.id;
            var dom_extra_field = this.domExtraFieldPrefix(el_id);
            if (child[dom_extra_field].sending_msg_id === msgObj.sending_msg_id) {
                return child; // return the element remove 
            }
        }
    },

    getMsgElement: function (msgObj) {
        var msg_body = $(this.view_body).find(this.getMsgBodySelector())[0];
        if (!msg_body) {//is possible! in the case of asynchronous retry sending when the view is already closed.
            return;
        }
        var children = msg_body.children;
        for (var index = children.length - 1; index > -1; index--) {
            var child = children[index];
            var el_id = this.view_body.id;
            var dom_extra_field = this.domExtraFieldPrefix(el_id);
            if (child[dom_extra_field].msg_id === msgObj.msg_id) {
                return child; // return the element 
            }
        }
    },

    _retryUnsentMessage: function (sec) {

        for (var i = 0; i < this._unsentMsgList.length; i++) {//new
            this.sendMessage(null, this._unsentMsgList[i]);
        }

    },

    domExtraFieldPrefix: function (id) {
        return id + this.DOM_EXTRA_FIELD_PREFIX;
    },

    checkAccess: function (msg) {
        if (this.getMsgCode(msg) !== this._code) {
            return false;
        }

        if (!this.isShowing()) {
            return false;
        }

        return true;
    },

    _addItemToDom: function (el, data, replace_element) {


        if (!this.checkAccess(data)) {//the view has changed
            return;//so leave
        }


        var vb_id = this.view_body.id;
        var dom_extra_field = this.domExtraFieldPrefix(vb_id);

        //now add the item
        var view_body_el = document.getElementById(vb_id);
        if (!view_body_el) {
            return;
        }
        var msg_body = $(view_body_el).find(this.getMsgBodySelector())[0];

        el[dom_extra_field] = data;

        if (!replace_element) {
            msg_body.appendChild(el);
        } else {
            msg_body.replaceChild(el, replace_element);
        }

        msg_body.scrollTop = msg_body.scrollHeight;// scroll to be bottom to view the last message

        Main.event.fire(Ns.Const.EVT_MESSAGE_ADDED, data);

        return el;
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
     * Show a collections of emojis
     * 
     * @returns {undefined}
     */
    showEmojis: function (evt, obj) {
        this._onEmojiTabOneClick(evt, obj);
        $(obj.pop_emoji).show();
    },
    /**
     * Hide emojis
     * 
     * @returns {undefined}
     */
    closeEmojis: function (evt, el) {
        $(el).hide();
    },

    /**
     * Show reply
     * 
     * @returns {undefined}
     */
    showReply: function (evt, replied_msg) {

        var pop_reply = $(this.view_body).find('div[data-pop="reply"]')[0];
        var fname_el = $(pop_reply).find(this.getMsgRepliedFullNameSelector())[0];
        var msg_el = $(pop_reply).find(this.getMsgRepliedMessageSelector())[0];

        fname_el.innerHTML = replied_msg.user ? replied_msg.user.full_name : replied_msg.user_id;

        msg_el.innerHTML = replied_msg.content ? replied_msg.content : replied_msg.msg;

        pop_reply[this.DOM_EXTRA_FIELD_REPLY_MSG] = replied_msg;

        $(pop_reply).show();
    },

    /**
     * Hide reply
     * 
     * @returns {undefined}
     */
    closeReply: function (evt, el) {
        $(el).hide();
    },

    _onEmojiTabOneClick: function (evt, eobj) {
        eobj.emoji_tab1_el.style.borderBottom = this.EMOJI_TAB_BORDER_BOTTOM;
        eobj.emoji_tab2_el.style.borderBottom = 'none';
        eobj.emoji_tab3_el.style.borderBottom = 'none';
        this._fillEmojis(Ns.Emoji.SmileyList, eobj.emoji_list_el);
    },

    _onEmojiTabTwoClick: function (evt, eobj) {
        eobj.emoji_tab1_el.style.borderBottom = 'none';
        eobj.emoji_tab2_el.style.borderBottom = this.EMOJI_TAB_BORDER_BOTTOM;
        eobj.emoji_tab3_el.style.borderBottom = 'none';
        this._fillEmojis(Ns.Emoji.ActivityList, eobj.emoji_list_el);
    }
    ,
    _onEmojiTabThreeClick: function (evt, eobj) {
        eobj.emoji_tab1_el.style.borderBottom = 'none';
        eobj.emoji_tab2_el.style.borderBottom = 'none';
        eobj.emoji_tab3_el.style.borderBottom = this.EMOJI_TAB_BORDER_BOTTOM;
        this._fillEmojis(Ns.Emoji.MiscList, eobj.emoji_list_el);
    },

    _onEmojiListClick: function (evt) {
        var target = evt.target;
        if (target.dataset.content !== "emoji") {
            return;
        }

        var txt_input = $(this.view_body).find(this.getMsgInputSelector())[0];
        txt_input.value += '' + target.innerHTML;
    },

    _fillEmojis: function (emoji_arr, emoji_list_el) {

        emoji_list_el.innerHTML = '';
        var html = '';
        for (var i = 0; i < emoji_arr.length; i++) {
            html += '<span style="margin-right: 10px; cursor: pointer;" data-content="emoji" >' + emoji_arr[i] + '</span>';
        }

        emoji_list_el.innerHTML = html;

    }
};



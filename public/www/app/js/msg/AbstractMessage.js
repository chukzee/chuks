

/* global Ns, Main */

Ns.msg.AbstractMessage = {
    view: null,
    view_body: null,
    msgList: [],
    _unsentMsgList: [],
    selectionMode: false,
    _isViewReady: false,
    DOM_EXTRA_FIELD_PREFIX: '-dom-extra-field',
    MSG_SAVE_KEY: '_MSG_SAVE_KEY',
    UNSENT_MSG_SAVE_KEY: '_UNSENT_MSG_SAVE_KEY',
    retryWaitDuartion: 1,
    retrySendTimerID: null,
    _waitingNextTick: false,
    evt_message_added: 'evt_message_added',
    _prepared_items: [],
    _new_added_count: 0,
    _new_set_count: 0,
    _redisplay_timer_id: null,

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
    content: function (data, argu1) {

        var me = this;
        this.initContent(data, argu1);
        this.selectionMode = false;
        this._isViewReady = false;

        this.view = document.getElementById(this.getViewID());
        if (!this.view) {
            throw Error('unknown id for ' + this.getMsgType() + ' view - ' + this.getViewID());
        }

        this.view_body = document.getElementById(this.getViewBodyID());
        if (!this.view_body) {
            throw Error('unknown id for ' + this.getMsgType() + ' view body - ' + this.getViewBodyID());
        }

        if (this.msgList.length === 0) {
            this.msgList = this._localGetMessages();
        }

        if (this._unsentMsgList.length === 0) {
            this._unsentMsgList = this._localGetUnsentMessages();
        }

        this._redisplayMsgTimeOnNextDay();

        if (this.msgList.length > 0) {
            var bndOnMessageAdded = onMessageAdded.bind(data);
            Main.event.on(this.evt_message_added, bndOnMessageAdded);
            this.set(this.msgList);
        } else {
            this._remoteGetMessages.call(this, data);
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


        var me = this;

        function onMessageAdded(msg) {
            var view_data = this;
            var last = me.msgList[me.msgList.length - 1];
            if (msg.msg_id !== last.msg_id) {
                return;
            }

            //at this point the last message is added
            Main.event.off(me.evt_message_added, bndOnMessageAdded);//stop the event

            me._remoteGetMessages.call(me, view_data);

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

        //TODO: show loading indicator

        Main.rcall.live(function () {

            me.rcallGetMessages(data)
                    .after(function () {
                        //add unsent messages
                        for (var i = 0; i < me._unsentMsgList.length; i++) {
                            me.addSending(me._unsentMsgList[i]);
                        }
                        me._retryUnsentMessage.call(me);
                    })
                    .get(function (res) {
                        var msgs = me.getResponseMsgs(res);
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
        });
    },

    _localSaveMessages: function () {
        window.localStorage.setItem(this.getSaveKeyPrefix() + this.MSG_SAVE_KEY, JSON.stringify(this.msgList));
    },

    _localSaveUnsentMessages: function () {
        window.localStorage.setItem(this.getSaveKeyPrefix() + this.UNSENT_MSG_SAVE_KEY, JSON.stringify(this._unsentMsgList));
    },

    _localGetMessages: function () {
        return this._localGet(this.MSG_SAVE_KEY);
    },

    _localGetUnsentMessages: function () {
        return this._localGet(this.UNSENT_MSG_SAVE_KEY);
    },

    _localGet: function (key) {
        var msgs = [];
        try {
            var str = window.localStorage.getItem(this.getSaveKeyPrefix() + key);
            if (str) {
                msgs = JSON.parse(str);
            }
        } catch (e) {
            console.log(e);
        }
        return msgs;
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
                var share_btn = $('#' + me.getViewHeaderID()).find('i[data-selection-header="share"]')[0];
                var copy_btn = $('#' + me.getViewHeaderID()).find('i[data-selection-header="copy"]')[0];
                var delete_btn = $('#' + me.getViewHeaderID()).find('i[data-selection-header="delete"]')[0];

                Main.click(back_btn, me, me._closeSelection);

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

        for (var i = 0; i < count; i++) {
            var child = selected_children[i];
            var msg = child[dom_extra_field];
            var content = '';
            if (count > 1) {
                var full_name = msg.user ? msg.user.full_name : msg.user.user_id;
                content = '[' + Ns.Util.formatTime(msg.time, true) + ' ' + full_name + ']\n'
                        + (msg.content ? msg.content : msg.msg)
                        + (i === count - 1 ? '' : '\n');
            } else {
                content = msg.content ? msg.content : msg.msg;
            }

            text += content + (i === count - 1 ? '' : '\n');
        }

        return {count: count, text: text};
    },

    shareSelectedContent: function (evt, _this) {
        var s = _this._formatSelection(evt, _this);
        if (s.count === 0) {
            return;
        }

        alert('TODO - shareSelectedContent');
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
    getSaveKeyPrefix() {
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

        if (is_replace_list !== false) {
            this.msgList = msgs;
            this._localSaveMessages();
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

                Main.click(btn_send, {txt_input: txt_input, _this: me}, me._sendMessage);

                Main.click(emoji, {_this: me}, me._showEmojis);

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

        Ns.view.UserProfile.getUsersInfo(user_ids, function (users) {
            me._handleMsgs(msgs, replace_elements, users);
        });


    },

    _handleMsgs: function (msgs, replace_elements, users) {

        var me = this;

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
                me._addSent.call(me, c, r);
            } else {
                me._addReceived.call(me, c, r);
            }
        }
    },

    _sendMessage: function (evt, data) {

        var me = data._this;
        var msgObj;

        if (evt) {
            var txt_input = data.txt_input;
            content = txt_input.value; //textarea
            if (content === '') {
                return; //do nothing
            }
            txt_input.value = '';//clear the textarea
            var user = Ns.view.UserProfile.appUser;
            msgObj = {
                user_id: user.user_id,
                user: user,
                content: content,
                sending_msg_id: Main.util.serilaNo()
            };

            me._addSending.call(me, msgObj);
            me._unsentMsgList.push(msgObj);

            me._localSaveUnsentMessages.call(me);
        }


        var MAX_SEND = 10;
        var len = me._unsentMsgList.length;
        if (len === 0) {//possibly the user has deleted them.
            return;
        }

        if (len > MAX_SEND) {
            len = MAX_SEND;
        }


        for (var i = 0; i < len; i++) {
            me._doSendMsg.call(me, me._unsentMsgList[i]);
        }


    },

    _doSendMsg: function (msgObj) {
        var me = this;

        console.log('_doSendMsg msgObj - ', msgObj);


        me.rcallSendMessage(msgObj.content, bindFn)
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

        function getFn(data) {
            var mObj = this;// the result of the bind function 'bindFn' returned to us
            var index = me._unsentMsgList.indexOf(mObj);
            if (index > -1) {
                me._unsentMsgList.splice(index, 1);//remove from unsent messages
            }
            me._localSaveUnsentMessages.call(me);
            var remove_el = me._getPendingMsgElement.call(me, mObj);
            me.add.call(me, data, remove_el);

            me._retryUnsentMessage.call(me, 2);
        }

        function errFn(err) {
            var mObj = this;// the result of the bind function 'bindFn' returned to us
            me._retryUnsentMessage.call(me);
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

    _addReceived: function (msg, replace_element) {
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

                if (tpl_var === 'content') {
                    return data.content ? data.content : data.msg;
                }
            },
            afterReplace: function (el, data) {

                me._handlePreparedItem(el, data, replace_element);

            }
        });

    },

    _addSent: function (msg, replace_element) {
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

    _handlePreparedItem(el, data, replace_element) {

        var obj = {
            el: el,
            data: data,
            replace_element: replace_element
        };

        if (this.msgList.indexOf(data) > -1) {
            this._prepared_items.push(obj);
        }

        if (this._prepared_items.length < this._new_set_count + this._new_added_count) {
            return;
        }

        //at this point the items are ready to be added

        var arr = this._prepared_items.sort(function (a, b) {
            return a.data.time - b.data.time;
        });

        for (var i = 0; i < arr.length; i++) {
            var o = arr[i];
            var el_item_added = this._addItemToDom(o.el, o.data, o.replace_element);
            if (!data.sending_msg_id) {
                this.onFinishPrepareSentMsgTpl(el_item_added, data);
            }
        }

        //initial the relevant variables
        this._new_set_count = 0;
        this._new_added_count = 0;
        this._prepared_items = [];



    },

    _addSending: function (msgObj) {
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

    _retryUnsentMessage: function (sec) {

        if (this._unsentMsgList.length === 0) {
            window.clearTimeout(this.retrySendTimerID);
            this.retrySendTimerID = null;
            return;
        }

        if (this._waitingNextTick) {
            return;
        }

        var delay;
        if (sec > 0) {
            window.clearTimeout(this.retrySendTimerID);//cancel previous one
            this.retrySendTimerID = null;
            this.retryWaitDuartion = sec;
        } else {
            this.retryWaitDuartion *= 2;

            if (this.retryWaitDuartion > 256) {
                this.retryWaitDuartion = 16;
            }
        }

        delay = 1000 * this.retryWaitDuartion;

        this._waitingNextTick = true;

        this.retrySendTimerID = window.setTimeout(this._doResend.bind(this), delay);
    },

    _doResend: function () {

        this._waitingNextTick = false;

        //now resend all unsent
        this._sendMessage(null, {_this: this});

    },

    domExtraFieldPrefix: function (id) {
        return id + this.DOM_EXTRA_FIELD_PREFIX;
    },

    _addItemToDom: function (el, data, replace_element) {

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

        Main.event.fire(this.evt_message_added, data);

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
    _showEmojis: function (evt, data) {
        var target = evt.target;
        var me = data._this;

        alert('TODO: _showEmojis');


    }




};



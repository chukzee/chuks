

/* global Ns, Main */

Ns.msg.AbstractChat = {
    chat_view: null,
    chat_view_body: null,
    chatList: [],
    selectionMode: false,

    _validate: function () {
        if (!this.chat_view_body) {
            throw Error('Invalid setup - chat view body cannot be null. ensure to set chat view body id.');
        }

        if (!this.chat_view) {
            throw Error('Invalid setup - chat view cannot be null. ensure to set chat view id.');
        }


        return true;

    },
    content: function (data) {

        var me = this;
        this.initContent(data);
        this.set(this.chatList);
        this.selectionMode = false;

        this.chat_view = document.getElementById(this.getViewID());
        if (!this.chat_view) {
            throw Error('unknown id for chat view - ' + this.getViewID());
        }

        this.chat_view_body = document.getElementById(this.getViewBodyID());
        if (!this.chat_view_body) {
            throw Error('unknown id for chat view body - ' + this.getViewBodyID());
        }

        //TODO: show loading indicator

        Main.rcall.live(function () {

            me.rcallGetChats(data)
                    .get(function (res) {
                        me.set(res);
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });


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
     *     rcallGetChats: function(msg){<br>
     *            return Main.ro.getContactChats(); // return the promise of the rcall<br>
     *      }<br>
     * <br>
     * @returns {undefined}
     */
    rcallGetChats: function () {
    },

    /**
     * replace the existing chat messages with new ones
     * 
     * @param {type} chats
     * @returns {undefined}
     */
    set: function (chats) {
        if (!this._validate()) {
            return;
        }

        this.chatList = chats;

        var me = this;

        Main.tpl.template({
            tplUrl: 'chat-tpl.html',
            afterReplace: function (html, data) {
                //clear chat
                var chat_body = $(html).find('div[data-chat="body"]')[0];
                $(chat_body).html(''); // come back to test for correctness

                Ns.msg.AbstractChat._addContent(html, chats);

                var btn_send = $(html).find('i[data-chat="send"]')[0];
                var txt_input = $(html).find('textarea[data-chat="input-content"]')[0];
                var emoji = $(html).find('div[data-chat="emoji"]')[0];

                $(btn_send).on('click', {txt_input: txt_input}, Ns.msg.AbstractChat._sendChatMessage);

                $(emoji).on('click', Ns.msg.AbstractChat._showEmojis);

            }
        });

    },
    /**
     * Add one or an array of chat messages
     * 
     * @param {type} chat
     * @returns {undefined}
     */
    add: function (chat) {
        if (!this._validate()) {
            return;
        }

        if (!Main.util.isArray(chat)) {
            chat = [chat];
        }
        for (var i = 0; i < chat.length; i++) {
            this.chatList.push(chat[i]);
        }

        Main.tpl.template({
            tplUrl: 'chat-tpl.html',
            afterReplace: function (html, data) {
                Ns.msg.AbstractChat._addContent(html, chat);
            }
        });

    },

    _addContent: function (html, chats) {
        var user_ids = [];
        for (var i = 0; i < chats.length; i++) {
            var u_id = chats[i].user_id;
            if (user_ids.indexOf(u_id) < 0) {
                user_ids.push(u_id);
            }
        }
        Ns.view.UserProfile.getUsersInfo(user_ids, function (users) {

            for (var i = 0; i < chats.length; i++) {
                var c = chats[i];
                var msg_user_id = c.user_id;
                var is_sent_msg = msg_user_id === Ns.view.UserProfile.appUser.user_id;
                if (is_sent_msg) {
                    Ns.msg.AbstractChat._addSent(c);
                } else {
                    Ns.msg.AbstractChat._addReceived(c, users);
                }

            }
        });


    },

    _sendChatMessage: function (argu) {
        var txt_input = argu.data.txt_input;
        var content = txt_input.innerHTML; //textarea
        var me = this;
        Main.rcall.live(function () {
            me.rcallSendMessage(content)
                    .get(function (data) {

                    })
                    .error(function (err) {

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

        Main.tpl.template({
            tplUrl: 'chat-received-tpl.html',
            data: msg,
            onReplace: function (tpl_var, data) {
                if (tpl_var === 'time') {
                    return Ns.Util.formatTime(data[tpl_var]);
                }
                if (tpl_var === 'full_name') {
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].user_id === data.user_id) {
                            return users[i].full_name;
                        }
                    }
                    return data.user_id; // else display the phone number which is the user id
                }
            },
            afterReplace: function (html, data) {}
        });

    },

    _addSent: function (content) {

        Main.tpl.template({
            tplUrl: 'chat-sent-tpl.html',
            data: content,
            onReplace: function (tpl_var, data) {

            },
            afterReplace: function (html, data) {

                var chat_body = $(Ns.msg.AbstractChat.chat_view_body).find('div[data-chat="body"]')[0];
                $(chat_body).append(html);

                var children = chat_body.children;
                var last_child = children[children.length - 1];

                var indicator = $(last_child).find('span[data-chat-sent="indicator"]')[0];
                if (data.status === 'seen') {
                    indicator.className = 'game9ja-seen';
                } else if (data.status === 'delivered') {
                    indicator.className = 'game9ja-delivered';
                } else if (data.status === 'sent') {
                    indicator.className = 'game9ja-sent';
                } else {//not sent
                    indicator.className = 'game9ja-not-sent';
                }


                Main.longpress(last_child, function () {
                    Ns.msg.AbstractChat.selectionMode = true;
                    if (!$(last_child).hasClass('game9ja-chat-message-selected')) {
                        $(last_child).addClass('game9ja-chat-message-selected');
                    }
                });

                Main.click(last_child, function () {
                    if (Ns.msg.AbstractChat.selectionMode) {
                        if (!$(last_child).hasClass('game9ja-chat-message-selected')) {
                            $(last_child).addClass('game9ja-chat-message-selected');
                        }
                    } else {
                        $(last_child).removeClass('game9ja-chat-message-selected');
                    }
                });


            }
        });

    },

    _deseleteAll: function () {
        var chat_body = $(this.chat_view_body).find('div[data-chat="body"]')[0];

        var children = chat_body.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            $(child).removeClass('game9ja-chat-message-selected');
        }
    },

    /**
     * Remove one chat message at the specified index
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
     * Find the search string on the chat view and scroll to the
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



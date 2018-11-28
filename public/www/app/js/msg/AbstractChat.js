

Ns.msg.AbstractChat = {
    chat_view: null,
    chat_view_body: null,
    chatList: [],

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

    setViewBodyID: function (chat_view_body_id) {
        this.chat_view_body = document.getElementById(chat_view_body_id);
        if (!this.chat_view_body) {
            throw Error('unknown id for chat view body - ' + chat_view_body_id);
        }
    },

    setViewID: function (view_id) {
        this.chat_view = document.getElementById(view_id);
        if (!this.chat_view) {
            throw Error('unknown id for chat view - ' + view_id);
        }
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
                var chat_body = $(html).find('[data-chat="body"]')[0];
                $(chat_body).html(''); // come back to test for correctness

                Ns.msg.AbstractChat._addContent(html, chats);

                var btn_send = $(html).find('[data-chat="send"]')[0];
                var txt_input = $(html).find('[data-chat="input-content"]')[0];
                var emoji = $(html).find('[data-chat="emoji"]')[0];

                $(btn_send).on('click', {txt_input: txt_input}, Ns.msg.AbstractChat._sendChatMessage);

                $(emoji).on('click', Ns.msg.AbstractChat._showEmoji);

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

        for (var i = 0; i < chats.length; i++) {
            var c = chats[i];

            var is_recieved_msg = true; // TODO

            if (is_recieved_msg) {
                Ns.msg.AbstractChat._addReceived(c);
            } else {
                Ns.msg.AbstractChat._addSent(c);
            }

        }

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

    _showEmoji: function () {

        alert('TODO: _showEmoji');
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

    _addReceived: function (msg) {

        Main.tpl.template({
            tplUrl: 'chat-received-tpl.html',
            data: msg,
            onReplace: function (tpl_var, data) {

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
            afterReplace: function (html, data) {}
        });

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
    showEmojis: function () {
        if (!this._validate()) {
            return;
        }


    }




};



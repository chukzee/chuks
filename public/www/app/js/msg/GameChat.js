
/* global Main, Ns */

Ns.msg.GameChat = {

    extend: 'Ns.msg.AbstractPeerToPeerChat',
    match: null,
    view_id: null,
    view_body_id: null,
    view_header_id: null,
    search_button_id: null,
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

        Main.eventio.on('game_chat', this.onChat.bind(this));
        Main.eventio.on('chat_msg_status', this.onChatMsgStatus.bind(this));
    },

    getCode: function () {
        return 'game_chat' + Ns.Util.DELIMITER + this.match.game_id;
    },

    getMsgCode: function (msg) {
        return msg._code;
    },

    setMsgCode: function (msg) {
        msg._code = this.getCode();
    },

    getSaveKeyPrefix: function () {
        return 'save_msg_game_chat';
    },

    /**
     * Override this method - called by super class
     * @param {type} match
     * @param {type} id_obj
     * @returns {undefined}
     */
    initContent: function (match, id_obj) {
        this.match = match;
        this.view_id = id_obj.view_id;
        this.view_body_id = id_obj.view_body_id;
        this.view_header_id = id_obj.view_header_id;
        this.search_button_id = id_obj.search_button_id;
    },

    getViewID: function () {
        return this.view_id;
    },

    getViewHeaderID: function () {
        return this.view_header_id;
    },

    getViewBodyID: function () {
        return this.view_body_id;
    },

    getSearchButtonID: function () {
        return this.search_button_id;
    },

    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetMessages: function (bindFn) {
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.chat.getGameChats(user_id, this.match.game_id, bindFn);
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

        var opponent_id = this.match.players[0].user_id === user_id ?
                this.match.players[1].user_id
                : this.match.players[0].user_id;

        return Main.ro.chat.sendGameChat(user_id, opponent_id, this.match.game_id, content, 'text', msg_replied_id, bindFn);
    },
          
};



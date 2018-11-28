
Ns.msg.GameChat = {

    extend: 'Ns.msg.AbstractChat',
    match: null,
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

        Main.eventio.on('game_chat', this.onChat);
        Main.eventio.on('group_chat', this.onGroupChat);
        Main.eventio.on('tournament_inhouse_chat', this.onTournamentInhouseChat);
        Main.eventio.on('tournament_general_chat', this.onTournamentGeneralChat);

    },

    /**
     * Override this method - called by super class
     * @param {type} match
     * @returns {undefined}
     */
    initContent: function (match) {
        this.match = match;
    },

    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetChats: function () {
        Main.ro.getGameChats(this.match.game_id);
    },
    /**
     * Send the chat message
     * Must override this method and return the promise of the rcall<br>
     * <br>
     * example: <br>
     *     rcallSendMessage: function(content){<br>
     *            return Main.ro.sendContactChat(user_id, contact_user_id, content, content_type); // return the promise of the rcall<br>
     *      }<br>
     * <br>
     * @returns {undefined}
     */
    rcallSendMessage: function (content) {
        
        var user_id = Ns.view.UserProfile.appUser.user_id;
        
        var opponent_id = this.match.players[0].user_id === user_id ?
                this.match.players[0].user_id
                : this.match.players[1].user_id;
                
        return Main.ro.sendGameChat(user_id, opponent_id, this.match.game_id, content, 'text');
    },
    getViewID: function () {
        return 'TODO';
    },

    getViewBodyID: function () {
        return 'TODO';
    },

    onChat: function (obj) {
        this.add(obj.data);
    },

};



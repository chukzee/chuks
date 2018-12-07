
/* global Main */

Ns.msg.TournamentInhouseChat = {

    extend: 'Ns.msg.AbstractChat',
    tournament: null,
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

        Main.eventio.on('tournament_inhouse_chat', this.onChat);

    },

    
    /**
     * Override this method - called by super class
     * @param {type} tournament
     * @returns {undefined}
     */
    initContent:function(tournament){
        this.tournament = tournament;
        document.getElementById('tournament-inhouse-chat-view-photo').src = tournament.photo_url;
        document.getElementById('tournament-inhouse-chat-view-name').innerHTML = tournament.name;
    },
    getViewID: function(){
        return 'tournament-inhouse-chat-view';
    },
    
    getViewBodyID: function(){
        return 'tournament-inhouse-chat-view-body';        
    },
    
    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetMessages: function(){    
        return Main.ro.chat.getTournamentInhouseChats(this.tournament.name);
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
    rcallSendMessage: function(content){
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.chat.sendTournamentInhouseChat(user_id, this.tournament.name, content, 'text');
    },
    onChat: function(obj){
        this.add(obj.data);
    },

  

};



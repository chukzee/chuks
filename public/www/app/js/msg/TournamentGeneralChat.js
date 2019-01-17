
/* global Main, Ns */

Ns.msg.TournamentGeneralChat = {

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

        Main.eventio.on('tournament_general_chat', this.onChat.bind(this));

    },

    getName:function(){
        return 'Ns.msg.TournamentGeneralChat';
    },

    getCode:function(){
        if(Main.util.isString(this.tournament)){
            return this.tournament;
        }
        return this.tournament.tournament_name;
    },

    getExtraCode:function(){
        return 'general';
    },

    getMsgCode: function(msg){
        return msg.tournament_name;
    },
            
    getSaveKeyPrefix(){
        return 'save_msg_tournament_general_chat';
    },
    
    /**
     * Override this method - called by super class
     * @param {type} tournament
     * @returns {undefined}
     */
    initContent:function(tournament){
        this.tournament = tournament;
        document.getElementById('tournament-general-chat-view-photo').src = tournament.photo_url;
        document.getElementById('tournament-general-chat-view-name').innerHTML = tournament.name;
    },
    getViewID: function(){
        return 'tournament-general-chat-view';
    },

    getViewHeaderID: function(){
        return "tournament-general-chat-view-header";
    },
        
    getViewBodyID: function(){
        return 'tournament-general-chat-view-body';        
    },

    getSearchButtonID: function(){
        return 'tournament-general-chat-view-search';        
    },
    
    getMenuButtonID: function(){
        return 'tournament-general-chat-view-menu';        
    },
        
    /**
     * must override this method and return the promise of the rcall<br>
     *
     * @returns {undefined}
     */
    rcallGetMessages: function(){    
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.chat.getTournamentGeneralChats(user_id, this.tournament.name);
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
    rcallSendMessage: function(content, bindFn){
        var user_id = Ns.view.UserProfile.appUser.user_id;
        return Main.ro.chat.sendTournamentGeneralChat(user_id, this.tournament.name, content, 'text', bindFn);
    },
    onChat: function(evtObj){
        this.add(evtObj.data);
    },

  

};



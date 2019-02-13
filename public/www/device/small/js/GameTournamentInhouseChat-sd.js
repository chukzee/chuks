

/* global Main, Ns */


Ns.GameTournamentInhouseChat = {

    Content: function (data) {
        Ns.msg.TournamentInhouseChat.content(data);
        
        $('#tournament-inhouse-chat-view-back-btn').off('click');
        $('#tournament-inhouse-chat-view-back-btn').on('click', function () {
            Main.page.back();
        });  
    },

};
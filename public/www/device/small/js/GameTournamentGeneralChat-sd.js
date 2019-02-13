

/* global Main, Ns */


Ns.GameTournamentGeneralChat = {

    Content: function (data) {
        Ns.msg.TournamentGeneralChat.content(data);
        
        $('#tournament-general-chat-view-back-btn').off('click');
        $('#tournament-general-chat-view-back-btn').on('click', function () {
            Main.page.back();
        });
    },

};
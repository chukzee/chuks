

/* global Main, Ns */


Ns.GameGroupChat = {

    Content: function (data) {
        Ns.msg.GroupChat.content(data);
        
        $('#group-chat-view-back-btn').off('click');
        $('#group-chat-view-back-btn').on('click', function () {
            
            Main.card.back('#home-main', function () {

            });
        });
    },

};
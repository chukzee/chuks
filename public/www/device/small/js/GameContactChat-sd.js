

/* global Main, Ns */


Ns.GameContactChat = {

    Content: function (data) {
        Ns.msg.ContactChat.content(data);
        $('#contact-chat-view-back-btn').on('click', function () {
            Main.page.back();
        });
    },

};
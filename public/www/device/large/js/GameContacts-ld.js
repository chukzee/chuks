

/* global Main, Ns */


Ns.GameContacts = {

    Content: function (data) {
        Ns.view.Contacts.content(data);
        
        $('#game-contacts-back-btn').off('click');
        $('#game-contacts-back-btn').on('click', function () {
            
            Main.card.back('#home-main', function () {

            });
        });
    },

};
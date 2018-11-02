

/* global Main, Ns */


Ns.GamePlayNotifications = {

    Content: function (data) {
        Ns.view.PlayNotifications.content(data);
        $('#game-play-notifications-back-btn').on('click', function () {
            
            Main.card.back('#home-main', function () {

            });
        });
    },

};
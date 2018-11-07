

/* global Main, Ns */


Ns.GameNotifications = {

    Content: function (data) {
        Ns.view.Notifications.content(data);
        $('#game-notifications-back-btn').on('click', function () {
            Main.page.back();
        });
    },

};
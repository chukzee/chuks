

/* global Main, Ns */


Ns.GameNotifications = {

    Content: function (data) {
        Main.tab({
            container: document.getElementById("notifications-tab-container"),
            onShow: {

                
            }
        });
        Ns.view.Notifications.content(data);
        
        $('#game-notifications-back-btn').off('click');
        $('#game-notifications-back-btn').on('click', function () {
            
            Main.card.back('#home-main', function () {

            });
        });
    },

};
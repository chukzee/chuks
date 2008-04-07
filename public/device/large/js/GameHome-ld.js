

/* global Main */

var homeObj = {
    match: 'game/MatchLive',
    //more may go below
};

Main.rcall.live(homeObj);


Main.controller.GameHome = {
    
    GAME_VIEW_HTML: 'game-view-ld.html',
    GAME_WATCH_HTML: 'game-watch-ld.html',
    
    contactsMatchKey: function () {
        return Main.controller.auth.appUser.id + ":" + "CONTACTS_MATCH_KEY";
    },
    groupMatchKey: function (group_name) {
        return Main.controller.auth.appUser.id + ":" + "GROUP_MATCH_KEY_PREFIX" + ":" + group_name;
    },
    tournamentMatchKey: function (tournament) {
        return Main.controller.auth.appUser.id + ":" + "TOURNAMENT_MATCH_KEY_PREFIX" + ":" + tournament;
    },
    showGameView: function (match_data) {
        document.getElementById("home-game-panel").innerHTML = Main.controller.UI.gameViewHtml;
        Main.controller.GameView.Content(match_data);
    },
    showGameWatch: function (match_data) {
        document.getElementById("home-game-panel").innerHTML = Main.controller.UI.gameWatchHtml;
        Main.controller.GameWatch.Content(match_data);
    },
    Content: function (data) {
        Main.controller.UI.init(data);

        checkOrientation();

 
        function checkOrientation() {

            var left_panel = document.getElementById('home-main');
            var right_panel = document.getElementById('home-game-panel');

            layoutHome();
            Main.dom.removeListener(window, 'orientationchange', layoutHome);
            Main.dom.addListener(window, 'orientationchange', layoutHome);

            function layoutHome() {

                right_panel.style.position = 'absolute';
                right_panel.style.top = 0;
                right_panel.style.bottom = 0;

                if (Main.device.isXLarge()) {

                    left_panel.style.width = '25%';

                    right_panel.style.position = 'absolute';
                    right_panel.style.top = 0;
                    right_panel.style.bottom = 0;
                    right_panel.style.left = left_panel.style.width;
                    right_panel.style.width = '75%';


                } else {

                    left_panel.style.width = '40%';

                    right_panel.style.position = 'absolute';
                    right_panel.style.top = 0;
                    right_panel.style.bottom = 0;
                    right_panel.style.left = left_panel.style.width;
                    right_panel.style.width = '60%';

                }
            }
        }
        
    }
};
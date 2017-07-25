

/* global Main */

//Main.rcall.live(homeObj);


Main.controller.GameHome = {

    GAME_VIEW_HTML: 'game-view-ld.html',
    GAME_VIEW_B_HTML: 'game-view-b-ld.html',
    GAME_WATCH_HTML: 'game-watch-ld.html',

    contactsMatchKey: function () {
        return Main.controller.UserProfile.appUser.id + ":" + "CONTACTS_MATCH_KEY";
    },
    groupMatchKey: function (group_name) {
        return Main.controller.UserProfile.appUser.id + ":" + "GROUP_MATCH_KEY_PREFIX" + ":" + group_name;
    },
    tournamentMatchKey: function (tournament) {
        return Main.controller.UserProfile.appUser.id + ":" + "TOURNAMENT_MATCH_KEY_PREFIX" + ":" + tournament;
    },
    showGameView: function (match) {

        document.getElementById("home-game-panel").innerHTML = Main.controller.UI.gameViewHtml;
        Main.controller.GameView.Content(match);


    },
    showGameViewB: function (match) {
        //show a dialog to display startup settings
        Main.dialog.show({
            title: "Play Robot", //TODO - display a robot like photo alongside the title
            content: Main.controller.UI.gameSettings(match.game_name),
            fade: true,
            buttons: ['Cancel', 'Play'],
            closeButton: false,
            modal: true,
            action: function (btn, value) {
                if (value === 'Play') {
                    document.getElementById("home-game-panel").innerHTML = Main.controller.UI.gameViewBHtml;
                    Main.controller.GameViewB.Content(match);
                }
                this.hide();
            }
        });
    },
    showGameWatch: function (match) {
        document.getElementById("home-game-panel").innerHTML = Main.controller.UI.gameWatchHtml;
        Main.controller.GameWatch.Content(match);
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

    },
    showBluetoothGame: function (data) {
        //show a dialog to display startup settings
        var container_id = 'bluetooth-dialog-continer';
        var width = window.screen.width * 0.3;
        Main.dialog.show({
            title: "Play via bluetooth", //TODO - display a robot like photo alongside the title
            content: '<div id="' + container_id + '"></div>',
            width: width < 300 ? 300 : width ,
            height: window.screen.height * 0.5,
            fade: true,
            closeButton: false,
            modal: true,
            buttons: ['Cancel'],
            action: function (btn, value) {

                if (value === 'Cancel') {
                    this.hide();
                }

            },
            onShow: function () {
                //access ui component here
                var me = this;
                Main.controller.Bluetooth.start({
                    data: data,
                    container: container_id,
                    onReady: function (data) {
                        //do some final setup on the game panel
                        
                        document.getElementById("home-game-panel").innerHTML = Main.controller.UI.gameViewBHtml;
                        Main.controller.GameViewB.Content(data);
                        
                        me.hide(); //call to close the dialog
                    }
                });


            }
        });


    },
    showTournamentDetails: function (tournament) {
        
        Main.card.to({
            container: '#home-main',
            url:'tournament-details-ld.html',
            fade:true,
            data : tournament,
            onShow: Main.controller.Tournament.content
        });        
    },
    showGroupDetails: function (group) {
        
        Main.card.to({
            container: '#home-main',
            url:'group-details-ld.html',
            fade:true,
            data : group,
            onShow: Main.controller.Group.content
        });

    },
    showPlayNotifications: function (data) {

        Main.card.to({
            container: '#home-main',
            url:'play-notifications-ld.html',
            fade:true,            
            data : data,
            onShow: Main.controller.PlayNotifications.content
        });

    },
    showInvitePlayers: function (data) {

    },
    showContacts: function (data) {
        
        Main.card.to({
            container: '#home-main',
            url:'contacts-ld.html',
            fade:true,
            data : data,
            onShow: Main.controller.Contacts.content
        });
        
    },
    showCreateGroup: function (data) {

    },
    showCreateTournament: function (data) {

    },
    showUserProfile: function (data) {
        Main.card.to({
            container: '#home-main',
            url:'user-profile-ld.html',
            fade:true,
            data : data,
            onShow: Main.controller.UserProfile.content
        });
    },
    showSettings: function (data) {

    },
    showHelp: function (data) {

    }
};
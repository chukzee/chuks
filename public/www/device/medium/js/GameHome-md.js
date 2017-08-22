

/* global Main */

//Main.rcall.live(homeObj);


Main.controller.GameHome = {

    GAME_VIEW_HTML: 'game-view-md.html',
    GAME_VIEW_B_HTML: 'game-view-b-md.html',
    GAME_WATCH_HTML: 'game-watch-md.html',
    isCurrentViewGamePane: false,
    contactsMatchKey: function () {
        return Ns.view.UserProfile.appUser.id + ":" + "CONTACTS_MATCH_KEY";
    },
    groupMatchKey: function (group_name) {
        return Ns.view.UserProfile.appUser.id + ":" + "GROUP_MATCH_KEY_PREFIX" + ":" + group_name;
    },
    tournamentMatchKey: function (tournament) {
        return Ns.view.UserProfile.appUser.id + ":" + "TOURNAMENT_MATCH_KEY_PREFIX" + ":" + tournament;
    },
    isLandscape: function () {
        return window.screen.width > window.screen.height;
    },
    home: function () {
        if (!Main.controller.GameHome.isLandscape()) {
            Main.controller.GameHome.isCurrentViewGamePanel = false;
            Main.controller.GameHome.portraitView(true);
        }
    },
    portraitView: function (fade_in) {
        var left_panel = document.getElementById('home-main');
        var right_panel = document.getElementById('home-game-panel');
        if (fade_in) {
            if (!Main.controller.GameHome.isCurrentViewGamePanel) {
                right_panel.style.display = 'none';

                left_panel.style.display = 'block';
                left_panel.style.opacity = 0;
                left_panel.style.width = '100%';
                Main.anim.to('home-main', 500, {opacity: 1});
            } else {
                left_panel.style.display = 'none';

                right_panel.style.display = 'block';
                right_panel.style.left = 0;
                right_panel.style.opacity = 0;
                right_panel.style.width = '100%';
                Main.anim.to('home-game-panel', 500, {opacity: 1});
            }
        } else {
            if (!Main.controller.GameHome.isCurrentViewGamePanel) {
                left_panel.style.width = '100%';
                right_panel.style.display = 'none';
            } else {
                right_panel.style.left = 0;
                right_panel.style.width = '100%';
                left_panel.style.display = 'none';
            }
        }
    },
    showGameView: function (match) {

        Main.controller.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameViewHtml;
        if (Main.controller.GameHome.isLandscape()) {
            Main.controller.GameView.Content(match);
        } else {
            Main.controller.GameHome.portraitView(true);
            Main.controller.GameView.Content(match);
        }
    },
    showGameViewB: function (match) {
        //show a dialog to display startup settings
        Main.dialog.show({
            title: "Play Robot", //TODO - display a robot like photo alongside the title
            content: Ns.ui.UI.gameSettings(match.game_name),
            fade: true,
            buttons: ['Cancel', 'Play'],
            closeButton: false,
            modal: true,
            action: function (btn, value) {
                if (value === 'Cancel') {
                    Main.controller.GameHome.home();
                }
                this.hide();
            }
        });

        Main.controller.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameViewBHtml;

        //hide uneccessary component
        document.getElementById("game-view-b-bluetooth-icon").style.display = 'none';


        if (Main.controller.GameHome.isLandscape()) {
            Main.controller.GameViewB.Content(match);
        } else {
            Main.controller.GameHome.portraitView(true);
            Main.controller.GameViewB.Content(match);
        }
    },
    showGameWatch: function (match) {
        Main.controller.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameWatchHtml;
        if (Main.controller.GameHome.isLandscape()) {
            Main.controller.GameWatch.Content(match);
        } else {
            Main.controller.GameHome.portraitView(true);
            Main.controller.GameWatch.Content(match);
        }
    },
    Content: function (data) {

        Ns.ui.UI.init(data);

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

                if (Main.controller.GameHome.isLandscape()) {//landscape
                    left_panel.style.width = '40%';
                    left_panel.style.display = 'block';

                    right_panel.style.width = '60%';
                    right_panel.style.left = left_panel.style.width;
                    right_panel.style.display = 'block';

                } else {//portrait
                    Main.controller.GameHome.portraitView(false);
                }
            }
        }
    },
    showBluetoothGame: function (data) {
        //show a dialog to display startup settings
        var container_id = 'bluetooth-dialog-continer';
        Main.dialog.show({
            title: "Play via bluetooth",
            content: '<div id="' + container_id + '"></div>',
            width: window.innerWidth * 0.6,
            height: window.innerHeight * 0.5,
            fade: true,
            closeButton: false,
            modal: true,
            buttons: ['Cancel'],
            action: function (btn, value) {
                if (value === 'Cancel') {
                    Main.controller.GameHome.home();
                }
                this.hide();
            },
            onShow: function () {
                //access ui component here
                var me = this;
                Ns.game.Bluetooth.start({
                    data: data,
                    container: container_id,
                    onReady: function (argu) {

                        //do some final setup on the game panel

                        me.hide(); //call to close the dialog
                    }
                });
            }
        });

        Main.controller.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameViewBHtml;

        //show bluetooth icon
        document.getElementById("game-view-b-bluetooth-icon").style.display = 'block';

        var match = {bluetooth: true, game_name: data.game};
        if (Main.controller.GameHome.isLandscape()) {
            Main.controller.GameViewB.Content(match);
        } else {
            Main.controller.GameHome.portraitView(true);
            Main.controller.GameViewB.Content(match);
        }

    },
    showTournamentDetails: function (tournament) {

        Main.card.to({
            container: '#home-main',
            url: 'tournament-details-md.html',
            fade: true,
            data: tournament,
            onShow: Ns.view.Tournament.content
        });
    },
    showGroupDetails: function (group) {

        Main.card.to({
            container: '#home-main',
            url: 'group-details-md.html',
            fade: true,
            data: group,
            onShow: Ns.view.Group.content
        });
    },
    showPlayNotifications: function (data) {

        Main.card.to({
            container: '#home-main',
            url: 'play-notifications-md.html',
            fade: true,
            data: data,
            onShow: Ns.view.PlayNotifications.content
        });
    },
    showInvitePlayers: function (data) {

    },
    showContacts: function (data) {

        Main.card.to({
            container: '#home-main',
            url: 'contacts-md.html',
            fade: true,
            data: data,
            onShow: Ns.view.Contacts.content
        });
    },
    showCreateGroup: function (data) {

    },
    showCreateTournament: function (data) {

    },
    showUserProfile: function (data) {

        Main.card.to({
            container: '#home-main',
            url: 'user-profile-md.html',
            fade: true,
            data: data,
            onShow: Ns.view.UserProfile.content
        });
    },
    showSettings: function (data) {

    },
    showHelp: function (data) {

    }
};
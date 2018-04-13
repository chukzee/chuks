

/* global Main, Ns */


Ns.GameHome = {

    GAME_LOGIN_HTML: 'game-login.html',
    GAME_VIEW_HTML: 'game-view.html',
    GAME_VIEW_B_HTML: 'game-view-b.html',
    GAME_WATCH_HTML: 'game-watch.html',
    GAME_WAIT_HTML: 'wait-player.html',

    Content: function (selected_game) {
        Ns.ui.UI.init(selected_game);
    },
    showGameView: function (match) {
        
        Ns.Match.currentUserMatch = match;
        
        Main.page.show({
            url: Ns.GameHome.GAME_VIEW_HTML,
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GameView.Content,
            data: match});

    },
    showGameViewB: function (match) {
        
        Main.page.show({
            url: Ns.GameHome.GAME_VIEW_B_HTML,
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GameViewB.Content,
            onShow: function () {
                //hide uneccessary component
                document.getElementById("game-view-b-bluetooth-icon").style.display = 'none';
            },
            data: match
        });
        
        //show a dialog to display startup settings
        Main.dialog.show({
            title: "Play Robot", //TODO - display a robot like photo alongside the title
            content: Ns.ui.UI.gameSettings(match.game_name),
            fade: true,
            buttons: ['CANCEL', 'PLAY'],
            closeButton: false,
            modal: true,
            action: function (btn, value) {
                if (value === 'CANCEL') {
                    if (Main.page.getUrl() === Ns.GameHome.GAME_VIEW_B_HTML) {
                        if (Main.page.back()) {//making sure the page is not in transition
                            this.hide();
                        }
                    } else {
                        this.hide();
                        ;
                    }
                } else {//Play clicked
                    this.hide();
                }

            }
        });



    },
    showGameWatch: function (match) {
        Main.page.show({
            url: Ns.GameHome.GAME_WATCH_HTML,
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GameWatch.Content,
            data: match
        });
    },
    showBluetoothGame: function (data) {
        
        Main.page.show({
            url: Ns.GameHome.GAME_VIEW_B_HTML,
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.GameViewB.Content,
            onShow: function () {
                //show bluetooth icon
                document.getElementById("game-view-b-bluetooth-icon").style.display = 'block';
            },
            data: {bluetooth: true, game_name: data.game}
        });

        //show a dialog to display startup settings
        var container_id = 'bluetooth-dialog-continer';
        Main.dialog.show({
            title: "Play via bluetooth",
            content: '<div id="' + container_id + '"></div>',
            width: window.innerWidth * 0.7,
            height: window.innerHeight * 0.5,
            fade: true,
            closeButton: false,
            modal: true,
            buttons: ['CANCEL'],
            action: function (btn, value) {
                if (value === 'CANCEL') {
                    if (Main.page.getUrl() === Ns.GameHome.GAME_VIEW_B_HTML) {
                        if (Main.page.back()) {//making sure the page is not in transition
                            this.hide();
                        }
                    } else {
                        this.hide();
                        ;
                    }
                }
            },
            onShow: function () {
                //access ui component here
                var me = this;
                Ns.Bluetooth.start({
                    data: data,
                    container: container_id,
                    onReady: function (argu) {

                        //do some final setup on the game panel

                        me.hide(); //call to close the dialog
                    }
                });

            }
        });



    },
    showTournamentDetails: function (tournament) {

        Main.page.show({
            url: 'tournament-details.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.Tournament.content,
            data: tournament
        });
    },
    showGroupDetails: function (group) {

        Main.page.show({
            url: 'group-details.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.Group.content,
            data: group
        });
    },
    showPlayNotifications: function (data) {

        Main.page.show({
            url: 'play-notifications.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.PlayNotifications.content,
            data: data
        });
    },
    showInvitePlayers: function (data) {

    },
    showContacts: function (data) {

        Main.page.show({
            url: 'game-contacts.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.Contacts.content,
            data: data
        });
    },
    showCreateGroup: function (data) {

    },
    showCreateTournament: function (data) {

    },
    showUserProfile: function (user) {

        Main.page.show({
            url: 'user-profile.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.UserProfile.content,
            data: user
        });
    },
    showSettings: function (data) {

    },
    showHelp: function (data) {

    }
};


/* global Main */


Main.controller.GameHome = {

    GAME_VIEW_HTML: 'game-view-sd.html',
    GAME_VIEW_B_HTML: 'game-view-b-sd.html',
    GAME_WATCH_HTML: 'game-watch-sd.html',

    contactsMatchKey: function () {
        return Ns.view.UserProfile.appUser.id + ":" + "CONTACTS_MATCH_KEY";
    },
    groupMatchKey: function (group_name) {
        return Ns.view.UserProfile.appUser.id + ":" + "GROUP_MATCH_KEY_PREFIX" + ":" + group_name;
    },
    tournamentMatchKey: function (tournament) {
        return Ns.view.UserProfile.appUser.id + ":" + "TOURNAMENT_MATCH_KEY_PREFIX" + ":" + tournament;
    },
    Content: function (data) {
        Ns.ui.UI.init(data);
    },
    showGameView: function (match) {
        Main.page.show({
            url: Main.controller.GameHome.GAME_VIEW_HTML,
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameView.Content,
            data: match});

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
                    if (Main.page.getUrl() === Main.controller.GameHome.GAME_VIEW_B_HTML) {
                        if (Main.page.back()) {//making sure the page is not in transition
                            this.hide();
                        }
                    } else {
                        this.hide();;
                    }
                } else {//Play clicked
                    this.hide();
                }

            }
        });

        Main.page.show({
            url: Main.controller.GameHome.GAME_VIEW_B_HTML,
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameViewB.Content,
            onShow: function () {
                //hide uneccessary component
                document.getElementById("game-view-b-bluetooth-icon").style.display = 'none';
            },
            data: match});



    },
    showGameWatch: function (match) {
        Main.page.show({
            url: Main.controller.GameHome.GAME_WATCH_HTML,
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameWatch.Content,
            data: match});
    },
    showBluetoothGame: function (data) {
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
            buttons: ['Cancel'],
            action: function (btn, value) {
                if (value === 'Cancel') {
                    if (Main.page.getUrl() === Main.controller.GameHome.GAME_VIEW_B_HTML) {
                        if (Main.page.back()) {//making sure the page is not in transition
                            this.hide();
                        }
                    } else {
                        this.hide();;
                    }
                }
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

        Main.page.show({
            url: Main.controller.GameHome.GAME_VIEW_B_HTML,
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Main.controller.GameViewB.Content,
            onShow: function () {
                //show bluetooth icon
                document.getElementById("game-view-b-bluetooth-icon").style.display = 'block';
            },
            data: {bluetooth: true, game_name: data.game}
        });


    },
    showTournamentDetails: function (tournament) {

        Main.page.show({
            url: 'tournament-details-sd.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.Tournament.content,
            data: tournament
        });
    },
    showGroupDetails: function (group) {

        Main.page.show({
            url: 'group-details-sd.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.Group.content,
            data: group
        });
    },
    showPlayNotifications: function (data) {

        Main.page.show({
            url: 'play-notifications-sd.html',
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
            url: 'contacts-sd.html',
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
    showUserProfile: function (data) {

        Main.page.show({
            url: 'user-profile-sd.html',
            effect: "slideleft",
            duration: 500,
            onBeforeShow: Ns.view.UserProfile.content,
            data: data
        });
    },
    showSettings: function (data) {

    },
    showHelp: function (data) {

    }
};
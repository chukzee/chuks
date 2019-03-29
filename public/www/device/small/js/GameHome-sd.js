

/* global Main, Ns */


Ns.GameHome = {

    GAME_LOGIN_HTML: 'game-login.html',
    GAME_VIEW_HTML: 'game-view.html',
    GAME_VIEW_B_HTML: 'game-view-b.html',
    GAME_WATCH_HTML: 'game-watch.html',
    GAME_WAIT_HTML: 'wait-player.html',

    constructor: function () {
        window.oncontextmenu = function () {
            return false;
        };

        Ns.Auth.login();

    },
    
    show: function () {
        Main.page.show({
            url: "game-home.html",
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 3000,
            onBeforeShow: Ns.GameHome.Content.bind(Ns.GameHome),
            data: Ns.ui.UI.selectedGame
        });

    },
    
    switchGame: function (game) {
                 
        //note Main.page.removeAndShow will not work if we are targeting the same page url so we will use Main.card.removeTo         
        Main.card.removeTo({
            container: '#home-layout',
            url: "game-home.html",
            fade: true,
            data: game,
            onShow: Ns.GameHome.Content.bind(Ns.GameHome)
        });

    },
    
    back: function (obj) {

        if (obj) {
            var o = {};
            o.onBeforeShow = obj.onBeforeShow || obj.onShow;
            o.data = obj.data;
            Main.page.back(o);
        } else {
            Main.page.back();
        }
    },

    removeAndShowGroupDetails: function (group) {

        Main.page.removeAndShow({
            url: 'group-details.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameGroup.Content,
            data: group
        });
    },

    removeAndShowTournamentDetails: function (tournament) {

        Main.page.removeAndShow({
            url: 'tournament-details.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameTournament.Content,
            data: tournament
        });
    },

    Content: function (selected_game) {
        Ns.ui.UI.init(selected_game);
    },
    showGameView: function (match) {

        Ns.Match.currentUserMatch = match;

        Main.page.show({
            url: Ns.GameHome.GAME_VIEW_HTML,
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameView.Content.bind(Ns.GameView),
            data: match});

    },
    showGameViewB: function (match) {

        Main.page.show({
            url: Ns.GameHome.GAME_VIEW_B_HTML,
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameViewB.Content.bind(Ns.GameViewB),
            onShow: function () {
                //hide uneccessary component
                document.getElementById("game-view-b-bluetooth-icon").style.display = 'none';
            },
            data: match
        });

    },
    showGameWatch: function (match) {
        Main.page.show({
            url: Ns.GameHome.GAME_WATCH_HTML,
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameWatch.Content.bind(Ns.GameWatch),
            data: match
        });
    },
    showBluetoothGame: function (data) {

        Main.page.show({
            url: Ns.GameHome.GAME_VIEW_B_HTML,
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameViewB.Content.bind(Ns.GameViewB),
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
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameTournament.Content,
            data: tournament
        });
    },
    showGroupDetails: function (group) {

        Main.page.show({
            url: 'group-details.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameGroup.Content,
            data: group
        });
    },
    showNotifications: function (data) {

        Main.page.show({
            url: 'notifications.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameNotifications.Content,
            data: data
        });
    },
    showInvitePlayers: function (data) {

    },
    showContacts: function (data) {

        Main.page.show({
            url: 'game-contacts.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameContacts.Content,
            data: data
        });
    },
    showContactChat: function (contact) {

        Main.page.show({
            url: 'contact-chat-view.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameContactChat.Content,
            onHide: Ns.msg.ContactChat.onHide.bind(Ns.msg.ContactChat),
            data: contact
        });

    },

    showGroupChat: function (group) {

        Main.page.show({
            url: 'group-chat-view.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameGroupChat.Content,
            onHide: Ns.msg.GroupChat.onHide.bind(Ns.msg.GroupChat),
            data: group
        });

    },

    showTournamentGeneralChat: function (tournament) {

        Main.page.show({
            url: 'tournament-general-chat-view.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameTournamentGeneralChat.Content,
            onHide: Ns.msg.TournamentGeneralChat.onHide.bind(Ns.msg.TournamentGeneralChat),
            data: tournament
        });
    },

    showTournamentInhouseChat: function (tournament) {

        Main.page.show({
            url: 'tournament-inhouse-chat-view.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameTournamentInhouseChat.Content,
            onHide: Ns.msg.TournamentInhouseChat.onHide.bind(Ns.msg.TournamentInhouseChat),
            data: tournament
        });
    },

    showCreateGroup: function (data) {

        Main.page.show({
            url: 'create-group.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameCreateGroup.Content,
            data: data
        });

    },
    showCreateTournament: function (data) {

        Main.page.show({
            url: 'create-tournament.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameCreateTournament.Content,
            data: data
        });

    },

    showEditGroup: function (data) {

        Main.page.show({
            url: 'edit-group.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameEditGroup.Content,
            data: data
        });

    },

    showEditTournament: function (data) {

        Main.page.show({
            url: 'edit-tournament.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameEditTournament.Content,
            data: data
        });

    },

    showUserProfile: function (user) {

        Main.page.show({
            url: 'user-profile.html',
            effect: "fade", //we will now use fade since slide effect has performace issue for large page content
            duration: 300,
            onBeforeShow: Ns.GameUserProfile.Content,
            data: user
        });
    },
    showSettings: function (data) {

    },
    showHelp: function (data) {

    }
};
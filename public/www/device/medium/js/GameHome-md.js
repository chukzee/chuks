

/* global Main, Ns */

//Main.rcall.live(homeObj);


Ns.GameHome = {

    GAME_LOGIN_HTML: 'game-login-md.html',
    GAME_VIEW_HTML: 'game-view-md.html',
    GAME_VIEW_B_HTML: 'game-view-b-md.html',
    GAME_WATCH_HTML: 'game-watch-md.html',
    GAME_WAIT_HTML: 'wait-player-md.html',
    isCurrentViewGamePane: false,
    isLayoutHomeListenerAdded: false,

    show: function () {

        Main.page.show({
            container: '#home-main',
            url: "game-home-md.html",
            fade: true,
            data: Ns.ui.UI.selectedGame,
            onShow: Ns.GameHome.Content
        });

    },

    switchGame: function (game) {

        Main.card.removeTo({
            container: '#home-layout',
            url: "game-home-md.html",
            fade: true,
            data: game,
            onShow: Ns.GameHome.Content
        });

    },

    back: function (obj) {
        if (!obj.container) {
            obj.container = '#home-main';
        }

        Main.card.back(obj);
    },

    removeAndShowGroupDetails: function (group) {

        Main.card.removeTo({
            container: '#home-main',
            url: 'group-details.html',
            fade: true,
            data: group,
            onShow: Ns.GameGroup.Content
        });
    },

    removeAndShowTournamentDetails: function (tournament) {

        Main.card.removeTo({
            container: '#home-main',
            url: 'tournament-details.html',
            fade: true,
            data: tournament,
            onShow: Ns.GameTournament.Content
        });
    },

    isLandscape: function () {
        return window.screen.width > window.screen.height;
    },
    home: function () {
        if (!Ns.GameHome.isLandscape()) {
            Ns.GameHome.isCurrentViewGamePanel = false;
            Ns.GameHome.portraitView(true);
        }
    },
    portraitView: function (fade_in) {
        var left_panel = document.getElementById('home-main');
        var right_panel = document.getElementById('home-game-panel');
        if (fade_in) {
            if (!Ns.GameHome.isCurrentViewGamePanel) {
                right_panel.style.display = 'none';

                left_panel.style.display = 'block';
                left_panel.style.opacity = 0;
                left_panel.style.width = '100%';
                Main.anim.to('home-main', 300, {opacity: 1});
            } else {
                left_panel.style.display = 'none';

                right_panel.style.display = 'block';
                right_panel.style.left = 0;
                right_panel.style.opacity = 0;
                right_panel.style.width = '100%';
                Main.anim.to('home-game-panel', 300, {opacity: 1});
            }
        } else {
            if (!Ns.GameHome.isCurrentViewGamePanel) {
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

        Ns.Match.currentUserMatch = match;

        Ns.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameViewHtml;
        if (Ns.GameHome.isLandscape()) {
            Ns.GameView.Content(match);
        } else {
            Ns.GameHome.portraitView(true);
            Ns.GameView.Content(match);
        }
    },
    showGameViewB: function (match) {

        Ns.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameViewBHtml;

        //hide uneccessary component
        document.getElementById("game-view-b-bluetooth-icon").style.display = 'none';


        if (Ns.GameHome.isLandscape()) {
            Ns.GameViewB.Content(match);
        } else {
            Ns.GameHome.portraitView(true);
            Ns.GameViewB.Content(match);
        }
    },
    showGameWatch: function (match) {
        Ns.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameWatchHtml;
        if (Ns.GameHome.isLandscape()) {
            Ns.GameWatch.Content(match);
        } else {
            Ns.GameHome.portraitView(true);
            Ns.GameWatch.Content(match);
        }
    },
    layoutHome: function () {

        var left_panel = document.getElementById('home-main');
        var right_panel = document.getElementById('home-game-panel');

        right_panel.style.position = 'absolute';
        right_panel.style.top = 0;
        right_panel.style.bottom = 0;

        if (Ns.GameHome.isLandscape()) {//landscape
            
            left_panel.style.width = '40%';
            left_panel.style.display = 'block';

            right_panel.style.width = '60%';
            right_panel.style.left = left_panel.style.width;
            right_panel.style.display = 'block';
            
            var gameObj = Ns.Util.getGameObject(Ns.ui.UI.selectedGame);
            if (!gameObj.config) {
                return Ns.Robot.showGame();
            }
            Main.event.fire(Ns.Const.EVT_LAYOUT_GAME_PANEL);
            
            $('.game9ja-portrait-only').hide();

        } else {//portrait
            Ns.GameHome.portraitView(false);
            
            $('.game9ja-portrait-only').show();
        }
    },
    checkOrientation: function () {

        Ns.GameHome.layoutHome();
        if (!Ns.GameHome.isLayoutHomeListenerAdded) {
            Main.dom.addListener(window, 'resize', Ns.GameHome.layoutHome);
            Ns.GameHome.isLayoutHomeListenerAdded = true;
        }
        window.onresize = Ns.GameHome.layoutHome;

    },

    Content: function (selected_game) {

        Ns.ui.UI.init(selected_game);

        Ns.GameHome.checkOrientation();
        
    },
    showBluetoothGame: function () {
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
            buttons: ['CANCEL'],
            action: function (btn, value) {
                if (value === 'CANCEL') {
                    Ns.GameHome.home();
                }
                this.hide();
            },
            onShow: function () {
                //access ui component here
                var me = this;
                Ns.Bluetooth.start({
                    data: Ns.ui.UI.selectedGame,
                    container: container_id,
                    onReady: function (argu) {

                        //do some final setup on the game panel

                        me.hide(); //call to close the dialog
                    }
                });
            }
        });

        Ns.GameHome.isCurrentViewGamePanel = true;
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameViewBHtml;

        //show bluetooth icon
        document.getElementById("game-view-b-bluetooth-icon").style.display = 'block';

        var match = {bluetooth: true, game_name: Ns.ui.UI.selectedGame};
        if (Ns.GameHome.isLandscape()) {
            Ns.GameViewB.Content(match);
        } else {
            Ns.GameHome.portraitView(true);
            Ns.GameViewB.Content(match);
        }

    },
    showTournamentDetails: function (tournament) {

        Main.card.to({
            container: '#home-main',
            url: 'tournament-details.html',
            fade: true,
            data: tournament,
            onShow: Ns.GameTournament.Content
        });
    },
    showGroupDetails: function (group) {

        Main.card.to({
            container: '#home-main',
            url: 'group-details.html',
            fade: true,
            data: group,
            onShow: Ns.GameGroup.Content
        });
    },
    showNotifications: function () {

        Main.card.to({
            container: '#home-main',
            url: 'notifications.html',
            fade: true,
            data: Ns.ui.UI.selectedGame,
            onShow: Ns.GameNotifications.Content
        });
    },
    showInvitePlayers: function () {

    },
    showContacts: function () {

        Main.card.to({
            container: '#home-main',
            url: 'game-contacts.html',
            fade: true,
            data: Ns.ui.UI.selectedGame,
            onShow: Ns.GameContacts.Content
        });
    },
    showContactChat: function (contact) {

        Main.card.to({
            container: '#home-main',
            url: 'contact-chat-view.html',
            fade: true,
            data: contact,
            onShow: Ns.GameContactChat.Content,
            onHide: Ns.msg.ContactChat.onHide.bind(Ns.msg.ContactChat)
        });

    },
    showGroupChat: function (group) {

        Main.card.to({
            container: '#home-main',
            url: 'group-chat-view.html',
            fade: true,
            data: group,
            onShow: Ns.GameGroupChat.Content,
            onHide: Ns.msg.GroupChat.onHide.bind(Ns.msg.GroupChat)
        });

    },
    showTournamentGeneralChat: function (tournament) {

        Main.card.to({
            container: '#home-main',
            url: 'tournament-general-chat-view.html',
            fade: true,
            data: tournament,
            onShow: Ns.GameTournamentGeneralChat.Content,
            onHide: Ns.msg.TournamentGeneralChat.onHide.bind(Ns.msg.TournamentGeneralChat)
        });

    },

    showTournamentInhouseChat: function (tournament) {

        Main.card.to({
            container: '#home-main',
            url: 'tournament-inhouse-chat-view.html',
            fade: true,
            data: tournament,
            onShow: Ns.GameTournamentInhouseChat.Content,
            onHide: Ns.msg.TournamentInhouseChat.onHide.bind(Ns.msg.TournamentInhouseChat)
        });

    },

    showCreateGroup: function (data) {

        Main.card.to({
            container: '#home-main',
            url: 'create-group.html',
            fade: true,
            data: data,
            onShow: Ns.GameCreateGroup.Content
        });

    },

    showCreateTournament: function (data) {

        Main.card.to({
            container: '#home-main',
            url: 'create-tournament.html',
            fade: true,
            data: data,
            onShow: Ns.GameCreateTournament.Content
        });

    },

    showEditGroup: function (data) {

        Main.card.to({
            container: '#home-main',
            url: 'edit-group.html',
            fade: true,
            data: data,
            onShow: Ns.GameEditGroup.Content
        });

    },

    showEditTournament: function (data) {

        Main.card.to({
            container: '#home-main',
            url: 'edit-tournament.html',
            fade: true,
            data: data,
            onShow: Ns.GameEditTournament.Content
        });

    },

    showUserProfile: function (user) {

        Main.card.to({
            container: '#home-main',
            url: 'user-profile.html',
            fade: true,
            data: user,
            onShow: Ns.GameUserProfile.Content
        });
    },
    showSettings: function () {

    },
    showHelp: function () {

    }
};
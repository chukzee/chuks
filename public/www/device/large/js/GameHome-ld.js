

/* global Main, Ns */

//Main.rcall.live(homeObj);


Ns.GameHome = {
    
    GAME_LOGIN_HTML: 'game-login-ld.html',
    GAME_VIEW_HTML: 'game-view-ld.html',
    GAME_VIEW_B_HTML: 'game-view-b-ld.html',
    GAME_WATCH_HTML: 'game-watch-ld.html',
    GAME_WAIT_HTML: 'wait-player-ld.html',

    showGameView: function (match) {

        Ns.Match.currentUserMatch = match;
        
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameViewHtml;
        Ns.GameView.Content(match);


    },
    showGameViewB: function (match) {
        //show a dialog to display startup settings
        Main.dialog.show({
            title: "Play Robot", //TODO - display a robot like photo alongside the title
            content: Ns.ui.UI.gameSettings(match.game_name),
            fade: true,
            buttons: ['CANCEL', 'PLAY'],
            closeButton: false,
            modal: true,
            action: function (btn, value) {
                if (value === 'PLAY') {
                    
                    document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameViewBHtml;

                    //hide uneccessary component
                    document.getElementById("game-view-b-bluetooth-icon").style.display = 'none';
                    
                    Ns.GameViewB.Content(match);
                }
                this.hide();
            }
        });
    },
    showGameWatch: function (match) {
        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameWatchHtml;
        Ns.GameWatch.Content(match);
    },
    Content: function (selected_game) {
        Ns.ui.UI.init(selected_game);

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
    showBluetoothGame: function () {
        //show a dialog to display startup settings
        var container_id = 'bluetooth-dialog-continer';
        var width = window.innerWidth * 0.3;
        Main.dialog.show({
            title: "Play via bluetooth",
            content: '<div id="' + container_id + '"></div>',
            width: width < 300 ? 300 : width ,
            height: window.screen.height * 0.5,
            fade: true,
            closeButton: false,
            modal: true,
            buttons: ['CANCEL'],
            action: function (btn, value) {

                if (value === 'CANCEL') {
                    this.hide();
                }

            },
            onShow: function () {
                //access ui component here
                var me = this;
                Ns.Bluetooth.start({
                    data: Ns.ui.UI.selectedGame,
                    container: container_id,
                    onReady: function (data) {
                        //do some final setup on the game panel
                        
                        document.getElementById("home-game-panel").innerHTML = Ns.ui.UI.gameViewBHtml;

                        //show bluetooth icon
                        document.getElementById("game-view-b-bluetooth-icon").style.display = 'block';
                        
                        Ns.GameViewB.Content(data);
                        
                        me.hide(); //call to close the dialog
                    }
                });


            }
        });


    },
    showTournamentDetails: function (tournament) {
        
        Main.card.to({
            container: '#home-main',
            url:'tournament-details.html',
            fade:true,
            data : tournament,
            onShow: Ns.GameTournament.Content
        });        
    },
    showGroupDetails: function (group) {
        
        Main.card.to({
            container: '#home-main',
            url:'group-details.html',
            fade:true,
            data : group,
            onShow: Ns.GameGroup.Content
        });

    },
    showNotifications: function () {

        Main.card.to({
            container: '#home-main',
            url:'notifications.html',
            fade:true,            
            data : Ns.ui.UI.selectedGame,
            onShow: Ns.GameNotifications.Content
        });

    },
    showInvitePlayers: function () {

    },
    showContacts: function () {
        
        Main.card.to({
            container: '#home-main',
            url:'game-contacts.html',
            fade:true,
            data : Ns.ui.UI.selectedGame,
            onShow: Ns.GameContacts.Content
        });
        
    },
    showCreateGroup: function () {

    },
    showCreateTournament: function () {

    },
    showUserProfile: function (user) {
        Main.card.to({
            container: '#home-main',
            url:'user-profile.html',
            fade:true,
            data : user,
            onShow: Ns.GameUserProfile.Content
        });
    },
    showSettings: function () {

    },
    showHelp: function () {

    }
};
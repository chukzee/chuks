
/* global Main */

Ns.ui.UI = {

    gameViewHtml: null, //set dynamically depending on the device category

    gameViewBHtml: null, //set dynamically depending on the device category

    gameWatchHtml: null, //set dynamically depending on the device category
    
    init: function (data) {
        var game_name;

        switch (data.game) {
            case 'chess':
                {
                    game_name = 'Chess';
                }
                break;
            case 'draft':
                {
                    game_name = 'Draft';
                }
                break;
            case 'ludo':
                {
                    game_name = 'Ludo';
                }
                break;
            case 'solitaire':
                {
                    game_name = 'Solitaire';
                }
                break;
            case 'whot':
                {
                    game_name = 'Whot';
                }
                break;

        }

        document.getElementById("home-game-name").innerHTML = game_name;

        Main.tab({
            container: document.getElementById("home-tab-container"),
            onShow: {
                //"#home-contacts-matches": contactsMatchList,
                //"#home-groups-matches": groupsMatchList,
                //"#home-tournaments-matches": tournamentsMatchList
            }
        });

        Main.menu.create({
            width: 220,
            target: "#home-menu",
            items: [
                'My game',
                'Play notifications',
                'Play robot',
                'Bluetooth game',
                'Invite players',
                'Contacts',
                'Create group',
                'Create tournament',
                'Profile',
                'Select game',
                'Settings',
                'Help'
            ],
            onSelect: function (evt) {
                var item = this.item;
                Ns.ui.UI.showByMenuItem(item, data);
                //finally hide the menu
                this.hide();
            }
        });

        //create the group drop down menu.

        //the groupt items of the dropdown menu.
        var groupItems = function (groups) {
            var arr = [];
            for (var n in groups) {
                arr.push('<img onerror="Main.helper.loadDefaultGroupPhoto(event)" src = "' + groups[n].photo + '" style="width:30px; height:30px;" /><span>' + groups[n].name + '</span>');
            }
            return arr;
        };

        Main.menu.create({
            width: 220,
            target: "#home-group-dropdown-menu",
            header: 'Jump to group',
            items: groupItems(Ns.view.UserProfile.appUser.groupsBelong),
            onSelect: function (evt) {
                var item = this.item;

                //finally hide the menu
                this.hide();
            }
        });

        //create the tournament drop down menu.
        Main.menu.create({
            width: 220,
            height: 0.6 * window.innerHeight,//we have deprecated the use of window.screen.height and even window.outerHeight
            target: "#home-tournament-dropdown-menu",
            header: 'Search tournaments',
            items: [
                '<input type="text" placeholder="find by name..." style="width: 100%;">'
            ],
            onSelect: function (evt) {
                var item = this.item;
                //var items = this.getItems();

            },
            onShow: function () {


            }
        });

        Ns.game.Match.contactsMatchList();
        Ns.game.Match.groupMatchList();
        Ns.game.Match.tournamentMatchList();

        Ns.ui.GamePanel.setupOnHome();



        $('#home-contacts-icon').on('click', function (evt) {
            Main.controller.GameHome.showContacts(data);
        });

        $('#home-group-header').on('click', function (evt) {
            if (evt.target.id === 'home-group-name'
                    || evt.target.id === 'home-group-status-message') {
                var group = document.getElementById('home-group-name').innerHTML;
                Main.controller.GameHome.showGroupDetails(group);
            } else if (evt.target.id === 'home-group-pic') {
                var group = document.getElementById('home-group-name').innerHTML;
                Ns.ui.UI.expandPhoto({type: 'group', id: group});
            }
        });


        $('#home-tournament-header').on('click', function (evt) {
            if (evt.target.id === 'home-tournament-name') {
                var tourn = document.getElementById('home-tournament-name').innerHTML;
                Main.controller.GameHome.showTournamentDetails(tourn);
            } else if (evt.target.id === 'home-tournament-pic') {
                var tourn = document.getElementById('home-tournament-name').innerHTML;
                Ns.ui.UI.expandPhoto({type: 'tournament', id: tourn});
            }
        });

        var group_index = 0;
        var tourn_index = 0;

        $('#home-group-previous').on('click', function () {

            var group;
            if (group_index > 0) {
                group_index--;
            }
            group = Ns.view.UserProfile.appUser.groupsBelong[group_index];

            if (!group) {
                return;
            }

            Ns.game.Match.groupMatchList(group);

        });

        $('#home-group-next').on('click', function () {
            var group;
            if (group_index < Ns.view.UserProfile.appUser.groupsBelong.length - 1) {
                group_index++;
            }

            group = Ns.view.UserProfile.appUser.groupsBelong[group_index];

            if (!group) {
                return;
            }

            Ns.game.Match.groupMatchList(group);

        });

        $('#home-tournament-previous').on('click', function () {
            var tourn;
            if (tourn_index > 0) {
                tourn_index--;
            }

            tourn = Ns.view.UserProfile.appUser.tournamentList[tourn_index];

            if (!tourn) {
                return;
            }

            Ns.game.Match.tournamentMatchList(tourn);

        });

        $('#home-tournament-next').on('click', function () {
            var tourn;
            if (tourn_index < Ns.view.UserProfile.appUser.tournamentList.length - 1) {
                tourn_index++;
            }

            tourn = Ns.view.UserProfile.appUser.tournamentList[tourn_index];

            if (!tourn) {
                return;
            }

            Ns.game.Match.tournamentMatchList(tourn);

        });

    },

    showByMenuItem: function (item, data) {

        switch (item) {
            case 'My Game':
                var m = Ns.game.Match.currentUserMatch;
                if (m && (m.game_status.toLowercase() !== 'end')) {
                    Main.controller.GameHome.showGameView(m);
                } else {
                    var Play_Notifications = 'Play Notifications';
                    var Invite_Players = 'Invite Players';
                    Main.confirm(function (option) {
                        if (option === Play_Notifications) {
                            Main.controller.GameHome.showPlayNotifications(data);
                        } else if (option === Invite_Players) {
                            Main.controller.GameHome.showInvitePlayers(data);
                        }
                    }, 'Sorry! You do not have any active game session!'
                            , 'NO ACTIVE GAME'
                            , [Play_Notifications, Invite_Players]);

                }
                break;
            case 'Play notifications':
                Main.controller.GameHome.showPlayNotifications(data);
                break;
            case 'Play robot':
                var m = Ns.game.Match.currentUserMatch;

                Main.controller.GameHome.showGameViewB({robot: true, game_name: data.game});//TESTING - TO BE REMOVE
                return;//TESTING - TO BE REMOVE

                if (m && (m.game_status.toLowercase() !== 'live')) {
                    Main.controller.GameHome.showGameViewB({robot: true, game_name: data.game});
                } else {
                    var Back_to_My_Game = 'Back to My Game';
                    Main.confirm(function (option) {
                        if (option === 'Back to My Game') {
                            Main.controller.GameHome.showGameView(m);
                        }
                    }, 'Sorry! You currently have a live game session!<br/> You cannot have more than one live game session running at the same time.'
                            , 'NOT ALLOWED'
                            , ['Cancel', Back_to_My_Game], false);


                }
                break;
            case 'Bluetooth game':
                Main.controller.GameHome.showBluetoothGame(data);
                break;
            case 'Invite players':
                Main.controller.GameHome.showInvitePlayers(data);
                break;
            case 'Contacts':
                Main.controller.GameHome.showContacts(data);
                break;
            case 'Create group':
                Main.controller.GameHome.showCreateGroup(data);
                break;
            case 'Create tournament':
                Main.controller.GameHome.showCreateTournament(data);
                break;
            case 'Profile':
                Main.controller.GameHome.showUserProfile(data);
                break;
            case 'Select game':
                Main.page.home();//to the index page
                break;
            case 'Settings':
                Main.controller.GameHome.showSettings(data);
                break;
            case 'Help':
                Main.controller.GameHome.showHelp(data);
                break;
            default:

                break;
        }
    },

    expandPhoto: function (obj) {
        if (obj.type === 'user') {

        } else if (obj.type === 'group') {

        } else if (obj.type === 'tournament') {

        }
    },

    inputMsgHtml: function () {
        return '<div class="game9ja-message-input">'
                + '<div>'
                + '<div><i class="fa fa-smile-o"></i> </div>'
                + '<div>'
                + '<textarea placeholder="Write a message..."></textarea>'
                + '</div>'
                + '</div>'
                + '<i class="fa fa-send"></i> '
                + '</div>';
    },

    gameSettings: function (game_name) {


        return "Startup setting html goes here - e.g set difficulty, set timer control, <br/>select board and piece theme (theme will be show in <br/>the same dialog for user to pick) ";
    },
    voiceMessageHtml: function (data_url, data_size) {

        console.log('TODO voiceMessageHtml ');

        return 'TODO voiceMessageHtml ';
    },
};


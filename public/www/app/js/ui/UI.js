
/* global Main, Ns */

Ns.ui.UI = {

    selectedGame: 'chess', //default is chess - set dynamically  when the user selects a type of game e.g chess, draft e.tc

    gameViewHtml: null, //set dynamically depending on the device category

    gameViewBHtml: null, //set dynamically depending on the device category

    gameWatchHtml: null, //set dynamically depending on the device category

    init: function (selected_game) {
        if (selected_game) {
            this.selectedGame = selected_game;
        }

        //to sentence case e.g chess --> Chess
        var game_name = this.selectedGame.substring(0, 1).toUpperCase()
                + this.selectedGame.substring(1).toLowerCase();


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
                'Notifications', //all forms of notifications e.g play request notifications , group join requests sent by group admin, tournament game reminder e.tc. This shows a list view of mixed items. ie list items of different type of request.
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
                Ns.ui.UI.showByMenuItem(item);
                //finally hide the menu
                this.hide();
            }
        });

        //create the group drop down menu.

        //the groupt items of the dropdown menu.
        var groupItems = function (user, callback) {

            Ns.view.Group.getGroupsInfo(user, function (groups) {
                var arr = [];
                for (var n in groups) {
                    arr.push('<img onerror="Main.helper.loadDefaultGroupPhoto(event)" src = "' + groups[n].photo_url + '" style="width:30px; height:30px;" /><span>' + groups[n].name + '</span>');
                }
                if (Main.util.isFunc(callback)) {
                    callback(arr);
                }
                return arr;
            });

        };

        Main.menu.create({
            width: 220,
            target: "#home-group-dropdown-menu",
            header: 'Jump to group',
            items: null, //pls wait till onShow event is called since the items may not be ready 
            onSelect: function (evt) {
                var item = this.item;

                //finally hide the menu
                this.hide();
            },
            onShow: function () {
                var me = this;
                groupItems(Ns.view.UserProfile.appUser, function (items_arr) {
                    me.setItems(items_arr);
                });
            }
        });

        //create the tournament drop down menu.
        Main.menu.create({
            width: 220,
            height: 0.6 * window.innerHeight, //we have deprecated the use of window.screen.height and even window.outerHeight
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
            Ns.GameHome.showContacts();
        });

        $('#home-group-header').on('click', function (evt) {
            if (evt.target.id === 'home-group-name'
                    || evt.target.id === 'home-group-status-message') {
                var group = document.getElementById('home-group-name').innerHTML;
                Ns.GameHome.showGroupDetails(group);
            } else if (evt.target.id === 'home-group-pic') {
                var group = document.getElementById('home-group-name').innerHTML;
                Ns.ui.UI.expandPhoto({type: 'group', id: group});
            }
        });


        $('#home-tournament-header').on('click', function (evt) {
            if (evt.target.id === 'home-tournament-name') {
                var tourn = document.getElementById('home-tournament-name').innerHTML;
                Ns.GameHome.showTournamentDetails(tourn);
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
            group = Ns.view.UserProfile.appUser.groups_belong[group_index];

            if (!group) {
                return;
            }

            Ns.game.Match.groupMatchList(group);

        });

        $('#home-group-next').on('click', function () {
            var group;
            if (group_index < Ns.view.UserProfile.appUser.groups_belong.length - 1) {
                group_index++;
            }

            group = Ns.view.UserProfile.appUser.groups_belong[group_index];

            if (!group) {
                return;
            }

            Ns.game.Match.groupMatchList(group, group_index);

        });

        $('#home-tournament-previous').on('click', function () {
            var tourn;
            if (tourn_index > 0) {
                tourn_index--;
            }

            tourn = Ns.view.Tournament.tournamentList[tourn_index];

            if (!tourn) {
                return;
            }

            Ns.game.Match.tournamentMatchList(tourn);

        });

        $('#home-tournament-next').on('click', function () {
            var tourn;
            if (tourn_index < Ns.view.Tournament.tournamentList.length - 1) {
                tourn_index++;
            }

            tourn = Ns.view.Tournament.tournamentList[tourn_index];

            if (!tourn) {
                return;
            }

            Ns.game.Match.tournamentMatchList(tourn);

        });

    },

    getView: function (file, callback) {
        if (!Ns.ui._views_list) {
            Ns.ui._views_list = {};
        }
        if (Ns.ui._views_list[file]) {
            return callback(null, Ns.ui._views_list[file]);// node style
        }
        Main.ajax.get('device/' + Main.device.getCategory() + '/' + file,
                function (html) {
                    Ns.ui._views_list[file] = html;
                    callback(null, html);// node style
                },
                function (err) {
                    callback(err);// node style
                });
    },

    showByMenuItem: function (item) {

        switch (item) {
            case 'My Game':
                var m = Ns.game.Match.currentUserMatch;
                if (m && (m.game_status.toLowercase() !== 'end')) {
                    Ns.GameHome.showGameView(m);
                } else {
                    var Play_Notifications = 'Play Notifications';
                    var Invite_Players = 'Invite Players';
                    Main.confirm(function (option) {
                        if (option === Play_Notifications) {
                            Ns.GameHome.showPlayNotifications();
                        } else if (option === Invite_Players) {
                            Ns.GameHome.showInvitePlayers();
                        }
                    }, 'Sorry! You do not have any active game session!'
                            , 'NO ACTIVE GAME'
                            , [Play_Notifications, Invite_Players]);

                }
                break;
            case 'Play notifications':
                Ns.GameHome.showPlayNotifications();
                break;
            case 'Play robot':
                var m = Ns.game.Match.currentUserMatch;

                Ns.GameHome.showGameViewB({robot: true, game_name: Ns.ui.UI.selectedGame});//TESTING - TO BE REMOVE
                return;//TESTING - TO BE REMOVE

                if (m && (m.game_status.toLowercase() !== 'live')) {
                    Ns.GameHome.showGameViewB({robot: true, game_name: Ns.ui.UI.selectedGame});
                } else {
                    var Back_to_My_Game = 'Back to My Game';
                    Main.confirm(function (option) {
                        if (option === 'Back to My Game') {
                            Ns.GameHome.showGameView(m);
                        }
                    }, 'Sorry! You currently have a live game session!<br/> You cannot have more than one live game session running at the same time.'
                            , 'NOT ALLOWED'
                            , ['Cancel', Back_to_My_Game], false);


                }
                break;
            case 'Bluetooth game':
                Ns.GameHome.showBluetoothGame();
                break;
            case 'Invite players':
                Ns.GameHome.showInvitePlayers();
                break;
            case 'Contacts':
                Ns.GameHome.showContacts();
                break;
            case 'Create group':
                Ns.GameHome.showCreateGroup();
                break;
            case 'Create tournament':
                Ns.GameHome.showCreateTournament();
                break;
            case 'Profile':
                Ns.GameHome.showUserProfile();
                break;
            case 'Select game':
                Main.page.home();//to the index page
                break;
            case 'Settings':
                Ns.GameHome.showSettings();
                break;
            case 'Help':
                Ns.GameHome.showHelp();
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


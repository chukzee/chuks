
/* global Main, Ns */

Ns.ui.UI = {

    selectedGame: 'chess', //default is chess - set dynamically  when the user selects a type of game e.g chess, draughts e.tc

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

        var mainMenuItems = [
                'Play robot',
                'Notifications', //all forms of notifications e.g play request notifications , group join requests sent by group admin, tournament game reminder e.tc. This shows a list view of mixed items. ie list items of different type of request.
                'Bluetooth game',
                'Invite players',
                'Contacts',
                'Create group',
                'Create tournament',
                'Profile',
                'Settings',
                'Help'
            ];
            
        if(this.selectedGame === 'chess'){
            mainMenuItems.unshift('Change draughts variant');
            mainMenuItems.unshift('Switch to draughts');
        }else if(this.selectedGame === 'draughts'){
            mainMenuItems.unshift('Switch to chess');
        }    

        Main.menu.create({
            width: 220,
            target: "#home-menu",
            items: mainMenuItems,
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
                    arr.push('<img onerror="Main.helper.loadDefaultGroupPhoto(event)" src = "' + groups[n].small_photo_url + '" style="width:30px; height:30px;" /><span>' + groups[n].name + '</span>');
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
                    me.layout();
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

        Ns.Match.contactsMatchList();
        Ns.Match.groupMatchList();
        Ns.Match.tournamentMatchList();

        Ns.ui.GamePanel.setupOnHome();


        $('#home-notification-icon').off('click');
        $('#home-notification-icon').on('click', function (evt) {
            Ns.GameHome.showNotifications();
        });

        $('#home-group-header').off('click');
        $('#home-group-header').on('click', function (evt) {
            var el = document.getElementById('home-group-header');
            var group = el[Ns.Match._HOME_DOM_EXTRA_HOLD_GROUP];
            //first update change if any, since it was observed that the group object is copied and not refrenced so changes are not reflected
            var list = Ns.view.Group.groupList;
            for (var i = 0; i < list.length; i++) {
                if (group.name === list[i].name) {
                    group = list[i];
                    el[Ns.Match._HOME_DOM_EXTRA_HOLD_GROUP] = group;
                }
            }
            if (evt.target.id === 'home-group-name'
                    || evt.target.id === 'home-group-status-message') {
                //var group_name = document.getElementById('home-group-name').innerHTML;
                Ns.GameHome.showGroupDetails(group);
            } else if (evt.target.id === 'home-group-pic') {
                //var group_name = document.getElementById('home-group-name').innerHTML;
                Ns.ui.Photo.show(group, 'group');
            }
        });

        $('#home-tournament-header').off('click');
        $('#home-tournament-header').on('click', function (evt) {
            var el = document.getElementById('home-tournament-header');
            var tournament = el[Ns.Match._HOME_DOM_EXTRA_HOLD_TOURN];
            //first update change if any, since it was observed that the tournament object is copied and not refrenced so changes are not reflected
            var list = Ns.view.Tournament.tournamentList;
            for (var i = 0; i < list.length; i++) {
                if (tournament.name === list[i].name) {
                    tournament = list[i];
                    el[Ns.Match._HOME_DOM_EXTRA_HOLD_TOURN] = tournament;
                }
            }

            if (evt.target.id === 'home-tournament-name') {
                //var tournnament_name = document.getElementById('home-tournament-name').innerHTML;
                Ns.GameHome.showTournamentDetails(tournament);
            } else if (evt.target.id === 'home-tournament-pic') {
                //var tournnament_name = document.getElementById('home-tournament-name').innerHTML;
                Ns.ui.Photo.show(tournament, 'tournament');
            }
        });

        var group_index = 0;
        var tourn_index = 0;

        if (group_index === 0) {
            //disable the 'previous' button
            $('#home-group-previous').addClass('game9ja-disabled');
        }

        if (group_index === Ns.view.UserProfile.appUser.groups_belong.length - 1) {
            //disable the 'next' button
            $('#home-group-previous').addClass('game9ja-disabled');
        }

        $('#home-group-previous').off('click');
        $('#home-group-previous').on('click', function () {

            var group;
            if (group_index > 0) {
                group_index--;
                if (group_index === 0) {
                    //disable the 'previous' button
                    $('#home-group-previous').addClass('game9ja-disabled');
                }

                if (group_index < Ns.view.UserProfile.appUser.groups_belong.length - 1) {
                    //enable the 'next' button
                    if ($('#home-group-next').hasClass('game9ja-disabled')) {
                        $('#home-group-next').removeClass('game9ja-disabled');
                    }
                }
            }


            group = Ns.view.UserProfile.appUser.groups_belong[group_index];

            if (!group) {
                return;
            }

            Ns.Match.groupMatchList(group);

        });

        $('#home-group-next').off('click');
        $('#home-group-next').on('click', function () {

            var group;
            if (group_index < Ns.view.UserProfile.appUser.groups_belong.length - 1) {
                group_index++;

                if (group_index === Ns.view.UserProfile.appUser.groups_belong.length - 1) {
                    //disable the 'next' button 
                    $('#home-group-next').addClass('game9ja-disabled');
                }

                if (group_index > 0) {
                    //enable the 'previous' button
                    if ($('#home-group-previous').hasClass('game9ja-disabled')) {
                        $('#home-group-previous').removeClass('game9ja-disabled');
                    }
                }
            }

            group = Ns.view.UserProfile.appUser.groups_belong[group_index];

            if (!group) {
                return;
            }

            Ns.Match.groupMatchList(group, group_index);

        });

        $('#home-tournament-previous').off('click');
        $('#home-tournament-previous').on('click', function () {
            var tourn;
            if (tourn_index > 0) {
                tourn_index--;
            }

            tourn = Ns.view.Tournament.tournamentList[tourn_index];

            if (!tourn) {
                return;
            }

            Ns.Match.tournamentMatchList(tourn.name);

        });

        $('#home-tournament-next').off('click');
        $('#home-tournament-next').on('click', function () {
            var tourn;
            if (tourn_index < Ns.view.Tournament.tournamentList.length - 1) {
                tourn_index++;
            }

            tourn = Ns.view.Tournament.tournamentList[tourn_index];

            if (!tourn) {
                return;
            }

            Ns.Match.tournamentMatchList(tourn.name);

        });

    },

    groupPageCounter: function (group) {
        var el = document.getElementById('home-group-page-number');
        if(!el){//possible
            return;
        }
        var num = Ns.view.UserProfile.appUser.groups_belong.indexOf(group.name) + 1;
        if (num > 0) {
            el.innerHTML = num + " of " + Ns.view.UserProfile.appUser.groups_belong.length;
        } else {
            el.innerHTML = '---';
        }
    },

    tournamentPageCounter: function () {

    },

    getView: function (file, callback) {
        if (!Ns.ui._views_list) {
            Ns.ui._views_list = {};
        }
        if (Ns.ui._views_list[file]) {
            return callback(null, Ns.ui._views_list[file]);// node style
        }

        Main.ajax.get(Main.intentUrl(file),
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
            case 'Switch to chess':
                Ns.GameHome.switchGame('chess');
                break;
            case 'Switch to draughts':
                Ns.GameHome.switchGame('draughts');
                break;
            case 'Change draughts variant':
                alert('TODO');
                break;
            case 'Play robot':
                Ns.Robot.showGame();
                break;
            case 'Notifications':
                Ns.GameHome.showNotifications();
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
                Ns.GameHome.showUserProfile(Ns.view.UserProfile.appUser);
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
    }
};


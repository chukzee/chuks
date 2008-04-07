
/* global Main */

Main.controller.UI = {

    gameViewHtml: null, //set dynamically depending on the device category

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
            width: 150,
            target: "#home-menu",
            items: [
                'My game',
                'Play notifications',
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
            width: 200,
            target: "#home-group-dropdown-menu",
            header: 'Jump to group',
            items: groupItems(Main.controller.auth.appUser.groupsBelong),
            onSelect: function (evt) {
                var item = this.item;

                //finally hide the menu
                this.hide();
            }
        });

        //create the tournament drop down menu.
        Main.menu.create({
            width: 200,
            height: 0.6 * window.screen.height,
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

        Main.controller.Match.contactsMatchList();
        Main.controller.Match.groupMatchList();
        Main.controller.Match.tournamentMatchList();

        Main.controller.GamePanel.setupOnHome();
        
        var group_index = 0;
        var tourn_index = 0;

        $('#home-group-previous').on('click', function () {

            var group;
            if (group_index > 0) {
                group_index--;
            }
            group = Main.controller.auth.appUser.groupsBelong[group_index];

            if (!group) {
                return;
            }

            Main.controller.Match.groupMatchList(group);

        });

        $('#home-group-next').on('click', function () {
            var group;
            if (group_index < Main.controller.auth.appUser.groupsBelong.length - 1) {
                group_index++;
            }

            group = Main.controller.auth.appUser.groupsBelong[group_index];

            if (!group) {
                return;
            }

            Main.controller.Match.groupMatchList(group);

        });

        $('#home-tournament-previous').on('click', function () {
            var tourn;
            if (tourn_index > 0) {
                tourn_index--;
            }

            tourn = Main.controller.auth.appUser.tournamentList[tourn_index];

            if (!tourn) {
                return;
            }

            Main.controller.Match.tournamentMatchList(tourn);

        });

        $('#home-tournament-next').on('click', function () {
            var tourn;
            if (tourn_index < Main.controller.auth.appUser.tournamentList.length - 1) {
                tourn_index++;
            }

            tourn = Main.controller.auth.appUser.tournamentList[tourn_index];

            if (!tourn) {
                return;
            }

            Main.controller.Match.tournamentMatchList(tourn);

        });

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
    
    voiceMessageHtml: function (data_url, data_size) {

        console.log('TODO voiceMessageHtml ');

        return 'TODO voiceMessageHtml ';
    },
};


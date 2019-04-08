

/* global Ns, Main, localforage */

Ns.view.Tournament = {

    DEFAULT_RATING: 2.5,

    SEARCH_SIZE: 10,

    RANDOM_SIZE: 30,

    DOM_EXTRA_FIELD_PREFIX: '-dom-extra-field',

    tournamentList: [],

    _lstMatchFixtures: null,

    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        localforage.getItem(Ns.Const.TOURNAMENT_LIST_KEY, function (err, list) {
            if (err) {
                console.log(err);
            }
            if (Main.util.isArray(list)) {
                Ns.view.Tournament.tournamentList = list;
            }
        });

        var obj = {
            tourn: 'info/Tournament'
        };

        Main.rcall.live(obj);

    },

    content: function (tournament) {


        $('#tournament-details').find('.tournament-officials-only').each(function () {
            $(this).hide();
        });

        var round_index;
        var players_map = {};

        if (Main.util.isString(tournament)) {
            //find the tournament
            var tournament_name = tournament;
            Ns.view.Tournament.getInfo(tournament_name, function (tournament) {
                setContent(tournament);
            });
        } else {
            setContent(tournament);
        }



        function setContent(tournament) {

            /*
             "tournament-details-photo-url"
             "tournament-details-tournament-name"
             "tournament-details-tournament-rating"
             "tournament-details-created-by"
             "tournament-details-date-created"
             "tournament-details-back-btn"
             "tournament-details-edit"
             "tournament-details-menu"
             "tournament-details-tournament-type"
             "tournament-details-officials-count"
             "tournament-details-officials-add"
             "tournament-details-officials"
             "tournament-details-registered-players-count"
             "tournament-details-registered-players-add"
             "tournament-details-registered-players"
             "tournament-details-season-number"
             "tournament-details-season-date"
             "tournament-details-season-previous"
             "tournament-details-season-next"
             "tournament-details-season-players-count"
             "tournament-details-season-table-standings"
             "tournament-details-season-players-add"
             "tournament-details-season-players"
             "tournament-details-stage-previous"
             "tournament-details-stage"
             "tournament-details-stage-next"
             "tournament-details-match-fixtures"
             */



            if (!tournament) {
                return;
            }

            var season_index = tournament.seasons.length - 1;

            var current_season = tournament.seasons[season_index];

            document.getElementById("tournament-details-photo-url").src = tournament.large_photo_url;
            document.getElementById("tournament-details-tournament-name").innerHTML = tournament.name;
            document.getElementById("tournament-details-tournament-rating").innerHTML = tournament.rating ? tournament.rating : Ns.view.Tournament.DEFAULT_RATING;
            document.getElementById("tournament-details-created-by").innerHTML = tournament.created_by.full_name;
            document.getElementById("tournament-details-date-created").innerHTML = Ns.Util.formatDate(tournament.date_created);
            document.getElementById("tournament-details-tournament-type").innerHTML = tournament.type.substring(0, 1).toUpperCase() + tournament.type.substring(1);

            document.getElementById("tournament-details-officials-count").innerHTML = tournament.officials.length > 1
                    ? tournament.officials.length + ' Officials'
                    : tournament.officials.length + ' Official';

            document.getElementById("tournament-details-registered-players-count").innerHTML = tournament.registered_players.length > 1
                    ? tournament.registered_players.length + ' Registered players'
                    : tournament.registered_players.length + ' Registered player';


            var user = Ns.view.UserProfile.appUser;
            var foundOfficial = tournament.officials.find(function (u) {
                return user.user_id === u.user_id;
            });

            if (foundOfficial) {
                $('#tournament-details').find('.tournament-officials-only').each(function () {
                    $(this).show();
                });
            }

            Main.click("tournament-details-comment-general", tournament, Ns.view.Tournament._onClickTournamentGeneralChat);
            Main.click("tournament-details-comment-inhouse", tournament, Ns.view.Tournament._onClickTournamentInhouseChat);

            Ns.view.Tournament._renderOfficials(tournament);

            Ns.view.Tournament._renderRegisteredPlayers(tournament);

            if (current_season) {
                Ns.view.Tournament._renderSeasonPlayers(tournament, current_season.sn);//uncomment later
            }

            if (season_index === 0) {
                //disable the 'previous' button
                $('#tournament-details-season-previous').addClass('game9ja-disabled');
            }

            if (season_index === tournament.seasons.length - 1) {
                //disable the 'next' button
                $('#tournament-details-season-next').addClass('game9ja-disabled');
            }

            for (var i = 0; i < tournament.registered_players.length; i++) {
                players_map[tournament.registered_players[i].user_id] = tournament.registered_players[i];
            }

            displaySeason(current_season);

            //"tournament-details-officials"            
            //"tournament-details-registered-players"            
            //"tournament-details-season-players"            
            //"tournament-details-season-table-standings"
            //"tournament-details-match-fixtures"


            $('#tournament-details-edit').off('click');
            $('#tournament-details-edit').on('click', function () {
                Ns.GameHome.showEditTournament(tournament);
            });


            $('#tournament-details-menu').off('click');
            $('#tournament-details-menu').on('click', function () {

                alert('TODO tournament-details-menu');

            });


            $('#tournament-details-officials-add').off('click');
            $('#tournament-details-officials-add').on('click', function () {
                Ns.view.Tournament._onClickOfficialsAdd(tournament);
            });


            $('#tournament-details-registered-players-add').off('click');
            $('#tournament-details-registered-players-add').on('click', function () {
                Ns.view.Tournament._onClickRegisteredPlayersAdd(tournament);
            });


            $('#tournament-details-season-players-add').off('click');
            $('#tournament-details-season-players-add').on('click', function () {
                Ns.view.Tournament._onClickSeasonPlayersAdd(tournament);
            });


            $('#tournament-details-season-table-standings').off('click');
            $('#tournament-details-season-table-standings').on('click', function () {
                var season = tournament.seasons[season_index];
                if (!season) {
                    return;
                }
                Ns.GameTournament.showPerformacesView(
                        {
                            tournament: tournament,
                            season_number: season.sn
                        });
            });


            $('#tournament-details-season-previous').off('click');
            $('#tournament-details-season-previous').on('click', function () {

                if (season_index > 0) {
                    season_index--;
                    displaySeason(tournament.seasons[season_index]);

                    if (season_index === 0) {
                        //disable the 'previous' button
                        $('#tournament-details-season-previous').addClass('game9ja-disabled');
                    }

                    if (season_index < tournament.seasons.length - 1) {
                        //enable the 'next' button
                        if ($('#tournament-details-season-next').hasClass('game9ja-disabled')) {
                            $('#tournament-details-season-next').removeClass('game9ja-disabled');
                        }
                    }
                    Ns.view.Tournament._renderSeasonPlayers(tournament, tournament.seasons[season_index].sn);
                }

            });


            $('#tournament-details-season-next').off('click');
            $('#tournament-details-season-next').on('click', function () {

                if (season_index < tournament.seasons.length - 1) {
                    season_index++;
                    displaySeason(tournament.seasons[season_index]);

                    if (season_index === tournament.seasons.length - 1) {
                        //disable the 'next' button 
                        $('#tournament-details-season-next').addClass('game9ja-disabled');
                    }
                    if (season_index > 0) {
                        //enable the 'previous' button
                        if ($('#tournament-details-season-previous').hasClass('game9ja-disabled')) {
                            $('#tournament-details-season-previous').removeClass('game9ja-disabled');
                        }
                    }
                    Ns.view.Tournament._renderSeasonPlayers(tournament, tournament.seasons[season_index].sn);
                }


            });


            $('#tournament-details-stage-previous').off('click');
            $('#tournament-details-stage-previous').on('click', function () {

                if (round_index > 0) {
                    round_index--;
                    displayFixturesAtRound(tournament.seasons[season_index].rounds, round_index);

                    if (round_index === 0) {
                        //disable the 'previous' button       
                        $('#tournament-details-stage-previous').addClass('game9ja-disabled');
                    }

                    if (round_index < tournament.seasons[season_index].rounds.length - 1) {
                        //enable the 'next' button
                        if ($('#tournament-details-stage-next').hasClass('game9ja-disabled')) {
                            $('#tournament-details-stage-next').removeClass('game9ja-disabled');
                        }
                    }
                }
            });

            $('#tournament-details-stage-next').off('click');
            $('#tournament-details-stage-next').on('click', function () {

                if (round_index < tournament.seasons[season_index].rounds.length - 1) {
                    round_index++;
                    displayFixturesAtRound(tournament.seasons[season_index].rounds, round_index);

                    if (round_index === tournament.seasons[season_index].rounds.length - 1) {
                        //disable the 'next' button  
                        $('#tournament-details-stage-next').addClass('game9ja-disabled');
                    }

                    if (round_index > 0) {
                        //enable the 'previous' button
                        if ($('#tournament-details-stage-previous').hasClass('game9ja-disabled')) {
                            $('#tournament-details-stage-previous').removeClass('game9ja-disabled');
                        }
                    }
                }
            });


        }

        function displaySeason(season) {

            //enable the 'tournament-details-stage-next' button
            if ($('#tournament-details-stage-next').hasClass('game9ja-disabled')) {
                $('#tournament-details-stage-next').removeClass('game9ja-disabled');
            }

            //enable the 'tournament-details-stage-previous' button also
            if ($('#tournament-details-stage-previous').hasClass('game9ja-disabled')) {
                $('#tournament-details-stage-previous').removeClass('game9ja-disabled');
            }

            document.getElementById("tournament-details-season-number").innerHTML = season ? season.sn : '';
            document.getElementById("tournament-details-season-date").innerHTML = season ? season.start_time : '';

            document.getElementById("tournament-details-season-players-count").innerHTML = season ?
                    (season.slots.length > 0
                            ? season.slots.length + ' Players'
                            : season.slots.length + ' Player')
                    : 'No Player';

            round_index = displayFixturesAtRound(season ? season.rounds : []);


            if (round_index === 0) {
                //disable the 'previous' button
                $('#tournament-details-stage-previous').addClass('game9ja-disabled');
            }

            if (season && round_index === season.rounds.length - 1) {
                //disable the 'next' button
                $('#tournament-details-stage-next').addClass('game9ja-disabled');
            }

        }

        function displayFixturesAtRound(rounds, round_index) {

            var rd;

            if (round_index > -1) {
                rd = rounds[round_index];
            } else {
                var r_index = -1;
                outer: for (var i = 0; i < rounds.length; i++) {
                    var fixtures = rounds[i].fixtures;
                    for (var j = 0; j < fixtures.length; j++) {
                        var current_fixt = fixtures[j];
                        if (!current_fixt.end_time) {
                            r_index = i;
                            break outer;
                        }
                    }

                }

                if (r_index === -1) {//means all matches have ended so set as the last round
                    r_index = rounds.length - 1;
                }

                round_index = r_index;

                rd = rounds[round_index];
            }

            document.getElementById("tournament-details-stage").innerHTML = rd ? rd.stage : '';

            var container = '#tournament-details-match-fixtures';

            Main.listview.create({
                container: container,
                scrollContainer: container,
                tplUrl: 'match-fixture-tpl.html',
                wrapItem: false,
                //itemClass: "game9ja-live-games-list",
                onSelect: function (evt, fixture) {

                    Ns.Match.getMatch(fixture.game_id, function (match) {
                        if (!match) {
                            Main.toast.show('Match not found!');
                            return;
                        }

                        var user = Ns.view.UserProfile.appUser;
                        var is_me_player = false;
                        for (var n in match.players) {
                            if (match.players[n].user_id === user.user_id) {
                                is_me_player = true;
                                break;
                            }
                        }
                        if (is_me_player) {
                            //show the current app user game
                            Ns.GameHome.showGameView(match);
                        } else {
                            //watch other players live
                            Ns.GameHome.showGameWatch(match);
                        }
                    });

                },
                onRender: function (tpl_var, data) {

                    if (tpl_var === 'start_time') {
                        if (!data[tpl_var]) {
                            return '';
                        }
                        return Ns.Util.formatTime(data[tpl_var]);
                    }

                    if (tpl_var === 'end_time') {
                        if (data[tpl_var]) {
                            return 'End';
                        } else {
                            return '';
                        }
                    }

                    if (tpl_var === 'score') {
                        //come back to check for correctness 
                        var start_time = new Date(data['start_time']).getTime();

                        if (new Date().getTime() >= start_time) {//started
                            return data.player_1.score + ' - ' + data.player_2.score;
                        } else {//not started
                            return 'VS';
                        }
                    }

                    if (tpl_var === 'player_1') {
                        return players_map[data.player_1.id].full_name;
                    }

                    if (tpl_var === 'player_2') {
                        return players_map[data.player_2.id].full_name;
                    }



                },
                onReady: function () {

                    Ns.view.Tournament._lstMatchFixtures = this;

                    var fixtures = rd.fixtures;
                    for (var i = 0; i < fixtures.length; i++) {
                        this.appendItem(fixtures[i]);
                    }

                }
            });


            return round_index;
        }

    },

    updateMatch: function (match) {

    },

    _onClickTournamentGeneralChat: function (evt, tournament) {
        Ns.GameHome.showTournamentGeneralChat(tournament);
    },

    _onClickTournamentInhouseChat: function (evt, tournament) {
        Ns.GameHome.showTournamentInhouseChat(tournament);
    },

    _isAppUserOfficial: function (officials) {
        for (var i = 0; i < officials.length; i++) {
            if (officials[i].user_id === Ns.view.UserProfile.appUser.user_id) {
                return true;
            }
        }

        return false;
    },

    _addPassportHorizontalListItem: function (el_id, html, info, menuItems, tournament_name) {

        var dom_extra_field = el_id + Ns.view.Tournament.DOM_EXTRA_FIELD_PREFIX;

        //check if already been added then remove it if so 
        Ns.view.Tournament._removePassportHorizontalListItem(el_id, info.user_id);

        //now add the official
        $('#' + el_id).append(html);
        var children = $('#' + el_id).children();
        var last_child = children[children.length - 1];
        last_child[dom_extra_field] = info;
        var dataObj = {user: info, menuItems: menuItems, tournament_name: tournament_name};
        $(last_child).on('click', dataObj, Ns.view.Tournament._onClickPassport);
    },

    _removePassportHorizontalListItem: function (el_id, user_id) {

        var dom_extra_field = el_id + Ns.view.Tournament.DOM_EXTRA_FIELD_PREFIX;

        var children = $('#' + el_id).children();
        //check if already been added then remove it if so
        for (var n = 0; n < children.length; n++) {
            if (children[n][dom_extra_field]) {
                if (children[n][dom_extra_field].user_id === user_id) {
                    children[n].remove();
                    break;
                }
            }
        }

    },

    _onClickPassport: function (evt) {

        var menu_items = evt.data.menuItems;
        var user = evt.data.user;
        var tournament_name = evt.data.tournament_name;

        /*var opt = {
         headless: true, //headless dialog 
         multiSelect: false
         };*/

        Ns.ui.Dialog.selectSimpleList({
            title: user.full_name,
            multiSelect: false,
            items: menu_items,
            width: window.innerWidth * 0.8,
            onRender: function (tpl_var, data) {
                return data; //we know it is just string
            },
            onSelect: function (mnuItem) {

                switch (mnuItem) {
                    case 'Lets Play':
                        Ns.view.Tournament.onClickLetsPlay(user);
                        break;
                    case 'View player profile':
                        Ns.GameHome.showUserProfile(user);
                        break;
                    case 'View player profile pic':
                        Ns.ui.Photo.show(user);
                        break;
                    case 'View player ranking':

                        alert('TODO view player ranking');

                        break;
                    case 'Remove tournament official':
                        Ns.view.Tournament.removeOfficial(user.user_id, tournament_name);
                        break;
                    case 'Remove registered player':
                        Ns.view.Tournament.removeRegisteredPlayer(user.user_id, tournament_name);
                        break;
                    case 'Remove season player':
                        Ns.view.Tournament.removeSeasonPlayer(user.user_id, tournament_name);
                        break;
                }
            }});



    },

    removeOfficial: function (official_id, tournament_name) {
        var app_user_id = Ns.view.UserProfile.appUser.user_id;
        Main.ro.tourn.removeOfficial(app_user_id, tournament_name, official_id)
                .get(function (data) {
                    Ns.view.Tournament.update(data.tournament);
                    var el_id = "tournament-details-officials";
                    Ns.view.Tournament._removePassportHorizontalListItem(el_id, official_id);
                })
                .error(function (err) {
                    Main.alert(err, 'Failed', Main.const.INFO); // come back to use Main.const.ERROR
                });

    },

    removeRegisteredPlayer: function (player_id, tournament_name) {
        var app_user_id = Ns.view.UserProfile.appUser.user_id;
        Main.ro.tourn.removeRegisteredPlayer(app_user_id, tournament_name, player_id)
                .get(function (data) {
                    Ns.view.Tournament.update(data.tournament);
                    var el_id = "tournament-details-registered-players";
                    Ns.view.Tournament._removePassportHorizontalListItem(el_id, player_id);
                })
                .error(function (err) {
                    Main.alert(err, 'Failed', Main.const.INFO); // come back to use Main.const.ERROR
                });
    },

    removeSeasonPlayer: function (player_id, tournament_name) {
        var tourn;
        for (var i = 0; i < Ns.view.Tournament.tournamentList.length; i++) {
            if (Ns.view.Tournament.tournamentList[i].name === tournament_name) {
                tourn = Ns.view.Tournament.tournamentList[i];
                break;
            }
        }

        if (!tourn) {
            return;
        }

        var current_season = tourn.seasons[tourn.seasons.length - 1];
        if (!current_season) {
            return;
        }

        var season_number = current_season.sn;

        var app_user_id = Ns.view.UserProfile.appUser.user_id;

        Main.ro.tourn.seasonRemovePlayer(app_user_id, tournament_name, season_number, player_id)
                .get(function (data) {
                    Ns.view.Tournament.update(data.tournament);
                    var el_id = "tournament-details-season-players";
                    Ns.view.Tournament._removePassportHorizontalListItem(el_id, player_id);
                })
                .error(function (err) {
                    Main.alert(err, 'Failed', Main.const.INFO); // come back to use Main.const.ERROR
                });

    },

    onClickLetsPlay: function (user) {
        Ns.PlayRequest.openPlayDialog(user);
    },

    _onClickOfficialsAdd: function (tournament) {
        /*var opt = {
         title: 'Add Official',
         multiSelect: false
         };*/

        Ns.ui.Dialog.selectContactList({
            title: 'Add Official',
            multiSelect: false,
            onSelect: function (choice) {
                var new_official_user_id = choice.user_id;
                var app_user_id = Ns.view.UserProfile.appUser.user_id;
                Main.ro.tourn.addOfficial(app_user_id, tournament.name, new_official_user_id)
                        .get(function (data) {
                            Ns.view.Tournament.update(data.tournament);

                            Main.alert(data.msg, 'Success', Main.const.INFO);
                            Ns.view.Tournament._renderOfficials(data.tournament);

                        })
                        .error(function (err) {
                            Main.alert(err, 'Failed', Main.const.INFO); // come back to use Main.const.ERROR
                            console.log(err);
                        });
            }});

    },

    _onClickRegisteredPlayersAdd: function (tournament) {

        Ns.ui.Dialog.selectContactList({
            title: 'Register Players',
            multiSelect: true,
            onSelect: function (contants) {
                if (!contants || contants.length === 0) {
                    return;
                }
                var player_user_ids = [];
                for (var i = 0; i < contants.length; i++) {
                    player_user_ids[i] = contants[i].user_id;
                }
                var app_user_id = Ns.view.UserProfile.appUser.user_id;
                Main.ro.tourn.registerBulkPlayers(app_user_id, tournament.name, player_user_ids)
                        .get(function (data) {

                            Ns.view.Tournament.update(data.tournament);

                            var results = data.msg;
                            var msg_str = '';
                            for (var i = 0; i < results.length; i++) {
                                msg_str += results[i].msg + '<br/>';
                            }

                            Main.alert(msg_str, 'Message', Main.const.INFO);

                            //next render on the horizontal list
                            Ns.view.Tournament._renderRegisteredPlayers(data.tournament);

                        })
                        .error(function (err) {
                            console.log(err);
                        });
            }
        });
    },

    _onClickSeasonPlayersAdd: function (tournament) {

        var findRegisteredPlayerById = function (id) {
            for (var i = 0; i < tournament.registered_players.length; i++) {
                if (tournament.registered_players[i].user_id === id) {
                    return tournament.registered_players[i];
                }
            }
        };

        if (!tournament.seasons || tournament.seasons.length === 0) {
            Main.toast.show('No season found. First create a season.');
            return;
        }

        Main.dialog.show({
            visible: false, //first hide it - we will manually show it only when the dialog and it content is fully rendered by call setVisible to avoid an annoying visual issue
            title: 'Slots',
            //content: html,
            widthScreenRatio: 0.8,
            maxWidth: 400,
            maxHeight: 600,
            fade: true,
            closeButton: false,
            modal: true,
            buttons: ['OK'],
            action: function (btn, value) {

                this.hide();

            },
            onShow: function () {
                var dlg_body = this.getBody();
                var table = document.createElement('table');
                table.className = 'slots-edit';
                var season_index = tournament.seasons.length - 1;
                var current_season = tournament.seasons[season_index];

                var tr_rows = [];
                for (var i = 0; i < current_season.slots.length; i++) {

                    var player = findRegisteredPlayerById(current_season.slots[i].player_id);

                    tr_rows[i] = document.createElement('tr');

                    //slot number
                    var slot_num_td = document.createElement('td');

                    //profile photo
                    var img_td = document.createElement('td');
                    var img_div = document.createElement('div');
                    var photo_td_img = document.createElement('img');
                    img_td.appendChild(img_div);
                    img_div.appendChild(photo_td_img);

                    //full name
                    var full_name_td = document.createElement('td');

                    //edit
                    var edit_td = document.createElement('td'); //edit icon cell
                    var edit_i = document.createElement('i'); //edit icon i tag
                    edit_i.className = 'fa fa-edit';
                    edit_td.appendChild(edit_i);


                    var slot_number = current_season.slots[i].sn;
                    edit_td.addEventListener('click', addSlotPlayer.bind(
                            {
                                slot_number: slot_number,
                                photo_td_img: photo_td_img,
                                full_name_td: full_name_td
                            }));

                    slot_num_td.innerHTML = slot_number;

                    if (player) {
                        photo_td_img.src = player.small_photo_url;
                        full_name_td.innerHTML = player.full_name;
                    }

                    tr_rows[i].appendChild(slot_num_td);
                    tr_rows[i].appendChild(img_td);
                    tr_rows[i].appendChild(full_name_td);
                    tr_rows[i].appendChild(edit_td);

                    table.appendChild(tr_rows[i]);
                }

                dlg_body.appendChild(table);
                this.layout();

                //now reveal the dialog after all is set and ok
                this.setVisible({
                    value: true,
                    duration: 300
                });

            }
        });

        function addSlotPlayer() {
            var me = this;
            var slot_number = this.slot_number;
            /*var opt = {
             title: 'Select Season Player',
             multiSelect: false
             };*/

            //var arr = tournament.registered_players;

            Ns.ui.Dialog.selectList({
                title: 'Select Season Player',
                url: 'simple-list-b-tpl.html',
                multiSelect: false,
                items: tournament.registered_players,
                width: window.innerWidth * 0.8,
                onRender: function (tpl_var, data) {
                    if (tpl_var === 'data_a') {
                        return data.small_photo_url;
                    }
                    if (tpl_var === 'data_b') {
                        return data.full_name;
                    }
                },
                onSelect: function (mnuItem) {

                    var app_user_id = Ns.view.UserProfile.appUser.user_id;
                    var season_index = tournament.seasons.length - 1;
                    var current_season = tournament.seasons[season_index];
                    var season_number = current_season.sn;
                    var player_id = mnuItem.user_id;

                    Main.ro.tourn.seasonAddPlayer(app_user_id, tournament.name, season_number, player_id, slot_number)
                            .get(function (data) {

                                Ns.view.Tournament.update(data.tournament);
                                var player = findRegisteredPlayerById(player_id);
                                if (player) {
                                    me.photo_td_img.src = player.small_photo_url;
                                    me.full_name_td.innerHTML = player.full_name;
                                }

                                //update the season players horizontal list
                                Ns.view.Tournament._renderSeasonPlayers(data.tournament, season_number);

                            })
                            .error(function (err) {
                                //alert(err);
                                console.log(err);//TODO show toast 
                            });
                }
            });

        }

    },

    _renderOfficials: function (tournament) {

        for (var i = 0; i < tournament.officials.length; i++) {

            Main.tpl.template({
                tplUrl: 'player-passport-a-tpl.html',
                data: tournament.officials[i],
                onReplace: function (tpl_var, data) {

                },
                afterReplace: function (html, data) {
                    var menuItems = Ns.view.Tournament._officialPassportMenuItems(data, tournament);
                    var id = 'tournament-details-officials';
                    Ns.view.Tournament._addPassportHorizontalListItem(id, html, data, menuItems, tournament.name);
                }
            });

        }

    },

    _renderRegisteredPlayers: function (tournament) {
        for (var i = 0; i < tournament.registered_players.length; i++) {

            Main.tpl.template({
                tplUrl: 'player-passport-b-tpl.html',
                data: tournament.registered_players[i],
                onReplace: function (tpl_var, data) {
                    if (tpl_var === 'rating') {
                        //TODO
                    }
                },
                afterReplace: function (html, data) {
                    var menuItems = Ns.view.Tournament._registeredPlayerPassportMenuItems(data, tournament);
                    var id = 'tournament-details-registered-players';
                    Ns.view.Tournament._addPassportHorizontalListItem(id, html, data, menuItems, tournament.name);
                }
            });

        }

    },

    _renderSeasonPlayers: function (tournament, season_number) {

        var season_index = season_number - 1;
        var current_season = tournament.seasons[season_index];
        if (!current_season) {
            return;
        }
        for (var i = 0; i < current_season.slots.length; i++) {

            var player_id = current_season.slots[i].player_id;
            var season_player;
            //get the player info from the register_players array
            for (var k = 0; k < tournament.registered_players.length; k++) {
                if (tournament.registered_players[k].user_id === player_id) {
                    season_player = tournament.registered_players[k];
                    break;
                }
            }

            if (!season_player) {
                continue;
            }

            Main.tpl.template({
                tplUrl: 'player-passport-b-tpl.html',
                data: season_player,
                onReplace: function (tpl_var, data) {
                    if (tpl_var === 'rating') {
                        //TODO
                    }
                },
                afterReplace: function (html, data) {
                    var menuItems = Ns.view.Tournament._seasonPlayerPassportMenuItems(data, tournament);
                    var id = 'tournament-details-season-players';
                    Ns.view.Tournament._addPassportHorizontalListItem(id, html, data, menuItems, tournament.name);
                }
            });

        }

    },

    isLocalOfficial: function (user_id, tournament) {
        var officials = tournament.officials;
        for (var i = 0; i < officials.length; i++) {
            if (officials[i].user_id === user_id) {
                return true;
            }
        }
        return false;
    },

    isLocalRegisteredPlayer: function (user_id, tournament) {
        var registered_players = tournament.registered_players;
        for (var i = 0; i < registered_players.length; i++) {
            if (registered_players[i].user_id === user_id) {
                return true;
            }
        }
        return false;
    },

    isLocalSeasonPlayer: function (user_id, tournament) {
        var current_season = tournament.seasons[tournament.seasons.length - 1];
        if (!current_season) {
            return false;
        }
        var slots = current_season.slots;
        for (var i = 0; i < slots.length; i++) {
            if (slots[i].player_id === user_id) {
                return true;
            }
        }
        return false;
    },

    _commonPassportMenuItems: function (info, tournament) {

        var menu_items = [];

        var is_contact = Ns.view.Contacts.isLocalContact(info.user_id);
        //var is_group_member = Ns.view.Group.isLocalGroupMember(info.user_id);//@Deprecated here because it is inappropriate to play group member from tournament enviromnent

        if (is_contact) {
            menu_items.push('Lets Play');
        } else {
            //not yet
        }

        menu_items.push('View player profile');
        menu_items.push('View player profile pic'); //expand profile pic
        menu_items.push('View player ranking');
        return  menu_items;
    },

    _officialPassportMenuItems: function (info, tournament) {
        var menu_items = Ns.view.Tournament._commonPassportMenuItems(info, tournament);

        if (Ns.view.Tournament._isAppUserOfficial(tournament.officials)
                && Ns.view.Tournament.isLocalOfficial(info.user_id, tournament)) {

            if (tournament.created_by.user_id !== info.user_id) {//since tournament creator not be removed
                menu_items.push('Remove tournament official');
            }

        }

        return  menu_items;
    },

    _registeredPlayerPassportMenuItems: function (info, tournament) {
        var menu_items = Ns.view.Tournament._commonPassportMenuItems(info, tournament);

        if (Ns.view.Tournament._isAppUserOfficial(tournament.officials)
                && Ns.view.Tournament.isLocalRegisteredPlayer(info.user_id, tournament)) {
            menu_items.push('Remove registered player');
        }

        return  menu_items;
    },

    _seasonPlayerPassportMenuItems: function (info, tournament) {
        var menu_items = Ns.view.Tournament._commonPassportMenuItems(info, tournament);

        if (Ns.view.Tournament._isAppUserOfficial(tournament.officials)
                && Ns.view.Tournament.isLocalSeasonPlayer(info.user_id, tournament)) {
            menu_items.push('Remove season player');
        }

        return  menu_items;
    },

    merge: function (tournaments) {

        if (!Main.util.isArray(tournaments)) {
            tournaments = [tournaments];
        }
        if (!Main.util.isArray(Ns.view.Tournament.tournamentList)) {
            Ns.view.Tournament.tournamentList = [];
        }
        var old_len = Ns.view.Tournament.tournamentList.length;

        for (var i = 0; i < tournaments.length; i++) {
            var found = false;
            for (var k = 0; k < old_len; k++) {
                var tourn = Ns.view.Tournament.tournamentList[k];
                if (tourn.name === tournaments[i].name) {
                    tourn = tournaments[i];//replace
                    found = true;
                    break;
                }
            }

            if (!found) {
                Ns.view.Tournament.tournamentList.push(tournaments[i]);
            }
        }

        if (Ns.view.Tournament.tournamentList.length > Ns.Const.MAX_LIST_SIZE) {
            var excess = Ns.view.Tournament.tournamentList.length - Ns.Const.MAX_LIST_SIZE;
            Ns.view.Tournament.tournamentList.splice(0, excess);//cut off the excess from the top
        }

        Ns.view.Tournament.save();
    },

    getInfo: function (tournament_name, callback, refresh) {
        var tournament;
        for (var i = 0; i < Ns.view.Tournament.tournamentList.length; i++) {
            if (tournament_name === Ns.view.Tournament.tournamentList[i].name) {
                tournament = Ns.view.Tournament.tournamentList[i];
                callback(tournament);
                if (!refresh) {
                    return;
                }
            }
        }


        Main.rcall.live(function () {
            Main.ro.tourn.getTournamentInfo(tournament_name)
                    .get(function (tournament) {
                        if (tournament && tournament.name) {
                            Ns.view.Tournament.merge(tournament);
                            callback(tournament);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });


    },

    set: function (tournaments) {

        if (!Main.util.isArray(tournaments)) {
            tournaments = [tournaments];
        }

        Ns.view.Tournament.tournamentList = tournaments;
        Ns.view.Tournament.save();
    },

    update: function (tournament) {
        if (!tournament) {
            return;
        }
        var list = Ns.view.Tournament.tournamentList;
        if (Main.util.isArray(list)) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].name === tournament.name) {
                    list[i] = tournament;//replace
                    break;
                }
            }
        }
        Ns.view.Tournament.save();

    },

    save: function (tourns) {

        var list = Ns.view.Tournament.tournamentList;

        if (tourns) {
            if (!Main.util.isArray()) {
                tourns = [tourns];
            }
            for (var i = 0; i < tourns.length; i++) {
                for (var k = 0; k < list.length; k++) {
                    if (list[k].name === tourns[i].name) {
                        list[k] = tourns[i];
                    }
                }
            }
        }

        if (Main.util.isArray(list)) {
            localforage.setItem(Ns.Const.TOURNAMENT_LIST_KEY, list, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    },

    getTournamentsInfo: function (user, callback) {

        var trns = [];
        //first check locally
        var user_trns = [];

        if (user.tournaments_belong) {
            for (var i = 0; i < user.tournaments_belong.length; i++) {
                if (user_trns.indexOf(user.tournaments_belong[i]) > -1) {
                    continue;
                }
                user_trns.push(user.tournaments_belong[i]);
            }
        }

        if (user.related_tournaments) {
            for (var i = 0; i < user.related_tournaments.length; i++) {
                if (user_trns.indexOf(user.related_tournaments[i]) > -1) {
                    continue;
                }
                user_trns.push(user.related_tournaments[i]);
            }
        }

        if (user.favourite_tournaments) {

            for (var i = 0; i < user.favourite_tournaments.length; i++) {
                if (user_trns.indexOf(user.favourite_tournaments[i]) > -1) {
                    continue;
                }
                user_trns.push(user.favourite_tournaments[i]);
            }
        }


        if (user_trns && user_trns.length > 0) {
            for (var i = 0; i < user_trns.length; i++) {
                for (var k = 0; k < Ns.view.Tournament.tournamentList.length; k++) {
                    if (Ns.view.Tournament.tournamentList[k].name === user_trns[i]) {
                        trns.push(Ns.view.Tournament.tournamentList[k]);
                    }
                }
            }

            if (trns.length === user_trns.length) {//all was found locally
                if (Main.util.isFunc(callback)) {
                    callback(trns);
                }
                return;//so leave
            }
        }

        //get remotely

        Main.rcall.live(function () {
            var id = user;
            if (user && user.user_id) {
                id = user.user_id;
            }
            Main.ro.tourn.getUserTournamentsInfoList(id)
                    .get(function (tournaments) {
                        if (!Main.util.isArray(tournaments)) {//just in case
                            callback([]);
                            return;
                        }
                        Ns.view.Tournament.merge(tournaments);
                        if (Main.util.isFunc(callback)) {
                            callback(tournaments);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });
    },

    search: function (str_search, callback) {

        Main.rcall.live(function () {
            Main.ro.tourn.searchTournamentsInfoList(str_search, Ns.view.Tournament.SEARCH_SIZE)
                    .get(function (tournaments) {
                        if (!Main.util.isArray(tournaments)) {//just in case
                            callback([]);
                            return;
                        }
                        Ns.view.Tournament.merge(tournaments);
                        if (Main.util.isFunc(callback)) {
                            callback(tournaments);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });
    },

    randomGet: function (callback) {

        Main.rcall.live(function () {
            Main.ro.tourn.randomTournamentsInfoList(Ns.view.Tournament.RANDOM_SIZE)
                    .get(function (tournaments) {
                        if (!Main.util.isArray(tournaments)) {//just in case
                            callback([]);
                            return;
                        }
                        Ns.view.Tournament.merge(tournaments);
                        if (Main.util.isFunc(callback)) {
                            callback(tournaments);
                        }
                    })
                    .error(function (err) {
                        console.log(err);
                    });
        });
    },

    //more goes below
};
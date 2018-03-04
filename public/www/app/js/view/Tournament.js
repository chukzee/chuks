

/* global Ns, Main */

Ns.view.Tournament = {

    SEARCH_SIZE: 10,

    RANDOM_SIZE: 30,

    tournamentList: [],

    /**
     * this constructor is called once automatically by the framework
     * 
     * @returns {undefined}
     */
    constructor: function () {

        try {
            var list = window.localStorage.getItem(Ns.Const.TOURNAMENT_LIST_KEY);
            list = JSON.parse(list);
            if (Main.util.isArray(list)) {
                Ns.view.Tournament.tournamentList = list;
            }
        } catch (e) {
            console.warn(e);
        }

        var obj = {
            tourn: 'info/Tournament'
        };

        Main.rcall.live(obj);



        Main.eventio.on('season_start', this.onSeasonStart);
        Main.eventio.on('season_cancel', this.onSeasonCancel);
        Main.eventio.on('season_delete', this.onSeasonDelete);
        Main.eventio.on('season_end', this.onSeasonEnd);

    },

    content: function (tournament_name) {

        var round_index;
        var players_map = {};

        //find the tournament
        Ns.view.Tournament.getInfo(tournament_name, function (tournament) {
            setContent(tournament);
        });


        function setContent(tournament) {

            /*
             "tournament-details-photo-url"
             "tournament-details-tournament-name"
             "tournament-details-created-by"
             "tournament-details-date-created"
             "tournament-details-back-btn"
             "tournament-details-edit"
             "tournament-details-menu"
             "tournament-details-tournament-type"
             "tournament-details-officials"
             "tournament-details--registered-players-add"
             "tournament-details-registered-players"
             "tournament-details-season-number"
             "tournament-details-season-date"
             "tournament-details-season-previous"
             "tournament-details-season-next"
             "tournament-details-season-players-count"
             "tournament-details-season-table-standings"
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

            document.getElementById("tournament-details-photo-url").src = tournament.photo_url;
            document.getElementById("tournament-details-tournament-name").innerHTML = tournament.name;
            document.getElementById("tournament-details-created-by").innerHTML = tournament.created_by.full_name;
            document.getElementById("tournament-details-date-created").innerHTML = tournament.date_created;
            document.getElementById("tournament-details-tournament-type").innerHTML = tournament.type.substring(0, 1).toUpperCase() + tournament.type.substring(1);

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


            $('#tournament-details-back-btn').on('click', function () {

                alert('TODO tournament-details-back-btn');

            });


            $('#tournament-details-edit').on('click', function () {

                alert('TODO tournament-details-edit');

            });


            $('#tournament-details-menu').on('click', function () {

                alert('TODO tournament-details-menu');

            });

            $('#tournament-details--registered-players-add').on('click', function () {

                alert('TODO tournament-details--registered-players-add');

            });


            $('#tournament-details-season-previous').on('click', function () {

                //enable the 'next' button
                if ($('#tournament-details-season-next').hasClass('game9ja-disabled')) {
                    $('#tournament-details-season-next').removeClass('game9ja-disabled');
                }

                if (season_index > 0) {
                    season_index--;
                    displaySeason(tournament.seasons[season_index]);

                    if (season_index === 0) {
                        //disable the 'previous' button
                        $('#tournament-details-season-previous').addClass('game9ja-disabled');
                    }
                }

            });

            $('#tournament-details-season-next').on('click', function () {

                //enable the 'previous' button
                if ($('#tournament-details-season-previous').hasClass('game9ja-disabled')) {
                    $('#tournament-details-season-previous').removeClass('game9ja-disabled');
                }

                if (season_index < tournament.seasons.length - 1) {
                    season_index++;
                    displaySeason(tournament.seasons[season_index]);

                    if (season_index === tournament.seasons.length - 1) {
                        //disable the 'next' button 
                        $('#tournament-details-season-next').addClass('game9ja-disabled');
                    }
                }


            });

            $('#tournament-details-season-table-standings').on('click', function () {

                alert('TODO tournament-details-season-table-standings');

            });

            $('#tournament-details-stage-previous').on('click', function () {

                //enable the 'next' button
                if ($('#tournament-details-stage-next').hasClass('game9ja-disabled')) {
                    $('#tournament-details-stage-next').removeClass('game9ja-disabled');
                }

                if (round_index > 0) {
                    round_index--;
                    displayFixturesAtRound(tournament.seasons[season_index].rounds, round_index);

                    if (round_index === 0) {
                        //disable the 'previous' button       
                        $('#tournament-details-stage-previous').addClass('game9ja-disabled');
                    }
                }
            });

            $('#tournament-details-stage-next').on('click', function () {

                //enable the 'previous' button
                if ($('#tournament-details-stage-previous').hasClass('game9ja-disabled')) {
                    $('#tournament-details-stage-previous').removeClass('game9ja-disabled');
                }

                if (round_index < tournament.seasons[season_index].rounds.length - 1) {
                    round_index++;
                    displayFixturesAtRound(tournament.seasons[season_index].rounds, round_index);

                    if (round_index === tournament.seasons[season_index].rounds.length - 1) {
                        //disable the 'next' button  
                        $('#tournament-details-stage-next').addClass('game9ja-disabled');
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
            document.getElementById("tournament-details-season-date").innerHTML = season.start_time;
            document.getElementById("tournament-details-season-players-count").innerHTML = season.slots.length;

            round_index = displayFixturesAtRound(season.rounds);
            
                        
            if (round_index === 0) {
                //disable the 'previous' button
                $('#tournament-details-stage-previous').addClass('game9ja-disabled');
            }

            if (round_index === season.rounds.length - 1) {
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

            document.getElementById("tournament-details-stage").innerHTML = rd.stage;

            var container = '#tournament-details-match-fixtures';

            Main.listview.create({
                container: container,
                scrollContainer: container,
                tplUrl: 'match-fixture-tpl.html',
                wrapItem: false,
                //itemClass: "game9ja-live-games-list",
                onSelect: function (evt, match_data) {


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

                    var fixtures = rd.fixtures;
                    for (var i = 0; i < fixtures.length; i++) {
                        this.appendItem(fixtures[i]);
                    }

                }
            });


            return round_index;
        }




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

    save: function () {
        var list = Ns.view.Tournament.tournamentList;
        if (Main.util.isArray(list)) {
            window.localStorage.setItem(Ns.Const.TOURNAMENT_LIST_KEY, JSON.stringify(list));
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

    onSeasonStart: function (obj) {

    },

    onSeasonCancel: function (obj) {

    },

    onSeasonDelete: function (obj) {

    },

    onSeasonEnd: function (obj) {

    }

    //more goes below
};
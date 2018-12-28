

/* global Main, Ns */


Ns.Match = {
    hasMatchData: false,
    currentUserMatch: null, //set dynamically
    currentRobotMatch: null, //set dynamically
    _lstContactsMatch: null, //private - the contacts match listview
    _lstGroupsMatch: null, //private - the groups match listview
    _lstTournamentsMatch: null, //private - the tournaments match listview
    _HOME_DOM_EXTRA_HOLD_TOURN: '_HOME_DOM_EXTRA_HOLD_TOURN',
    _HOME_DOM_EXTRA_HOLD_GROUP: '_HOME_DOM_EXTRA_HOLD_GROUP',
    contactsMatchKey: function () {
        return Ns.view.UserProfile.appUser.id + ":" + "CONTACT_MATCH" + ":" + Ns.ui.UI.selectedGame + ":";
    },
    groupMatchKey: function (group_name) {
        return Ns.view.UserProfile.appUser.id + ":" + "GROUP_MATCH" + ":" + Ns.ui.UI.selectedGame + ":" + group_name;
    },
    tournamentMatchKey: function (tournament) {
        return Ns.view.UserProfile.appUser.id + ":" + "TOURNAMENT_MATCH" + ":" + Ns.ui.UI.selectedGame + ":" + tournament;
    },

    constructor: function () {

        var obj = {
            match: 'game/Match'
                    //more may go below
        };

        Main.rcall.live(obj);


    },
    liveMatchList: function (container, matches) {

        /*var now = new Date();
         var now_00_hrs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
         var _24_hrs = 60 * 60 * 24 * 1000;
         */
        Main.listview.create({
            container: container,
            scrollContainer: container,
            tplUrl: 'live-game-tpl.html',
            wrapItem: false,
            //itemClass: "game9ja-live-games-list",
            onSelect: function (evt, match_data) {
                var user = Ns.view.UserProfile.appUser;
                var is_me_player = false;
                for (var n in match_data.players) {
                    if (match_data.players[n].user_id === user.user_id) {
                        is_me_player = true;
                        break;
                    }
                }
                if (is_me_player) {
                    //show the current app user game
                    Ns.GameHome.showGameView(match_data);
                } else {
                    //watch other players live
                    Ns.GameHome.showGameWatch(match_data);
                }

            },
            onRender: function (tpl_var, data) {

                if (tpl_var === 'start_time') {
                    return Ns.Util.formatTime(data[tpl_var]);
                } else if (tpl_var === 'status') {
                    return Main.util.toSentenceCase(data[tpl_var]);
                }

            },
            onReady: function () {

                switch (container) {
                    case '#home-contacts-live-games':
                        Ns.Match._lstContactsMatch = this;
                        break;
                    case '#home-group-live-games':
                        Ns.Match._lstGroupsMatch = this;
                        break;
                    case '#home-tournaments-live-games':
                        Ns.Match._lstTournamentsMatch = this;
                        break;
                    default:
                        console.warn('WARNGING! unknow coontainer id for listview - ' + container);
                        return;
                }

                for (var n in matches) {
                    this.prependItem(matches[n]);
                }

                if (!Ns.Match.hasMatchData && matches.length) {
                    Ns.Match.hasMatchData = true;
                    var last_match = matches[matches.length - 1]; // last in the array will be shown first since we prepend data in the list
                    Main.event.fire('game_panel_setup', last_match);
                    alert('onReady');
                }


            }
        });


    },

    contactsMatchList: function () {

        var stored_matches = window.localStorage.getItem(Ns.Match.contactsMatchKey());

        try {
            if (stored_matches) {
                stored_matches = JSON.parse(stored_matches);
                //show the contacts live match list
                Ns.Match.liveMatchList('#home-contacts-live-games', stored_matches);
            }
        } catch (e) {
            console.warn(e);
        }

        Ns.Match.refreshMyContactsMatchList();

    },

    refreshMyContactsMatchList: function () {
        var now = new Date().getTime();
        var oldTime = Ns.Util.lastContactsMatchRequestTime;
        if (oldTime && now < oldTime + Ns.Util.REQUEST_RATE_INTERVAL * 1000) {
            return;
        }

        Ns.Util.lastContactsMatchRequestTime = now;

        Main.rcall.live(function () {
            var user_id = Ns.view.UserProfile.appUser.user_id;
            var game_name = Ns.ui.UI.selectedGame;
            var skip = 0;
            var limit = Ns.Const.MAX_LIST_SIZE;

            Main.ro.match.getContactsMatchList(user_id, game_name, skip, limit)
                    .get(function (data) {

                        var matches = data.matches;

                        //sort the matches in descending order to show the latest matches first
                        matches = matches.sort(function (mat1, mat2) {
                            return mat1.game_start_time < mat2.game_start_time;
                        });

                        if (matches.length) {

                            Ns.Match.liveMatchList('#home-contacts-live-games', matches);
                            var key = Ns.Match.contactsMatchKey();
                            window.localStorage.setItem(key, JSON.stringify(matches));

                        } else {
                            //TODO - display no match found or something similar

                        }
                    })
                    .error(function (err) {
                        Ns.Util.lastContactsMatchRequestTime = oldTime;

                        //TODO - display error

                    });

        });

    },

    groupMatchList: function (group_name) {

        if (group_name) {
            Ns.view.Group.getInfo(group_name, function (group) {
                doGroupMatchList(group);
            });
        } else {
            var user = Ns.view.UserProfile.appUser;

            Ns.view.Group.getGroupsInfo(user, function (groups) {
                doGroupMatchList(groups[0]);
            });
        }


        function doGroupMatchList(group) {
            if (!group) {
                return;
            }
            var stored_matches = window.localStorage.getItem(Ns.Match.groupMatchKey(group.name));

            try {
                if (stored_matches) {
                    stored_matches = JSON.parse(stored_matches);
                    //show the group live match list
                    Ns.Match.liveMatchList('#home-group-live-games', stored_matches);
                }
            } catch (e) {
                console.warn(e);
            }


            document.getElementById('home-group-header')[Ns.Match._HOME_DOM_EXTRA_HOLD_GROUP] = group;
            document.getElementById('home-group-pic').src = group.photo_url;
            document.getElementById('home-group-name').innerHTML = group.name;
            document.getElementById('home-group-status-message').innerHTML = group.status_message;
            var num = Ns.view.UserProfile.appUser.groups_belong.indexOf(group.name) + 1;
            if (num > 0) {
                document.getElementById('home-group-page-number').innerHTML = num + " of " + Ns.view.UserProfile.appUser.groups_belong.length;
            } else {
                document.getElementById('home-group-page-number').innerHTML = '---';
            }

            Ns.Match.refreshMyGroupsMatchList(group.name);
        }
    },

    refreshMyGroupsMatchList: function (group_name) {
        var now = new Date().getTime();
        /*if(!lastGroupMatchRequestTime[group_name]){
         lastGroupMatchRequestTime[group_name] = now;
         }*/
        var oldTime = Ns.Util.lastGroupMatchRequestTime[group_name];
        if (oldTime && now < oldTime + Ns.Util.REQUEST_RATE_INTERVAL * 1000) {
            return;
        }

        Ns.Util.lastGroupMatchRequestTime[group_name] = now;

        Main.rcall.live(function () {
            var user_id = Ns.view.UserProfile.appUser.user_id;
            var game_name = Ns.ui.UI.selectedGame;
            var skip = 0;
            var limit = Ns.Const.MAX_LIST_SIZE;
            Main.ro.match.getGroupMatchList(user_id, group_name, game_name, skip, limit)
                    .get(function (data) {
                        var matches = data.matches;
                        //sort the matches in descending order to show the latest matches first
                        matches = matches.sort(function (mat1, mat2) {
                            return mat1.game_start_time < mat2.game_start_time;
                        });

                        if (matches.length) {
                            Ns.Match.liveMatchList('#home-group-live-games', matches);
                            var key = Ns.Match.groupMatchKey(matches[0].group_name);
                            window.localStorage.setItem(key, JSON.stringify(matches));
                        } else {
                            //TODO - display no match found or something similar

                        }
                    })
                    .error(function (err) {
                        Ns.Util.lastGroupMatchRequestTime[group_name] = oldTime;
                        //TODO - display error

                    });

        });

    },

    tournamentMatchList: function (tournament_name) {

        if (tournament_name) {
            Ns.view.Tournament.getInfo(tournament_name, function (tournament) {
                doTournamentMatchList(tournament);
                //get random tournament to suit the user delight
                Ns.view.Tournament.randomGet(function (tournaments) {
                    //do nothing!
                });
            });

        } else {

            var user = Ns.view.UserProfile.appUser;

            Ns.view.Tournament.getTournamentsInfo(user, function (tournaments) {
                doTournamentMatchList(tournaments[0]);
                //get random tournament to suit the user delight
                Ns.view.Tournament.randomGet(function (tournaments) {
                    //do nothing!
                });
            });
        }


        function doTournamentMatchList(tournament) {
            if (!tournament) {
                return;
            }
            var stored_matches = window.localStorage.getItem(Ns.Match.tournamentMatchKey(tournament.name));

            try {
                if (stored_matches) {
                    stored_matches = JSON.parse(stored_matches);
                    //show the tournaments live match list
                    Ns.Match.liveMatchList('#home-tournaments-live-games', stored_matches);
                }
            } catch (e) {
                console.warn(e);
            }

            //display tournament header info
            document.getElementById('home-tournament-header')[Ns.Match._HOME_DOM_EXTRA_HOLD_TOURN] = tournament;
            document.getElementById('home-tournament-pic').src = tournament.photo_url;
            document.getElementById('home-tournament-name').innerHTML = tournament.name;
            if (tournament.seasons.length > 0) {
                var season = tournament.seasons[tournament.seasons.length - 1];//current season
                var season_str = 'Season ' + season.sn + ': ' + Ns.Util.formatTime(season.start_time);
                document.getElementById('home-tournament-brief').innerHTML = season_str;
            } else {
                document.getElementById('home-tournament-brief').innerHTML = 'No season';
            }


            Ns.Match.refreshTournamentsMatchList(tournament);
        }

    },

    refreshTournamentsMatchList: function (tournament_name) {

        var now = new Date().getTime();
        /*if(!lastTournamentMatchRequestTime[tornamenent_name]){
         lastTournamentMatchRequestTime[tornamenent_name] = now;
         }*/
        var oldTime = Ns.Util.lastTournamentMatchRequestTime[tournament_name];
        if (oldTime && now < oldTime + Ns.Util.REQUEST_RATE_INTERVAL * 1000) {
            return;
        }

        Ns.Util.lastTournamentMatchRequestTime[tournament_name] = now;

        Main.rcall.live(function () {
            var user_id = Ns.view.UserProfile.appUser.user_id;
            var game_name = Ns.ui.UI.selectedGame;
            var skip = 0;
            var limit = Ns.Const.MAX_LIST_SIZE;
            Main.ro.match.getTournamentMatchList(user_id, tournament_name, game_name, skip, limit)
                    .get(function (data) {
                        var matches = data.matches;

                        //sort the matches in descending order to show the latest matches first
                        matches = matches.sort(function (mat1, mat2) {
                            return mat1.game_start_time < mat2.game_start_time;
                        });

                        if (matches.length) {
                            Ns.Match.liveMatchList('#home-tournaments-live-games', matches);
                            var key = Ns.Match.tournamentMatchKey(matches[0].tournament_name);
                            window.localStorage.setItem(key, JSON.stringify(matches));
                        } else {
                            //TODO - display no match found or something similar

                        }
                    })
                    .error(function (err) {
                        Ns.Util.lastTournamentMatchRequestTime[tournament_name] = oldTime;
                        //TODO - display error

                    });

        });

    },

    updateMatchList: function (match) {

        //contacts
        if (!match.tournament_name && !match.group_name) {
            var key = Ns.Match.contactsMatchKey();
            var matches = window.localStorage.getItem(key);
            try {
                if (matches) {
                    matches = JSON.parse(matches);
                    for (var i = 0; i < matches.length; i++) {
                        if (matches[i].game_id === match.game_id) {
                            matches[i] = match;
                            Ns.Match._lstContactsMatch.replaceItem(match, function (data) {
                                return data.game_id === match.game_id;
                            });
                            window.localStorage.setItem(key, JSON.stringify(matches));
                            return;
                        }
                    }
                }
            } catch (e) {
                console.warn(e);
            }
        }

        //group
        if (match.group_name) {
            var key = Ns.Match.groupMatchKey();
            var matches = window.localStorage.getItem(key);
            try {
                if (matches) {
                    matches = JSON.parse(matches);
                    for (var i = 0; i < matches.length; i++) {
                        if (matches[i].game_id === match.game_id) {
                            matches[i] = match;
                            var item = Ns.Match._lstGroupsMatch.replaceItem(match, function (data) {
                                return data.game_id === match.game_id;
                            });
                            window.localStorage.setItem(key, JSON.stringify(matches));
                            break;
                        }
                    }
                }
            } catch (e) {
                console.warn(e);
            }
        }

        //tournament
        if (match.tournament_name) {
            var key = Ns.Match.tournamentMatchKey();
            var matches = window.localStorage.getItem(key);
            try {
                if (matches) {
                    matches = JSON.parse(matches);
                    for (var i = 0; i < matches.length; i++) {
                        if (matches[i].game_id === match.game_id) {
                            matches[i] = match;
                            var item = Ns.Match._lstTournamentsMatch.replaceItem(match, function (data) {
                                return data.game_id === match.game_id;
                            });
                            window.localStorage.setItem(key, JSON.stringify(matches));
                            break;
                        }
                    }
                }
            } catch (e) {
                console.warn(e);
            }
        }
    },

    updateMatch: function (match) {
        if (!match) {
            return;
        }

        if (match.group_name) {

        } else if (match.tournament_name) {

        } else {//contact match

        }

    },

    prependMatchListview: function (match) {
        if (!match) {
            return;
        }
        if (match.group_name) {
            Ns.Match._lstGroupsMatch.prependItem(match);
        } else if (match.tournament_name) {
            Ns.Match._lstTournamentsMatch.prependItem(match);
        } else {//contact match
            Ns.Match._lstContactsMatch.prependItem(match);
        }


    },


};



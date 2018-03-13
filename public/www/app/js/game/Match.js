

/* global Main, Ns */


Ns.game.Match = {
    hasMatchData: false,
    currentUserMatch: null, //set dynamically
    currentRobotMatch : null, //set dynamically
    _lstContactsMatch: null, //private - the contacts match listview
    _lstGroupsMatch: null, //private - the groups match listview
    _lstTournamentsMatch: null, //private - the tournaments match listview
    _HOME_DOM_EXTRA_HOLD_TOURN : '_HOME_DOM_EXTRA_HOLD_TOURN',
    _HOME_DOM_EXTRA_HOLD_GROUP: '_HOME_DOM_EXTRA_HOLD_GROUP',
    contactsMatchKey: function () {
        return Ns.view.UserProfile.appUser.id + ":" + "CONTACT_MATCH" + ":" + Ns.ui.UI.selectedGame + ":";
    },
    groupMatchKey: function (group_name) {
        return Ns.view.UserProfile.appUser.id + ":" + "GROUP_MATCH"  + ":" + Ns.ui.UI.selectedGame + ":"+ group_name;
    },
    tournamentMatchKey: function (tournament) {
        return Ns.view.UserProfile.appUser.id + ":" + "TOURNAMENT_MATCH"  + ":" + Ns.ui.UI.selectedGame + ":" + tournament;
    },
    
    constructor: function () {

        var obj = {
            match: 'game/Match'
                    //more may go below
        };

        Main.rcall.live(obj);


        Main.eventio.on('notify_upcoming_match', this.onNotifyUpComingMatch);//match reminder - ie say 10 mins before time
        Main.eventio.on('game_start', this.onGameStart);
        Main.eventio.on('game_start_next_set', this.onGameStartNextSet);
        Main.eventio.on('watch_game_start', this.onWatchGameStart);
        Main.eventio.on('watch_game_start_next_set', this.onWatchGameStartNextSet);
        Main.eventio.on('game_resume', this.onGameResume);
        Main.eventio.on('watch_game_resume', this.onWatchGameResume);
        Main.eventio.on('game_pause', this.onGamePause);
        Main.eventio.on('game_abandon', this.onGameAbandon);
        Main.eventio.on('game_move', this.onGameMove);
        Main.eventio.on('game_move_sent', this.onGameMoveSent);
        Main.eventio.on('game_finish', this.onGameFinish);


    },
    liveMatchList: function (container, matches) {

        /*var now = new Date();
        var now_00_hrs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        var _24_hrs = 60 * 60 * 24 * 1000;
        */
        Main.listview.create({
            container: container,
            scrollContainer: container,
            tplUrl: 'tpl/live-game-tpl.html',
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

                if (tpl_var === 'game_start_time') {
                    return Ns.Util.formatTime(data[tpl_var]);
                }

            },
            onReady: function () {

                switch (container) {
                    case '#home-contacts-live-games':
                        Ns.game.Match._lstContactsMatch = this;
                        break;
                    case '#home-group-live-games':
                        Ns.game.Match._lstGroupsMatch = this;
                        break;
                    case '#home-tournaments-live-games':
                        Ns.game.Match._lstTournamentsMatch = this;
                        break;
                    default:
                        console.warn('WARNGING! unknow coontainer id for listview - ' + container);
                        return;
                }

                for (var n in matches) {
                    this.prependItem(matches[n]);
                }

                if (!Ns.game.Match.hasMatchData && matches.length) {
                    Ns.game.Match.hasMatchData = true;
                    var last_match = matches[matches.length - 1]; // last in the array will be shown first since we prepend data in the list
                    Main.event.fire('game_panel_setup', last_match);
                    alert('onReady');
                }


            }
        });


    },

    contactsMatchList: function () {

        var stored_matches = window.localStorage.getItem(Ns.game.Match.contactsMatchKey());

        try {
            if (stored_matches) {
                stored_matches = JSON.parse(stored_matches);
                //show the contacts live match list
                Ns.game.Match.liveMatchList('#home-contacts-live-games', stored_matches);
            }
        } catch (e) {
            console.warn(e);
        }

        Ns.game.Match.refreshMyContactsMatchList();

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

                            Ns.game.Match.liveMatchList('#home-contacts-live-games', matches);
                            var key = Ns.game.Match.contactsMatchKey();
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
            var stored_matches = window.localStorage.getItem(Ns.game.Match.groupMatchKey(group.name));

            try {
                if (stored_matches) {
                    stored_matches = JSON.parse(stored_matches);
                    //show the group live match list
                    Ns.game.Match.liveMatchList('#home-group-live-games', stored_matches);
                }
            } catch (e) {
                console.warn(e);
            }
            
            
            document.getElementById('home-group-header')[Ns.game.Match._HOME_DOM_EXTRA_HOLD_GROUP] = group;
            document.getElementById('home-group-pic').src = group.photo_url;
            document.getElementById('home-group-name').innerHTML = group.name;
            document.getElementById('home-group-status-message').innerHTML = group.status_message;
            var num = Ns.view.UserProfile.appUser.groups_belong.indexOf(group.name) + 1;
            if (num > 0) {
                document.getElementById('home-group-page-number').innerHTML = num + " of " + Ns.view.UserProfile.appUser.groups_belong.length;
            } else {
                document.getElementById('home-group-page-number').innerHTML = '---';
            }

            Ns.game.Match.refreshMyGroupsMatchList(group.name);
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
                            Ns.game.Match.liveMatchList('#home-group-live-games', matches);
                            var key = Ns.game.Match.groupMatchKey(matches[0].group_name);
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
            var stored_matches = window.localStorage.getItem(Ns.game.Match.tournamentMatchKey(tournament.name));

            try {
                if (stored_matches) {
                    stored_matches = JSON.parse(stored_matches);
                    //show the tournaments live match list
                    Ns.game.Match.liveMatchList('#home-tournaments-live-games', stored_matches);
                }
            } catch (e) {
                console.warn(e);
            }

            //display tournament header info
            document.getElementById('home-group-header')[Ns.game.Match._HOME_DOM_EXTRA_HOLD_TOURN] = tournament;
            document.getElementById('home-tournament-pic').src = tournament.photo_url;
            document.getElementById('home-tournament-name').innerHTML = tournament.name;
            if(tournament.seasons.length > 0){
                var season = tournament.seasons[tournament.seasons.length - 1];//current season
                var season_str = 'Season '+season.sn+': '+ Ns.Util.formatTime(season.start_time);
                document.getElementById('home-tournament-brief').innerHTML = season_str;
            }else{
                document.getElementById('home-tournament-brief').innerHTML = 'No season';
            }
            

            Ns.game.Match.refreshTournamentsMatchList(tournament);
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
                            Ns.game.Match.liveMatchList('#home-tournaments-live-games', matches);
                            var key = Ns.game.Match.tournamentMatchKey(matches[0].tournament_name);
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

    updateMatchListview: function (match) {
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
            Ns.game.Match._lstGroupsMatch.prependItem(match);
        } else if (match.tournament_name) {
            Ns.game.Match._lstTournamentsMatch.prependItem(match);
        } else {//contact match
            Ns.game.Match._lstContactsMatch.prependItem(match);
        }


    },
    
    onNotifyUpComingMatch: function (obj) {
        console.log(obj);
        
        var match = obj.data.match;

    },
    
    onGameStart: function (obj) {
        console.log(obj);
        
        var match = obj.data.match;
        Ns.game.Match.prependMatchListview(match);

    },
    
    onGameStartNextSet: function (obj) {
        console.log(obj);
        
        var match = obj.data.match;
        Ns.game.Match.prependMatchListview(match);

    },
    
    onWatchGameStart: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.game.Match.prependMatchListview(match);

    },

    onWatchGameStartNextSet: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.game.Match.prependMatchListview(match);

    },

    onGameResume: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.game.Match.updateMatchListview(match);

    },

    onWatchGameResume: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.game.Match.updateMatchListview(match);

    },

    onGamePause: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.game.Match.updateMatchListview(match);

    },

    onGameAbandon: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.game.Match.updateMatchListview(match);

    },

    onGameMove: function (obj) {
        console.log(obj);

    },

    onGameMoveSent: function (obj) {
        console.log(obj);

    },

    onGameFinish: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.game.Match.updateMatchListview(match);


    }


};



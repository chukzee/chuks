

/* global Main */

Main.controller.Match = {
    hasMatchData: false,
    currentUserMatch: null,//set dynamically
    constructor: function(){

        var obj = {
            match: 'game/MatchLive',
            //more may go below
        };

        Main.rcall.live(obj);
  
    },
    liveMatchList: function (container, matches) {
        matches = Main.controller.Match.normalizeMatchList(matches);
        //show the contacts live match list                   

        Main.listview.create({
            container: container,
            scrollContainer: container,
            tplUrl: 'live-game-tpl.html',
            wrapItem: false,
            //itemClass: "game9ja-live-games-list",
            onSelect: function (evt, match_data) {
                var user = Main.controller.UserProfile.appUser;

                if (match_data.white_id === user.id
                        || match_data.black_id === user.id) {
                    //show the current app user game
                    Main.controller.GameHome.showGameView(match_data);
                } else {
                    //watch other players live
                    Main.controller.GameHome.showGameWatch(match_data);
                }

            },
            onReady: function () {
                for (var n in matches) {
                    this.prependItem(matches[n]);
                }

                if (!Main.controller.Match.hasMatchData && matches.length) {
                    Main.controller.Match.hasMatchData = true;
                    var last_match = matches[matches.length - 1]; // last in the array will be shown first since we prepend data in the list
                    Main.event.fire('game_panel_setup', last_match);
                    alert('onReady');
                }

                
            }
        });


    },

    //NOT YET TESTED
    normalizeMatchList: function (matches) {

        //check for paused or ended matche and remove after certain hours
        var expiry_hours = 24 * 60 * 60 * 1000;
        var current_time = new Date().getTime();
        for (var n in matches) {
            var mat = matches[n];
            if (mat.game_end_time && current_time > mat.game_end_time + expiry_hours) {
                removeMatch(matches, n);
            }

            if (mat.game_pause_time && current_time > mat.game_pause_time + expiry_hours) {
                removeMatch(matches, n);
            }
        }

        //NOT YET TESTED
        function removeMatch(matches, index) {

            var mat = matches[index];
            var key, param;
            if (mat.group_name) {
                key = Main.controller.GameHome.groupMatchKey;
                param = mat.group_name;
            } else if (mat.tournament_name) {
                key = Main.controller.GameHome.tournamentMatchKey;
                param = mat.tournament_name;
            } else {
                key = Main.controller.GameHome.contactsMatchKey;
            }

            matches.splice(index, 1);

            var stored_matches = window.localStorage.getItem(key(param));
            if (!stored_matches) {
                return;
            }
            console.log('stored_matches', stored_matches);
            try {
                stored_matches = JSON.parse(stored_matches);
            } catch (e) {
                console.warn(e);
                return;
            }

            for (var i = 0; i < stored_matches.length; i++) {
                if (stored_matches[i].game_id === mat.game_id) {
                    stored_matches.splice(i, 1);
                    break;
                }
            }
            //replace 
            window.localStorage.removeItem(key(param));
            window.localStorage.setItem(key(param), stored_matches);

        }

        return matches;
    },

    contactsMatchList: function () {

        var stored_matches = window.localStorage.getItem(Main.controller.GameHome.contactsMatchKey());

        try {
            if (stored_matches) {
                stored_matches = JSON.parse(stored_matches);
                //show the contacts live match list
                Main.controller.Match.liveMatchList('#home-contacts-live-games', stored_matches);
            }
        } catch (e) {
            console.warn(e);
        }

        Main.controller.Match.refreshMyContactsMatchList();

    },

    refreshMyContactsMatchList: function () {
        var now = new Date().getTime();
        var oldTime = Main.controller.Util.lastContactsMatchRequestTime;
        if (oldTime && now < oldTime + Main.controller.Util.REQUEST_RATE_INTERVAL * 1000) {
            return;
        }

        Main.controller.Util.lastContactsMatchRequestTime = now;

        Main.rcall.live(function () {

            Main.ro.match.getContantsMatchList()
                    .get(function (data) {
                        var matches = data;

                        if (matches.length) {

                            Main.controller.Match.liveMatchList('#home-contacts-live-games', matches);
                            var key = Main.controller.GameHome.contactsMatchKey();
                            window.localStorage.setItem(key, JSON.stringify(matches));

                        } else {
                            //TODO - display no match found or something similar

                        }
                    })
                    .error(function (err) {
                        Main.controller.Util.lastContactsMatchRequestTime = oldTime;

                        //TODO - display error

                    });

        });

    },

    groupMatchList: function (group) {
        var group_index;
        var group_count;
        if (!group) {
            group_index = 0;
            group = Main.controller.UserProfile.appUser.groupsBelong[group_index];//first group in the list
            group_count = Main.controller.UserProfile.appUser.groupsBelong.length;
            if (!group) {
                return;
            }
        }

        //show the first group live match list


        var stored_matches = window.localStorage.getItem(Main.controller.GameHome.groupMatchKey(group.name));

        try {
            if (stored_matches) {
                stored_matches = JSON.parse(stored_matches);
                //show the group live match list
                Main.controller.Match.liveMatchList('#home-group-live-games', stored_matches);

            }
        } catch (e) {
            console.warn(e);
        }

        //display group header info
        document.getElementById('home-group-pic').src = group.photo;
        document.getElementById('home-group-name').innerHTML = group.name;
        document.getElementById('home-group-status-message').innerHTML = group.status_message;
        document.getElementById('home-group-page-number').innerHTML = (group_index + 1) + " of " + group_count;

        Main.controller.Match.refreshMyGroupsMatchList(group.name);


    },

    refreshMyGroupsMatchList: function (group_name) {
        var now = new Date().getTime();
        /*if(!lastGroupMatchRequestTime[group_name]){
         lastGroupMatchRequestTime[group_name] = now;
         }*/
        var oldTime = Main.controller.Util.lastGroupMatchRequestTime[group_name];
        if (oldTime && now < oldTime + Main.controller.Util.REQUEST_RATE_INTERVAL * 1000) {
            return;
        }

        Main.controller.Util.lastGroupMatchRequestTime[group_name] = now;

        Main.rcall.live(function () {
            Main.ro.match.getGroupMatchList(group_name)
                    .get(function (data) {
                        var matches = data;
                        if (matches.length) {
                            Main.controller.Match.liveMatchList('#home-group-live-games', matches);
                            var key = Main.controller.GameHome.groupMatchKey(matches[0].group_name);
                            window.localStorage.setItem(key, JSON.stringify(matches));
                        } else {
                            //TODO - display no match found or something similar

                        }
                    })
                    .error(function (err) {
                        Main.controller.Util.lastGroupMatchRequestTime[group_name] = oldTime;
                        //TODO - display error

                    });

        });

    },

    tournamentMatchList: function (tournament) {

        if (!tournament) {
            if (Main.util.isArray(Main.controller.Tournament.tournamentList)) {
                tournament = Main.controller.Tournament.tournamentList[0];
            }
            if (!tournament) {
                return;
            }
        }

        //show the first tournaments live match list
        var stored_matches = window.localStorage.getItem(Main.controller.GameHome.tournamentMatchKey(tournament.name));

        try {
            if (stored_matches) {
                stored_matches = JSON.parse(stored_matches);
                //show the tournaments live match list
                Main.controller.Match.liveMatchList('#home-tournaments-live-games', stored_matches);
            }
        } catch (e) {
            console.warn(e);
        }

        //display tournament header info
        document.getElementById('home-tournament-pic').src = tournament.photo;
        document.getElementById('home-tournament-name').innerHTML = tournament.name;
        document.getElementById('home-tournament-duration').innerHTML = tournament.duration;

        Main.controller.Match.refreshTournamentsMatchList(tournament);

    },

    refreshTournamentsMatchList: function (tornamenent_name) {

        var now = new Date().getTime();
        /*if(!lastTournamentMatchRequestTime[tornamenent_name]){
         lastTournamentMatchRequestTime[tornamenent_name] = now;
         }*/
        var oldTime = Main.controller.Util.lastTournamentMatchRequestTime[tornamenent_name];
        if (oldTime && now < oldTime + Main.controller.Util.REQUEST_RATE_INTERVAL * 1000) {
            return;
        }

        Main.controller.Util.lastTournamentMatchRequestTime[tornamenent_name] = now;

        Main.rcall.live(function () {

            Main.ro.match.getTournamentMatchList(tornamenent_name)
                    .get(function (data) {
                        var matches = data;
                        if (matches.length) {
                            Main.controller.Match.liveMatchList('#home-tournaments-live-games', matches);
                            var key = Main.controller.GameHome.tournamentMatchKey(matches[0].tournament_name);
                            window.localStorage.setItem(key, JSON.stringify(matches));
                        } else {
                            //TODO - display no match found or something similar

                        }
                    })
                    .error(function (err) {
                        Main.controller.Util.lastTournamentMatchRequestTime[tornamenent_name] = oldTime;
                        //TODO - display error

                    });

        });

    }

};



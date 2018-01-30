

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

        //find the tournament
        Ns.view.Tournament.getInfo(tournament_name, function (tournament) {
            setContent(tournament);
        });


        function setContent(tournament) {

            /*
             "tournament-details-tournament-name"
             "tournament-details-photo-url"
             "tournament-details-created-by"
             "tournament-details-date-created"
             "tournament-details-back-btn"    
             "tournament-details-edit"    
             "tournament-details-menu"    
             "tournament-details-officials"    
             "tournament-details-season"
             "tournament-details-registered-players"
             "tournament-details-stage"
             "tournament-details-match-fixtures"
             */



            if (!tournament) {
                return;
            }
            
            document.getElementById("tournament-details-tournament-name").innerHTML = tournament.name;
            document.getElementById("tournament-details-photo-url").src = tournament.photo_url;
            document.getElementById("tournament-details-created-by").innerHTML = tournament.created_by;
            document.getElementById("tournament-details-date-created").innerHTML = tournament.date_created;
            document.getElementById("tournament-details-season").innerHTML = tournament.season;
            document.getElementById("tournament-details-stage").innerHTML = tournament.round;
            
            //document.getElementById("tournament-details-match-fixtures").innerHTML = tournament.match_fixture;
            //document.getElementById("tournament-details-officials").innerHTML = tournament.officials;
            //document.getElementById("tournament-details-registered-players").innerHTML = tournament.registered_players;
            

        }


        /* $('#tournament-details-back-btn').on('click', function () {
         Main.card.back({
         container: '#home-main',
         });
         
         });
         */
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
                var tourns = Ns.view.Tournament.tournamentList[k];
                if (tourns.name === tournaments[i].name) {
                    tourns = tournaments[i];//replace
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
            Main.ro.tournament.getTournamentInfo(tournament_name)
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
        var belong = user.tournaments_belong;
        if (belong) {
            for (var i = 0; i < belong.length; i++) {
                for (var k = 0; k < Ns.view.Tournament.tournamentList.length; k++) {
                    if (Ns.view.Tournament.tournamentList[k].name === belong[i]) {
                        trns.push(Ns.view.Tournament.tournamentList[k]);
                    }
                }
            }
            
            if (trns.length === belong.length) {//all was found locally
                if (Main.util.isFunc(callback)) {
                    callback(trns);
                }
                return;//so leave
            }
        }
        //get remotelly
        
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
    
    onSeasonStart: function(obj){
        
    },
    
    onSeasonCancel: function(obj){
        
    },
    
    onSeasonDelete: function(obj){
        
    },
    
    onSeasonEnd: function(obj){
        
    }

    //more goes below
};
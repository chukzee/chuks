



/* global Main */

Main.on("pagecreate", function (arg) {


    var obj = {
        tourn: 'info/Tournament',
    };

    Main.rcall.live(obj);


    Main.eventio.on('season_start', onSeasonStart);
    Main.eventio.on('season_cancel', onSeasonCancel);
    Main.eventio.on('season_delete', onSeasonDelete);
    Main.eventio.on('season_end', onSeasonEnd);

    function onSeasonStart(obj) {
        ///alert('onSeasonStart');
        //alert(obj);
        console.log(obj);
    }

    function onSeasonCancel(obj) {
        //alert('onSeasonCancel');
        //alert(obj);
        console.log(obj);
    }

    function onSeasonDelete(obj) {
        //alert('onSeasonDelete');
        //alert(obj);
        console.log(obj);
    }

    function onSeasonEnd(obj) {
        //alert('onSeasonEnd');
        //alert(obj);
        console.log(obj);
    }

    $('#test-simulate-page').on('click', function () {
        //alert('#btn-page1-next');

        Main.page.show({
            url: 'test/simulate/simulate-test-1.html',
            effect: "slideleft",
            duration: 3000,
            data: {game: "testgame"}
        });
    });

    /*
     <input type="file" id="create-tournament-icon-file" name="group_icon"/>
     <button id="btn-edit-tournament" style="margin: 5px;">Edit tournament</button>
     <button id="btn-create-tournament" style="margin: 5px;">Create tournament</button>
     <button id="btn-set-game-sets-count" style="margin: 5px;">Set game sets count</button>
     <button id="btn-add-official" style="margin: 5px;">Add official</button>
     <button id="btn-remove-official" style="margin: 5px;">Remove official</button>
     <button id="btn-register-player" style="margin: 5px;">Register player</button>
     <button id="btn-remove-registered-player" style="margin: 5px;">Remove registered player</button>
     <button id="btn-get-tournament-info" style="margin: 5px;">Get tournament info</button>
     <button id="btn-get-tournaments-info-list" style="margin: 5px;">Get tournaments info list</button>
     <button id="btn-season-new" style="margin: 5px;">Season new</button>
     <button id="btn-season-add-player" style="margin: 5px;">Season add player</button>
     <button id="btn-season-remove-player" style="margin: 5px;">Season remove player</button>
     <button id="btn-season-get-players" style="margin: 5px;">Season get players</button>
     <button id="btn-season-get-slots" style="margin: 5px;">Season get slots</button>
     <button id="btn-season-match-kickoff" style="margin: 5px;">Season match kickoff</button>
     <button id="btn-season-start" style="margin: 5px;">Season start</button>
     <button id="btn-season-cancel" style="margin: 5px;">Season cancel</button>
     <button id="btn-season-delete" style="margin: 5px;">Season delete</button>
     <button id="btn-season-count" style="margin: 5px;">Season count</button>
     <button id="btn-get-seasons" style="margin: 5px;">Get seasons</button>
     <button id="btn-season-table-standings" style="margin: 5px;">Season Table Standings</button>         
     */

    $('#btn-create-tournament').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var game = prompt('game', 'chess');
        var variant = prompt('variant', '');
        var type = prompt('tournament_type', '');
        var sets_count = prompt('sets_count', '');
        var status_message = prompt('status_message', '');

        var file_input = document.getElementById('create-tournament-icon-file');
        
        Main.ro.tourn.createTournament(user_id, tournament_name, game, variant, type, sets_count ,status_message)
                .attach([file_input])
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-edit-tournament').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');

        var file_input = document.getElementById('create-tournament-icon-file');
        
        Main.ro.tourn.editTournament(user_id, tournament_name)
                .attach([file_input])
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-set-game-sets-count').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var sets_count = prompt('sets_count', '');

        Main.ro.tourn.setGameSetsCount(user_id, tournament_name, sets_count)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-add-official').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var new_official_user_id = prompt('new_official_user_id', '');

        Main.ro.tourn.addOfficial(user_id, tournament_name, new_official_user_id)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-remove-official').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var official_user_id = prompt('official_user_id', '');

        Main.ro.tourn.removeOfficial(user_id, tournament_name, official_user_id)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-register-player').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var player_user_id = prompt('player_user_id', '');

        Main.ro.tourn.registerPlayer(user_id, tournament_name, player_user_id)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-remove-registered-player').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var player_user_id = prompt('player_user_id', '');

        Main.ro.tourn.removeRegisteredPlayer(user_id, tournament_name, player_user_id)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-get-tournament-info').on('click', function () {

        var tournament_name = prompt('tournament_name', '');

        Main.ro.tourn.getTournamentInfo(tournament_name)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-get-tournaments-info-list').on('click', function () {

        var tournament_names_arr = prompt('enter list of torunamen names separated by comma', '');
        if (tournament_names_arr) {
            tournament_names_arr = tournament_names_arr.split(',');
        } else {
            tournament_names_arr = [];
        }
        
        Main.ro.tourn.getTournamentsInfoList(tournament_names_arr)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-new').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var players_count = prompt('players_count', '');
        var start_time = prompt('start_time', '');

        Main.ro.tourn.seasonNew(user_id, tournament_name, players_count, start_time)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-add-player').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var season_number = prompt('season_number', '');
        var player_id = prompt('player_id', '');
        var slot_number = prompt('slot_number', '');

        Main.ro.tourn.seasonAddPlayer(user_id, tournament_name, season_number, player_id, slot_number)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });


    $('#btn-season-remove-player').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var season_number = prompt('season_number', '');
        var player_id = prompt('player_id', '');

        Main.ro.tourn.seasonRemovePlayer(user_id, tournament_name, season_number, player_id)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-get-players').on('click', function () {

        var tournament_name = prompt('tournament_name', '');
        var season_number = prompt('season_number', '');

        Main.ro.tourn.seasonGetPlayers(tournament_name, season_number)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-get-slots').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var season_number = prompt('season_number', '');

        Main.ro.tourn.seasonGetSlots(user_id, tournament_name, season_number)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-match-kickoff').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var game_id = prompt('game_id', '');
        var kickoff_time = prompt('kickoff_time', '');

        Main.ro.tourn.seasonMatchKickOff(user_id, tournament_name, game_id, kickoff_time)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-start').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var season_number = prompt('season_number', '');
        var start_time = prompt('start_time', '');

        Main.ro.tourn.seasonStart(user_id, tournament_name, season_number, start_time)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-cancel').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var season_number = prompt('season_number', '');
        var reason = prompt('reason', '');

        Main.ro.tourn.seasonCancel(user_id, tournament_name, season_number, reason)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-delete').on('click', function () {

        var user_id = prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var season_number = prompt('season_number', '');
        var reason = prompt('reason', '');

        Main.ro.tourn.seasonDelete(user_id, tournament_name, season_number, reason)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-count').on('click', function () {

        var tournament_name = prompt('tournament_name', '');

        Main.ro.tourn.seasonCount(tournament_name)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-get-seasons').on('click', function () {

        var tournament_name = prompt('tournament_name', '');

        Main.ro.tourn.getSeasons(tournament_name)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-season-table-standings').on('click', function () {

        var tournament_name = prompt('tournament_name', '');
        var season_number = prompt('season_number', '');

        Main.ro.tourn.seasonTableStandings(tournament_name, season_number)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    
});
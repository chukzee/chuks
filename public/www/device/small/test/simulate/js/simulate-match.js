



Main.on("pagecreate", function (arg) {


    var obj = {
        match: 'game/Match',
    };

    Main.rcall.live(obj);
    
    Main.eventio.on('game_move', onGameMove);
    Main.eventio.on('game_move_sent', onGameMoveSent);
    Main.eventio.on('notify_upcoming_match', onNotifyUpComingMatch);
    Main.eventio.on('game_start', onGameStart);
    Main.eventio.on('game_start_next_set', onGameStartNextSet);
    Main.eventio.on('watch_game_start', onWatchGameStart);
    Main.eventio.on('watch_game_start_next_set', onWatchGameStartNextSet);
    Main.eventio.on('game_resume', onGameResume);
    Main.eventio.on('watch_game_resume', onWatchGameResume);
    Main.eventio.on('game_pause', onGamePause);
    Main.eventio.on('game_abandon', onGameAbandon);
    Main.eventio.on('game_finish', onGameFinish);

    function onGameMove(obj){
        //alert('onGameMove');
        //alert(obj);
        console.log(obj);
    }

    function onGameMoveSent(obj){
        //alert('onGameMoveSent');
        //alert(obj);
        console.log(obj);
    }

    function onNotifyUpComingMatch(obj){
        //alert('onNotifyUpComingMatch');
        //alert(obj);
        console.log(obj);
    }
    
    function onGameStart(obj){
        //alert('onGameStart');
        //alert(obj);
        console.log(obj);
    }
    
    function onGameStartNextSet(obj){
        //alert('onGameStartNextSet');
        //alert(obj);
        console.log(obj);
    }

    function onWatchGameStart(obj){
        //alert('onWatchGameStart');
        //alert(obj);
        console.log(obj);
    }

    function onWatchGameStartNextSet(obj){
        //alert('onWatchGameStartNextSet');
        //alert(obj);
        console.log(obj);
    }
    
    function onGameResume(obj){
        //alert('onGameResume');
        //alert(obj);
        console.log(obj);
    }

    function onWatchGameResume(obj){
        //alert('onWatchGameResume');
        //alert(obj);
        console.log(obj);
    }

    function onGamePause(obj){
        //alert('onGamePause');
        //alert(obj);
        console.log(obj);
    }

    function onGameAbandon(obj){
        //alert('onGameAbandon');
        //alert(obj);
        console.log(obj);
    }

    function onGameFinish(obj){
        //alert('onGameFinish');
        //alert(obj);
        console.log(obj);
    }

    $('#test-simulate-page').on('click', function () {
        ////alert('#btn-page1-next');

        Main.page.show({
            url: 'test/simulate/simulate-test-1.html',
            effect: "slideleft",
            duration: 3000,
            data: {game: "testgame"}
        });
    });

/*

        <button id="btn-send-move" style="margin: 5px;">Send move</button>
        <button id="btn-get-game-position" style="margin: 5px;">Get game position</button>
        <button id="btn-start" style="margin: 5px;">Start</button>
        <button id="btn-resume" style="margin: 5px;">Resume</button>
        <button id="btn-pause" style="margin: 5px;">Pause</button>
        <button id="btn-abandon" style="margin: 5px;">Abandon</button>
        <button id="btn-finish" style="margin: 5px;">Finish</button>
        <button id="btn-get-contacts-match-list" style="margin: 5px;">Get contacts match list</button>
        <button id="btn-get-group-match-list" style="margin: 5px;">Get group match list</button>
        <button id="btn-get-tournament-match-list" style="margin: 5px;">Get tournament match list</button>
        <button id="btn-get-user-match-history" style="margin: 5px;">Get user match history</button>
 */

    $('#btn-send-move').on('click', function () {

        var user_id = prompt('user_id', '');
        var opponent_id = prompt('opponent_id', '');
        var game_id = prompt('game_id', '');
        var set = prompt('game set', 1);
        var move = {
            serial_no : prompt('move serial no', 0)
        };

        Main.ro.match.sendMove(user_id, opponent_id, game_id, set, move)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });

    $('#btn-get-game-position').on('click', function () {

        var game_id = prompt('game_id', '');
        var set = prompt('game set', 1);
        
        Main.ro.match.getGamePosition(game_id, set)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-start').on('click', function () {

        var game_id = prompt('game_id', '');
        var fixture_type = prompt('fixture_type', '');

        Main.ro.match.start(game_id, fixture_type)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-resume').on('click', function () {

        var user_id = prompt('user_id', '');
        var game_id = prompt('game_id', '');

        Main.ro.match.resume(user_id, game_id)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-pause').on('click', function () {

        var user_id = prompt('user_id', '');
        var game_id = prompt('game_id', '');

        Main.ro.match.pause(user_id, game_id)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-abandon').on('click', function () {

        var user_id = prompt('user_id', '');
        var game_id = prompt('game_id', '');

        Main.ro.match.abandon(user_id, game_id)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-finish').on('click', function () {

        var game_id = prompt('game_id', '');
        var winner_user_id = prompt('winner_user_id', '');
        
        Main.ro.match.finish(game_id, winner_user_id)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-get-contacts-match-list').on('click', function () {

        var user_id = prompt('user_id', '');
        var game_name = prompt('game_name', 'chess');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);
        
        Main.ro.match.getContactsMatchList(user_id, game_name, skip, limit)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-get-group-match-list').on('click', function () {

        var user_id =  prompt('user_id', '');
        var group_name = prompt('group_name', '');
        var game_name = prompt('game_name', 'chess');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);
        
        Main.ro.match.getGroupMatchList(user_id, group_name, game_name, skip, limit)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-get-tournament-match-list').on('click', function () {

        var user_id =  prompt('user_id', '');
        var tournament_name = prompt('tournament_name', '');
        var game_name = prompt('game_name', 'chess');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);
        
        Main.ro.match.getTournamentMatchList(user_id, tournament_name, game_name, skip, limit)
                .get(function (data) {
                    //alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    //alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-get-user-match-history').on('click', function () {

        var user_id = prompt('user_id', '');
        var filter = prompt('filter : valid values are contact, group, tournament', 'group');
        var is_include_abandoned_matches = prompt('is_include_abandoned_matches', true);
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);
        
        Main.ro.match.getUserMatchHistory(user_id, filter, is_include_abandoned_matches, skip, limit)
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
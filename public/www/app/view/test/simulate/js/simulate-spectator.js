



Main.on("pagecreate", function (arg) {


    var obj = {
        spectator: 'game/Spectator',
    };

    Main.rcall.live(obj);
    

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
        <button id="btn-join" style="margin: 5px;">Join</button>
        <button id="btn-leave" style="margin: 5px;">Leave</button>
        <button id="btn-get" style="margin: 5px;">Get</button>
 */

    $('#btn-join').on('click', function () {

        var user_id = prompt('user_id', '');
        var game_id = prompt('game_id', '');
        var prev_game_id = prompt('prev_game_id', '');
        var game_start_time = prompt('game_start_time', '');
        
        Main.ro.spectator.join(user_id, game_id, prev_game_id,  game_start_time)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-leave').on('click', function () {


        var user_id = prompt('user_id', '');
        var game_id = prompt('game_id', '');
        
        Main.ro.spectator.leave(user_id, game_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
  
    $('#btn-get').on('click', function () {

        var game_id = prompt('game_id', '');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);
        
        Main.ro.spectator.get(game_id, skip, limit)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
         
});




Main.on("pagecreate", function (arg) {


    var obj = {
        stats: 'game/Stats',
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

        <button id="btn-htoh" style="margin: 5px;">hToh</button>
        <button id="btn-htoh-contact" style="margin: 5px;">hTohContact</button>
        <button id="btn-htoh-group" style="margin: 5px;">hTohGroup</button>
        <button id="btn-htoh-torunament" style="margin: 5px;">hTohTournament</button>
 */

    $('#btn-htoh').on('click', function () {

        var player_1_id = prompt('player_1_id','07032710628');
        var player_2_id = prompt('player_2_id','07023232323');
        var is_include_abandoned_matches = prompt('is_include_abandoned_matches','');
        var skip = prompt('skip','');
        var limit = prompt('limit','');

        Main.ro.stats.hToh(player_1_id, player_2_id, is_include_abandoned_matches, skip, limit)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-htoh-contact').on('click', function () {

        var player_1_id = prompt('player_1_id','07032710628');
        var player_2_id = prompt('player_2_id','07023232323');
        var is_include_abandoned_matches = prompt('is_include_abandoned_matches','');
        var skip = prompt('skip','');
        var limit = prompt('limit','');

        Main.ro.stats.hTohContact(player_1_id, player_2_id, is_include_abandoned_matches, skip, limit)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-htoh-group').on('click', function () {

        var group_name = prompt('group_name','Group1');
        var player_1_id = prompt('player_1_id','07032710628');
        var player_2_id = prompt('player_2_id','07023232323');
        var is_include_abandoned_matches = prompt('is_include_abandoned_matches','');
        var skip = prompt('skip','');
        var limit = prompt('limit','');

        Main.ro.stats.hTohGroup(group_name, player_1_id, player_2_id, is_include_abandoned_matches, skip, limit)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-htoh-torunament').on('click', function () {

        var tournament_name = prompt('tournament_name','07032710628');
        var player_1_id = prompt('player_1_id','07032710628');
        var player_2_id = prompt('player_2_id','07023232323');
        var is_include_abandoned_matches = prompt('is_include_abandoned_matches','');
        var skip = prompt('skip','');
        var limit = prompt('limit','');

        Main.ro.stats.hTohTournament(tournament_name, player_1_id, player_2_id, is_include_abandoned_matches, skip, limit)
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
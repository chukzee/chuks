



Main.on("pagecreate", function (arg) {


    var obj = {
        tourn: 'info/Tournament',
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

        <button id="btn-create-tournament" style="margin: 5px;">Create tournament</button>
        <button id="btn-edit-tournament" style="margin: 5px;">Edit tournament</button>
        <button id="btn-set-tournament-icon" style="margin: 5px;">Set tournament icon</button>
        <button id="btn-set-tournament-status" style="margin: 5px;">Set tournament status</button>
        <button id="btn-add-official" style="margin: 5px;">Add official</button>
        <button id="btn-remove-official" style="margin: 5px;">Remove official</button>
        <button id="btn-add-player" style="margin: 5px;">Add player</button>
        <button id="btn-remove-player" style="margin: 5px;">Remove player</button>
        <button id="btn-get-tournament-info" style="margin: 5px;">Get tournament info</button>
        <button id="btn-get-tournaments-info-list" style="margin: 5px;">Get tournaments info list</button>
 */

    $('#btn-create-tournament').on('click', function () {

        var user_id = prompt('user_id','07032710628');
        var tournament_name = prompt('tournament_name','');
        var status_message = prompt('status_message','');
        var photo_url = prompt('photo_url','');

        Main.ro.tourn.createTournament(user_id, tournament_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-edit-tournament').on('click', function () {

        var obj = {};

        Main.ro.tourn.editTournament(obj)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-set-tournament-icon').on('click', function () {

        var user_id = prompt('user_id','07032710628');
        var photo_url = prompt('photo_url','');

        Main.ro.tourn.setTournamentIcon(user_id, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-set-tournament-status').on('click', function () {

        var user_id = prompt('user_id','07032710628');
        var tournament_name = prompt('tournament_name','');
        var status_message = prompt('status_message','');
        var photo_url = prompt('photo_url','');

        Main.ro.tourn.setTournamentStatus(user_id, tournament_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-add-official').on('click', function () {

        var user_id = prompt('user_id','07032710628');
        var tournament_name = prompt('tournament_name','');
        var new_official_user_id = prompt('new_official_user_id','');

        Main.ro.tourn.addOfficial(user_id, tournament_name, new_official_user_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-remove-official').on('click', function () {

        var user_id = prompt('user_id','07032710628');
        var tournament_name = prompt('tournament_name','');
        var official_user_id = prompt('official_user_id','');

        Main.ro.tourn.removeOfficial(user_id, tournament_name, official_user_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-add-player').on('click', function () {

        var user_id = prompt('user_id','07032710628');
        var tournament_name = prompt('tournament_name','');
        var player_user_id = prompt('player_user_id','');

        Main.ro.tourn.addPlayer(user_id, tournament_name, player_user_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-remove-player').on('click', function () {

        var user_id = prompt('user_id','07032710628');
        var tournament_name = prompt('tournament_name','');
        var player_user_id = prompt('player_user_id','');

        Main.ro.tourn.removePlayer(user_id, tournament_name, player_user_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-get-tournament-info').on('click', function () {

        var tournament_name = prompt('tournament_name','');

        Main.ro.tourn.getTournamentInfo(tournament_name)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-get-tournaments-info-list').on('click', function () {

        var tournament_names_arr = prompt('enter list of torunamen names separated by comma','');
        if(tournament_names_arr){
            tournament_names_arr = tournament_names_arr.split(',');
        }else{
            tournament_names_arr = [];
        }
        Main.ro.tourn.getTournamentsInfoList(tournament_names_arr)
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
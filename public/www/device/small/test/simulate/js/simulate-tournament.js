



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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.createTournament(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.editTournament(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.setTournamentIcon(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.setTournamentStatus(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.addOfficial(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.removeOfficial(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.addPlayer(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.removePlayer(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.getTournamentInfo(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.tourn.getTournamentsInfoList(user_id, group_name, status_message, photo_url)
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




Main.on("pagecreate", function (arg) {


    var obj = {
        match: 'game/Match',
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.sendMove(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-get-game-position').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.getGamePosition(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-start').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.start(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-resume').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.resume(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-abandon').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.abandon(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-finish').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.finish(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-get-contacts-match-list').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.getContactsMatchList(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-get-group-match-list').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.getGroupMatchList(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-get-tournament-match-list').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.getTournamentMatchList(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
   
    $('#btn-get-user-match-history').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.match.getUserMatchHistory(user_id, group_name, status_message, photo_url)
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
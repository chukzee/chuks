



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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.spectator.join(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.spectator.leave(user_id, group_name, status_message, photo_url)
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

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.spectator.get(user_id, group_name, status_message, photo_url)
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
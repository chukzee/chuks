



Main.on("pagecreate", function (arg) {


    var obj = {
        chat: 'game/Chat',
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

        <button id="btn-get-game-chats" style="margin: 5px;">Get game chats</button>
        <button id="btn-get-group-chats" style="margin: 5px;">Get group chats</button>
        <button id="btn-get-tournament-inhouse-chats" style="margin: 5px;">Get tournament inhouse chats</button>
        <button id="btn-get-tournament-general-chats" style="margin: 5px;">Get tournament general chats</button>
        <button id="btn-get-user-chats" style="margin: 5px;">Get user chats</button>
        <button id="btn-send-game-chat" style="margin: 5px;">Send game chat</button>
        <button id="btn-send-group-chat" style="margin: 5px;">Send group chat</button>
        <button id="btn-send-tournament-inhouse-chat" style="margin: 5px;">Send tournament inhouse chat</button>
        <button id="btn-send-tournament-general-chat" style="margin: 5px;">Send tournament general chat</button>
        <button id="btn-delivery-feedback" style="margin: 5px;">Delivery feedback</button>
 */

    $('#btn-get-game-chats').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.getGameChats(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-get-group-chats').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.getGroupChats(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
      
    $('#btn-get-tournament-inhouse-chats').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.getTournamentInhousChats(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
      
    $('#btn-get-tournament-general-chats').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.getTournamentGeneralChats(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
      
    $('#btn-get-user-chats').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.getUserChats(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
      
    $('#btn-send-game-chat').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.sendGameChat(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
      
    $('#btn-send-group-chat').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.sendGroupChat(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
      
    $('#btn-send-tournament-inhouse-chat').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.sendTournamentInhouseChat(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
      
    $('#btn-send-tournament-general-chat').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.sendTournamentGeneralChat(user_id, group_name, status_message, photo_url)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
      
    $('#btn-delivery-feedback').on('click', function () {

        var user_id = '07032710628';
        var group_name = 'Group1';
        var status_message = 'The best group';
        var photo_url = 'group_url_1';

        Main.ro.chat.deliveryFeedback(user_id, group_name, status_message, photo_url)
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
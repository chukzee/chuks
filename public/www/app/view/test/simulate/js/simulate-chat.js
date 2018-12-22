



Main.on("pagecreate", function (arg) {


    var obj = {
        chat: 'game/Chat',
    };

    Main.rcall.live(obj);
    
    Main.eventio.on('game_chat', onGameChat);
    Main.eventio.on('group_chat', onGroupChat);
    Main.eventio.on('tournament_inhouse_chat', onTournamentInhouseChat);
    Main.eventio.on('tournament_general_chat', onTournamentGeneralChat);

    function onGameChat(obj){
        alert('onGameChat');
        alert(obj);
        console.log(obj);
    }

    function onGroupChat(obj){
        alert('onGroupChat');
        alert(obj);
        console.log(obj);
    }

    function onTournamentInhouseChat(obj){
        alert('onTournamentInhouseChat');
        alert(obj);
        console.log(obj);
    }

    function onTournamentGeneralChat(obj){
        alert('onTournamentGeneralChat');
        alert(obj);
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

        var user_id = prompt('user_id', '07032710628');
        var game_id = prompt('game_id', '');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);

        Main.ro.chat.getGameChats(user_id, game_id, skip, limit)
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
        
        var user_id = prompt('user_id', '07032710628');
        var group_name = prompt('group_name', 'Group1');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);

        Main.ro.chat.getGroupChats(user_id, group_name, skip, limit)
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

        var user_id = prompt('user_id', '07032710628');
        var tournament_name = prompt('tournament_name', '');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);

        Main.ro.chat.getTournamentInhousChats(user_id, tournament_name, skip, limit)
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

        var user_id = prompt('user_id', '07032710628');
        var tournament_name = prompt('tournament_name', '');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);

        Main.ro.chat.getTournamentGeneralChats(user_id, tournament_name, skip, limit)
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

        var user_id = prompt('user_id', '07032710628');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);

        Main.ro.chat.getUserChats(user_id, skip, limit)
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

        var user_id = prompt('user_id', '07032710628');
        var opponent_id = prompt('opponent_id', '07032710628');
        var game_id = prompt('game_id', '');
        var msg = prompt('msg', 'my chat message');

        Main.ro.chat.sendGameChat(user_id, opponent_id, game_id, msg)
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

        var user_id = prompt('user_id', '07032710628');
        var group_name = prompt('group_name', 'Group1');
        var msg = prompt('msg', 'my group chat msg');

        Main.ro.chat.sendGroupChat(user_id, group_name, msg)
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

        var user_id = prompt('user_id', '07032710628');
        var tournament_name = prompt('tournament_name', 'Group1');
        var msg = prompt('msg', 'my message');

        Main.ro.chat.sendTournamentInhouseChat(user_id, tournament_name, msg)
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

        var user_id = prompt('user_id', '07032710628');
        var tournament_name = prompt('tournament_name', 'Group1');
        var msg = prompt('msg', 'my message');

        Main.ro.chat.sendTournamentGeneralChat(user_id, tournament_name, msg)
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

        var sender_id = prompt('sender_id', '07032710628');
        var recipient_id = prompt('recipient_id', '07032710628');
        var game_id = prompt('game_id', '');
        var msg = prompt('msg', 'my message');
        
        Main.ro.chat.deliveryFeedback(sender_id, recipient_id, game_id, msg)
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
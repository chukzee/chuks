



Main.on("pagecreate", function (arg) {


    var obj = {
        play_request: 'game/PlayRequest',
    };

    Main.rcall.live(obj);
    
    Main.eventio.on('play_request', onPlayRequest);
    Main.eventio.on('play_request_rejected', onPlayRequestRejected);
    Main.eventio.on('play_request_expired', onPlayRequestExpired);
    
    var play_request_game_id;
    
    function onPlayRequest(obj){
        alert('onPlayRequest');
        alert(obj);
        console.log(obj);
        play_request_game_id = obj.data.game_id;
    }
    
    function onPlayRequestRejected(obj){
        alert('onPlayRequestRejected');
        alert(obj);
        console.log(obj);
    }
   
    function onPlayRequestExpired(obj){
        alert('onPlayRequestExpired');
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

        <button id="btn-send-request" style="margin: 5px;">Send request</button>
        <button id="btn-abort" style="margin: 5px;">Abort</button>
        <button id="btn-reject" style="margin: 5px;">Reject</button>
 */

    $('#btn-send-request').on('click', function () {

        var initiator_id = prompt('initiator_id', '');
        var opponent_ids = prompt('enter opponent id(s) separated by comma if more than one ', ''); // or array of players ids e.g ludo
        var game_name = prompt('game_name', '');
        var game_rules = {};
        var group_name = prompt('enter group name (only if player is picked from group profile page)', '');
        
        if(!opponent_ids){
            opponent_ids = '';
        }
        opponent_ids = opponent_ids.split(',');

        Main.ro.play_request.sendRequest(initiator_id, opponent_ids, game_name, game_rules, group_name)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });

    $('#btn-abort').on('click', function () {

        var play_request_game_id = prompt('play_request_game_id', '');

        Main.ro.play_request.abort(play_request_game_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-reject').on('click', function () {

        var play_request_game_id = prompt('play_request_game_id', '');

        Main.ro.play_request.reject(play_request_game_id)
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
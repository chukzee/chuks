



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

        var initiator_id = '07032710628';
        var opponent_ids = '07023232323'; // or array of players ids e.g ludo
        var game_name = 'chess';
        var game_rules = {};

        Main.ro.play_request.sendRequest(initiator_id, opponent_ids, game_name, game_rules)
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

        var game_id = play_request_game_id;

        Main.ro.play_request.abort(game_id)
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

        var game_id = play_request_game_id;

        Main.ro.play_request.reject(game_id)
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
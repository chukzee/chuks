



Main.on("pagecreate", function (arg) {


    var obj = {
        comment: 'game/Comment',
    };

    Main.rcall.live(obj);
    
    Main.eventio.on('comment', onComment);

    function onComment(obj){
        alert('onComment');
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

        <button id="btn-get-game-comments" style="margin: 5px;">Get game comments</button>
        <button id="btn-get-user-comments" style="margin: 5px;">Get user comments</button>
        <button id="btn-add" style="margin: 5px;">Add</button>
        <button id="btn-like" style="margin: 5px;">Like</button>
        <button id="btn-dislike" style="margin: 5px;">Dislike</button>
 */

    $('#btn-get-game-comments').on('click', function () {

        var user_id = prompt('user_id', '07032710628');
        var game_id = prompt('game_id', '');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);

        Main.ro.comment.getGameComments(user_id, game_id, skip, limit)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
    
    $('#btn-get-user-comments').on('click', function () {

        var user_id = prompt('user_id', '07032710628');
        var skip = prompt('skip', 0);
        var limit = prompt('limit', 50);

        Main.ro.comment.getUserComments(user_id, skip, limit)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
       
    $('#btn-add').on('click', function () {

        var user_id = prompt('user_id', '07032710628');
        var game_id = prompt('game_id', '');
        var msg_content = prompt('msg_content', '');
        var msg_replied_id = prompt('msg_replied_id', '');

        Main.ro.comment.sendGameComment(user_id, game_id, msg_content, msg_replied_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
       
    $('#btn-like').on('click', function () {
        
        var user_id = prompt('user_id', '07032710628');
        var msg_id = prompt('msg_id', '');

        Main.ro.comment.like(user_id, msg_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);
                })
                .error(function (err) {
                    alert(err);
                    console.log(err);
                });

    });
       
    $('#btn-dislike').on('click', function () {

        var user_id = prompt('user_id', '07032710628');
        var msg_id = prompt('msg_id', '');

        Main.ro.comment.dislike(user_id, msg_id)
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
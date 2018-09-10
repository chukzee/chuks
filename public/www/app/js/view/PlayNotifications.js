
Ns.view.PlayNotifications = {

    constructor: function () {
        var obj = {
            play_request: 'game/PlayRequest',
            tourn: 'info/Tournament'
        };

        Main.rcall.live(obj);

    },

    content: function () {

        var list = Ns.PlayRequest.playRequestList;
        if (list.length === 0) {
            try {
                list = window.localStorage.getItem(Ns.Const.PLAY_REQUEST_LIST_KEY);
                list = JSON.parse(list);
            } catch (e) {
                console.warn(e);
            }
        }

        Ns.PlayRequest.playRequestList = list;


        function addListItem(data) {
            if (!Main.util.isArray(data)) {
                console.warn('expected array!');
                return;
            }

            if (data.length === 0) {
                return;
            }



            //TODO - Add the contacts and group play request and the tournament upcoming match to the list
        }


        Main.rcall.live(function () {
            var user_id = Ns.view.UserProfile.appUser.user_id;
            var game_name = Ns.ui.UI.selectedGame;
            var skip = 0;
            var limit = Ns.Const.MAX_LIST_SIZE;

            var displayReqCountInfo = function (d) {
                if (!Main.util.isArray(d)) {
                    return;
                }
                var text = d.length < 2 ? "player waiting." : "players waiting.";
                document.getElementById('game-play-notifications-play-request-count').innerHTML = d.length;
                document.getElementById('game-play-notifications-play-request-text').innerHTML = text;

            };

            Main.ro.play_request.get(user_id, game_name, skip, limit)
                    .get(function (data) {
                        Ns.PlayRequest.playRequestList = data;
                        displayReqCountInfo(data);
                        addListItem(data);
                    })
                    .error(function (err) {
                        //TODO - display error
                        console.log(err);
                        
                        var d = Ns.PlayRequest.playRequestList;
                        displayReqCountInfo(d);
                        //just show any available ones
                        addListItem(Ns.PlayRequest.playRequestList);
                    });



            Main.ro.tourn.getUpcomingMatches(user_id, game_name, skip, limit)
                    .get(function (data) {

                        var text = data.length < 2 ? "upcoming match." : "upcoming matches.";
                        document.getElementById('game-play-notifications-upcoming-count').innerHTML = data.length;
                        document.getElementById('game-play-notifications-upcoming-text').innerHTML = text;

                        addListItem(data);
                    })
                    .error(function (err) {
                        //TODO - display error
                        console.log(err);
                    });


        });







    },

    onClickNotification: function (evt, game_id) {

        //COME BACK ABEG O!!!

        //var list = Ns.PlayRequest.playRequestList ; // TODO- AND tournament fixtures - come back
        /*
         var up_coming;
         for (var i = 0; i < list.length; i++) {
         if (list[i].game_id === game_id) {
         up_coming = list[i];
         break;
         }
         }
         
         if (!up_coming) {
         return;
         }
         
         var player_opponents = Ns.view.PlayNotifications.getOpponents(up_coming);
         var opponent = player_opponents[0];
         
         if (evt.target.name === 'user_photo') {
         Ns.view.PlayNotifications.onClickPlayerPhoto(opponent);
         }
         
         
         if (evt.target.name === 'action') {
         if (evt.target.value.toLowerCase() === 'game start') {
         Ns.view.PlayNotifications.onClickGameStart(up_coming);
         }
         }
         */
    },

    getOpponents: function (up_coming) {
        var app_user_id = Ns.view.UserProfile.appUser.user_id;
        var opponents = [];
        for (var i = 0; i < up_coming.players.length; i++) {
            if (up_coming.players[i].user_id !== app_user_id) {
                opponents.push(up_coming.players[i]);
            }
        }
        return opponents;
    },

    onClickPlayerPhoto: function (contact) {
        alert('onClickPlayerPhoto');
    },

    onClickGameStart: function (play_request) {
        var game_id = play_request.game_id;
        var fixture_type = null;

        Main.ro.match.start(game_id)
                .get(function (data) {
                    alert(data);
                    console.log(data);

                    //go to game view

                })
                .error(function (err) {
                    console(err);
                    console.log(err);

                    // the user may try again

                });
    },

    //more goes below
};
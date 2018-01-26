
Ns.view.PlayNotifications = {

    constructor: function () {


    },

    content: function (focus) {

        var list = Ns.game.PlayRequest.playRequestList;
        if (list.length === 0) {
            try {
                list = window.localStorage.getItem(Ns.Const.PLAY_REQUEST_LIST_KEY);
                list = JSON.parse(list);
            } catch (e) {
                console.warn(e);
            }
        }

        Ns.game.PlayRequest.playRequestList = list;

        var active_tab_index = 0;

        switch (focus) {
            case 'contact':
                active_tab_index = 0;
                break;
            case 'group':
                active_tab_index = 1;
                break;
            case 'tournament':
                active_tab_index = 2;
                break
        }

        Main.tab({
            container: document.getElementById("notifications-tab-container"),
            activeTabIndex: active_tab_index,
            onShow: {

                //"#home-contacts-matches": aFuction,
                //"#home-groups-matches": aFuction,
                //"#home-tournaments-matches": aFuction
            }
        });


        //document.getElementById("play-notifications-count").innerHTML = list.length;


    },

    onClickNotification: function (evt, game_id) {

        var list = Ns.game.PlayRequest.playRequestList;

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

    },

    getOpponents: function (play_request) {
        var app_user_id = Ns.view.UserProfile.appUser.user_id;
        var opponents = [];
        for (var i = 0; i < play_request.players.length; i++) {
            if (play_request.players[i].user_id !== app_user_id) {
                opponents.push(play_request.players[i]);
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
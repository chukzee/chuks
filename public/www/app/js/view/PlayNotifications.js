
/* global Main, Ns */

Ns.view.PlayNotifications = {

    DOM_EXTRA_FIELD_PREFIX: '-dom-extra-field',

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


        function addPlayRequestListItem(data_arr) {
            if (!Main.util.isArray(data_arr)) {
                console.warn('expected array!');
                return;
            }

            if (data_arr.length === 0) {
                return;
            }

            for (var i = 0; i < data_arr.length; i++) {

                Main.tpl.template({
                    tplUrl: 'play-reques-tpl.html',
                    data: data_arr[i],
                    onReplace: function (tpl_var, data) {
                        if (tpl_var === 'param') {
                            if (data.group_name) {
                                return data.group_name;
                            } else {
                                data.user_id; //phone number
                            }
                        }
                    },
                    afterReplace: addPlayRequestItem
                });

            }


        }


        function addUpcomingMatchListItem(data_arr) {
            if (!Main.util.isArray(data_arr)) {
                console.warn('expected array!');
                return;
            }

            if (data_arr.length === 0) {
                return;
            }

            for (var i = 0; i < data_arr.length; i++) {

                Main.tpl.template({
                    tplUrl: 'upcoming-tournament-match-tpl',
                    data: data_arr[i],
                    onReplace: function (tpl_var, data) {
                        if (tpl_var === 'kickoff') {
                            return data.start_time;
                        }
                    },
                    afterReplace: addUpcomingMatchItem
                });

            }


        }

        function appendItem(html, data) {

            var el_id = 'game9ja-play-notifications-body';
            var dom_extra_field = el_id + Ns.view.PlayNotifications.DOM_EXTRA_FIELD_PREFIX;

            //now add the item
            $('#' + el_id).append(html);
            var children = $('#' + el_id).children();
            var last_child = children[children.length - 1];
            last_child[dom_extra_field] = data;

            return last_child;
        }

        function addPlayRequestItem(html, data) {

            var el = appendItem(html, data);

            var start_game_btn = el.querySelector('input[name=start_game_btn]');
            var opponent_photo = el.querySelector('img[name=opponent_photo]');

            $(start_game_btn).on('click', data, Ns.view.PlayNotifications._onClickStartGame);
            $(opponent_photo).on('click', data, Ns.view.PlayNotifications._onClickPlayerPhoto);
        }


        function addUpcomingMatchItem(html, data) {

            var el = appendItem(html, data);

            var kickoff_btn = el.querySelector('input[name=kickoff_btn]');
            var opponent_photo = el.querySelector('img[name=opponent_photo]');

            $(kickoff_btn).on('click', data, Ns.view.PlayNotifications._countdownToKickoff);
            $(opponent_photo).on('click', data, Ns.view.PlayNotifications._onClickPlayerPhoto);
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
                        addPlayRequestListItem(data);
                    })
                    .error(function (err) {
                        //TODO - display error
                        console.log(err);

                        var d = Ns.PlayRequest.playRequestList;
                        displayReqCountInfo(d);
                        //just show any available ones
                        addPlayRequestListItem(Ns.PlayRequest.playRequestList);
                    });



            Main.ro.tourn.getUpcomingMatches(user_id, game_name, skip, limit)
                    .get(function (data) {

                        var text = data.length < 2 ? "upcoming match." : "upcoming matches.";
                        document.getElementById('game-play-notifications-upcoming-count').innerHTML = data.length;
                        document.getElementById('game-play-notifications-upcoming-text').innerHTML = text;

                        addUpcomingMatchListItem(data);
                    })
                    .error(function (err) {
                        //TODO - display error
                        console.log(err);
                    });


        });


    },

    _onClickPlayerPhoto: function (data) {
        alert('_onClickPlayerPhoto');
    },

    _countdownToKickoff: function (data) {

    },

    _onClickStartGame: function (play_request) {

        var game_id = play_request.game_id;

        Main.ro.match.start(game_id)
                .busy({html: 'Starting Game...'})
                .get(function (data) {

                    Ns.GameHome.showGameView(data);
            
                    console.log(data);
                })
                .error(function (err) {
                    Main.toast.show(err);

                    console.log(err);

                });
    },

    //more goes below
};
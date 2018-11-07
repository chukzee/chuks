
/* global Main, Ns */

Ns.view.Notifications = {

    DOM_EXTRA_FIELD_PREFIX: '-dom-extra-field',
    playRequestCount: 0,
    upcomingMatchCount: 0,
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

        function addNotificationListItem(notifications) {

            if (notifications.length === 0) {
                return;
            }

            //sort by notification time
            notifications.sort(function (a, b) {
                return a.notification_time - b.notification_time;
            });

            for (var i = 0; i < notifications.length; i++) {
                Ns.view.Notifications.addNotification(notifications[i]);
            }
        }

        Main.rcall.live(function () {
            var user_id = Ns.view.UserProfile.appUser.user_id;
            var game_name = Ns.ui.UI.selectedGame;
            var skip = 0;
            var limit = Ns.Const.MAX_LIST_SIZE;
            var promise_count = 0;
            var notifications = [];

            Main.ro.play_request.get(user_id, game_name, skip, limit)
                    .after(function (data, err) {
                        var play_requests = [];
                        if (err) {
                            //TODO - display error
                            console.log(err);
                            //just show any available ones
                            play_requests = Ns.PlayRequest.playRequestList;
                            if (!Main.util.isArray(play_requests)) {
                                play_requests = [];
                            }
                        } else {
                            play_requests = data.play_requests;
                            Ns.PlayRequest.playRequestList = play_requests;
                        }

                        Ns.view.Notifications.displayReqCountInfo(play_requests.length);
                        notifications = notifications.concat(play_requests);
                        promise_count++;
                        if (promise_count === 2) {
                            addNotificationListItem(notifications);
                        }
                    });

            Main.ro.tourn.getUpcomingMatches(user_id, game_name, skip, limit)
                    .after(function (data, err) {
                        var upcoming_matches = [];
                        if (err) {
                            //TODO - display error
                            console.log(err);
                        } else {
                            upcoming_matches = data.upcoming_matches;
                        }
                        Ns.view.Notifications.displayUpcomingMatchCountInfo(upcoming_matches.length);
                        notifications = notifications.concat(upcoming_matches);
                        promise_count++;
                        if (promise_count === 2) {
                            addNotificationListItem(notifications);
                        }
                    });


        });


    },

    addNotification: function (notification, use_uiupdater) {

        if (use_uiupdater) {
            Main.uiupdater.show({
                container: 'game-notifications-body',
                delay: 5,
                data: notification,
                //countdown: ....,
                update: doAddNotification
            });
        } else {
            doAddNotification(notification);
        }

        function doAddNotification(notificat) {
            if (notificat.tournament_name) {

                Main.tpl.template({
                    tplUrl: 'upcoming-tournament-match-tpl.html',
                    data: notificat,
                    onReplace: function (tpl_var, data) {
                        if (tpl_var === 'kickoff') {
                            return data.start_time;
                        }
                    },
                    afterReplace: Ns.view.Notifications._addUpcomingMatchItem
                });

            } else {//play request

                Main.tpl.template({
                    tplUrl: 'play-request-tpl.html',
                    data: notificat,
                    onReplace: function (tpl_var, data) {
                        var user_id = Ns.view.UserProfile.appUser.user_id;
                        var opponent = data.players[0].user_id !== user_id ? data.players[0] : data.players[1];
                        if (tpl_var === 'param') {
                            if (data.group_name) {
                                return data.group_name;
                            } else {
                                return opponent.user_id;
                            }
                        }
                        if (tpl_var === 'full_name') {
                            return opponent.full_name;
                        }

                    },
                    afterReplace: Ns.view.Notifications._addPlayRequestItem
                });
            }
        }

    },
    _domExtraField: function (id) {
        return id + Ns.view.Notifications.DOM_EXTRA_FIELD_PREFIX;
    },
    _addItem: function (html, data) {

        var el_id = 'game-notifications-body';
        var dom_extra_field = Ns.view.Notifications._domExtraField(el_id);

        //now add the item
        var el = document.getElementById(el_id);
        if (!el) {
            return;
        }
        $(el).prepend(html);
        var children = el.children;
        var first_child = children[0];//first child since we are prepending
        first_child[dom_extra_field] = data;
        return first_child;
    },

    _addPlayRequestItem: function (html, data) {

        var el = Ns.view.Notifications._addItem(html, data);

        var start_game_btn = el.querySelector('input[name=start_game_btn]');
        var opponent_photo = el.querySelector('img[name=opponent_photo]');

        $(start_game_btn).on('click', data, Ns.view.Notifications._onClickStartGame);
        $(opponent_photo).on('click', data, Ns.view.Notifications._onClickPlayerPhoto);
    },

    _addUpcomingMatchItem: function (html, data) {

        var el = Ns.view.Notifications._addItem(html, data);

        var kickoff_btn = el.querySelector('input[name=kickoff_btn]');
        var opponent_photo = el.querySelector('img[name=opponent_photo]');

        $(kickoff_btn).on('click', data, Ns.view.Notifications._countdownToKickoff);
        $(opponent_photo).on('click', data, Ns.view.Notifications._onClickPlayerPhoto);
    },

    displayReqCountInfo: function (count) {

        var el = document.getElementById('game-notifications-body');
        if (!el) {
            return;
        }
        Ns.view.Notifications.playRequestCount = count;
        var text = count < 2 ? "player waiting." : "players waiting.";
        document.getElementById('game-notifications-play-request-count').innerHTML = count;
        document.getElementById('game-notifications-play-request-text').innerHTML = text;
    },

    displayUpcomingMatchCountInfo: function (count) {

        var el = document.getElementById('game-notifications-body');
        if (!el) {
            return;
        }
        Ns.view.Notifications.upcomingMatchCount = count;
        var text = count < 2 ? "upcoming match." : "upcoming matches.";
        document.getElementById('game-notifications-upcoming-count').innerHTML = count;
        document.getElementById('game-notifications-upcoming-text').innerHTML = text;
    },

    expireStartButton: function (game_id) {
        
        var el_id = 'game-notifications-body';
        var dom_extra_field = Ns.view.Notifications._domExtraField(el_id);

        //now add the item
        var el = document.getElementById(el_id);
        if (!el) {
            return;
        }
        var children = $(el).children();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var extra_field = child[dom_extra_field];
            if (extra_field && extra_field.game_id === game_id) {
                var start_btn = child.querySelector('input[name=start_game_btn]');
                if (!$(start_btn).hasClass('game9ja-expired-btn')) {
                    $(start_btn).addClass('game9ja-expired-btn');
                }
                $(start_btn).off('click');//remove click event
                start_btn.value = Ns.Util.formatTime(extra_field.notification_time);
            }
        }

    },

    _onClickPlayerPhoto: function (argu) {
        var data = argu.data;
        alert('_onClickPlayerPhoto');
    },

    _countdownToKickoff: function (argu) {
        var data = argu.data;

    },

    _onClickStartGame: function (argu) {
        var play_request = argu.data;
        var game_id = play_request.game_id;

        Main.ro.match.start(game_id)
                .busy({html: 'Starting Game...'})
                .after(function (data, err) {

                    Ns.view.Notifications.expireStartButton(game_id);
                })
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
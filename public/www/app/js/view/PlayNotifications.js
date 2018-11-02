
/* global Main, Ns */

Ns.view.PlayNotifications = {

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
                Ns.view.PlayNotifications.addNotification(notifications[i]);
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

                        Ns.view.PlayNotifications.displayReqCountInfo(play_requests.length);
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
                        Ns.view.PlayNotifications.displayUpcomingMatchCountInfo(upcoming_matches.length);
                        notifications = notifications.concat(upcoming_matches);
                        promise_count++;
                        if (promise_count === 2) {
                            addNotificationListItem(notifications);
                        }
                    });


        });


    },

    addNotification: function (notification, use_uiupdater) {
        
        if(use_uiupdater){
            Main.uiupdater.show({
                container: 'game-play-notifications-body',
                delay: 5,
                data: notification,
                //countdown: ....,
                update: doAddNotification
            });
        }else{
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
                    afterReplace: Ns.view.PlayNotifications._addUpcomingMatchItem
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
                    afterReplace: Ns.view.PlayNotifications._addPlayRequestItem
                });
            }
        }

    },

    _addItem: function (html, data) {

        var el_id = 'game-play-notifications-body';
        var dom_extra_field = el_id + Ns.view.PlayNotifications.DOM_EXTRA_FIELD_PREFIX;

        //now add the item
        var el = document.getElementById(el_id);
        if(!el){
            return;
        }
        $(el).prepend(html);
        var children = el.children;
        var first_child = children[0];//first child since we are prepending
        first_child[dom_extra_field] = data;
        return first_child;
    },

    _addPlayRequestItem: function (html, data) {

        var el = Ns.view.PlayNotifications._addItem(html, data);

        var start_game_btn = el.querySelector('input[name=start_game_btn]');
        var opponent_photo = el.querySelector('img[name=opponent_photo]');

        $(start_game_btn).on('click', data, Ns.view.PlayNotifications._onClickStartGame);
        $(opponent_photo).on('click', data, Ns.view.PlayNotifications._onClickPlayerPhoto);
    },

    _addUpcomingMatchItem: function (html, data) {

        var el = Ns.view.PlayNotifications._addItem(html, data);

        var kickoff_btn = el.querySelector('input[name=kickoff_btn]');
        var opponent_photo = el.querySelector('img[name=opponent_photo]');

        $(kickoff_btn).on('click', data, Ns.view.PlayNotifications._countdownToKickoff);
        $(opponent_photo).on('click', data, Ns.view.PlayNotifications._onClickPlayerPhoto);
    },

    displayReqCountInfo: function (count) {

        var el = document.getElementById('game-play-notifications-body');
        if(!el){
            return;
        }
        Ns.view.PlayNotifications.playRequestCount = count;
        var text = count < 2 ? "player waiting." : "players waiting.";
        document.getElementById('game-play-notifications-play-request-count').innerHTML = count;
        document.getElementById('game-play-notifications-play-request-text').innerHTML = text;
    },

    displayUpcomingMatchCountInfo: function (count) {
        
        var el = document.getElementById('game-play-notifications-body');
        if(!el){
            return;
        }
        Ns.view.PlayNotifications.upcomingMatchCount = count;
        var text = count < 2 ? "upcoming match." : "upcoming matches.";
        document.getElementById('game-play-notifications-upcoming-count').innerHTML = count;
        document.getElementById('game-play-notifications-upcoming-text').innerHTML = text;
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
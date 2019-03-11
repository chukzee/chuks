
/* global Main, Ns, localforage */

Ns.view.Notifications = {

    DOM_EXTRA_FIELD_PREFIX: '-dom-extra-field',
    playRequestCount: 0,
    count: 0,
    constructor: function () {
        var obj = {
            play_request: 'game/PlayRequest',
            tourn: 'info/Tournament',
            group: 'info/Group',
            news: 'info/News',
            chat: 'game/Chat'
        };

        Main.rcall.live(obj);

    },

    content: function () {

        var list = Ns.PlayRequest.playRequestList;
        if (list.length === 0) {
                localforage.getItem(Ns.Const.PLAY_REQUEST_LIST_KEY, function (err, list) {
                if (err) {
                    console.log(err);
                }
                if (!list) {
                    list = [];
                }
                Ns.PlayRequest.playRequestList = list;
                content0();
            });
        }else{
            content0();
        }

        function content0() {
            
            function addPlayTabNotificationListItem(notifications) {
                
                Ns.view.Notifications.displayNotificationCount();
                
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
            
            function addChatsTabNotificationListItem(notifications) {
                
                Ns.view.Notifications.displayNotificationCount();
                
            }
            
            function addNewsTabNotificationListItem(notifications) {
                
                Ns.view.Notifications.displayNotificationCount();
                
                //TODO
            }
            
            Main.rcall.live(function () {
                var user_id = Ns.view.UserProfile.appUser.user_id;
                var game_name = Ns.ui.UI.selectedGame;
                var skip = 0;
                var limit = Ns.Const.MAX_LIST_SIZE;
                var play_tab_waiting = 0;
                var play_tab_notifications = [];
                
                Main.ro.play_request.get(user_id, game_name, skip, limit)
                        .before(function () {
                            play_tab_waiting++;
                        })
                        .after(function (data, err) {
                            play_tab_waiting--;
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
                            play_tab_notifications = play_tab_notifications.concat(play_requests);
                            
                            if (play_tab_waiting === 0) {
                                addPlayTabNotificationListItem(play_tab_notifications);
                            }
                        });
                
                Main.ro.tourn.getUpcomingMatches(user_id, game_name, skip, limit)
                        .before(function () {
                            play_tab_waiting++;
                        })
                        .after(function (data, err) {
                            play_tab_waiting--;
                            var upcoming_matches = [];
                            if (err) {
                                //TODO - display error
                                console.log(err);
                            } else {
                                upcoming_matches = data.upcoming_matches;
                            }
                            
                            play_tab_notifications = play_tab_notifications.concat(upcoming_matches);
                            
                            if (play_tab_waiting === 0) {
                                addPlayTabNotificationListItem(play_tab_notifications);
                            }
                        });
                
                
                Main.ro.group.getGroupJoinRequests(user_id, skip, limit)
                        .before(function () {
                            play_tab_waiting++;
                        })
                        .after(function (data, err) {
                            play_tab_waiting--;
                            var group_join_requests = [];
                            if (err) {
                                //TODO - display error
                                console.log(err);
                            } else {
                                group_join_requests = data.group_join_requests;
                            }
                            
                            play_tab_notifications = play_tab_notifications.concat(group_join_requests);
                            
                            if (play_tab_waiting === 0) {
                                addPlayTabNotificationListItem(play_tab_notifications);
                            }
                        });
                
                
                var chat_search_obj = {
                    user_id: user_id,
                    period: {month: 1},
                    tournaments: Ns.view.UserProfile.appUser.tournaments_belong,
                    groups: Ns.view.UserProfile.appUser.groups_belong,
                    contacts: Ns.view.UserProfile.appUser.contacts
                };
                
                Main.ro.chat.searchChats(chat_search_obj, skip, limit)
                        .before(function () {
                        })
                        .after(function (data, err) {
                            if (err) {
                                //TODO - display error
                                console.log(err);
                                return;
                            }
                            
                            
                            addChatsTabNotificationListItem(data.chats);
                            
                        });
                
                
                
                Main.ro.news.get(skip, limit)
                        .before(function () {
                        })
                        .after(function (data, err) {
                            if (err) {
                                //TODO - display error
                                console.log(err);
                                return;
                            }
                            
                            
                            addNewsTabNotificationListItem(data.news);
                            
                        });
            });
            
        }
    },

    addNotification: function (notification, use_uiupdater) {

        if (use_uiupdater) {
            Main.uiupdater.show({
                container: 'game-notifications-tab-play',
                delay: 5,
                data: notification,
                //countdown: ....,
                update: doAddNotification
            });
        } else {
            doAddNotification(notification);
        }

        function doAddNotification(notificat) {
            switch (notificat.notification_type) {
                case 'upcoming_tournament_match':
                    {
                        tplUpcomingMatch(notificat);
                    }
                    break;
                case 'play_request':
                    {
                        tplPlayRequest(notificat);
                    }
                    break;
                case 'group_join_request':
                    {
                        tplGroupJoinRequest(notificat);
                    }
                    break;
            }
        }

        function tplUpcomingMatch(notification) {
            Main.tpl.template({
                tplUrl: 'upcoming-tournament-match-tpl.html',
                data: notification,
                onReplace: function (tpl_var, data) {
                    if (tpl_var === 'kickoff') {
                        return data.start_time;
                    }
                },
                afterReplace: Ns.view.Notifications._addUpcomingMatchItem
            });
        }


        function tplPlayRequest(notification) {
            Main.tpl.template({
                tplUrl: 'play-request-tpl.html',
                data: notification,
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


        function tplGroupJoinRequest(notification) {
            Main.tpl.template({
                tplUrl: 'group-join-request-tpl.html',
                data: notification,
                onReplace: function (tpl_var, data) {

                },
                afterReplace: Ns.view.Notifications._addGroupJoinRequestItem
            });
        }
    },
    _domExtraField: function (id) {
        return id + Ns.view.Notifications.DOM_EXTRA_FIELD_PREFIX;
    },
    _addItem: function (html, data) {

        var el_id = 'game-notifications-tab-play';
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
        
        var user_id = Ns.view.UserProfile.appUser.user_id;
        var opponent = data.players[0].user_id !== user_id ? data.players[0] : data.players[1];
        
        $(opponent_photo).on('click', opponent, Ns.view.Notifications._onClickPlayerPhoto);
    },

    _addGroupJoinRequestItem: function (html, data) {

        var el = Ns.view.Notifications._addItem(html, data);

        var decline_btn = el.querySelector('input[name=decline_btn]');
        var join_btn = el.querySelector('img[name=join_btn]');
        data.el = el;
        $(decline_btn).on('click', data, Ns.view.Notifications._onClickDeclineGroupJoin);
        $(join_btn).on('click', data, Ns.view.Notifications._onClickAcceptGroupJoin);
    },

    displayReqCountInfo: function (count) {

        var el = document.getElementById('game-notifications-tab-play');
        if (!el) {
            return;
        }
        Ns.view.Notifications.playRequestCount = count;
        var text = count < 2 ? "player waiting." : "players waiting.";
        document.getElementById('game-notifications-play-request-count').innerHTML = count;
        document.getElementById('game-notifications-play-request-text').innerHTML = text;
    },

    displayNotificationCount: function () {

        var el = document.getElementById('game-notifications-tab-play');
        if (!el) {
            return;
        }
        /*
         Ns.view.Notifications.count = count;
         var text = count < 2 ? "update." : "updates.";
         document.getElementById('game-notifications-count').innerHTML = count;
         document.getElementById('game-notifications-text').innerHTML = text;
         */
    },

    expireStartButton: function (game_id) {

        var el_id = 'game-notifications-tab-play';
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
        var opponent = argu.data;
        Ns.ui.Photo.show(opponent);
    },

    _countdownToKickoff: function (argu) {
        var data = argu.data;

    },

    _onClickAcceptGroupJoin: function (argu) {
        var authorization_token = argu.data.authorization_token;
        var group_name = argu.data.group_name;
        var el = argu.data.el;


        Main.ro.group.acceptGroupJoinRequest(authorization_token)
                .before(function () {
                    el.innerHTML = 'Joining...';
                    el.disabled = 'disabled';
                })
                .after(function (data, err) {
                    el.innerHTML = 'JOIN';
                    el.removeAttribute('disabled');
                })
                .get(function (data) {

                    //remove the item
                    $(el).remove();

                    Main.toast.show(data);

                    //go to the group view
                    Ns.GameHome.showGroupDetails(group_name);

                    console.log(data);
                })
                .error(function (err) {
                    Main.toast.show(err);

                    console.log(err);

                });
    },

    _onClickDeclineGroupJoin: function (argu) {
        var authorization_token = argu.data.authorization_token;
        var el = argu.data.el;
        Main.ro.group.rejectGroupJoinRequest(authorization_token)
                .before(function () {
                    el.innerHTML = 'Declining...';
                    el.disabled = 'disabled';
                })
                .after(function (data, err) {
                    el.innerHTML = 'DECLINE';
                    el.removeAttribute('disabled');
                })
                .get(function (data) {

                    //remove the item
                    $(el).remove();

                    Main.toast.show(data);

                    console.log(data);
                })
                .error(function (err) {
                    Main.toast.show(err);

                    console.log(err);

                });
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
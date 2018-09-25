
/* global Main, Ns */

Ns.PlayRequest = {

    playRequestList: [], //dynamic

    constructor: function () {


        var obj = {
            play_request: 'game/PlayRequest'
        };

        Main.eventio.on('game_start', this.onGameStart);
        Main.eventio.on('play_request', this.onPlayRequest);
        Main.eventio.on('play_request_rejected', this.onPlayRequestRejected);
        Main.eventio.on('play_request_expired', this.onPlayRequestExpired);

    },

    openPlayDialog: function (opponent, group_name) {

        if (Ns.PlayRequest._isLetsPlayClick) {
            return;
        }

        Ns.PlayRequest._isLetsPlayClick = true;

        Ns.ui.UI.getView(Ns.GameHome.GAME_WAIT_HTML, function (err, html) {

            Ns.PlayRequest._isLetsPlayClick = false;

            if (err) {//like nodejs. important!
                return;
            }

            var play_request_data;

            var width = window.innerWidth * 0.9;
            var height = window.innerHeight * 0.35;
            var max_width = 400;
            var max_height = 350;

            if (max_height > window.innerHeight * 0.8) {
                max_height = window.innerHeight * 0.8;
            }

            var countdown_play;
            var feedback_msg;
            var start_text = 'Start Game';
            var is_match_started = false;
            var match;
            var waitCountdownFn = function (value, finish) {
                if (countdown_play) {
                    countdown_play.innerHTML = value;
                    if (finish) {
                        feedback_msg.innerHTML = 'Player did not respond!';
                    }
                }

            };

            var goToGame = function (_match) {
                if (is_match_started) {
                    return;
                }
                is_match_started = true;
                Ns.GameHome.showGameView(_match);
            };

            Main.dialog.show({
                title: '<spand>Play</span><i> ' + opponent.full_name + '</i>',
                content: html,
                width: width < max_width ? width : max_width,
                height: height < max_height ? height : max_height,
                fade: true,
                closeButton: false,
                modal: true,
                buttons: ['CANCEL'], //
                action: function (btn, value) {
                    var me = this;
                    if (value === 'CANCEL' || value === 'TRY AGAIN') {

                        if (play_request_data) {
                            abortRequest();
                        } else {
                            this.hide();
                        }

                    }else if (value === 'CLOSE') {
                        this.hide();
                    } else if (value === start_text) {
                        this.hide();
                        goToGame(match);
                    }

                    function abortRequest() {
                        
                        feedback_msg.innerHTML = 'Cancelling play request...';
                        
                        Main.ro.play_request.abort(play_request_data.game_id)
                                //.busy({text:'Cancelling play request...',  color:'#eeeeee'})
                                .before(function () {
                                    me.disableButtons();
                                    console.log('before play_request.abort');
                                })
                                .after(function () {
                                    console.log('after play_request.abort');
                                })
                                .get(function (result) {
                                    me.hide();
                                    Main.toast.show(result);
                                })
                                .error(function (err) {
                                    feedback_msg.innerHTML = 'Could not cancel play request!';
                                    me.createButtons('TRY AGAIN', 'CLOSE');
                                    console.log(err);
                                });
                    }
                },
                onShow: function () {
                    var app_user = Ns.view.UserProfile.appUser;
                    feedback_msg = document.getElementById('game-wait-player-feedback-msg');
                    countdown_play = document.getElementById('game-wait-player-countdown');

                    var own_online = document.getElementById('game-wait-player-own-online');
                    var opponent_online = document.getElementById('game-wait-player-opponent-online');
                    var own_busy = document.getElementById('game-wait-player-own-busy');
                    var opponent_busy = document.getElementById('game-wait-player-opponent-busy');

                    feedback_msg.innerHTML = 'Contacting player...';

                    document.getElementById('game-wait-player-own-photo-url').src = app_user.phot_url;
                    document.getElementById('game-wait-player-opponent-photo-url').src = opponent.phot_url;
                    document.getElementById('game-wait-player-own-name').innerHTML = app_user.full_name;
                    document.getElementById('game-wait-player-opponent-name').innerHTML = opponent.full_name;

                    var dialog = this;

                    var initiator_id = app_user.user_id;
                    var opponent_ids = [opponent.user_id];
                    var game_name = Ns.ui.UI.selectedGame;
                    var game_rules = {};//TODO - Set from a default locations e.g contacts menu and Group menu

                    //send the play request
                    Main.ro.play_request.sendRequest(initiator_id, opponent_ids, game_name, game_rules, group_name)
                            .get(function (data) {

                                own_online.innerHTML = 'online';
                                opponent_online.innerHTML = data.opponents_online.indexOf(opponent.user_id) > -1 ? 'online' : 'offline';

                                if (data.engaged_user_id === opponent.user_id) {
                                    opponent_busy.innerHTML = 'busy';
                                    own_busy.innerHTML = 'available';
                                    feedback_msg.innerHTML = 'Player is engaged in another game...';
                                } else if (data.engaged_user_id === app_user.user_id) {
                                    own_busy.innerHTML = 'busy';
                                    feedback_msg.innerHTML = 'Not allowed! You currently have a live game on.';
                                } else {
                                    play_request_data = data;
                                    opponent_busy.innerHTML = 'available';
                                    own_busy.innerHTML = 'available';
                                    feedback_msg.innerHTML = 'Waiting for player...';

                                    Main.countdown.start(waitCountdownFn, data.expire_after_secs, 'mm:ss');

                                    Ns.PlayRequest._startGameFunc = function (_match) {
                                        match = _match;
                                        if (match.game_id !== play_request_data.game_id) {
                                            return;
                                        }

                                        feedback_msg.innerHTML = 'Player ready.';
                                        Main.countdown.start(function (value, finish) {
                                            dialog.setButtonText(0, start_text + ' (' + value + ')');
                                            if (finish) {
                                                dialog.hide();
                                                goToGame(match);
                                            }
                                        }, 5);
                                    };

                                    Ns.PlayRequest._opponentRejectPlayFunc = function () {
                                        /*Depreacated*/
                                        //because the player does not have to click any reject button.
                                        //All player needs to do as a way to reject the request is to ignore clicking
                                        //the 'Start Game' button in the play notification. Then the play request just
                                        // gracefully expires
                                    };
                                }

                            })
                            .error(function (err) {
                                feedback_msg.innerHTML = err;
                            });




                },
                onHide: function () {
                    Main.countdown.stop(waitCountdownFn);
                }
            });
        });

    },

    onGameStart: function (obj) {
        if (Main.util.isFunc(Ns.PlayRequest._startGameFunc)) {
            Ns.PlayRequest._startGameFunc(obj.data.match);
        }
    },

    onPlayRequest: function (obj) {
        console.log(obj);

        var play_request = obj.data;
        play_request.time_received = Date.now();
        try {
            var list = window.localStorage.getItem(Ns.Const.PLAY_REQUEST_LIST_KEY);
            list = JSON.parse(list);

        } catch (e) {
            console.warn(e);
        }

        //each new play request will come first - ie add to the top

        Ns.PlayRequest.playRequestList = [];//first initialize
        Ns.PlayRequest.playRequestList.push(play_request);//add to top

        if (Main.util.isArray(list)) {
            var max = Ns.Const.MAX_PLAY_REQUEST_LIST_SIZE;
            var len = list.length - 1 >= max ? max : list.length - 1;
            for (var i = 0; i < len; i++) {
                Ns.PlayRequest.playRequestList.push(list[i]);//add the rest
            }
        }
        //save the play request
        try {
            window.localStorage.setItem(Ns.Const.PLAY_REQUEST_LIST_KEY, JSON.stringify(Ns.PlayRequest.playRequestList));
        } catch (e) {
            //COME BACK FOR CASE WHERE THE STORAGE IS FULL
        }

    },
    /**
     * @Depreacated - because the player does not have to click any reject button.
     * All that the player needs to do as a way to reject the request is to ignore clicking
     * the 'Start Game' button in the play notification. Then the play request just
     * gracefully expires.
     * @param {type} obj 
     */
    onPlayRequestRejected: function (obj) {
        console.log(obj);
        /*@Depreacated*/
    },

    onPlayRequestExpired: function (obj) {
        console.log(obj);
    }

    //more goes below
};
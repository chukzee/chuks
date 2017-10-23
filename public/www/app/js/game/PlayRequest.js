
/* global Main, Ns */

Ns.game.PlayRequest = {

    constructor: function () {


        var obj = {
            play_request: 'game/PlayRequest',
        };

        Main.eventio.on('play_request', this.onPlayRequest);
        Main.eventio.on('play_request_rejected', this.onPlayRequestRejected);
        Main.eventio.on('play_request_expired', this.onPlayRequestExpired);

    },

    content: function () {

    },

    openPlayDialog: function (opponent, group_name) {

        if (Ns.game.PlayRequest._isLetsPlayClick) {
            return;
        }

        Ns.game.PlayRequest._isLetsPlayClick = true;

        Ns.ui.UI.getView(Ns.GameHome.GAME_WAIT_HTML, function (err, html) {

            Ns.game.PlayRequest._isLetsPlayClick = false;

            if (err) {//like nodejs. important!
                return;
            }

            var play_request_data;

            var width = window.innerWidth * 0.9;
            var height = window.innerHeight * 0.35;
            var max_width = 400;
            var max_height = 350;
            
            if(max_height > window.innerHeight * 0.8){
                max_height = window.innerHeight * 0.8;
            }

            Main.dialog.show({
                title: '<spand>Play</span><i> ' + opponent.full_name + '</i>',
                content: html,
                width: width < max_width ? width : max_width,
                height: height < max_height ? height : max_height,
                fade: true,
                closeButton: false,
                modal: true,
                buttons: ['Cancel'], //
                action: function (btn, value) {
                    if (value.indexOf('Cancel') === 0) {

                        this.hide();

                        if (play_request_data) {
                            Main.ro.play_request.abort(play_request_data.game_id)
                                    .get(function (resul) {
                                        //do nothing
                                    })
                                    .error(function (err) {
                                        console.log(err);
                                    });
                        }
                    }
                },
                onShow: function () {
                    var app_user = Ns.view.UserProfile.appUser;
                    var feedback_msg = document.getElementById('game-wait-player-feedback-msg');

                    var own_online = document.getElementById('game-wait-player-own-online');
                    var opponent_online = document.getElementById('game-wait-player-opponent-online');
                    var own_busy = document.getElementById('game-wait-player-own-busy');
                    var opponent_busy = document.getElementById('game-wait-player-opponent-busy');

                    feedback_msg.innerHTML = 'Contacting player...';

                    document.getElementById('game-wait-player-own-photo-url').src = app_user.phot_url;
                    document.getElementById('game-wait-player-opponent-photo-url').src = opponent.phot_url;
                    document.getElementById('game-wait-player-own-name').innerHTML = app_user.full_name;
                    document.getElementById('game-wait-player-opponent-name').innerHTML = opponent.full_name;

                    document.getElementById('game-wait-player-countdown').innerHTML = '5:00';
                    var initiator_id = app_user.user_id;
                    var opponent_ids = [opponent.user_id];
                    var game_name = Ns.ui.UI.selectedGame;
                    var game_rules = {};//TODO - Set from a default locations e.g contacts menu and Group menu

                    //send the play request
                    Main.ro.play_request.sendRequest(initiator_id, opponent_ids, game_name, game_rules, group_name)
                            .get(function (data) {


                                own_online.innerHTML = 'online';
                                opponent_online.innerHTML = data.opponents_online.indexOf(opponent.user_id) > -1 ? 'online' : 'offline';

                                if(data.engaged_user_id === opponent.user_id) {
                                    opponent_busy.innerHTML = 'busy';
                                    own_busy.innerHTML = 'available';
                                    feedback_msg.innerHTML = 'Player is engaged in another game...';
                                }else if(data.engaged_user_id === app_user.user_id) {
                                    own_busy.innerHTML = 'busy';
                                    feedback_msg.innerHTML = 'Not allowed! You currently have a live game on.';
                                } else {
                                    play_request_data = data;
                                    opponent_busy.innerHTML = 'available';
                                    own_busy.innerHTML = 'available';
                                    feedback_msg.innerHTML = 'Waiting for player...';
                                }

                            })
                            .error(function (err) {
                                feedback_msg.innerHTML = err;
                            });




                }
            });
        });

    },

    onPlayRequest: function (obj) {
        console.log(obj);
    },

    onPlayRequestRejected: function (obj) {
        console.log(obj);
    },

    onPlayRequestExpired: function (obj) {
        console.log(obj);
    }

    //more goes below
};
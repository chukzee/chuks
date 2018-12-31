
/* global Ns, Main */

Ns.GameEventsController = {

    constructor: function () {



        Main.eventio.on('notify_upcoming_match', this.onNotifyUpComingMatch);//match reminder - ie say 10 mins before time
        Main.eventio.on('game_start', this.onGameStart);
        Main.eventio.on('game_start_next_set', this.onGameStartNextSet);
        Main.eventio.on('watch_game_start', this.onWatchGameStart);
        Main.eventio.on('watch_game_start_next_set', this.onWatchGameStartNextSet);
        Main.eventio.on('game_resume', this.onGameResume);
        Main.eventio.on('watch_game_resume', this.onWatchGameResume);
        Main.eventio.on('game_pause', this.onGamePause);
        Main.eventio.on('game_abandon', this.onGameAbandon);
        Main.eventio.on('game_move', this.onGameMove);
        Main.eventio.on('game_watch_move', this.onGameWatchMove);
        Main.eventio.on('game_move_sent', this.onGameMoveSent);
        Main.eventio.on('thinking', this.onThinking);
        Main.eventio.on('watch_thinking', this.onWatchThinking);
        Main.eventio.on('game_finish', this.onGameFinish);
        Main.eventio.on('game_state_update', this.onGameStateUpdate);
        Main.eventio.on('game_reload_replay', this.onGameReloadReplay);




    },

    loadGameByMatch: function (match) {

        switch (match.game_name) {
            case 'chess':
                {
                    Ns.game.two.Chess2D.reloadGame(match);
                }
                break;
            case 'draughts':
                {
                    Ns.game.two.Draughts2D.reloadGame(match);
                }
                break;
            case 'ludo':
                {

                    Ns.game.two.Ludo2D.reloadGame(match);
                }
                break;
            case 'solitaire':
                {

                    Ns.game.two.Solitaire2D.reloadGame(match);
                }
                break;
            case 'whot':
                {

                    Ns.game.two.Whot2D.reloadGame(match);
                }
                break;
        }
    },

    onNotifyUpComingMatch: function (obj) {
        console.log(obj);

        //var match = obj.data;

    },

    onGameStart: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.prependMatchListview(match);

    },

    onGameStartNextSet: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.prependMatchListview(match);

    },

    onWatchGameStart: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.prependMatchListview(match);

    },

    onWatchGameStartNextSet: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.prependMatchListview(match);

    },

    onGameResume: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatch(match);

    },

    onWatchGameResume: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatch(match);

    },

    onGamePause: function (obj) {
        console.log(obj);

        var pause_by = obj.data.pause_by;
        var match = obj.data.match;
        Ns.Match.updateMatch(match);

    },

    onGameAbandon: function (obj) {
        console.log(obj);

        var abandon_by = obj.data.abandon_by;
        var terminated = obj.data.terminated;
        var terminate_reason = obj.data.terminate_reason;
        var match = obj.data.match;

        Ns.Match.updateMatch(match);

    },

    onGameMove: function (obj) {
        console.log(obj);

        var user_id = obj.data.user_id;
        var match = obj.data.match;
        var notation = obj.data.notation;

        var game_id = match.game_id;
        Ns.Match.getMatch(game_id, function (matchObj) {
            if (!matchObj) {
                return;
            }

            var players = matchObj.players;// get the players field which most likely contains the user info
            match = matchObj;
            match.players = players; // now set the players field which most likely contains the user info
            Ns.Match.updateMatch(match);
        });

        //move the piece
        switch (match.game_name) {
            case 'chess':
                {
                    Ns.game.two.Chess2D.remoteMakeMove(user_id, notation, match);
                }
                break;
            case 'draughts':
                {
                    Ns.game.two.Draughts2D.remoteMakeMove(user_id, notation, match);
                }
                break;
            case 'ludo':
                {

                    Ns.game.two.Ludo2D.remoteMakeMove(user_id, notation, match);
                }
                break;
            case 'solitaire':
                {

                    Ns.game.two.Solitaire2D.remoteMakeMove(user_id, notation, match);
                }
                break;
            case 'whot':
                {

                    Ns.game.two.Whot2D.remoteMakeMove(user_id, notation, match);
                }
                break;
        }

    },

    onGameWatchMove: function (obj) {

        console.log(obj);

        var user_id = obj.data.user_id;
        var match = obj.data.match;
        var notation = obj.data.notation;

        var game_id = match.game_id;
        Ns.Match.getMatch(game_id, function (matchObj) {
            if (!matchObj) {
                return;
            }

            var players = matchObj.players;// get the players field which most likely contains the user info
            match = matchObj;
            match.players = players; // now set the players field which most likely contains the user info
            Ns.Match.updateMatch(match);
        });

        //move the piece
        switch (match.game_name) {
            case 'chess':
                {
                    Ns.game.two.Chess2D.remoteMakeMove(user_id, notation, match);
                }
                break;
            case 'draughts':
                {
                    Ns.game.two.Draughts2D.remoteMakeMove(user_id, notation, match);
                }
                break;
            case 'ludo':
                {

                    Ns.game.two.Ludo2D.remoteMakeMove(user_id, notation, match);
                }
                break;
            case 'solitaire':
                {

                    Ns.game.two.Solitaire2D.remoteMakeMove(user_id, notation, match);
                }
                break;
            case 'whot':
                {

                    Ns.game.two.Whot2D.remoteMakeMove(user_id, notation, match);
                }
                break;
        }


    },

    onGameMoveSent: function (obj) {
        console.log(obj);

        var user_id = obj.data.user_id;//not necessary
        var notation = obj.data.notation;//not necessary
        var match = obj.data.match;

        var game_id = match.game_id;
        Ns.Match.getMatch(game_id, function (matchObj) {
            if (!matchObj) {
                return;
            }

            var players = matchObj.players;// get the players field which most likely contains the user info
            match = matchObj;
            match.players = players; // now set the players field which most likely contains the user info
            Ns.Match.updateMatch(match);
        });

    },

    onThinking: function (obj) {
        console.log(obj);

        var game_name = obj.game_name;
        var user_id = obj.user_id;

        if (Ns.ui.UI.selectedGame !== game_name) {
            return;
        }

        if (Ns.view.UserProfile.appUser.user_id === user_id) {
            return;
        }

        Ns.game.AbstractBoard2D.activityFeedbackEl({
            container: 'game-view-activity',
            text: 'Thinking...'
        });


    },

    onWatchThinking: function (obj) {
        console.log(obj);

        var game_name = obj.game_name;
        var is_white = obj.is_white;
        var user_id = obj.user_id;

        if (Ns.ui.UI.selectedGame !== game_name) {
            return;
        }

        if (Ns.view.UserProfile.appUser.user_id === user_id) {
            return;
        }

        if (is_white) {

            Ns.game.AbstractBoard2D.activityFeedbackEl({
                container: 'game-watch-white-activity',
                text: 'Thinking...'
            });
            Ns.game.AbstractBoard2D.activityFeedbackEl({
                container: 'game-watch-black-activity',
                text: ''
            });
        } else {
            if (is_white) {

                Ns.game.AbstractBoard2D.activityFeedbackEl({
                    container: 'game-watch-black-activity',
                    text: ''
                });
                Ns.game.AbstractBoard2D.activityFeedbackEl({
                    container: 'game-watch-black-activity',
                    text: 'Thinking...'
                });
            }
        }


    },

    onGameFinish: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatch(match);

    },

    onGameStateUpdate: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatch(match);

        this.loadGameByMatch(match);

    },

    onGameReloadReplay: function (obj) {
        console.log(obj);

        var me = this;

        var game_id = obj; //we needed only the game id since the match in the server cluster is not updated already
        //we need to find the locally stored match which was used to send the move
        Ns.Match.getMatch(game_id, function (match) {
            if (!match) {
                return;
            }
            me.loadGameByMatch(match);
        });

    }


};
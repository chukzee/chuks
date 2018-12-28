
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
        Main.eventio.on('game_move_sent', this.onGameMoveSent);
        Main.eventio.on('game_finish', this.onGameFinish);


    },
    onNotifyUpComingMatch: function (obj) {
        console.log(obj);

        var match = obj.data.match;

    },

    onGameStart: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.prependMatchListview(match);

    },

    onGameStartNextSet: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.prependMatchListview(match);

    },

    onWatchGameStart: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.prependMatchListview(match);

    },

    onWatchGameStartNextSet: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.prependMatchListview(match);

    },

    onGameResume: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.updateMatch(match);

    },

    onWatchGameResume: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.updateMatch(match);

    },

    onGamePause: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.updateMatch(match);

    },

    onGameAbandon: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.updateMatch(match);

    },

    onGameMove: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.updateMatch(match);
    },

    onGameMoveSent: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.updateMatch(match);
    },

    onGameFinish: function (obj) {
        console.log(obj);

        var match = obj.data.match;
        Ns.Match.updateMatch(match);


    }

};
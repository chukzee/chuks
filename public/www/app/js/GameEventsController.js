
/* global Ns, Main */

Ns.GameEventsController = {

    constructor: function () {

        Main.event.on(Ns.Const.EVT_UPDATE_MATCH, this.updateMatchListener.bind(this));

        Main.eventio.on('notify_upcoming_match', this.onNotifyUpComingMatch.bind(this));//match reminder - ie say 10 mins before time
        Main.eventio.on('game_start', this.onGameStart.bind(this));
        Main.eventio.on('game_start_next_set', this.onGameStartNextSet.bind(this));
        Main.eventio.on('watch_game_start', this.onWatchGameStart.bind(this));
        Main.eventio.on('watch_game_start_next_set', this.onWatchGameStartNextSet.bind(this));
        Main.eventio.on('game_resume', this.onGameResume.bind(this));
        Main.eventio.on('watch_game_resume', this.onWatchGameResume.bind(this));
        Main.eventio.on('game_pause', this.onGamePause.bind(this));
        Main.eventio.on('game_abandon', this.onGameAbandon.bind(this));
        Main.eventio.on('game_move', this.onGameMove.bind(this));
        Main.eventio.on('game_watch_move', this.onGameWatchMove.bind(this));
        Main.eventio.on('game_move_sent', this.onGameMoveSent.bind(this));
        Main.eventio.on('thinking', this.onThinking.bind(this));
        Main.eventio.on('watch_thinking', this.onWatchThinking.bind(this));
        Main.eventio.on('game_finish', this.onGameFinish.bind(this));
        Main.eventio.on('game_state_update', this.onGameStateUpdate.bind(this));
        Main.eventio.on('game_reload_replay', this.onGameReloadReplay.bind(this));




    },

    updateMatchListener: function (data) {

        if (data.up_to_date || !data.match) {//if client match object is up-to-date or no match is found
            return;//leave 
        }

        //At this point the client match object is not up-to-date so reload the view        
        var match = data.match;
        Ns.Match.updateMatchList(match);
        var toast_text = 'game position updated!';
        this._loadGameByMatch(match, toast_text);
    },

    _updateAfterMoveSent: function (match) {
        var gameObj = Ns.Util.getGameObject(match.game_name);
        gameObj.setMatch(match);
        gameObj.displayTurn(match);
    },

    _loadGameByMatch: function (match, toast_text) {
        Ns.Util.getGameObject(match.game_name).reloadGame(match, toast_text);
    },

    _makeMove: function (user_id, notation, match) {
        Ns.Util.getGameObject(match.game_name).remoteMakeMove(notation, match);
    },

    /**
     * Display that the player is thinking
     * 
     * the expected fields of prop below
     * 
     * var prop = {
     *      game_id: ...,
     *      game_name:...,
     *      user_id:..., //the user id of player thinking
     * }
     * 
     * @param {type} prop
     * @returns {undefined}
     */
    _thinking: function (prop) {
        Ns.Util.getGameObject(prop.game_name).displayThinking(prop);
    },

    onNotifyUpComingMatch: function (obj) {
        console.log(obj);

        //var match = obj.data;

    },

    onGameStart: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatchList(match);
        
        this._loadGameByMatch(match);
    },

    onGameStartNextSet: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatchList(match);
        
        var gameObj = Ns.Util.getGameObject(match.game_name);
        
        if(!gameObj.isShowGameOverAlert()){
            gameObj.reloadGame(match);
        }
    },

    onWatchGameStart: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatchList(match);
        
        this._loadGameByMatch(match);
        
    },

    onWatchGameStartNextSet: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatchList(match);
        
        var gameObj = Ns.Util.getGameObject(match.game_name);
        
        if(!gameObj.isShowGameOverAlert()){
            gameObj.reloadGame(match);
        }
    },

    onGameResume: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatchList(match);
        
        this._loadGameByMatch(match);
    },

    onWatchGameResume: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatchList(match);
        
        this._loadGameByMatch(match);
    },

    onGamePause: function (obj) {
        console.log(obj);

        var pause_by = obj.data.pause_by;
        var match = obj.data.match;
        Ns.Match.updateMatchList(match);
    },

    onGameAbandon: function (obj) {
        console.log(obj);

        var abandon_by = obj.data.abandon_by;
        var terminated = obj.data.terminated;
        var terminate_reason = obj.data.terminate_reason;
        var match = obj.data.match;

        Ns.Match.updateMatchList(match);
    },

    onGameMove: function (obj) {
        console.log(obj);

        var user_id = obj.data.user_id;
        var match = obj.data.match;
        var notation = obj.data.notation;

        Ns.Match.updateMatchList(match);

        //move the piece
        this._makeMove(user_id, notation, match);
    },

    onGameWatchMove: function (obj) {

        console.log(obj);

        var user_id = obj.data.user_id;
        var match = obj.data.match;
        var notation = obj.data.notation;

        Ns.Match.updateMatchList(match);

        //move the piece        
        this._makeMove(user_id, notation, match);
    },

    onGameMoveSent: function (obj) {
        console.log(obj);

        var user_id = obj.data.user_id;//not necessary
        var notation = obj.data.notation;//not necessary
        var match = obj.data.match;

        Ns.Match.updateMatchList(match);
        this._updateAfterMoveSent(match);
    },

    onThinking: function (obj) {
        console.log(obj);

        this._thinking(obj.data);
    },

    onWatchThinking: function (obj) {
        console.log(obj);

        this._thinking(obj.data);
    },

    onGameFinish: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatchList(match);
    },

    onGameStateUpdate: function (obj) {
        console.log(obj);

        var match = obj.data;
        Ns.Match.updateMatchList(match);

        this._loadGameByMatch(match);

        Main.toast.show('update game position!');
    },

    onGameReloadReplay: function (obj) {
        console.log(obj);

        var me = this;

        var game_id = obj.data; //we needed only the game id since the match in the server cluster is not updated already
        //we need to find the locally stored match which was used to send the move
        Ns.Match.getMatch(game_id, function (match) {
            if (!match) {
                return;
            }

            //delete the saved move and game position
            delete match._unsentMove;
            delete match._unsentGamePosition;

            Ns.Match.updateMatchList(match);//update

            me._loadGameByMatch(match);
        });

    }


};
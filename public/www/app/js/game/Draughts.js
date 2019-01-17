

/* global Ns */

Ns.game.Draughts = {

    game: null,

    constructor: function () {

    },

    load: function (obj) {

        if (obj.white === true) {//strictly true
            obj.flip = false;
        } else if (obj.white === false) {//strictly false
            obj.flip = true;
        }
        
        var gameObj;
        if (obj.is3D) {
            gameObj = Ns.game.three.Draughts3D;
        } else {
            gameObj = Ns.game.two.Draughts2D;
        }
        var prevMatch = gameObj.config ? gameObj.config.match : null;

        if (prevMatch
                && prevMatch.game_name === obj.match.game_name
                && prevMatch.game_id === obj.match.game_id
                && prevMatch.current_set === obj.match.current_set
                && prevMatch.move_counter > obj.match.move_counter) {
            obj.match = prevMatch; //most up-to-data match object            
        }

        var draughts = Draughts();//defualt
        
        if(draughts.Rules.inverted_board){
            obj.invertedBoard = true;
        }
        
        if (obj.match && obj.match._unsentGamePosition) {//first retry the pending (unsent) game position
            draughts.boardPosition(obj.match._unsentGamePosition);
        }else if(obj.match && obj.match.game_position){
            draughts.boardPosition(obj.match.game_position);
        }

        gameObj.load(draughts, obj, this._onLoad);

    },

    _onLoad: function (game) {
        this.game = game;
    }

};
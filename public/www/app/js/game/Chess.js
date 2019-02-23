
/* global Ns, Main */

Ns.game.Chess = {

    game: null,

    constructor: function () {

    },
    
    engine: function(){
        if(!window.Worker){
            return;
        }
        
        
    },

    load: function (obj) {

        if (obj.white === true) {//strictly true
            obj.flip = false;
        } else if (obj.white === false) {//strictly false
            obj.flip = true;
        }
        var gameObj;
        if (obj.is3D) {
            gameObj = Ns.game.three.Chess3D;
        } else {
            gameObj = Ns.game.two.Chess2D;
        }
        var prevMatch = gameObj.config ? gameObj.config.match : null;

        if (prevMatch
                && prevMatch.game_name === obj.match.game_name
                && prevMatch.game_id === obj.match.game_id
                && prevMatch.current_set === obj.match.current_set
                && prevMatch.move_counter > obj.match.move_counter) {
            obj.match = prevMatch; //most up-to-data match object            
        }

        var chess;

        if (obj.match && obj.match._unsentGamePosition) {//first retry the pending (unsent) game position
            chess = new Chess(obj.match._unsentGamePosition);
        } else if (obj.match && obj.match.game_position) {
            chess = new Chess(obj.match.game_position);
        } else {
            chess = new Chess();//starting position
        }

        gameObj.load(chess, obj, this._onLoad);

    },

    _onLoad: function (game) {
        this.game = game;
    }

};


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
        var draughts = Draft9ja();//defualt
        
        if (obj.match._unsentGamePosition) {//first retry the pending (unsent) game position
            draughts.boardPosition(obj.match._unsentGamePosition);
        }else if(obj.match.game_position){
            draughts.boardPosition(obj.match.game_position);
        }

        if (obj.is3D) {
            Ns.game.three.Draughts3D.load(draughts, obj, this._onLoad);
        } else {
            Ns.game.two.Draughts2D.load(draughts, obj, this._onLoad);
        }
    },

    _onLoad: function (game) {
        this.game = game;
    }

};
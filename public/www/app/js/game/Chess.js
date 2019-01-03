
/* global Ns */

Ns.game.Chess = {

    game: null,

    constructor: function () {

    },

    load: function (obj) {

        if (obj.white === true) {//strictly true
            obj.flip = false;
        } else if (obj.white === false) {//strictly false
            obj.flip = true;
        }
        var chess;

        if (obj.match._unsentGamePosition) {//first retry the pending (unsent) game position
            chess = new Chess(obj.match._unsentGamePosition);
        } else if (obj.match.game_position) {
            chess = new Chess(obj.match.game_position);
        } else {
            chess = new Chess();//starting position
        }

        if (obj.is3D) {
            Ns.game.three.Chess3D.load(chess, obj, this._onLoad);
        } else {
            Ns.game.two.Chess2D.load(chess, obj, this._onLoad);
        }
    },

    _onLoad: function (game) {
        this.game = game;
    }

};
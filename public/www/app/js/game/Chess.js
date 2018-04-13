

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

        if (obj.gamePosition) {
            chess = new Chess(obj.gamePosition);
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
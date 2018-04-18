
/* global Main, Ns */


Ns.game.two.Chess2D = {

    extend: 'Ns.game.AbstractBoard2D',

    createPieceElement: function (pce, piece_theme) {
        var pe = document.createElement('img');
        pe.src = '../resources/games/chess/2D/pieces/' + piece_theme + '/' + pce.color + pce.type + '.png';
        return pe;
    },
    pieceSquarRation: function () {
        return 0.8;
    },

    isWhite: function (pce) {
        return pce.color === 'w';
    },

    getInternalPiece: function (sqn) {
        return this.internalGame.get(sqn);
    },

    getBoardClass: function () {
        return 'game9ja-chess-board';
    }
};
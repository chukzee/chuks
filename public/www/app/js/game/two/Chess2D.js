
/* global Main, Ns */


Ns.game.two.Chess2D = {

    extend: 'Ns.game.AbstractBoard2D',

    createPieceElement: function (pce, piece_theme) {
        var pieceElement = document.createElement('img');
        pieceElement.src = '../resources/games/chess/2D/pieces/' + piece_theme + '/' + pce.color + pce.type + '.png';
        pieceElement.dataset.color = pce.color;
        
        var t = pce.type.charAt(1);
        switch(t){
            case'k':{
               pieceElement.dataset.name = 'king';
            }
            case'q':{
               pieceElement.dataset.name = 'queen';
            }
            case'r':{
               pieceElement.dataset.name = 'rook';
            }
            case'n':{
               pieceElement.dataset.name = 'knight';
            }
            case'b':{
               pieceElement.dataset.name = 'bishop';
            }
            case'p':{
               pieceElement.dataset.name = 'pawn';
            }
        }
        
        return pieceElement;
    },
    pieceSquarRatio: function () {
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
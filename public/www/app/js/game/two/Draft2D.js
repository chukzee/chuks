
/* global Main, Ns */


/* global Main, Ns */


Ns.game.two.Draft2D = {

    extend: 'Ns.game.AbstractBoard2D',

    arrangeBoard: function (container, piece_theme) {

    },

    getInternalPiece: function (sqn) {
        
    },

    getBoardClass: function (inverse_board) {
        if (inverse_board) {
            return 'game9ja-draft-board-inverse';
        } else {
            return 'game9ja-draft-board';
        }
    }
};
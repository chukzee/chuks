
/* global Main, Ns */


/* global Main, Ns */


Ns.game.two.Draughts2D = {

    extend: 'Ns.game.AbstractBoard2D',

    createPieceElement: function (pce, piece_theme) {
        var pe = document.createElement('img');
        pe.className = pce.white ? 'white-piece-o' : 'black-piece-o';
        return pe;
    },

    pieceSquarRation: function () {
        return 0.6;
    },

    isWhite: function (pce) {
        return pce.white;
    },

    getInternalPiece: function (sqn) {
        return this.internalGame.getPiece(sqn);
    },

    getBoardClass: function (inverse_board) {
        if (inverse_board) {
            return 'game9ja-draft-board-inverse';
        } else {
            return 'game9ja-draft-board';
        }
    },
    getVariant: function(variant){
        var v = {};
        switch(variant){
            case'international-draughts':{
                  v.name = 'international-draughts';  
                  v.size = '10x10';
                  //v.rule =... TODO
            }break;
            case'english-draughts':{
                  v.name = 'english-draughts';  
                  v.size = '8x8';
                  //v.rule =... TODO
            }break;
            case'american-draughts':{
                  v.name = 'american-draughts';  
                  v.size = '8x8';
                  //v.rule =... TODO
            }break;
        }
        
        return v;
    }
};
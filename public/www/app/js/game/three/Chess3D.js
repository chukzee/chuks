
/* global Main, Ns */


Ns.game.three.Chess3D = {

    extend: 'Ns.game.AbstractBoard3D',

    createPieceElement: function (pce, piece_theme) {
        var pieceElement = document.createElement('img');
        pieceElement.src = '../resources/games/chess/2D/pieces/' + piece_theme + '/' + pce.color + pce.type + '.png';
        pieceElement.dataset.color = pce.color;

        var t = pce.type.charAt(1);
        switch (t) {
            case'k':
            {
                pieceElement.dataset.name = 'king';
            }
            case'q':
            {
                pieceElement.dataset.name = 'queen';
            }
            case'r':
            {
                pieceElement.dataset.name = 'rook';
            }
            case'n':
            {
                pieceElement.dataset.name = 'knight';
            }
            case'b':
            {
                pieceElement.dataset.name = 'bishop';
            }
            case'p':
            {
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
    
    makeMove: function (from, to) {
        
        var resObj = {
            done: false,
            hasMore: false,
            capture: null,
            error: null
        };
        
        if(from === to){
            resObj.done = true; //just drop the piece
            return resObj;
        }
        
        var obj = {
            from: from,
            to: to//,
                    //promotion : TODO - see chessjs doc LATER for how to use this field 
        };
        
        var result = this.internalGame.move(obj);
        var cap;
        if(result && result.captured){
            if(result.flags === 'e'){//en passant capture
                cap = this.enpassantCapturSquare(from, to);
            }else{
                cap = result.to;
            }
        }
        
        console.log(result);

        resObj.done = result ? true: false;
        resObj.capture = cap;
        resObj.error = !result ? 'Invalid move' : null;

        return resObj;
    },

    getInternalPiece: function (sqn) {
        return this.internalGame.get(sqn);
    },

    getBoardClass: function () {
        return 'game9ja-chess-board';
    },
    enpassantCapturSquare: function(from, to){
        var to_col = to.charAt(0);
        var from_rank = from.charAt(1);
        var en_pass_cap_sq = to_col + from_rank;
        return en_pass_cap_sq;
    }
};

/* global Main, Ns */


Ns.game.two.Chess2D = {

    extend: 'Ns.game.AbstractBoard2D',

    constructor: function () {

        var obj = {
            match: 'game/Match'
        };

        Main.rcall.live(obj);

    },

    getGamePostion: function () {
        return this.internalGame.fen();
    },

    createPieceElement: function (pce, piece_theme) {
        var pieceElement = document.createElement('img');
        pieceElement.src = '../resources/games/chess/2D/pieces/' + piece_theme + '/' + pce.color + pce.type + '.png';
        pieceElement.dataset.color = pce.color;

        switch (pce.type) {
            case'k':
            {
                pieceElement.dataset.name = 'king';
                break;
            }
            case'q':
            {
                pieceElement.dataset.name = 'queen';
                break;
            }
            case'r':
            {
                pieceElement.dataset.name = 'rook';
                break;
            }
            case'n':
            {
                pieceElement.dataset.name = 'knight';
                break;
            }
            case'b':
            {
                pieceElement.dataset.name = 'bishop';
                break;
            }
            case'p':
            {
                pieceElement.dataset.name = 'pawn';
                break;
            }
        }

        return pieceElement;
    },
    pieceSquarRatio: function () {
        return 0.8;
    },
    
    isWhiteTurn: function(){
        return this.internalGame.turn() === 'w';
    },

    isWhite: function (pce) {
        return pce.color === 'w';
    },

    notationToPath: function (notation) {
        var arr;
        if (notation.indexOf('-')) {
            arr = notation.split('-');
        } else {
            arr = notation.split('x');
        }
        return {from : arr[0], to : arr[1]};
    },

    makeMove: function (from, to) {

        var resObj = {
            done: false,
            hasMore: false,
            capture: null,
            error: null,
            notation: null,
            board_position: null
        };

        if (from === to) {
            resObj.done = true; //just drop the piece
            return resObj;
        }

        var obj = {
            from: from,
            to: to//,
                    //promotion : TODO - see chessjs doc LATER for how to use this field 
        };

        var result = this.internalGame.move(obj, {sloppy: true});
        var cap;
        if (result && result.captured) {
            if (result.flags === 'e') {//en passant capture
                cap = this.enpassantCapturSquare(from, to);
            } else {
                cap = result.to;
            }
        }

        console.log(result);

        resObj.notation = !result ? null : result.from + (cap ? 'x' : '-') + result.to;
        resObj.board_position = this.internalGame.fen();
        resObj.done = result ? true : false;
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
    enpassantCapturSquare: function (from, to) {
        var to_col = to.charAt(0);
        var from_rank = from.charAt(1);
        var en_pass_cap_sq = to_col + from_rank;
        return en_pass_cap_sq;
    }
};